import { useEffect, useRef, useState } from "react";

type Props = {
  titulo: string;
  aoConfirmar: (nome: string) => void;
  aoCancelar: () => void;
};

/** Antes de começar uma atividade: quem vai fazê-la. O nome pode ficar em branco. */
export function PedirNome({ titulo, aoConfirmar, aoCancelar }: Props) {
  const [nome, setNome] = useState("");
  const campo = useRef<HTMLInputElement>(null);
  const anterior = useRef<Element | null>(null);

  useEffect(() => {
    anterior.current = document.activeElement;
    campo.current?.focus();
    return () => {
      if (anterior.current instanceof HTMLElement) anterior.current.focus();
    };
  }, []);

  function aoTeclar(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      aoCancelar();
    }
  }

  return (
    <div className="pedir-nome-fundo" onKeyDown={aoTeclar} onMouseDown={(e) => e.target === e.currentTarget && aoCancelar()}>
      <form
        className="pedir-nome"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pedir-nome-titulo"
        onSubmit={(e) => {
          e.preventDefault();
          aoConfirmar(nome.trim());
        }}
      >
        <h2 id="pedir-nome-titulo">{titulo}</h2>
        <label htmlFor="pedir-nome-campo">Quem vai fazer esta atividade?</label>
        <input
          id="pedir-nome-campo"
          ref={campo}
          type="text"
          value={nome}
          maxLength={60}
          autoComplete="off"
          placeholder="Nome do aluno ou do grupo"
          onChange={(e) => setNome(e.target.value)}
        />
        <div className="pedir-nome-acoes">
          <button type="button" className="botao" onClick={aoCancelar}>
            Cancelar
          </button>
          <button type="button" className="botao" onClick={() => aoConfirmar("")}>
            Começar sem nome
          </button>
          <button type="submit" className="botao primario">
            Começar
          </button>
        </div>
      </form>
    </div>
  );
}
