# CLAUDE.md — Portal do Cliente Digital Pampas

## O que é este projeto

Portal onde o cliente da Digital Pampas acompanha suas campanhas de outbound: status por fase, resultados, atividade, canais e respostas. SPA em React + Vite + TypeScript, autenticação mock (login demo), consome o Design System (`@steschoch/digital-pampas-ds`) para todo componente visual reutilizável.

---

## Estrutura de pastas

```
src/
  pages/
    LoginPage/, OverviewPage/, CampaignsPage/, CampaignDetailPage/, RepliesPage/, ReportsPage/
  components/
    campaign/            — CampaignCard, CampaignDetailView (compõem Timeline do DS)
    metrics/              — KpiRow, ActivityChart, ReplyDonut, ChannelCards, LatestReplies
    ScopeFilterChip/
  lib/
    auth/mockAuth.ts       — "paper guest list": credenciais demo, troca futura por Supabase Auth
    data/                  — PortalDataContext, useAsync (fonte de dados abstraída)
    useScope.ts, useMediaQuery.ts, useSeries.ts, format.ts
  data/
    portalMock.ts           — dataset demo (clientes, campanhas, fases, snapshots)
  App.tsx                   — rotas (react-router-dom v7), ProtectedLayout

docs/                       — planos e diagnósticos datados (rastreados no git, NÃO é .gitignored aqui)
auditoria-site/             — capturas e relatórios de auditoria de UI
```

---

## Comandos

```bash
npm run dev         # porta 5174 (fixa, ver package.json)
npm run build       # tsc -b && vite build
npm run typecheck   # tsc -b
npm run lint
```

**Login demo** (`src/lib/auth/mockAuth.ts`): `demo@digitalpampas.com` / `pampas2026` (agência) e `client@acme.com` / `acme2026` (visão de cliente).

Deploy: mesmo padrão dos outros produtos (Vercel automático no push pra `main`; `NPM_TOKEN` no ambiente pra instalar o DS do GitHub Packages).

---

## Regras e convenções

**Componente visual reutilizável se conserta no DS, o portal só importa.** Gauge, LineChart, DonutChart, StatCard, Timeline, tokens de cor/tamanho: tudo isso mora em `@steschoch/digital-pampas-ds`. Se precisar mudar visual/comportamento de um desses, o ajuste é no repo do DS (nova versão, `npm install` aqui depois) — nunca um override local. Fluxo inverso é pego pela skill `ds-drift`.

**Composição que É só deste produto** (papéis de contêiner, ritmo das seções, abertura do Overview, copy dos estados vazios) fica aqui mesmo, não sobe pro DS.

**Planos de trabalho ficam em `docs/`**, com data no nome. Diferente do site, aqui `docs/` **não é gitignored** — é rastreado no git.

---

## Estado atual (2026-07-22)

**Existe um diagnóstico de UI completo e plano de melhorias** em `docs/2026-07-22 - Diagnostico UI e Plano de Melhorias - Portal do Cliente.md`. Veredito: o portal não está feio, está genérico ("AI slop" de composição, não de bug) — falta hierarquia e personalidade, não reconstrução. 6 fases:

| Fase | Entrega | Status |
|---|---|---|
| 0 | Tira o que parece barato (ícones, bugs) | Não iniciada |
| 1 | Sistema de peso e ritmo (papéis de contêiner) | Não iniciada |
| 2 | Overview com protagonista (lede, métrica dominante) | Não iniciada |
| 3 | Fim dos clichês (KPIs+sparkline, gauges radiais), gráficos autorais | Não iniciada |
| 4 | Telas compostas (Reports, Campaigns), personalidade, decisão de cor de assinatura | Não iniciada |
| 5 | Infográfico animado do fluxo (peça de assinatura) | **Substituída e concluída** — ver nota abaixo |

**Nota sobre a Fase 5:** o plano original imaginava um componente novo (`FlowDiagram`/`SystemMap`) pro Campaign Detail. Na prática, a Ste esclareceu que essa peça de fluxo animado é do **site** (case studies), não do portal — virou o componente `CaseFlow` no DS. O que o portal realmente precisava no "Campaign status" do Overview era **animar o `Timeline` que já existia** (linha pontilhada/cinza → cores se montando em sequência). Isso foi feito: `Timeline` ganhou a prop `animate` (DS v1.6.2), ligada em `OverviewPage.tsx` nos dois renders de Campaign status. Fiel ao pedido original: "mostrar o que já foi feito, parte por parte, conectando uma linha com a outra, e o que ainda não foi feito continua visível como pendente."

**Próximos passos:** Fases 0 a 4 do plano, na ordem sugerida pelo documento (0 e 1 podem rodar em paralelo; 2 e 3 dependem da 1; 4 fecha por último).
