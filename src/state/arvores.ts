import { useSyncExternalStore } from "react";
import { MAX_ELEMENTOS, MAX_NIVEIS, type DefinicaoDoArbol } from "../engine/arbol";

/** Árvore guardada na biblioteca: a definição e os caminhos pintados de vermelho. */
export type ArvoreSalva = DefinicaoDoArbol & {
  id: string;
  /** Caminhos completos marcados como válidos (ids das folhas). */
  marcadas: string[];
  criadaEm: string;
  atualizadaEm: string;
};

const CHAVE = "arbol:biblioteca:v1";

function agora(): string {
  return new Date().toISOString();
}

function novoId(): string {
  return `arv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function normalizar(bruto: unknown): ArvoreSalva | undefined {
  if (!bruto || typeof bruto !== "object") return undefined;
  const a = bruto as Partial<ArvoreSalva>;
  if (typeof a.id !== "string" || typeof a.nome !== "string" || !Array.isArray(a.niveis)) return undefined;
  if (a.niveis.length === 0 || a.niveis.length > MAX_NIVEIS) return undefined;
  const niveis = a.niveis.map((n) => ({
    nome: typeof n?.nome === "string" ? n.nome : "",
    elementos: Array.isArray(n?.elementos)
      ? n.elementos.filter((e): e is string => typeof e === "string").slice(0, MAX_ELEMENTOS)
      : [],
  }));
  if (niveis.some((n) => n.elementos.length === 0)) return undefined;
  return {
    id: a.id,
    nome: a.nome,
    niveis,
    marcadas: Array.isArray(a.marcadas) ? a.marcadas.filter((m): m is string => typeof m === "string") : [],
    criadaEm: typeof a.criadaEm === "string" ? a.criadaEm : agora(),
    atualizadaEm: typeof a.atualizadaEm === "string" ? a.atualizadaEm : agora(),
  };
}

function normalizarLista(bruto: unknown): ArvoreSalva[] {
  const lista = Array.isArray(bruto) ? bruto : (bruto as { arvores?: unknown } | null)?.arvores;
  if (!Array.isArray(lista)) return [];
  const porId = new Map<string, ArvoreSalva>();
  for (const item of lista) {
    const a = normalizar(item);
    if (a && !porId.has(a.id)) porId.set(a.id, a);
  }
  return [...porId.values()];
}

function carregar(): ArvoreSalva[] {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? normalizarLista(JSON.parse(bruto)) : [];
  } catch {
    return [];
  }
}

let biblioteca: ArvoreSalva[] = carregar();
let falha = false;
const ouvintes = new Set<() => void>();

function definir(proxima: ArvoreSalva[]): void {
  biblioteca = proxima;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(biblioteca));
    falha = false;
  } catch {
    falha = true;
  }
  for (const ouvinte of ouvintes) ouvinte();
}

function assinar(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export function useBiblioteca(): ArvoreSalva[] {
  return useSyncExternalStore(assinar, () => biblioteca, () => biblioteca);
}

export function useFalhaDaBiblioteca(): boolean {
  return useSyncExternalStore(assinar, () => falha, () => falha);
}

/** Guarda uma árvore nova e devolve o id. */
export function guardarArvore(def: DefinicaoDoArbol, marcadas: string[] = []): string {
  const id = novoId();
  const momento = agora();
  definir([
    { ...def, id, marcadas, criadaEm: momento, atualizadaEm: momento },
    ...biblioteca,
  ]);
  return id;
}

/** Troca a definição de uma árvore existente. Marcas que deixaram de existir são descartadas. */
export function atualizarArvore(id: string, def: DefinicaoDoArbol, folhasValidas: Set<string>): void {
  definir(
    biblioteca.map((a) =>
      a.id === id
        ? { ...a, ...def, marcadas: a.marcadas.filter((m) => folhasValidas.has(m)), atualizadaEm: agora() }
        : a,
    ),
  );
}

export function marcarCaminhos(id: string, marcadas: string[]): void {
  definir(biblioteca.map((a) => (a.id === id ? { ...a, marcadas, atualizadaEm: agora() } : a)));
}

export function apagarArvore(id: string): void {
  definir(biblioteca.filter((a) => a.id !== id));
}

export function exportarBiblioteca(): string {
  return JSON.stringify({ formato: "arbol-biblioteca", versao: 1, arvores: biblioteca }, null, 2);
}

/** Junta as árvores de um arquivo à biblioteca, sem apagar nem substituir as que já existem. */
export function importarBiblioteca(texto: string): { ok: boolean; mensagem: string } {
  try {
    const lidas = normalizarLista(JSON.parse(texto));
    if (lidas.length === 0) {
      return { ok: false, mensagem: "O arquivo não tem árvores que este programa reconheça." };
    }
    const existentes = new Set(biblioteca.map((a) => a.id));
    const novas = lidas.filter((a) => !existentes.has(a.id));
    if (novas.length === 0) return { ok: true, mensagem: "Todas as árvores do arquivo já estão na biblioteca." };
    definir([...novas, ...biblioteca]);
    return { ok: true, mensagem: `${novas.length} ${novas.length === 1 ? "árvore adicionada" : "árvores adicionadas"}.` };
  } catch {
    return { ok: false, mensagem: "Não foi possível ler o arquivo." };
  }
}
