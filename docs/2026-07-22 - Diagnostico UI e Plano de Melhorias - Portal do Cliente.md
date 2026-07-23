# Diagnóstico de UI e plano de melhorias visuais: Portal do Cliente

**Produto:** Portal do Cliente Digital Pampas (`client-portal-digital-pampas`)
**Data:** 22 de julho de 2026
**Autora:** Stephanie Schoch (UX/UI e Product Design)
**Escopo:** as 6 telas do portal (Login, Overview, Campaigns, Campaign Detail, Replies, Reports), tema claro e escuro, desktop.
**Base de evidência:** capturas de `auditoria-site/2026-07-16/capturas/` (verificado: nenhum arquivo de `src/` mudou depois de 16/07, então as capturas representam o estado atual) mais leitura do código de composição (`layout.module.css`, `metrics.module.css`, `OverviewPage.tsx`, `app.css`).

---

## Sobre o que este documento é (e o que ele não é)

Já existe uma auditoria de UI datada de 16/07 (`auditoria-site/2026-07-16/03-ui.md`). Aquele documento trata de **bugs e correção**: badge sobreposto, ícones sumindo, overflow horizontal no mobile, alvos de toque pequenos. São defeitos objetivos, e continuam válidos.

Este documento é uma **lente diferente**, a que você levantou: por que o portal "tem cara de AI slop". Não é sobre bug. É sobre **personalidade visual e dinâmica de apresentação**. Um dashboard pode não ter nenhum bug e ainda assim parecer genérico, feito por template, sem ponto de vista. É esse problema que vamos atacar aqui.

Os dois documentos são complementares e devem andar juntos, com uma dependência importante que explico no fim: alguns bugs do relatório de 16/07 (principalmente os ícones que somem) sabotam qualquer trabalho de personalidade, então precisam ser resolvidos antes ou junto.

Um termo para o seu repertório: o que estamos fazendo aqui é uma **crítica de design (design critique)** focada em **qualidade percebida (perceived quality)**, não em conformidade. É o tipo de avaliação que separa "funciona" de "parece caro".

---

## Veredito em uma frase

O portal **não está feio nem quebrado; está genérico**. Ele tem uma identidade forte construída na tela de Login (voz de terminal, "máquina", estética de engenharia) que **não é levada para dentro do app**. Do Overview em diante, o produto cai no padrão mais batido de dashboard SaaS: tudo é o mesmo card, todas as seções têm o mesmo peso, e aparecem os dois clichês mais reconhecíveis de UI gerada por IA (a fileira de 4 KPIs com sparkline e o par de medidores radiais). A boa notícia: a base (tokens, tipografia, cor escassa, paridade claro/escuro) é sólida, então o conserto é de **composição e hierarquia**, não de reconstrução.

---

## O que está BOM e deve ser MANTIDO

Antes de mudar, registrar o que já funciona (redesenhar jogando fora o que era bom é o erro clássico):

- **A tela de Login.** É a mais bem resolvida do produto. Tem um elemento dominante, e a voz de terminal (`> Your pipeline. Live.`, o prefixo `>` nos campos, as credenciais demo em mono) dá personalidade real. Ela é o padrão-ouro que o resto do app deveria alcançar.
- **O trio tipográfico com papéis claros.** Space Grotesk para display e números, Figtree para corpo, JetBrains Mono para labels técnicos. A separação de papéis é disciplinada e é o que sustenta a "voz de máquina".
- **Cor de destaque escassa.** O ciano só acende em estado ativo e semântica de status. Quando algo acende, significa algo (efeito Von Restorff funcionando).
- **Paridade claro/escuro.** Mesmo layout, mesmos pesos, tokens semânticos virando corretamente. Nenhuma regressão entre temas.
- **A arquitetura de tokens e a disciplina de consumir tudo do Design System.** Isso é o que vai permitir corrigir a personalidade de forma sistêmica, em vez de remendo por tela.

Nada abaixo pede jogar isso fora. Pede usar melhor.

---

## O diagnóstico: por que lê como "AI slop"

Nove padrões, do mais estrutural ao mais pontual. Cada um tem: o que é, onde aparece, o princípio violado e a direção de correção. A severidade aqui é **impacto na qualidade percebida**, não em função.

