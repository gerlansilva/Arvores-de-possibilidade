import { invoke, isTauri } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";

/** No aplicativo Tauri, exportar e importar usam os diálogos do sistema. */
export const desktop = isTauri();

const FILTROS = [{ name: "Cópia das sessões (JSON)", extensions: ["json"] }];

function nomeCurto(caminho: string): string {
  return caminho.split(/[\\/]/).pop() ?? caminho;
}

function escolherNoNavegador(): Promise<File | null> {
  return new Promise((resolver) => {
    const entrada = document.createElement("input");
    entrada.type = "file";
    entrada.accept = "application/json,.json";
    entrada.addEventListener("change", () => resolver(entrada.files?.[0] ?? null));
    entrada.addEventListener("cancel", () => resolver(null));
    entrada.click();
  });
}

export async function exportarJson(nome: string, conteudo: string): Promise<string | null> {
  if (desktop) {
    const caminho = await save({ defaultPath: nome, filters: FILTROS });
    if (!caminho) return null;
    await invoke("salvar_texto", { caminho, conteudo });
    return nomeCurto(caminho);
  }

  const blob = new Blob([conteudo], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
  return nome;
}

export async function importarJson(): Promise<{ nome: string; texto: string } | null> {
  if (desktop) {
    const escolhido = await open({ multiple: false, directory: false, filters: FILTROS });
    const caminho = Array.isArray(escolhido) ? escolhido[0] : escolhido;
    if (!caminho) return null;
    const texto = await invoke<string>("ler_texto", { caminho });
    return { nome: nomeCurto(caminho), texto };
  }

  const arquivo = await escolherNoNavegador();
  if (!arquivo) return null;
  return { nome: arquivo.name, texto: await arquivo.text() };
}
