# Briefing — Auditoria do Portal do Cliente Digital Pampas
*2026-07-16 · Modo A adaptado (app logado) · Orquestrador: Claude (Fable)*

## Alvo
- **Produção:** https://digital-pampas-portal.vercel.app/ (HTTP 200 — auditar ESTA versão; é a que a Ste está olhando)
- **Código local (referência):** `/Users/ste1990/projetos-digitais/case-digital-pampas/client-portal-digital-pampas`
- **Login demo (mock, público no código):** `demo@digitalpampas.com` / `pampas2026` (papel *agency* — enxerga 2 clientes: Acme Co. e Northwind Labs, aciona o ClientSelector). Login secundário: `client@acme.com` / `acme2026` (1 cliente — sem ClientSelector).

## Situação
Produto que a **Ste está construindo** para o cliente real (Léo, Digital Pampas). Dados de demonstração (mock); back-end Supabase ainda não plugado. UI consome o DS `@steschoch/digital-pampas-ds` (regra do projeto: componente novo nasce no DS, site/portal só consomem).

## Negócio e "conversão"
Portal B2B onde clientes da agência acompanham campanhas outbound (envios, replies, reuniões, fases). Não há funil de compra — a "conversão" aqui é **confiança via transparência**: o cliente entende o estado da campanha sem precisar mandar e-mail. Não é e-commerce → checklist Baymard **não se aplica**.

## Escopo (tudo dentro — 6 telas)
1. `/login` — Login (estética terminal)
2. `/` — Overview (dashboard; **bug reportado pela Ste aqui**)
3. `/campaigns` — lista de campanhas
4. `/campaigns/:id` — detalhe (funil, timeline de fases, métricas por canal)
5. `/replies` — respostas
6. `/reports` — relatórios

Variações a cobrir: ClientSelector (Acme ↔ Northwind), CampaignSelector (All campaigns ↔ campanha específica), tema claro/escuro (se houver toggle no shell), desktop 1440px + mobile 390px.

## Bug já reportado pela Ste (verificar e diagnosticar)
No **Overview**, na área de métricas de **e-mail**, a tag **"Under 2%"** aparece **sobreposta/encostada** ao label **"Deliverability"** — parece elemento perdido/mal posicionado. Encontrar a causa (componente do DS? CSS do portal?) e propor correção.

## Dimensões
- **Rodam:** capture → UX + UI + copy/microcopy + a11y (paralelo) → verifier (SEV 3-4) → critic → synthesizer.
- **Copy inclui auditoria de MÉTRICAS** (pedido explícito): nomes/labels coerentes entre telas, matemática consistente (sent→replies→rate), unidades, formatação de números, benchmark tags (ex.: "Under 2%") fazendo sentido semântico.
- **Pulados:** `conversao` (app logado sem funil de persuasão — fricção de login é coberta por UX), `performance` (telas logadas inacessíveis ao PageSpeed; valor baixo — registrar no relatório), `analytics` (dados mock, sem tráfego real).

## Saída final
**Somente plano** (sem executar): `client-portal-digital-pampas/docs/Plano Melhorias Portal 2026-07-16.md`, detalhado para o **Opus** executar depois, respeitando a regra DS-primeiro e o ciclo de release do DS (bump → publish → install no portal).

## Fora de escopo
- Correções (nada será alterado agora).
- Back-end/dados reais (Supabase) — já especificado em outro documento.
- Performance de rede/Lighthouse e analytics (motivos acima).