### AS-01 · Monotonia de contêiner: "tudo é o mesmo card" · Impacto ALTO
- **O que é:** KPIs, painéis de gráfico, cards de canal, lista de replies, cards de campanha, tabela de reports: todos usam o mesmo contêiner (mesmo raio, mesma borda de 1px, mesmo preenchimento escuro elevado, mesmo padding). Não há **variação de contêiner por papel**.
- **Onde:** todas as telas, mais evidente no Overview.
- **Princípio:** hierarquia visual. Quando todo bloco tem o mesmo peso de contêiner, nada é primário e nada é secundário. O olho não sabe onde pousar. É o tell número 1 de UI gerada: o padrão "everything is a card".
- **Direção:** definir **papéis de contêiner** (uma linguagem de superfícies). Por exemplo: um painel-protagonista (elevação e/ou contorno de destaque), um painel padrão (o atual), um bloco "quieto" sem card (listas e tabelas podem viver direto sobre a superfície, sem caixa), e conteúdo de dado bruto sem moldura. A regra: **card é para agrupar, não é papel de parede.**

### AS-02 · Hierarquia plana no Overview: nenhuma métrica é a protagonista · Impacto ALTO
- **O que é:** o Overview abre empilhando seções de peso igual (Campaign status, Results, Activity, Channels, Replies), cada uma com o mesmo título e o mesmo espaçamento. Não existe "o número que importa". O cliente entra e não recebe a resposta antes de ler a página inteira.
- **Onde:** `OverviewPage.tsx` (a `.stack` de seções iguais).
- **Princípio:** um dashboard executivo deve começar pela resposta (o conceito de **lede**, emprestado do jornalismo: a primeira linha entrega a notícia). Aqui a notícia (quantas reuniões, quanto de pipeline) está diluída na fileira de KPIs, com o mesmo tamanho de tudo.
- **Direção:** criar uma **abertura com protagonista**. Uma linha-resumo forte logo abaixo do H1 ("12 reuniões marcadas, US$ 95K de pipeline, 27% de respostas interessadas nos últimos 30 dias"), ou promover 1 a 2 métricas a um tamanho claramente dominante, deixando o resto como apoio. O objetivo: em 2 segundos o cliente sabe se a campanha vai bem.

### AS-03 · Os dois clichês: a fileira de 4 KPIs com sparkline e o par de gauges radiais · Impacto ALTO
- **O que é:** duas assinaturas visuais de dashboard genérico.
  1. **A fileira de 4 tiles idênticos** (Meetings / Opportunities / Pipeline / Interested replies), cada um com um mini-sparkline e um delta minúsculo (↓4%, ↑4%). Os sparklines são **decorativos**: não têm escala nem eixo, não dá para ler valor, só "sobe-desce". O delta é pequeno e de baixo contraste.
  2. **O par de medidores radiais (gauges) 98 e 92** no card de Email. Gauge é um clichê de dataviz, ocupa muito espaço para comunicar um número só, e aqui os dois arcos verdes competem com o verde do donut de replies ao lado (dois verdes diferentes na mesma dobra).
- **Princípio:** economia de tinta / relação dado-tinta (data-ink ratio, de Tufte): muito pixel para pouca informação. E clichê de componente = ausência de ponto de vista.
- **Direção:**
  - KPI row: dar ao número um tamanho protagonista, tornar o delta legível e com significado (contra o quê? período anterior?), e ou tornar o sparkline informativo (com referência) ou trocá-lo por algo que agregue (ex.: uma micro-barra de meta atingida). Menos tiles iguais, mais peso no que importa.
  - Gauges: trocar por um tratamento mais compacto e distinto (um medidor linear com faixa boa/limite, ou "número + faixa qualitativa"), e reservar o formato radial para no máximo **um** indicador de assinatura, não dois lado a lado. Alinhar os verdes.

### AS-04 · Ritmo espacial uniforme: falta agrupamento · Impacto MÉDIO
- **O que é:** a `.stack` usa um único `gap` (`--dp-space-300`) entre todas as seções. Tudo respira exatamente igual, então nada se agrupa. O olho lê uma lista plana, não uma composição.
- **Onde:** `layout.module.css:3-7`.
- **Princípio:** Lei da Proximidade (Gestalt): o que está perto se lê como grupo. Ritmo uniforme apaga relações. Um bom layout usa **espaço apertado dentro do grupo e generoso entre grupos**.
- **Direção:** ritmo vertical variável. Ex.: Results + Activity + Channels formam um bloco de "desempenho" mais coeso (espaço menor entre eles), separado por um respiro maior do bloco de status e do bloco de replies. Espaço vira estrutura, não só ar.

