import { Icone } from "../../components/Icone";
import { useMemo, useRef, useState } from "react";
import {
  MAX_CAMINHOS,
  MAX_ELEMENTOS,
  MAX_NIVEIS,
  definicaoCompleta,
  todasAsFolhas,
  totalDeCaminhos,
  type NivelDoArbol,
} from "../../engine/arbol";
import { atualizarArvore, guardarArvore, type ArvoreSalva } from "../../state/arvores";

type Props = {
  /** Quando existe, a tela edita esta árvore em vez de criar uma. */
  editando?: ArvoreSalva;
  aoCancelar: () => void;
  aoGuardar: (id: string) => void;
};

function mover<T>(lista: T[], de: number, para: number): T[] {
  if (para < 0 || para >= lista.length) return lista;
  const copia = [...lista];
  const [item] = copia.splice(de, 1);
  copia.splice(para, 0, item);
  return copia;
}

/**
 * Tela "Estou criando uma árvore": à esquerda os níveis, à direita os elementos
 * do nível escolhido. Cada lista tem adicionar, eliminar, subir e descer.
 */
export function ArbolCriar({ editando, aoCancelar, aoGuardar }: Props) {
  const [nome, setNome] = useState(editando?.nome ?? "");
  const [niveis, setNiveis] = useState<NivelDoArbol[]>(
    editando?.niveis.map((n) => ({ nome: n.nome, elementos: [...n.elementos] })) ?? [
      { nome: "Nível 1", elementos: [] },
      { nome: "Nível 2", elementos: [] },
    ],
  );
  const [nivel, setNivel] = useState(0);
  const [elemento, setElemento] = useState<number | null>(null);
  const refsElementos = useRef<(HTMLInputElement | null)[]>([]);
  const refsNiveis = useRef<(HTMLInputElement | null)[]>([]);

  const ativo = niveis[nivel];
  const total = totalDeCaminhos(niveis);
  const grande = total > MAX_CAMINHOS;
  const completo = definicaoCompleta({ nome, niveis });

  const faltas = useMemo(() => {
    const itens: string[] = [];
    if (!nome.trim()) itens.push("o nome da árvore");
    niveis.forEach((n, i) => {
      if (!n.nome.trim()) itens.push(`o nome do nível ${i + 1}`);
      if (n.elementos.length === 0) itens.push(`pelo menos um elemento em “${n.nome || `nível ${i + 1}`}”`);
      else if (n.elementos.some((e) => !e.trim())) itens.push(`texto em todos os elementos de “${n.nome || `nível ${i + 1}`}”`);
    });
    return itens;
  }, [nome, niveis]);

  function mudarNivel(i: number, mudanca: Partial<NivelDoArbol>) {
    setNiveis((atuais) => atuais.map((n, k) => (k === i ? { ...n, ...mudanca } : n)));
  }

  function adicionarNivel() {
    if (niveis.length >= MAX_NIVEIS) return;
    setNiveis([...niveis, { nome: `Nível ${niveis.length + 1}`, elementos: [] }]);
    setNivel(niveis.length);
    setElemento(null);
    setTimeout(() => refsNiveis.current[niveis.length]?.select(), 0);
  }

  function eliminarNivel() {
    if (niveis.length <= 1) return;
    setNiveis(niveis.filter((_, i) => i !== nivel));
    setNivel(Math.max(0, nivel - 1));
    setElemento(null);
  }

  function moverNivel(delta: number) {
    const destino = nivel + delta;
    if (destino < 0 || destino >= niveis.length) return;
    setNiveis(mover(niveis, nivel, destino));
    setNivel(destino);
  }

  function adicionarElemento() {
    if (ativo.elementos.length >= MAX_ELEMENTOS) return;
    const indice = ativo.elementos.length;
    mudarNivel(nivel, { elementos: [...ativo.elementos, ""] });
    setElemento(indice);
    setTimeout(() => refsElementos.current[indice]?.focus(), 0);
  }

  function eliminarElemento() {
    if (elemento === null) return;
    mudarNivel(nivel, { elementos: ativo.elementos.filter((_, i) => i !== elemento) });
    setElemento(null);
  }

  function moverElemento(delta: number) {
    if (elemento === null) return;
    const destino = elemento + delta;
    if (destino < 0 || destino >= ativo.elementos.length) return;
    mudarNivel(nivel, { elementos: mover(ativo.elementos, elemento, destino) });
    setElemento(destino);
  }

  function guardar() {
    if (!completo || grande) return;
    const def = {
      nome: nome.trim(),
      niveis: niveis.map((n) => ({ nome: n.nome.trim(), elementos: n.elementos.map((e) => e.trim()) })),
    };
    if (editando) {
      atualizarArvore(editando.id, def, new Set(todasAsFolhas(def.niveis)));
      aoGuardar(editando.id);
    } else {
      aoGuardar(guardarArvore(def));
    }
  }

  return (
    <main className="tela tela-arbol-criar" id="conteudo" tabIndex={-1}>
      <section className="arbol-criar" aria-labelledby="titulo-criar">
        <h1 id="titulo-criar">{editando ? "Estou modificando a árvore" : "Estou criando uma árvore"}</h1>
        <p className="arbol-criar-ajuda">
          Escreva os níveis e seus elementos. Depois, dê um nome à árvore.
        </p>

        <div className="arbol-listas">
          <div className="arbol-lista">
            <h2>Níveis</h2>
            <ul aria-label="Níveis">
              {niveis.map((n, i) => (
                <li key={i} data-ativo={i === nivel ? "sim" : undefined}>
                  <input
                    ref={(el) => {
                      refsNiveis.current[i] = el;
                    }}
                    className="campo"
                    value={n.nome}
                    maxLength={40}
                    aria-label={`Nome do nível ${i + 1}`}
                    onFocus={() => {
                      setNivel(i);
                      setElemento(null);
                    }}
                    onChange={(e) => mudarNivel(i, { nome: e.target.value })}
                  />
                </li>
              ))}
            </ul>
            <div className="arbol-botoes-lista" role="group" aria-label="Ações nos níveis">
              <button className="botao" onClick={adicionarNivel} disabled={niveis.length >= MAX_NIVEIS}>
                Adicionar
              </button>
              <button className="botao perigo" onClick={eliminarNivel} disabled={niveis.length <= 1}>
                <Icone nome="lixeira" />Eliminar
              </button>
              <button className="botao" onClick={() => moverNivel(-1)} disabled={nivel === 0}>
                Subir
              </button>
              <button className="botao" onClick={() => moverNivel(1)} disabled={nivel === niveis.length - 1}>
                Descer
              </button>
            </div>
          </div>

          <div className="arbol-chave" aria-hidden="true">
            {"{"}
          </div>

          <div className="arbol-lista">
            <h2>Elementos de “{ativo.nome || `nível ${nivel + 1}`}”</h2>
            <ul aria-label={`Elementos de ${ativo.nome || `nível ${nivel + 1}`}`}>
              {ativo.elementos.length === 0 && (
                <li className="arbol-vazio">Nenhum elemento ainda. Use “Adicionar”.</li>
              )}
              {ativo.elementos.map((e, i) => (
                <li key={i} data-ativo={i === elemento ? "sim" : undefined}>
                  <input
                    ref={(el) => {
                      refsElementos.current[i] = el;
                    }}
                    className="campo"
                    value={e}
                    maxLength={30}
                    aria-label={`Elemento ${i + 1}`}
                    onFocus={() => setElemento(i)}
                    onChange={(ev) =>
                      mudarNivel(nivel, {
                        elementos: ativo.elementos.map((x, k) => (k === i ? ev.target.value : x)),
                      })
                    }
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter") {
                        ev.preventDefault();
                        adicionarElemento();
                      }
                    }}
                  />
                </li>
              ))}
            </ul>
            <div className="arbol-botoes-lista" role="group" aria-label="Ações nos elementos">
              <button className="botao" onClick={adicionarElemento} disabled={ativo.elementos.length >= MAX_ELEMENTOS}>
                Adicionar
              </button>
              <button className="botao perigo" onClick={eliminarElemento} disabled={elemento === null}>
                <Icone nome="lixeira" />Eliminar
              </button>
              <button className="botao" onClick={() => moverElemento(-1)} disabled={elemento === null || elemento === 0}>
                Subir
              </button>
              <button
                className="botao"
                onClick={() => moverElemento(1)}
                disabled={elemento === null || elemento === ativo.elementos.length - 1}
              >
                Descer
              </button>
            </div>
          </div>
        </div>

        <label className="arbol-nome">
          <span className="rotulo-campo">Nome da árvore</span>
          <input className="campo" value={nome} maxLength={60} onChange={(e) => setNome(e.target.value)} />
        </label>

        <p className="arbol-resumo" role="status">
          {total === 0
            ? "A árvore ainda não tem possibilidades."
            : `Esta árvore terá ${total} ${total === 1 ? "possibilidade" : "possibilidades"}.`}
          {grande && ` É mais do que cabe na tela (${MAX_CAMINHOS}). Use menos níveis ou menos elementos.`}
        </p>
        {!completo && faltas.length > 0 && <p className="arbol-faltas">Falta: {faltas.join("; ")}.</p>}

        <div className="arbol-criar-acoes">
          <button className="botao" onClick={aoCancelar}>
            <Icone nome="limpar" />Cancelar
          </button>
          <button className="botao primario" onClick={guardar} aria-disabled={!completo || grande}>
            <Icone nome="arvore" />Guardar e ver
          </button>
        </div>
      </section>
    </main>
  );
}
