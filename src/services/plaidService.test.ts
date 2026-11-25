import { describe, expect, it } from "vitest";
import {
  accounts,
  assessExpense,
  formatUSD,
  getFinancialSummary,
  groupTransactions,
  transactionDirection,
  transactions,
} from "./plaidService";

describe("Sandbox financial rules", () => {
  it("counts only available cash, not balances or borrowed credit", () => {
    expect(getFinancialSummary().liquidity).toBe(55560);
    expect(getFinancialSummary(accounts.filter((item) => item.kind === "debt")).liquidity).toBe(0);
  });
  it("sums the six specified debts separately", () => {
    expect(getFinancialSummary().debt).toBe(163705.89);
  });
  it("keeps known available credit out of cash", () => {
    expect(getFinancialSummary().creditAvailable).toBe(52627.5);
  });
  it("assesses USD 150 without claiming future obligations are known", () => {
    expect(assessExpense(150)).toEqual({
      amount: 150,
      liquidity: 55560,
      remaining: 55410,
      coveredByLiquidity: true,
      futureCommitmentsKnown: false,
    });
  });
  it("preserves the original USD amount and null values", () => {
    expect(formatUSD(110)).toBe("US$ 110,00");
    expect(formatUSD(null)).toBe("Não informado");
  });
  it("interprets positive Plaid values as outgoing", () => {
    expect(transactionDirection(6.33)).toBe("Saída");
  });
  it("interprets negative Plaid values as incoming", () => {
    expect(transactionDirection(-6.33)).toBe("Entrada");
  });
  it("does not invent the payment direction", () => {
    expect(transactions.find((item) => item.id === "payment")?.signedAmount).toBeNull();
    expect(transactionDirection(null)).toBe("Não informado");
  });
  it("keeps unspecified confirmation status separate from pending and confirmed", () => {
    const groups = groupTransactions();
    expect(groups.confirmed).toHaveLength(0);
    expect(groups.pending).toHaveLength(0);
    expect(groups.unknown).toHaveLength(5);
  });
  it("rejects invalid expense amounts", () => {
    expect(() => assessExpense(0)).toThrow();
    expect(() => assessExpense(Number.NaN)).toThrow();
    expect(assessExpense(55561).coveredByLiquidity).toBe(false);
  });
});
