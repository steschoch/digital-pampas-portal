# Inventário — Portal do Cliente Digital Pampas — 2026-07-16

Alvo: **https://digital-pampas-portal.vercel.app/** (produção) · App React logado · Login usado: `demo@digitalpampas.com` (papel *agency*, 2 clientes).
Este documento é **factual**: mapeia o que existe e o que foi capturado. Julgamentos ficam com os especialistas.

## Método

- Rotas vieram do briefing (6 telas) e foram confirmadas na navegação real. Não há sitemap (app logado).
- **Rotas profundas retornam 404 do Vercel** (`/login`, `/campaigns`, etc. acessadas por URL direta → página "404: NOT_FOUND"). Só a raiz `/` responde 200. Toda a captura foi feita com **navegação client-side** (cliques nos links/cards), num mesmo contexto de browser por viewport.
- Login automatizado via Playwright (chromium headless): preencher email/senha demo → Sign in → redirect para `/`. Sessão em `localStorage['dp-portal-auth']`.
- Desktop: viewport 1440×900, deviceScaleFactor 2. Mobile: 390×844, deviceScaleFactor 3, touch + UA iPhone.
- O capturador padrão do squad (`capture.mjs`) não foi usado por não suportar fluxo de login; scripts Playwright em Python cumpriram o mesmo contrato (full-page PNG + HTML renderizado + transcrições).
- Formulário de login foi submetido **apenas com as credenciais demo indicadas no briefing** (públicas no código mock). Nenhum outro formulário existe/foi submetido.

## Telas capturadas

Todos os caminhos relativos a `auditoria-site/2026-07-16/capturas/`. Tema padrão = dark. "All campaigns" = CampaignSelector no default.

| # | Rota / estado | Viewport | Arquivos | Observações de captura |
|---|---|---|---|---|
| 1 | `/login` (deslogado) | desktop | `login-desktop.png`, `html/login.html` | URL real: `/login?from=%2F` (chegada via `/`) |
| 2 | `/login` | mobile | `login-mobile.png` | |
| 3 | `/` Overview — Acme · All campaigns · dark | desktop | `overview-desktop.png` (full), `overview-desktop-fold.png` (1º viewport), `html/overview.html` | |
| 4 | `/` Overview — idem, **tema claro** | desktop | `overview-desktop-light.png` (full), `overview-desktop-light-fold.png`, `html/overview-light.html` | no full-page, o sidebar (position fixed) aparece deslocado no meio da página — **artefato de captura**, não bug; usar o `-fold` para ver o tema claro correto |
| 5 | `/` Overview — Acme · **CampaignSelector = Q3 Outbound — US Market** | desktop | `overview-campaign-q3-desktop.png`, `html/overview-campaign-q3.html` | |
| 6 | `/` Overview — **ClientSelector = Northwind Labs** · All campaigns | desktop | `overview-northwind-desktop.png`, `html/overview-northwind.html` | |
| 7 | `/` Overview — Acme · All campaigns | mobile | `overview-mobile.png` | sem scroll horizontal |
| 8 | `/campaigns` — Acme | desktop | `campaigns-desktop.png`, `html/campaigns.html` | |
| 9 | `/campaigns` — Northwind | desktop | `campaigns-northwind-desktop.png`, `html/campaigns-northwind.html` | |
| 10 | `/campaigns` — Acme | mobile | `campaigns-mobile.png` | sem scroll horizontal |
| 11 | `/campaigns/cmp-q3-us` — Q3 Outbound — US Market (Email+LinkedIn) | desktop | `campaign-detail-q3-desktop.png`, `html/campaign-detail-q3.html` | aberto pelo card da lista |
| 12 | `/campaigns/cmp-q3-us` | mobile | `campaign-detail-q3-mobile.png` | **scroll horizontal de 91px** detectado; página com ~31.500px de altura |
| 13 | `/campaigns/cmp-emea` — EMEA Expansion — Email (Email, Warming) | desktop | `campaign-detail-emea-desktop.png`, `html/campaign-detail-emea.html` | |
| 14 | `/campaigns/cmp-emea` | mobile | `campaign-detail-emea-mobile.png` | **scroll horizontal de 76px** |
| 15 | `/campaigns/cmp-abm` — Enterprise ABM — LinkedIn (Northwind, LinkedIn) | desktop | `campaign-detail-abm-desktop.png`, `html/campaign-detail-abm.html` | 2ª campanha de canal distinto, conforme pedido |
| 16 | `/replies` — Acme · All campaigns | desktop | `replies-desktop.png`, `html/replies.html` | |
| 17 | `/replies` — Acme · All campaigns | mobile | `replies-mobile.png` | **scroll horizontal de 76px** |
| 18 | `/replies` — Acme · **filtrado EMEA** | desktop + mobile | `replies-emea-filter-desktop.png`, `replies-emea-filter-mobile.png`, `html/replies-emea-filter.html` | estado herdado do selector global (ver "Fatos de navegação") |
| 19 | `/reports` — Acme · All campaigns | desktop | `reports-desktop.png`, `html/reports.html` | |
| 20 | `/reports` — Acme · All campaigns | mobile | `reports-mobile.png` | **scroll horizontal de 76px** |
| 21 | `/reports` — Acme · **filtrado EMEA** | desktop + mobile | `reports-emea-filter-desktop.png`, `reports-emea-filter-mobile.png`, `html/reports-emea-filter.html` | mostra 1 única linha (junho/EMEA) |
| 22 | Drawer de navegação mobile aberto | mobile | `menu-drawer-mobile.png` | itens: Overview, Campaigns, Replies, Reports, "Settings · soon"; fecha com Escape |
| 23 | Topbar mobile (viewport) | mobile | `topbar-mobile.png` | evidência da sobreposição de elementos do shell (ver anomalias) |
| 24 | **Bug "Under 2%" × "Deliverability"** | desktop + mobile | `bug-deliverability-closeup-desktop.png`, `bug-deliverability-context-desktop.png`, `bug-deliverability-closeup-mobile.png`, `bug-deliverability-context-mobile.png`, `bug-deliverability.html`, `bug-deliverability-medicoes.json` | ver seção dedicada |