### AS-05 · Telas secundárias vazias: o conteúdo flutua num vazio · Impacto MÉDIO
- **O que é:** Reports mostra 3 linhas de tabela num oceano escuro (90% da tela vazia). Campaigns mostra 2 cards ocupando dois terços da largura, deixando o terço direito vazio. O vazio não foi **composto**, então lê como "inacabado", não como "respiro premium".
- **Onde:** `ReportsPage`, `CampaignsPage`.
- **Princípio:** espaço em branco só vira luxo quando é intencional e emoldura algo. Vazio residual (sobra de um grid que não encheu) comunica falta de acabamento.
- **Direção:** compor o vazio. Opções: limitar a largura de leitura (measure) da tabela de Reports e ancorar à esquerda com um resumo ou faixa de contexto ao lado; no Campaigns, dar aos cards um limite de largura e uma coluna de apoio (ou um card de "adicionar/estado" ) para o canvas não ficar meio pintado. Regra: nenhuma tela deve parecer um card solto num fundo grande.

### AS-06 · A voz "terminal/engenharia" do Login não segue para o app · Impacto MÉDIO
- **O que é:** o Login tem caráter (o `>`, o "Your pipeline. Live.", o mono como voz de máquina). Do Overview em diante isso quase some: sobram os eyebrows em mono, mas o resto vira dashboard neutro. A marca da Digital Pampas é justamente "engenharia, a máquina, no black box", e esse é o maior diferencial, subaproveitado.
- **Princípio:** consistência de marca ao longo da jornada. O ativo de personalidade já existe e está construído; o problema é que ele não é levado adiante.
- **Direção:** carregar a voz de terminal para dentro: estados vazios com caráter ("no replies yet, the machine is warming up" em vez de caixa neutra), o indicador de "last sync" como um log de máquina, molduras de seção com a linguagem de linha de comando, micro-copy dos gráficos. Sem exagerar a ponto de virar tema; é tempero, não fantasia.
- **Observação de copy (leve):** os nomes de campanha separam as duas partes com travessão (o nome e o mercado, tipo "Q3 Outbound" e "US Market" ligados por travessão). Dado o seu próprio padrão anti-slop de evitar travessão, e como a voz de máquina combina mais com dois-pontos ou barra, vale considerar trocar por "Q3 Outbound / US Market" ou "Q3 Outbound: US Market" no dado de exibição.

### AS-07 · Paleta genérica "SaaS dark + ciano elétrico" · Impacto MÉDIO (decisão sua)
- **O que é:** o conjunto navy escuro + ciano elétrico + toques de verde/coral é exatamente a paleta padrão de dashboard tech dark. Funciona, mas não diz "Digital Pampas": diz "qualquer SaaS". Há também pequenas incoerências (o verde dos gauges difere do verde do donut; a linha pontilhada vermelha do gráfico de atividade destoa).
- **Princípio:** distinção de marca. Paleta é um dos veículos mais rápidos de personalidade, e a atual é a mais previsível possível para a categoria.
- **Esta é uma decisão que é sua, então apresento as opções com trade-offs, não uma imposição:**
  - **Opção A, manter e só harmonizar (baixo custo, baixo risco):** alinhar os verdes, disciplinar a linha do gráfico, garantir que o ciano seja o único protagonista. Ganho: coerência. Não resolve o "cara de genérico".
  - **Opção B, introduzir uma cor de assinatura quente ligada ao nome (médio custo, médio risco):** "Pampas" remete a campo, terra, entardecer no pampa. Um âmbar/terracota de assinatura, usado com muita parcimônia (um acento, não um tema), diferenciaria do mar de dashboards azul-ciano sem quebrar a estética de engenharia. Ganho: identidade. Custo: precisa entrar como token no DS e ser testado em contraste nos dois modos.
  - **Minha recomendação:** fazer a Opção A já (é limpeza necessária de qualquer jeito) e tratar a Opção B como um experimento na Fase 4, decidido por você depois de ver A no ar. Não dá para "consertar personalidade" só com cor, mas cor ajuda muito quando a hierarquia já estiver resolvida.

