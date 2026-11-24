# Decisões de interface

Registro do caminho entre o protótipo `telas.html` e a implementação atual.

## 1. Diagnóstico do protótipo

- Sete caixas aninhadas até o conteúdo: cabeçalho, navegação em pílulas, título,
  enunciado e três `section` com borda, fundo e raio de 16 px.
- Banderia, montagem e coleção com o mesmo peso visual; a área de construção não
  era o centro da tela.
- A grade de três colunas não tinha breakpoint real e quebrava para uma coluna em
  ~780 px.
- Navegação sem noção de sequência: cinco destinos idênticos, quando mesa →
  coleção → árvore → registro é uma progressão.
- Árvore como `div`s aninhadas com botões: não lia como mapa.
- Sem comparação registrada, sem grupos e sem sessões independentes.

## 2. O que foi removido ou fundido

- **Cartões da mesa**: as três colunas passaram a ser separadas por fios de 1 px
  sobre o mesmo papel. Só a área de composição tem superfície preenchida.
- **Pílulas de navegação**: trocadas por quatro etapas numeradas com sublinhado,
  marcando a etapa atual e a contagem da coleção.
- **Repetição de rótulos**: “Bola de baixo” aparecia na bandeja, no seletor e na
  prévia; agora aparece uma vez por contexto.
- **Painel “Regra desta atividade”**: removido da mesa. A regra já está no
  enunciado; a equivalência não deve ser revelada antes da investigação.
- **Rótulo “resultado N” na coleção da criança**: removido. Ele entregava a
  resposta em “mistura de sabores”, onde dois caminhos chegam ao mesmo pote. Os
  totais de resultados distintos não são exibidos durante a investigação.
- **Bordas internas do mapa** e do painel de detalhe: substituídas por margem,
  tipografia e um fio vertical.

## 3. Identidade

A versão de papel marfim, Fraunces e cartões macios foi rejeitada: “parece um
site”. O app passou a se apresentar como software de bancada, não como página.

- Quatro planos: estrutura (`#23282f`), bancada (`#e7eaed`), papel (`#ffffff`) e
  recesso (`#eff2f5`). Papel é onde se trabalha; recesso é o que se escolhe,
  guarda ou consulta. A seleção sobe ao papel com anel de acento. A hierarquia
  vem dos planos e da densidade, não de sombra ou ornamento.
- Tipografia do sistema (`-apple-system`, `Segoe UI`, `Inter`), corpo de 13 px,
  títulos de 15 px. Nada de fonte editorial ou título de marketing.
- Chrome de aplicativo: uma única barra escura com a marca reduzida ao símbolo
  em sessão, o nome da atividade como título, as abas de etapa e “Atividades”;
  barra de status com atividade, contagem e “dados locais”. Fora da sessão não
  há abas e a marca aparece por extenso.
- Uma única cor de acento, verde-petróleo (`#176b56`), para ação principal,
  seleção e caminho na árvore. Vermelho só para erro.
- Raios de 5 a 8 px; sombra só no fantasma de arrasto, sem profundidade decorativa.
- A janela não rola como página: a casca ocupa `100dvh` e só os painéis internos
  rolam. Em telas estreitas a mesa vira coluna, mas o chrome permanece.

### 3.1 Densidade de ferramenta

- Início é uma estante de atividades: cada cartão traz convite, enunciado,
  níveis e as sessões abertas; sem inspetor e sem miniatura de montagem.
- Mesa é uma estação de trabalho em três painéis: bandeja, montagem e guardadas.
  Todas as peças de escolha ficam visíveis ao mesmo tempo e são arrastadas para o
  nível correspondente; os níveis também funcionam como destino por toque ou
  teclado.
- A cena vazia mostra círculos numerados no lugar das peças, para a criança saber
  a ordem sem ler um formulário.
- Figurinhas medem de 30 px (miniaturas) a 118 px (composição), sempre sobre
  fundo pontilhado neutro.

### 3.2 As dez atividades

O app deixou de ter cinco atividades genéricas e passou a usar as dez do material
`Figurinhas-60-para-o-programa`, com 60 PNGs e `atividades.json` como fonte. Cada
atividade tem peças próprias (`pecas` + `arquivo`) e uma composição:

| Atividade | Composição | Peças | Resultados |
|---|---|---|---|
| Casquinhas | duas bolas na casquinha | 4 sabores | 12 |
| Mistura de sabores | duas porções na taça | 4 sabores | 6 |
| Sanduíches | pão, recheio, pão | 2 pães + 3 recheios | 6 |
| Roupas | camiseta sobre peça de baixo | 2 + 3 | 6 |
| Sucos e copos | fruta ao lado do copo | 2 + 3 | 6 |
| Lancheira | salgado e fruta na bandeja | 2 + 3 | 6 |
| Duplas de animais | dois animais lado a lado | 5 | 10 |
| Canetas | caneta de título e de desenho | 5 | 20 |
| Salada de frutas | três frutas na tigela | 5 | 10 |
| Cordão de contas | três contas no cordão | 4 | 24 |

Nas atividades sem ordem (mistura, duplas e salada), a chave do resultado ordena
as escolhas, mas o caminho original continua preservado. A bandeja mostra todas
as peças de escolha da atividade, inclusive as que já estão em uso; usar de novo
uma peça já colocada move a peça para o novo nível e avisa no rodapé. Ao arrastar
uma peça, só os níveis compatíveis ficam destacados; arrastar sobre um nível
ocupado troca as duas peças quando ambas são aceitas ali.

## 4. O que os artigos mostram do Árbol

Figuras extraídas de `626-10220-1-PB.pdf` (Azevedo, Costa e Borba, 2011) e de
`ebook.pdf` (Borba, Batista e Azevedo, 2015):

- Abertura com logo “Diagramas de Árbol” e quatro ações: criar árvore, ver
  exemplos, recuperar biblioteca, instruções.
- Tela de criação: listas de **níveis** e de **elementos**, com agregar, eliminar,
  subir e baixar, e um nome para a árvore. Antes disso, a escolha entre “níveis de
  elementos diferentes” e “iguais”.
- Tela de possibilidades: colunas por nível, com faixas de fundo alternadas,
  cabeçalho com o nome do nível, caixas de elemento e conectores grossos. Um
  caminho inteiro pode ser destacado.
- O software gera **todas** as combinações, mesmo as inválidas. Repetições são
  marcadas com um ponto verde; as demais, com ponto vermelho. Não há correção
  automática por tipo de problema.

O que foi incorporado: faixas e cabeçalhos de nível, destaque do caminho inteiro,
botões de impressão do mapa e a ideia de caminhos válidos e inválidos no motor de
cálculo.

O que foi deliberadamente diferente: a criança não vê a árvore completa antes de
produzir; a árvore do aplicativo mostra só o que ela guardou. O que não segue o
enunciado não é guardado, mas a mensagem não explica a regra: dizer por que a
montagem não serve é parte do que se quer que a criança descubra.

## 5. Estrutura por tela

| Tela | Decisão principal |
|---|---|
| Entrada | Tela de título com a marca e o nome sobre a bancada; um único botão, “Entrar”, que leva às atividades. Não avança sozinha. |
| Atividades | Estante de cartões: convite, enunciado, níveis e as sessões com conteúdo, com a mais recente primeiro. “Começar” quando não há sessão; a linha da sessão abre e “Nova sessão” começa outra. “Salvar cópia” e “Abrir cópia” em JSON. Sem etiquetas de regra antes da investigação. |
| Mesa | Três painéis — peças 290 px, montagem flexível, guardadas 244 px —, o enunciado sobre o palco e as abas na barra do topo, com desfazer e confirmação ao limpar. |
| Coleção | Grade de montagens no recesso, com a seleção subindo ao papel; comparação no papel da coluna ao lado (empilhada abaixo em janelas estreitas) e criação de grupos nomeados. Sem classificação automática de equivalência. |
| Árvore | Mapa no papel, com faixas de nível no recesso, nós em HTML e conectores em SVG; o caminho em acento e alternativa em lista indentada. |
| Registro | Folha única centralizada, com divisórias tipográficas, gravação automática e versão de impressão em que os campos viram texto. |