Transcrição integral (innerText) de cada tela, incluindo as tabelas diárias de 90 linhas dos gráficos: **`../transcricoes-innerText.json`** (chaves = nomes das capturas).

## Não capturado (e por quê)

- **Login secundário `client@acme.com`** (papel *client*, sem ClientSelector) — o briefing pede a conta agency; a variação de papel não estava no escopo de captura. Fica anotado que existe.
- **Estados de erro do login** (credenciais inválidas) — não testados; regra de não gerar interações falsas além do necessário.
- **Tema claro** capturado só no Overview desktop (conforme instrução). Demais telas somente dark.
- **Overview mobile nas variações Northwind / campanha específica** — não solicitado.
- **Detalhe ABM em mobile** e **`/replies`+`/reports` da Northwind** — não solicitados; a Northwind foi coberta em Overview, lista e detalhe ABM desktop.
- **UserMenu aberto** — sem screenshot; conteúdo verificado via DOM: apenas "Log out".
- Chaves de transcrição mobile `campaigns-mobile`, `campaign-detail-q3-mobile` e `menu-drawer-mobile` não constam no JSON (script interrompido antes da gravação); o conteúdo é idêntico ao desktop correspondente.

## Bug reportado (Overview → card Email) — evidência, sem diagnóstico

- **DOM** (ver `bug-deliverability.html`): a badge é `<span class="_badge_pyp6d_3 _success_pyp6d_47"> under 2%</span>` e está **dentro** de `_metricValue_` da métrica **Bounce rate**, ao lado do valor "1.1%". O label `<span class="_label_ar96f_36">Deliverability</span>` pertence ao gauge vizinho (coluna `_gauges_`). Texto no DOM: `" under 2%"` (minúsculo, com espaço inicial; o uppercase visível vem de CSS).
- **Desktop 1440px** (getBoundingClientRect): badge x 500,4→599,0 / label x 563,0→667,0 ⇒ **sobreposição de 35,97px (x) × 11,5px (y)** — confirmada. Print: `bug-deliverability-closeup-desktop.png`.
- **Mobile 390px**: badge (y≈410) e label (y≈590) ficam em linhas diferentes ⇒ **sem sobreposição** (overlap 0×0).
- A mesma badge "UNDER 2%" aparece também nos detalhes de campanha Q3 e EMEA (card Email, junto ao Bounce rate); nesses layouts há colunas extras (Active inboxes/domains) entre a badge e os gauges.
- Prefixos de CSS Modules distintos (`_badge_pyp6d`, `_label_ar96f`, `_channelBody_xgdb8`) indicam componentes de origens diferentes (DS vs. portal) — a atribuição exata fica para o especialista com o código local.

