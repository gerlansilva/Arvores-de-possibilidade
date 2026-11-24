type Props = {
  tamanho?: number;
};

/**
 * Marca: a própria árvore de possibilidades, lida da esquerda para a direita.
 * Uma raiz em pílula verde-escura abre dois ramos, e cada ramo abre mais dois,
 * com os mesmos nós em pílula e os mesmos ramos cinza-esverdeados que aparecem
 * nas árvores do programa. As cores vêm de variáveis do tema, com valores de
 * reserva para o caso de o CSS não estar carregado (ícone, impressão).
 */
export function LogoArvore({ tamanho = 64 }: Props) {
  const ramo = "var(--ramo, #7f9285)";
  const raiz = "var(--terra-forte, #1e3b2f)";
  const folha = "var(--folha, #5f7a4a)";
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g stroke={ramo} strokeWidth="2.6" strokeLinecap="round">
        <path d="M16 32C21 32 21 18 26 18" />
        <path d="M16 32C21 32 21 46 26 46" />
        <path d="M38 18C43 18 43 11 48 11" />
        <path d="M38 18C43 18 43 25 48 25" />
        <path d="M38 46C43 46 43 39 48 39" />
        <path d="M38 46C43 46 43 53 48 53" />
      </g>
      <rect x="3" y="27" width="13" height="10" rx="5" fill={raiz} />
      <g fill={folha}>
        <rect x="26" y="13" width="12" height="10" rx="5" />
        <rect x="26" y="41" width="12" height="10" rx="5" />
        <rect x="48" y="6" width="12" height="10" rx="5" />
        <rect x="48" y="20" width="12" height="10" rx="5" />
        <rect x="48" y="34" width="12" height="10" rx="5" />
        <rect x="48" y="48" width="12" height="10" rx="5" />
      </g>
    </svg>
  );
}
