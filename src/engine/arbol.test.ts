import { describe, expect, it } from "vitest";
import { diagramar, noEstaMarcado, rotulosDoCaminho, todasAsFolhas, totalDeCaminhos } from "./arbol";

const blusasESaias = [
  { nome: "Blusas", elementos: ["amarela", "rosa", "laranja", "vermelha", "cinza"] },
  { nome: "Saias", elementos: ["preta", "branca"] },
];

describe("motor do Árbol", () => {
  it("produto cartesiano: 5 blusas e 2 saias dão 10 caminhos", () => {
    expect(totalDeCaminhos(blusasESaias)).toBe(10);
    expect(todasAsFolhas(blusasESaias)).toHaveLength(10);
  });

  it("não filtra nada: 4 pessoas em 4 cadeiras dão 4×4×4×4 = 256, válidos ou não", () => {
    const pessoas = ["Renata", "Isabel", "Luciano", "Ricardo"];
    const cadeiras = [1, 2, 3, 4].map((n) => ({ nome: `${n}ª cadeira`, elementos: pessoas }));
    expect(totalDeCaminhos(cadeiras)).toBe(256);
    expect(todasAsFolhas(cadeiras)).toHaveLength(256);
  });

  it("os caminhos têm ordem estável e nomes legíveis", () => {
    const folhas = todasAsFolhas(blusasESaias);
    expect(folhas[0]).toBe("0.0");
    expect(folhas[1]).toBe("0.1");
    expect(folhas[9]).toBe("4.1");
    expect(rotulosDoCaminho(blusasESaias, "2.1")).toEqual(["laranja", "branca"]);
  });

  it("diagrama: uma folha por caminho, sem nó raiz, pai no meio dos filhos", () => {
    const d = diagramar(blusasESaias);
    const folhas = d.nos.filter((n) => n.folha);
    expect(folhas).toHaveLength(10);
    expect(d.nos.filter((n) => n.nivel === 0)).toHaveLength(5);
    const rosa = d.nos.find((n) => n.id === "1")!;
    const filhos = d.nos.filter((n) => n.pai === "1");
    expect(filhos).toHaveLength(2);
    expect(rosa.y).toBe((filhos[0].y + filhos[1].y) / 2);
    expect(d.arestas).toHaveLength(10);
    expect(new Set(folhas.map((f) => f.y)).size).toBe(10);
  });

  it("um nível só: as folhas são o próprio nível", () => {
    const d = diagramar([{ nome: "Sabores", elementos: ["a", "b", "c"] }]);
    expect(d.nos.every((n) => n.folha)).toBe(true);
    expect(d.arestas).toHaveLength(0);
  });

  it("marcar um caminho pinta todos os nós por onde ele passa", () => {
    const marcadas = new Set(["2.1"]);
    expect(noEstaMarcado("2", marcadas)).toBe(true);
    expect(noEstaMarcado("2.1", marcadas)).toBe(true);
    expect(noEstaMarcado("2.0", marcadas)).toBe(false);
    expect(noEstaMarcado("0", marcadas)).toBe(false);
    expect(noEstaMarcado("21", marcadas)).toBe(false);
  });

  it("sem elementos em algum nível, não há diagrama", () => {
    expect(diagramar([{ nome: "A", elementos: [] }]).nos).toHaveLength(0);
    expect(totalDeCaminhos([])).toBe(0);
  });
});
