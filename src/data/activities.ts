import bruto from "./atividades.json";

export type PapelPeca = "escolha" | "suporte-fixo";

export type Peca = {
  id: string;
  nome: string;
  /** Caminho relativo dentro de `public/atividades`. */
  arquivo: string;
  papel: PapelPeca;
};

export type Slot = {
  id: string;
  /** Rótulo curto mostrado à criança, na ordem em que a escolha é feita. */
  rotulo: string;
  opcoes: string[];
};

export type Repeticao =
  /** A mesma peça pode ocupar mais de um slot. */
  | "livre"
  /** Nenhuma peça se repete entre os slots. */
  | "sem-repeticao"
  /** Cada peça das opções aparece exatamente uma vez. */
  | "cada-uma-vez";

export type Equivalencia =
  /** A ordem faz parte do resultado. */
  | "ordenada"
  /** A ordem não faz parte do resultado. */
  | "sem-ordem";

export type Composicao =
  | "casquinha"
  | "mistura"
  | "sanduiche"
  | "roupa"
  | "copo"
  | "lancheira"
  | "dupla"
  | "canetas"
  | "salada"
  | "cordao"
  | "fila";

export type Atividade = {
  id: string;
  versao: number;
  titulo: string;
  enunciado: string;
  convite: { arquivo: string; alt: string };
  pecas: Peca[];
  slots: Slot[];
  repeticao: Repeticao;
  equivalencia: Equivalencia;
  composicao: Composicao;
  /** Peça fixa usada como base da montagem (casquinha, taça, cordão). */
  suporteId?: string;
  perguntas: string[];
};

type Bruto = {
  id: string;
  titulo: string;
  enunciado: string;
  convite: { arquivo: string; alt: string };
  pecas: Peca[];
  posicoes: { nome: string; opcoes: string[] }[];
  ordem_distingue_resultados: boolean;
  permite_repetir_peca_na_montagem: boolean;
};

const COMPOSICOES: Record<string, Composicao> = {
  "01-casquinhas": "casquinha",
  "02-mistura-de-sabores": "mistura",
  "03-sanduiches": "sanduiche",
  "04-roupas": "roupa",
  "05-sucos-e-copos": "copo",
  "06-lancheira": "lancheira",
  "07-duplas-de-animais": "dupla",
  "08-canetas": "canetas",
  "09-salada-de-frutas": "salada",
  "10-cordao-de-contas": "cordao",
};

const PERGUNTAS: Record<string, string[]> = {
  "01-casquinhas": [
    "Qual bola está encostada na casquinha?",
    "O que muda quando você troca a bola de cima com a de baixo?",
    "Quais casquinhas começam com chocolate?",
  ],
  "02-mistura-de-sabores": [
    "Quais misturas você já fez?",
    "Duas crianças escolheram em ordens diferentes. O que ficou na taça de cada uma?",
    "Quantas misturas diferentes existem?",
  ],
  "03-sanduiches": [
    "O que você já montou?",
    "Quais sanduíches usam pão francês?",
    "Como conferir se falta algum recheio?",
  ],
  "04-roupas": [
    "Quais conjuntos usam a camiseta listrada?",
    "O que muda quando você troca só a peça de baixo?",
    "Como conferir todos os conjuntos sem desmontar?",
  ],
  "05-sucos-e-copos": [
    "Quais sucos você já serviu?",
    "Quais copos podem receber suco de laranja?",
    "Como conferir as combinações sem repetir?",
  ],
  "06-lancheira": [
    "Quais lanches você já montou?",
    "Quais lanches usam banana?",
    "Como saber se falta alguma fruta?",
  ],
  "07-duplas-de-animais": [
    "Quais duplas você formou?",
    "Trocar os animais de lado muda a dupla?",
    "Quantas duplas diferentes existem?",
  ],
  "08-canetas": [
    "Quais combinações de caneta você já fez?",
    "O que muda quando troca só a caneta do desenho?",
    "Como conferir todas as escolhas?",
  ],
  "09-salada-de-frutas": [
    "Quais saladas você já montou?",
    "Trocar a ordem das frutas muda a receita?",
    "Quantas saladas diferentes existem?",
  ],
  "10-cordao-de-contas": [
    "Qual conta fica junto ao nó?",
    "O que muda quando você troca duas contas de lugar?",
    "Como conferir todos os cordões?",
  ],
};

