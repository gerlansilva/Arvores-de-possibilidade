type Nome =
  | "mais" | "menos" | "play" | "imprimir" | "ajuda" | "casa" | "lixeira" | "guardar" | "tabela" | "arvore"
  | "professor" | "cima" | "baixo" | "limpar" | "editar" | "abrir" | "arquivo" | "voltar" | "figurinhas"
  | "livro" | "info" | "olho"
  | "aba-montar" | "aba-colecao" | "aba-arvore" | "aba-registro"
  | "inicio" | "atividades" | "nova-atividade" | "exemplos" | "biblioteca" | "passos" | "orientacoes" | "sobre";

const CAMINHOS: Partial<Record<Nome, string>> = {
  mais: "M12 5v14M5 12h14",
  menos: "M5 12h14",
  play: "M8 5l11 7-11 7z",
  imprimir: "M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M7 14h10v6H7z",
  ajuda: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01",
  casa: "M4 11l8-7 8 7M6 10v10h12V10M10 20v-6h4v6",
  lixeira: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6",
  guardar: "M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6",
  tabela: "M4 5h16v14H4zM4 10h16M4 15h16M10 5v14",
  arvore: "M4 12h5M9 12l5-6h6M9 12h11M9 12l5 6h6",
  professor: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0",
  cima: "M12 19V5M6 11l6-6 6 6",
  baixo: "M12 5v14M6 13l6 6 6-6",
  limpar: "M6 6l12 12M18 6L6 18",
  editar: "M5 19l1-4L16 5l3 3L9 18zM14 7l3 3",
  abrir: "M4 7h6l2 2h8v10H4z",
  arquivo: "M7 3h7l4 4v14H7zM14 3v5h4",
  voltar: "M10 6l-6 6 6 6M4 12h16",
  figurinhas: "M5 5h14v14H5zM9 10a1.2 1.2 0 1 0 0-.01M5 17l5-5 4 4 2-2 3 3",
  livro: "M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM8 20a3 3 0 0 1-3-3",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5h.01",
  olho: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
};


/**
 * Desenhos próprios do programa (grade 24, traço 1,75). `realce` é um
 * preenchimento translúcido na própria cor do ícone: marca a peça "que vale".
 */
