import { describe, expect, it, vi } from "vitest";
import { ATIVIDADES, type Atividade } from "../data/activities";

const memoria = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (chave: string) => memoria.get(chave) ?? null,
  setItem: (chave: string, valor: string) => memoria.set(chave, valor),
  removeItem: (chave: string) => memoria.delete(chave),
  clear: () => memoria.clear(),
});

const store = await import("./store");

const atividade = ATIVIDADES.find((a) => a.id === "01-casquinhas")!;

function escolhas(n1: string, n2: string) {
  return { n1, n2 };
}

describe("importação de sessões", () => {
  it("mescla montagens em vez de substituir a sessão local", () => {
    const sessao = store.criarSessao(atividade, "Lucas");
    store.guardarMontagem(sessao.id, escolhas("chocolate", "morango"));

    const copia = JSON.parse(store.exportarEstado());
    const daCopia = copia.sessoes.find((s: { id: string }) => s.id === sessao.id);
    daCopia.montagens.push({
      id: "mon_externa",
      n: 2,
      escolhas: escolhas("chocolate", "baunilha"),
      hora: new Date(Date.now() + 1000).toISOString(),
    });
    daCopia.atualizadaEm = new Date(Date.now() + 2000).toISOString();

    const resultado = store.importarEstado(JSON.stringify(copia));
    expect(resultado.ok).toBe(true);
    expect(resultado.mensagem).toContain("atualizada");

    const depois = JSON.parse(store.exportarEstado()).sessoes.find(
      (s: { id: string }) => s.id === sessao.id,
    );
    expect(depois.montagens.map((m: { id: string }) => m.id)).toEqual([
      expect.stringMatching(/^mon_/),
      "mon_externa",
    ]);
    expect(depois.montagens.map((m: { n: number }) => m.n)).toEqual([1, 2]);

    const sessoes = JSON.parse(store.exportarEstado()).sessoes;
    expect(sessoes.filter((s: { id: string }) => s.id === sessao.id)).toHaveLength(1);
  });

  it("não duplica sessão já importada", () => {
    const texto = store.exportarEstado();
    const resultado = store.importarEstado(texto);
    expect(resultado.ok).toBe(true);
    expect(resultado.mensagem).toContain("já existe");
  });

  it("ignora atividade importada que repete uma embutida", () => {
    const resultado = store.importarEstado(
      JSON.stringify({ sessoes: [], atividades: [atividade] }),
    );
    expect(resultado.ok).toBe(true);
    expect(JSON.parse(store.exportarEstado()).atividades).toHaveLength(0);
  });

  it("recusa arquivo fora do formato", () => {
    expect(store.importarEstado("{}").ok).toBe(false);
    expect(store.importarEstado("não é json").ok).toBe(false);
  });
});

describe("validação de atividade importada", () => {
  function comRegras(
    idAtividade: string,
    repeticao: Atividade["repeticao"],
    equivalencia: Atividade["equivalencia"] = "ordenada",
  ): Atividade {
    return { ...atividade, id: idAtividade, repeticao, equivalencia };
  }

  it.each(["livre", "sem-repeticao", "cada-uma-vez"] as const)(
    "aceita a repetição %s",
    (repeticao) => {
      const identificador = `teste-${repeticao}`;
      const resultado = store.importarEstado(
        JSON.stringify({ sessoes: [], atividades: [comRegras(identificador, repeticao)] }),
      );
      expect(resultado.ok).toBe(true);
      const importadas = JSON.parse(store.exportarEstado()).atividades;
      expect(importadas.map((a: { id: string }) => a.id)).toContain(identificador);
    },
  );

  it("recusa repetição desconhecida", () => {
    const resultado = store.importarEstado(
      JSON.stringify({
        sessoes: [],
        atividades: [
          comRegras("teste-repeticao-invalida", "as-vezes" as Atividade["repeticao"]),
        ],
      }),
    );
    expect(resultado.ok).toBe(false);
  });

  it("recusa equivalência desconhecida", () => {
    const resultado = store.importarEstado(
      JSON.stringify({
        sessoes: [],
        atividades: [
          comRegras(
            "teste-equivalencia-invalida",
            "livre",
            "quase-ordenada" as Atividade["equivalencia"],
          ),
        ],
      }),
    );
    expect(resultado.ok).toBe(false);
  });
});

