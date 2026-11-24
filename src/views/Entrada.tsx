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
          <h1 aria-label="Árvore de possibilidades">
            <span>Árvore</span>
            <span className="entrada-nome-fraco">de possibilidades</span>
          </h1>
          <p>Cada escolha abre um novo ramo. Descubra todos os caminhos de um problema.</p>
          <button className="botao primario grande" onClick={aoEntrar}>
            Entrar
          </button>
          <nav className="entrada-links" aria-label="Mais informações">
            <button className="link-discreto" onClick={aoOrientacoes}>
              Orientações para o professor
            </button>
            <button className="link-discreto" onClick={aoSobre}>
              Sobre
            </button>
          </nav>
          <p className="entrada-credito">
            Desenvolvido por Gerlan Silva da Silva · UFSCar
          </p>
        </div>
        <div className="entrada-arvore" aria-hidden="true">
          <LogoArvore tamanho={300} />
        </div>
      </div>
    </main>
  );
}
