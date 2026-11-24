import type { DefinicaoDoArbol } from "../engine/arbol";

/**
 * Exemplos dos quatro tipos de problema combinatório, a partir das situações
 * usadas com o Árbol em Azevedo, Costa e Borba (2011). A árvore mostra todos os
 * caminhos; quem pinta de vermelho decide quais casos valem.
 */
export type ExemploDoArbol = DefinicaoDoArbol & {
  id: string;
  tipo: "Produto cartesiano" | "Combinação" | "Arranjo" | "Permutação";
  enunciado: string;
};

const pessoas7 = ["Ana", "Beto", "Carla", "Davi", "Elisa", "Fábio", "Gabi"];
const candidatos = ["Luciana", "Priscila", "Márcia", "Tiago", "Bruno"];
const torcedores = ["Renata", "Isabel", "Luciano", "Ricardo"];

export const EXEMPLOS: ExemploDoArbol[] = [
  {
    id: "ex-blusas-saias",
    tipo: "Produto cartesiano",
    nome: "Blusas e saias",
    enunciado:
      "Jane tem cinco blusas (amarela, rosa, laranja, vermelha e cinza) e duas saias (preta e branca). De quantas maneiras diferentes ela pode se vestir usando uma blusa e uma saia?",
    niveis: [
      { nome: "Blusas", elementos: ["amarela", "rosa", "laranja", "vermelha", "cinza"] },
      { nome: "Saias", elementos: ["preta", "branca"] },
    ],
  },
  {
    id: "ex-aperto-de-mao",
    tipo: "Combinação",
    nome: "Aperto de mão",
    enunciado:
      "Sete pessoas se encontram e cada duas apertam a mão uma vez. Quantos apertos de mão acontecem? Pinte os casos que valem (lembre que o aperto de A com B é o mesmo de B com A).",
    niveis: [
      { nome: "1ª pessoa", elementos: pessoas7 },
      { nome: "2ª pessoa", elementos: pessoas7 },
    ],
  },
  {
    id: "ex-representante-vice",
    tipo: "Arranjo",
    nome: "Representante e vice",
    enunciado:
      "Cinco alunos disputam os cargos de representante e de vice-representante da turma. De quantas maneiras os cargos podem ser ocupados? Pinte os casos que valem.",
    niveis: [
      { nome: "Representante", elementos: candidatos },
      { nome: "Vice-representante", elementos: candidatos },
    ],
  },
  {
    id: "ex-cadeiras",
    tipo: "Permutação",
    nome: "Torcedores nas cadeiras",
    enunciado:
      "Quatro torcedores vão a um jogo e vão se sentar em quatro cadeiras lado a lado. De quantas maneiras diferentes eles podem se sentar? Pinte os casos que valem.",
    niveis: [1, 2, 3, 4].map((n) => ({ nome: `${n}ª cadeira`, elementos: torcedores })),
  },
];
