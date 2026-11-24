import { describe, expect, it } from "vitest";
import { ATIVIDADES } from "../data/activities";
import {
  chaveCaminho,
  escolhasDaChave,
  resumoDaAtividade,
  rotuloCaminho,
  todosOsCaminhos,
} from "./comb";
import { arvoreCompleta, chaveDoNo, type No } from "./tree";

const atividade = (id: string) => ATIVIDADES.find((a) => a.id === id)!;

function folhas(no: No): No[] {
  return no.tipo === "folha" ? [no] : no.filhos.flatMap(folhas);
}

describe("árvore completa (modo Interpretar)", () => {
  it("desenha todos os caminhos, válidos ou não, como o Árbol", () => {
    const mistura = atividade("02-mistura-de-sabores");
    // 4 sabores em cada nível: 16 caminhos, mas só 12 seguem a regra e 6 são casos diferentes.
    expect(todosOsCaminhos(mistura)).toHaveLength(16);
    expect(folhas(arvoreCompleta(mistura))).toHaveLength(16);
    expect(resumoDaAtividade(mistura)).toEqual({ total: 16, validos: 12, distintos: 6 });
  });

  it("na casquinha a ordem muda o resultado: 12 válidos, 12 casos", () => {
    expect(resumoDaAtividade(atividade("01-casquinhas"))).toEqual({
      total: 16,
      validos: 12,
      distintos: 12,
    });
  });

  it("a chave do nó volta ao mesmo caminho da atividade", () => {
    const mistura = atividade("02-mistura-de-sabores");
    const folha = folhas(arvoreCompleta(mistura))[1];
    const chave = chaveDoNo(folha.id);
    expect(chave.split("|")).toHaveLength(mistura.slots.length);
    expect(chaveCaminho(mistura, escolhasDaChave(mistura, chave))).toBe(chave);
    expect(rotuloCaminho(mistura, "chocolate|morango")).toBe("Chocolate → Morango");
  });

  it("cada folha da árvore completa corresponde a um caminho único", () => {
    for (const a of ATIVIDADES) {
      const chaves = folhas(arvoreCompleta(a)).map((f) => chaveDoNo(f.id));
      expect(new Set(chaves).size).toBe(chaves.length);
      expect(chaves).toHaveLength(todosOsCaminhos(a).length);
    }
  });
});