PERGUNTAS["11-fotografia-dos-animais"] = [
  "Quem pode ficar no meio? E quem fica ao lado dele?",
  "Se o tatu ficar na esquerda, quais fotografias existem?",
  "Como conferir se alguma fotografia está repetida?",
];
PERGUNTAS["12-entrevista"] = [
  "Capivara pergunta e tucano responde é a mesma entrevista que o inverso? Por quê?",
  "Quais entrevistas o tucano faz como entrevistador?",
  "Como conferir se falta alguma entrevista?",
];
PERGUNTAS["13-pizza-e-bebida"] = ["Quais lanches usam a pizza de queijo?", "O que muda quando você troca só a bebida?", "Como conferir se falta algum lanche?"];
PERGUNTAS["14-presente-de-festa"] = ["Quais presentes têm o balão azul?", "Quantos presentes existem com a pipa?", "Como conferir todos os presentes?"];
PERGUNTAS["15-mesa-da-festa"] = ["Quantas mesas usam a pizza de queijo?", "O que muda quando você troca só o balão?", "Como conferir todas as mesas sem repetir?"];
PERGUNTAS["16-podio-das-formas"] = ["Quais pódios têm a estrela em 1º lugar?", "Trocar o 1º com o 2º muda o pódio?", "Como conferir se falta algum pódio?"];
PERGUNTAS["17-bandeira-de-duas-cores"] = ["Quais bandeiras têm o vermelho em cima?", "A bandeira azul e verde é igual à verde e azul?", "Quantas bandeiras diferentes existem?"];
PERGUNTAS["18-flores-no-vaso"] = ["Quais vasos têm girassol?", "Girassol e margarida é o mesmo vaso que margarida e girassol?", "Quantos vasos diferentes existem?"];
PERGUNTAS["19-mochila-de-brinquedos"] = ["Qual brinquedo fica de fora em cada mochila?", "Quantas mochilas diferentes existem?", "Por que há tão poucas mochilas?"];
PERGUNTAS["20-flores-na-janela"] = ["Quantas janelas diferentes existem?", "O que muda quando as flores trocam de lugar?", "Como saber que não falta nenhuma?"];
PERGUNTAS["21-fila-de-transportes"] = ["Quem pode ser o primeiro? E depois dele?", "Se o barco for o último, quais filas existem?", "Como conferir se alguma fila está repetida?"];
PERGUNTAS["22-quatro-dias-de-tempo"] = ["Quais sequências começam com sol?", "Se o sol for o Dia 1, quantas sequências existem?", "Como organizar para não esquecer nenhuma?"];

const MAPEADAS: Atividade[] = (bruto as Bruto[]).map((a) => {
  const suporte = a.pecas.find((p) => p.papel === "suporte-fixo");
  return {
    id: a.id,
    versao: 1,
    titulo: a.titulo,
    enunciado: a.enunciado,
    convite: a.convite,
    pecas: a.pecas,
    slots: a.posicoes.map((p, i) => ({
      id: `n${i + 1}`,
      rotulo: p.nome,
      opcoes: p.opcoes,
    })),
    repeticao: a.permite_repetir_peca_na_montagem ? "livre" : "sem-repeticao",
    equivalencia: a.ordem_distingue_resultados ? "ordenada" : "sem-ordem",
    composicao: COMPOSICOES[a.id] ?? "fila",
    suporteId: suporte?.id,
    perguntas: PERGUNTAS[a.id] ?? [],
  };
});

export const ATIVIDADES = MAPEADAS;

export function atividade(id: string): Atividade | undefined {
  return ATIVIDADES.find((a) => a.id === id);
}

export function pecaDaAtividade(
  atividade: Atividade,
  id: string | undefined,
): Peca | undefined {
  return id ? atividade.pecas.find((p) => p.id === id) : undefined;
}

export function suporteDaAtividade(atividade: Atividade): Peca | undefined {
  return pecaDaAtividade(atividade, atividade.suporteId);
}

export function urlAtividade(arquivo: string): string {
  return `${import.meta.env.BASE_URL}atividades/${arquivo}`;
}
