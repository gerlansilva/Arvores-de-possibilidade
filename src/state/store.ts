import { useSyncExternalStore } from "react";
import { ATIVIDADES, type Atividade } from "../data/activities";
import type { Escolhas } from "../engine/comb";
import { plural } from "../lib/texto";

export type Montagem = {
  id: string;
  /** Número de criação dentro da sessão, começando em 1. Nunca reordenar depois de agrupar. */
  n: number;
  escolhas: Escolhas;
  hora: string;
};

export type Grupo = {
  id: string;
  nome: string;
  membros: string[];
};

export type Decisao = "mesma" | "diferente" | "pensando";

/** Construir: a criança monta e a árvore cresce. Interpretar: a árvore vem completa. */
export type Modo = "construir" | "interpretar";

/** Marca que a criança põe num caminho da árvore completa. */
export type Marca = "vale" | "nao-vale";

export type Comparacao = {
  id: string;
  a: string;
  b: string;
  decisao: Decisao;
  explicacao: string;
  em: string;
};

/** Registro do professor: o que perguntou, que ajuda deu e o que mudou na solução. */
export type Mediacao = {
  id: string;
  em: string;
  pergunta: string;
  ajuda: string;
  antes: string;
  depois: string;
};

export type Sessao = {
  id: string;
  versao: 1;
  /** Cópia da atividade no momento em que a sessão começou. */
  atividade: Atividade;
  aluno: string;
  criadaEm: string;
  atualizadaEm: string;
  montagens: Montagem[];
  grupos: Grupo[];
  comparacoes: Comparacao[];
  explicacao: string;
  modo: Modo;
  /** Só no modo Interpretar: marcas por chave de caminho. */
  marcas: Record<string, Marca>;
  mediacoes: Mediacao[];
};

export type Estado = {
  sessoes: Sessao[];
  /** Atividades importadas de uma cópia; as embutidas vivem em data/activities.ts. */
  atividades: Atividade[];
};

const CHAVE = "mesa-possibilidades:v2";
/** Chaves de versões anteriores, tentadas nesta ordem só quando v2 não existe. */
const CHAVES_ANTIGAS = ["mesa-possibilidades:v1", "mesa-possibilidades"];
const REPETICOES = new Set(["livre", "sem-repeticao", "cada-uma-vez"]);
const EQUIVALENCIAS = new Set(["ordenada", "sem-ordem"]);
const vazio: Estado = { sessoes: [], atividades: [] };

function atividadeCompativel(a: Atividade | undefined): boolean {
  if (
    !a ||
    typeof a.id !== "string" ||
    typeof a.titulo !== "string" ||
    typeof a.enunciado !== "string" ||
    !a.convite ||
    typeof a.convite.arquivo !== "string"
  ) {
    return false;
  }
  if (!REPETICOES.has(a.repeticao) || !EQUIVALENCIAS.has(a.equivalencia)) {
    return false;
  }
  if (
    !Array.isArray(a.pecas) ||
    a.pecas.length === 0 ||
    !a.pecas.every((p) => p && typeof p.id === "string" && typeof p.arquivo === "string")
  ) {
    return false;
  }
  if (
    !Array.isArray(a.slots) ||
    a.slots.length === 0 ||
    !a.slots.every(
      (s) => s && typeof s.id === "string" && Array.isArray(s.opcoes) && s.opcoes.length > 0,
    )
  ) {
    return false;
  }
  const ids = new Set(a.pecas.map((p) => p.id));
  return a.slots.every((s) => s.opcoes.every((opcao) => ids.has(opcao)));
}

function dataValida(valor: unknown): string | undefined {
  if (typeof valor !== "string") return undefined;
  return Number.isNaN(Date.parse(valor)) ? undefined : valor;
}

function normalizarMontagem(bruta: unknown, indice: number): Montagem | undefined {
  if (!bruta || typeof bruta !== "object") return undefined;
  const m = bruta as Partial<Montagem>;
  if (typeof m.id !== "string" || !m.escolhas || typeof m.escolhas !== "object") {
    return undefined;
  }
  return {
    id: m.id,
    n: typeof m.n === "number" && m.n > 0 ? m.n : indice + 1,
    escolhas: { ...m.escolhas },
    hora: dataValida(m.hora) ?? new Date().toISOString(),
  };
}