### AS-08 · Gráficos com cara de biblioteca default · Impacto MÉDIO
- **O que é:** o gráfico de linha "Activity & responses (30d)" tem linha ciano serrilhada + linha pontilhada vermelha + gridlines completas + labels de eixo em mono pequeno. Mesmo sendo SVG próprio, lê como saída padrão de biblioteca de gráfico. O donut é um donut padrão com número no centro.
- **Princípio:** chartjunk (Tufte de novo): elementos que não carregam dado competem com o que carrega. E estilo default = ausência de assinatura.
- **Direção:** dar tratamento autoral: suavizar/usar área sob a linha para volume, reduzir gridlines ao mínimo (ou trocar por poucas linhas de referência), legenda mais integrada, formatação de número consistente. O objetivo é que o gráfico pareça desenhado para este produto, não colado de um kit. Atenção: esses componentes vivem no Design System (LineChart, DonutChart, Gauge), então o ajuste é lá, não no portal (ver nota de governança no fim).

### AS-09 · Títulos de seção pesados e repetitivos competindo com o H1 · Impacto BAIXO
- **O que é:** os títulos de seção ("Campaign status", "Results", "Channels") usam `--dp-font-size-300` semibold. Esse token é 32px (o relatório de 16/07, achado UI-10, já apontou que o fallback do código sugere 20px mas o token real é 32px). São títulos grandes e pesados, repetidos 5 vezes descendo a página, brigando com o próprio H1 "Overview".
- **Onde:** `layout.module.css:9-15`.
- **Princípio:** hierarquia tipográfica. Se o subtítulo tem quase o peso do título, o título deixa de liderar.
- **Direção:** rebaixar os títulos de seção (menor, ou no estilo eyebrow em mono, ou peso menor) para que o H1 lidere e as seções recuem. De passagem, resolver o descompasso de token do UI-10 para os tamanhos serem intencionais.

---

## Resumo do diagnóstico

| # | Achado | Impacto na qualidade percebida | Onde mora o ajuste |
|---|---|---|---|
| AS-01 | Monotonia de contêiner (tudo é o mesmo card) | Alto | Portal (composição) |
| AS-02 | Hierarquia plana no Overview, sem protagonista | Alto | Portal (Overview) |
| AS-03 | Clichês: fileira de KPI+sparkline e par de gauges | Alto | Portal + DS |
| AS-04 | Ritmo espacial uniforme, sem agrupamento | Médio | Portal (layout) |
| AS-05 | Telas secundárias vazias, conteúdo flutuando | Médio | Portal (Reports, Campaigns) |
| AS-06 | Voz de terminal do Login não segue para o app | Médio | Portal (copy + estados) |
| AS-07 | Paleta genérica SaaS dark + ciano | Médio (decisão sua) | DS (tokens) |
| AS-08 | Gráficos com cara de biblioteca default | Médio | DS (charts) |
| AS-09 | Títulos de seção pesados competindo com o H1 | Baixo | Portal (layout) + DS (token) |

---

## Oportunidade de assinatura: o infográfico animado do fluxo de infraestrutura

Esta é a adição mais importante ao plano, e o **antídoto mais forte contra o "AI slop"** de todo o documento. Um diagrama de fluxo autoral e animado é, por definição, o oposto de um template: nenhum dashboard de prateleira tem um. Ele ataca de uma vez os achados AS-03 (clichês), AS-06 (personalidade) e AS-08 (visuais genéricos), e ainda dá ao produto uma peça-assinatura.

**De onde vem.** Nos case studies atuais (ex.: `digitalpampas.com/case-studies/cybersecurity-firm.html`), o cliente já colocou uma demonstração do fluxo da infraestrutura construída para a campanha: um mapa de sistema desenhado à mão (a imagem `cybersecurity-system-map.png`), na seção "The system". A ideia é transformar esse mapa estático num **infográfico animado**, apresentando o fluxo passo a passo: o que alimenta o quê, qual camada influencia a outra, onde ficam as trilhas de segurança e onde tudo termina.

**Regra inegociável de conteúdo:** o conteúdo é do cliente. Reproduzir **exatamente** o texto que está no mapa, sem alterar nada. Nenhuma reescrita, nenhuma "melhoria" de copy. O trabalho é de forma e movimento, não de conteúdo. (Bônus: o texto do cliente não usa travessão, então reproduzir verbatim não conflita com o padrão anti-slop.)

### O conteúdo exato (verbatim do mapa do cliente)

**Título do fluxo:** `zero infrastructure on day 0. first campaign live on day 27.`

**Texto de abertura (da seção "The system"):** "One engine, six layers. Data flows left to right: a tiered target universe feeds a Clay enrichment engine, buying signals decide who gets contacted and with what message, and safety rails sit under everything before a single email leaves."

