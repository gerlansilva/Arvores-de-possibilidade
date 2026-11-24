import { useEffect } from "react";

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
            <span>Árvore</span> <span className="entrada-nome-fraco">de possibilidades</span>
          </h1>
          <p>Cada escolha abre um novo ramo. Descubra todos os caminhos de um problema.</p>
        </div>
        <figure className="entrada-exemplo" aria-label="Exemplo: um sorvete com 2 recipientes e 2 sabores tem 4 caminhos">
          <svg viewBox="0 0 560 300" role="img" aria-hidden="true">
            <g className="ex-ramos">
              <path d="M130 150C180 150 170 72 210 72" />
              <path d="M130 150C180 150 170 228 210 228" />
              <path d="M350 72C390 72 390 36 430 36" />
              <path d="M350 72C390 72 390 108 430 108" />
              <path d="M350 228C390 228 390 192 430 192" />
              <path d="M350 228C390 228 390 264 430 264" />
            </g>
            <rect className="ex-raiz" x="10" y="128" width="120" height="44" rx="22" />
            <text className="ex-texto ex-texto-raiz" x="70" y="156">Sorvete</text>
            {[[210, 50, "casquinha"], [210, 206, "copinho"]].map(([x, y, t]) => (
              <g key={String(t)}>
                <rect className="ex-meio" x={x as number} y={y as number} width="140" height="44" rx="22" />
                <text className="ex-texto" x={(x as number) + 70} y={(y as number) + 28}>{t}</text>
              </g>
            ))}
            {[[14, "chocolate"], [86, "morango"], [170, "chocolate"], [242, "morango"]].map(([y, t], i) => (
              <g key={i}>
                <rect className="ex-folha" x="430" y={y as number} width="120" height="44" rx="22" />
                <text className="ex-texto" x="490" y={(y as number) + 28}>{t}</text>
              </g>
            ))}
          </svg>
          <figcaption>2 recipientes × 2 sabores = 4 caminhos</figcaption>
        </figure>
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