## Metadados, componentes e métricas por tela

Head comum a todas as rotas: `title` **"Client Portal · Digital Pampas"** (único, não muda por rota), `lang="en"`, sem meta description, favicon.png, fonts Space Grotesk + JetBrains Mono (Google Fonts), tema via `data-color-scheme` (dark default, persistido em `localStorage['dp-theme']`).

Shell logado (todas as telas): sidebar (logo, Overview/Campaigns/Replies/Reports, rodapé "Settings · soon") + topbar (ClientSelector "Select client", CampaignSelector "Select campaign", toggle de tema "Switch to light/dark mode", UserMenu "SM" — "Account menu for Sofia Mendes", contendo só "Log out"). No mobile a sidebar vira drawer atrás do botão "Open menu" (hambúrguer).

### `/login`
Componentes: card central, heading "Client Portal", tagline `> Your pipeline. Live.`, inputs Email* (placeholder `you@company.com`) e Password* (placeholder `••••••••`), botão "Sign in", link "Trouble signing in? hello@digitalpampas.com", bloco "DEMO CREDENTIALS" com `demo@digitalpampas.com · pampas2026` e `client@acme.com · acme2026`, cada um com botão "use". Estética terminal (prompt `>` nos inputs). Sem menu/nav.

### `/` Overview — Acme · All campaigns (dark)
Componentes: heading (eyebrow "DASHBOARD", h1 "Overview", subtítulo "Acme Co. · All campaigns", "Last sync: 2h ago" com dot verde) · seção **Campaign status** (2 steppers de fases) · **Results** (4 cards de métrica com sparkline e delta) · **Activity & responses (30d)** (gráfico de linhas com tabela acessível de dados diários 2026-04-03→2026-07-01) · **Reply breakdown** (donut + legenda) · **Channels** (2 cards: Email, LinkedIn — métricas + 2 gauges no Email) · **Latest interested replies** (lista de 5 + "View all →").

Métricas/labels transcritos:
- Campaign status **Q3 Outbound — US Market** (8 fases): Technical Audit DONE ✓ · Sending Infrastructure DONE ✓ · ICP & Data DONE ✓ · Copy & Sequences DONE ✓ · Campaign Launch ACTIVE · LinkedIn Integration ACTIVE · Optimization UPCOMING · Ongoing Management UPCOMING.
- Campaign status **EMEA Expansion — Email** (6 fases): Technical Audit DONE ✓ · Sending Infrastructure ACTIVE · ICP & Data UPCOMING · Copy & Sequences UPCOMING · Campaign Launch UPCOMING · Ongoing Management UPCOMING.
- Results: **Meetings booked 14 ↓4%** · **Opportunities 9 ↓4%** · **Pipeline value $95K ↑4%** · **Interested replies 37 ↓4%**.
- Activity & responses (30d): séries "Emails sent" e "Replies"; eixo y 0–616; eixo x 2026-04-03 / 2026-05-17 / 2026-07-01. Tabela diária completa (90 linhas) em `transcricoes-innerText.json` → `overview-desktop`.
- Reply breakdown: **139 TOTAL REPLIES** — Interested **37 · 27%** · Not now **25 · 18%** · Not interested **77 · 55%**.
- Channels **Email [WARMING]**: SENT **13.1K** · REPLY RATE **4.1%** · OPEN RATE **57.7%** · BOUNCE RATE **1.1%** [badge **UNDER 2%**] · gauge **Deliverability 98** (aria: "Deliverability: 98 of 100") · gauge **Domain reputation 92**.
- Channels **LinkedIn [ACTIVE]**: INVITES SENT **800** · ACCEPTANCE **41%** · MESSAGES **620** · REPLY RATE **9.8%**.
- Latest interested replies (5): João Martins — CTO, TechCorp ("Sounds interesting, can we set up a call next week?", INTERESTED, 10h ago) · Emily Carter — VP Engineering, Datalytics (14h ago) · Priya Nair — Director of Growth, Loopwork (2d ago) · Sophie Dubois — Head of Growth, Parisel ("Intéressant — pouvez-vous m'envoyer plus de détails?", 2d ago) · Sara Lindgren — CMO, Helio (3d ago).