**Os 7 nós (com a cor de borda do original):**

| Nó | Cor de borda (original) | Conteúdo verbatim |
|---|---|---|
| TARGET UNIVERSE | verde/teal | 4 ICP tiers, 5 personas · Tier 1: embedded / hardware · only 500-800 companies exist · deals $7K to $150K+ |
| DATA ENGINE (Clay) | ciano | 25,000 contacts enriched · 11-provider email waterfall · AI attack-surface tags · scoring + batch routing |
| SIGNAL ENGINE | verde/teal | 6 automated buying signals: · new CISO . funding . launch · certification . gov contract · security incident |
| SAFETY RAILS | coral/vermelho | 135+ company DNC list · max 3 contacts / company · bounce + saturation monitors · stop-on-reply, all channels |
| EMAIL (Instantly) | ciano | 12 campaigns: · 5 signal-triggered · 2 deep personalization · 3 volume tests . 2 intel |
| LINKEDIN (Aimfox) | ciano | 5 campaigns · 4 sender personas · defense + space splits · coordinated w/ email |
| OPERATIONAL HANDOFF | verde/teal | day 63: full documentation · the client team runs it solo |

**Anotação de resultado (texto coral, sem caixa, canto inferior esquerdo):** `1.6% bounce rate. 3,247 leads pushed to 3 variants in one afternoon.`

### As conexões (as flechas, exatamente onde estão no original)

O infográfico tem que manter as flechas nos mesmos lugares e nas mesmas cores do mapa do cliente. São 9 conexões:

1. TARGET UNIVERSE liga em DATA ENGINE (ciano, horizontal, linha de cima)
2. DATA ENGINE liga em SIGNAL ENGINE (ciano, horizontal, linha de cima)
3. DATA ENGINE liga em EMAIL (ciano, descendo)
4. SIGNAL ENGINE liga em LINKEDIN (ciano, descendo)
5. SIGNAL ENGINE liga em EMAIL (cinza, diagonal, o sinal influenciando o e-mail)
6. SAFETY RAILS liga em EMAIL (coral, horizontal, guardando o canal)
7. EMAIL liga em OPERATIONAL HANDOFF (cinza, diagonal, convergindo)
8. LINKEDIN liga em OPERATIONAL HANDOFF (cinza, diagonal, convergindo)
9. A anotação de resultado (1.6% bounce...) aponta para EMAIL (coral, subindo)

A lógica das cores das flechas (que dá para preservar como sistema): ciano = fluxo principal de dados, cinza = convergência para o handoff, coral = segurança e resultado.

### A animação (a apresentação passo a passo)

A animação conta a construção da máquina na ordem em que o dado flui, com fallback estático obrigatório. Roteiro em cenas:

1. O título "zero infrastructure on day 0..." aparece.
2. **A esteira de dados monta da esquerda para a direita:** TARGET UNIVERSE surge, a flecha 1 desenha, DATA ENGINE surge, a flecha 2 desenha, SIGNAL ENGINE surge.
3. **Os canais acendem:** as flechas 3, 4 e 5 desenham (data e signal descendo para os canais) e EMAIL e LINKEDIN surgem.
4. **A segurança entra por baixo:** SAFETY RAILS surge e a flecha 6 desenha para dentro do EMAIL (as trilhas de segurança que "ficam sob tudo").
5. **A convergência:** flechas 7 e 8 desenham e OPERATIONAL HANDOFF surge.
6. **O resultado:** a anotação coral "1.6% bounce rate..." desenha a flecha 9 apontando para o EMAIL. Estado final segura.

Regra de acessibilidade (a mesma do resto do sistema): em `prefers-reduced-motion`, mostrar o mapa completo estático, idêntico ao original, sem movimento. A animação nunca é pré-requisito para entender o conteúdo.

### Onde mora (Design System primeiro)

Seguindo a regra dura do projeto (**componente novo nasce no Design System, nunca direto no produto**), isto vira um componente reutilizável do DS, algo como `FlowDiagram` (ou `SystemMap`), guiado por dados (nós + conexões + cor + ordem de animação), com a acessibilidade e o `reduced-motion` embutidos. O conteúdo do case da cybersecurity é o primeiro dataset dele. Fluxo: primitivos e tokens semânticos de cor de nó/flecha no DS, o componente no DS, showroom atualizado, e só então os produtos consomem.

