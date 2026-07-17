# Auditoria de Copy + Métricas — Portal do Cliente Digital Pampas — 2026-07-16

**Escopo:** 6 telas (login, Overview, Campaigns, Campaign Detail, Replies, Reports), produção `digital-pampas-portal.vercel.app`, dados mock.
**Fontes de verdade cruzadas:** `auditoria-site/2026-07-16/01-inventario.md`, `capturas/*.png`, `src/data/portalMock.ts`, `src/data/types.ts`, `src/lib/format.ts`, componentes em `src/components/` e `src/pages/`.
**Nota de calibragem:** app logado sem funil de venda — o Teste da Faca e a Matriz de Tensão foram aplicados no modo "produto": a "conversão" é confiança via transparência, então a régua de cada seção é *"isso responde uma pergunta real do cliente sem gerar dúvida nova?"*. Aqui, **métrica incoerente é a pior copy possível** — a promessa da marca é "the numbers speak (but only the true ones)".

---

## Teste da Faca de Seções (por página)

| Página | Seção | P/R | Motivo (1 linha) |
|---|---|---|---|
| Login | Heading "Client Portal" + "> Your pipeline. Live." | P | Diz o que é e a promessa em 6 palavras; tom terminal coerente com a marca |
| Login | "Trouble signing in? hello@..." | P | Rota de socorro clara, sem burocracia |
| Login | Bloco "DEMO CREDENTIALS" | P (demo) | Necessário para o case; deve sumir com backend real |
| Overview | Campaign status (steppers) | P | Responde a pergunta nº 1 do cliente ("em que fase estamos?") antes de qualquer número — ordem certa |
| Overview | Results (4 KPIs) | **R** | Os valores passam, mas os **deltas são falsos** (MET-05) — a seção hoje gera dúvida em vez de remover |
| Overview | Activity & responses (30d) | **R** | Título promete 30d e entrega ~90d (MET-03); soma do gráfico não bate com nenhum total (MET-06) |
| Overview | Reply breakdown | **R** | O "TOTAL REPLIES" contradiz Campaigns e Reports (MET-01) |
| Overview | Channels | P | Métricas certas por canal; ressalvas na badge "UNDER 2%" (MET-07) e status "Active" hardcoded (MET-08) |
| Overview | Latest interested replies | P | Prova concreta (nomes, cargos, citações) — a melhor seção do produto |
| Campaigns | Cards com stats | **R** | "EMAILS SENT 12.4K · REPLIES 583" mistura denominadores no mesmo card (MET-01) |
| Campaign Detail | Timeline Planned/Actual + deliverables | P | Transparência exemplar: mostra atraso real (planned 06-28, actual 06-30) sem esconder |
| Campaign Detail | Qualification (Clay) | P | Funil com percentuais corretos (85%, 33% conferem com o mock) |
| Replies | Tabs + tabela | **R** | Contadores (All 17 / Interested 7) contradizem o donut (139 / 37) da tela anterior (MET-02) |
| Reports | Tabela de snapshots | **R** | "June 2026" com sub-rótulo "May 31 – Jun 29" se contradiz na mesma célula (MET-04) |

**Ordem das seções:** passa. Overview segue fase → resultado → atividade → prova; Detail segue timeline → resultado → operação → replies. A progressão narrativa existe e é a correta para um dashboard.

## Matriz de Tensão

| Página | Seção | Nível atual | Nível correto | Diagnóstico |
|---|---|---|---|---|
| Login | Hero/tagline | 1 (Bonito) | 1 | Correto: é o único momento aspiracional do produto |
| Overview | Campaign status | 2 (Claro) | 2 | Correto |
| Overview | Results | 1 (parece claro, é decorativo) | 2 | Deltas idênticos e sem definição de período viram ornamento — precisam virar informação verificável |
| Detail | Timeline | 2–3 | 2–3 | Nomeia atraso sem anestesia (Planned vs Actual) — nível certo, manter |
| Reports | Tabela | 2 | 2 | Certo em intenção; quebrado em execução de datas |

