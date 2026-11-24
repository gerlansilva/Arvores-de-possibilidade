# Sistema de design — Árvore de possibilidades

Este documento registra as decisões visuais que o código já aplica. Ele não
substitui `docs/decisoes.md` (pedagogia e arquitetura); serve para quem for mexer
na interface sem redescobrir as regras a cada tela.

> **Redesign de 24/11/2026.** Este documento descreve a versão anterior (barra escura, cinzas frios, texto de 12 px). A interface agora segue `docs/auditoria-ui.md`: paleta marfim/papel/verde-folha e terra (`src/styles/tokens.css`), Atkinson Hyperlegible Next embutida, texto a partir de 14–16 px, alvos de 44 px, e a árvore no centro da Mesa. Os ajustes ficam em `src/styles/tema.css`. A tabela de tokens abaixo ainda lista os valores antigos; consulte `tokens.css`.

## Princípio

É um aplicativo de bancada, não um site. A janela ocupa `100dvh`, cada painel
rola por conta própria e nada empurra a página inteira. A criança vê peças e
montagens; a interface desaparece. Cores, sombras e movimento existem para
separar planos, não para chamar atenção.

## Planos

Quatro superfícies, nenhuma a mais. A prancha com os valores e os contrastes
está em `docs/paleta.svg`.

- **Estrutura** (`--barra`): a moldura do programa. Marca, atividade, abas e
  status. Nada de conteúdo.
- **Bancada** (`--fundo`): o espaço entre as coisas. Fundo da janela, bandeja,
  lista de atividades, ferramentas.
- **Papel** (`--painel`): onde se trabalha. Palco, mapa, folha do
  registro, comparação. Um por região.
- **Recesso** (`--painel-2`): objetos e dados. Miniaturas, guardadas, cartões da
  coleção, campos, faixas do mapa.

A seleção sobe ao papel: o objeto no recesso vira branco com anel de acento. É
assim que a coleção distingue o que foi escolhido do que está disponível.

## Tokens

Fonte única: `src/styles/tokens.css`.

| Grupo | Token | Valor | Papel |
|---|---|---|---|
| Plano | `--fundo` | `#e7eaed` | bancada |
| | `--painel` | `#ffffff` | papel: onde se trabalha |
| | `--painel-2` | `#eff2f5` | recesso: objetos e dados |
| | `--painel-3` | `#e5e9ed` | recesso pressionado |
| Linha | `--borda` | `#d2d8de` | contorno de papel |
| | `--borda-forte` | `#b6bfc8` | contorno de controle |
| | `--linha` | `#e4e8ec` | divisória interna |
| Tinta | `--texto` | `#1b232a` | títulos e conteúdo |
| | `--texto-2` | `#3f4a55` | corpo e apoio |
| | `--texto-3` | `#5f6a75` | rótulos e metadados |
| Acento | `--acento` | `#176b56` | ação, etapa, seleção, caminho |
| | `--acento-forte` | `#115344` | pressão e texto sobre seleção |
| | `--acento-suave` | `#e4f0eb` | fundo de seleção |
| | `--acento-borda` | `#a9c9bd` | borda de seleção e peça em uso |
| | `--sobre-acento` | `#ffffff` | texto sobre acento |
| | `--acento-fantasma` | `rgba(23,107,86,.08)` | destino de encaixe no arrasto |
| Estado | `--perigo` | `#a33a2a` | erro e ação destrutiva |
| | `--perigo-forte` | `#8b3022` | hover de perigo |
| | `--perigo-suave` | `#fbeae7` | fundo de perigo |
| Estrutura | `--barra` | `#23282f` | barra de título, abas e status |
| | `--barra-borda` | `#1a2026` | base da barra |
| | `--barra-texto` | `#e8ebee` | texto principal no escuro |
| | `--barra-texto-2` | `#a4aeb8` | texto de apoio no escuro |
| | `--barra-acento` | `#6fc3aa` | etapa atual e marca no escuro |
| | `--barra-linha` / `--barra-realce` | `rgba(255,255,255,.18)` / `.14` | separadores e contadores |
| | `--barra-hover` | `rgba(255,255,255,.07)` | hover na barra |
| Raio | `--raio` / `--raio-painel` | `5px` / `8px` | controle / papel |
| Sombra | `--sombra-flutuante` | `0 8px 24px -12px rgba(17,25,34,.35)` | fantasma de arrasto |
| Movimento | `--transicao` | `120ms ease` | hover e seleção |

