# PulsoReal — Etapa 1

## Resultado
Um painel financeiro em português brasileiro, centrado na conversa com Lena, com dados locais fictícios e sem conexão bancária real. A interface será criada após a aprovação deste plano.

## Interface
- Identidade com monograma PR, verde profundo, branco, cinza claro e detalhes esmeralda; apresentação confortável no computador e celular.
- Painel compacto sempre visível acima da conversa: termômetro de liquidez versus dívidas, com crédito disponível separado.
- Selo permanente “Ambiente de Demonstração • Dados Fictícios (Plaid Sandbox)” e modo “Demonstração Local (Etapa 1)”.
- Saudação da Lena exatamente como especificada e as cinco sugestões enviando perguntas reais para a conversa.
- Histórico de conversas, ação “Nova conversa” e navegação entre conversas. O local de armazenamento seguirá sua resposta à pergunta aberta.
- Campo fixo no rodapé, envio por Enter, quebra por Shift+Enter, mensagens vazias bloqueadas, indicador de resposta em andamento e recuperação de erros.
- Respostas com texto formatado, tabelas adaptadas ao celular, indicadores de status e barras simples.

## Dados e respostas
- Manter USD e apresentar valores ausentes como “Não informado”.
- Liquidez disponível das quatro contas informadas: **US$ 55.560,00** (100 + 200 + 43.200 + 12.060). Dívidas das seis contas informadas: **US$ 163.705,89**. Crédito disponível conhecido: **US$ 52.627,50**, nunca somado ao dinheiro.
- Mostrar as dez contas detalhadas no documento. Explicar que 14 contas e 48 transações em 90 dias são a referência do ensaio, não registros completos disponíveis nesta demonstração.
- Mostrar as cinco transações fornecidas e os três padrões qualitativos do período, sem inventar datas, frequências ou totais por categoria.
- Explicar que valores positivos na Plaid representam saídas e negativos representam entradas. Como o documento não traz sinal explícito para “AUTOMATIC PAYMENT - THANK”, datas ou situação de confirmação, apresentar esses campos como não informados; separar confirmadas e pendentes quando houver informação, sem atribuir estados fictícios.
- Para a despesa de US$ 150, comparar com a liquidez e mostrar saldo hipotético de **US$ 55.410,00**, destacando que compromissos futuros e vencimentos não foram informados; não emitir garantia de capacidade financeira.
- Perguntas fora do escopo recebem explicação transparente e sugestões válidas.

## Limite desta etapa
Lena terá respostas demonstrativas locais para consultas reconhecidas, identificadas como simulação, sem chamadas a modelos de IA, MCP ou APIs reais. Não haverá login, banco de dados remoto ou operações financeiras, salvo se você escolher armazenamento na conta — nesse caso, o plano de histórico precisará incluir Lovable Cloud.

## Organização técnica
- Separar dados e consultas em `src/services/plaidService.ts`, substituível por uma integração futura.
- Preparar os contratos de dados para `POST /accounts/get` e `POST /transactions/get` em `https://sandbox.plaid.com`; não executar essas chamadas nesta etapa nem solicitar credenciais no navegador.
- Cada conversa terá endereço próprio, com histórico isolado por conversa; armazenamento conforme a escolha respondida.
- Centralizar a identidade visual no sistema de estilos e compor o chat com os elementos apropriados de mensagens e entrada.
- Adicionar testes concretos para cálculos de liquidez, dívida, crédito, despesa de US$ 150, valores ausentes e convenção de sinais.

## Verificação e entrega
Verificar as cinco sugestões, perguntas fora do escopo, envio e carregamento, duas conversas sem mistura de mensagens e apresentação em computador e celular. Se o histórico for persistente, também verificar a restauração após atualizar a página. Entregar a prévia com um resumo do que funciona localmente e do que está apenas preparado para a Etapa 2.