Diagnóstico geral: o produto **não** trava no nível 1 — raro e ótimo. O problema é o nível 2 ("Claro") com rachaduras numéricas.

---

## O que está BOM e deve ser MANTIDO

- **"> Your pipeline. Live."** — MANTER. Proposta de valor em 4 palavras, no viewport, no tom da marca; o prompt `>` amarra com a estética terminal sem custo de leitura.
- **Timeline com "Planned" vs "Actual"** (ex.: LinkedIn Integration planned 06-28, actual 06-30) — MANTER e proteger. É a materialização literal do "no black box": mostra o atraso de 2 dias em vez de escondê-lo.
- **Badge "EXPORT IS A DEMO"** (`ReportsPage.tsx:110`) — MANTER o padrão. Honestidade sobre limitação de demo é exatamente a persuasão legítima que o produto vende. (Estender esse padrão ao resto do demo — ver MET-13.)
- **Empty state "No replies match this filter. When the campaign is in warm-up, replies take a little time to arrive."** (`RepliesTable.tsx:121`) — MANTER. Não só constata o vazio: explica o mecanismo e gerencia expectativa.
- **"Settings · soon"** — MANTER. Anuncia o que não existe sem fingir que existe.
- **"Invalid email or password"** + "Trouble signing in? hello@digitalpampas.com" — MANTER. Erro genérico é a prática correta de segurança e a rota de socorro está a uma linha de distância.
- **Matemática de agregação** ("All campaigns") — MANTER a implementação. Conferido: 13.1K = 12 430+640; reply rate 4.1% = média ponderada correta (54 190/13 070 = 4,15); bounce 1.1%; domain reputation 92 = ponderado. O `aggregateSnapshots` em `portalMock.ts:534` está certo — o problema está nos dados de entrada, não na conta.
- **Zero marketese.** O texto inteiro do portal não tem uma única palavra promocional vazia — situação rara, registrada como mérito.

---

## Achados — A) Métricas

### [SEV 4] MET-01 — O mesmo "Replies" da Q3 vale 583, 123 e 402 — Campaigns / Overview / Reports
- **Trecho atual (citado):** Campaigns: "REPLIES **583**" · Overview (Q3): "**123** TOTAL REPLIES" · Reports (June): "**402**". EMEA tem a versão menor do mesmo bug: card "REPLIES **20**" vs donut "**16**".
- **Critério violado:** coerência numérica entre telas — mesma label, mesma entidade, três valores.
- **Evidência e causa-raiz:**
  1. **583** = `email.totalReplies` (522) + `linkedin.totalReplies` (61) — soma em `src/components/campaign/CampaignCard.tsx:51-52`. Vida inteira, ambos os canais.
  2. **123** = `replies.interested + notNow + notInterested` (34+21+68) do snapshot (`portalMock.ts:362`) — só replies *categorizadas*. **O mock é a causa:** 522 replies de email existem mas só 123 categorizadas (gap de 460, implausível); ABM coincide (68=68); EMEA 20 vs 16 — o dataset não decidiu se breakdown ⊆ total ou breakdown = total.
  3. **402** = `reports[rep-q3-jun].totalReplies` (`portalMock.ts:484`) — recorte mensal, **só email**: 402 (jun) + 118 (mai) = 520 ≈ 522. Os 61 replies de LinkedIn não entram em relatório nenhum.
- **Por que mina o "no black box":** o cliente que compara a lista com o donut conclui: ou a agência não sabe somar, ou esconde 460 respostas. As duas matam a tese do produto.
- **Correção proposta (valores calculados):** adotar o invariante **"toda reply é categorizada"** e alinhar o mock:
  - `cmp-q3-us` → `replies: { interested: 163, notNow: 99, notInterested: 321 }` (soma 583, preserva proporções 28/17/55);
  - `rep-q3-jun` → `totalReplies: 463` (com 118 de maio + 2 de 1º/jul, fecha 583);
  - `cmp-emea` → `replies: { interested: 4, notNow: 5, notInterested: 11 }` (soma 20 — bate com card e report);
  - donut da Acme "All campaigns" passa a mostrar **603** e tudo cruza.
  - Alternativa mínima: renomear labels para escopos explícitos — card: "Replies (all time, all channels)"; donut: "Categorized replies"; report: "Email replies (month)". Funciona, mas três nomes para "replies" é pior UX do que um número consistente.
