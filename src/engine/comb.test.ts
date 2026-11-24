import { describe, expect, it } from "vitest";
import { ATIVIDADES, type Atividade } from "../data/activities";
import {
  caminhosValidos,
  comparacaoDeRegras,
  chaveResultado,
  resultadosDistintos,
  validar,
} from "./comb";

/** Totais conferidos na produção das figuras (atividades.json). */
const TOTAIS: Record<string, { caminhos: number; resultados: number }> = {
  "01-casquinhas": { caminhos: 12, resultados: 12 },
  "02-mistura-de-sabores": { caminhos: 12, resultados: 6 },
  "03-sanduiches": { caminhos: 6, resultados: 6 },
  "04-roupas": { caminhos: 6, resultados: 6 },
  "05-sucos-e-copos": { caminhos: 6, resultados: 6 },
  "06-lancheira": { caminhos: 6, resultados: 6 },
  "07-duplas-de-animais": { caminhos: 20, resultados: 10 },
  "08-canetas": { caminhos: 20, resultados: 20 },
  "09-salada-de-frutas": { caminhos: 60, resultados: 10 },
  "10-cordao-de-contas": { caminhos: 24, resultados: 24 },
  "11-fotografia-dos-animais": { caminhos: 6, resultados: 6 },
  "12-entrevista": { caminhos: 12, resultados: 12 },
  "13-pizza-e-bebida": { caminhos: 16, resultados: 16 },
  "14-presente-de-festa": { caminhos: 16, resultados: 16 },
  "15-mesa-da-festa": { caminhos: 12, resultados: 12 },
  "16-podio-das-formas": { caminhos: 24, resultados: 24 },
  "17-bandeira-de-duas-cores": { caminhos: 12, resultados: 12 },
  "18-flores-no-vaso": { caminhos: 12, resultados: 6 },
  "19-mochila-de-brinquedos": { caminhos: 24, resultados: 4 },
  "20-flores-na-janela": { caminhos: 2, resultados: 2 },
  "21-fila-de-transportes": { caminhos: 6, resultados: 6 },
  "22-quatro-dias-de-tempo": { caminhos: 24, resultados: 24 },
};

describe("catálogo de atividades", () => {
  it("tem as vinte e duas atividades do catálogo", () => {
    expect(ATIVIDADES).toHaveLength(22);
    expect(ATIVIDADES.map((a) => a.id)).toEqual(Object.keys(TOTAIS));
  });

  it.each(ATIVIDADES.map((a) => [a.id, a] as const))(
    "%s gera os totais conferidos",
    (id, atividade) => {
      const esperado = TOTAIS[id];
      expect(esperado).toBeDefined();
      expect(caminhosValidos(atividade)).toHaveLength(esperado.caminhos);
      expect(resultadosDistintos(atividade).size).toBe(esperado.resultados);
    },
  );

  it("mostra todas as peças de escolha nos níveis certos", () => {
    for (const atividade of ATIVIDADES) {
      const escolhas = new Set(
        atividade.pecas.filter((p) => p.papel === "escolha").map((p) => p.id),
      );
      for (const slot of atividade.slots) {
        expect(slot.opcoes.length).toBeGreaterThanOrEqual(2);
        for (const opcao of slot.opcoes) expect(escolhas.has(opcao)).toBe(true);
      }
    }
  });
});

