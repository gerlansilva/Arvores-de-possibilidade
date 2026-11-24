import { useEffect, useMemo, useRef, useState } from "react";
import { Icone } from "../../components/Icone";
import {
  MAX_CAMINHOS,
  diagramar,
  noEstaMarcado,
  rotulosDoCaminho,
  todasAsFolhas,
  totalDeCaminhos,
  type DefinicaoDoArbol,
} from "../../engine/arbol";

export type FichaDoProfessor = { situacao: string; regra: string; validas: number; perguntas: string[] };

type Props = {
  def: DefinicaoDoArbol;
  /** Só para exemplos: situação, regra e quantos caminhos valem. */
  professor?: FichaDoProfessor;
  enunciado?: string;
  marcadasIniciais: string[];
  /** Chamado a cada mudança da pintura; quem guarda é o pai. */
  aoMudarMarcas: (marcadas: string[]) => void;
  aoInicio: () => void;
  /** Figurinhas por rótulo de elemento (atividades). Com figura, os nós ficam maiores. */
  figuras?: Record<string, string>;
  /** Dentro de uma sessão: sem botões de navegação, de guardar nem de apagar. */
  incorporada?: boolean;
  /** Só para árvores da biblioteca. */
  aoModificar?: () => void;
  aoApagar?: () => void;
  /** Só para exemplos: copia para a biblioteca. */
  aoGuardarNaBiblioteca?: () => void;
};

const ZOOMS = [0.5, 0.65, 0.8, 1, 1.25, 1.5];

/**
 * Tela de possibilidades: a árvore completa, da esquerda para a direita, com
 * todos os caminhos, válidos ou não. Tocar num caminho pinta de vermelho a
 * linha inteira; tocar de novo tira a cor. O programa não diz se está certo.
 */