- **Bônus no mesmo card:** "EMAILS SENT 12.4K" (só email) ao lado de "REPLIES 583" (email+LinkedIn) induz um reply rate de 4,7% que não existe. Com o invariante acima, trocar a stat do card para replies só de email (522) ou renomear para "Sent (all channels)".
- **Confiança:** alta (causa localizada linha a linha).

### [SEV 4] MET-05 — Os deltas dos KPIs são falsos: três cards exibem o mesmo número, e nenhum mede o que a label diz — Overview e Campaign Detail / Results
- **Trecho atual (citado):** "Meetings booked 14 **↓4%** · Opportunities 9 **↓4%** · Pipeline value $95K **↑4%** · Interested replies 37 **↓4%**" (padrão em toda tela: Q3 = 6/6/2/6; EMEA = 20/20/24/20; ABM = 2/2/1/2).
- **Critério violado:** veracidade — "falsa precisão" (número específico que não mede o que afirma medir é pior que número nenhum).
- **Evidência e causa-raiz:** `src/components/metrics/KpiRow.tsx:31,42,66` — os cards **Meetings booked, Opportunities e Interested replies reusam o mesmo `repliesTrend.delta`** (tendência da série diária de *replies de email*, 12d vs 12d, `kpi.ts:15`); Pipeline usa a série de *envios*. O sparkline dentro de "Meetings booked" também é a série de replies. O "↓4%" sob "Meetings booked" não tem relação nenhuma com meetings.
- **Por que mina o produto:** número inventado ao lado da métrica mais importante do cliente ("quantas reuniões?"). Os 4 deltas idênticos entregam o problema; a credibilidade de todos os outros números desaba junto.
- **Correção proposta:** (a) remover delta e sparkline dos cards sem série própria (honestidade > enfeite); (b) manter delta apenas em "Interested replies"; (c) com série real por KPI, reintroduzir com rótulo de período visível: "vs. prior 12 days". Nunca delta sem período de comparação.
- **Confiança:** alta.

### [SEV 3] MET-03 — "(30d)" no título de um gráfico de ~90 dias — todas as telas com gráfico
- **Trecho atual:** "Activity & responses (30d)" — eixo x: 2026-04-03 → 2026-07-01.
- **Causa-raiz:** título hardcoded em `src/components/metrics/ActivityChart.tsx:11`; `useMergedSeries` (`src/lib/useSeries.ts`) entrega a série inteira de 90 dias sem recorte. Bug de **label**, não de dado.
- **Correção proposta:** fatiar `points.slice(-30)` antes de plotar (mantém "(30d)") — recomendado; ou renomear para "(90d)"/"since start".
- **Confiança:** alta.

### [SEV 3] MET-04 — "June 2026" com período "May 31 – Jun 29, 2026": off-by-one de timezone — Reports
- **Trecho atual:** "June 2026 / May 31, 2026 – Jun 29, 2026" e "May 2026 / Apr 30, 2026 – May 30, 2026" (`reports-desktop.png`).
- **Causa-raiz:** mock diz `periodStart: '2026-06-01'` (`portalMock.ts:484`). `formatLongDate` (`src/lib/format.ts:37`) faz `new Date('2026-06-01')` — date-only é parseada como **meia-noite UTC** — e renderiza com `toLocaleDateString` no fuso local (UTC−3) → volta um dia. *Off-by-one de timezone*: parse em UTC, render em local. O bug muda conforme o fuso de quem olha.
- **Correção proposta:** em `formatLongDate`/`formatShortDate`, `timeZone: 'UTC'` nas options quando a entrada for date-only (ou parse local `new Date(y, m-1, d)`). Resultado: "June 2026 / Jun 1, 2026 – Jun 30, 2026".
- **Confiança:** alta (mecanismo confirmado; reproduz com UTC−3).

