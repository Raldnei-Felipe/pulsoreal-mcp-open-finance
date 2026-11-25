import type { ReplyKind } from "@/services/lenaService";
import {
  accounts,
  assessExpense,
  formatUSD,
  getFinancialSummary,
  groupTransactions,
  spendingPatterns,
  transactionDirection,
} from "@/services/plaidService";

export function FinancialResults({ kind, amount }: { kind: ReplyKind; amount: number | null }) {
  if (kind === "liquidity")
    return (
      <div className="data-result">
        <h3>Dinheiro disponível · USD</h3>
        {accounts
          .filter((account) => account.kind === "liquid")
          .map((account) => (
            <div className="account-bar" key={account.id}>
              <span>{account.name}</span>
              <strong className="money">{formatUSD(account.available)}</strong>
              <meter
                aria-label={`Participação de ${account.name} na liquidez`}
                min={0}
                max={getFinancialSummary().liquidity}
                value={account.available ?? 0}
              />
            </div>
          ))}
        <p className="data-note">
          Saldo e valor disponível são diferentes. Checking: saldo {formatUSD(110)}, disponível{" "}
          {formatUSD(100)}. Saving: saldo {formatUSD(210)}, disponível {formatUSD(200)}.
        </p>
      </div>
    );
  if (kind === "accounts")
    return (
      <div className="data-result">
        <h3>Liquidez · 4 contas</h3>
        <div className="data-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Conta</th>
                <th>Saldo</th>
                <th>Disponível</th>
              </tr>
            </thead>
            <tbody>
              {accounts
                .filter((account) => account.kind === "liquid")
                .map((account) => (
                  <tr key={account.id}>
                    <td>
                      {account.name}
                      <div className="text-muted-foreground">{account.type}</div>
                    </td>
                    <td className="money">{formatUSD(account.balance)}</td>
                    <td className="money">{formatUSD(account.available)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <h3>Dívidas e crédito · 6 contas</h3>
        <div className="data-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Conta</th>
                <th>Dívida</th>
                <th>Crédito disponível</th>
                <th>Limite total</th>
              </tr>
            </thead>
            <tbody>
              {accounts
                .filter((account) => account.kind === "debt")
                .map((account) => (
                  <tr key={account.id}>
                    <td>
                      {account.name}
                      <div className="text-muted-foreground">{account.type}</div>
                    </td>
                    <td className="money">{formatUSD(account.balance)}</td>
                    <td className="money">{formatUSD(account.creditAvailable)}</td>
                    <td>{formatUSD(account.creditLimit)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  if (kind === "transactions") {
    const groups = groupTransactions();
    return (
      <div className="data-result">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge">Confirmadas informadas: {groups.confirmed.length}</span>
          <span className="badge">Pendentes informadas: {groups.pending.length}</span>
          <span className="badge badge-warning">Status não informado: {groups.unknown.length}</span>
        </div>
        <div className="data-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transação / conta</th>
                <th>Valor USD</th>
                <th>Direção</th>
                <th>Data / status</th>
              </tr>
            </thead>
            <tbody>
              {[...groups.confirmed, ...groups.pending, ...groups.unknown].map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.name}
                    <div className="text-muted-foreground">{item.account}</div>
                  </td>
                  <td className="money">{formatUSD(item.amount)}</td>
                  <td>{transactionDirection(item.signedAmount)}</td>
                  <td>
                    {item.date ?? "Não informado"}
                    <div className="text-muted-foreground">
                      {item.pending === null
                        ? "Não informado"
                        : item.pending
                          ? "Pendente"
                          : "Confirmada"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="data-note">
          Referência: 48 transações em 90 dias. Apenas estes cinco registros foram fornecidos.
          Ausência de status não significa confirmação.
        </p>
      </div>
    );
  }
  if (kind === "patterns")
    return (
      <div className="data-result">
        {spendingPatterns.map((pattern, index) => (
          <div className="pattern-row" key={pattern.name}>
            <span className="pattern-number">0{index + 1}</span>
            <div>
              <strong>{pattern.name}</strong>
              <p className="text-muted-foreground mt-1">{pattern.observation}</p>
            </div>
            <span className="badge ml-auto self-start">Qualitativo</span>
          </div>
        ))}
        <p className="data-note">
          Período de 90 dias. Volumes, frequências numéricas e percentuais por categoria: Não
          informado.
        </p>
      </div>
    );
  if (kind === "expense" && amount !== null) {
    const result = assessExpense(amount);
    return (
      <div className="data-result">
        <span className={`badge ${result.coveredByLiquidity ? "badge-success" : "badge-warning"}`}>
          Simulação · sem operação bancária
        </span>
        <div className="expense-grid mt-3">
          <div>
            <p className="summary-label">Despesa hipotética</p>
            <p className="expense-amount">{formatUSD(amount)}</p>
          </div>
          <div>
            <p className="summary-label">Liquidez após despesa</p>
            <p className="expense-amount text-primary">{formatUSD(result.remaining)}</p>
          </div>
        </div>
        <p className="data-note">
          Dívidas preservadas: {formatUSD(getFinancialSummary().debt)}. Compromissos futuros: Não
          informado.
        </p>
      </div>
    );
  }
  return null;
}
