type Nome =
  | "mais" | "menos" | "play" | "imprimir" | "ajuda" | "casa" | "lixeira" | "guardar" | "tabela" | "arvore"
  | "professor" | "cima" | "baixo" | "limpar" | "editar" | "abrir" | "arquivo" | "voltar" | "figurinhas"
  | "livro" | "info" | "olho";

const CAMINHOS: Record<Nome, string> = {
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

/** Ícones de traço, todos com o mesmo peso, para os botões do programa. */
export function Icone({ nome, tamanho = 18 }: { nome: Nome; tamanho?: number }) {
  return (
    <svg
      className="icone"
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={CAMINHOS[nome]} />
    </svg>
  );
}

export type NomeDeIcone = Nome;
