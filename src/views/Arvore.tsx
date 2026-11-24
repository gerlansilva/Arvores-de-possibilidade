import { useEffect, useMemo, useRef, useState } from "react";
import type { Sessao } from "../state/store";
import { urlAtividade } from "../data/activities";
import {
  CAIXA,
  arvoreDaSessao,
  caminhoDoNo,
  diagramar,
  type No,
} from "../engine/tree";
import { Montagem } from "../components/Montagem";
import { plural } from "../lib/texto";

type Props = {
  sessao: Sessao;
  /** Dentro da Mesa: sem título próprio, detalhe só quando há nó escolhido. */
  embutida?: boolean;
};

function acharFolhaDaMontagem(no: No, montagemId: string): No | undefined {
  if (no.tipo === "folha" && no.montagens.includes(montagemId)) return no;
  for (const filho of no.filhos) {
    const achado = acharFolhaDaMontagem(filho, montagemId);
    if (achado) return achado;
  }
  return undefined;
}

function ListaRamo({
  no,
  aoSelecionar,
  caminho,
  selecionado,
}: {
  no: No;
  aoSelecionar: (id: string) => void;
  caminho: Set<string>;
  selecionado: string | null;
}) {
  return (
    <li>
      <span className="ramo">
        {no.arquivo ? <img src={urlAtividade(no.arquivo)} alt="" /> : null}
        <button
          aria-pressed={selecionado === no.id}
          onClick={() => aoSelecionar(no.id)}
          style={caminho.has(no.id) ? { color: "var(--acento)", fontWeight: 700 } : undefined}
        >
          {no.rotulo}
        </button>
        {no.tipo === "folha" && no.contagem !== undefined && no.contagem > 0 && (
          <span className="contagem">{plural(no.contagem, "montagem", "montagens")}</span>
        )}
      </span>
      {no.filhos.length > 0 && (
        <ul>
          {no.filhos.map((filho) => (
            <ListaRamo
              key={filho.id}
              no={filho}
              aoSelecionar={aoSelecionar}
              caminho={caminho}
              selecionado={selecionado}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Arvore({ sessao, embutida = false }: Props) {
  const [modo, setModo] = useState<"mapa" | "lista">("mapa");
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const mapaRef = useRef<HTMLDivElement>(null);
  const ultimaImpressao = useRef(0);

  /** Um clique, uma impressão: ignora chamadas repetidas em sequência. */
  function imprimirMapa() {
    const agora = Date.now();
    if (agora - ultimaImpressao.current < 1500) return;
    ultimaImpressao.current = agora;
    window.print();
  }

  const arvore = useMemo(
    () => arvoreDaSessao(sessao.atividade, sessao.montagens),
    [sessao.atividade, sessao.montagens],
  );

  const diagrama = useMemo(() => diagramar(arvore), [arvore]);

  // Ao guardar, a árvore mostra onde a montagem nova ficou.
  const ultimaMontagem = sessao.montagens[sessao.montagens.length - 1];
  useEffect(() => {
    if (!embutida || !ultimaMontagem) return;
    const folha = acharFolhaDaMontagem(arvore, ultimaMontagem.id);
    if (folha) setSelecionado(folha.id);
    // Só quando entra uma montagem nova.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ultimaMontagem?.id]);

  useEffect(() => {
    mapaRef.current
      ?.querySelector('[aria-pressed="true"].no')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [selecionado, arvore]);

  // Trocar de árvore não deve herdar a rolagem da vista anterior: os nomes dos
  // níveis ficam no topo do mapa e sumiriam acima da área visível.
  useEffect(() => {
    if (mapaRef.current) mapaRef.current.scrollTop = 0;
  }, [arvore]);
  const caminho = useMemo(
    () => (selecionado ? caminhoDoNo(arvore, selecionado) : []),
    [arvore, selecionado],
  );
  const idsNoCaminho = useMemo(() => new Set(caminho.map((n) => n.id)), [caminho]);
  const noSelecionado = caminho[caminho.length - 1];
  const montagemSelecionada =
    noSelecionado?.montagens.length
      ? sessao.montagens.find((m) => m.id === noSelecionado.montagens[0])
      : undefined;

  const totalMontagensNoRamo = noSelecionado
    ? noSelecionado.montagens.length || contarAbaixo(noSelecionado)
    : 0;

  const profundidadeMaxima = diagrama.nos.reduce((m, n) => Math.max(m, n.profundidade), 0);

  const detalhe = embutida && !noSelecionado ? null : (
    <aside className="detalhe" aria-live="polite">
      {noSelecionado ? (
        <>
          {embutida && (
            <button
              className="botao discreto detalhe-fechar"
              onClick={() => setSelecionado(null)}
            >
              Fechar
            </button>
          )}
          <h2>
            {noSelecionado.tipo === "folha"
              ? "Fim do caminho"
              : `Escolha ${caminho.length - 1}`}
          </h2>
          <p>{caminho.map((n) => n.rotulo).join(" → ")}</p>
          {montagemSelecionada ? (
            <div className="cena">
              <Montagem
                atividade={sessao.atividade}
                escolhas={montagemSelecionada.escolhas}
                tamanho="p"
              />
            </div>
          ) : null}
          <p>
            {totalMontagensNoRamo > 0
              ? plural(
                  totalMontagensNoRamo,
                  "montagem guardada neste ramo.",
                  "montagens guardadas neste ramo.",
                )
              : "Este ramo ainda não tem montagem guardada."}
          </p>
        </>
      ) : (
        <p>Selecione um nó para ver o caminho.</p>
      )}
    </aside>
  );

  const Envoltorio = embutida ? "section" : "main";

  return (
    <Envoltorio
      className={embutida ? "arvore-embutida" : "tela tela-arvore"}
      {...(embutida ? { "aria-label": "Árvore das montagens guardadas" } : { id: "conteudo", tabIndex: -1 })}
    >
      <header className="barra-ferramentas">
        {embutida ? <h2 className="titulo-arvore sr-only">As possibilidades guardadas</h2> : <h1>Árvore</h1>}
        <div className="acoes" style={{ marginLeft: "auto" }}>
          <div className="segmentado" role="group" aria-label="Forma de visualização">
            <button aria-pressed={modo === "mapa"} onClick={() => setModo("mapa")}>
              Mapa
            </button>
            <button aria-pressed={modo === "lista"} onClick={() => setModo("lista")}>
              Lista
            </button>
          </div>
          <button className="botao" onClick={imprimirMapa}>
            Imprimir mapa
          </button>
        </div>
      </header>

      <div className="so-impressao">
        <h2>Árvore de possibilidades</h2>
        <p>
          {sessao.atividade.titulo} ·{" "}
          {plural(sessao.montagens.length, "montagem guardada", "montagens guardadas")}
        </p>
      </div>

      {arvore.filhos.length === 0 ? (
        <div className="arvore-vazia">
          <div className="no raiz arvore-vazia-raiz">
            <span className="nome">{arvore.rotulo}</span>
          </div>
          <span className="arvore-vazia-ramo" aria-hidden="true" />
          <p>
            <b>Guarde uma montagem para começar a árvore.</b>
          </p>
        </div>
      ) : modo === "lista" ? (
        <div className="arvore-corpo">
          <div className="mapa" style={{ marginTop: 18 }}>
            <ul className="lista-arvore">
              <li>
                <span className="raiz-lista">{arvore.rotulo}</span>
              </li>
              {arvore.filhos.map((filho) => (
                <ListaRamo
                  key={filho.id}
                  no={filho}
                  aoSelecionar={setSelecionado}
                  caminho={idsNoCaminho}
                  selecionado={selecionado}
                />
              ))}
            </ul>
          </div>
          {detalhe}
        </div>
      ) : (
        <div className="arvore-corpo">
          <div className="mapa" ref={mapaRef}>
            <div
              style={{ position: "relative", width: diagrama.largura, height: diagrama.altura }}
            >
              {Array.from({ length: profundidadeMaxima }, (_, i) => i + 1).map((profundidade) => (
                <div
                  key={`faixa-${profundidade}`}
                  className="faixa-nivel"
                  data-par={profundidade % 2}
                  style={{
                    left: CAIXA.margem + profundidade * CAIXA.coluna - 10,
                    width: CAIXA.coluna - 10,
                    top: 0,
                    bottom: 0,
                  }}
                />
              ))}

              {Array.from({ length: profundidadeMaxima + 1 }, (_, profundidade) => profundidade).map(
                (profundidade) => {
                  const slot = sessao.atividade.slots[profundidade - 1];
                  if (!slot) return null;
                  return (
                    <div
                      key={`cabecalho-${profundidade}`}
                      className="cabecalho-nivel"
                      style={{
                        left: CAIXA.margem + profundidade * CAIXA.coluna,
                        width: CAIXA.largura,
                        top: 6,
                      }}
                    >
                      {slot.rotulo}
                    </div>
                  );
                },
              )}

              <svg
                className="linhas"
                width={diagrama.largura}
                height={diagrama.altura}
                aria-hidden="true"
              >
                {diagrama.arestas.map(({ de, para }) => {
                  const x1 = de.x + CAIXA.largura;
                  const y1 = de.y + CAIXA.altura / 2;
                  const x2 = para.x;
                  const y2 = para.y + CAIXA.altura / 2;
                  const meio = x1 + (CAIXA.coluna - CAIXA.largura) / 2;
                  const ativa = idsNoCaminho.has(de.no.id) && idsNoCaminho.has(para.no.id);
                  return (
                    <path
                      key={`${de.no.id}->${para.no.id}`}
                      d={`M ${x1} ${y1} C ${meio} ${y1}, ${meio} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke={ativa ? "var(--acento)" : "var(--borda-forte)"}
                      strokeWidth={ativa ? 5 : de.no.tipo === "raiz" ? 4 : 2.5}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {diagrama.nos.map(({ no, x, y }) => {
                const estilo = {
                  left: x,
                  top: y,
                  width: CAIXA.largura,
                  height: CAIXA.altura,
                };
                const noCaminho = idsNoCaminho.has(no.id);
                if (no.tipo === "raiz") {
                  return (
                    <div className="no raiz" style={estilo} key={no.id}>
                      <span className="nome">{no.rotulo}</span>
                    </div>
                  );
                }
                return (
                  <button
                    key={no.id}
                    className={`no ${no.tipo === "folha" ? "folha" : ""} ${
                      noCaminho ? "no-caminho" : ""
                    }`}
                    style={estilo}
                    aria-pressed={selecionado === no.id}
                    onClick={() => setSelecionado(no.id)}
                  >
                    {no.arquivo && <img src={urlAtividade(no.arquivo)} alt="" />}
                    <span className="nome">
                      {no.rotulo}
                      {no.tipo === "folha" && no.contagem ? (
                        <span className="contagem"> · {no.contagem}</span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {detalhe}
        </div>
      )}
    </Envoltorio>
  );
}

function contarAbaixo(no: No): number {
  if (no.tipo === "folha") return no.contagem ?? 0;
  return no.filhos.reduce((total, filho) => total + contarAbaixo(filho), 0);
}
