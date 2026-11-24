import { describe, expect, it } from "vitest";
import { ATIVIDADES } from "../data/activities";
import type { Montagem } from "../state/store";
import { arvoreDaSessao, caminhoDoNo } from "./tree";

function montagem(id: string, escolhas: Record<string, string>, n = 1): Montagem {
  return { id, n, escolhas, hora: new Date().toISOString() };
}

function contarFolhas(no: ReturnType<typeof arvoreDaSessao>): number {
  if (no.tipo === "folha") return no.contagem ?? 0;
  return no.filhos.reduce((soma, filho) => soma + contarFolhas(filho), 0);
}

describe("árvore da sessão", () => {
  it("não repete a montagem nos caminhos equivalentes da mistura", () => {
    const atividade = ATIVIDADES.find((a) => a.id === "02-mistura-de-sabores")!;
    const arvore = arvoreDaSessao(atividade, [
      montagem("m1", { n1: "chocolate", n2: "morango" }),
      montagem("m2", { n1: "morango", n2: "chocolate" }, 2),
    ]);

    expect(arvore.filhos).toHaveLength(2);
    for (const ramo of arvore.filhos) {
      expect(ramo.filhos).toHaveLength(1);
      expect(ramo.filhos[0].contagem).toBe(1);
    }
    expect(contarFolhas(arvore)).toBe(2);
  });

  it("cada folha guarda o caminho exato que a criança montou", () => {
    const atividade = ATIVIDADES.find((a) => a.id === "09-salada-de-frutas")!;
    const arvore = arvoreDaSessao(atividade, [
      montagem("m1", { n1: "banana", n2: "maca", n3: "uva" }),
      montagem("m2", { n1: "uva", n2: "banana", n3: "maca" }, 2),
    ]);

    const ramoUva = arvore.filhos.find((ramo) => ramo.pecaId === "uva")!;
    const ramoBanana = ramoUva.filhos.find((ramo) => ramo.pecaId === "banana")!;
    const folha = ramoBanana.filhos.find((n) => n.pecaId === "maca")!;

    expect(folha.montagens).toEqual(["m2"]);
    expect(contarFolhas(arvore)).toBe(2);

    const caminho = caminhoDoNo(arvore, folha.id);
    expect(caminho[0].tipo).toBe("raiz");
    expect(caminho.slice(1).map((n) => n.pecaId)).toEqual(["uva", "banana", "maca"]);
  });

  it("atividade ordenada conta uma folha por montagem", () => {
    const atividade = ATIVIDADES.find((a) => a.id === "10-cordao-de-contas")!;
    const arvore = arvoreDaSessao(atividade, [
      montagem("m1", { n1: "conta-redonda", n2: "conta-quadrada", n3: "conta-estrela" }),
    ]);
    expect(contarFolhas(arvore)).toBe(1);
  });
});
