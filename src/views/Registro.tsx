import { useEffect, useRef, useState } from "react";
import type { Sessao } from "../state/store";
import { adicionarMediacao, identificarSessao, removerMediacao, removerSessao, salvarExplicacao } from "../state/store";
import { Montagem } from "../components/Montagem";
import { escolhasDaChave, rotuloCaminho } from "../engine/comb";
import { plural } from "../lib/texto";

type Props = {
  sessao: Sessao;
  aoExcluirSessao: () => void;
};

export function Registro({ sessao, aoExcluirSessao }: Props) {
  const [explicacao, setExplicacao] = useState(sessao.explicacao);
  const [aluno, setAluno] = useState(sessao.aluno);
  const [mensagem, setMensagem] = useState("");
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const salvos = useRef({ explicacao: sessao.explicacao, aluno: sessao.aluno });

  // Grava o que a criança escreveu enquanto digita: sair da tela sem tocar em
  // "Guardar" não pode perder o texto. O blur e o desmonte gravam na hora.
  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      if (explicacao !== salvos.current.explicacao) {
        salvarExplicacao(sessao.id, explicacao);
        salvos.current.explicacao = explicacao;
      }
      if (aluno.trim() !== salvos.current.aluno) {
        identificarSessao(sessao.id, aluno.trim());
        salvos.current.aluno = aluno.trim();
      }
    }, 600);
    return () => window.clearTimeout(temporizador);
  }, [sessao.id, explicacao, aluno]);

  useEffect(
    () => () => {
      if (explicacao !== salvos.current.explicacao) {
        salvarExplicacao(sessao.id, explicacao);
      }
      if (aluno.trim() !== salvos.current.aluno) {
        identificarSessao(sessao.id, aluno.trim());
      }
    },
    [sessao.id, explicacao, aluno],
  );

  const data = new Date(sessao.criadaEm).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  function guardarExplicacao() {
    salvarExplicacao(sessao.id, explicacao);
    salvos.current.explicacao = explicacao;
    setMensagem("Explicação guardada no registro.");
  }

  return (
    <main className="tela tela-registro" id="conteudo" tabIndex={-1}>
      <header className="barra-ferramentas nao-imprimir">
        <h1>Registro</h1>
        <div className="acoes">
          {confirmandoExclusao ? (
            <>
              <button
                className="botao perigo"
                onClick={() => {
                  removerSessao(sessao.id);
                  aoExcluirSessao();
                }}
              >
                Excluir de vez
              </button>
              <button
                className="botao discreto"
                onClick={() => setConfirmandoExclusao(false)}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              className="botao discreto"
              onClick={() => setConfirmandoExclusao(true)}
              title="Apagar esta sessão e tudo o que ela guardou"
            >
              Excluir sessão
            </button>
          )}
          <button className="botao" onClick={() => window.print()}>
            Imprimir
          </button>
        </div>
      </header>

      {confirmandoExclusao && (
        <p className="linha-status aviso" role="alert">
          Excluir apaga {plural(sessao.montagens.length, "montagem", "montagens")},{" "}
          {plural(Object.keys(sessao.marcas).length, "caminho marcado", "caminhos marcados")}, os grupos, as
          comparações e as mediações desta sessão. Não há como desfazer.
        </p>
      )}

      <article className="registro">
        <header className="registro-cabecalho">
          <div>
            <h2>Registro da investigação</h2>
            <p style={{ marginTop: 6, color: "var(--texto-3)" }}>
              {sessao.atividade.titulo}
            </p>
          </div>
          <div className="meta">
            <div>{data}</div>
            <div>
              {sessao.modo === "interpretar"
                ? plural(Object.keys(sessao.marcas).length, "caminho marcado", "caminhos marcados")
                : `${plural(sessao.montagens.length, "montagem", "montagens")} · ${plural(sessao.grupos.length, "grupo", "grupos")}`}
            </div>
            <div>{sessao.atividade.slots.map((s) => s.rotulo).join(" · ")}</div>
          </div>
        </header>

        <section className="registro-secao">
          <h2>Enunciado</h2>
          <p>{sessao.atividade.enunciado}</p>
        </section>

        <section className="registro-secao">
          <h2>Identificação</h2>
          <label style={{ display: "block", maxWidth: 360 }}>
            <span className="rotulo-campo">Dupla ou criança (opcional)</span>
            <input
              className="campo"
              value={aluno}
              onChange={(e) => {
                setAluno(e.target.value);
                setMensagem("");
              }}
              onBlur={() => identificarSessao(sessao.id, aluno.trim())}
              placeholder="Nome ou identificação combinada com a turma"
            />
            <span className="campo-impresso" aria-hidden="true">
              {aluno.trim() || "Sem identificação"}
            </span>
            <span className="campo-nota nao-imprimir" aria-hidden="true">
              Salvo automaticamente.
            </span>
          </label>
        </section>

        {sessao.modo === "interpretar" && (
          <section className="registro-secao">
            <h2>Marcações na árvore</h2>
            {Object.keys(sessao.marcas).length === 0 ? (
              <p style={{ color: "var(--texto-3)" }}>Nenhum caminho marcado.</p>
            ) : (
              (["vale", "nao-vale"] as const).map((marca) => {
                const chaves = Object.entries(sessao.marcas)
                  .filter(([, m]) => m === marca)
                  .map(([chave]) => chave);
                if (chaves.length === 0) return null;
                return (
                  <div key={marca} style={{ marginBottom: 10 }}>
                    <p>
                      <strong>
                        {marca === "vale" ? "Marcados como “vale”" : "Marcados como “não vale”"}
                      </strong>{" "}
                      ({chaves.length})
                    </p>
                    <ol className="registro-montagens">
                      {chaves.map((chave) => (
                        <li key={chave}>
                          <span className="registro-mini">
                            <Montagem
                              atividade={sessao.atividade}
                              escolhas={escolhasDaChave(sessao.atividade, chave)}
                              tamanho="p"
                            />
                          </span>
                          <span className="hora">{rotuloCaminho(sessao.atividade, chave)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })
            )}
          </section>
        )}

        {sessao.modo === "construir" && (
        <section className="registro-secao">
          <h2>Ordem de criação</h2>
          {sessao.montagens.length === 0 ? (
            <p style={{ color: "var(--texto-3)" }}>Nenhuma montagem guardada.</p>
          ) : (
            <ol className="registro-montagens">
              {sessao.montagens.map((m) => (
                <li key={m.id}>
                  <span className="n">nº {m.n}</span>
                  <span className="registro-mini">
                    <Montagem atividade={sessao.atividade} escolhas={m.escolhas} tamanho="p" />
                  </span>
                  <span className="hora">
                    {new Date(m.hora).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
        )}

        {sessao.grupos.length > 0 && (
          <section className="registro-secao">
            <h2>Grupos</h2>
            {sessao.grupos.map((grupo) => (
              <p key={grupo.id} style={{ marginBottom: 6 }}>
                <strong>{grupo.nome}:</strong>{" "}
                {grupo.membros
                  .map((id) => sessao.montagens.find((m) => m.id === id)?.n)
                  .filter(Boolean)
                  .map((n) => `nº ${n}`)
                  .join(", ")}
              </p>
            ))}
          </section>
        )}

        <section className="registro-secao">
          <h2>Como conferimos as possibilidades</h2>
          <label style={{ display: "block" }}>
            <span className="sr-only">Explicação da criança</span>
            <textarea
              className="campo"
              value={explicacao}
              onChange={(e) => {
                setExplicacao(e.target.value);
                setMensagem("");
              }}
              onBlur={() => salvarExplicacao(sessao.id, explicacao)}
              placeholder="Escreva com suas palavras."
            />
            <p className="campo-impresso" aria-hidden="true">
              {explicacao.trim() || "Ainda não registrada."}
            </p>
          </label>
          <div className="nao-imprimir" style={{ marginTop: 10 }}>
            <button className="botao primario" onClick={guardarExplicacao}>
              Guardar explicação
            </button>
          </div>
        </section>

        {sessao.comparacoes.length > 0 && (
          <section className="registro-secao">
            <h2>Comparações feitas</h2>
            {sessao.comparacoes.map((c) => {
              const rotulo = (id: string) => {
                const m = sessao.montagens.find((x) => x.id === id);
                return m ? `nº ${m.n}` : rotuloCaminho(sessao.atividade, id);
              };
              return (
                <p key={c.id} style={{ marginBottom: 8, fontSize: 15 }}>
                  <strong>
                    {rotulo(c.a)} × {rotulo(c.b)}
                  </strong>{" "}
                  ·{" "}
                  {c.decisao === "mesma"
                    ? "a criança considerou a mesma possibilidade"
                    : c.decisao === "diferente"
                      ? "a criança considerou possibilidades diferentes"
                      : "a criança ainda estava pensando"}
                  {c.explicacao ? ` — “${c.explicacao}”` : ""}
                </p>
              );
            })}
          </section>
        )}

        <Mediacoes sessao={sessao} />

        {mensagem && (
          <p className="sucesso" role="status" style={{ marginTop: 16 }}>
            {mensagem}
          </p>
        )}

      </article>
    </main>
  );
}

const AJUDAS = [
  "Nenhuma: a criança seguiu sozinha",
  "Reli o enunciado com a criança",
  "Fiz uma pergunta",
  "Mostrei um exemplo",
  "Pedi que explicasse a um colega",
];

function Mediacoes({ sessao }: { sessao: Sessao }) {
  const [pergunta, setPergunta] = useState("");
  const [removendo, setRemovendo] = useState<string | null>(null);
  const [ajuda, setAjuda] = useState(AJUDAS[0]);
  const [antes, setAntes] = useState("");
  const [depois, setDepois] = useState("");
  const [aviso, setAviso] = useState("");
  const sugestoes = sessao.atividade.perguntas;

  function guardar() {
    if (!pergunta.trim() && !antes.trim() && !depois.trim()) {
      setAviso("Escreva a pergunta feita ou a solução antes ou depois da ajuda.");
      return;
    }
    setAviso("");
    adicionarMediacao(sessao.id, {
      pergunta: pergunta.trim(),
      ajuda,
      antes: antes.trim(),
      depois: depois.trim(),
    });
    setPergunta("");
    setAntes("");
    setDepois("");
  }

  return (
    <section className="registro-secao">
      <h2>Mediação do professor</h2>
      {sessao.mediacoes.length === 0 ? (
        <p style={{ color: "var(--texto-3)" }}>Nenhuma mediação registrada.</p>
      ) : (
        <ol className="registro-mediacoes">
          {sessao.mediacoes.map((m) => (
            <li key={m.id}>
              {m.pergunta && (
                <p>
                  <strong>Pergunta:</strong> {m.pergunta}
                </p>
              )}
              <p>
                <strong>Ajuda:</strong> {m.ajuda}
              </p>
              {m.antes && (
                <p>
                  <strong>Antes:</strong> {m.antes}
                </p>
              )}
              {m.depois && (
                <p>
                  <strong>Depois:</strong> {m.depois}
                </p>
              )}
              {removendo === m.id ? (
                <span className="nao-imprimir" role="group" aria-label="Confirmar remoção desta mediação">
                  Remover esta mediação?{" "}
                  <button className="botao discreto" onClick={() => removerMediacao(sessao.id, m.id)}>
                    Sim, remover
                  </button>{" "}
                  <button className="botao discreto" autoFocus onClick={() => setRemovendo(null)}>
                    Manter
                  </button>
                </span>
              ) : (
                <button className="botao discreto nao-imprimir" onClick={() => setRemovendo(m.id)}>
                  Remover
                </button>
              )}
            </li>
          ))}
        </ol>
      )}
      <div className="mediacao-form nao-imprimir">
        <label>
          <span className="rotulo-campo">Pergunta feita</span>
          <input
            className="campo"
            list="perguntas-da-atividade"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Escolha uma sugestão ou escreva a sua"
          />
          <datalist id="perguntas-da-atividade">
            {sugestoes.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </label>
        <label>
          <span className="rotulo-campo">Ajuda dada</span>
          <select className="campo" value={ajuda} onChange={(e) => setAjuda(e.target.value)}>
            {AJUDAS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="rotulo-campo">Solução antes da ajuda</span>
          <textarea className="campo" value={antes} onChange={(e) => setAntes(e.target.value)} />
        </label>
        <label>
          <span className="rotulo-campo">Solução depois da ajuda</span>
          <textarea className="campo" value={depois} onChange={(e) => setDepois(e.target.value)} />
        </label>
        <button className="botao primario" onClick={guardar}>
          Registrar mediação
        </button>
        {aviso && (
          <p className="linha-status aviso" role="alert">
            {aviso}
          </p>
        )}
      </div>
    </section>
  );
}