function normalizarGrupo(bruto: unknown): Grupo | undefined {
  if (!bruto || typeof bruto !== "object") return undefined;
  const g = bruto as Partial<Grupo>;
  if (
    typeof g.id !== "string" ||
    typeof g.nome !== "string" ||
    !Array.isArray(g.membros) ||
    !g.membros.every((m) => typeof m === "string")
  ) {
    return undefined;
  }
  return { id: g.id, nome: g.nome, membros: [...g.membros] };
}

function normalizarComparacao(bruto: unknown): Comparacao | undefined {
  if (!bruto || typeof bruto !== "object") return undefined;
  const c = bruto as Partial<Comparacao>;
  if (
    typeof c.id !== "string" ||
    typeof c.a !== "string" ||
    typeof c.b !== "string" ||
    (c.decisao !== "mesma" && c.decisao !== "diferente" && c.decisao !== "pensando")
  ) {
    return undefined;
  }
  return {
    id: c.id,
    a: c.a,
    b: c.b,
    decisao: c.decisao,
    explicacao: typeof c.explicacao === "string" ? c.explicacao : "",
    em: dataValida(c.em) ?? new Date().toISOString(),
  };
}

function normalizarMarcas(bruto: unknown): Record<string, Marca> {
  const marcas: Record<string, Marca> = {};
  if (!bruto || typeof bruto !== "object") return marcas;
  for (const [chave, valor] of Object.entries(bruto as Record<string, unknown>)) {
    if (valor === "vale" || valor === "nao-vale") marcas[chave] = valor;
  }
  return marcas;
}

function normalizarMediacoes(brutas: unknown): Mediacao[] {
  if (!Array.isArray(brutas)) return [];
  const texto = (v: unknown) => (typeof v === "string" ? v : "");
  return brutas.flatMap((m) => {
    if (!m || typeof m !== "object") return [];
    const x = m as Record<string, unknown>;
    if (typeof x.id !== "string") return [];
    return [{
      id: x.id,
      em: dataValida(x.em) ?? new Date().toISOString(),
      pergunta: texto(x.pergunta),
      ajuda: texto(x.ajuda),
      antes: texto(x.antes),
      depois: texto(x.depois),
    }];
  });
}

function normalizarSessao(bruta: unknown): Sessao | undefined {
  if (!bruta || typeof bruta !== "object") return undefined;
  const s = bruta as Partial<Sessao>;
  if (typeof s.id !== "string" || !Array.isArray(s.montagens) || !atividadeCompativel(s.atividade)) {
    return undefined;
  }
  const agora = new Date().toISOString();
  const criadaEm = dataValida(s.criadaEm) ?? agora;
  return {
    id: s.id,
    versao: 1,
    atividade: s.atividade as Atividade,
    aluno: typeof s.aluno === "string" ? s.aluno : "",
    criadaEm,
    atualizadaEm: dataValida(s.atualizadaEm) ?? criadaEm,
    montagens: s.montagens
      .map((m, i) => normalizarMontagem(m, i))
      .filter((m): m is Montagem => Boolean(m)),
    grupos: (Array.isArray(s.grupos) ? s.grupos : [])
      .map(normalizarGrupo)
      .filter((g): g is Grupo => Boolean(g)),
    comparacoes: (Array.isArray(s.comparacoes) ? s.comparacoes : [])
      .map(normalizarComparacao)
      .filter((c): c is Comparacao => Boolean(c)),
    explicacao: typeof s.explicacao === "string" ? s.explicacao : "",
    modo: s.modo === "interpretar" ? "interpretar" : "construir",
    marcas: normalizarMarcas(s.marcas),
    mediacoes: normalizarMediacoes(s.mediacoes),
  };
}

function normalizarEstado(dados: unknown): Estado | undefined {
  if (!dados || typeof dados !== "object") return undefined;
  const bruto = dados as Partial<Estado>;
  if (!Array.isArray(bruto.sessoes) && !Array.isArray(bruto.atividades)) return undefined;

  const porId = new Map<string, Sessao>();
  for (const item of bruto.sessoes ?? []) {
    const sessao = normalizarSessao(item);
    if (sessao && !porId.has(sessao.id)) porId.set(sessao.id, sessao);
  }

  const atividades = new Map<string, Atividade>();
  for (const item of bruto.atividades ?? []) {
    if (atividadeCompativel(item) && !atividades.has(item.id)) {
      atividades.set(item.id, item);
    }
  }

  return { sessoes: [...porId.values()], atividades: [...atividades.values()] };
}

