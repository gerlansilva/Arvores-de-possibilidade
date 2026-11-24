type Props = {
  aoVoltar: () => void;
  rotuloVoltar: string;
};

/** Orientações para o professor: o programa inteiro, na ordem em que se usa. */
export function Orientacoes({ aoVoltar, rotuloVoltar }: Props) {
  return (
    <main className="tela tela-texto" id="conteudo" tabIndex={-1}>
      <article className="texto-longo">
        <header>
          <h1>Orientações para o professor</h1>
          <p className="texto-lead">
            O programa ajuda a criança a investigar todas as possibilidades de um problema. Ele não pontua,
            não cronometra e não diz o que está certo: quem decide quais casos valem é a criança, com a sua
            mediação.
          </p>
          <nav aria-label="Nesta página" className="texto-indice">
            <a href="#situacoes">As quatro situações</a>
            <a href="#sessao">Uma atividade</a>
            <a href="#livre">Árvore livre</a>
            <a href="#mediar">Como mediar</a>
            <a href="#professor">Ficha e registro</a>
            <a href="#levar">Salvar e levar</a>
          </nav>
        </header>

        <section id="situacoes">
          <h2>As quatro situações</h2>
          <p>As atividades e os exemplos estão organizados por situação combinatória:</p>
          <ul>
            <li><strong>Juntar coisas diferentes</strong> (produto cartesiano): uma peça de cada conjunto, como blusa e saia.</li>
            <li><strong>Escolher e ordenar</strong> (arranjo simples): escolher algumas peças, e a ordem faz diferença.</li>
            <li><strong>Formar grupos</strong> (combinação simples): escolher algumas peças, e a ordem não faz diferença.</li>
            <li><strong>Organizar todos</strong> (permutação simples): usar todas as peças, mudando a ordem.</li>
          </ul>
          <p>Os nomes formais ficam para você; a criança vê os nomes do dia a dia.</p>
        </section>

        <section id="sessao">
          <h2>Uma atividade, em quatro etapas</h2>
          <p>Em <strong>Atividades</strong>, escolha um problema e toque em <strong>Começar</strong>. Cada sessão tem quatro etapas, que podem ser feitas em qualquer ordem:</p>
          <ol>
            <li><strong>Montar:</strong> a criança arrasta as figurinhas para os níveis e guarda cada montagem. A árvore cresce com o que ela guardou, sem dizer se faltam casos.</li>
            <li><strong>Coleção:</strong> a criança compara montagens (“é a mesma ou são diferentes?”) e cria grupos com nome.</li>
            <li><strong>Árvore:</strong> aparece a árvore completa, com todas as combinações e as figurinhas. A criança toca no último elemento de um caminho para pintá-lo de vermelho. Também há a visão em tabela.</li>
            <li><strong>Registro:</strong> o nome da dupla, as montagens, os caminhos pintados, a explicação e as suas mediações. Dá para imprimir.</li>
          </ol>
        </section>

        <section id="livre">
          <h2>Árvore livre</h2>
          <p>
            Fora das atividades, <strong>Criar uma árvore</strong> permite definir os seus próprios níveis e elementos
            (até 6 níveis, 12 elementos por nível e 2000 possibilidades). Em <strong>Exemplos</strong> há problemas
            prontos das quatro situações; em <strong>Biblioteca</strong> ficam as árvores guardadas neste computador,
            que também podem ser salvas em arquivo para levar a outro.
          </p>
        </section>

        <section id="mediar">
          <h2>Como mediar</h2>
          <ul>
            <li>Peça que a criança explique por que pintou um caminho, antes de dizer se está certo.</li>
            <li>Pergunte o que muda entre dois caminhos parecidos, como “Ana–Beto” e “Beto–Ana”.</li>
            <li>Deixe a contagem para depois: quantos caminhos ficaram vermelhos?</li>
            <li>Repetir uma possibilidade também é informação para a conversa com a turma.</li>
          </ul>
        </section>

        <section id="professor">
          <h2>Ficha do professor e registro</h2>
          <p>
            Na etapa Árvore, o botão <strong>Professor</strong> abre uma ficha fechada: a regra do problema, perguntas
            para mediar e, só se você pedir, quantos caminhos valem. No <strong>Registro</strong>, anote o que perguntou,
            que ajuda deu e o que mudou na solução da criança. Para criar uma atividade nova ou uma variação, use{" "}
            <strong>Nova atividade</strong>.
          </p>
        </section>

        <section id="levar">
          <h2>Salvar e levar</h2>
          <p>
            Tudo fica neste computador e nada é enviado. Em Atividades, <strong>Salvar cópia</strong> guarda as sessões
            em um arquivo, e <strong>Abrir cópia</strong> as traz de volta em outro computador.
          </p>
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