describe("migração de dados antigos", () => {
  function atividadeComId(idAtividade: string): Atividade {
    return { ...atividade, id: idAtividade };
  }

  it("copia dados da chave v1 para v2 sem apagar a antiga", async () => {
    vi.resetModules();
    memoria.clear();
    memoria.set(
      "mesa-possibilidades:v1",
      JSON.stringify({ sessoes: [], atividades: [atividadeComId("teste-migrada")] }),
    );

    const migrado = await import("./store");
    const estado = JSON.parse(migrado.exportarEstado());
    expect(estado.atividades.map((a: { id: string }) => a.id)).toEqual(["teste-migrada"]);
    expect(memoria.has("mesa-possibilidades:v1")).toBe(true);
    expect(memoria.has("mesa-possibilidades:v2")).toBe(true);
    expect(JSON.parse(memoria.get("mesa-possibilidades:v2")!).atividades[0].id).toBe(
      "teste-migrada",
    );
  });

  it("usa a chave sem versão quando v1 não existe", async () => {
    vi.resetModules();
    memoria.clear();
    memoria.set(
      "mesa-possibilidades",
      JSON.stringify({ sessoes: [], atividades: [atividadeComId("teste-sem-versao")] }),
    );

    const migrado = await import("./store");
    expect(JSON.parse(migrado.exportarEstado()).atividades[0].id).toBe("teste-sem-versao");
    expect(memoria.has("mesa-possibilidades:v2")).toBe(true);
  });

  it("não migra quando v2 já tem dados", async () => {
    vi.resetModules();
    memoria.clear();
    memoria.set(
      "mesa-possibilidades:v1",
      JSON.stringify({ sessoes: [], atividades: [atividadeComId("teste-antiga")] }),
    );
    memoria.set(
      "mesa-possibilidades:v2",
      JSON.stringify({ sessoes: [], atividades: [atividadeComId("teste-atual")] }),
    );

    const atual = await import("./store");
    expect(JSON.parse(atual.exportarEstado()).atividades.map((a: { id: string }) => a.id)).toEqual([
      "teste-atual",
    ]);
  });
});