Contraste medido: `--texto-3` fica em 5,5:1 no papel, 4,9:1 no recesso e 4,6:1
na bancada; `--barra-acento` em 7,1:1 na barra; branco sobre `--acento`, 6,4:1.

`--transicao` vira `0ms` em `prefers-reduced-motion`.

## Tipografia

Fonte do sistema (`--fonte`), uma família só. Escala em uso:

| Papel | Tamanho | Peso | Notas |
|---|---|---|---|
| Título de tela (`h1`) | 19 px | 650 | na barra de ferramentas |
| Título de atividade | 22 px | 650 | `letter-spacing: -0.02em` |
| Corpo e controles | 12–12.5 px | 400–500 | |
| Apoio e metadados | 11–11.5 px | 400 | `--texto-3` |
| Rótulo de seção | 10–11 px | 700 | caixa alta, `0.05–0.07em` |

Medida de leitura máxima: 56–65ch nos enunciados. Nunca abaixo de 10 px para
texto que precise ser lido (as exceções são símbolos dentro de selos de 14 px).

## Espaçamento e raios

Escala prática de 2, 4, 6, 8, 10, 12, 16, 18, 26 px. Grupos próximos usam 4–6
px; blocos distintos, 16–26 px. Sempre mais espaço acima de um título de seção
do que abaixo. Painéis têm `8px`; controles e linhas de lista, `5–7px`.

## Componentes

### Botão — três papéis

| Classe | Papel | Aparência |
|---|---|---|
| `.botao.primario` | a única ação que importa na tela | fundo `--acento`, texto branco |
| `.botao` | ação de apoio | fundo branco, borda `--borda-forte` |
| `.botao.discreto` | ação terciária em barras e cabeçalhos | sem borda até o hover, texto `--texto-2` |
| `.botao.perigo` | destrutiva, só depois de confirmação | fundo `--perigo` |

`.botao.texto` (link de acento) continua existindo para ações embutidas em
texto corrido. Altura 30 px; alvo mínimo efetivo de 24 px em controles densos.

### Campo

`.campo` (input, textarea, select) tem borda `--borda-forte`, foco com anel de
2 px de acento e `box-shadow` suave. Textarea começa em 64 px e cresce com o
conteúdo. Toda gravação é automática: o texto não pode depender de um clique.

### Painel

Superfície branca, `1px` de borda e raio 8 px. Dentro dele, o
cabeçalho usa `--painel-2` e uma divisória `--linha`. Rolagem sempre interna.

### Atividades

A estante é uma grade de três colunas (duas abaixo de 1000 px), sem caixa: o
convite fica num bloco de recesso de 132 px, com o título, o enunciado em duas
linhas e o número de níveis abaixo. As sessões com conteúdo formam um bloco de
recesso com linhas clicáveis — nome, montagens e data — e a linha inteira abre a
sessão. Sessão aberta e abandonada, sem nome, montagem, grupo, comparação ou
explicação, não ocupa a estante; o próximo “Começar” reabre a mesma. O botão
“Começar” ou “Nova sessão” fecha o cartão. Nada de inspetor, miniatura de
montagem ou metadados de regra.

### Linha de sessão

`.sessao-aberta` é a linha inteira clicável, hover em `--painel` com anel de
1 px. Nome em 12.5 px/600, dados em 10.5 px `--texto-3` e uma seta de acento. A
ordem é sempre da sessão mais recente para a mais antiga; não há selo “última”.

### Peça

PNG com `object-fit: contain` e sombra curta (`0 4px 6px`). Tamanhos: `c` 44 px,
`m` 62 px, `p` 30 px. Peça em uso recebe um rótulo pequeno sob o nome; peça
compatível com o arrasto, contorno tracejado; incompatível, opacidade 0.35.