## 6. Comportamentos preservados do documento

- Duplicatas entre tentativas são mantidas; tentativa inválida é barrada ao
  guardar, sem explicar a regra e sem apagar o rascunho.
- A árvore mostra só a produção da criança.
- Comparações guardam a decisão e a justificativa da criança, inclusive “ainda
  estou pensando”.
- Nenhuma recompensa, som de acerto, cronômetro ou classificação.

### 6.1 O que o programa não responde

O Árbol original gera a árvore com todas as combinações e deixa à criança marcar
os casos válidos; a listagem automática é apresentada como vantagem, mas o
julgamento e a mediação do professor continuam sendo condição (Azevedo, Costa e
Borba, 2011, p. 8-10). No estudo com lápis e papel, o grupo sem software teve
média maior no teste imediato (14,8 contra 12,1) e no teste nove semanas depois
(16,44 contra 13,22), o que impede tratar a geração automática como garantia de
aprendizagem (Borba, Batista e Azevedo, 2015).

Por isso, o aplicativo não responde:

- se a peça pode repetir nem se a ordem cria resultado novo — isso não aparece
  antes da investigação; o enunciado carrega a premissa e o resto se descobre;
- quais montagens dão no mesmo resultado — a comparação e os grupos são da
  criança;
- quais peças faltam para completar uma montagem;
- quantos resultados existem — o programa não mostra totais nem casos válidos.

A árvore, o registro e a impressão continuam mostrando o que a criança fez, sem
completar o que falta.

## 7. Desenho da interface

- A casca é de aplicativo: `100dvh`, barra de título escura, barra de status e
  painéis com rolagem própria. Nenhuma tela é uma página que rola inteira,
  exceto abaixo de 720 px.
- Um único acento verde-petróleo marca a ação principal e o item selecionado.
  Perigo só aparece quando o estado pede.
- Não há tela de apresentação: a entrada leva direto às atividades. O programa
  não se explica em páginas; o enunciado de cada atividade e o rodapé de estado
  bastam.
- As bandejas laterais (peças, guardadas, detalhe, comparação) ficam soltas
  sobre a bancada. Só o palco, o mapa, a folha do registro e as montagens são
  superfícies brancas com borda.
- A tela de atividades abre pela atividade: figurinha grande, título, enunciado
  e níveis. Retomar e começar ficam no topo, sempre visíveis, para não depender
  de rolagem.
- Peças aparecem em faixa própria, sem moldura de cartão. Sessões e as últimas
  montagens ficam abaixo, com miniatura real da composição guardada.
- Arrasto usa Pointer Events com captura de ponteiro e `touch-action: none`;
  clique e teclado continuam funcionando como equivalentes.
- Toda ação destrutiva pede confirmação, e o desfazer (ou ⌘Z) recupera a última
  colocação, retirada ou troca. Esc solta a peça na mão; ⌘Enter guarda a montagem
  completa.
- Textos digitados pela criança são gravados sozinhos; sair da tela não perde
  nada.
- Na coleção, repetir uma possibilidade não é erro nem é classificado pelo
  programa: as montagens ficam lado a lado, e a criança decide na comparação se
  são a mesma coisa, registrando o porquê. Remover uma montagem pede confirmação
  e leva junto as comparações e grupos que dependiam dela; a numeração das
  seguintes não é reaproveitada.
- Excluir uma sessão inteira fica no Registro, com aviso do que será apagado.
- O mapa da árvore é reduzido na impressão para caber em A4 retrato.
- Os tokens e papéis de componente estão em `DESIGN.md`.
- O programa se chama **Árvore de possibilidades**; a marca é uma árvore de
  quatro folhas, três nós internos e uma raiz, que também é o ícone do
  aplicativo. A tela de entrada mostra só a marca, o nome e “Entrar”.

## 8. Ligação entre as telas

`docs/mapa-de-telas.svg` desenha o percurso: Atividades fica fora da sessão; Mesa,
Coleção, Árvore e Registro compartilham a mesma sessão e trocam de etapa pelas
abas da barra do topo, sem perder a montagem em andamento. A única passagem obrigatória é montar
e guardar; comparar, organizar, ver a árvore e registrar podem ser feitos em
qualquer ordem. Excluir a sessão, no Registro, volta para Atividades.

