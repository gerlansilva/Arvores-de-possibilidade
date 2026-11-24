import { useEffect, useRef, useState } from "react";
import type { Sessao } from "../state/store";
import {
  criarGrupo,
  registrarComparacao,
  removerGrupo,
  removerMontagem,
} from "../state/store";
import { Montagem } from "../components/Montagem";

type Props = {
  sessao: Sessao;
  aoIrParaMesa: () => void;
};

export function Colecao({ sessao, aoIrParaMesa }: Props) {
  const { atividade, montagens } = sessao;
  const [modo, setModo] = useState<"criacao" | "organizar">("criacao");
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [explicacao, setExplicacao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);
  const gruposRef = useRef<HTMLElement>(null);

  const par = selecionados
    .map((id) => montagens.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const comparacaoSalva =
    par.length === 2
      ? sessao.comparacoes.find(
          (c) =>
            (c.a === par[0].id && c.b === par[1].id) ||
            (c.a === par[1].id && c.b === par[0].id),
        )
      : undefined;

  useEffect(() => {
    setExplicacao(comparacaoSalva?.explicacao ?? "");
  }, [comparacaoSalva?.id, par[0]?.id, par[1]?.id, comparacaoSalva?.explicacao]);

  function alternar(id: string) {
    setMensagem("");
    setConfirmandoRemocao(false);
    setSelecionados((atual) => {
      if (atual.includes(id)) return atual.filter((x) => x !== id);
      if (atual.length === 2) return [atual[1], id];
      return [...atual, id];
    });
  }

  function decidir(decisao: "mesma" | "diferente" | "pensando") {
    if (par.length !== 2) return;
    registrarComparacao(sessao.id, par[0].id, par[1].id, decisao, explicacao);
    setMensagem("Sua resposta foi registrada no registro da investigação.");
  }

  function salvarExplicacao() {
    if (par.length !== 2) return;
    if (!comparacaoSalva) {
      setMensagem("Escolha primeiro se as montagens são a mesma ou diferentes.");
      return;
    }
    registrarComparacao(
      sessao.id,
      par[0].id,
      par[1].id,
      comparacaoSalva.decisao,
      explicacao,
    );
    setMensagem("Explicação guardada.");
  }

  function removerSelecionada() {
    if (par.length !== 1) return;
    removerMontagem(sessao.id, par[0].id);
    setSelecionados([]);
    setConfirmandoRemocao(false);
    setMensagem(`Montagem nº ${par[0].n} removida da coleção.`);
  }

  function criar() {
    const nome = nomeGrupo.trim();
    if (!nome || selecionados.length < 2) return;
    criarGrupo(sessao.id, nome, selecionados);
    setNomeGrupo("");
    setSelecionados([]);
    setMensagem(`Grupo “${nome}” criado.`);
    requestAnimationFrame(() => gruposRef.current?.focus());
  }

  return (
    <main className="tela tela-colecao" id="conteudo" tabIndex={-1}>
      <header className="barra-ferramentas">
        <h1>Coleção</h1>
        <div className="acoes">
        <div className="segmentado" role="group" aria-label="Modo de visualização">
          <button
            aria-pressed={modo === "criacao"}
            onClick={() => setModo("criacao")}
          >
            Ordem de criação
          </button>
          <button
            aria-pressed={modo === "organizar"}
            onClick={() => setModo("organizar")}
          >
            Organizar
          </button>
        </div>
        </div>
      </header>

      {montagens.length === 0 ? (
        <div className="vazio" style={{ marginTop: 24 }}>
          <b>Nada guardado.</b>
          Monte na mesa e guarde a primeira montagem.
          <div style={{ marginTop: 12 }}>
            <button className="botao" onClick={aoIrParaMesa}>
              Voltar à mesa
            </button>
          </div>
        </div>
      ) : (
        <>
          {selecionados.length < 2 && (
            <p className="colecao-resumo">
              {selecionados.length === 0
                ? modo === "criacao"
                  ? "Selecione duas montagens para comparar."
                  : "Selecione duas montagens e dê um nome ao grupo."
                : modo === "criacao"
                  ? "Selecione mais uma montagem para comparar."
                  : "Selecione mais uma montagem para o grupo."}
            </p>
          )}

          <div className="colecao-corpo">
            <div className="colecao-principal">
              {selecionados.length === 1 && (
                <div className="selecao-acao">
                  <span>nº {par[0]?.n} selecionada</span>
                  {confirmandoRemocao ? (
                    <>
                      <button className="botao perigo" onClick={removerSelecionada}>
                        Remover de vez
                      </button>
                      <button
                        className="botao discreto"
                        onClick={() => setConfirmandoRemocao(false)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      className="botao discreto"
                      onClick={() => setConfirmandoRemocao(true)}
                    >
                      Remover montagem
                    </button>
                  )}
                </div>
              )}

              {modo === "criacao" && mensagem && selecionados.length === 0 && (
                <p className="linha-status" role="status">
                  {mensagem}
                </p>
              )}

              <ul className="grade-colecao" aria-label="Montagens guardadas">
                {montagens.map((m) => (
                  <li key={m.id}>
                    <button
                      className="cartao-montagem"
                      aria-pressed={selecionados.includes(m.id)}
                      onClick={() => alternar(m.id)}
                      aria-label={`nº ${m.n}, ${new Date(m.hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}. Montagem ${m.n}. ${
                        modo === "criacao"
                          ? "Selecionar para comparar."
                          : "Selecionar para organizar em um grupo."
                      }`}
                    >
                      <span className="cena">
                        <Montagem atividade={atividade} escolhas={m.escolhas} tamanho="c" />
                      </span>
                      <span className="rodape">
                        <b>nº {m.n}</b>
                        <span>
                          {new Date(m.hora).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {modo === "organizar" && mensagem && (
                <p className="sucesso linha-status" role="status">
                  {mensagem}
                </p>
              )}

              {sessao.grupos.length > 0 && (
                <section
                  className="grupos"
                  aria-labelledby="grupos-titulo"
                  ref={gruposRef}
                  tabIndex={-1}
                >
                  <p className="secao-rotulo" id="grupos-titulo">
                    Grupos <b>{sessao.grupos.length}</b>
                  </p>
                  {sessao.grupos.map((grupo) => (
                    <div className="grupo-bloco" key={grupo.id}>
                      <header>
                        <h3>{grupo.nome}</h3>
                        <button
                          className="botao texto"
                          onClick={() => removerGrupo(sessao.id, grupo.id)}
                        >
                          Desfazer grupo
                        </button>
                      </header>
                      <div className="membros">
                        {grupo.membros.map((id) => {
                          const m = montagens.find((x) => x.id === id);
                          if (!m) return null;
                          return (
                            <span className="membro" key={id}>
                              <Montagem
                                atividade={atividade}
                                escolhas={m.escolhas}
                                tamanho="p"
                              />
                              nº {m.n}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </div>

            <aside
              className="colecao-lateral"
              aria-label={modo === "criacao" ? "Comparação" : "Novo grupo"}
            >
              {modo === "criacao" ? (
                par.length === 2 ? (
                  <section className="comparacao" aria-labelledby="comparacao-titulo">
                    <h2 id="comparacao-titulo">Comparar montagens</h2>
                    <div className="comparacao-grade">
                      <div className="lado-montagem">
                        <span className="rotulo">Montagem nº {par[0].n}</span>
                        <span className="cena">
                          <Montagem atividade={atividade} escolhas={par[0].escolhas} />
                        </span>
                      </div>
                      <div className="divisor" aria-hidden="true" />
                      <div className="lado-montagem">
                        <span className="rotulo">Montagem nº {par[1].n}</span>
                        <span className="cena">
                          <Montagem atividade={atividade} escolhas={par[1].escolhas} />
                        </span>
                      </div>
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
                          value={explicacao}
                          onChange={(e) => setExplicacao(e.target.value)}
                          placeholder="Escreva com suas palavras."
                        />
                      </label>
                      <div>
                        <button
                          className="botao primario"
                          onClick={salvarExplicacao}
                        >
                          Guardar explicação
                        </button>
                      </div>
                      {mensagem && (
                        <p className="sucesso" role="status">
                          {mensagem}
                        </p>
                      )}
                    </div>
                  </section>
                ) : (
                  <div className="lateral-ajuda">
                    <h2>Comparação</h2>
                    <p>Duas montagens aparecem aqui, lado a lado.</p>
                  </div>
                )
              ) : (
                <section className="form-grupo" aria-labelledby="grupo-titulo">
                  <h2 id="grupo-titulo">Novo grupo</h2>
                  {selecionados.length >= 2 ? (
                    <>
                      <div className="lateral-membros">
                        {par.map((m) => (
                          <span className="membro" key={m.id}>
                            <Montagem
                              atividade={atividade}
                              escolhas={m.escolhas}
                              tamanho="p"
                            />
                            nº {m.n}
                          </span>
                        ))}
                      </div>
                      <label>
                        <span className="rotulo-campo">Nome do grupo</span>
                        <input
                          className="campo"
                          value={nomeGrupo}
                          onChange={(e) => setNomeGrupo(e.target.value)}
                          placeholder="Nome do grupo"
                        />
                      </label>
                      <button
                        className="botao primario largura-total"
                        onClick={criar}
                        disabled={!nomeGrupo.trim()}
                      >
                        Criar grupo
                      </button>
                    </>
                  ) : (
                    <p className="lateral-regra">
                      Duas montagens aparecem aqui para formar o grupo.
                    </p>
                  )}
                </section>
              )}
            </aside>
          </div>
        </>
      )}
    </main>
  );
}
