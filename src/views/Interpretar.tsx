import { ComparaRegras } from "../components/ComparaRegras";
import { useEffect, useMemo, useRef, useState } from "react";
import { urlAtividade } from "../data/activities";
import {
  chaveCaminho,
  chaveResultado,
  escolhasDaChave,
  rotuloCaminho,
  todosOsCaminhos,
  validar,
} from "../engine/comb";
import { CAIXA, arvoreCompleta, chaveDoNo, diagramar } from "../engine/tree";
import {
  marcarCaminho,
  registrarComparacao,
  type Decisao,
  type Marca,
  type Sessao,
} from "../state/store";
import { Montagem } from "../components/Montagem";
import { plural } from "../lib/texto";

type Props = {
  sessao: Sessao;
};

/** Acima disso a árvore completa deixa de caber numa tela e perde o sentido. */
const LIMITE_DE_CAMINHOS = 300;

function letraDoCaso(indice: number): string {
  return indice < 26 ? String.fromCharCode(65 + indice) : String(indice + 1);
}

function proximaMarca(atual: Marca | undefined): Marca | null {
  if (!atual) return "vale";
  if (atual === "vale") return "nao-vale";
  return null;
}

/**
 * Modo Interpretar, no espírito do Árbol: a árvore já vem completa, com todos
 * os caminhos, e quem interpreta decide quais valem e quais representam o mesmo
 * caso. A conferência com a regra fica numa área do professor.
 */
