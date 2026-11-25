import type { UIMessage } from "ai";
import { assessExpense, formatUSD, getFinancialSummary } from "./plaidService";

export type ReplyKind = "liquidity" | "accounts" | "transactions" | "patterns" | "expense";
export type DemoMessage = UIMessage<
  unknown,
  { financial: { kind: ReplyKind; amount: number | null } }
>;

export const greeting =
  "Olá! Sou a Lena, sua copiloto financeira no PulsoReal. Antes de fechar um novo contrato ou investimento, o que você quer verificar no seu caixa?";
export const suggestions = [
  "Quanto tenho realmente livre hoje?",
  "Mostrar minhas contas e dívidas",
  "Ver minhas 5 transações mais recentes",
  "Analisar meus 3 padrões de gasto",
  "Posso assumir uma despesa de US$ 150 agora?",
] as const;

function reply(text: string, kind?: ReplyKind, amount: number | null = null): DemoMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    parts: kind
      ? [
          { type: "text", text },
          { type: "data-financial", data: { kind, amount } },
        ]
      : [{ type: "text", text }],
  };
}

/** Deterministic local demonstration, not an AI or Plaid API call. */
export function respondLocally(history: readonly DemoMessage[]): DemoMessage {
  const latest = history.filter((item) => item.role === "user").at(-1);
  const question =
    latest?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ") ?? "";
  const normalized = question
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const summary = getFinancialSummary();
  if (/^(oi|ola|bom dia|boa tarde|boa noite)[!.\s]*$/.test(normalized)) return reply(greeting);
  if (/transac|recentes/.test(normalized))
    return reply(
      "Estas são as **5 transações recentes fornecidas na amostra** de 90 dias. Datas, ordem cronológica e confirmação não foram informadas; portanto, não posso validar quais são as mais recentes do laboratório completo.\n\nNa Plaid, **valor positivo é saída e negativo é entrada**. O sinal de AUTOMATIC PAYMENT - THANK não foi informado.",
      "transactions",
    );
  if (/padro|gastos|categorias/.test(normalized))
    return reply(
      "Identifiquei **3 padrões qualitativos** descritos no ensaio de 90 dias. A amostra não fornece contagens nem valores consolidados por categoria — não vou estimá-los.",
      "patterns",
    );
  if (/despesa|assumir|posso|investir|comprar/.test(normalized)) {
    const match = normalized.match(/(?:us\$|usd|\$)\s*(\d+(?:[.,]\d{1,2})?)/);
    if (!match?.[1])
      return reply(
        "Posso comparar uma despesa com a liquidez fictícia disponível. Informe o valor em **USD**, por exemplo: ‘Posso assumir uma despesa de US$ 150 agora?’. Não tenho seus vencimentos ou compromissos futuros.",
      );
    const amount = Number(match[1].replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0)
      return reply("Informe um valor positivo em USD para a simulação.");
    const result = assessExpense(amount);
    return reply(
      `${result.coveredByLiquidity ? "A liquidez da amostra cobre esse valor" : "A liquidez da amostra não cobre esse valor"}. Após uma despesa hipotética de **${formatUSD(amount)}**, restariam **${formatUSD(result.remaining)}** em dinheiro disponível.\n\n**Isso não é uma autorização para gastar.** Não conheço vencimentos, renda futura, reservas necessárias ou compromissos já assumidos. As dívidas permanecem separadas e exigem atenção.`,
      "expense",
      amount,
    );
  }
  if (/contas|dividas|credito|emprestimos/.test(normalized))
    return reply(
      "Vamos separar o que é seu dinheiro do que é obrigação ou crédito. A demonstração contém **10 contas detalhadas**; o ensaio de referência consultou 14 contas. Os outros quatro registros não foram fornecidos.\n\n**Crédito disponível não é patrimônio.** Limites totais não informados permanecem como ‘Não informado’.",
      "accounts",
    );
  if (/livre|liquidez|disponivel|caixa|saldo/.test(normalized))
    return reply(
      `Você tem **${formatUSD(summary.liquidity)} de liquidez disponível** nas quatro contas com dinheiro. Esse valor não inclui cartões, empréstimos nem crédito disponível.\n\nNão posso dizer que todo esse dinheiro está ‘livre para gastar’: compromissos futuros e vencimentos não foram informados. Há **${formatUSD(summary.debt)} em dívidas** na amostra.`,
      "liquidity",
    );
  return reply(
    "Essa pergunta vai além dos dados disponíveis nesta **Demonstração Local (Etapa 1)**. Não tenho dados bancários reais, renda futura, vencimentos, contratos ou informações externas.\n\nPosso mostrar suas contas e dívidas, a liquidez da amostra, as cinco transações fornecidas, três padrões qualitativos de gasto ou simular uma despesa em USD. Não realizo pagamentos, transferências ou contratação de crédito.",
  );
}
