# Árvore de possibilidades

Ambiente de investigação combinatória para os anos iniciais, inspirado no Árbol
documentado por Azevedo, Costa e Borba (2011). Aplicativo desktop em Tauri, com
interface em React e motor combinatório independente.

O documento de referência do projeto é `../Combinatoria-OpenCode/GUIA-OPENCODE.md`.
O protótipo HTML original (`../Combinatoria-OpenCode/telas.html`) foi tratado como
evidência de partida, não como base de código.

## Rodar

```bash
npm install
npm run dev      # interface no navegador, porta 1420
npm test         # regras e totais das doze atividades (Vitest)
npm run app      # aplicativo Tauri em modo desenvolvimento
npm run app:build  # pacote .app/.dmg para macOS
```

Requisitos: Node 20+, Rust 1.77+ e as ferramentas de linha de comando do Xcode.

O build de produção gera:

- `src-tauri/target/release/bundle/macos/Árvore de possibilidades.app`
- `src-tauri/target/release/bundle/dmg/Árvore de possibilidades_0.1.0_aarch64.dmg`

O pacote é local e não notarizado; em outro Mac, o Gatekeeper pede confirmação
para abrir.

## O que está implementado

- **Dez atividades** com peças próprias, a partir de `atividades.json` e dos 60
  PNGs de `../Figurinhas-60-para-o-programa`: casquinhas (12), mistura (6),
  sanduíches (6), roupas (6), sucos e copos (6), lancheira (6), duplas de animais
  (10), canetas (20), salada de frutas (10) e cordão de contas (24).
- **Motor separado da interface** (`src/engine/comb.ts`): a chave do resultado é
  calculada separadamente do caminho. Nas atividades sem ordem (mistura, duplas
  e salada), a chave do resultado ordena uma cópia das escolhas; o caminho
  original nunca é reordenado.
- **Testes do motor e da árvore** (`src/engine/comb.test.ts`,
  `src/engine/tree.test.ts`, `src/state/store.test.ts`): conferem os totais de
  caminhos e resultados das doze atividades, a regra sem repetição, a diferença
  entre ordem e sem-ordem, a contagem por caminho na árvore e a mesclagem de
  sessões na importação.
- **Mesa de montagem** com todas as peças de escolha visíveis na bandeja ao
  mesmo tempo. A criança arrasta a peça para o nível da composição; tocar na peça
  e no nível é a alternativa por teclado. Os níveis continuam numerados e a
  montagem guarda duplicatas entre tentativas. Peça que não pertence ao nível é
  recusada; peça já usada em outro nível é movida, sem explicar a regra de
  repetição: o enunciado é que diz o que a atividade pede.
  Arrastar uma peça sobre outra troca as duas quando as regras permitem.
  Desfazer (⌘Z) recupera a última colocação, retirada ou troca; limpar pede
  confirmação. Esc solta a peça selecionada e ⌘Enter guarda a montagem completa.
- **Coleção** na ordem de criação, com a comparação de duas montagens ao lado da
  grade (decisão “mesma”, “diferente”, “ainda estou pensando” e explicação) e
  agrupamentos nomeados pela criança. O programa não marca quais montagens dão
  no mesmo resultado: essa conclusão fica com a criança, na comparação e nos
  grupos. A montagem selecionada pode ser removida com confirmação, e as
  comparações e grupos que dependiam dela são limpos.
- **Árvore de possibilidades** construída apenas com o que a criança guardou,
  em mapa (faixas de nível, cabeçalhos e conectores em SVG) ou lista indentada.
  Selecionar um nó destaca o caminho inteiro. O mapa pode ser impresso.
- **Registro da investigação** imprimível, com ordem de criação, grupos,
  comparações e explicação da criança. Nome e explicação são gravados enquanto
  se digita, e a impressão mostra o texto completo em vez da caixa de edição.
- **Entrada** é a primeira tela: a marca em tamanho grande, o nome “Árvore de
  possibilidades” em duas linhas e o botão “Entrar”, sobre a mesma bancada clara
  do resto do programa. O clique leva direto às atividades.
- **Atividades** é a estante: cada atividade mostra o convite, o enunciado,
  quantos níveis tem e as sessões com conteúdo, da mais recente para a mais
  antiga. Sessão começada e abandonada, sem nada dentro, não aparece.
  Sem sessão, o cartão traz “Começar”; com sessão, a linha abre a sessão e
  “Nova sessão” começa outra. As propriedades combinatórias (repetição, ordem,
  total) não aparecem antes da investigação. “Salvar cópia” e “Abrir cópia”
  usam o diálogo nativo do sistema. Abrir uma cópia de outra máquina junta
  montagens, grupos e comparações em vez de substituir a sessão; a explicação e
  o nome vêm da versão mais recente.
- **Acessibilidade**: navegação por teclado, foco visível em todos os controles
  (inclusive nos já selecionados), alvos de pelo menos 24 px, regiões
  `aria-live`, alternativa em lista para o mapa, contraste AA e
  `prefers-reduced-motion`.
- **Sessões**: podem ser renomeadas no Registro e excluídas por inteiro com
  confirmação, voltando para a lista de atividades.
- **Interface de aplicativo**: janela fixa em `100dvh`, uma única moldura escura
  com a atividade, as abas de etapa e as ações, barra de status e painéis com
  rolagem própria. Quatro planos — estrutura, bancada, papel e recesso —,
  tipografia do sistema e um único acento verde-petróleo.

Dados ficam no armazenamento local do aplicativo (WebView), sem rede. A
exportação gera um JSON com sessões e atividades criadas.

## Documentação visual

`docs/visao-geral.png` reúne as seis telas da criança; as capturas individuais
estão em `docs/telas/` (`00-entrada` a `05-registro`). `docs/mapa-de-telas.svg`
mostra como
as telas se ligam, o que cada uma faz e o que acontece nos estados vazios.
`docs/paleta.svg` reúne os quatro planos, as três tintas e os contrastes
medidos. O diagnóstico e as decisões de interface estão em
`docs/decisoes.md`, e os tokens, a tipografia e os papéis de componente estão em
`DESIGN.md`. A descrição original das doze atividades está em
`docs/atividades-origem.md`.

## Estrutura

```
src/
  data/         atividades.json, activities.ts (catálogo e composições)
  engine/       comb.ts (regras e chaves), tree.ts (árvore e diagramação)
  state/        store.ts (sessões, grupos, comparações, persistência)
  components/   Montagem, Marca
  views/        Inicio, Mesa, Colecao, Arvore, Registro
  styles/       tokens.css, app.css
public/atividades/   60 PNGs, em dez pastas
src-tauri/           casca Tauri 2 (Rust)
```

## Limites conhecidos

- A impressão usa o diálogo do sistema; a folha de estilo de impressão esconde
  navegação e controles.
- No aplicativo Tauri, exportar e importar usam o diálogo nativo do macOS e um
  comando Rust que grava/lê o caminho escolhido. No navegador, a exportação cai
  no download e a importação na seleção de arquivo.
- Não há telemetria, pontuação, cronômetro ou classificação — por decisão de
  projeto.

## Dois módulos

Cada atividade abre em **Construir** (a criança monta, a árvore cresce com o que ela guardou) ou **Interpretar** (árvore completa gerada pela regra; a criança marca cada caminho como "vale" ou "não vale" e compara caminhos; o gabarito é só do professor). O **editor** cria atividades e variações. As atividades 11 (fotografia) e 12 (entrevista) reutilizam as figurinhas dos animais.
