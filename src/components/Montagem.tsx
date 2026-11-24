import type { ReactNode } from "react";
import {
  pecaDaAtividade,
  suporteDaAtividade,
  urlAtividade,
  type Atividade,
  type Peca,
  type Slot,
} from "../data/activities";
import type { Escolhas } from "../engine/comb";

type Props = {
  atividade: Atividade;
  escolhas: Escolhas;
  tamanho?: "g" | "m" | "c" | "p";
  /** Na mesa, cada posição aceita clique e arrasto. */
  interativo?: boolean;
  pecaArrastada?: string | null;
  slotSobre?: string | null;
  aoClicarSlot?: (slotId: string) => void;
  aoPegarSlot?: (slotId: string, evento: React.PointerEvent<HTMLElement>) => void;
};

type SlotProps = {
  atividade: Atividade;
  slot: Slot;
  escolhaId?: string;
  nivel: number;
  classe?: string;
  espelhada?: boolean;
  interativo?: boolean;
  pecaArrastada?: string | null;
  slotSobre?: string | null;
  aoClicarSlot?: (slotId: string) => void;
  aoPegarSlot?: (slotId: string, evento: React.PointerEvent<HTMLElement>) => void;
};

function atributosSlot(
  slot: Slot,
  interativo: boolean | undefined,
  pecaArrastada: string | null | undefined,
  slotSobre: string | null | undefined,
) {
  if (!interativo) return {};
  return {
    "data-slot": slot.id,
    "data-arrastando": pecaArrastada ? "sim" : undefined,
    "data-sobre": slotSobre === slot.id ? "sim" : undefined,
    "data-compativel": pecaArrastada
      ? slot.opcoes.includes(pecaArrastada)
        ? "sim"
        : "nao"
      : undefined,
  };
}

function ImagemPeca({
  atividade,
  slot,
  escolhaId,
  nivel,
  classe = "",
  espelhada,
  interativo,
  pecaArrastada,
  slotSobre,
  aoClicarSlot,
  aoPegarSlot,
}: SlotProps) {
  const peca: Peca | undefined = pecaDaAtividade(atividade, escolhaId);
  const extras = atributosSlot(slot, interativo, pecaArrastada, slotSobre);

  if (!peca) {
    if (interativo) {
      return (
        <button
          type="button"
          className={`vazia ${classe}`}
          data-nivel={nivel}
          data-preenchido="nao"
          aria-label={`${nivel + 1}. ${slot.rotulo}: vazio. Selecione uma peça e toque aqui.`}
          onClick={() => aoClicarSlot?.(slot.id)}
          {...extras}
        >
          <span aria-hidden="true">{nivel + 1}</span>
        </button>
      );
    }
    return (
      <span
        className={`vazia ${classe}`}
        data-nivel={nivel}
        role="img"
        aria-label={`${slot.rotulo}: vazio`}
      >
        <span aria-hidden="true">{nivel + 1}</span>
      </span>
    );
  }

  if (interativo) {
    return (
      <img
        className={`${classe}`}
        src={urlAtividade(peca.arquivo)}
        alt={peca.nome}
        title={`${peca.nome} · arraste para trocar de nível`}
        data-nivel={nivel}
        data-preenchido="sim"
        role="button"
        tabIndex={0}
        aria-label={`${slot.rotulo}: ${peca.nome}. Toque para selecionar e mover.`}
        draggable={false}
        style={espelhada ? { transform: "scaleY(-1)" } : undefined}
        onPointerDown={(evento) => aoPegarSlot?.(slot.id, evento)}
        onClick={(evento) => {
          if (evento.detail === 0) aoClicarSlot?.(slot.id);
        }}
        onKeyDown={(evento) => {
          if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            aoClicarSlot?.(slot.id);
          }
        }}
        {...extras}
      />
    );
  }

  return (
    <img
      className={classe}
      src={urlAtividade(peca.arquivo)}
      alt={peca.nome}
      title={peca.nome}
      data-nivel={nivel}
      style={espelhada ? { transform: "scaleY(-1)" } : undefined}
      draggable={false}
    />
  );
}

