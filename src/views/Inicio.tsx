import { useMemo, useState } from "react";
import { urlAtividade, type Atividade } from "../data/activities";
import { exportarEstado, importarEstado, type Modo, type Sessao } from "../state/store";
import { exportarJson, importarJson } from "../lib/arquivo";
import { plural } from "../lib/texto";

type Props = {
  atividades: Atividade[];
  sessoes: Sessao[];
  aoComecar: (atividade: Atividade, modo: Modo) => void;
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
  if (sessao.modo === "interpretar") {
    const marcados = Object.keys(sessao.marcas).length;
    return marcados === 0
      ? "interpretar, sem marcas ainda"
      : `interpretar, ${plural(marcados, "caminho marcado", "caminhos marcados")}`;
  }
  return sessao.montagens.length === 0
    ? "sem montagens ainda"
    : plural(sessao.montagens.length, "montagem", "montagens");
}

function ModulosDaAtividade({
  atividade,
  aoComecar,
  nova = false,
}: {
  atividade: Atividade;
  aoComecar: (atividade: Atividade, modo: Modo) => void;
  nova?: boolean;
}) {
  return (
    <div className="atividade-acao modulos" role="group" aria-label={`Abrir ${atividade.titulo}`}>
      <button
        className="botao"
        onClick={() => aoComecar(atividade, "construir")}
        aria-label={`${nova ? "Nova sessão de" : "Construir"} ${atividade.titulo}: construir possibilidades`}
        title="A criança monta possibilidades e a árvore cresce com o que ela guardou"
      >
        Construir
      </button>
      <button
        className="botao"
        onClick={() => aoComecar(atividade, "interpretar")}
        aria-label={`${nova ? "Nova sessão de" : "Interpretar"} ${atividade.titulo}: interpretar a árvore completa`}
        title="A árvore já vem completa e a criança marca os caminhos que valem"
      >
        Interpretar
      </button>
    </div>
  );
}

/**
 * A estante: cada atividade é um objeto, com o convite, o enunciado e as
 * sessões abertas. Não há inspetor nem painel à parte — escolher é o trabalho
 * desta tela.
 */
export function Inicio({ atividades, sessoes, aoComecar, aoContinuar, aoNovaAtividade, aoEditar }: Props) {
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
            Nova atividade
          </button>
          <button
            className="botao"
            onClick={salvarCopia}
            title="Salvar uma cópia das sessões em um arquivo"
          >
            Salvar cópia
          </button>
          <button
            className="botao"
            onClick={abrirCopia}
            title="Abrir uma cópia das sessões de um arquivo"
          >
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

      <ul className="prateleira">
        {atividades.map((atividade) => {
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
    </main>
  );
}
