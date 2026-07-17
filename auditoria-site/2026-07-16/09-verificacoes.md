# Verificações adversariais — Portal do Cliente — 2026-07-16

6 achados críticos de fonte única receberam verificador adversarial dedicado (1 achado : 1 agente, instrução de REFUTAR). **Resultado: 6/6 CONFIRMADOS** — 3 com refinamento de solução. Os demais SEV 3-4 tinham dupla evidência independente prévia (ver §B).

## A) Verificados por agente dedicado

| Achado | Veredito | Refinamentos do verificador |
|---|---|---|
| **UI-01** badge "UNDER 2%" × "Deliverability" (SEV 3) | ✅ CONFIRMADO | Aritmética da sobreposição conferida (35,97×11,5px ✓). Cadeia CSS validada (nenhum `overflow:hidden` na cadeia). Correção `flex-wrap: wrap` validada sem efeito colateral em telas maiores; hipótese alternativa (mexer no grid) refutada como curativa. Ressalva menor: `align-items: baseline` alinha cada linha do wrap independentemente — aceitável. |
| **MET-01** Replies 583/123/402 (SEV 4) | ✅ CONFIRMADO (com ressalva) | Toda a aritmética conferida número a número (522+61=583; 34+21+68=123; 402+118≈522; correção {163,99,321}=583 ✓; EMEA {4,5,11}=20 ✓; ABM já consistente). **Núcleo do bug: 583 vs 123** — o donut diz "123 TOTAL REPLIES" na mesma página em que o funil soma 583. A perna "402" é agravante secundário (tem coluna PERIOD explícita). Agregado pós-correção: 603, consistente em todas as telas. |
| **MET-04** off-by-one de timezone nos Reports (SEV 3) | ✅ CONFIRMADO | Cadeia causal completa código→UI (3 linhas mensais com −1 dia sistemático; maio também). Mecanismo é spec ECMA-262 (date-only = meia-noite UTC). **Ressalva de implementação: aplicar `timeZone:'UTC'` SÓ a entradas date-only** (detectar `/^\d{4}-\d{2}-\d{2}$/`) — senão desloca timestamps completos como `receivedAt`. |
| **MET-05** deltas falsos dos KPIs (SEV 4) | ✅ CONFIRMADO | 3 cards renderizam literalmente a mesma variável `repliesTrend.delta`; não existe série de meetings/opportunities/pipeline no contrato (`types.ts`). Correções de citação: arquivo é `src/components/metrics/kpi.ts` (não `src/lib/`); linha 64 (não 66); no escopo Northwind a série é `linkedinReplies`. **Solução original parcialmente refutada:** manter delta em "Interested replies" ainda mentiria (série é de replies TOTAIS, não interested). **Solução correta: remover delta+sparkline dos 4 cards**; futuro: derivar tendência do histórico de snapshots (design do back-end já prevê). |
| **MET-06** soma das séries ≠ totais (era confiança média, SEV 2) | ✅ CONFIRMADO com dados reais | Somou as 90 linhas da tabela acessível: **Emails 19.742 vs 12.430 exibidos (+59%); Replies 893 vs 583 (+53%)**. EMEA idem (~+55%). Independência confirmada: `buildSeries(seed, base, peak)` não recebe nada do snapshot. Solução preferível à proposta: **derivar os totais a partir da soma das séries** (fonte única) em vez de normalizar a série. |
| **UI-05** todos os ícones lucide somem (SEV 3) | ✅ CONFIRMADO | Guard confirmado no fonte E no `dist/` consumido; lucide-react v1.23.0 instalada usa `forwardRef` (typeof `'object'`) → guard devolve null para 100% dos nomes. Contra-evidência conferida: só SVGs inline renderizam. Hipóteses alternativas (tree-shaking, CSS, versão) descartadas. **Agravante: em tablet a sidebar colapsa para icons-only → navegação visualmente VAZIA (beira SEV 4 nesse breakpoint).** Solução melhor que a proposta: usar o export nomeado `icons` do lucide-react (`import { icons } from 'lucide-react'`) + guard simples `if (!LucideIcon) return null`; o teste canônico para component types é `isValidElementType` de `react-is`. |

## B) Aceitos por dupla evidência independente (sem verificador dedicado)

| Achado | Evidência 1 | Evidência 2 |
|---|---|---|
| **UX-01** 404 em deep-link/F5 (SEV 4) | Captura reproduziu o 404 | **Orquestrador reproduziu por curl** (4 rotas → 404) + `vercel.json` lido sem `rewrites` (mesmo bug já corrigido no site em 2026-07-16) |
| **UX-02** seletor de campanha sequestra navegação (SEV 3) | Comportamento reproduzido na captura (2 estados capturados) | Causa em 3 pontos do código citados e conferidos pelo UX |
| **UX-03/UI-02/A11Y-01** topbar mobile sobreposto (SEV 3-4) | Bounding boxes medidos na captura + clique interceptado | Instrumentação ao vivo independente do a11y (medições próprias) + mecânica CSS pelo UI (min-content + paint order) |
| **UX-04/UI-04** stepper ilegível mobile (SEV 3) | Screenshot (texto estilhaçado legível na imagem) | CSS do Timeline conferido pelo UI (`overflow-wrap: anywhere` + colunas de 42px) |
| **UI-03/A11Y-02** scroll horizontal mobile (SEV 3) | Medição da captura (76-91px) | Dois diagnósticos independentes convergentes (UI: largura física das capturas ÷3; a11y: rect do trigger 466px — 466−390=76 exato) |
| **MET-03/UX-10** "(30d)" cobrindo 90 dias (SEV 2-3) | Eixo x do screenshot (abril→julho) | Título hardcoded + série sem recorte no código |
| **A11Y-03/04/05** contrastes do tema claro (SEV 3) | Calculados por script ao vivo (getComputedStyle), nunca a olho | Tokens hex conferidos no globals.css |
| **MET-13** "Last sync: 2h ago" congelado (SEV 3) | `DEMO_NOW` fixo no código | Dados terminando em 2026-07-01 visíveis na captura |

## C) Impacto das verificações no relatório final
1. MET-05: substituir a solução original pela do verificador (remover 4 deltas; tendência futura via histórico de snapshots).
2. UI-05: solução preferida = export `icons` do lucide; adicionar o agravante do tablet (sidebar icons-only vazia).
3. MET-04: constraint de implementação (UTC só para date-only).
4. MET-06: elevar de "confiança média" para confirmado com números (+59%/+53%); solução por fonte única.
5. MET-01: redigir com 583-vs-123 como núcleo; 402 como agravante.
6. Citações de arquivo/linha do MET-05 corrigidas (kpi.ts em components/metrics).