### Entrada

A tela de título ocupa a janela inteira, sem barra superior nem rodapé, sobre a
bancada clara com a mesma textura pontilhada do palco. A marca é a árvore de
quatro nós, desenhada a 92 px dentro de uma peça branca de 124 px. O nome usa
duas linhas: peso 620 em “Árvore”, 300 em “de possibilidades”, até 72 px. O único
botão é “Entrar”; a tela não avança sozinha. Na barra superior a mesma árvore
aparece em 20 px; em sessão só o símbolo, porque o título é a atividade. O desenho está em
`docs/logo.svg` e é o mesmo do ícone do aplicativo (`fonte-icone.png` em
`src-tauri/icons/`).

### Casca

A barra escura é a única moldura. Em sessão ela leva a marca reduzida ao símbolo,
o nome da atividade, as quatro abas e “← Atividades”; a atividade é o título, não
a marca. Fora da sessão, a marca aparece por extenso e há “← Início” para voltar
à capa. A etapa atual usa `--barra-acento`; as outras, `--barra-texto-2`.

### Superfícies

Só existem quatro planos. A bancada é o intervalo; o papel é onde se trabalha
(palco, mapa, folha, comparação); o recesso é o que se escolhe, guarda ou
consulta (miniaturas, guardadas, cartões da coleção, campos, faixas do mapa); a
barra é a navegação. Um papel por região.

Seleção sobe ao papel: o cartão no recesso vira branco com anel de acento. Os
demais ficam no recesso, sem borda pesada. Bandeja, guardadas, detalhe da árvore
e grupos continuam soltos sobre a bancada, separados por espaço e por uma linha
de 1 px.

### Estado vazio

Uma frase em `--texto-3`, nunca uma moldura vazia ou ícone decorativo.

### Coluna lateral de trabalho

Coleção e outras telas de trabalho usam duas colunas a partir de 1100 px: a
grade à esquerda e, à direita, o painel da tarefa em curso (comparação, grupo).
Cada coluna rola por conta própria, então a decisão fica visível enquanto a
criança escolhe montagens. Abaixo de 1100 px, o painel desce para baixo da
grade e a tela volta a rolar inteira.

A coleção não classifica equivalência. As montagens aparecem na ordem em que
foram guardadas, sem selo de “igual à nº N”: comparar duas e dizer se são a
mesma possibilidade, e agrupar as que a criança considera iguais, é o trabalho
dela. Os cartões ficam no recesso; o painel de comparação é o papel da tela, e a
montagem escolhida sobe para o papel com anel de acento.

## Acessibilidade

- Foco visível em tudo, inclusive no item já selecionado (`outline` de 2 px).
- Ações por arrasto têm equivalente por clique e por teclado (Enter/Espaço).
- Colocações, remoções e trocas são anunciadas em região `aria-live`.
- Contraste mínimo AA: `--texto-3` em 5,5:1 no papel, 4,9:1 no recesso e 4,6:1
  na bancada; branco sobre acento em 6,4:1; etapa atual em 7,1:1 na barra.
- O mapa da árvore tem alternativa em lista indentada.

## Impressão

`@media print` remove barra de título, abas, barra de ferramentas e status.
No Registro, campos viram texto (`.campo-impresso`) para que nada seja cortado.
No mapa da árvore, `.mapa` recebe `zoom: 0.68` para caber em A4 retrato, e o
painel de detalhe não é impresso. Cores são preservadas com
`print-color-adjust: exact`.

## O que evitar

- Segundo acento, gradiente ou sombra colorida sem deslocamento.
- Cor de ilustração usada como cor de interface; o conteúdo pode ser quente, a
  moldura não.
- Papel demais: dois cartões brancos aninhados ou um cartão branco que só
  embrulha texto.
- Cartão dentro de cartão para separar o que uma divisória resolve.
- Ícone ao lado de cada rótulo; a figurinha da atividade já carrega a identidade.
- Animação fora do arrasto; o movimento é feedback, não decoração.