## Dois módulos (nov/2026)

O programa é educacional, não gamificado, e é inspirado nos *Diagramas de Árbol* (Aguirre, 2005). Ele tem dois módulos sobre a mesma atividade:

- **Construir**: a criança monta os casos com as peças e a árvore cresce com o que ela guardou. É a hipótese própria do projeto (construir antes de ver a árvore).
- **Interpretar**: segue o fluxo do Árbol. A árvore completa é gerada pela regra do problema; a criança marca cada caminho como "vale" ou "não vale" e compara caminhos. O gabarito ("Conferir") fica só para o professor.

O **editor do professor** cria atividades novas ou variações (peças, níveis, repetição, ordem) e mostra quantos caminhos a regra produz antes de usar com a turma. Atividades com mais de 300 caminhos funcionam só no Construir.

O Registro mostra, no modo Interpretar, as marcações feitas na árvore.

Registro de mediação feito (aba Registro). Pendente: "Desafie um colega" / "Mude uma regra" e piloto com crianças.

## Identidade visual (nov/2026)

Critério: nada de cartões bege, pílulas, fundos pontilhados ou rótulos em caixa-alta. A árvore é o desenho: ramos curvos de espessura que afina, nós sem caixa, raiz marrom. Títulos em Fraunces; o corpo continua em Atkinson Hyperlegible Next. Abas sublinhadas em verde-folha. Catálogo de atividades com figurinha sobre o papel e filete no topo, sem cartão. O fundo é um branco-esverdeado (não creme). Estilos em `src/styles/identidade.css`, carregado por último.

## Paleta "Tinta e fruta" (nov/2026)

Escolhida após o estudo em `docs/estudo-de-paleta.md`: azul-tinta para ação (#1f4e8c), laranja-fruta para ramos (#cb6b1d), verde reservado a "vale" (#2f8f5b), fundo branco-azulado (#f6f8fb). Ramos agora sem transparência (3,5:1 sobre o fundo). Logo: ramos laranja e folhas azuis, testado em 16 px e em uma cor; as variantes estão em `docs/paleta/logo-variantes.png`. Ícones do Tauri regenerados.

## Banco de figuras extras (Editor)
34 figuras no mesmo estilo de adesivo (contorno marrom, borda branca), em `public/atividades/extras/<tema>/`, listadas em `src/data/figuras-extras.json`. Temas: Formas, Balões coloridos, Pizzas, Brinquedos, Transportes, Dados (1 a 6), Tempo, Flores. Aparecem no Editor depois das figuras das 10 atividades. Balões, pizzas, brinquedos, transportes, tempo e flores vieram de folhas de adesivos fornecidas pelo autor, recortadas com fundo transparente. Formas e dados foram desenhados em SVG por `docs/gerar-figuras-extras.py` (rsvg-convert e Pillow).

## Fechamento desta etapa
- **Editar atividade:** só atividades do professor (`prof-*`) têm "Editar" no cartão. O id é mantido (sessões abertas continuam ligadas) e a `versao` sobe em 1. Dentro do Editor há "Excluir atividade" (confirmação em dois passos); as sessões guardam a própria cópia e continuam.
- **Pular a árvore (Interpretar):** link visível só com foco; leva a `#depois-da-arvore`.
- **Mediação:** remover pede confirmação em dois passos; registrar vazio mostra aviso.
- **F5:** a tela atual é restaurada via `sessionStorage` (chave `mesa-rota`). O rascunho da bancada também é guardado em `sessionStorage` (por sessão), então sobrevive ao F5; só o que foi guardado vira montagem.
- **Salvar atividade** usa `aria-disabled`, não `disabled`: o clique explica o que falta.
- **Mantido como está:** `<img role="button">` nas peças montadas (necessário para o arrasto por ponteiro; tem teclado e rótulo).
- **Ainda não testado:** Tauri real, impressão física, toque, leitor de tela.
