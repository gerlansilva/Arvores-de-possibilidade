import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

export type OrigemArrasto = "paleta" | "slot";

export type Arrasto = {
  pecaId: string;
  origem: OrigemArrasto;
  slotOrigem?: string;
  x: number;
  y: number;
};

type Opcoes = {
  aoSoltar: (
    pecaId: string,
    slotId: string,
    origem: OrigemArrasto,
    slotOrigem?: string,
  ) => void;
  /** Chamado quando o ponteiro sobe sem ter virado arrasto. */
  aoClicar: (pecaId: string, origem: OrigemArrasto, slotOrigem?: string) => void;
  aoCancelar?: () => void;
  limiar?: number;
};

type Inicio = {
  pecaId: string;
  origem: OrigemArrasto;
  slotOrigem?: string;
  pointerId: number;
  x0: number;
  y0: number;
  elemento: HTMLElement;
};

function slotEm(x: number, y: number): string | null {
  const elemento = document.elementFromPoint(x, y);
  const alvo = elemento?.closest<HTMLElement>("[data-slot]");
  return alvo?.dataset.slot ?? null;
}

/**
 * Arrasto de peças com ponteiro. Um clique curto continua sendo clique; o
 * arrasto só começa depois de alguns pixels, para não atrapalhar quem só quer
 * selecionar a peça. O ponteiro é capturado no início, para que soltar fora do
 * alvo (ou da janela) não deixe o fantasma preso na tela.
 */
export function useArrastarPeca(opcoes: Opcoes) {
  const [arrasto, setArrasto] = useState<Arrasto | null>(null);
  const [slotSobre, setSlotSobre] = useState<string | null>(null);
  const inicio = useRef<Inicio | null>(null);
  const atual = useRef<Arrasto | null>(null);
  const sobre = useRef<string | null>(null);
  const opcoesRef = useRef(opcoes);
  opcoesRef.current = opcoes;

  const encerrar = useCallback(() => {
    const ini = inicio.current;
    if (ini?.elemento.hasPointerCapture?.(ini.pointerId)) {
      ini.elemento.releasePointerCapture?.(ini.pointerId);
    }
    inicio.current = null;
    atual.current = null;
    sobre.current = null;
    setArrasto(null);
    setSlotSobre(null);
    document.body.classList.remove("arrastando-peca");
  }, []);

  useEffect(() => {
    function mover(evento: globalThis.PointerEvent) {
      const ini = inicio.current;
      if (!ini || evento.pointerId !== ini.pointerId) return;

      if (!atual.current) {
        const distancia = Math.hypot(evento.clientX - ini.x0, evento.clientY - ini.y0);
        if (distancia < (opcoesRef.current.limiar ?? 5)) return;
      }

      const proximo: Arrasto = {
        pecaId: ini.pecaId,
        origem: ini.origem,
        slotOrigem: ini.slotOrigem,
        x: evento.clientX,
        y: evento.clientY,
      };
      atual.current = proximo;
      setArrasto(proximo);
      document.body.classList.add("arrastando-peca");

      const alvo = slotEm(evento.clientX, evento.clientY);
      sobre.current = alvo;
      setSlotSobre(alvo);
      evento.preventDefault();
    }

    function soltar(evento: globalThis.PointerEvent) {
      const ini = inicio.current;
      if (!ini || evento.pointerId !== ini.pointerId) return;
      if (atual.current) {
        const alvo = sobre.current;
        if (alvo) {
          opcoesRef.current.aoSoltar(ini.pecaId, alvo, ini.origem, ini.slotOrigem);
        } else {
          opcoesRef.current.aoCancelar?.();
        }
      } else {
        opcoesRef.current.aoClicar(ini.pecaId, ini.origem, ini.slotOrigem);
      }
      encerrar();
    }

    function cancelar() {
      if (inicio.current) opcoesRef.current.aoCancelar?.();
      encerrar();
    }

    function tecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") cancelar();
    }

    function perdeuFoco() {
      if (inicio.current) cancelar();
    }

    window.addEventListener("pointermove", mover, { passive: false });
    window.addEventListener("pointerup", soltar);
    window.addEventListener("pointercancel", cancelar);
    window.addEventListener("keydown", tecla);
    window.addEventListener("blur", perdeuFoco);
    document.addEventListener("visibilitychange", perdeuFoco);
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", cancelar);
      window.removeEventListener("keydown", tecla);
      window.removeEventListener("blur", perdeuFoco);
      document.removeEventListener("visibilitychange", perdeuFoco);
    };
  }, [encerrar]);

  const pegar = useCallback(
    (
      evento: PointerEvent<HTMLElement>,
      pecaId: string,
      origem: OrigemArrasto,
      slotOrigem?: string,
    ) => {
      if (evento.button !== 0) return;
      const elemento = evento.currentTarget;
      try {
        elemento.setPointerCapture(evento.pointerId);
      } catch {
        // Ponteiro sintético ou navegador sem captura: o arrasto segue pelos
        // listeners da janela.
      }
      inicio.current = {
        pecaId,
        origem,
        slotOrigem,
        pointerId: evento.pointerId,
        x0: evento.clientX,
        y0: evento.clientY,
        elemento,
      };
    },
    [],
  );

  return { arrasto, slotSobre, pegar, encerrar };
}
