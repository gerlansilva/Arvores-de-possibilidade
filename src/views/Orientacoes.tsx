type Props = {
  aoVoltar: () => void;
  rotuloVoltar: string;
};

/** Orientações para o professor sobre o Árbol. Texto fixo, sem estado. */
export function Orientacoes({ aoVoltar, rotuloVoltar }: Props) {
  return (
    <main className="tela tela-texto" id="conteudo" tabIndex={-1}>
      <article className="texto-longo">
        <header>
          <h1>Orientações para o professor</h1>
          <p className="texto-lead">
            O programa mostra todas as possibilidades de um problema em uma árvore. Ele não pontua, não
            cronometra e não diz o que está certo: quem decide quais casos valem é a criança, com a sua
            mediação.
          </p>
        </header>

        <section>
          <h2>Como usar</h2>
          <ol>
            <li>
              Em <strong>Criar uma árvore</strong>, escreva o nome de cada nível (por exemplo, Blusas e
              Saias) e, para cada um, os seus elementos (as cores). Dê um nome à árvore e toque em{" "}
              <strong>Guardar e ver</strong>.
            </li>
            <li>
              Na tela da árvore aparecem <strong>todas</strong> as combinações, da esquerda para a
              direita, uma coluna por nível.
            </li>
            <li>
              Para marcar um caso, toque na última peça do caminho: o caminho inteiro fica vermelho.
              Toque de novo para desmarcar.
            </li>
            <li>
              Use <strong>+</strong> e <strong>−</strong> para ampliar ou reduzir, e{" "}
              <strong>Imprimir</strong> para levar a árvore para a sala.
            </li>
          </ol>
        </section>

        <section>
          <h2>Tipos de problema</h2>
          <p>
            Em <strong>Ver exemplos</strong> há quatro situações: produto cartesiano (blusas e saias),
            combinação (apertos de mão entre pessoas), arranjo (representante e vice) e permutação
            (torcedores em cadeiras). Em todas, a árvore mostra primeiro todas as possibilidades; depois a
            criança pinta as que atendem ao enunciado e conta.
          </p>
        </section>

        <section>
          <h2>Como mediar</h2>
          <ul>
            <li>Peça que a criança explique por que pintou um caminho, em vez de dizer se está certo.</li>
            <li>Pergunte o que muda entre dois caminhos parecidos, como “Ana–Beto” e “Beto–Ana”.</li>
            <li>Deixe a contagem para depois de pintar: quantos caminhos vermelhos existem?</li>
          </ul>
        </section>

        <section>
          <h2>Biblioteca</h2>
          <p>
            Em <strong>Guardar na biblioteca</strong> a árvore, com os caminhos pintados, fica neste
            computador. Em <strong>Recuperar da biblioteca</strong> você a reabre, modifica ou apaga, e
            pode salvar todas em um arquivo para levar a outro computador.
          </p>
          <p>Limites: até 6 níveis, 12 elementos por nível e 2000 possibilidades.</p>
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
