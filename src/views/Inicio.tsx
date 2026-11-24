import { useEffect, useMemo, useState } from "react";
import { urlAtividade, type Atividade } from "../data/activities";
import { exportarEstado, importarEstado, type Sessao } from "../state/store";
import { SITUACOES, situacaoDaAtividade } from "../data/situacoes";
import { Icone } from "../components/Icone";
import { exportarJson, importarJson } from "../lib/arquivo";
import { plural } from "../lib/texto";

type Props = {
  /** Situação a mostrar em primeiro lugar (vem do painel inicial). */
  foco?: string;
  atividades: Atividade[];
  sessoes: Sessao[];
  aoComecar: (atividade: Atividade) => void;
  aoContinuar: (sessao: Sessao) => void;
  aoNovaAtividade: () => void;
  aoEditar: (atividade: Atividade) => void;
};

function dataCurta(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function horaCurta(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resumoSessao(sessao: Sessao): string {
  const marcados = Object.keys(sessao.marcas).length;
  const partes: string[] = [];
  if (sessao.montagens.length > 0) partes.push(plural(sessao.montagens.length, "montagem", "montagens"));
  if (marcados > 0) partes.push(plural(marcados, "caminho pintado", "caminhos pintados"));
  return partes.length === 0 ? "sem montagens ainda" : partes.join(", ");
}

function ModulosDaAtividade({
  atividade,
  aoComecar,
  nova = false,
}: {
  atividade: Atividade;
  aoComecar: (atividade: Atividade) => void;
  nova?: boolean;
}) {
  return (
    <div className="atividade-acao">
      <button
        className="botao primario"
        onClick={() => aoComecar(atividade)}
        aria-label={`${nova ? "Nova sessão de" : "Começar"} ${atividade.titulo}`}
      >
        <Icone nome={nova ? "mais" : "play"} />
        {nova ? "Nova sessão" : "Começar"}
      </button>
    </div>
  );
}

/**
 * A estante: cada atividade é um objeto, com o convite, o enunciado e as
 * sessões abertas. Não há inspetor nem painel à parte — escolher é o trabalho
 * desta tela.
 */
export function Inicio({ foco, atividades, sessoes, aoComecar, aoContinuar, aoNovaAtividade, aoEditar }: Props) {
  useEffect(() => {
    if (foco) document.getElementById(`grupo-${foco}`)?.scrollIntoView({ block: "start" });
  }, [foco]);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const porAtividade = useMemo(() => {
    const mapa = new Map<string, Sessao[]>();
    for (const sessao of sessoes) {
      // Sessão aberta e abandonada, sem nada dentro, não ocupa a estante.
      // Ela continua guardada e é reaberta pelo próximo "Começar".
      const temConteudo =
        sessao.montagens.length > 0 ||
        sessao.grupos.length > 0 ||
        sessao.comparacoes.length > 0 ||
        Object.keys(sessao.marcas).length > 0 ||
        Boolean(sessao.aluno.trim()) ||
        Boolean(sessao.explicacao.trim());
      if (!temConteudo) continue;
      const lista = mapa.get(sessao.atividade.id) ?? [];
      lista.push(sessao);
      mapa.set(sessao.atividade.id, lista);
    }
    for (const lista of mapa.values()) {
      lista.sort(
        (a, b) => Date.parse(b.atualizadaEm) - Date.parse(a.atualizadaEm),
      );
    }
    return mapa;
  }, [sessoes]);

  async function salvarCopia() {
    setErro("");
    try {
      const nome = await exportarJson(
        "arvore-de-possibilidades-sessoes.json",
        exportarEstado(),
      );
      setMensagem(nome ? `Cópia salva como ${nome}.` : "Cópia cancelada.");
    } catch (falha) {
      setMensagem("");
      setErro(`Não foi possível salvar a cópia: ${String(falha)}`);
    }
  }

  async function abrirCopia() {
    setErro("");
    try {
      const arquivo = await importarJson();
      if (!arquivo) {
        setMensagem("Abertura cancelada.");
        return;
      }
      const resultado = importarEstado(arquivo.texto);
      if (resultado.ok) {
        setMensagem(resultado.mensagem);
      } else {
        setMensagem("");
        setErro(resultado.mensagem);
      }
    } catch (falha) {
      setMensagem("");
      setErro(`Não foi possível abrir a cópia: ${String(falha)}`);
    }
  }

  return (
    <main className="tela tela-atividades" id="conteudo" tabIndex={-1}>
      <header className="barra-ferramentas">
        <div>
          <h1>Atividades</h1>
          <p>Escolha uma atividade. As sessões ficam salvas neste dispositivo.</p>
        </div>
        <div className="acoes">
          <button
            className="botao primario"
            onClick={aoNovaAtividade}
            title="Criar uma atividade com os níveis, as peças e as regras que você escolher"
          >
            <Icone nome="mais" />
            Nova atividade
          </button>
          <button
            className="botao"
            onClick={salvarCopia}
            title="Salvar uma cópia das sessões em um arquivo"
          >
            <Icone nome="guardar" />
            Salvar cópia
          </button>
          <button
            className="botao"
            onClick={abrirCopia}
            title="Abrir uma cópia das sessões de um arquivo"
          >
            <Icone nome="abrir" />
            Abrir cópia
          </button>
        </div>
      </header>

      {erro ? (
        <p className="linha-status aviso" role="alert">
          {erro}
        </p>
      ) : mensagem ? (
        <p className="linha-status" role="status">
          {mensagem}
        </p>
      ) : null}

      {SITUACOES.map((situacao) => {
        const doTipo = atividades.filter((a) => situacaoDaAtividade(a) === situacao.tipo);
        if (doTipo.length === 0) return null;
        return (
      <section key={situacao.tipo} className="grupo-situacao" aria-labelledby={`grupo-${situacao.tipo}`}>
        <header className="grupo-cabecalho">
          <h2 id={`grupo-${situacao.tipo}`}>{situacao.titulo}</h2>
          <p>{situacao.ideia}</p>
        </header>
      <ul className="prateleira">
        {doTipo.map((atividade) => {
          const abertas = porAtividade.get(atividade.id) ?? [];

          return (
            <li key={atividade.id} className="atividade">
              <div className="atividade-arte">
                <img src={urlAtividade(atividade.convite.arquivo)} alt="" />
              </div>

              <div className="atividade-texto">
                <h2>{atividade.titulo}</h2>
                <p className="atividade-enunciado">{atividade.enunciado}</p>
                <p className="atividade-meta">
                  {plural(atividade.slots.length, "nível", "níveis")}
                  {atividade.id.startsWith("prof-") && (
                    <>
                      {" · "}
                      <button
                        className="link-editar"
                        onClick={() => aoEditar(atividade)}
                        aria-label={`Editar a atividade ${atividade.titulo}`}
                      >
                        Editar
                      </button>
                    </>
                  )}
                </p>
              </div>

              {abertas.length > 0 ? (
                <>
                  <ul
                    className="atividade-sessoes"
                    aria-label={`Sessões de ${atividade.titulo}`}
                  >
                    {abertas.map((sessao) => (
                      <li key={sessao.id}>
                        <button
                          className="sessao-aberta"
                          onClick={() => aoContinuar(sessao)}
                          aria-label={`Abrir a sessão de ${
                            sessao.aluno || "sem identificação"
                          } em ${atividade.titulo}, ${resumoSessao(
                            sessao,
                          )}, atualizada em ${dataCurta(
                            sessao.atualizadaEm,
                          )} às ${horaCurta(sessao.atualizadaEm)}`}
                        >
                          <span className="sessao-quem">
                            {sessao.aluno || "Sem identificação"}
                          </span>
                          <span className="sessao-dados">
                            {resumoSessao(sessao)}
                            {" · "}
                            {dataCurta(sessao.atualizadaEm)}
                          </span>
                          <span className="sessao-seta" aria-hidden="true">
                            →
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <ModulosDaAtividade atividade={atividade} aoComecar={aoComecar} nova />
                </>
              ) : (
                <ModulosDaAtividade atividade={atividade} aoComecar={aoComecar} />
              )}
            </li>
          );
        })}
      </ul>
      </section>
        );
      })}
    </main>
  );
}
