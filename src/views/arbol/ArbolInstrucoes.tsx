type Props = { aoVoltar: () => void };

export function ArbolInstrucoes({ aoVoltar }: Props) {
  return (
    <main className="tela tela-texto" id="conteudo" tabIndex={-1}>
      <article className="texto-longo">
        <header>
          <h1>Instruções</h1>
          <p className="texto-lead">
            Criar, ver e pintar uma árvore em três passos.
          </p>
        </header>

        <section>
          <h2>1. Criar uma árvore</h2>
          <ol>
            <li>Em “Criar uma árvore”, escreva o nome de cada <strong>nível</strong>. Nível é cada escolha do problema: blusas, saias; a 1ª pessoa, a 2ª pessoa; a 1ª cadeira, a 2ª cadeira…</li>
            <li>Escolha um nível e escreva os seus <strong>elementos</strong>: as opções daquele nível (as cores das blusas, os nomes das pessoas).</li>
            <li>Use <em>Adicionar</em>, <em>Eliminar</em>, <em>Subir</em> e <em>Descer</em> para organizar os níveis e os elementos.</li>
            <li>Escreva o nome da árvore e toque em “Guardar e ver”.</li>
          </ol>
        </section>

        <section>
          <h2>2. Ver as possibilidades</h2>
          <p>
            A árvore aparece da esquerda para a direita, com um ramo para cada elemento do primeiro
            nível e, a partir dele, os ramos do nível seguinte, e assim por diante. Cada linha completa,
            do primeiro ao último nível, é <strong>uma possibilidade</strong>.
          </p>
          <p>
            A árvore mostra <strong>todas</strong> as combinações, inclusive as que não servem para o
            problema (por exemplo, uma pessoa sentada em duas cadeiras ao mesmo tempo). O programa não
            diz o que está certo: isso é com você.
          </p>
        </section>

        <section>
          <h2>3. Pintar de vermelho os casos que valem</h2>
          <p>
            Toque no último elemento de uma linha para pintar a possibilidade inteira de vermelho. Toque
            de novo para tirar a cor. Use “Limpar” para recomeçar. Releia o problema e pergunte: este
            caso vale? Este é o mesmo caso que aquele? Quantos casos valem?
          </p>
        </section>

        <section>
          <h2>4. Guardar, modificar e imprimir</h2>
          <ul>
            <li>A árvore criada fica na <strong>biblioteca</strong>, junto com a pintura. Em “Recuperar da biblioteca” você abre, modifica ou apaga.</li>
            <li>Os <strong>exemplos</strong> mostram os quatro tipos de problema: produto cartesiano, combinação, arranjo e permutação. Use “Guardar na biblioteca” para ficar com uma cópia.</li>
            <li>“Imprimir” imprime só a árvore, com o nome. “Salvar em arquivo” leva a biblioteca para outro computador.</li>
            <li>Use + e − para aumentar ou diminuir a árvore.</li>
          </ul>
        </section>

        <section>
          <h2>Dicas</h2>
          <ul>
            <li>Árvores muito grandes ficam difíceis de ler. Comece com poucos elementos.</li>
            <li>Compare duas árvores do mesmo problema: o que muda se a ordem importa? E se um elemento não pode se repetir?</li>
          </ul>
        </section>

        <p className="texto-voltar">
          <button className="botao" onClick={aoVoltar}>
            <span aria-hidden="true">←</span> Início
          </button>
        </p>
      </article>
    </main>
  );
}