**Dois lugares consomem o mesmo componente:**
- **Site (case studies):** substitui/eleva o PNG estático pela versão animada e acessível. É a casa natural do conteúdo.
- **Portal (Campaign Detail):** o mesmo componente, alimentado pelos dados de cada campanha, vira o "aqui está a máquina que construímos para você". Para o portal, esse é o golpe anti-slop mais forte: troca o clichê por uma peça que conta a história da infraestrutura do cliente. (Placement a confirmar com você; minha recomendação é começar pelo case study no site, que já tem o conteúdo, e depois generalizar para o portal.)

---

## Plano de correção por fases

Sequenciado por dependência e por relação impacto/esforço. A lógica: primeiro a fundação de hierarquia (destrava tudo), depois a tela mais vista, depois os clichês, depois as telas vazias, e por fim o polimento de personalidade. Cada fase entrega valor visível sozinha.

Antes de tudo, uma **Fase 0 de pré-requisito herdada do relatório de 16/07**, porque sem ela qualquer polimento parece inacabado.

### Fase 0 · Destravar o que sabota a percepção (pré-requisito)
**Objetivo:** remover os defeitos que fazem o produto parecer barato antes de falar de estética.
- Corrigir os **ícones que somem** (UI-05 do relatório de 16/07: o guard do `Icon` do DS devolve null para todo ícone válido). Um app sem iconografia parece um rascunho, e isso contamina toda a avaliação visual. **Este é o item de maior retorno imediato.**
- Corrigir o **badge sobreposto** no card de Email (UI-01) e o **overflow horizontal mobile** do CampaignSelector (UI-02/03).
- Resolver o **descompasso de token de tamanho** (UI-10), para os próximos ajustes tipográficos partirem de valores intencionais.
- **Esforço:** M · **Risco:** baixo · **Toca o DS:** sim (Icon, Select).

### Fase 1 · Fundação de hierarquia (a linguagem de composição do portal)
**Objetivo:** dar ao portal um sistema de peso, para nada mais ser "tudo igual". Destrava AS-01, AS-04, AS-09.
- Definir os **papéis de contêiner** (protagonista, padrão, quieto/sem card, bruto) e aplicar como classes de composição no portal.
- Introduzir **ritmo vertical variável** na `.stack` (agrupar Results/Activity/Channels; separar com respiro maior os blocos de status e replies).
- **Rebaixar os títulos de seção** para o H1 liderar.
- **Esforço:** M · **Risco:** baixo (é CSS de composição no portal) · **Toca o DS:** não.
- **Critério de pronto:** ao abrir o Overview, o olho pousa primeiro num ponto claro, e as seções se leem como 3 grupos, não 5 blocos iguais.

### Fase 2 · Overview com protagonista (a tela mais vista)
**Objetivo:** o cliente entra e recebe a resposta em 2 segundos. Resolve AS-02 e a metade "KPI" do AS-03.
- Criar a **abertura com protagonista** (linha-resumo forte ou 1 a 2 métricas dominantes abaixo do H1).
- Reformular a **fileira de KPIs**: número protagonista, delta legível e com referência clara, sparkline informativo ou substituído.
- Aplicar os papéis de contêiner da Fase 1 para dar foco ao bloco de resultado.
- **Esforço:** M a L · **Risco:** médio (muda a composição da tela principal) · **Toca o DS:** talvez (se o StatCard mudar de forma, é no DS).
- **Critério de pronto:** teste dos 5 segundos, alguém que nunca viu diz qual é o número mais importante da tela.

### Fase 3 · Repensar os componentes-clichê e os gráficos
**Objetivo:** tirar as duas assinaturas de "dashboard genérico". Resolve a metade "gauges" do AS-03, o AS-08 e a parte de harmonização do AS-07.
- Substituir o **par de gauges** por um tratamento mais compacto e distinto; no máximo um medidor de assinatura.
- Dar **tratamento autoral aos gráficos** (linha/área, menos chartjunk, legenda integrada, números consistentes).
- **Harmonizar a paleta** (Opção A do AS-07): alinhar verdes, disciplinar a linha do gráfico, garantir o ciano como único protagonista.
- **Esforço:** L · **Risco:** médio (esses componentes são do DS, exigem coordenação) · **Toca o DS:** sim (Gauge, LineChart, DonutChart).

