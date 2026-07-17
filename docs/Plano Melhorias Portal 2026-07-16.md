# Plano de Melhorias — Portal do Cliente Digital Pampas
*Criado em 2026-07-16 · Origem: auditoria completa em `auditoria-site/2026-07-16/` · Para execução pelo Claude (Opus)*

> **Status: PLANO APROVADO, AINDA NÃO EXECUTADO.**
> Fonte da verdade dos achados: `auditoria-site/2026-07-16/RELATORIO-FINAL.md` (tabela-mestra C-01…C-43, com causa em arquivo:linha, correção validada e atribuição DS vs portal). Este plano organiza a EXECUÇÃO; em caso de dúvida sobre um achado, ler o relatório final — não os relatórios individuais (02-ux/03-ui/04-copy/06-a11y), que contêm versões de solução JÁ SUBSTITUÍDAS pelos verificadores (ex.: MET-05/MET-06).
> Números da auditoria: 58 achados brutos → 43 consolidados (4 SEV4 · 15 SEV3 · 14 SEV2 · 10 SEV1) · 6/6 verificações adversariais confirmadas · 2 mini-rodadas em produção.

---

## Regras de trabalho (OBRIGATÓRIAS)

1. **DS primeiro, portal depois.** Alterações de componente acontecem em `ds-digital-pampas/`; o portal só consome. O portal usa `@steschoch/digital-pampas-ds` **^1.0.0** (GitHub Packages) — este plano sobe para a versão nova (será **1.4.0**).
2. **Ciclo de release do DS** (uma vez só, carregando TODOS os fixes de DS deste plano):
   ```bash
   # no ds-digital-pampas
   npm version 1.4.0 --no-git-tag-version
   npm run build        # tsc precisa passar limpo
   git add -A && git commit && git push origin main
   npm publish
   # no client-portal-digital-pampas — o .npmrc usa ${NPM_TOKEN} (vazio no shell); pegar do ~/.npmrc:
   TOKEN=$(grep "//npm.pkg.github.com/:_authToken=" ~/.npmrc | head -1 | sed 's/.*_authToken=//')
   NPM_TOKEN="$TOKEN" npm install @steschoch/digital-pampas-ds@^1.4.0
   ```
   ⚠️ Nunca pushar o portal usando prop/comportamento que só existe no DS local não publicado (o build da Vercel instala o publicado e quebra).
   ⚠️ O **site** (`website-digital-pampas`) também consome o DS (`^1.3.0`). O lock dele NÃO atualiza sozinho — após publicar 1.4.0, fazer um smoke test opcional no site e atualizar o lock dele em commit separado (o fix do Icon C-05 beneficia o site também).
3. **Preview local:** symlink `client-portal-digital-pampas/node_modules/@steschoch/digital-pampas-ds -> ../../../ds-digital-pampas` + `rm -rf node_modules/.vite` + restart do dev server. O `npm install` do passo 2 desfaz o symlink — desenvolver com symlink, publicar, depois install.
4. **Zero hex no CSS** — só tokens `var(--dp-*)`. Tokens novos nascem no `globals.css` do DS (camada certa: primitivo → semântico).
5. **NÃO tocar no que a auditoria mandou MANTER** (seção 3 do RELATORIO-FINAL): hierarquia do Overview, subtítulo de escopo, "← All campaigns", Planned vs Actual, empty states, "> Your pipeline. Live.", paleta dark (26/26 contrastes aprovados), LineChart com tabela sr-only, matemática do `aggregateSnapshots`.
6. **Login demo para verificação:** `demo@digitalpampas.com` / `pampas2026` (agency, 2 clientes) e `client@acme.com` / `acme2026` (client, 1 cliente). Entrar SEMPRE pela raiz `/` (o /login direto dá 404 até a Etapa 0 ser deployada).

---

## ETAPA 0 — Quick win independente (commit + push imediato)

### 0.1 · C-01 [SEV 4] — 404 em deep-link/F5 (`vercel.json`)
- Arquivo: `client-portal-digital-pampas/vercel.json` — adicionar:
  ```json
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  ```
- Mesmo fix já aplicado no site em 2026-07-16 (commit d21f477 do site). Pode commitar e pushar sozinho, antes de tudo.
- **Aceite:** `curl` 200 em `/`, `/campaigns`, `/campaigns/cmp-q3-us`, `/replies`, `/reports`, `/login`; F5 numa tela logada não derruba.

---

## ETAPA 1 — Fixes no DS (um único ciclo → 1.4.0)

> Ordem interna livre; publicar tudo junto. Cada item cita o achado da tabela-mestra.