function Suporte({ atividade, classe = "" }: { atividade: Atividade; classe?: string }) {
  const peca = suporteDaAtividade(atividade);
  if (!peca) return null;
  return (
    <img
      className={`suporte ${classe}`}
      src={urlAtividade(peca.arquivo)}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

/**
 * Cada composição é uma arrumação das mesmas peças. A ordem dos níveis vem da
 * atividade; a única exceção é o cordão, que gira as contas de furo no topo para
 * alinhar o fio.
 */
export function Montagem({
  atividade,
  escolhas,
  tamanho = "g",
  interativo = false,
  pecaArrastada = null,
  slotSobre = null,
  aoClicarSlot,
  aoPegarSlot,
}: Props) {
  const peca = (
    i: number,
    classe = "peca-img",
    espelhada = false,
    interativoSlot = true,
  ) => {
    const slot = atividade.slots[i];
    if (!slot) return null;
    return (
      <ImagemPeca
        atividade={atividade}
        slot={slot}
        escolhaId={escolhas[slot.id]}
        nivel={i}
        classe={classe}
        espelhada={espelhada}
        interativo={interativo && interativoSlot}
        pecaArrastada={pecaArrastada}
        slotSobre={slotSobre}
        aoClicarSlot={aoClicarSlot}
        aoPegarSlot={aoPegarSlot}
      />
    );
  };

  let conteudo: ReactNode;

  switch (atividade.composicao) {
    case "casquinha":
      conteudo = (
        <div className="comp-casquinha">
          <div className="casquinha-bolas">
            {peca(1)}
            {peca(0)}
          </div>
          <Suporte atividade={atividade} classe="casquinha-suporte" />
        </div>
      );
      break;

    case "mistura":
      conteudo = (
        <div className="comp-mistura">
          <div className="mistura-porcoes">
            {peca(0)}
            {peca(1)}
          </div>
          <Suporte atividade={atividade} classe="mistura-taca" />
        </div>
      );
      break;

    case "sanduiche":
      conteudo = (
        <div className="comp-sanduiche">
          {escolhas[atividade.slots[0]?.id]
            ? peca(0, "pao pao-topo", true, false)
            : null}
          <div className="sanduiche-recheio">{peca(1)}</div>
          {peca(0, "pao pao-base")}
        </div>
      );
      break;

    case "roupa":
      conteudo = (
        <div className="comp-roupa">
          {peca(0)}
          {peca(1)}
        </div>
      );
      break;

    case "copo":
      conteudo = (
        <div className="comp-copo">
          {peca(0)}
          {peca(1)}
        </div>
      );
      break;

    case "lancheira":
      conteudo = (
        <div className="comp-lancheira">
          <span className="lancheira-bandeja" aria-hidden="true" />
          {peca(0)}
          {peca(1)}
        </div>
      );
      break;

    case "dupla":
      conteudo = (
        <div className="comp-dupla">
          {peca(0)}
          {peca(1)}
        </div>
      );
      break;

    case "canetas":
      conteudo = (
        <div className="comp-canetas">
          {peca(0)}
          {peca(1)}
        </div>
      );
      break;

    case "salada":
      conteudo = (
        <div className="comp-salada">
          <div className="salada-frutas">
            {peca(0)}
            {peca(1)}
            {peca(2)}
          </div>
          <span className="salada-tigela" aria-hidden="true" />
        </div>
      );
      break;

    case "cordao":
      conteudo = (
        <div className="comp-cordao">
          <Suporte atividade={atividade} classe="cordao-suporte" />
          <div className="cordao-contas">
            {[0, 1, 2].map((i) => {
              const id = escolhas[atividade.slots[i]?.id];
              const gira = id === "conta-redonda" || id === "conta-quadrada";
              return peca(i, gira ? "peca-img conta-girada" : "peca-img");
            })}
          </div>
        </div>
      );
      break;

    default:
      conteudo = (
        <div className="comp-fila">
          {atividade.slots.map((_, i) => peca(i))}
        </div>
      );
  }

  return (
    <div
      className="montagem"
      data-composicao={atividade.composicao}
      data-tamanho={tamanho}
      data-arrastando={interativo && pecaArrastada ? "sim" : undefined}
    >
      {conteudo}
    </div>
  );
}