### `/` Overview — Acme · **Q3 selecionada** (variação)
Diferenças factuais vs. All campaigns: subtítulo "Acme Co. · Q3 Outbound — US Market"; só o stepper da Q3; Results **12 ↓6% / 8 ↓6% / $86K ↑2% / 34 ↓6%**; eixo do gráfico 0–564; Reply breakdown **123** (34·28% / 21·17% / 68·55%); Email badge **READY** (vs. WARMING no agregado), SENT **12.4K**, REPLY RATE **4.2%**, OPEN RATE **58%**, BOUNCE 1.1% [UNDER 2%], gauges **98/94**; LinkedIn idêntico (800/41%/620/9.8%); lista de interested com Ana Ribeiro — Head of RevOps, Fluxo no lugar de Sophie Dubois.

### `/` Overview — **Northwind Labs** · All campaigns (variação)
Campaign status: só **Enterprise ABM — LinkedIn** (6 fases): Account Selection DONE ✓ · Profile Warm-up DONE ✓ · Connection Campaign DONE ✓ · Messaging & Nurture ACTIVE · Optimization UPCOMING · Ongoing Management UPCOMING. Results: **9 ↑2% / 6 ↑2% / $142K ↑1% / 22 ↑2%**. Gráfico: série **"Invites sent"** (não "Emails sent"), eixo 0–44. Reply breakdown **68** (22·32% / 15·22% / 31·46%). Channels: apenas **LinkedIn [ACTIVE]** — INVITES SENT **1.2K** · ACCEPTANCE **47%** · MESSAGES **540** · REPLY RATE **12.6%** (sem card Email). Latest interested: Robert Hayes — CISO, Vaultline · Nadia Osei — VP Security, Ironclad · Yuki Tanaka — Security Architect, Sentinel · Felipe Souza — VP Infrastructure, Cloudspan · Ivan Petrov — Head of Platform, Nimbus. CampaignSelector da Northwind: All campaigns ✓ · Enterprise ABM — LinkedIn.

### `/campaigns` — Acme
h1 "Campaigns", subtítulo "Acme Co. · 2 campaigns". Cards clicáveis (`div[role=button][tabindex=0]`):
- **Q3 Outbound — US Market** [LIVE] · chips Email, LinkedIn · mini-stepper (4 ✓) · "Phase 5 of 8 · Campaign Launch" · EMAILS SENT **12.4K** · REPLIES **583** · MEETINGS **12**.
- **EMEA Expansion — Email** [WARMING] · chip Email · (1 ✓) · "Phase 2 of 6 · Sending Infrastructure" · EMAILS SENT **640** · REPLIES **20** · MEETINGS **2**.

### `/campaigns` — Northwind
"Northwind Labs · 1 campaign": **Enterprise ABM — LinkedIn** [LIVE] · chip LinkedIn · (3 ✓) · "Phase 4 of 6 · Messaging & Nurture" · INVITES SENT **1.2K** · REPLIES **68** · MEETINGS **9**.

### `/campaigns/cmp-q3-us` — detalhe Q3
Componentes: breadcrumb/link "All campaigns", h1 + badge LIVE + "Last sync: 2h ago" · **Timeline** (8 fases com descrição, Planned/Actual e deliverables) · **Results** (4 cards) · gráfico 30d · Reply breakdown · **Channels** (Email com métricas extras + funil LinkedIn) · **Qualification (Clay)** (funil + histograma ICP) · **Replies** (tabs + tabela).

