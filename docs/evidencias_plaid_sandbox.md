# Evidências da Consulta — Plaid Sandbox (MCP)

> **Aviso de Transparência:** Todos os registros abaixo são fictícios, obtidos exclusivamente do ambiente de testes (`https://sandbox.plaid.com`) via Model Context Protocol (MCP). Nenhuma credencial (`PLAID_CLIENT_ID`, `PLAID_SECRET` ou `access_token`) foi exposta.

---

## 1. Contas de Depósito e Liquidez (`/accounts/get`)

*Nota: Os valores disponíveis são os reportados pela API; o saldo disponível do Certificado de Depósito (CD) retornou nulo (`Não informado`).*

| Conta | Tipo | Saldo atual | Disponível | Moeda |
| :--- | :--- | ---: | ---: | :---: |
| Plaid Checking | Depósito — conta corrente | USD 110,00 | USD 100,00 | USD |
| Plaid Saving | Depósito — poupança | USD 210,00 | USD 200,00 | USD |
| Plaid CD | Depósito — certificado de depósito | USD 1.000,00 | Não informado | USD |
| Plaid Money Market | Depósito — mercado monetário | USD 43.200,00 | USD 43.200,00 | USD |
| Plaid HSA | Depósito — HSA | USD 6.009,00 | USD 6.009,00 | USD |
| Plaid Cash Management | Depósito — gestão de caixa | USD 12.060,00 | USD 12.060,00 | USD |

* **Disponível conhecido nessas contas de depósito:** **USD 61.569,00** (soma dos valores disponíveis informados; exclui o CD).

---

## 2. Investimentos (`/accounts/get`)

*Nota: Contas de aposentadoria e investimento não são contabilizadas como liquidez imediata.*

| Conta | Tipo | Saldo atual | Disponível | Moeda |
| :--- | :--- | ---: | ---: | :---: |
| Plaid IRA | Investimento — IRA | USD 320,76 | Não informado | USD |
| Plaid 401k | Investimento — 401(k) | USD 23.631,9805 | Não informado | USD |

---

## 3. Dívidas e Linhas de Crédito (`/accounts/get`)

*Nota: Em cartões e empréstimos, o saldo atual reportado representa dívida, e o valor disponível reportado refere-se ao crédito remanescente (não ao limite total).*

| Conta | Tipo | Saldo atual reportado | Disponível reportado | Moeda |
| :--- | :--- | ---: | ---: | :---: |
| Plaid Credit Card | Crédito — cartão | USD 410,00 | Não informado | USD |
| Plaid Business Credit Card | Crédito — cartão empresarial | USD 5.020,00 | USD 4.980,00 | USD |
| Plaid Student Loan | Empréstimo estudantil | USD 65.262,00 | Não informado | USD |
| Plaid Mortgage | Financiamento imobiliário | USD 56.302,06 | Não informado | USD |
| Plaid Auto Loan | Financiamento automotivo | USD 23.211,33 | Não informado | USD |
| Plaid Home Equity Line of Credit | Crédito imobiliário (HELOC) | USD 13.500,50 | USD 47.647,50 | USD |

---

## 4. Cinco Transações Mais Recentes (`/transactions/get`)

*Nota: Na API da Plaid, valores positivos representam saídas (débitos/compras) e valores negativos representam entradas.*

| Data | Descrição | Valor | Conta | Situação |
| :---: | :--- | ---: | :--- | :---: |
| 25/11/2026 | United Airlines | USD 500,00 | Plaid Credit Card | Confirmada |
| 23/11/2026 | Uber 072515 SFPOOL | USD 6,33 | Plaid Checking | Confirmada |
| 20/11/2026 | Tectra Inc | USD 500,00 | Plaid Credit Card | Confirmada |
| 19/11/2026 | AUTOMATIC PAYMENT - THANK | USD 2.078,50 | Plaid Credit Card | Confirmada |
| 19/11/2026 | KFC | USD 500,00 | Plaid Credit Card | Confirmada |