### 1.1 · C-05 [SEV 3] — Icon: todos os ícones lucide somem
- `ds/src/components/Icon/Icon.tsx:24-25` — trocar a fonte de resolução para o export nomeado: `import { icons } from 'lucide-react'` e guard simples `if (!LucideIcon) return null` (o guard atual `typeof !== 'function'` rejeita `forwardRef`). Se possível, tipar `IconName = keyof typeof icons`.
- **Testar localmente ANTES do publish** (showroom do DS: os ícones aparecem?).
- Depois do fix, conferir espaço órfão no badge "under 2%" (`portal src/components/metrics/ChannelCards.tsx:51` — pode ficar espaçamento duplo com o gap).

### 1.2 · C-04(a) [SEV 4] — Select estoura o topbar mobile
- `ds/src/components/Select/Select.module.css:4-18` — `.root { min-width: 0; max-width: 100%; }` (mantém `width: 100%`; ativa o `text-overflow: ellipsis` que já existe no `.value`).

### 1.3 · C-07 [SEV 3] — Tablist estoura 53px no mobile (2ª causa do scroll — item PRÓPRIO)
- DS `Tabs`: `overflow-x: auto` **na tablist** + `flex-wrap: nowrap`/`white-space: nowrap` nos labels (scroll interno de componente é permitido pela WCAG 1.4.10; o da página, não).

### 1.4 · C-14/C-15/C-16 [SEV 3] — Contrastes do tema claro (nível de token)
- **C-14:** criar tokens de **texto** de status no light (verde `#1a7a44` = 5.02:1, vermelho `#d0233c` = 4.92:1 — valores calculados pela auditoria) e usar no StatCard onde success/error é texto. Dark não muda.
- **C-15:** `Timeline` — trocar `--tl-done`/`--tl-active` (uso como texto) para `var(--dp-color-primary-strong)` (token JÁ EXISTE, `globals.css:511`) → 6.72:1 no light.
- **C-16:** `Sidebar` — item ativo com `var(--dp-color-primary-strong)` (4.51:1 sobre o fundo composto real).

### 1.5 · C-18 [SEV 3] — Timeline responsivo (fix definitivo)
- `ds/src/components/Timeline/Timeline.module.css:76-78`: em ≤640px, o `.horizontal` vira vertical (reaproveitar as regras `.vertical`, que já existem e funcionam) — OU versão condensada "Phase 5 of 8 · Campaign Launch". Escolher a vertical (mais simples e já provada no detalhe de campanha).

### 1.6 · C-23 [SEV 2] — Modo card da DataTable: label/valor colados à direita
- `ds/src/components/DataTable/DataTable.module.css:66-91` — no card mobile: label à esquerda, valor à direita, `justify-content: space-between` + gap mínimo.

### 1.7 · C-27 [SEV 2] — Bordas de inputs/selects abaixo de 3:1
- TextField/Select: borda de controles de formulário com token ≥3:1 (`#6c7da0` = 4.12:1 dark / 3.86:1 light — criar token semântico "border-control"); `outline-variant` fica só para divisores decorativos.

### 1.8 · C-29 [SEV 2] — Alvos de toque
- Tabs `padding-block: var(--dp-space-100)` (~44px de altura); ThemeToggle 44×44px. (Coordenar com 1.3 — mesma tablist.)

### 1.9 · C-31 [SEV 2] — Select: nome acessível dinâmico + activedescendant
- `ds/src/components/Select/Select.tsx:82-97`: (a) o `aria-label` deve incluir o valor (`aria-label={label + ': ' + value}`) OU suportar label visível (ver 2.7/C-13 — mesma feature resolve os dois); (b) `aria-activedescendant` apontando para o id da opção ativa (padrão combobox ARIA APG).

### 1.10 · C-33 [SEV 2] — DataTable: prop de prioridade de coluna no mobile
- Prop `mobileHidden` (ou similar) por coluna + `.td:empty { display: none }` como fallback. (Esforço M — se apertar, entregar só o `.td:empty` agora e registrar o resto como fase 2.)

### 1.11 · C-30 [SEV 2] — Microtexto 10px informativo → 11-12px
- Subir o papel "micro label informativo" (headers de tabela, status do Timeline, label do Gauge) para 11-12px. **Decisão de design da Ste: aplicar 11px como default e ela ajusta depois se quiser** (trade-off da estética terminal — reversível).

*(C-28 — sr-only de direção do delta — fica CONDICIONADO: os deltas saem no C-03; aplicar quando voltarem com séries reais. Registrar como TODO no código.)*

**Publicar 1.4.0** (regra 2) e instalar no portal antes da Etapa 2.

---

## ETAPA 2 — Fixes no portal (após DS 1.4.0 instalado)

### Bloco A — o bug reportado + métricas (a alma do pedido da Ste)