- Timeline (Planned → Actual): Technical Audit DONE (2026-05-12→05-19 / 05-12→05-18; "Diagnostic report delivered", "DNS/SPF/DKIM/DMARC baseline") · Sending Infrastructure DONE (05-19→06-02 / igual; "3 domains", "12 inboxes provisioned", "Warm-up complete") · ICP & Data DONE (06-02→06-12 / 06-02→06-13; "4,200 contacts sourced", "Waterfall enrichment", "ICP scoring model") · Copy & Sequences DONE (06-12→06-22 / 06-13→06-23; "3 sequence variants", "LinkedIn message scripts") · Campaign Launch ACTIVE (06-24→— ; "Sending 400–600/day", "Daily deliverability monitoring") · LinkedIn Integration ACTIVE (planned 06-28→— / actual 06-30→—; "Multichannel layer via Aimfox") · Optimization UPCOMING (07-14→—) · Ongoing Management UPCOMING (08-01→—; "Weekly reports", "Monthly review").
- Results: **12 ↓6% / 8 ↓6% / $86K ↑2% / 34 ↓6%** (iguais ao Overview com Q3 selecionada).
- Reply breakdown: **123** (34·28% / 21·17% / 68·55%).
- Email [READY]: SENT **12.4K** · REPLY RATE **4.2%** · OPEN RATE **58%** · BOUNCE RATE **1.1%** [UNDER 2%] · ACTIVE INBOXES **12** · ACTIVE DOMAINS **3** · gauges **98 / 94**.
- LinkedIn [ACTIVE]: 800 / 41% / 620 / 9.8% + funil: Invites **800** → Accepted **328** "↳ 41% from previous" → Replied **61** "↳ 19% from previous".
- Qualification (Clay): Sourced **4.2K** → Verified **3.6K** (↳ 85%) → Qualified **1.2K** (↳ 33%). ICP score distribution: 60-70: **210** · 70-80: **468** · 80-90: **372** · 90-100: **130**.
- Replies: tabs All **10** / Interested **5** / Not now **3** / Not interested **2**; tabela (Contact, Company, Channel, Category, Reply, ICP, Received) com 10 linhas — íntegra em `transcricoes-innerText.json`.

### `/campaigns/cmp-emea` — detalhe EMEA
- Timeline 6 fases: Technical Audit DONE (06-09→06-14; "EU deliverability baseline") · Sending Infrastructure ACTIVE ("Domains warming — not at full volume yet."; 06-14→06-30, actual 06-14→—; "2 EU domains", "8 inboxes", "Warm-up in progress") · ICP & Data UPCOMING (06-30→07-10; "GDPR-compliant sourcing") · Copy & Sequences UPCOMING (07-10→07-18) · Campaign Launch UPCOMING (07-20→—) · Ongoing Management UPCOMING (08-05→—).
- Results: **2 ↑20% / 1 ↑20% / $9K ↑24% / 3 ↑20%**. Reply breakdown: **16** (3·19% / 4·25% / 9·56%).
- Email [WARMING]: SENT **640** · REPLY RATE **3.1%** · OPEN RATE **52%** · BOUNCE RATE **1.6%** [UNDER 2%] · ACTIVE INBOXES **8** · ACTIVE DOMAINS **2** · gauges **96 / 88**. Sem card LinkedIn.
- Qualification: **900 → 610 (↳68%) → 180 (↳30%)**. ICP: 54 / 78 / 36 / 12.
- Replies: All **7** / 2 / 3 / 2.

### `/campaigns/cmp-abm` — detalhe Enterprise ABM (Northwind)
- Timeline 6 fases (nomes distintos das campanhas de email): Account Selection DONE (05-20→05-28 / 05-20→05-27; "120 target accounts", "Committee mapping") · Profile Warm-up DONE ("4 sender profiles", "Aimfox connected") · Connection Campaign DONE (06-08→06-20 / 06-09→06-22) · Messaging & Nurture ACTIVE ("3-touch message flow", "Meeting booking links") · Optimization UPCOMING (07-15→—) · Ongoing Management UPCOMING (08-01→—).
- Results: **9 ↑2% / 6 ↑2% / $142K ↑1% / 22 ↑2%**. Reply breakdown: **68** (22·32% / 15·22% / 31·46%).
- LinkedIn [ACTIVE]: **1.2K / 47% / 540 / 12.6%** + funil Invites **1.2K** → Accepted **555** (↳47%) → Replied **68** (↳12%). Sem card Email.
- Qualification: **120 → 118 (↳98%) → 74 (↳63%)**. ICP: 8 / 22 / 30 / 14.
- Replies: All **8** / 5 / 2 / 1 (contatos de segurança: Robert Hayes CISO Vaultline 96, Nadia Osei 91, etc.).

