import { describe, expect, it } from "vitest";
import { ATIVIDADES } from "./activities";
import { situacaoDaAtividade } from "./situacoes";

describe("situacaoDaAtividade", () => {
  it("classifica as 12 atividades de origem", () => {
    const r = Object.fromEntries(ATIVIDADES.map((a) => [a.id, situacaoDaAtividade(a)]));
    expect(r).toMatchObject({
      "01-casquinhas": "Arranjo",
      "02-mistura-de-sabores": "Combinação",
      "03-sanduiches": "Produto cartesiano",
      "04-roupas": "Produto cartesiano",
      "05-sucos-e-copos": "Produto cartesiano",
      "06-lancheira": "Produto cartesiano",
      "07-duplas-de-animais": "Combinação",
      "08-canetas": "Arranjo",
      "09-salada-de-frutas": "Combinação",
      "10-cordao-de-contas": "Arranjo",
      "11-fotografia-dos-animais": "Permutação",
      "12-entrevista": "Arranjo",
    });
  });

  it("classifica as atividades novas por tipo e mantém os quatro grupos cheios", () => {
    const r = Object.fromEntries(ATIVIDADES.map((a) => [a.id, situacaoDaAtividade(a)]));
    expect(r).toMatchObject({
      "13-pizza-e-bebida": "Produto cartesiano",
      "14-presente-de-festa": "Produto cartesiano",
      "15-mesa-da-festa": "Produto cartesiano",
      "16-podio-das-formas": "Arranjo",
      "17-bandeira-de-duas-cores": "Arranjo",
      "18-flores-no-vaso": "Combinação",
      "19-mochila-de-brinquedos": "Combinação",
      "20-flores-na-janela": "Permutação",
      "21-fila-de-transportes": "Permutação",
      "22-quatro-dias-de-tempo": "Permutação",
    });
  });
});
