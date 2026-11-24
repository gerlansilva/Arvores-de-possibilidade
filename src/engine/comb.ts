import { pecaDaAtividade, type Atividade, type Equivalencia, type Repeticao } from "../data/activities";

export type Escolhas = Record<string, string>;

export type Veredito = { ok: true } | { ok: false; motivo: string };

/**
 * Resultado = o que existe no mundo depois da montagem.
 * Em "sem-ordem" (mistura), a chave é calculada sobre uma cópia ordenada.
 * A chave do caminho permanece intacta.
 */
export function chaveResultado(atividade: Atividade, escolhas: Escolhas): string {
  const ids = atividade.slots.map((s) => escolhas[s.id] ?? "");
  return atividade.equivalencia === "sem-ordem" ? [...ids].sort().join("|") : ids.join("|");
}

export function preenchidas(atividade: Atividade, escolhas: Escolhas): number {
  return atividade.slots.filter((s) => Boolean(escolhas[s.id])).length;
}

export function estaCompleta(atividade: Atividade, escolhas: Escolhas): boolean {
  return preenchidas(atividade, escolhas) === atividade.slots.length;
}

/** Peças presentes em todos os níveis, na ordem do primeiro nível. */
function pecasComuns(atividade: Atividade): string[] {
  const [primeiro, ...demais] = atividade.slots;
  if (!primeiro) return [];
  return primeiro.opcoes.filter((opcao) =>
    demais.every((slot) => slot.opcoes.includes(opcao)),
  );
}

export function validar(atividade: Atividade, escolhas: Escolhas): Veredito {
  const faltando = atividade.slots.filter((s) => !escolhas[s.id]);
  if (faltando.length > 0) {
    return { ok: false, motivo: `Falta escolher: ${faltando.map((s) => s.rotulo.toLowerCase()).join(", ")}.` };
  }

  const foraDoNivel = atividade.slots.find(
    (s) => escolhas[s.id] && !s.opcoes.includes(escolhas[s.id]),
  );
  if (foraDoNivel) {
    return {
      ok: false,
      motivo: `Uma peça escolhida não pertence ao nível “${foraDoNivel.rotulo}”.`,
    };
  }

  // O enunciado é que diz se a peça pode repetir e se todas devem ser usadas.
  // A validação barra a montagem, mas não explica a regra: descobrir por quê
  // faz parte da atividade.
  const foraDoEnunciado = "Essa montagem não segue o enunciado da atividade.";

  if (atividade.repeticao === "sem-repeticao") {
    const ids = atividade.slots.map((s) => escolhas[s.id]);
    if (new Set(ids).size !== ids.length) {
      return { ok: false, motivo: foraDoEnunciado };
    }
  }

  if (atividade.repeticao === "cada-uma-vez") {
    const ids = atividade.slots.map((s) => escolhas[s.id]);
    if (new Set(ids).size !== ids.length) {
      return { ok: false, motivo: foraDoEnunciado };
    }

    const comuns = pecasComuns(atividade);
    if (comuns.length === 0) return { ok: true };

    if (comuns.length > atividade.slots.length) {
      return {
        ok: false,
        motivo:
          `Esta atividade precisa de ${comuns.length} peças diferentes, ` +
          `mas a montagem tem só ${atividade.slots.length} posições.`,
      };
    }

    const faltando = comuns.filter((peca) => !ids.includes(peca));
    if (faltando.length > 0) {
      return { ok: false, motivo: foraDoEnunciado };
    }
  }

  return { ok: true };
}

/** Todos os caminhos válidos segundo a regra da atividade. */
export function caminhosValidos(atividade: Atividade): Escolhas[] {
  let acumulado: Escolhas[] = [{}];
  for (const slot of atividade.slots) {
    acumulado = acumulado.flatMap((parcial) =>
      slot.opcoes.map((opcao) => ({ ...parcial, [slot.id]: opcao })),
    );
  }
  return acumulado.filter((escolhas) => validar(atividade, escolhas).ok);
}

export function resultadosDistintos(atividade: Atividade): Map<string, Escolhas> {
  const mapa = new Map<string, Escolhas>();
  for (const caminho of caminhosValidos(atividade)) {
    const chave = chaveResultado(atividade, caminho);
    if (!mapa.has(chave)) mapa.set(chave, caminho);
  }
  return mapa;
}

/** Chave do caminho: a sequência de escolhas, sem ordenar nada. */
export function chaveCaminho(atividade: Atividade, escolhas: Escolhas): string {
  return atividade.slots.map((s) => escolhas[s.id] ?? "").join("|");
}

/** Faz o caminho inverso: da chave às escolhas por nível. */
export function escolhasDaChave(atividade: Atividade, chave: string): Escolhas {
  const ids = chave.split("|");
  const escolhas: Escolhas = {};
  atividade.slots.forEach((slot, i) => {
    escolhas[slot.id] = ids[i] ?? "";
  });
  return escolhas;
}

/** “Chocolate → Morango”: o caminho escrito com os nomes das peças. */
export function rotuloCaminho(atividade: Atividade, chave: string): string {
  return chave
    .split("|")
    .map((id) => pecaDaAtividade(atividade, id)?.nome ?? id)
    .join(" → ");
}

/**
 * Todos os caminhos que a árvore completa mostra, válidos ou não. Como no
 * Árbol original, é a criança (com o professor) quem decide quais valem.
 */
export function todosOsCaminhos(atividade: Atividade): Escolhas[] {
  let acumulado: Escolhas[] = [{}];
  for (const slot of atividade.slots) {
    acumulado = acumulado.flatMap((parcial) =>
      slot.opcoes.map((opcao) => ({ ...parcial, [slot.id]: opcao })),
    );
  }
  return acumulado;
}

export type ResumoDaAtividade = {
  /** Caminhos que a árvore completa desenha. */
  total: number;
  /** Caminhos que seguem a regra. */
  validos: number;
  /** Casos diferentes entre os válidos, segundo a equivalência da atividade. */
  distintos: number;
};

export function resumoDaAtividade(atividade: Atividade): ResumoDaAtividade {
  const todos = todosOsCaminhos(atividade);
  const validos = todos.filter((c) => validar(atividade, c).ok);
  const distintos = new Set(validos.map((c) => chaveResultado(atividade, c)));
  return { total: todos.length, validos: validos.length, distintos: distintos.size };
}

export type CelulaDeRegra = {
  repeticao: Repeticao;
  equivalencia: Equivalencia;
  validos: number;
  distintos: number;
  atual: boolean;
};

/** Cada combinação de regras sobre as mesmas peças e níveis: o que mudaria no resultado. */
export function comparacaoDeRegras(atividade: Atividade): CelulaDeRegra[] {
  const repeticoes: Repeticao[] = ["livre", "sem-repeticao", "cada-uma-vez"];
  const equivalencias: Equivalencia[] = ["ordenada", "sem-ordem"];
  return repeticoes.flatMap((repeticao) =>
    equivalencias.map((equivalencia) => {
      const { validos, distintos } = resumoDaAtividade({ ...atividade, repeticao, equivalencia });
      return {
        repeticao,
        equivalencia,
        validos,
        distintos,
        atual: repeticao === atividade.repeticao && equivalencia === atividade.equivalencia,
      };
    }),
  );
}