### `/replies` — Acme · All campaigns
Eyebrow "INBOX", h1 "Replies", subtítulo "Acme Co. · All campaigns". Tabs com contadores: **All 17 · Interested 7 · Not now 6 · Not interested 4**. Tabela ordenável (setas ↕) — colunas CONTACT / COMPANY / CHANNEL / CATEGORY / REPLY / ICP / RECEIVED — 17 linhas (Jul 1 → Jun 24; ICP 61–94; categorias INTERESTED / NOT NOW / NOT INTERESTED). A coluna CHANNEL exibe ícone (LinkedIn) apenas em 3 linhas; as demais ficam sem conteúdo visível na célula. Transcrição integral no JSON.
Variação filtrada (EMEA): tabs **All 7 · Interested 2 · Not now 3 · Not interested 2**, subtítulo "Acme Co. · EMEA Expansion — Email".

### `/reports` — Acme · All campaigns
Eyebrow "REPORTS", h1 "Reports", subtítulo "Acme Co. · monthly & weekly snapshots", badge **"EXPORT IS A DEMO"** no topo direito. Tabela PERIOD / CAMPAIGN / MEETINGS / REPLIES / PIPELINE / EXPORT, 3 linhas:
- June 2026 (May 31 – Jun 29, 2026) · Q3 Outbound — US Market · **9 · 402 · $64K** · PDF
- June 2026 (May 31 – Jun 29, 2026) · EMEA Expansion — Email · **2 · 20 · $9K** · PDF
- May 2026 (Apr 30 – May 30, 2026) · Q3 Outbound — US Market · **3 · 118 · $22K** · PDF
Variação filtrada (EMEA): só a linha da EMEA.

## Fatos de navegação e comportamento (registrados para UX; sem julgamento)

1. **Deep-link/refresh = 404**: qualquer rota além de `/` acessada por URL direta devolve o 404 do Vercel (sem rewrite de SPA no deploy). Um F5 em `/campaigns` reproduz.
2. **Selector global de campanha acoplado à navegação**: abrir um detalhe de campanha seta o CampaignSelector do topbar para aquela campanha. Com campanha específica selecionada, clicar em "Campaigns" na sidebar mantém a URL `/campaigns` mas **renderiza o detalhe da campanha, não a lista** (flash breve de "Campaigns · —" antes). A lista só volta ao re-selecionar "All campaigns".
3. O filtro também **se propaga para Replies e Reports** (evidência: pares `*-emea-filter-*`).
4. **Mobile — topbar com elementos sobrepostos** (390px, medições getBoundingClientRect em `topbar-mobile.png`): trigger "Select campaign" ocupa x 219,5→386,6; o toggle de tema (x 296,6→318,6) e o botão de conta "SM" (x 334,6→382,6) ficam **dentro dessa faixa**. Em automação, o clique no trigger foi interceptado pelo botão de conta. O toggle de tema não fica visível no print.
5. **Mobile — labels do stepper de fases colidem entre si** no Campaign status (texto ilegível por sobreposição; visível em `overview-mobile.png` e `topbar-mobile.png`).
6. **Mobile — scroll horizontal**: detalhe de campanha (76–91px), Replies (76px) e Reports (76px). Overview e lista de Campaigns sem scroll horizontal.
7. Drawer mobile fecha com Escape. Sem banner de cookies/consentimento em nenhuma tela.
8. Latência simulada de ~500ms no login e ~300–800ms nas trocas de tela (estados de loading breves, ex.: "—" no lugar de conteúdo).

## Anomalias visuais notadas de passagem (fatos, sem julgar)