### [SEV 3] MET-02 — Donut diz 139 replies (37 interested); a tela Replies diz 17 (7 interested) — Overview ↔ Replies
- **Trecho atual:** Overview: "**139** TOTAL REPLIES — Interested **37**" e KPI "Interested replies **37**"; Replies (mesmo escopo): "All **17** · Interested **7**".
- **Causa-raiz:** snapshots agregados carregam contagens (139) mas o inbox mock tem só ~25 `LeadReply` (`portalMock.ts:451-479`) — 17 da Acme. Duas fontes nunca conciliadas.
- **Por que mina:** o "View all →" promete as 37 interested do donut e entrega 7. Quebra de *message match* interno.
- **Correção proposta:** enquanto mock, rotular o escopo do inbox: subtítulo de Replies → **"Acme Co. · All campaigns · showing the 17 most recent"**; no Overview, "View all →" → **"View recent →"**. Com Supabase: contadores das tabs = breakdown do donut, sempre.
- **Confiança:** alta no diagnóstico; média na melhor correção.

### [SEV 3] MET-13 — "Last sync: 2h ago" congelado em um relógio fictício — todas as telas
- **Trecho atual:** "Last sync: 2h ago" (dot verde), com dados terminando em 2026-07-01.
- **Causa-raiz:** `DEMO_NOW = '2026-07-02T00:00:00Z'` em `src/lib/format.ts:47` — todos os relativos calculados contra instante fixo.
- **Por que mina:** **alegação de frescor falsa.** Prospect abre o demo hoje e vê "sincronizado há 2h" ao lado de gráfico que acaba há 15 dias — no produto que vende "números verdadeiros".
- **Correção proposta:** badge persistente **"DEMO DATA"** no topbar ou junto ao Last sync ("Last sync: 2h ago · demo dataset"). Alternativa elegante: ancorar `DEMO_NOW` em `new Date()` e deslocar as datas do dataset dinamicamente — demo perpetuamente "fresco" e honesto.
- **Confiança:** alta.

### [SEV 3] MET-08 — Badge "Active" do LinkedIn é hardcoded — Overview e Detail / card LinkedIn
- **Causa-raiz:** `src/components/metrics/ChannelCards.tsx:101` — `<Badge variant="primary">Active</Badge>` fixo no JSX. Se a campanha pausar, continuará "Active".
- **Por que mina:** indicador de status que não lê status = black box com fantasia de transparência. O card Email ao lado deriva "Ready/Warming" de `warmupStatus` real — o padrão certo já existe.
- **Correção proposta:** derivar de `campaign.state` ou campo próprio do canal; enquanto não houver, remover o badge (ausência honesta > presença falsa).
- **Confiança:** alta.

### [SEV 2] MET-07 — "UNDER 2%": selo de meta que se comporta como enfeite — Overview e Details / Bounce rate
- **Trecho atual:** "BOUNCE RATE 1.1% [UNDER 2%]".
- **Semântica:** `types.ts:84` define a intenção ("Target < 2. Earns a ✓ seal when met") e `ChannelCards.tsx:27,49` só renderiza o badge quando `bounceRatePct < 2`. É selo de **meta atingida** — mas lê como segundo valor solto; e **quando a meta estourar, o badge some** sem alerta. O sistema celebra e nunca avisa — assimetria anti-transparência. (Overlap visual com "Deliverability" fica com UI.)
- **Correção proposta:** chip sempre visível, com estado: verde **"✓ under 2% target"** quando cumprido; âmbar/vermelho **"above 2% target"** quando não. A palavra "target" desambigua meta de estado.
- **Confiança:** alta.