export function Interpretar({ sessao }: Props) {
  const { atividade } = sessao;
  const [acao, setAcao] = useState<"marcar" | "comparar">("marcar");
  const [par, setPar] = useState<string[]>([]);
  const [gabarito, setGabarito] = useState(false);
  const [texto, setTexto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const caminhos = useMemo(() => todosOsCaminhos(atividade), [atividade]);
  const aparecaRaiz = useRef<HTMLElement | null>(null);
  const excesso = caminhos.length > LIMITE_DE_CAMINHOS;
  const arvore = useMemo(() => (excesso ? null : arvoreCompleta(atividade)), [atividade, excesso]);

  /** A raiz fica no meio de uma árvore alta: traz para a vista ao abrir. */
  useEffect(() => {
    const mapa = aparecaRaiz.current?.querySelector<HTMLElement>(".mapa");
    const raiz = aparecaRaiz.current?.querySelector<HTMLElement>(".no.raiz");
    if (!mapa || !raiz) return;
    const alvo = raiz.offsetTop + raiz.offsetHeight / 2 - mapa.clientHeight / 2;
    mapa.scrollTop = Math.max(0, alvo);
  }, [arvore]);
  const diagrama = useMemo(() => (arvore ? diagramar(arvore) : null), [arvore]);

  const referencia = useMemo(() => {
    const porCaminho = new Map<string, { valido: boolean; caso?: string }>();
    const casos = new Map<string, string>();
    for (const caminho of caminhos) {
      const chave = chaveCaminho(atividade, caminho);
      const valido = validar(atividade, caminho).ok;
      let caso: string | undefined;
      if (valido) {
        const resultado = chaveResultado(atividade, caminho);
        if (!casos.has(resultado)) casos.set(resultado, letraDoCaso(casos.size));
        caso = casos.get(resultado);
      }
      porCaminho.set(chave, { valido, caso });
    }
    const validos = [...porCaminho.values()].filter((c) => c.valido).length;
    return { porCaminho, validos, casos: casos.size };
  }, [atividade, caminhos]);

  const marcas = sessao.marcas;
  const vale = Object.values(marcas).filter((m) => m === "vale").length;
  const naoVale = Object.values(marcas).filter((m) => m === "nao-vale").length;
  const semMarca = caminhos.length - vale - naoVale;

  const comparacaoSalva =
    par.length === 2
      ? sessao.comparacoes.find(
          (c) => (c.a === par[0] && c.b === par[1]) || (c.a === par[1] && c.b === par[0]),
        )
      : undefined;

  useEffect(() => {
    setTexto(comparacaoSalva?.explicacao ?? "");
    setMensagem("");
    // Troca de par: carrega o que já foi escrito para ele.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [par.join("#"), comparacaoSalva?.id]);

  function aoClicarCaminho(chave: string) {
    if (acao === "marcar") {
      marcarCaminho(sessao.id, chave, proximaMarca(marcas[chave]));
      return;
    }
    setPar((atual) => {
      if (atual.includes(chave)) return atual.filter((c) => c !== chave);
      return atual.length >= 2 ? [atual[1], chave] : [...atual, chave];
    });
  }

  function decidir(decisao: Decisao) {
    if (par.length !== 2) return;
    registrarComparacao(sessao.id, par[0], par[1], decisao, texto.trim());
    setMensagem("Decisão guardada.");
  }

  function guardarTexto() {
    if (par.length !== 2) return;
    registrarComparacao(
      sessao.id,
      par[0],
      par[1],
      comparacaoSalva?.decisao ?? "pensando",
      texto.trim(),
    );
    setMensagem("Explicação guardada.");
  }

  const profundidadeMaxima = diagrama
    ? diagrama.nos.reduce((m, n) => Math.max(m, n.profundidade), 0)
    : 0;

  return (
    <main className="tela tela-interpretar" id="conteudo" tabIndex={-1}>
      <h1 className="sr-only">{atividade.titulo}: interpretar a árvore</h1>

      {!excesso && (
        <a
          className="pular-arvore"
          href="#depois-da-arvore"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("depois-da-arvore")?.focus();
          }}
        >
          Pular a árvore
        </a>
      )}

      <section className="interpretar-topo" aria-label="Problema e ferramentas">
        <p className="enunciado">{atividade.enunciado}</p>
        <div className="interpretar-barra">
          <div className="segmentado" role="group" aria-label="O que fazer na árvore">
            <button aria-pressed={acao === "marcar"} disabled={excesso} onClick={() => setAcao("marcar")}>
              Marcar caminhos
            </button>
            <button aria-pressed={acao === "comparar"} disabled={excesso} onClick={() => setAcao("comparar")}>
              Comparar dois
            </button>
          </div>
          <p className="interpretar-contagem" role="status" hidden={excesso}>
            <span>{plural(vale, "vale", "valem")}</span>{" "}
            <span>{naoVale} não {naoVale === 1 ? "vale" : "valem"}</span>{" "}
            <span>{plural(semMarca, "sem marca", "sem marca")}</span>
          </p>
          <button
            className="botao"
            aria-pressed={gabarito}
            disabled={excesso}
            onClick={() => setGabarito((g) => !g)}
            title="Área do professor: mostra o que a regra da atividade aceita"
          >
            {gabarito ? "Esconder conferência" : "Conferir (professor)"}
          </button>
        </div>
        <p className="interpretar-dica">
          {acao === "marcar"
            ? "Toque num caminho: primeiro vale, depois não vale, depois sem marca."
            : "Escolha dois caminhos e diga se são a mesma possibilidade."}
        </p>
      </section>

      <section
        className="arvore-embutida interpretar-arvore"
        aria-label="Árvore completa"
        ref={aparecaRaiz}
      >
        {excesso || !arvore || !diagrama ? (
          <div className="arvore-vazia">
            <p>
              <b>Esta árvore tem {caminhos.length} caminhos.</b>
              Para interpretar, use poucas peças ou poucos níveis no editor de atividades.
            </p>
          </div>
        ) : (
          <div className="arvore-corpo">
            <div className="mapa">
              <div style={{ position: "relative", width: diagrama.largura, height: diagrama.altura }}>
                {Array.from({ length: profundidadeMaxima }, (_, i) => i + 1).map((p) => (
                  <div
                    key={`faixa-${p}`}
                    className="faixa-nivel"
                    data-par={p % 2}
                    style={{
                      left: CAIXA.margem + p * CAIXA.coluna - 10,
                      width: CAIXA.coluna - 10,
                      top: 0,
                      bottom: 0,
                    }}
                  />
                ))}

                {Array.from({ length: profundidadeMaxima + 1 }, (_, p) => p).map((p) => {
                  const slot = atividade.slots[p - 1];
                  if (!slot) return null;
                  return (
                    <div
                      key={`cabecalho-${p}`}
                      className="cabecalho-nivel"
                      style={{
                        left: CAIXA.margem + p * CAIXA.coluna,
                        width: CAIXA.largura,
                        top: 6,
                      }}
                    >
                      {slot.rotulo}
                    </div>
                  );
                })}

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
                    return (
                      <path
                        key={`${de.no.id}->${para.no.id}`}
                        d={`M ${x1} ${y1} C ${meio} ${y1}, ${meio} ${y2}, ${x2} ${y2}`}
                        fill="none"
                        stroke="var(--borda-forte)"
                        strokeWidth={de.no.tipo === "raiz" ? 4 : 2.5}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                {diagrama.nos.map(({ no, x, y }) => {
                  const estilo = { left: x, top: y, width: CAIXA.largura, height: CAIXA.altura };
                  if (no.tipo === "raiz") {
                    return (
                      <div className="no raiz" style={estilo} key={no.id}>
                        <span className="nome">{no.rotulo}</span>
                      </div>
                    );
                  }
                  if (no.tipo === "ramo") {
                    return (
                      <div className="no" style={estilo} key={no.id}>
                        {no.arquivo && <img src={urlAtividade(no.arquivo)} alt="" />}
                        <span className="nome">{no.rotulo}</span>
                      </div>
                    );
                  }

                  const chave = chaveDoNo(no.id);
                  const marca = marcas[chave];
                  const ref = gabarito ? referencia.porCaminho.get(chave) : undefined;
                  const difere = ref && marca ? (marca === "vale") !== ref.valido : false;
                  const caminhoEscrito = rotuloCaminho(atividade, chave);
                  const estado =
                    marca === "vale" ? "vale" : marca === "nao-vale" ? "não vale" : "sem marca";
                  const refTexto = ref
                    ? ref.valido
                      ? `regra: vale, caso ${ref.caso}`
                      : "regra: não vale"
                    : "";
                  return (
                    <button
                      key={no.id}
                      className="no folha caminho"
                      style={estilo}
                      data-marca={marca}
                      data-escolhido={par.includes(chave) ? "sim" : undefined}
                      data-difere={difere ? "sim" : undefined}
                      aria-pressed={acao === "comparar" ? par.includes(chave) : marca !== undefined}
                      aria-label={`${caminhoEscrito}: ${estado}${refTexto ? `; ${refTexto}` : ""}`}
                      onClick={() => aoClicarCaminho(chave)}
                    >
                      {no.arquivo && <img src={urlAtividade(no.arquivo)} alt="" />}
                      <span className="nome">
                        {no.rotulo}
                        <span className="estado-caminho">
                          {marca === "vale" ? "✓ vale" : marca === "nao-vale" ? "✕ não vale" : ""}
                          {ref ? (
                            <span className="regra-caminho">
                              {" "}
                              {ref.valido ? `· caso ${ref.caso}` : "· fora da regra"}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      <div id="depois-da-arvore" tabIndex={-1} className="sr-only" aria-label="Depois da árvore" />

      {gabarito && (
        <p className="interpretar-conferencia" role="status">
          Pela regra da atividade: {plural(referencia.validos, "caminho vale", "caminhos valem")} e{" "}
          {plural(referencia.casos, "caso diferente", "casos diferentes")} entre {caminhos.length}{" "}
          caminhos. Contornos vermelhos mostram marcas da criança que diferem da regra.
        </p>
      )}

      {gabarito && <ComparaRegras atividade={atividade} />}

      {acao === "comparar" && (
        <section className="comparacao interpretar-comparacao" aria-labelledby="interp-comp-titulo">
          <h2 id="interp-comp-titulo">Comparar caminhos</h2>
          {par.length < 2 ? (
            <p>Escolha {par.length === 0 ? "dois caminhos" : "mais um caminho"} na árvore.</p>
          ) : (
            <>
              <div className="comparacao-grade">
                {par.map((chave, i) => (
                  <div key={chave} style={{ display: "contents" }}>
                    {i === 1 && <div className="divisor" aria-hidden="true" />}
                    <div className="lado-montagem">
                      <span className="rotulo">{rotuloCaminho(atividade, chave)}</span>
                      <span className="cena">
                        <Montagem atividade={atividade} escolhas={escolhasDaChave(atividade, chave)} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="decisao">
                <p className="pergunta">São a mesma possibilidade?</p>
                <button
                  aria-pressed={comparacaoSalva?.decisao === "mesma"}
                  onClick={() => decidir("mesma")}
                >
                  São a mesma
                </button>
                <button
                  aria-pressed={comparacaoSalva?.decisao === "diferente"}
                  onClick={() => decidir("diferente")}
                >
                  São diferentes
                </button>
                <button
                  aria-pressed={comparacaoSalva?.decisao === "pensando"}
                  onClick={() => decidir("pensando")}
                >
                  Ainda estou pensando
                </button>
              </div>
              <div className="explicacao-comparacao">
                <label>
                  <span className="rotulo-campo">Por quê?</span>
                  <textarea
                    className="campo"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escreva com suas palavras."
                  />
                </label>
                <div>
                  <button className="botao primario" onClick={guardarTexto}>
                    Guardar explicação
                  </button>
                </div>
                {mensagem && (
                  <p className="sucesso" role="status">
                    {mensagem}
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
