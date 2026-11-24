import { LogoArvore } from "../../components/LogoArvore";

type Props = {
  aoCriar: () => void;
  aoExemplos: () => void;
  aoBiblioteca: () => void;
  aoInstrucoes: () => void;
  aoAtividades: () => void;
  aoSobre: () => void;
  quantasNaBiblioteca: number;
};

/** Menu do Árbol: criar, ver exemplos, recuperar da biblioteca e instruções. */
export function ArbolInicio({
  aoCriar,
  aoExemplos,
  aoBiblioteca,
  aoInstrucoes,
  aoAtividades,
  aoSobre,
  quantasNaBiblioteca,
}: Props) {
  return (
    <main className="tela tela-arbol-inicio" id="conteudo" tabIndex={-1}>
      <div className="arbol-menu">
        <div className="arbol-menu-marca" aria-hidden="true">
          <LogoArvore tamanho={120} />
        </div>
        <h1>
          <span>Quantos</span> <em>Jeitos</em>
        </h1>
        <p className="arbol-menu-frase">
          Defina os níveis e os elementos de um problema e veja todas as possibilidades em uma
          árvore. Pinte de vermelho as que valem.
        </p>
        <div className="arbol-menu-botoes">
          <button className="botao primario grande" onClick={aoCriar}>
            Criar uma árvore
          </button>
          <button className="botao grande" onClick={aoExemplos}>
            Ver exemplos
          </button>
          <button className="botao grande" onClick={aoBiblioteca}>
            Recuperar da biblioteca
            {quantasNaBiblioteca > 0 && <span className="aba-contador">{quantasNaBiblioteca}</span>}
          </button>
          <button className="botao grande" onClick={aoInstrucoes}>
            Instruções
          </button>
        </div>
        <nav className="arbol-menu-links" aria-label="Mais">
          <button className="link-discreto" onClick={aoSobre}>
            Sobre
          </button>
          <button className="link-discreto" onClick={aoAtividades}>
            Atividades com figurinhas (versão anterior)
          </button>
        </nav>
        <p className="entrada-rodape">Desenvolvido por Gerlan Silva da Silva · UFSCar</p>
      </div>
    </main>
  );
}