### [SEV 2] MET-06 — A soma do gráfico diário não fecha com nenhum total exibido — Overview / Activity
- **Evidência:** séries geradas por `buildSeries()` (`portalMock.ts:435-446`) **independentes** dos snapshots. Estimativa para a Q3: série de replies soma ~850-880 em 90 dias — contra 583 lifetime e 522 de email; série de envios ~19-20K contra 12,4K. O gráfico publica tabela acessível de 90 linhas no DOM — qualquer cliente diligente pode somar.
- **Correção proposta:** no gerador do mock, normalizar cada série para `Σ points = total` do snapshot (gerar, somar, escalar).
- **Confiança:** média (estimativa analítica; verifier pode somar a tabela do JSON).

### [SEV 2] MET-09 — Botão "PDF" que baixa um CSV — Reports / coluna Export
- **Causa-raiz:** `ReportsPage.tsx:12-32` — `exportReportCsv` sempre gera `.csv`, botão exibe `r.format.toUpperCase()` ("PDF").
- **Correção proposta:** enquanto demo, rotular pelo que faz: **"CSV"** (ou "Export · demo"). CTA descreve o que acontece após o clique.
- **Confiança:** alta.

### [SEV 2] MET-10 — Gauges com unidades invisíveis e diferentes — Overview e Details / card Email
- **Evidência:** gauge "**98** DELIVERABILITY" (percentual) e "**92** DOMAIN REPUTATION" (score 0-100), visualmente idênticos (`types.ts:86-88`). Aria-label "98 of 100" para ambos — para deliverability é semanticamente errado.
- **Correção proposta:** exibir **"98%"** no Deliverability e **"92/100"** no Domain reputation (valor e aria-label).
- **Confiança:** alta.

### [SEV 1] MET-11 — "1.2K" para 1.180 convites — Campaigns/Detail Northwind
- **Evidência:** `formatCompact` (`format.ts:4`) compacta a partir de 1.000 — o docstring prometia "1180 → 1,180" e o código faz "1.2K". Com 4 dígitos, compactar esconde precisão de graça.
- **Correção proposta:** compactar só a partir de 10.000 (`n >= 10000`). "12.4K" continua compacto; "1,180" volta exato.
- **Confiança:** alta.

### [SEV 1] MET-12 — Report semanal sobreposto ao mensal soma em dobro — Reports (Northwind)
- **Evidência:** `rep-abm-w26` ("Week of Jun 23", 18 replies) contido em `rep-abm-jun` (61) — `portalMock.ts:486-487`. Somar a coluna conta 18 duas vezes.
- **Correção proposta:** indentar/agrupar a linha semanal sob o mês, ou sufixar: "Week of Jun 23 *(included in June)*".
- **Confiança:** alta (dado no mock; render Northwind não capturado).

### [SEV 1] MET-14 — "WARMING" no agregado quando a campanha principal está "READY" — Overview Acme · All
- **Evidência:** regra em `portalMock.ts:581` — qualquer campanha warming faz o agregado inteiro dizer WARMING.
- **Correção proposta:** no escopo "All campaigns", badge **"1 of 2 warming"** (informativo) em vez do estado binário.
- **Confiança:** média (decisão de produto, não erro).

## Achados — B) Copy / Microcopy

### [SEV 3] COPY-01 — Dois dropdowns sem rótulo visível: cliente e campanha são indistinguíveis — topbar, todas as telas
- **Trecho atual:** triggers exibem só os valores — "Acme Co. ⌄" e "All campaigns ⌄". Rótulo existe só para leitores de tela (`aria-label` — `ClientSelector.tsx:30`, `CampaignSelector.tsx:32`).
- **Evidência de que confunde:** a própria dona do produto (Ste) confundiu os dois. Pior caso: com campanha selecionada, o par vira "Acme Co." + "Q3 Outbound — US Market" — dois nomes próprios lado a lado, sem âncora.
- **Reescrita proposta:** rótulo visível no trigger, padrão "eyebrow + valor": `CLIENT · Acme Co. ⌄` e `CAMPAIGN · All campaigns ⌄`. Ícones ajudam mas não substituem texto.
- **Confiança:** alta.