describe("regras", () => {
  const casquinha = ATIVIDADES.find((a) => a.id === "01-casquinhas")!;
  const mistura = ATIVIDADES.find((a) => a.id === "02-mistura-de-sabores")!;

  it("ordem distingue resultados na casquinha", () => {
    const a = { n1: "chocolate", n2: "morango" };
    const b = { n1: "morango", n2: "chocolate" };
    expect(validar(casquinha, a).ok).toBe(true);
    expect(chaveResultado(casquinha, a)).not.toBe(chaveResultado(casquinha, b));
  });

  it("ordem não distingue resultados na mistura, mas o caminho continua distinto", () => {
    const a = { n1: "chocolate", n2: "morango" };
    const b = { n1: "morango", n2: "chocolate" };
    expect(chaveResultado(mistura, a)).toBe(chaveResultado(mistura, b));
    expect(caminhosValidos(mistura)).toContainEqual(a);
    expect(caminhosValidos(mistura)).toContainEqual(b);
  });

  it("nunca aceita a mesma peça em duas posições", () => {
    for (const atividade of ATIVIDADES) {
      for (const caminho of caminhosValidos(atividade)) {
        const ids = atividade.slots.map((slot) => caminho[slot.id]);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  });

  it("recusa repetir peça quando os níveis compartilham opções", () => {
    for (const atividade of ATIVIDADES) {
      if (atividade.slots.length < 2) continue;
      const comuns = atividade.slots[1].opcoes.filter((id) =>
        atividade.slots[0].opcoes.includes(id),
      );
      if (comuns.length === 0) continue;
      const repetida = Object.fromEntries(
        atividade.slots.map((slot) => [slot.id, comuns[0]]),
      );
      expect(validar(atividade, repetida).ok).toBe(false);
    }
  });

  it("explica o que falta antes de guardar", () => {
    const parcial = { n1: "chocolate" };
    const veredito = validar(casquinha, parcial);
    expect(veredito.ok).toBe(false);
    if (!veredito.ok) expect(veredito.motivo).toContain("bola de cima");
  });
});

describe("regra cada-uma-vez", () => {
  const NOMES: Record<string, string> = {
    a: "alfa",
    b: "beta",
    x: "xis",
    y: "ipsilon",
    z: "zeta",
  };

  function comRepeticaoCadaUmaVez(opcoes: string[][]): Atividade {
    const usadas = [...new Set(opcoes.flat())];
    return {
      id: "teste-cada-uma-vez",
      versao: 1,
      titulo: "Teste",
      enunciado: "Teste",
      convite: { arquivo: "convite.png", alt: "Convite" },
      pecas: usadas.map((peca) => ({
        id: peca,
        nome: NOMES[peca] ?? peca,
        arquivo: `${peca}.png`,
        papel: "escolha",
      })),
      slots: opcoes.map((lista, indice) => ({
        id: `s${indice + 1}`,
        rotulo: `Nível ${indice + 1}`,
        opcoes: lista,
      })),
      repeticao: "cada-uma-vez",
      equivalencia: "ordenada",
      composicao: "fila",
      perguntas: [],
    };
  }

  // Interseção {a, b}; sobra uma peça própria em cada nível.
  const atividade = comRepeticaoCadaUmaVez([
    ["a", "b", "x"],
    ["a", "b", "y"],
    ["a", "b", "z"],
  ]);

  it("aceita quando todas as peças comuns aparecem", () => {
    expect(validar(atividade, { s1: "x", s2: "a", s3: "b" }).ok).toBe(true);
    expect(validar(atividade, { s1: "a", s2: "y", s3: "b" }).ok).toBe(true);
  });

  it("recusa quando falta uma peça comum", () => {
    const veredito = validar(atividade, { s1: "a", s2: "y", s3: "z" });
    expect(veredito.ok).toBe(false);
    if (!veredito.ok) {
      expect(veredito.motivo).toBe("Essa montagem não segue o enunciado da atividade.");
    }
  });

  it("recusa repetir peça mesmo com todas as comuns presentes", () => {
    const veredito = validar(atividade, { s1: "a", s2: "a", s3: "b" });
    expect(veredito.ok).toBe(false);
    if (!veredito.ok) {
      expect(veredito.motivo).toBe("Essa montagem não segue o enunciado da atividade.");
    }
  });

  it("recusa atividade impossível, com mais peças comuns do que níveis", () => {
    const impossivel = comRepeticaoCadaUmaVez([
      ["a", "b", "x"],
      ["a", "b", "x"],
    ]);
    const veredito = validar(impossivel, { s1: "a", s2: "b" });
    expect(veredito.ok).toBe(false);
    if (!veredito.ok) {
      expect(veredito.motivo).toContain("Esta atividade precisa de 3 peças");
      expect(caminhosValidos(impossivel)).toHaveLength(0);
    }
  });

  it("mantém só a não repetição quando não há peça comum", () => {
    const separada = comRepeticaoCadaUmaVez([
      ["a", "b"],
      ["x", "y"],
    ]);
    expect(validar(separada, { s1: "a", s2: "x" }).ok).toBe(true);
    expect(validar(separada, { s1: "a", s2: "y" }).ok).toBe(true);
  });
});

describe("comparação de regras", () => {
  it("casquinhas: 4 sabores, 2 bolas", () => {
    const a = ATIVIDADES.find((x) => x.id === "01-casquinhas")!;
    const c = comparacaoDeRegras(a);
    const g = (r: string, e: string) => c.find((x) => x.repeticao === r && x.equivalencia === e)!;
    expect(c).toHaveLength(6);
    expect(g("livre", "ordenada").distintos).toBe(16);
    expect(g("sem-repeticao", "ordenada").distintos).toBe(12);
    expect(g("sem-repeticao", "sem-ordem").distintos).toBe(6);
    expect(c.filter((x) => x.atual)).toHaveLength(1);
  });
});
