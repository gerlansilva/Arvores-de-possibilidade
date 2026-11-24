type Props = {
  aoVoltar: () => void;
  rotuloVoltar: string;
};

/**
 * Página de orientações para o professor: o que o programa faz, como conduzir
 * cada módulo e como mediar sem dar a resposta. Texto fixo, sem estado.
 */
export function Orientacoes({ aoVoltar, rotuloVoltar }: Props) {
  return (
    <main className="tela tela-texto" id="conteudo" tabIndex={-1}>
      <article className="texto-longo">
        <header>
          <h1>Orientações para o professor</h1>
          <p className="texto-lead">
            A Árvore de possibilidades ajuda a criança a investigar todas as possibilidades de um
            problema e a organizá-las em uma árvore. O programa não pontua, não cronometra e não diz
            quando a criança terminou: quem confere é ela, com a sua mediação.
          </p>
          <nav aria-label="Nesta página" className="texto-indice">
            <a href="#ideia">A ideia</a>
            <a href="#comecar">Como começar</a>
            <a href="#construir">Construir</a>
            <a href="#interpretar">Interpretar</a>
            <a href="#mediar">Como mediar</a>
            <a href="#registro">Registro</a>
            <a href="#editor">Criar atividades</a>
            <a href="#dados">Salvar e levar</a>
            <a href="#atalhos">Atalhos</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
        </header>

        <section id="ideia">
          <h2>A ideia</h2>
          <p>
            Cada problema tem <strong>níveis</strong> (por exemplo, a bola de baixo e a bola de cima de
            uma casquinha). Em cada nível a criança escolhe uma peça; cada combinação de escolhas é um{" "}
            <strong>caminho</strong>. A árvore mostra os caminhos: do tronco saem os ramos do primeiro
            nível, e de cada ramo saem os do segundo.
          </p>
          <p>
            Duas regras mudam quantos casos existem: a <strong>repetição</strong> (a mesma peça pode
            aparecer duas vezes?) e a <strong>ordem</strong> (trocar de lugar é outro caso ou o
            mesmo?). O enunciado diz o que vale; o programa não explica a regra antes da investigação.
          </p>
        </section>

        <section id="comecar">
          <h2>Como começar</h2>
          <ol>
            <li>Em <strong>Atividades</strong>, escolha um problema. Há doze prontos e os que você criar.</li>
            <li>
              Escolha o módulo: <strong>Construir</strong> (a criança monta e a árvore cresce) ou{" "}
              <strong>Interpretar</strong> (a árvore já vem completa).
            </li>
            <li>
              Em <strong>Registro</strong>, escreva o nome da criança. Cada criança ou dupla tem a sua
              sessão; “Nova sessão” começa outra sem apagar a anterior.
            </li>
            <li>Leia o enunciado com a criança, se ela ainda não lê com autonomia, e deixe-a começar.</li>
          </ol>
          <p>
            Sugestão: comece por Construir com um problema pequeno (Casquinhas, Sanduíches) e deixe
            Interpretar para quando a criança já tiver construído árvores.
          </p>
        </section>

        <section id="construir">
          <h2>Construir</h2>
          <ol>
            <li>A criança toca em uma peça e depois no nível (ou no espaço vazio do desenho) onde quer colocá-la. Também pode arrastar.</li>
            <li>Quando todos os níveis estão preenchidos, ela guarda a montagem. A montagem entra na árvore.</li>
            <li>Ela repete até achar que não há mais possibilidades. O programa não avisa se falta alguma.</li>
            <li>Em <strong>Coleção</strong>, a criança compara duas montagens (“é a mesma possibilidade?”) e pode agrupar as que acha iguais, dando um nome ao grupo.</li>
          </ol>
          <p>
            Montagens repetidas são aceitas de propósito: perceber que repetiu faz parte da investigação.
            Desfazer (⌘Z ou Ctrl+Z) volta a última colocação; “Ampliar árvore” recolhe a bancada para ver a
            árvore inteira.
          </p>
        </section>

        <section id="interpretar">
          <h2>Interpretar</h2>
          <ol>
            <li>A árvore completa aparece. Em “Marcar caminhos”, cada toque num caminho alterna: vale, não vale, sem marca.</li>
            <li>Em “Comparar dois”, a criança escolhe dois caminhos e diz se são a mesma possibilidade.</li>
            <li>
              <strong>Conferir (professor)</strong> mostra o que a regra aceita e quais marcas da criança
              diferem dela. É só para o adulto: use depois que a criança marcar, para decidir o que perguntar.
            </li>
          </ol>
          <p>
            Se a árvore tiver mais de 300 caminhos, ela não é desenhada inteira. Reduza peças ou níveis
            no editor.
          </p>
        </section>

        <section id="mediar">
          <h2>Como mediar</h2>
          <p>
            A mediação serve para a criança olhar para o que fez, não para receber a resposta. Algumas
            perguntas que costumam ajudar:
          </p>
          <ul>
            <li>O que você já fez? Como você pode conferir se falta algum caso?</li>
            <li>Esta montagem é diferente daquela? Em que?</li>
            <li>O que muda quando você troca a ordem?</li>
            <li>Uma mesma peça pode aparecer de novo? Em quais casos?</li>
            <li>Como você explicaria para um colega que não falta nenhum?</li>
          </ul>
          <p>
            Evite dizer quantos casos existem, apontar o caso que falta ou corrigir a regra pela criança.
            Se ajudar, releia o enunciado, mostre um exemplo ou peça que explique a um colega, e{" "}
            <strong>registre o que você fez</strong> (veja a seguir).
          </p>
        </section>

        <section id="registro">
          <h2>Registro e mediação</h2>
          <p>
            A aba <strong>Registro</strong> reúne as montagens em ordem, os grupos, as comparações e a
            explicação da criança. Em “Mediação do professor”, anote a pergunta feita, o tipo de ajuda e,
            se quiser, a solução antes e depois da ajuda. Assim fica claro o que foi da criança e o que
            veio da mediação. A página é imprimível e pode ser salva como PDF pelo diálogo de impressão.
          </p>
        </section>

        <section id="editor">
          <h2>Criar e editar atividades</h2>
          <p>
            Em Atividades, “Nova atividade” abre o editor. Você pode começar em branco ou variar uma
            atividade pronta (mantém o desenho e o número de níveis). Defina título, enunciado, níveis, as
            peças de cada nível e as regras de repetição e de ordem.
          </p>
          <p>
            O painel do lado mostra quantos caminhos a árvore terá, quantos seguem a regra e quantos casos
            são diferentes, além de “E se a regra mudasse?”, com o total nas seis combinações de regras.
            Confira esses números <em>antes</em> de usar com a turma. Atividades suas ganham “Editar” no
            cartão; as sessões já feitas guardam a própria cópia e não mudam.
          </p>
        </section>

        <section id="dados">
          <h2>Salvar e levar as sessões</h2>
          <p>
            Tudo fica guardado neste computador, sem internet. Para levar as sessões a outro computador
            (ou fazer uma cópia de segurança), use <strong>Salvar cópia</strong> em Atividades e, no outro
            lugar, <strong>Abrir cópia</strong>. Abrir uma cópia junta montagens e comparações, sem
            substituir o que já existe. Na versão que roda no navegador, limpar os dados do navegador
            apaga as sessões: salve uma cópia antes.
          </p>
        </section>

        <section id="atalhos">
          <h2>Atalhos de teclado</h2>
          <ul className="texto-atalhos">
            <li><kbd>Tab</kbd> percorre os controles; no Interpretar, o primeiro é “Pular a árvore”.</li>
            <li><kbd>Esc</kbd> solta a peça selecionada.</li>
            <li><kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Z</kbd> desfaz a última colocação.</li>
            <li><kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> guarda a montagem completa.</li>
          </ul>
        </section>

        <section id="duvidas">
          <h2>Dúvidas frequentes</h2>
          <dl>
            <dt>Por que o programa não diz se a criança terminou?</dt>
            <dd>
              Porque decidir que “não falta nenhum” é parte do raciocínio combinatório. Use a mediação e,
              no Interpretar, a conferência do professor.
            </dd>
            <dt>Por que não há pontos nem tempo?</dt>
            <dd>É uma decisão de projeto: o foco é investigar, não acertar rápido.</dd>
            <dt>Perdi a tela ao recarregar.</dt>
            <dd>A tela e a bancada são restauradas ao recarregar. Só o que foi guardado vira montagem.</dd>
            <dt>Posso imprimir a árvore?</dt>
            <dd>Sim: “Imprimir mapa”, na tela da árvore. A impressão sai só com a árvore.</dd>
          </dl>
        </section>

        <p className="texto-voltar">
          <button className="botao" onClick={aoVoltar}>
            <span aria-hidden="true">←</span> {rotuloVoltar}
          </button>
        </p>
      </article>
    </main>
  );
}