### Fase 4 · Compor as telas vazias e carregar a personalidade
**Objetivo:** nenhuma tela parece inacabada, e a voz de marca atravessa o app. Resolve AS-05, AS-06 e a decisão da Opção B do AS-07.
- **Compor Reports e Campaigns** (medida de leitura, ancoragem, contexto de apoio) para o vazio ser intencional.
- **Carregar a voz de terminal** para estados vazios, "last sync", molduras e micro-copy. Ajustar os nomes de campanha para sem travessão.
- **Decisão da cor de assinatura** (Opção B): você decide, depois de ver a Fase 3 no ar, se vale introduzir o acento quente ligado ao "Pampas". Se sim, entra como token no DS com contraste testado nos dois modos.
- **Esforço:** M · **Risco:** baixo (exceto a decisão de cor, que é sua) · **Toca o DS:** só se a Opção B for aprovada.

### Fase 5 · Componente de assinatura: o infográfico animado do fluxo de infraestrutura
**Objetivo:** entregar a peça-assinatura que tira o produto do genérico de vez. Detalhada na seção "Oportunidade de assinatura" acima.
- Construir o componente `FlowDiagram` (ou `SystemMap`) **no Design System primeiro**: tokens de cor de nó/flecha, o componente guiado por dados, animação em cenas, fallback `reduced-motion`, showroom.
- Primeiro dataset: o conteúdo verbatim do case da cybersecurity, com as 9 flechas nas mesmas posições e cores do original.
- Consumir no site (case study) e, depois, no portal (Campaign Detail).
- **Esforço:** L · **Risco:** médio (é a peça mais autoral, e é do DS) · **Toca o DS:** sim (componente novo).
- **Independência:** por ser um componente autocontido, pode ser construído **em paralelo** às fases de composição do portal, como uma linha de trabalho do DS. Não depende da Fase 1.
- **Critério de pronto:** o fluxo se lê sozinho passo a passo; as flechas batem com o original; em `reduced-motion` o mapa estático é idêntico ao do cliente; conteúdo verbatim, zero alteração.

### Sequência e por que nesta ordem
| Fase | Entrega | Esforço | Risco | Depende de |
|---|---|---|---|---|
| 0 | Tira o que parece barato (ícones, bugs) | M | Baixo | Nada |
| 1 | Sistema de peso e ritmo | M | Baixo | Nada (paralela à 0) |
| 2 | Overview com protagonista | M-L | Médio | Fase 1 |
| 3 | Fim dos clichês, gráficos autorais | L | Médio | Fase 1 |
| 4 | Telas compostas, personalidade, cor | M | Baixo | Fases 2 e 3 |
| 5 | Infográfico animado do fluxo (assinatura) | L | Médio | Nada (linha do DS, em paralelo) |

Fases 0, 1 e 5 podem correr em paralelo (0 e 1 no portal, 5 no DS). As Fases 2 e 3 dependem da linguagem de contêiner da Fase 1. A Fase 4 fecha, depois que o resto está no ar. A Fase 5 é a de maior impacto de percepção, então vale priorizá-la assim que a Fase 0 destravar os ícones.

---

## Nota de governança (importante, e conecta com o seu squad de agentes)

Vários dos ajustes visuais (gauges, gráficos, StatCard, tokens de cor) moram no **Design System**, não no portal. A regra que você mesma estabeleceu no squad de auditoria vale aqui: **componente visual reutilizável se conserta no DS e o portal importa; não se remenda direto no portal.** Se um gauge ou um estilo de gráfico for alterado dentro de `client-portal-digital-pampas`, o seu agente `ds-drift` vai (com razão) apontar isso como fluxo inverso na próxima auditoria.

Portanto, na hora de executar: classificar cada mudança em "é do DS" (Gauge, LineChart, DonutChart, StatCard, tokens de cor, token de tamanho do título) versus "é composição só do portal" (papéis de contêiner, ritmo da `.stack`, abertura do Overview, composição de Reports/Campaigns, copy dos estados). O primeiro grupo sobe para o DS, com showroom atualizado; o segundo fica no portal. Rodar `/ds-auditoria` ao final fecha o ciclo e confirma zero drift.

---

## Uma frase para levar

O portal já tem a alma certa: ela está na tela de Login. O trabalho não é inventar personalidade, é **estender para dentro do app a personalidade que você já criou**, e trocar os componentes de prateleira por decisões de hierarquia. É por isso que o conserto é mais barato do que parece: a base é boa, falta ela liderar.
