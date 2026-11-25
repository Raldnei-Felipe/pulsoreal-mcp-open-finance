/** Local educational fixture only. Never contains real bank credentials. */
export type AccountKind = "liquid" | "debt";
export interface SandboxAccount {
  id: string;
  name: string;
  type: string;
  kind: AccountKind;
  balance: number | null;
  available: number | null;
  creditAvailable: number | null;
  creditLimit: number | null;
  currency: "USD";
}

export interface SandboxTransaction {
  id: string;
  name: string;
  account: string;
  amount: number;
  signedAmount: number | null;
  pending: boolean | null;
  date: string | null;
  currency: "USD";
}

export interface PlaidReadService {
  getAccounts(): Promise<readonly SandboxAccount[]>;
  getTransactions(): Promise<readonly SandboxTransaction[]>;
}

// Future server-side adapter targets; these are documentation, not active calls.
export const sandboxEndpoints = {
  baseUrl: "https://sandbox.plaid.com",
  accounts: { method: "POST", path: "/accounts/get" },
  transactions: { method: "POST", path: "/transactions/get" },
} as const;

export const sampleReference = {
  accounts: 14,
  transactions: 48,
  periodDays: 90,
  mode: "Demonstração Local (Etapa 1)",
} as const;

export const accounts: readonly SandboxAccount[] = [
  {
    id: "checking",
    name: "Plaid Checking",
    type: "Corrente",
    kind: "liquid",
    balance: 110,
    available: 100,
    creditAvailable: null,
    creditLimit: null,
    currency: "USD",
  },
  {
    id: "saving",
    name: "Plaid Saving",
    type: "Poupança",
    kind: "liquid",
    balance: 210,
    available: 200,
    creditAvailable: null,
    creditLimit: null,
    currency: "USD",
  },
  {
    id: "money-market",
    name: "Plaid Money Market",
    type: "Mercado monetário",
    kind: "liquid",
    balance: null,
    available: 43200,
    creditAvailable: null,
    creditLimit: null,
    currency: "USD",
  },
  {
    id: "cash-management",
    name: "Plaid Cash Management",
    type: "Gestão de caixa",
    kind: "liquid",
    balance: null,
    available: 12060,
    creditAvailable: null,
    creditLimit: null,
    currency: "USD",
  },
  {
    id: "credit-card",
    name: "Plaid Credit Card",
    type: "Cartão",
    kind: "debt",
    balance: 410,
    available: null,
    creditAvailable: null,
    creditLimit: null,
    currency: "USD",
  },
  {
    id: "business-card",
    name: "Plaid Business Credit Card",
    type: "Cartão empresarial",
    kind: "debt",
    balance: 5020,
    available: null,
    creditAvailable: 4980,
    creditLimit: null,
    currency: "USD",
  },
  {
    id: "student-loan",
    name: "Plaid Student Loan",
    type: "Empréstimo estudantil",
    kind: "debt",
    balance: 65262,
    available: null,
    creditAvailable: null,
    creditLimit: null,
    currency: "USD",
  },
  {
    id: "mortgage",
    name: "Plaid Mortgage",
    type: "Financiamento imobiliário",
    kind: "debt",
    balance: 56302.06,
    available: null,
    creditAvailable: null,
    creditLimit: null,
    currency: "USD",
  },
  {
    id: "auto-loan",
    name: "Plaid Auto Loan",
    type: "Financiamento de veículo",
    kind: "debt",
    balance: 23211.33,
    available: null,
    creditAvailable: null,
    creditLimit: null,
    currency: "USD",
  },
  {
    id: "heloc",
    name: "Plaid HELOC",
    type: "Crédito com garantia imobiliária",
    kind: "debt",
    balance: 13500.5,
    available: null,
    creditAvailable: 47647.5,
    creditLimit: null,
    currency: "USD",
  },
];

export const transactions: readonly SandboxTransaction[] = [
  {
    id: "uber",
    name: "Uber 072515 SFPOOL",
    account: "Plaid Checking",
    amount: 6.33,
    signedAmount: 6.33,
    pending: null,
    date: null,
    currency: "USD",
  },
  {
    id: "tectra",
    name: "Tectra Inc",
    account: "Plaid Credit Card",
    amount: 500,
    signedAmount: 500,
    pending: null,
    date: null,
    currency: "USD",
  },
  {
    id: "payment",
    name: "AUTOMATIC PAYMENT - THANK",
    account: "Plaid Credit Card",
    amount: 2078.5,
    signedAmount: null,
    pending: null,
    date: null,
    currency: "USD",
  },
  {
    id: "kfc",
    name: "KFC",
    account: "Plaid Credit Card",
    amount: 500,
    signedAmount: 500,
    pending: null,
    date: null,
    currency: "USD",
  },
  {
    id: "bicycle",
    name: "Madison Bicycle Shop",
    account: "Plaid Credit Card",
    amount: 500,
    signedAmount: 500,
    pending: null,
    date: null,
    currency: "USD",
  },
];

export const spendingPatterns = [
  { name: "Transferências de saída", observation: "Concentram o maior volume no período." },
  { name: "Alimentação e bebidas", observation: "Alta frequência no período." },
  { name: "Transporte / Uber", observation: "Repetição de gastos no período." },
] as const;

const sumCents = (values: readonly number[]) =>
  values.reduce((sum, value) => sum + Math.round(value * 100), 0) / 100;

export function getFinancialSummary(source: readonly SandboxAccount[] = accounts) {
  return {
    liquidity: sumCents(
      source
        .filter((account) => account.kind === "liquid")
        .map((account) => account.available ?? 0),
    ),
    debt: sumCents(
      source.filter((account) => account.kind === "debt").map((account) => account.balance ?? 0),
    ),
    creditAvailable: sumCents(
      source
        .filter((account) => account.kind === "debt")
        .map((account) => account.creditAvailable ?? 0),
    ),
  };
}

export function assessExpense(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0)
    throw new Error("Informe uma despesa positiva em USD.");
  const { liquidity } = getFinancialSummary();
  return {
    amount,
    liquidity,
    remaining: (Math.round(liquidity * 100) - Math.round(amount * 100)) / 100,
    coveredByLiquidity: amount <= liquidity,
    futureCommitmentsKnown: false,
  };
}

export function formatUSD(value: number | null) {
  return value === null
    ? "Não informado"
    : `US$ ${new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
}

export function transactionDirection(value: number | null) {
  if (value === null) return "Não informado";
  if (value > 0) return "Saída";
  if (value < 0) return "Entrada";
  return "Sem movimento";
}

export function groupTransactions(source: readonly SandboxTransaction[] = transactions) {
  return {
    confirmed: source.filter((item) => item.pending === false),
    pending: source.filter((item) => item.pending === true),
    unknown: source.filter((item) => item.pending === null),
  };
}

export const plaidService: PlaidReadService = {
  getAccounts: async () => accounts,
  getTransactions: async () => transactions,
};