describe("remoção de montagens e sessões", () => {
  function buscar(idSessao: string) {
    return JSON.parse(store.exportarEstado()).sessoes.find(
      (s: { id: string }) => s.id === idSessao,
    );
  }

  it("limpa comparações e grupos que dependiam da montagem removida", () => {
    const sessao = store.criarSessao(atividade, "Ana");
    const a = store.guardarMontagem(sessao.id, escolhas("chocolate", "morango"))!;
    const b = store.guardarMontagem(sessao.id, escolhas("morango", "baunilha"))!;
    const c = store.guardarMontagem(sessao.id, escolhas("chocolate", "baunilha"))!;
    store.criarGrupo(sessao.id, "começam com chocolate", [a.id, c.id]);
    store.registrarComparacao(sessao.id, a.id, b.id, "diferente");
    store.registrarComparacao(sessao.id, b.id, c.id, "mesma");

    store.removerMontagem(sessao.id, a.id);

    const depois = buscar(sessao.id);
    expect(depois.montagens.map((m: { n: number }) => m.n)).toEqual([2, 3]);
    expect(depois.comparacoes.map((x: { a: string; b: string }) => [x.a, x.b])).toEqual([
      [b.id, c.id],
    ]);
    expect(depois.grupos).toHaveLength(0);
  });

  it("mantém o grupo quando ainda restam duas montagens", () => {
    const sessao = store.criarSessao(atividade, "Bia");
    const a = store.guardarMontagem(sessao.id, escolhas("chocolate", "morango"))!;
    const b = store.guardarMontagem(sessao.id, escolhas("morango", "baunilha"))!;
    const c = store.guardarMontagem(sessao.id, escolhas("chocolate", "baunilha"))!;
    store.criarGrupo(sessao.id, "três", [a.id, b.id, c.id]);

    store.removerMontagem(sessao.id, a.id);

    const depois = buscar(sessao.id);
    expect(depois.grupos).toHaveLength(1);
    expect(depois.grupos[0].membros).toEqual([b.id, c.id]);
  });

  it("não repete número depois de remover uma montagem do meio", () => {
    const sessao = store.criarSessao(atividade, "Caio");
    store.guardarMontagem(sessao.id, escolhas("chocolate", "morango"));
    const b = store.guardarMontagem(sessao.id, escolhas("morango", "baunilha"))!;
    store.guardarMontagem(sessao.id, escolhas("chocolate", "baunilha"));
    store.removerMontagem(sessao.id, b.id);
    const nova = store.guardarMontagem(sessao.id, escolhas("baunilha", "morango"))!;

    expect(nova.n).toBe(4);
    const numeros = buscar(sessao.id).montagens.map((m: { n: number }) => m.n);
    expect(new Set(numeros).size).toBe(numeros.length);
  });

  it("remove a sessão inteira", () => {
    const sessao = store.criarSessao(atividade, "Davi");
    store.guardarMontagem(sessao.id, escolhas("chocolate", "morango"));
    store.removerSessao(sessao.id);
    expect(buscar(sessao.id)).toBeUndefined();
  });
});

describe("modo Interpretar", () => {
  it("guarda as marcas por caminho e deixa tirar uma marca", () => {
    const sessao = store.criarSessao(atividade, "Bia", "interpretar");
    expect(sessao.modo).toBe("interpretar");

    store.marcarCaminho(sessao.id, "chocolate|morango", "vale");
    store.marcarCaminho(sessao.id, "chocolate|chocolate", "nao-vale");

    const copia = JSON.parse(store.exportarEstado());
    const salva = copia.sessoes.find((s: { id: string }) => s.id === sessao.id);
    expect(salva.marcas).toEqual({
      "chocolate|morango": "vale",
      "chocolate|chocolate": "nao-vale",
    });

    store.marcarCaminho(sessao.id, "chocolate|morango", null);
    const depois = JSON.parse(store.exportarEstado()).sessoes.find(
      (s: { id: string }) => s.id === sessao.id,
    );
    expect(depois.marcas).toEqual({ "chocolate|chocolate": "nao-vale" });
  });

  it("sessões antigas, sem modo, abrem como Construir", () => {
    const antiga = JSON.parse(JSON.stringify(store.criarSessao(atividade, "Ana")));
    delete antiga.modo;
    delete antiga.marcas;
    const resultado = store.importarEstado(JSON.stringify({ sessoes: [{ ...antiga, id: "ses_antiga" }], atividades: [] }));
    expect(resultado.ok).toBe(true);
    const importada = JSON.parse(store.exportarEstado()).sessoes.find(
      (s: { id: string }) => s.id === "ses_antiga",
    );
    expect(importada.modo).toBe("construir");
    expect(importada.marcas).toEqual({});
  });
});

describe("mediação do professor", () => {
  it("guarda e remove mediações", () => {
    const sessao = store.criarSessao(atividade, "Bia");
    store.adicionarMediacao(sessao.id, {
      pergunta: "O que muda?",
      ajuda: "Fiz uma pergunta",
      antes: "só um caso",
      depois: "trocou a ordem",
    });
    const lida = () =>
      JSON.parse(store.exportarEstado()).sessoes.find((s: { id: string }) => s.id === sessao.id);
    expect(lida().mediacoes).toHaveLength(1);
    expect(lida().mediacoes[0].depois).toBe("trocou a ordem");
    store.removerMediacao(sessao.id, lida().mediacoes[0].id);
    expect(lida().mediacoes).toHaveLength(0);
  });
});
