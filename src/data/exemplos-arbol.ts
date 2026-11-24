import type { DefinicaoDoArbol } from "../engine/arbol";
import type { Situacao } from "./situacoes";

/**
 * Exemplos dos quatro tipos de problema combinatório, a partir das situações
 * usadas com o Árbol em Azevedo, Costa e Borba (2011). A árvore mostra todos os
 * caminhos; quem pinta de vermelho decide quais casos valem.
 */
export type ExemploDoArbol = DefinicaoDoArbol & {
  id: string;
  tipo: Situacao;
  enunciado: string;
  /** Só para o professor: quantos caminhos valem e o que observar. */
  validas: number;
  regra: string;
  perguntas: string[];
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
    validas: 10,
    regra: "Todos os caminhos valem: cada blusa combina com cada saia.",
    perguntas: ["Como você organizou as escolhas?", "Se Jane ganhar mais uma saia, o que muda na árvore?"],
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
    validas: 21,
    regra: "Valem os pares de pessoas diferentes, contados uma vez: Ana–Beto e Beto–Ana são o mesmo aperto. 7 pessoas dão 21 apertos.",
    perguntas: ["Ana–Beto e Beto–Ana são a mesma possibilidade?", "Por que alguns caminhos ficam sem cor?"],
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
    validas: 20,
    regra: "Valem os pares de pessoas diferentes, e a ordem importa: Luciana representante e Priscila vice é diferente do inverso. 5×4 = 20.",
    perguntas: ["Uma mesma pessoa pode ter os dois cargos?", "Trocar os cargos muda a possibilidade?"],
  },
  {
    id: "ex-cadeiras",
    tipo: "Permutação",
    nome: "Torcedores nas cadeiras",
    enunciado:
      "Quatro torcedores vão a um jogo e vão se sentar em quatro cadeiras lado a lado. De quantas maneiras diferentes eles podem se sentar? Pinte os casos que valem.",
    niveis: [1, 2, 3, 4].map((n) => ({ nome: `${n}ª cadeira`, elementos: torcedores })),
    validas: 24,
    regra: "Valem os caminhos sem torcedor repetido. 4×3×2×1 = 24.",
    perguntas: ["Um torcedor pode ocupar duas cadeiras?", "Como saber se não faltou nenhuma maneira?"],
  },
  {
    id: "ex-lanche",
    tipo: "Produto cartesiano",
    nome: "Lanche completo",
    enunciado:
      "Para o lanche, Rita escolhe um sanduíche, uma bebida e uma sobremesa. De quantas maneiras ela pode montar o lanche?",
    niveis: [
      { nome: "Sanduíches", elementos: ["queijo", "presunto", "ovo"] },
      { nome: "Bebidas", elementos: ["suco", "leite"] },
      { nome: "Sobremesas", elementos: ["fruta", "bolo"] },
    ],
    validas: 12,
    regra: "Todos os caminhos valem. Com três conjuntos, 3×2×2 = 12.",
    perguntas: ["O que muda na árvore quando entra o terceiro nível?", "Como contar sem desenhar tudo?"],
  },
  {
    id: "ex-flores",
    tipo: "Combinação",
    nome: "Buquê de flores",
    enunciado:
      "Marta vai montar um buquê com duas flores diferentes, escolhidas entre rosa, margarida, tulipa e girassol. Quantos buquês diferentes ela pode fazer? Pinte os que valem.",
    niveis: [
      { nome: "1ª flor", elementos: ["rosa", "margarida", "tulipa", "girassol"] },
      { nome: "2ª flor", elementos: ["rosa", "margarida", "tulipa", "girassol"] },
    ],
    validas: 6,
    regra: "Valem os pares de flores diferentes, contados uma vez: rosa–tulipa é o mesmo buquê que tulipa–rosa. C(4,2) = 6.",
    perguntas: ["Rosa–tulipa e tulipa–rosa são o mesmo buquê?", "Uma flor pode aparecer duas vezes?"],
  },
  {
    id: "ex-livros",
    tipo: "Permutação",
    nome: "Livros na estante",
    enunciado:
      "Três livros diferentes (de histórias, de ciências e de arte) vão ficar lado a lado em uma estante. De quantas maneiras podem ser organizados? Pinte os casos que valem.",
    niveis: [1, 2, 3].map((n) => ({ nome: `${n}ª posição`, elementos: ["histórias", "ciências", "arte"] })),
    validas: 6,
    regra: "Valem os caminhos sem livro repetido: todos os livros são usados, uma vez cada. 3×2×1 = 6.",
    perguntas: ["O mesmo livro pode ocupar duas posições?", "Como organizar para não esquecer nenhuma maneira?"],
  },
];