**2.1 · C-06 [SEV 3] — Badge "UNDER 2%" invadindo "Deliverability" (o bug da Ste)**
- `src/components/metrics/metrics.module.css:52-61`: `.metricValue { flex-wrap: wrap; row-gap: var(--dp-space-25); }` + opcional `column-gap: var(--dp-space-200)` no `.channelBody`.
- Solução verificada adversarialmente (aritmética ✓, sem efeito colateral em telas grandes; alternativa de grid refutada como curativa).

**2.2 · C-02 [SEV 4] — Replies 583/123/402 (invariante "toda reply é categorizada")**
- `src/data/portalMock.ts`: `cmp-q3-us` → `replies: { interested: 163, notNow: 99, notInterested: 321 }` (=583); `rep-q3-jun` → `totalReplies: 463`; `cmp-emea` → `replies: { interested: 4, notNow: 5, notInterested: 11 }` (=20). ABM já é consistente — não tocar. Donut agregado Acme passa a 603 (verificado: consistente em todas as telas).
- No `CampaignCard`: trocar a stat de replies para só email (522) OU renomear a de sends para "Sent (all channels)" — escolher a 2ª (menor mudança de dado).

**2.3 · C-03 [SEV 4] — Deltas falsos dos KPIs (versão do VERIFICADOR)**
- `src/components/metrics/KpiRow.tsx` (linhas ~31/42/53/64): **remover delta E sparkline dos 4 cards** (Meetings booked, Opportunities, Pipeline value, Interested replies). NÃO manter em "Interested replies" (a série é de replies totais — também mentiria).
- Deixar TODO no código: reintroduzir quando houver série por KPI derivada do histórico de snapshots (design do backend), com rótulo "vs. prior 12 days".

**2.4 · C-32 [SEV 2] — Séries ≠ totais (+59%/+53% medidos)**
- `src/data/portalMock.ts` (`buildSeries`, ~:435-446): **derivar os totais dos snapshots a partir da soma das séries** (fonte única) — preferível a normalizar a série (decisão do verificador). Conferir que reply rates continuam plausíveis após o ajuste.

**2.5 · C-08 [SEV 3] — "(30d)" plotando 90 dias**
- `ActivityChart.tsx:11` / `useSeries.ts`: `points.slice(-30)` antes de plotar; título vira "Activity & replies (30d)" (junto com C-24).

**2.6 · C-09 [SEV 3] — Off-by-one de timezone nos Reports**
- `src/lib/format.ts:37`: `timeZone: 'UTC'` nas options **somente quando a entrada for date-only** (detectar `/^\d{4}-\d{2}-\d{2}$/`). NÃO aplicar a timestamps completos (`receivedAt`) — constraint do verificador.

**2.7 · C-13 [SEV 3] + C-31 — Rótulos visíveis nos dois dropdowns (um retrabalho só)**
- Trigger com eyebrow: `CLIENT · Acme Co. ⌄` e `CAMPAIGN · All campaigns ⌄` (`ClientSelector.tsx` / `CampaignSelector.tsx`, usando o suporte de label do DS da Etapa 1.9).

**2.8 · C-10/C-11/C-12/C-20/C-21/C-22 [SEV 3-2] — Honestidade dos dados (mudanças pequenas)**
- **C-10:** subtítulo de Replies → "… · showing the 17 most recent"; "View all →" → "View recent" (sem seta — padrão do projeto).
- **C-11:** badge persistente "demo dataset" junto ao "Last sync: 2h ago" (mais barato que DEMO_NOW dinâmico; manter honesto).
- **C-12:** remover o badge "Active" hardcoded do LinkedIn (`ChannelCards.tsx:101`) até haver dado real.
- **C-20:** botão de export rotulado "CSV" (`ReportsPage.tsx:97`).
- **C-21:** chip do bounce sempre visível com estado: "✓ under 2% target" / "above 2% target".
- **C-22:** gauges com unidade: "98%" (Deliverability) e "92/100" (Domain reputation), no valor e no aria-label.

### Bloco B — navegação e shell

**2.9 · C-19 [SEV 3] — Arquitetura do CampaignSelector (M — a maior mudança comportamental)**
1. `/campaigns` SEMPRE renderiza a lista (remover branch de `CampaignsPage.tsx:13-15`); detalhe só em `/campaigns/:id`.
2. Abrir detalhe NÃO seta o filtro global (remover `useEffect` de `CampaignDetailPage.tsx:14-16`).
3. Filtro visível e descartável: chip "Filtered: <campanha> ✕" junto ao título em Replies/Reports/Overview quando houver campanha selecionada; ✕ volta a All campaigns.
4. `SelectionProvider.tsx`: **não persistir** `campaignId` em localStorage (só `clientId`).
- Preservar o "← All campaigns" do detalhe (MANTER). Nota: a dosagem do chip é hipótese a validar com clientes reais — implementar e marcar para feedback.

