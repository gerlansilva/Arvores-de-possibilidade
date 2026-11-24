import type { Atividade } from "./activities";

/** As quatro situações combinatórias, na ordem em que o programa as apresenta. */
export type Situacao = "Produto cartesiano" | "Arranjo" | "Combinação" | "Permutação";

export const SITUACOES: { tipo: Situacao; titulo: string; ideia: string; formal: string; perguntas: string }[] = [
  {
    tipo: "Produto cartesiano",
    titulo: "Juntar coisas diferentes",
    ideia: "Escolher uma peça de cada conjunto.",
    formal: "Produto cartesiano",
    perguntas: "As escolhas vêm de conjuntos diferentes? Cada resultado junta uma peça de cada.",
  },
  {
    tipo: "Arranjo",
    titulo: "Escolher e ordenar",
    ideia: "Escolher algumas peças, e a ordem faz diferença.",
    formal: "Arranjo simples",
    perguntas: "A ordem muda o resultado? Usa só algumas peças.",
  },
  {
    tipo: "Combinação",
    titulo: "Formar grupos",
    ideia: "Escolher algumas peças, e a ordem não faz diferença.",
    formal: "Combinação simples",
    perguntas: "Trocar a ordem dá o mesmo resultado? Usa só algumas peças.",
  },
  {
    tipo: "Permutação",
    titulo: "Organizar todos",
    ideia: "Usar todas as peças, mudando a ordem.",
    formal: "Permutação simples",
    perguntas: "Usa todas as peças? Só a ordem muda.",
  },
];

function mesmoConjunto(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((x) => b.includes(x));
}

/** Classifica uma atividade pela estrutura dos níveis e pelas regras. */
export function situacaoDaAtividade(a: Atividade): Situacao {
  const iguais = a.slots.length > 0 && a.slots.every((s) => mesmoConjunto(s.opcoes, a.slots[0].opcoes));
  if (!iguais || a.repeticao === "livre") return "Produto cartesiano";
  if (a.slots.length === a.slots[0].opcoes.length && a.equivalencia === "ordenada") return "Permutação";
  return a.equivalencia === "sem-ordem" ? "Combinação" : "Arranjo";
}