function id(prefixo: string): string {
  return `${prefixo}_${Math.random().toString(36).slice(2, 10)}`;
}

function agora(): string {
  return new Date().toISOString();
}

function carregar(): Estado {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) return normalizarEstado(JSON.parse(bruto)) ?? vazio;
  } catch {
    return vazio;
  }
  return migrarChavesAntigas();
}

/**
 * Copia uma única vez os dados de versões anteriores para v2. A chave antiga
 * permanece intacta; se nenhuma delas tiver dados válidos, não grava nada.
 */
function migrarChavesAntigas(): Estado {
  for (const chave of CHAVES_ANTIGAS) {
    try {
      const bruto = localStorage.getItem(chave);
      if (!bruto) continue;
      const dados = normalizarEstado(JSON.parse(bruto));
      if (!dados || (dados.sessoes.length === 0 && dados.atividades.length === 0)) continue;
      try {
        localStorage.setItem(CHAVE, JSON.stringify(dados));
      } catch {
        // Sem espaço local: a sessão segue em memória e o rodapé avisa.
        falhaAoGravar = true;
      }
      return dados;
    } catch {
      // Chave ilegível; tenta a próxima.
    }
  }
  return vazio;
}

let falhaAoGravar = false;
let estado: Estado = carregar();
const ouvintes = new Set<() => void>();

function salvar(): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
    falhaAoGravar = false;
  } catch {
    // A sessão continua em memória; o rodapé avisa que ela não sobreviverá ao
    // fechamento da janela.
    falhaAoGravar = true;
  }
}

function definir(mudanca: (atual: Estado) => Estado): void {
  estado = mudanca(estado);
  salvar();
  for (const ouvinte of ouvintes) ouvinte();
}