export function ArbolVer({
  def,
  professor,
  figuras,
  incorporada = false,
  enunciado,
  marcadasIniciais,
  aoMudarMarcas,
  aoModificar,
  aoApagar,
  aoGuardarNaBiblioteca,
}: Props) {
  const [marcadas, setMarcadas] = useState<Set<string>>(() => new Set(marcadasIniciais));
  const [zoom, setZoom] = useState(3);
  const [ajuda, setAjuda] = useState(false);
  const [visao, setVisao] = useState<"arvore" | "tabela">("arvore");
  const [ficha, setFicha] = useState(false);
  const [resposta, setResposta] = useState(false);
  const [apagando, setApagando] = useState(false);
  const [aviso, setAviso] = useState("");
  const primeiraVez = useRef(true);

  const total = totalDeCaminhos(def.niveis);
  const grande = total > MAX_CAMINHOS;
  const comFiguras = Boolean(figuras);
  const diagrama = useMemo(
    () => (grande ? undefined : diagramar(def.niveis, comFiguras ? { alturaNo: 46, larguraNo: 190 } : {})),
    [def.niveis, grande, comFiguras],
  );


  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    aoMudarMarcas([...marcadas]);
    // aoMudarMarcas muda a cada render do pai; só interessa reagir à pintura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marcadas]);

  function alternar(id: string) {
    setAviso("");
    setMarcadas((atuais) => {
      const novas = new Set(atuais);
      if (novas.has(id)) novas.delete(id);
      else novas.add(id);
      return novas;
    });
  }

  function limpar() {
    setMarcadas(new Set());
    setAviso("Pintura removida.");
  }

  function imprimir() {
    window.print();
  }

  const escala = ZOOMS[zoom];

  return (
    <main className="tela tela-arbol-ver" id="conteudo" tabIndex={-1}>
      <header className="arbol-barra nao-imprimir">
        {incorporada ? <h1 className="arbol-titulo-menor sr-only">Todas as possibilidades</h1> : <h1>{def.nome}</h1>}
        {incorporada && !grande && (
        <div className="arbol-visoes nao-imprimir" role="group" aria-label="Ver como">
          <button className="botao" aria-pressed={visao === "arvore"} onClick={() => setVisao("arvore")}>
            <Icone nome="arvore" />
            Árvore
          </button>
          <button className="botao" aria-pressed={visao === "tabela"} onClick={() => setVisao("tabela")}>
            <Icone nome="tabela" />
            Tabela
          </button>
        </div>
        )}
        <div className="arbol-barra-acoes" style={incorporada ? { marginLeft: "auto" } : undefined}>
          {!incorporada && aoModificar && (
            <button className="botao" onClick={aoModificar}>
              <Icone nome="editar" />
              Modificar a árvore
            </button>
          )}
          {!incorporada && aoApagar &&
            (apagando ? (
              <span role="group" aria-label="Confirmar exclusão">
                Apagar esta árvore?{" "}
                <button className="botao perigo" onClick={aoApagar}>
                  Sim, apagar
                </button>{" "}
                <button className="botao" autoFocus onClick={() => setApagando(false)}>
                  Manter
                </button>
              </span>
            ) : (
              <button className="botao perigo" onClick={() => setApagando(true)}>
                <Icone nome="lixeira" />
                Apagar
              </button>
            ))}
          {!incorporada && aoGuardarNaBiblioteca && (
            <button className="botao" onClick={aoGuardarNaBiblioteca}>
              <Icone nome="guardar" />
              Guardar na biblioteca
            </button>
          )}
          <button className="botao" aria-pressed={ajuda} onClick={() => setAjuda((a) => !a)}>
            <Icone nome="ajuda" />
            Ajuda
          </button>
          {professor && (
            <button className="botao" aria-pressed={ficha} onClick={() => setFicha((f) => !f)}>
              <Icone nome="professor" />
              Professor
            </button>
          )}
          <button className="botao" onClick={imprimir}>
            <Icone nome="imprimir" />
            Imprimir
          </button>
        </div>
      </header>

      {ajuda && (
        <p className="arbol-ajuda nao-imprimir" role="note">
          Cada linha da árvore é uma possibilidade: do primeiro nível até o último. Na árvore, toque
          no último elemento de uma linha; na Tabela, use o botão Pintar. A linha fica vermelha
          (as que valem). Toque de novo para tirar a cor. A árvore mostra todas as combinações, inclusive as que não valem: decidir quais valem é
          com você.
        </p>
      )}

      {professor && ficha && (
        <section className="arbol-ficha nao-imprimir" aria-label="Ficha do professor">
          <h2>Para o professor</h2>
          <p>
            <strong>Situação:</strong> {professor.situacao}. <strong>Caminhos na árvore:</strong> {total}.
          </p>
          <p>
            <strong>Perguntas para mediar:</strong> {professor.perguntas.join(" ")}
          </p>
          {resposta ? (
            <p>
              <strong>Valem {professor.validas}.</strong> {professor.regra} Pintadas agora: {marcadas.size}.
            </p>
          ) : (
            <button className="botao" onClick={() => setResposta(true)}>
              Mostrar quantas valem
            </button>
          )}
        </section>
      )}

      {enunciado && <p className="arbol-enunciado">{enunciado}</p>}

      {!grande && !incorporada && (
        <div className="arbol-visoes nao-imprimir" role="group" aria-label="Ver como">
          <button className="botao" aria-pressed={visao === "arvore"} onClick={() => setVisao("arvore")}>
            <Icone nome="arvore" />
            Árvore
          </button>
          <button className="botao" aria-pressed={visao === "tabela"} onClick={() => setVisao("tabela")}>
            <Icone nome="tabela" />
            Tabela
          </button>
        </div>
      )}

      <div className="arbol-palco">
        <div className="arbol-ferramentas nao-imprimir" role="group" aria-label="Ferramentas">
          {visao === "arvore" && (<>
          <button
            className="botao"
            onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))}
            disabled={zoom === ZOOMS.length - 1}
            aria-label="Aumentar a árvore"
            title="Aumentar"
          >
            <Icone nome="mais" />
          </button>
          <button
            className="botao"
            onClick={() => setZoom((z) => Math.max(0, z - 1))}
            disabled={zoom === 0}
            aria-label="Diminuir a árvore"
            title="Diminuir"
          >
            <Icone nome="menos" />
          </button>
          </>)}
          <button className="botao" onClick={limpar} disabled={marcadas.size === 0} title="Tirar toda a cor">
            <Icone nome="limpar" />
            Limpar
          </button>
        </div>

        <div className="arbol-area" tabIndex={0} aria-label="Árvore de possibilidades. Role para ver todas as linhas.">
          {grande || !diagrama ? (
            <p className="arbol-excesso">
              {incorporada
                ? `Esta atividade tem ${total} possibilidades, mais do que cabe na tela. Use as abas Montar e Coleção para registrar as possibilidades.`
                : `Esta árvore tem ${total} possibilidades, mais do que cabe na tela. Modifique a árvore para ter menos níveis ou menos elementos.`}
            </p>
          ) : visao === "tabela" ? (
            <table className="arbol-tabela">
              <caption className="sr-only">Todas as possibilidades. Toque numa linha para pintá-la de vermelho.</caption>
              <thead>
                <tr>
                  <th scope="col">Nº</th>
                  {def.niveis.map((n, i) => (
                    <th key={i} scope="col">{n.nome}</th>
                  ))}
                  <th scope="col">Vale?</th>
                </tr>
              </thead>
              <tbody>
                {todasAsFolhas(def.niveis).map((id, i) => {
                  const vermelho = marcadas.has(id);
                  return (
                    <tr key={id} data-vermelho={vermelho ? "sim" : undefined}>
                      <td>{i + 1}</td>
                      {rotulosDoCaminho(def.niveis, id).map((r, j) => (
                        <td key={j}>
                          {figuras?.[r] && <img className="arbol-figura-mini" src={figuras[r]} alt="" />}
                          {r}
                        </td>
                      ))}
                      <td>
                        <button
                          className="botao"
                          aria-pressed={vermelho}
                          aria-label={`${vermelho ? "Tirar a cor de" : "Pintar"} ${rotulosDoCaminho(def.niveis, id).join(", ")}`}
                          onClick={() => alternar(id)}
                        >
                          {vermelho ? "Pintada" : "Pintar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="arbol-escala" style={{ zoom: escala }}>
              <div
                className="arbol-folha"
                style={{ width: diagrama.largura, height: diagrama.altura }}
              >
                {diagrama.colunas.map((c) => (
                  <div
                    key={`faixa-${c.nivel}`}
                    className="arbol-faixa"
                    data-par={c.nivel % 2}
                    style={{ left: c.x - 12, width: diagrama.larguraNo + 24 }}
                  >
                    <span className="arbol-faixa-nome">{c.nome}</span>
                  </div>
                ))}

                <svg className="arbol-linhas" width={diagrama.largura} height={diagrama.altura} aria-hidden="true">
                  {diagrama.arestas.map(({ de, para }) => {
                    const a = diagrama.nos.find((n) => n.id === de)!;
                    const b = diagrama.nos.find((n) => n.id === para)!;
                    const vermelha = noEstaMarcado(para, marcadas);
                    return (
                      <line
                        key={`${de}->${para}`}
                        x1={a.x + diagrama.larguraNo}
                        y1={a.y + diagrama.alturaNo / 2}
                        x2={b.x}
                        y2={b.y + diagrama.alturaNo / 2}
                        className={vermelha ? "vermelha" : undefined}
                      />
                    );
                  })}
                </svg>

                {diagrama.nos.map((no) => {
                  const vermelho = noEstaMarcado(no.id, marcadas);
                  const estilo = { left: no.x, top: no.y, width: diagrama.larguraNo, height: diagrama.alturaNo };
                  const figura = figuras?.[no.rotulo];
                  const conteudo = (
                    <>
                      {figura && <img className="arbol-figura" src={figura} alt="" />}
                      <span>{no.rotulo}</span>
                    </>
                  );
                  if (!no.folha) {
                    return (
                      <div key={no.id} className="arbol-no" data-vermelho={vermelho ? "sim" : undefined} style={estilo}>
                        {conteudo}
                      </div>
                    );
                  }
                  const caminho = rotulosDoCaminho(def.niveis, no.id).join(", ");
                  return (
                    <button
                      key={no.id}
                      className="arbol-no arbol-folha-no"
                      data-vermelho={vermelho ? "sim" : undefined}
                      style={estilo}
                      aria-pressed={marcadas.has(no.id)}
                      aria-label={`Possibilidade: ${caminho}`}
                      onClick={() => alternar(no.id)}
                    >
                      {conteudo}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="arbol-status nao-imprimir" role="status">
        {grande
          ? ""
          : `${total} ${total === 1 ? "possibilidade" : "possibilidades"} · ${marcadas.size} ${
              marcadas.size === 1 ? "pintada de vermelho" : "pintadas de vermelho"
            }`}
        {aviso && ` · ${aviso}`}
      </p>
    </main>
  );
}