- A badge "UNDER 2%" sobrepõe o label "Deliverability" no Overview desktop (seção dedicada acima). Nos detalhes Q3/EMEA a mesma badge existe junto ao Bounce rate.
- Título do gráfico diz "**Activity & responses (30d)**", mas o eixo/tabela cobre 2026-04-03 → 2026-07-01 (~90 dias), em todas as telas onde aparece.
- Deltas dos 4 cards de Results compartilham o mesmo percentual dentro de cada tela (ex.: Acme All: 4%, 4%, 4%, 4%; Q3: 6/6/2/6; EMEA: 20/20/24/20; ABM/Northwind: 2/2/1/2).
- Badge de status do card Email muda conforme o recorte: WARMING (Acme All campaigns) / READY (Q3 selecionada) / WARMING (EMEA).
- `/campaigns` (lista, Acme) mostra Q3 com REPLIES **583**; Reply breakdown da Q3 mostra TOTAL **123**; Reports (junho) mostra Q3 com **402** — números que os especialistas de copy/métricas vão querer cruzar (registro apenas).
- Coluna CHANNEL da tabela de Replies com ícone em só 3 de 17 linhas.
- Sidebar: item "Settings · soon" (não clicável como página).
- Reports: badge "EXPORT IS A DEMO"; coluna EXPORT com rótulo "PDF".

## Sinais do site (fatos)

- Tipo: **web app SPA logado** (portal B2B de acompanhamento de campanhas outbound). Não é e-commerce; sem funil de compra.
- Tecnologia: React + Vite (bundle `/assets/index-*.js`), React Router (client-side), CSS Modules com hash, componentes do DS `@steschoch/digital-pampas-ds` (prefixos `_badge_pyp6d`, `_label_ar96f` etc.). Deploy Vercel. Dados 100% mock (sem chamadas de rede além dos assets — `networkidle` imediato).
- Auth mock: `localStorage['dp-portal-auth']`; tema: `localStorage['dp-theme']` + `data-color-scheme` no `<html>` (script inline anti-flash no head).
- **Nenhuma ferramenta de analytics** detectada no HTML (0 ocorrências de gtag/GTM/Clarity/Hotjar/Matomo/Meta Pixel) — consistente com o briefing (dimensão analytics pulada).
- Idioma: `lang="en"`, conteúdo todo em inglês (com quotes mock em FR/PT nos replies).
- Acessibilidade estrutural notada de passagem (para o agente a11y aprofundar): gauges SVG com `role="img"` + `aria-label` ("Deliverability: 98 of 100"); gráficos com tabela de dados no DOM; selects customizados com `aria-haspopup="listbox"`/`aria-expanded` e opções `li[role=option][aria-selected]`; cards de campanha como `div[role=button][tabindex=0]`; botões do shell com aria-label.
- "Conversão" do briefing: confiança via transparência — caminho típico: login → Overview (status/resultados) → detalhe da campanha → Replies/Reports. Sem CTA de compra; único CTA externo é `mailto:hello@digitalpampas.com` no login.

## Leituras recomendadas por especialista

- **UX**: `overview-desktop-fold.png` → `overview-desktop.png` → `campaigns-desktop.png` → `campaign-detail-q3-desktop.png` → `menu-drawer-mobile.png` + seção "Fatos de navegação" (itens 1–3 sobre deep-link e selector global; 4–6 sobre mobile). Variações de selector: `overview-campaign-q3-desktop.png`, `overview-northwind-desktop.png`, pares `*-emea-filter-*`.
- **UI**: `bug-deliverability-closeup-desktop.png` + `bug-deliverability.html` + `bug-deliverability-medicoes.json` (bug reportado); `topbar-mobile.png` e `overview-mobile.png` (sobreposições no shell e no stepper); `overview-desktop-light-fold.png` vs `overview-desktop-fold.png` (temas); `campaign-detail-q3-mobile.png` (scroll horizontal).
- **Copy/microcopy + métricas**: `../transcricoes-innerText.json` (transcrição integral, com tabelas diárias) + seção "Metadados e métricas por tela" deste arquivo + `html/*.html` para conferência; atenção aos cruzamentos listados em "Anomalias" (583 vs 123 vs 402; "(30d)" vs ~90 dias; deltas idênticos; semântica da badge "Under 2%" ao lado de Bounce rate 1.1%).
- **A11y**: `html/overview.html`, `html/campaign-detail-q3.html`, `html/replies.html`, `html/login.html` (DOM renderizado); fatos estruturais em "Sinais do site"; `menu-drawer-mobile.png` (drawer + Escape); cards `div[role=button]`; título de página único para todas as rotas.
- **Performance / conversão / analytics**: pulados por decisão do briefing (telas logadas inacessíveis ao PageSpeed; app sem funil de persuasão; dados mock).
