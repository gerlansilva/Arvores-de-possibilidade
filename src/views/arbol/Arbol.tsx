import { useRef, useState } from "react";
import { EXEMPLOS, type ExemploDoArbol } from "../../data/exemplos-arbol";
import { apagarArvore, guardarArvore, marcarCaminhos, useBiblioteca, type ArvoreSalva } from "../../state/arvores";
import { ArbolCriar } from "./ArbolCriar";
import { ArbolVer } from "./ArbolVer";
import { ArbolBiblioteca, ArbolExemplos } from "./ArbolLista";
import { ArbolInstrucoes } from "./ArbolInstrucoes";

type Tela =
  | { v: "criar"; editarId?: string }
  | { v: "exemplos" }
  | { v: "biblioteca" }
  | { v: "instrucoes" }
  | { v: "ver-salva"; id: string }
  | { v: "ver-exemplo"; exemplo: ExemploDoArbol };

export type SecaoDoArbol = "criar" | "exemplos" | "biblioteca" | "instrucoes" | { ver: string };

type Props = {
  /** Seção em que abre; o menu lateral remonta a tela ao trocar de seção. */
  secao: SecaoDoArbol;
  aoPainel: () => void;
};

/** O Árbol: criar, ver exemplos, recuperar da biblioteca e instruções. */
export function Arbol({ secao, aoPainel }: Props) {
  const [tela, setTela] = useState<Tela>(() =>
    typeof secao === "object" ? { v: "ver-salva", id: secao.ver } : { v: secao },
  );
  const biblioteca = useBiblioteca();
  const marcasDoExemplo = useRef<string[]>([]);
  const inicio = aoPainel;

  if (tela.v === "criar") {
    const editando = tela.editarId ? biblioteca.find((a) => a.id === tela.editarId) : undefined;
    return (
      <ArbolCriar
        key={tela.editarId ?? "nova"}
        editando={editando}
        aoCancelar={() => (editando ? setTela({ v: "ver-salva", id: editando.id }) : inicio())}
        aoGuardar={(id) => setTela({ v: "ver-salva", id })}
      />
    );
  }

  if (tela.v === "ver-salva") {
    const arvore: ArvoreSalva | undefined = biblioteca.find((a) => a.id === tela.id);
    if (!arvore) {
      return (
        <ArbolBiblioteca arvores={biblioteca} aoAbrir={(a) => setTela({ v: "ver-salva", id: a.id })} aoVoltar={inicio} />
      );
    }
    return (
      <ArbolVer
        key={arvore.id + arvore.niveis.map((n) => n.elementos.join("|")).join("/")}
        def={arvore}
        marcadasIniciais={arvore.marcadas}
        aoMudarMarcas={(m) => marcarCaminhos(arvore.id, m)}
        aoInicio={inicio}
        aoModificar={() => setTela({ v: "criar", editarId: arvore.id })}
        aoApagar={() => {
          apagarArvore(arvore.id);
          setTela({ v: "biblioteca" });
        }}
      />
    );
  }

  if (tela.v === "ver-exemplo") {
    const ex = tela.exemplo;
    return (
      <ArbolVer
        key={ex.id}
        def={ex}
        professor={{ situacao: ex.tipo, regra: ex.regra, validas: ex.validas, perguntas: ex.perguntas }}
        enunciado={ex.enunciado}
        marcadasIniciais={[]}
        aoMudarMarcas={(m) => {
          marcasDoExemplo.current = m;
        }}
        aoInicio={() => setTela({ v: "exemplos" })}
        aoGuardarNaBiblioteca={() => {
          const id = guardarArvore({ nome: ex.nome, niveis: ex.niveis }, marcasDoExemplo.current);
          setTela({ v: "ver-salva", id });
        }}
      />
    );
  }

  if (tela.v === "exemplos") {
    return <ArbolExemplos exemplos={EXEMPLOS} aoAbrir={(exemplo) => {
          marcasDoExemplo.current = [];
          setTela({ v: "ver-exemplo", exemplo });
        }} aoVoltar={inicio} />;
  }

  if (tela.v === "biblioteca") {
    return (
      <ArbolBiblioteca arvores={biblioteca} aoAbrir={(a) => setTela({ v: "ver-salva", id: a.id })} aoVoltar={inicio} />
    );
  }

  if (tela.v === "instrucoes") return <ArbolInstrucoes aoVoltar={inicio} />;

  return <ArbolExemplos exemplos={EXEMPLOS} aoAbrir={(e) => setTela({ v: "ver-exemplo", exemplo: e })} aoVoltar={inicio} />;
}