### [SEV 2] COPY-02 — "Replies" vs "responses" vs "Meetings" vs "Meetings booked": vocabulário sem dono — várias telas
- **Trechos:** gráfico "Activity & **responses**" vs. resto do produto usando "**Replies**". KPI "**Meetings booked**" vs. "**MEETINGS**" (card/coluna). "**Acceptance**" (LinkedIn) vs. "... rate" nos vizinhos.
- **Reescrita proposta:** gráfico → **"Activity & replies (30d)"**; manter **"Meetings booked"** como termo canônico (alinha com o site de marketing); LinkedIn → **"Acceptance rate"**.
- **Confiança:** alta.

### [SEV 2] COPY-03 — Coluna "Channel" comunica só por ícone, e o ícone de email não aparece — Replies
- **Evidência:** `RepliesTable.tsx:41-49` renderiza só `<ChannelIcon>`; na captura, só 3 de 17 linhas mostram glifo. Coluna inteira "vazia" para o leitor.
- **Reescrita proposta:** ícone + texto — "✉ Email" / "in LinkedIn" (como `CampaignCard.tsx:62-71` já faz). Resolve legibilidade e imuniza contra o bug do ícone.
- **Confiança:** alta.

### [SEV 1] COPY-04 — `<title>` único "Client Portal · Digital Pampas" para todas as rotas
- **Reescrita proposta:** "Overview · Acme Co. — Digital Pampas" etc. (helper de título por página).
- **Confiança:** alta.

### [SEV 1] COPY-05 — "↳ 19% from previous" convive com "Reply rate 9.8%" no mesmo card — Detail Q3 / LinkedIn
- **Evidência:** card mostra "REPLY RATE 9.8%" (61/620 mensagens) e funil "Replied 61 ↳ 19% from previous" (61/328 aceitos) — dois percentuais de "resposta" com denominadores diferentes.
- **Reescrita proposta:** métrica do card → **"Reply rate (per message) 9.8%"**.
- **Confiança:** média (testar com o Léo).

### [SEV 1] COPY-06 — "Campaigns" na sidebar que não leva à lista — navegação (overlap com UX)
- **Evidência:** com campanha selecionada, clicar em "Campaigns" renderiza o detalhe. O rótulo promete plural e entrega singular. Diagnóstico de arquitetura é do UX; registro de copy: label correta > microcopy remendando arquitetura.
- **Confiança:** alta no fato; solução é do UX.

---

## Lista de corte (marketese e jargão)

**Nenhum marketese encontrado.** O portal é factual do login ao rodapé — ativo de marca; proteger. (Jargões como "ICP", "Deliverability", "Warm-up" são a língua do público B2B outbound — corretos, não cortar.)

## O que eu NÃO consegui avaliar
1. **Message match com o site de marketing** — não recebi a copy do site nesta pasta; cruzamento portal ↔ site pendente.
2. **Soma exata das séries diárias (MET-06)** — estimativa analítica; o verifier pode somar as 90 linhas do JSON.
3. **Reports/Replies da Northwind renderizados** (MET-11, MET-12 baseados no mock).
4. **Estados de erro do login ao vivo** — texto confirmado no código, não em screenshot.
5. **Versões de idioma** — produto em inglês (correto); snippets FR/PT são conteúdo de leads mock, não tradução.

**Sinalização:** não vale convocar `@copy-review-lead`/lenses — não é landing de venda; o kit certo foi consistência de dados + NN/g.

---

**Nota de mentoria (Ste):** dois termos para o repertório — *off-by-one de timezone* (MET-04: parse em UTC, render em fuso local, data volta um dia) e *falsa precisão / proxy metric* (MET-05: um número exibido sob a label de outro). E o princípio que amarra o relatório: **em produto de transparência, label de escopo faz parte do número** — "583" não é uma métrica; "583 replies, all channels, all time" é.

Arquivos de referência principais: `src/data/portalMock.ts` (maioria das correções SEV-4), `src/components/metrics/KpiRow.tsx`, `metrics/ActivityChart.tsx`, `metrics/ChannelCards.tsx`, `campaign/CampaignCard.tsx`, `src/lib/format.ts`.
