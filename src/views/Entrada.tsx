import { useEffect } from "react";
import { LogoArvore } from "../components/LogoArvore";

type Props = {
  aoEntrar: () => void;
  aoOrientacoes: () => void;
  aoSobre: () => void;
};

/**
 * Tela de título: o nome, uma frase e uma única ação. Não avança sozinha, para
 * dar tempo de ler e não tirar o controle de quem usa leitor de tela.
 */
export function Entrada({ aoEntrar, aoOrientacoes, aoSobre }: Props) {
  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key !== "Enter" || evento.target instanceof HTMLButtonElement) return;
      evento.preventDefault();
      aoEntrar();
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aoEntrar]);

  return (
    <main className="tela tela-entrada" id="conteudo" tabIndex={-1}>
      <div className="entrada">
        <div className="entrada-texto">
          <LogoArvore tamanho={104} />
          <h1 aria-label="Quantos Jeitos">
            <span>Quantos</span> <span className="entrada-nome-fraco">Jeitos?</span>
          </h1>
          <p className="entrada-sub">árvores de possibilidades</p>
          <p>Cada escolha abre um novo ramo. Descubra todos os caminhos de um problema.</p>
        </div>
        <div className="entrada-acoes">
          <button className="botao primario grande" onClick={aoEntrar}>
            Entrar
          </button>
          <button className="botao grande" onClick={aoOrientacoes}>
            Orientações para o professor
          </button>
          <button className="botao grande" onClick={aoSobre}>
            Sobre
          </button>
        </div>
      </div>
      <footer className="entrada-rodape">Desenvolvido por Gerlan Silva da Silva · UFSCar</footer>
    </main>
  );
}
