import { useMemo } from "react";
import type { Atividade } from "../data/activities";
import { comparacaoDeRegras } from "../engine/comb";
import { plural } from "../lib/texto";

const LINHAS = [
  { valor: "livre", texto: "Pode repetir peça" },
  { valor: "sem-repeticao", texto: "Sem repetir peça" },
  { valor: "cada-uma-vez", texto: "Usa cada peça uma vez" },
] as const;

const COLUNAS = [
  { valor: "ordenada", texto: "A ordem conta" },
  { valor: "sem-ordem", texto: "A ordem não conta" },
] as const;

/**
 * Para o professor: as mesmas peças e níveis sob cada regra. Mostra quantos casos
 * diferentes a atividade teria, para discutir "e se a regra mudasse?".
 */
export function ComparaRegras({ atividade }: { atividade: Atividade }) {
  const celulas = useMemo(() => comparacaoDeRegras(atividade), [atividade]);
  const achar = (r: string, e: string) => celulas.find((c) => c.repeticao === r && c.equivalencia === e);

  return (
    <section className="compara-regras" aria-label="E se a regra mudasse?">
      <h3>E se a regra mudasse?</h3>
      <p className="campo-nota">
        Mesmas peças e mesmos níveis. Cada célula mostra os casos diferentes que a regra aceita.
      </p>
      <table>
        <thead>
          <tr>
            <td />
            {COLUNAS.map((c) => (
              <th key={c.valor} scope="col">
                {c.texto}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LINHAS.map((l) => (
            <tr key={l.valor}>
              <th scope="row">{l.texto}</th>
              {COLUNAS.map((c) => {
                const cel = achar(l.valor, c.valor);
                return (
                  <td key={c.valor} aria-current={cel?.atual ? "true" : undefined} data-vazio={cel?.distintos === 0}>
                    <strong>{cel?.distintos ?? 0}</strong>
                    <span>{cel?.atual ? "regra atual" : cel?.validos ? plural(cel.validos, "caminho vale", "caminhos valem") : "nenhum caminho vale"}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
