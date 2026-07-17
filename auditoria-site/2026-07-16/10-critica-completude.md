# Crítica de completude — Portal do Cliente Digital Pampas — 2026-07-16

## Veredito: LACUNAS A FECHAR (poucas e cirúrgicas — 1 mini-rodada obrigatória ✅ EXECUTADA, 1 opcional ✅ EXECUTADA, o resto registra-se no relatório)

A cobertura geral é boa: as 6 telas do escopo foram capturadas e auditadas em desktop e mobile, as 4 dimensões rodaram com achados e com seção "BOM/MANTER", os pulos (conversão, performance, analytics) estão justificados no briefing, o bug reportado pela Ste foi diagnosticado com causa (portal, não DS) e verificado adversarialmente, e a auditoria de métricas — o pedido explícito — foi a mais profunda do pacote.

## Lacunas encontradas (ordenadas por risco)

### [L1] Causa do scroll horizontal em `/replies` mobile não fechava entre os três documentos — Risco: **alto** → **RESOLVIDA por mini-rodada (2026-07-16)**
- **A divergência:** inventário registrava 76px de scroll "com All campaigns"; UI-03 afirmava causa única no Select (exige campanha longa selecionada); A11Y-02 media uma segunda causa (tablist estourando 53px mesmo com All campaigns). 76 ≠ 53.
- **Mini-rodada executada (Playwright, produção, sessão limpa, 390px, "All campaigns" confirmado no selector):**
  - `/replies` → `scrollWidth: 443` = **53px de overflow**;
  - Ofensor único: **a tablist** — botão `_tab_1wcff_4` "Not interested 4" com right=443px. Nenhum elemento do topbar passou de 390.
  - Evidência: `capturas/minirodada-replies-allcampaigns-390.png`.
- **Conclusão:** o A11Y-02 estava certo — **duas causas independentes de overflow**: (1) Select com nome de campanha longo (76-91px, UI-02/03); (2) tablist de Replies sem wrap/scroll próprio (53px, sempre). O "76px com All campaigns" do inventário era o selector preso na EMEA de navegação anterior (efeito colateral do UX-02 — a própria captura sofreu o bug que auditava).
- **Efeito no plano:** o fix da tablist (DS `Tabs`: `overflow-x: auto` no tablist + `flex-wrap: nowrap` nos labels, ou wrap dos tabs) é **item próprio**, não consequência do fix do Select. Critério de aceite do scroll (`scrollWidth === 390`) exige os DOIS fixes.

### [L2] Login `client@acme.com` (papel *client*) nunca visto — Risco: **médio** → **RESOLVIDA por mini-rodada (2026-07-16)**
- Login executado em produção, mobile 390px: **ClientSelector corretamente ausente** (regra "no control without a choice" funcionando); Overview com `scrollWidth: 390` — **sem overflow** no topbar de 1 seletor.
- Evidência: `capturas/minirodada-clientrole-topbar-390.png`.
- **Efeito no plano:** a recomposição do topbar mobile deve ser dimensionada para o caso agency (2 selects); o caso client não regride com as soluções propostas (menos elementos). Testar os dois papéis no aceite.

### [L3] Tema claro visto visualmente só no Overview desktop — Risco: médio-baixo (registrar)
- O a11y instrumentou contraste ao vivo nos DOIS temas e achou as falhas sistêmicas no nível de token — correções valem para todas as telas. Risco residual: pares de cor não medidos.
- **Plano:** critério de aceite pós-fix = varredura de contraste 2 temas × 6 telas.

### [L4] Larguras intermediárias (641–1024px) nunca capturadas — Risco: médio-baixo (registrar)
- O verificador já achou o pior caso de graça: sidebar icons-only fica **visualmente vazia** (UI-05) — beira SEV 4 nesse breakpoint. UI-01 pode reaparecer entre ~521-1100px; os fixes propostos cobrem por construção.
- **Plano:** passe de breakpoints (768px, 1024px) como critério de aceite dos fixes UI-01/UI-05/topbar.

### [L5] Estados nunca vistos ao vivo (dropdown aberto, erro de login, empty state, hover/focus) — Risco: baixo (registrar)
- Avaliados por código; a11y validou semântica/foco por instrumentação. Agendar teste com VoiceOver quando o backend real entrar.

### [L6] Northwind `/replies` e `/reports` não renderizados — Risco: baixo (registrar)
- MET-11/MET-12 baseiam-se no mock (leitura confiável; correção é no dado).

### [L7] Message match portal ↔ site de marketing — Risco: baixo (registrar)
- Cruzar vocabulário canônico ("Meetings booked") com a copy v4 do site na execução do plano (15 min).

## Perguntas do briefing sem resposta

| Pergunta do cliente (briefing) | Respondida? | Onde / o que falta |
|---|---|---|
| Bug "Under 2%" × "Deliverability": causa e correção | **Sim, completa** | UI-01 (portal: `metrics.module.css`, flex sem wrap), verificado |
| Métricas: coerência, matemática, unidades, formatação, benchmarks | **Sim, além do pedido** | MET-01…14 |
| Variações ClientSelector / CampaignSelector | Sim | Capturas + UX-02 |
| Tema claro/escuro | Parcial | Visual só no Overview; contraste instrumentado nos 2 temas → L3 |
| Desktop 1440 + mobile 390 | Sim | Mobile rendeu os achados mais graves |
| Registrar o pulo de performance no relatório | **Instrução ao sintetizador** | Nenhum relatório o carrega ainda |
| Plano executável pelo Opus com regra DS-primeiro | Encaminhada | Todos os achados atribuem causa DS vs portal |

## Contradições entre relatórios (resoluções para o sintetizador)

| Tema | Resolução |
|---|---|
| Scroll horizontal `/replies` | **L1 resolvida:** duas causas (Select + tablist); dois fixes no plano |
| Causa do scroll (geral) | Descartar a solução do UX-06 (hipótese de tabelas/gauges); adotar UI-02/03 + fix de Tabs |
| Ícone de email invisível | Adotar UI-05 (verificado: span vazio no DOM); UX-07 é duplicata do sintoma |
| Fix do badge "Under 2%" | Adotar UI-01 (`flex-wrap`); do UX-08 sobrevive o princípio de proximidade |
| "Settings · soon" | Reconciliável: manter o texto (copy), corrigir a affordance (estado disabled no drawer) |
| Deltas dos KPIs | **Versão do verificador** (remover os 4 deltas+sparklines) — não herdar a versão antiga do 04-copy.md |
| MET-06 | **Versão do verificador**: derivar totais da soma das séries (fonte única) |

## Duplicatas a colapsar
UX-07→UI-05 · UX-06→UI-03+A11Y-02(+fix Tabs) · UX-08→UI-01 · UX-09=MET-09 · UX-10=MET-03 · UX-12=COPY-04(=A11Y title) · UX-03=UI-02=A11Y-01 · UX-04=UI-04.

## Itens conferidos que NÃO são lacuna
- 4 dimensões com achados e seção MANTER; mobile coberto (onde estão os SEV 4); fluxo ponta a ponta percorrido (originou o UX-02); honestidade/dark patterns cobertos (MET-05/13); nenhuma captura órfã; pulos justificados.

## Instruções diretas ao sintetizador
1. L1/L2 executadas — usar os resultados acima.
2. Aplicar os 6 ajustes de `09-verificacoes.md` §C (em especial MET-05/MET-06 na versão do verificador).
3. Registrar: pulo de performance (pedido do briefing), L3–L7 como limitações declaradas, agravante tablet do UI-05.
4. Colapsar duplicatas conforme lista acima.
