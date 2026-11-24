type Props = {
  tamanho?: number;
};

/**
 * Marca: uma árvore de três níveis. Ramos em laranja-fruta, folhas em azul-tinta. A cor vem
 * de `--ramo` e `--acento`, com valores de reserva para o caso de o CSS não
 * estar carregado (ícone, impressão).
 */
export function LogoArvore({ tamanho = 64 }: Props) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="var(--ramo, #cb6b1d)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 59V38" strokeWidth="5" />
        <path d="M32 38 18 24M32 38l14-14" strokeWidth="4" />
        <path d="M18 24 10 11M18 24l7-13M46 24l-7-13M46 24l8-13" strokeWidth="3" />
      </g>
      <g fill="var(--acento, #1f4e8c)">
        <circle cx="10" cy="10" r="5.5" />
        <circle cx="25" cy="9" r="5.5" />
        <circle cx="39" cy="9" r="5.5" />
        <circle cx="54" cy="10" r="5.5" />
      </g>
    </svg>
  );
}