**2.10 · C-04(b) [SEV 4] — Composição do topbar mobile**
- `AppShell` ≤640px: ClientSelector + CampaignSelector em **linha própria** abaixo da barra (opção validada como a mais segura). Testar papéis agency (2 selects) e client (1 — mini-rodada L2 provou que não regride).

**2.11 · C-17 [SEV 3] — Coluna Channel com texto**
- `RepliesTable.tsx:41-49` + `ChannelIcon.tsx`: ícone + texto visível "Email"/"LinkedIn" (padrão do `CampaignCard.tsx:62-71`) + nome acessível. Depende do C-05 (glifo) já publicado.

**2.12 · C-18 (parte portal) — Timeline vertical no mobile**
- `OverviewPage.tsx:93,98`: `orientation="vertical"` quando mobile (hook `useResponsive` já existe) — reforço imediato; o DS 1.4.0 já traz o fix definitivo.

**2.13 · C-25/C-26 [SEV 2] — Título por rota + aria-live**
- `document.title` por rota com escopo ("Replies · Acme Co. — Digital Pampas"), incluindo campanha no detalhe.
- `aria-live="polite"` no shell anunciando troca de cliente/campanha (espelhar o subtítulo do PageHeader).

### Bloco C — acabamento (SEV 1-2 restantes)

**2.14 ·** C-24 vocabulário canônico ("Activity & replies", "Meetings booked", "Acceptance rate") — cruzar 15 min com a copy v4 do site (L7). · C-34 alinhamento dos cards de campanha (`min-height` 2 linhas no título). · C-35 fallbacks de token divergentes (apontar token certo, remover fallback). · C-36 `formatCompact` só ≥10.000. · C-37 semana indentada sob o mês ou sufixo "(included in June)". · C-38 agregado "1 of 2 warming" em vez de WARMING binário. · C-39 "Reply rate (per message)" (marcar para validar com o Léo). · C-40 "Settings · soon" com estado disabled visível no drawer (manter o texto). · C-41 `lang` nos quotes FR/PT (campo `language` no modelo — desenhar junto com o backend; se pesado, registrar TODO). · C-42 aria-labels distintos nos botões "use" do login. · C-43 classe utilitária de `:focus-visible` do DS para links puros do portal.

---

## ETAPA 3 — Verificação final (obrigatória, em produção)

1. **As 6 URLs** (incl. `/login`) → 200 com F5/deep-link (Etapa 0).
2. **Scroll mobile:** `document.documentElement.scrollWidth === 390` nas 6 rotas × campanha "Q3 Outbound — US Market" selecionada × papéis agency E client (**exige C-04 + C-07 juntos**).
3. **Bug da Ste:** Overview desktop 1440 — nenhuma sobreposição badge×label; varrer também 768/1024/1100px (faixa de risco do C-06) e conferir tablet: sidebar icons-only COM ícones (C-05).
4. **Métricas cruzadas:** card Q3 = donut Q3 = 583; agregado Acme = 603; soma da tabela do gráfico = totais (C-32); Reports "June 2026 · Jun 1 – Jun 30"; gráfico com 30 pontos.
5. **Contraste:** varredura calculada (não a olho) 2 temas × 6 telas (script do a11y como base) — deltas/stepper/sidebar ≥4.5:1.
6. **Ícones:** sidebar, Settings, envelope na coluna Channel (com texto), check do badge, download do CSV.
7. **Navegação:** abrir detalhe → voltar a "Campaigns" mostra a LISTA; Replies/Reports sem filtro fantasma após reload (localStorage só com clientId); chip de filtro aparece e o ✕ limpa.
8. **Screenshots antes/depois** das 6 telas (desktop+mobile) salvos em `auditoria-site/2026-07-16/capturas/pos-fix/` para a próxima rodada da auditoria comparar (NOVO/PERSISTE/RESOLVIDO/REGRESSÃO).

## Decisões já tomadas (não re-perguntar) e flags
- C-03: remover os 4 deltas (versão do verificador). · C-11: badge "demo dataset" (não DEMO_NOW dinâmico). · C-18: vertical no mobile. · C-30: 11px como default (Ste ajusta depois se quiser). · C-19: implementar com chip e marcar para feedback de clientes reais. · C-39: aplicar e validar com o Léo depois.

## Fora de escopo
- Backend Supabase (fonte única real por métrica — já especificado em outro doc; várias correções acima têm nota "com Supabase").
- Teste com leitor de tela real (VoiceOver/NVDA) — agendar quando o backend entrar (L5).
- Performance/analytics (pulados na auditoria com justificativa).