const DESENHOS: Partial<Record<Nome, { tracos: string; realce?: string }>> = {
  // árvore: raiz em pílula, ramos que se bifurcam, três folhas; a do meio está pintada
  "aba-arvore": {
    tracos:
      "M4.8 9.2h.4a2.8 2.8 0 0 1 0 5.6h-.4a2.8 2.8 0 0 1 0-5.6zM8 12c3 0 3-7 6-7M8 12h6M8 12c3 0 3 7 6 7" +
      "M16.2 2.8h3.6a2.2 2.2 0 0 1 0 4.4h-3.6a2.2 2.2 0 0 1 0-4.4zM16.2 9.8h3.6a2.2 2.2 0 0 1 0 4.4h-3.6a2.2 2.2 0 0 1 0-4.4zM16.2 16.8h3.6a2.2 2.2 0 0 1 0 4.4h-3.6a2.2 2.2 0 0 1 0-4.4z",
    realce: "M16.2 9.8h3.6a2.2 2.2 0 0 1 0 4.4h-3.6a2.2 2.2 0 0 1 0-4.4z",
  },
  // montar: a peça desce e se encaixa no vão
  "aba-montar": {
    tracos: "M9.5 2.8h5A2 2 0 0 1 16.5 4.8v7.4a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V4.8a2 2 0 0 1 2-2zM3.5 11v7.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V11",
    realce: "M9.5 2.8h5A2 2 0 0 1 16.5 4.8v7.4a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V4.8a2 2 0 0 1 2-2z",
  },
  // coleção: círculo, quadrado e triângulo guardados na mesma prateleira
  "aba-colecao": {
    tracos: "M7 3.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6zM14.2 3.2h5a1.2 1.2 0 0 1 1.2 1.2v5.2a1.2 1.2 0 0 1-1.2 1.2h-5a1.2 1.2 0 0 1-1.2-1.2V4.4a1.2 1.2 0 0 1 1.2-1.2zM3.2 20.8h7.6L7 13.4zM15.1 14.4h3.2a2.6 2.6 0 0 1 0 5.2h-3.2a2.6 2.6 0 0 1 0-5.2z",
    realce: "M15.1 14.4h3.2a2.6 2.6 0 0 1 0 5.2h-3.2a2.6 2.6 0 0 1 0-5.2z",
  },
  // registro: folha com linhas e o carimbo de "conferido"
  "aba-registro": {
    tracos: "M5 3h9.5a2 2 0 0 1 2 2v5.5M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6M6.8 8h6M6.8 12h4M17 12.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM14.8 17l1.6 1.6 3-3.2",
    realce: "M17 12.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z",
  },
  // início: telhado e uma porta em pílula
  inicio: {
    tracos: "M3.5 11.5 12 4l8.5 7.5M6 10v9.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V10M10 20v-4.8a2 2 0 0 1 4 0V20",
    realce: "M10 20v-4.8a2 2 0 0 1 4 0V20z",
  },
  // atividades: figurinha com a ponta descolando
  atividades: {
    tracos: "M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9l-6 6H6a2 2 0 0 1-2-2zM14 20v-4a2 2 0 0 1 2-2h4M9.5 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
    realce: "M9.5 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  },
  "nova-atividade": {
    tracos: "M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9l-6 6H6a2 2 0 0 1-2-2zM14 20v-4a2 2 0 0 1 2-2h4M11 7.5v6M8 10.5h6",
  },
  // exemplos: ficha com uma árvore pequena dentro e outra ficha por trás
  exemplos: {
    tracos: "M7 3h10a3 3 0 0 1 3 3v11M5 6h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM6 13.5h3M9 13.5c1.8 0 1.8-3 3.6-3H14M9 13.5c1.8 0 1.8 3 3.6 3H14",
  },
  // biblioteca: três fichas em pé, a última inclinada
  biblioteca: {
    tracos: "M4.5 4.5h3.5v15H4.5zM10 4.5h3.5v15H10zM15.6 5.6l3.3-.9 3.4 14.3-3.3.9z",
    realce: "M10 4.5h3.5v15H10z",
  },
  // passo a passo: degraus subindo
  passos: {
    tracos: "M3.5 20.5V16h5v-4.5h5V7h7v13.5z",
    realce: "M3.5 20.5V16h5v4.5z",
  },
  // orientações: quadro com uma árvore desenhada
  orientacoes: {
    tracos: "M4 4h16v11H4zM12 15v4M8 20h8M7.5 9.5H10M10 9.5c1.3 0 1.3-2.2 2.6-2.2H15M10 9.5c1.3 0 1.3 2.2 2.6 2.2H15",
  },
  // sobre: a marca do programa, um Y com três pontas
  sobre: {
    tracos: "M12 21v-8M12 13 7 8M12 13l5-5M12 13V6.6M7 5.6a1.6 1.6 0 1 0 0 .01M12 3.4a1.6 1.6 0 1 0 0 .01M17 5.6a1.6 1.6 0 1 0 0 .01",
    realce: "M12 3.4a1.6 1.6 0 1 0 0 .01",
  },
};

/** Nomes antigos que passam a usar os desenhos novos. */
const ALIAS: Partial<Record<Nome, Nome>> = {
  arvore: "aba-arvore",
  figurinhas: "atividades",
  livro: "exemplos",
  casa: "inicio",
};

/** Ícones de traço, todos com o mesmo peso, para os botões do programa. */
export function Icone({ nome, tamanho = 18 }: { nome: Nome; tamanho?: number }) {
  const desenho = DESENHOS[ALIAS[nome] ?? nome];
  return (
    <svg
      className="icone"
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {desenho ? (
        <>
          {desenho.realce && <path d={desenho.realce} fill="currentColor" fillOpacity=".22" stroke="none" />}
          <path d={desenho.tracos} />
        </>
      ) : (
        <path d={CAMINHOS[nome]} />
      )}
    </svg>
  );
}

export type NomeDeIcone = Nome;
