import { useMemo, useRef } from "react";
import { pecaDaAtividade, urlAtividade } from "../data/activities";
import type { DefinicaoDoArbol } from "../engine/arbol";
import { caminhosValidos, chaveCaminho, resultadosDistintos } from "../engine/comb";
import { marcarCaminho, type Sessao } from "../state/store";
import { ArbolVer } from "./arbol/ArbolVer";

type Props = { sessao: Sessao };

/**
 * Aba "Árvore" da sessão: o Árbol aplicado à atividade. Mostra todas as
 * combinações, com as figurinhas, e a criança pinta de vermelho as que valem.
 * As marcas ficam na sessão (e aparecem no Registro).
 */
export function ArvoreCompleta({ sessao }: Props) {
  const atividade = sessao.atividade;

  const { def, figuras, idParaChave, chaveParaId } = useMemo(() => {
    const nomeDe = (id: string) => pecaDaAtividade(atividade, id)?.nome ?? id;
    const def: DefinicaoDoArbol = {
      nome: atividade.titulo,
      niveis: atividade.slots.map((slot) => ({
        nome: slot.rotulo,
        elementos: slot.opcoes.map(nomeDe),
      })),
    };
    const figuras: Record<string, string> = {};
    for (const slot of atividade.slots) {
      for (const id of slot.opcoes) {
        const peca = pecaDaAtividade(atividade, id);
        if (peca) figuras[peca.nome] = urlAtividade(peca.arquivo);
      }
    }
    const idParaChave = (idFolha: string) => {
      const escolhas: Record<string, string> = {};
      idFolha.split(".").forEach((indice, nivel) => {
        const slot = atividade.slots[nivel];
        escolhas[slot.id] = slot.opcoes[Number(indice)];
      });
      return chaveCaminho(atividade, escolhas);
    };
    const chaveParaId = (chave: string) =>
      chave
        .split("|")
        .map((id, nivel) => atividade.slots[nivel]?.opcoes.indexOf(id))
        .join(".");
    return { def, figuras, idParaChave, chaveParaId };
  }, [atividade]);

  const ficha = useMemo(() => {
    const validos = caminhosValidos(atividade).length;
    const distintos = resultadosDistintos(atividade).size;
    const ordem = atividade.equivalencia === "ordenada" ? "A ordem faz diferença." : "A ordem não faz diferença.";
    const repete =
      atividade.repeticao === "livre"
        ? "Uma peça pode se repetir."
        : atividade.repeticao === "cada-uma-vez"
          ? "Cada peça é usada uma vez."
          : "Nenhuma peça se repete.";
    return {
      situacao: "Atividade da sessão",
      validas: validos,
      regra: `${ordem} ${repete} Pela regra, ${validos} caminhos seguem o enunciado, o que dá ${distintos} possibilidades diferentes.`,
      perguntas: atividade.perguntas.length > 0 ? atividade.perguntas : ["Como você organizou as escolhas?"],
    };
  }, [atividade]);

  const iniciais = useMemo(
    () =>
      Object.entries(sessao.marcas)
        .filter(([, marca]) => marca === "vale")
        .map(([chave]) => chaveParaId(chave))
        .filter((id) => !id.includes("-1")),
    // Só o estado da primeira abertura interessa; depois a tela é a dona da pintura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessao.id],
  );
  const atuais = useRef(new Set(iniciais));

  function aoMudar(novas: string[]) {
    const conjunto = new Set(novas);
    for (const id of conjunto) if (!atuais.current.has(id)) marcarCaminho(sessao.id, idParaChave(id), "vale");
    for (const id of atuais.current) if (!conjunto.has(id)) marcarCaminho(sessao.id, idParaChave(id), null);
    atuais.current = conjunto;
  }

  return (
    <ArbolVer
      key={sessao.id}
      def={def}
      figuras={figuras}
      incorporada
      professor={ficha}
      enunciado={atividade.enunciado}
      marcadasIniciais={iniciais}
      aoMudarMarcas={aoMudar}
      aoInicio={() => undefined}
    />
  );
}
