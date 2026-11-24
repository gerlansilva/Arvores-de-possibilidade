type Props = {
  aoVoltar: () => void;
  rotuloVoltar: string;
};

/** Quem fez o programa, de onde vem a ideia e o que ele não faz. */
export function Sobre({ aoVoltar, rotuloVoltar }: Props) {
  return (
    <main className="tela tela-texto" id="conteudo" tabIndex={-1}>
      <article className="texto-longo">
        <header>
          <h1>Sobre</h1>
          <p className="texto-lead">
            A Árvore de possibilidades é um programa educativo de combinatória para os anos iniciais do
            Ensino Fundamental, feito para pesquisa e para a sala de aula.
          </p>
        </header>

        <section>
          <h2>Quem desenvolveu</h2>
          <p>
            <strong>Gerlan Silva da Silva</strong>, doutorando em Educação na Universidade Federal de São
            Carlos (UFSCar), com pesquisa em Educação Estatística. Desenvolvido com o apoio do assistente
            de programação Claude, da Anthropic.
          </p>
          <p>
            Código-fonte: <code>github.com/gerlansilva/Arvores-de-possibilidade</code>.
          </p>
        </section>

        <section>
          <h2>De onde vem a ideia</h2>
          <p>
            A proposta se inspira nos <em>Diagramas de Árbol</em> mexicanos (Aguirre, 2005) e no Árbol
            documentado por Azevedo, Costa e Borba (2011), ambientes em que a criança constrói a árvore de
            possibilidades enquanto investiga um problema combinatório. As figurinhas e a interface foram
            feitas para este programa.
          </p>
        </section>

        <section>
          <h2>O que ele não faz</h2>
          <ul>
            <li>Não pontua, não cronometra e não classifica crianças.</li>
            <li>Não envia dados para a internet: tudo fica no seu computador.</li>
            <li>Não substitui a mediação do professor: ele a apoia e a registra.</li>
          </ul>
        </section>

        <section>
          <h2>Versão</h2>
          <p>0.1.0. Sugestões e problemas podem ser enviados pela página do código, no GitHub.</p>
        </section>

        <section>
          <h2>Referências</h2>
          <ul>
            <li>Aguirre, M. (2005). <em>Diagramas de Árbol</em>.</li>
            <li>
              Azevedo, J.; Costa, D.; Borba, R. (2011). Árbol: ambiente para o desenvolvimento do
              raciocínio combinatório.
            </li>
          </ul>
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