function assinar(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function useEstado(): Estado {
  return useSyncExternalStore(assinar, () => estado, () => estado);
}

/** Verdadeiro quando a última gravação local falhou. */
export function useFalhaAoGravar(): boolean {
  return useSyncExternalStore(assinar, () => falhaAoGravar, () => falhaAoGravar);
}

function atualizarSessao(idSessao: string, mudanca: (s: Sessao) => Sessao): void {
  definir((atual) => ({
    ...atual,
    sessoes: atual.sessoes.map((s) => (s.id === idSessao ? mudanca(s) : s)),
  }));
}

export function criarSessao(
  atividade: Atividade,
  aluno = "",
  modo: Modo = "construir",
): Sessao {
  const sessao: Sessao = {
    id: id("ses"),
    versao: 1,
    atividade: JSON.parse(JSON.stringify(atividade)) as Atividade,
    aluno,
    criadaEm: agora(),
    atualizadaEm: agora(),
    montagens: [],
    grupos: [],
    comparacoes: [],
    explicacao: "",
    modo,
    marcas: {},
    mediacoes: [],
  };
  definir((atual) => ({ ...atual, sessoes: [sessao, ...atual.sessoes] }));
  return sessao;
}

export function guardarMontagem(idSessao: string, escolhas: Escolhas): Montagem | undefined {
  let criada: Montagem | undefined;
  atualizarSessao(idSessao, (s) => {
    criada = {
      id: id("mon"),
      // A numeração continua de onde parou: remover uma montagem não reaproveita
      // o número dela.
      n: s.montagens.reduce((maior, m) => Math.max(maior, m.n), 0) + 1,
      escolhas: { ...escolhas },
      hora: agora(),
    };
    return {
      ...s,
      montagens: [...s.montagens, criada],
      atualizadaEm: agora(),
    };
  });
  return criada;
}

export function removerMontagem(idSessao: string, idMontagem: string): void {
  atualizarSessao(idSessao, (s) => {
    const grupos = s.grupos
      .map((g) => ({ ...g, membros: g.membros.filter((m) => m !== idMontagem) }))
      .filter((g) => g.membros.length >= 2);
    return {
      ...s,
      montagens: s.montagens.filter((m) => m.id !== idMontagem),
      comparacoes: s.comparacoes.filter(
        (c) => c.a !== idMontagem && c.b !== idMontagem,
      ),
      grupos,
      atualizadaEm: agora(),
    };
  });
}

export function removerSessao(idSessao: string): void {
  definir((atual) => ({
    ...atual,
    sessoes: atual.sessoes.filter((s) => s.id !== idSessao),
  }));
}

export function criarGrupo(idSessao: string, nome: string, membros: string[]): void {
  atualizarSessao(idSessao, (s) => ({
    ...s,
    grupos: [...s.grupos, { id: id("grp"), nome, membros }],
    atualizadaEm: agora(),
  }));
}

export function removerGrupo(idSessao: string, idGrupo: string): void {
  atualizarSessao(idSessao, (s) => ({
    ...s,
    grupos: s.grupos.filter((g) => g.id !== idGrupo),
    atualizadaEm: agora(),
  }));
}

export function registrarComparacao(
  idSessao: string,
  a: string,
  b: string,
  decisao: Decisao,
  explicacao = "",
): void {
  atualizarSessao(idSessao, (s) => {
    const outra = s.comparacoes.find(
      (c) => (c.a === a && c.b === b) || (c.a === b && c.b === a),
    );
    const comparacoes: Comparacao[] = outra
      ? s.comparacoes.map((c) =>
          c.id === outra.id ? { ...c, decisao, explicacao, em: agora() } : c,
        )
      : [...s.comparacoes, { id: id("cmp"), a, b, decisao, explicacao, em: agora() }];
    return { ...s, comparacoes, atualizadaEm: agora() };
  });
}

export function adicionarMediacao(idSessao: string, dados: Omit<Mediacao, "id" | "em">): void {
  atualizarSessao(idSessao, (s) => ({
    ...s,
    mediacoes: [...s.mediacoes, { ...dados, id: id("med"), em: agora() }],
    atualizadaEm: agora(),
  }));
}

export function removerMediacao(idSessao: string, idMediacao: string): void {
  atualizarSessao(idSessao, (s) => ({
    ...s,
    mediacoes: s.mediacoes.filter((m) => m.id !== idMediacao),
    atualizadaEm: agora(),
  }));
}

/** `null` tira a marca do caminho. */
export function marcarCaminho(idSessao: string, chave: string, marca: Marca | null): void {
  atualizarSessao(idSessao, (s) => {
    const marcas = { ...s.marcas };
    if (marca) marcas[chave] = marca;
    else delete marcas[chave];
    return { ...s, marcas, atualizadaEm: agora() };
  });
}

/** Guarda uma atividade criada no editor. As sessões já abertas não mudam. */
export function salvarAtividade(atividade: Atividade): void {
  definir((atual) => ({
    ...atual,
    atividades: [...atual.atividades.filter((a) => a.id !== atividade.id), atividade],
  }));
}

/** Remove só a atividade do professor; as sessões guardam a própria cópia e continuam. */
export function removerAtividade(id: string): void {
  definir((atual) => ({
    ...atual,
    atividades: atual.atividades.filter((a) => a.id !== id),
  }));
}

export function salvarExplicacao(idSessao: string, explicacao: string): void {
  atualizarSessao(idSessao, (s) => ({ ...s, explicacao, atualizadaEm: agora() }));
}

export function identificarSessao(idSessao: string, aluno: string): void {
  atualizarSessao(idSessao, (s) => ({ ...s, aluno, atualizadaEm: agora() }));
}

export function exportarEstado(): string {
  return JSON.stringify(estado, null, 2);
}

/**
 * Junta a versão importada com a local sem apagar trabalho: montagens, grupos e
 * comparações são unidos por id; a explicação e o nome vêm da versão mais nova.
 */
function mesclarSessao(atual: Sessao, nova: Sessao): { sessao: Sessao; mudou: boolean } {
  let mudou = false;

  const montagens = [...atual.montagens];
  const idsMontagem = new Set(montagens.map((m) => m.id));
  for (const m of nova.montagens) {
    if (!idsMontagem.has(m.id)) {
      montagens.push(m);
      idsMontagem.add(m.id);
      mudou = true;
    }
  }
  montagens.sort((a, b) => Date.parse(a.hora) - Date.parse(b.hora));

  const grupos = [...atual.grupos];
  const idsGrupo = new Set(grupos.map((g) => g.id));
  for (const g of nova.grupos) {
    if (!idsGrupo.has(g.id)) {
      grupos.push(g);
      idsGrupo.add(g.id);
      mudou = true;
    }
  }

  const comparacoes = [...atual.comparacoes];
  for (const c of nova.comparacoes) {
    const igual = comparacoes.find(
      (outra) => (outra.a === c.a && outra.b === c.b) || (outra.a === c.b && outra.b === c.a),
    );
    if (!igual) {
      comparacoes.push(c);
      mudou = true;
    } else if (Date.parse(c.em) > Date.parse(igual.em)) {
      comparacoes[comparacoes.indexOf(igual)] = c;
      mudou = true;
    }
  }

  const mediacoes = [...atual.mediacoes];
  for (const m of nova.mediacoes) {
    if (!mediacoes.some((o) => o.id === m.id)) {
      mediacoes.push(m);
      mudou = true;
    }
  }

  const maisNova = Date.parse(nova.atualizadaEm) > Date.parse(atual.atualizadaEm);
  const explicacao =
    nova.explicacao && (maisNova || !atual.explicacao) ? nova.explicacao : atual.explicacao;
  const aluno = nova.aluno && (maisNova || !atual.aluno) ? nova.aluno : atual.aluno;

  if (!mudou && !maisNova && explicacao === atual.explicacao && aluno === atual.aluno) {
    return { sessao: atual, mudou: false };
  }

  return {
    sessao: {
      ...atual,
      aluno,
      explicacao,
      montagens: montagens.map((m, i) => ({ ...m, n: i + 1 })),
      grupos,
      comparacoes,
      mediacoes,
      atualizadaEm: maisNova ? nova.atualizadaEm : atual.atualizadaEm,
    },
    mudou: true,
  };
}

export function importarEstado(texto: string): { ok: boolean; mensagem: string } {
  try {
    const dados = normalizarEstado(JSON.parse(texto));
    if (!dados) {
      return { ok: false, mensagem: "O arquivo não parece ser uma cópia salva por este programa." };
    }
    if (dados.sessoes.length === 0 && dados.atividades.length === 0) {
      return {
        ok: false,
        mensagem: "O arquivo está em ordem, mas não tem sessões nem atividades para importar.",
      };
    }

    const sessoesAtuais = new Map(estado.sessoes.map((s) => [s.id, s]));
    const adicionadas: Sessao[] = [];
    const mescladas: Sessao[] = [];
    for (const nova of dados.sessoes) {
      const atual = sessoesAtuais.get(nova.id);
      if (!atual) {
        sessoesAtuais.set(nova.id, nova);
        adicionadas.push(nova);
      } else {
        const resultado = mesclarSessao(atual, nova);
        if (resultado.mudou) {
          sessoesAtuais.set(nova.id, resultado.sessao);
          mescladas.push(resultado.sessao);
        }
      }
    }

    const atividadesAtuais = new Map(estado.atividades.map((a) => [a.id, a]));
    const atividadesNovas: Atividade[] = [];
    for (const atividade of dados.atividades) {
      const embutida = ATIVIDADES.some((a) => a.id === atividade.id);
      if (!embutida && !atividadesAtuais.has(atividade.id)) {
        atividadesAtuais.set(atividade.id, atividade);
        atividadesNovas.push(atividade);
      }
    }

    if (adicionadas.length === 0 && mescladas.length === 0 && atividadesNovas.length === 0) {
      return {
        ok: true,
        mensagem: "Tudo o que estava no arquivo já existe neste dispositivo.",
      };
    }

    definir((atual) => ({
      sessoes: [
        ...adicionadas,
        ...atual.sessoes.map((s) => sessoesAtuais.get(s.id) ?? s),
      ],
      atividades: [...atividadesNovas, ...atual.atividades],
    }));

    const partes = [
      adicionadas.length > 0
        ? plural(adicionadas.length, "sessão importada", "sessões importadas")
        : "",
      mescladas.length > 0
        ? plural(mescladas.length, "sessão atualizada", "sessões atualizadas")
        : "",
      atividadesNovas.length > 0
        ? plural(atividadesNovas.length, "atividade importada", "atividades importadas")
        : "",
    ].filter(Boolean);
    return { ok: true, mensagem: `${partes.join(", ")}.` };
  } catch {
    return { ok: false, mensagem: "Não foi possível ler o arquivo." };
  }
}
