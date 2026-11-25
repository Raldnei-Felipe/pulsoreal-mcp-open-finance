# PulsoReal — Copiloto de Decisão Financeira com MCP & Open Finance

> **Aviso de Transparência:** Este projeto é um protótipo educacional desenvolvido para o desafio da DIO (*MCP sem complicação: Open Finance com Pluggy e Plaid Sandbox*). Todos os dados bancários exibidos são **fictícios**, provenientes exclusivamente do ambiente de testes **Plaid Sandbox**. Nenhuma transação real ou operação bancária de escrita é executada.

🔗 **App Publicado:** [Acesse o PulsoReal + Lena aqui](https://pulsoreal-lena.lovable.app)

---

## 1. Proposta de Inovação: Onde o Cliente Já Está (Embedded Finance)

Em vez de criar "mais um aplicativo de banco genérico" onde o usuário precisa sair da sua rotina para consultar extratos, o **PulsoReal** aplica o conceito de **Embedded Finance (Finanças Embutidas)**:

- **Contexto:** O usuário (profissional autônomo ou MEI) já está dentro do seu painel de **gestão de projetos e contratos** avaliando se pode assumir uma nova despesa ou investir em equipamentos.
- **O Papel da Lena (Assistente):** A copiloto financeira traduz registros bancários brutos em pareceres claros de liquidez, separando rigorosamente **dinheiro livre em conta** de **dívidas de cartão e limites de crédito**, evitando decisões baseadas em ilusão de saldo.

---

## 2. Como o Projeto Foi Construído (Arquitetura Ponta a Ponta)

O **Model Context Protocol (MCP)** atuou como a ponte padronizada entre o agente de IA no VS Code e as fontes financeiras externas durante a fase de engenharia e extração:

text
Pergunta do Usuário (Linguagem Natural)
│
├──► [MCP Pluggy Docs (HTTP Remoto)] ──► Consulta conceitos (Item / Conta / Transação) e endpoints Open Finance
│
└──► [MCP Plaid Sandbox (STDIO Local)] ─► Cria Item de teste e obtém access_token em ambiente isolado
│
▼
API Plaid Sandbox (POST /accounts/get e POST /transactions/get)
│
▼
Saneamento Contábil & Interface PulsoReal (Lena)


### Etapas de Execução:
1. **Conexão Documental (Pluggy MCP):** Integração via transporte HTTP remoto (`https://mcp.pluggy.ai/mcp`) para validar a hierarquia Open Finance (`Item > Conta > Transação`) e regras de paginação.
2. **Conexão Transacional (Plaid Sandbox MCP):** Execução local via `uv` (`mcp-server-plaid`) comunicando-se exclusivamente com `https://sandbox.plaid.com` para criação de Item de teste e consulta de saldos e movimentações.
3. **Saneamento e Regras de Negócio:** Tratamento da semântica da API Plaid (onde **valores positivos representam saídas** e **valores negativos representam entradas**), preservação da moeda original (`USD`), exibição de campos nulos como `"Não informado"` e separação contábil entre liquidez e passivos.
4. **Prototipação Orientada a Especificação (SDD / OpenSpec):** Construção da interface conversacional **PulsoReal + Lena** no Lovable (Etapa 1 com amostra real do Sandbox isolada em camada de serviço), seguida de publicação e sincronização com este repositório.

---

## 3. Configuração dos Servidores MCP (Ambiente Windows / VS Code)

Para reproduzir a integração local sem expor credenciais no repositório, utiliza-se `.vscode/mcp.json` (mantido fora do versionamento via `.gitignore`):

json
{
"servers": {
"pluggy": {
"type": "http",
"url": "https://mcp.pluggy.ai/mcp"
},
"plaid": {
"type": "stdio",
"command": "C:\Users\SEU_USUARIO\.local\bin\mcp-server-plaid.exe",
"env": {
"PLAID_CLIENT_ID": "SEU_CLIENT_ID_SANDBOX",
"PLAID_SECRET": "SEU_SECRET_SANDBOX"
}
}
}
}


### Desafio Técnico Resolvido na Instalação
Durante a configuração do servidor local `mcp-server-plaid` via `uv`, identificou-se uma falha de importação (`BeaconReportListRequest`) na versão `plaid-python==47.0.0`. O ambiente foi estabilizado fixando `plaid-python==46.0.0` e apontando o `mcp.json` diretamente para o executável compilado localmente.

---

## 4. Resumo das Evidências Extraídas (Plaid Sandbox)

A consulta ao laboratório da Plaid retornou **14 contas** e **48 transações** no recorte de 90 dias, consolidando:
- **Liquidez disponível conhecida em depósitos:** `US$ 61.569,00` (Checking, Saving, Money Market, HSA e Cash Management; excluindo CD cujo saldo disponível retornou nulo e investimentos IRA/401k).
- **Passivos e dívidas acumuladas:** `US$ 163.705,89` (somando cartões de crédito e empréstimos estudantil, imobiliário, automotivo e HELOC — exibidos separadamente para nunca serem confundidos com patrimônio).
- **3 Padrões de Movimentação Identificados:** Concentração de volume financeiro em transferências de saída, alta frequência em alimentação/bebidas e recorrência de microtransações de transporte (Uber).

---

## 5. Evolução Implementada e Próximos Passos

- **Etapa 1 (Concluída e Publicada):** Painel com **Termômetro de Liquidez Real vs. Dívidas**, simulador de impacto de despesas no caixa do autônomo/MEI, histórico de conversas no navegador e camada de dados isolada preparada para evolução.
- **Etapa 2 (Roadmap Futuro):** Criação de backend dedicado para chamadas em tempo real a `https://sandbox.plaid.com`, mantendo `PLAID_CLIENT_ID`, `PLAID_SECRET` e `PLAID_ACCESS_TOKEN` exclusivamente em variáveis de ambiente do servidor.

---

## Como Rodar Localmente

bash
git clone https://github.com/Raldnei-Felipe/pulsoreal-mcp-open-finance.git
cd pulsoreal-mcp-open-finance
npm install
npm run dev
