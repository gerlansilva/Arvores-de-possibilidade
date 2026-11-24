import type { Atividade } from "../data/activities";
import { pecaDaAtividade } from "../data/activities";
import type { Montagem } from "../state/store";
import type { Escolhas } from "./comb";

export type No = {
  id: string;
  tipo: "raiz" | "ramo" | "folha";
  rotulo: string;
  pecaId?: string;
  /** Arquivo da peça dentro de `public/atividades`. */
  arquivo?: string;
  contagem?: number;
  filhos: No[];
  /** Montagens da criança que percorrem exatamente este caminho. */
  montagens: string[];
};

function agrupar(escolhas: Escolhas[], atividade: Atividade, nivel: number): Map<string, Escolhas[]> {
  const slot = atividade.slots[nivel];
  const mapa = new Map<string, Escolhas[]>();
  for (const e of escolhas) {
    const chave = e[slot.id];
    mapa.set(chave, [...(mapa.get(chave) ?? []), e]);
  }
  return mapa;
}

function montarRamos(
  atividade: Atividade,
  nivel: number,
  prefixo: string,
  grupo: Escolhas[],
  montagensPorCaminho: Map<string, Montagem[]>,
): No[] {
  const ultimo = nivel === atividade.slots.length - 1;
  return [...agrupar(grupo, atividade, nivel).entries()].map(([opcao, subgrupo]) => {
    const peca = pecaDaAtividade(atividade, opcao);
    const id = `${prefixo}/${opcao}`;
    if (ultimo) {
      const caminho = atividade.slots.map((s) => subgrupo[0][s.id] ?? "").join("|");
      const registros = montagensPorCaminho.get(caminho) ?? [];
      return {
        id,
        tipo: "folha" as const,
        rotulo: peca?.nome ?? opcao,
        pecaId: opcao,
        arquivo: peca?.arquivo,
        contagem: registros.length,
        filhos: [],
        montagens: registros.map((m) => m.id),
      };
    }
    return {
      id,
      tipo: "ramo" as const,
      rotulo: peca?.nome ?? opcao,
      pecaId: opcao,
      arquivo: peca?.arquivo,
      filhos: montarRamos(atividade, nivel + 1, id, subgrupo, montagensPorCaminho),
      montagens: [],
    };
  });
}

/** Árvore construída apenas com o que a criança guardou. */
export function arvoreDaSessao(atividade: Atividade, montagens: Montagem[]): No {
  const porCaminho = new Map<string, Montagem[]>();
  for (const m of montagens) {
    const chave = atividade.slots.map((s) => m.escolhas[s.id] ?? "").join("|");
    porCaminho.set(chave, [...(porCaminho.get(chave) ?? []), m]);
  }
  const caminhos = [...porCaminho.values()].map((grupo) => grupo[0].escolhas);

  return {
    id: "raiz",
    tipo: "raiz",
    rotulo: atividade.titulo,
    filhos: caminhos.length
      ? montarRamos(atividade, 0, "raiz", caminhos, porCaminho)
      : [],
    montagens: [],
  };
}

export type Posicionado = {
  no: No;
  x: number;
  y: number;
  profundidade: number;
};

export const CAIXA = {
  largura: 200,
  altura: 58,
  coluna: 262,
  espaco: 12,
  margem: 16,
  /** Faixa reservada para os nomes dos níveis, acima das colunas. */
  topo: 40,
};

function alturaSubarvore(no: No): number {
  if (no.filhos.length === 0) return CAIXA.altura;
  const soma = no.filhos.reduce((total, filho) => total + alturaSubarvore(filho), 0);
  return Math.max(CAIXA.altura, soma + CAIXA.espaco * (no.filhos.length - 1));
}

export function diagramar(raiz: No): {
  nos: Posicionado[];
  largura: number;
  altura: number;
  arestas: { de: Posicionado; para: Posicionado }[];
} {
  const nos: Posicionado[] = [];

  function posicionar(no: No, profundidade: number, topo: number): void {
    const altura = alturaSubarvore(no);
    const y = topo + altura / 2 - CAIXA.altura / 2;
    const posicionado: Posicionado = {
      no,
      x: CAIXA.margem + profundidade * CAIXA.coluna,
      y,
      profundidade,
    };
    nos.push(posicionado);
    let cursor = topo;
    for (const filho of no.filhos) {
      posicionar(filho, profundidade + 1, cursor);
      cursor += alturaSubarvore(filho) + CAIXA.espaco;
    }
  }

  posicionar(raiz, 0, CAIXA.margem + CAIXA.topo);
  const profundidadeMaxima = nos.reduce((m, n) => Math.max(m, n.profundidade), 0);
  const arestas = nos
    .filter((n) => n.profundidade > 0)
    .map((n) => {
      const pai = nos.find(
        (p) =>
          p.profundidade === n.profundidade - 1 &&
          n.no.id.startsWith(`${p.no.id}/`),
      );
      return pai ? { de: pai, para: n } : undefined;
    })
    .filter((a): a is { de: Posicionado; para: Posicionado } => Boolean(a));

  return {
    nos,
    arestas,
    largura: CAIXA.margem * 2 + profundidadeMaxima * CAIXA.coluna + CAIXA.largura,
    altura: alturaSubarvore(raiz) + CAIXA.margem * 2 + CAIXA.topo,
  };
}

export function caminhoDoNo(raiz: No, id: string): No[] {
  if (raiz.id === id) return [raiz];
  for (const filho of raiz.filhos) {
    const achado = caminhoDoNo(filho, id);
    if (achado.length) return [raiz, ...achado];
  }
  return [];
}

/**
 * Árvore completa, como o Árbol a desenha: todos os caminhos possíveis pelos
 * níveis e pelas opções, sem filtrar pela regra. Folhas sem montagens.
 */
export function arvoreCompleta(atividade: Atividade): No {
  function ramos(nivel: number, prefixo: string): No[] {
    const slot = atividade.slots[nivel];
    const ultimo = nivel === atividade.slots.length - 1;
    return slot.opcoes.map((opcao) => {
      const peca = pecaDaAtividade(atividade, opcao);
      const id = `${prefixo}/${opcao}`;
      return {
        id,
        tipo: ultimo ? ("folha" as const) : ("ramo" as const),
        rotulo: peca?.nome ?? opcao,
        pecaId: opcao,
        arquivo: peca?.arquivo,
        filhos: ultimo ? [] : ramos(nivel + 1, id),
        montagens: [],
      };
    });
  }
  return {
    id: "raiz",
    tipo: "raiz",
    rotulo: atividade.titulo,
    filhos: atividade.slots.length ? ramos(0, "raiz") : [],
    montagens: [],
  };
}

/** Chave de caminho (a mesma de `chaveCaminho`) a partir do id de um nó. */
export function chaveDoNo(idDoNo: string): string {
  return idDoNo.replace(/^raiz\//, "").split("/").join("|");
}
