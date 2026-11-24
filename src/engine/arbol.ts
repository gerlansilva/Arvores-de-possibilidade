/**
 * Motor do Árbol (Aguirre, 2005): o professor ou a criança define níveis e os
 * elementos de cada nível; a árvore mostra TODOS os caminhos, válidos ou não.
 * Não há regras nem feedback: quem decide quais casos valem é quem pinta.
 */

export type NivelDoArbol = { nome: string; elementos: string[] };
export type DefinicaoDoArbol = { nome: string; niveis: NivelDoArbol[] };

export const MAX_NIVEIS = 6;
export const MAX_ELEMENTOS = 12;
/** Acima disso a árvore não é desenhada: ficaria ilegível. */
export const MAX_CAMINHOS = 2000;

export function totalDeCaminhos(niveis: NivelDoArbol[]): number {
  if (niveis.length === 0) return 0;
  return niveis.reduce((total, n) => total * n.elementos.length, 1);
}

/** Verdadeiro quando todo nível tem pelo menos um elemento com texto. */
export function definicaoCompleta(def: DefinicaoDoArbol): boolean {
  return (
    def.nome.trim().length > 0 &&
    def.niveis.length > 0 &&
    def.niveis.every((n) => n.nome.trim().length > 0 && n.elementos.length > 0 && n.elementos.every((e) => e.trim().length > 0))
  );
}

export const LARGURA_NO = 150;
export const ALTURA_NO = 30;
export const ESPACO_NO = 10;
export const LARGURA_COLUNA = 230;
export const MARGEM = 20;
export const TOPO = 44;

export type NoDoArbol = {
  /** Índices dos elementos escolhidos em cada nível até este nó, separados por ".". */
  id: string;
  nivel: number;
  rotulo: string;
  x: number;
  y: number;
  folha: boolean;
  pai?: string;
};

export type DiagramaDoArbol = {
  nos: NoDoArbol[];
  arestas: { de: string; para: string }[];
  largura: number;
  altura: number;
  colunas: { nivel: number; nome: string; x: number }[];
};

/** Caminhos completos, na ordem em que aparecem de cima para baixo. */
export function todasAsFolhas(niveis: NivelDoArbol[]): string[] {
  let atual: number[][] = [[]];
  for (const nivel of niveis) {
    const proximo: number[][] = [];
    for (const prefixo of atual) {
      nivel.elementos.forEach((_, i) => proximo.push([...prefixo, i]));
    }
    atual = proximo;
  }
  return niveis.length === 0 ? [] : atual.map((c) => c.join("."));
}

export function rotulosDoCaminho(niveis: NivelDoArbol[], id: string): string[] {
  return id.split(".").map((indice, nivel) => niveis[nivel]?.elementos[Number(indice)] ?? "");
}

/** Posiciona a árvore da esquerda para a direita, sem nó raiz: o nível 1 é a primeira coluna. */
export function diagramar(niveis: NivelDoArbol[]): DiagramaDoArbol {
  const nos: NoDoArbol[] = [];
  const arestas: { de: string; para: string }[] = [];
  const passo = ALTURA_NO + ESPACO_NO;
  let proximaFolha = 0;

  function visitar(nivel: number, prefixo: number[], pai: string | undefined): number {
    const ultimo = nivel === niveis.length - 1;
    const filhosY: number[] = [];
    niveis[nivel].elementos.forEach((rotulo, i) => {
      const caminho = [...prefixo, i];
      const id = caminho.join(".");
      let y: number;
      if (ultimo) {
        y = TOPO + proximaFolha * passo;
        proximaFolha += 1;
      } else {
        y = visitar(nivel + 1, caminho, id);
      }
      nos.push({ id, nivel, rotulo, x: MARGEM + nivel * LARGURA_COLUNA, y, folha: ultimo, pai });
      if (pai) arestas.push({ de: pai, para: id });
      filhosY.push(y);
    });
    // Posição do "pai" que pediu esta chamada: ponto médio dos filhos.
    return (filhosY[0] + filhosY[filhosY.length - 1]) / 2;
  }

  if (niveis.length === 0 || niveis.some((n) => n.elementos.length === 0)) {
    return { nos, arestas, largura: 0, altura: 0, colunas: [] };
  }

  // O nível 1 não tem pai: percorremos os elementos dele e cada um calcula o próprio y.
  niveis[0].elementos.forEach((rotulo, i) => {
    const id = String(i);
    let y: number;
    if (niveis.length === 1) {
      y = TOPO + proximaFolha * passo;
      proximaFolha += 1;
    } else {
      y = visitar(1, [i], id);
    }
    nos.push({ id, nivel: 0, rotulo, x: MARGEM, y, folha: niveis.length === 1 });
  });

  // `visitar` registra as arestas com o pai já conhecido; os nós do nível 1 foram
  // empilhados depois dos filhos, então ordenamos por nível e posição para estabilidade.
  nos.sort((a, b) => a.nivel - b.nivel || a.y - b.y);

  return {
    nos,
    arestas,
    largura: MARGEM * 2 + (niveis.length - 1) * LARGURA_COLUNA + LARGURA_NO,
    altura: TOPO + proximaFolha * passo + MARGEM,
    colunas: niveis.map((n, nivel) => ({ nivel, nome: n.nome, x: MARGEM + nivel * LARGURA_COLUNA })),
  };
}

/** Um nó fica vermelho quando algum caminho marcado passa por ele. */
export function noEstaMarcado(id: string, marcadas: ReadonlySet<string>): boolean {
  for (const folha of marcadas) {
    if (folha === id || folha.startsWith(`${id}.`)) return true;
  }
  return false;
}
