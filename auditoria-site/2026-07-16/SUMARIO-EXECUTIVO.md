# Sumário executivo — Auditoria do Portal do Cliente — 2026-07-16

*Para decisão rápida. O detalhe técnico completo, com correção validada por achado, está em `RELATORIO-FINAL.md` (IDs C-01 a C-43).*

## O veredito em 3 frases

1. **O portal é bom.** A arquitetura está certa (a primeira coisa que o cliente vê é "em que fase estamos?"), o tom é honesto do login ao rodapé (zero texto promocional vazio — raro), e a base técnica e de acessibilidade está acima da média: o tema escuro passa em todos os 26 pares de contraste medidos e 14 critérios WCAG já são aprovados.
2. **O que ameaça a promessa "no black box" não é o design — são os números que não fecham e o celular quebrado.** O mesmo "Replies" vale 583, 123 e 402 dependendo da tela; as setas de tendência dos 4 indicadores principais exibem um número que não mede o que a etiqueta diz; e no celular o cliente literalmente **não consegue trocar de campanha** (os botões do topo se sobrepõem) nem ler em que fase a campanha está.
3. **Quase tudo é pequeno e já está diagnosticado na linha exata do código:** dos 43 problemas consolidados, ~33 são correções pequenas, e os 4 críticos foram confirmados por verificação adversarial independente — nenhum foi refutado.

## Os 5 problemas que mais custam confiança hoje

1. **Link compartilhado ou F5 = página de erro 404 (C-01).** O momento em que o portal mais gera valor — "olha o andamento aqui: [link]" — é exatamente quando ele parece fora do ar. Corrige-se com **uma linha de configuração** no deploy.
2. **Os números não batem entre telas (C-02, C-32).** Replies da mesma campanha: 583 na lista, 123 no detalhe, 402 no relatório; o gráfico diário soma 59% a mais do que os totais exibidos. O cliente deste produto é precisamente quem confere números — e conclui que a agência não sabe somar ou esconde dados. Correção: alinhar o dado de demonstração a uma regra única ("toda reply é categorizada"), valores já calculados no relatório.
3. **As setas de tendência dos indicadores são falsas (C-03).** "Meetings booked ↓4%" não tem relação nenhuma com meetings — três cards exibem a mesma variável reciclada, e os 4 deltas idênticos entregam o truque. Correção: **remover** os deltas até existirem séries reais (número honesto ausente > número inventado presente).
4. **O celular está inutilizável nos pontos-chave (C-04, C-18, C-07).** O seletor de campanha — o controle que define o que TODAS as telas mostram — fica coberto pelo avatar e pelo botão de tema (o toque dispara a ação errada, reproduzido em teste); a seção de fases vira texto embaralhado; e há scroll lateral por **duas causas independentes** (seletor + abas de Replies), que exigem **dois** consertos.
5. **Toda a iconografia do produto sumiu sem ninguém avisar (C-05).** Um guard de 1 linha no Design System descarta 100% dos ícones (menu, e-mail, download…) — e em tablet a navegação lateral fica **visualmente vazia**. Correção de 1 linha + release do DS, devolve os ícones do portal e do site de uma vez.

**Bônus de coerência com a marca:** "Last sync: 2h ago" congelado num relógio fictício (C-11) e botão "PDF" que baixa CSV (C-20) são pequenos, mas são o tipo de detalhe que um prospect encontra em 2 minutos de demo — e o produto vende "só números verdadeiros".

## O que está forte (não mexer no redesign)

- **A ordem certa das informações:** fase da campanha → resultados → atividade → provas (respostas reais com nome e cargo). Elogiada independentemente por 3 dos 4 especialistas.
- **Transparência como padrão de escrita:** "Planned vs Actual" mostrando atraso real, "EXPORT IS A DEMO", "Settings · soon", empty states que explicam o porquê — e zero marketese. Isso É o produto; proteger.
- **A matemática de agregação está certa** (somas e médias ponderadas conferidas): os furos estão nos dados de demonstração, não na lógica.
- **Design System maduro:** tokens em camadas, trio tipográfico com papéis claros, cor de destaque usada com parcimônia, paridade claro/escuro de layout, foco visível consistente.
- **Base de acessibilidade acima da média:** gráficos com tabela de dados para leitor de tela (padrão-ouro), drawer e tabs com ARIA correto, login exemplar, tema escuro 100% aprovado em contraste. (As falhas de contraste estão concentradas no **tema claro** e são corrigíveis em nível de token.)

## Números da auditoria

| | |
|---|---|
| Telas auditadas | 6 rotas × desktop 1440 + mobile 390, temas claro/escuro, variações de cliente/campanha (24 capturas + 2 mini-rodadas) |
| Dimensões | UX, UI, Copy + **Métricas** (pedido explícito), Acessibilidade — conversão/performance/analytics puladas com justificativa de briefing |
| Achados | 58 brutos → **43 consolidados**: 4 críticos · 15 graves · 14 moderados · 10 menores |
| Esforço | ~33 dos 43 são correções **pequenas** (linhas de código/CSS/dado); nenhuma exige refazer telas |
| Verificação | **6/6 achados críticos confirmados** por verificadores adversariais independentes (2 soluções melhoradas no processo); todos os demais graves têm dupla evidência; **0 achados refutados** |
| Bug reportado pela Ste | Diagnosticado: causa no **portal** (flex sem wrap em `metrics.module.css`), não no DS; correção de 2 linhas, validada (C-06) |

**Recomendação de sequência:** (1) os quick wins críticos — C-01, C-02, C-03, C-05, C-06 — são todos pequenos e removem os maiores riscos de credibilidade em uma sessão de trabalho; (2) o pacote mobile (C-04 + C-07 + C-18), que concentra as correções no DS num único ciclo de release; (3) o pacote tema claro (C-14/15/16) + navegação (C-19). O plano detalhado para execução sai da tabela-mestra do relatório final.
