import { useEffect, useMemo, useState } from "react";
import { ATIVIDADES, type Atividade } from "./data/activities";
import { useEstado, criarSessao, useFalhaAoGravar, type Modo, type Sessao } from "./state/store";
import { Entrada } from "./views/Entrada";
import { Inicio } from "./views/Inicio";
import { Mesa } from "./views/Mesa";
import { Colecao } from "./views/Colecao";
import { Registro } from "./views/Registro";
import { Interpretar } from "./views/Interpretar";
import { Editor } from "./views/Editor";
import { LogoArvore } from "./components/LogoArvore";

type Rota =
  | { tela: "entrada" }
  | { tela: "inicio" }
  | { tela: "editor"; editandoId?: string }
  | { tela: "mesa" | "colecao" | "registro"; sessaoId: string };

type Aba = { tela: "mesa" | "colecao" | "registro"; nome: string };

/** Construir tem a coleção; Interpretar não: as marcas moram na própria árvore. */
function abasDaSessao(sessao: Sessao | undefined): Aba[] {
  if (sessao?.modo === "interpretar") {
    return [
      { tela: "mesa", nome: "Interpretar" },
      { tela: "registro", nome: "Registro" },
    ];
  }
  return [
    { tela: "mesa", nome: "Montar" },
    { tela: "colecao", nome: "Coleção" },
    { tela: "registro", nome: "Registro" },
  ];
}

/** Depois de recarregar a página, volta para a tela em que o professor estava. */
function rotaSalva(): Rota {
  try {
    const r = JSON.parse(sessionStorage.getItem("mesa-rota") ?? "null") as Rota | null;
    if (r && typeof r.tela === "string") return r;
  } catch {
    /* ignora */
  }
  return { tela: "entrada" };
}

export default function App() {
  const estado = useEstado();
  const falhaAoGravar = useFalhaAoGravar();
  const [rota, setRotaBruta] = useState<Rota>(rotaSalva);
  const setRota = (r: Rota) => {
    setRotaBruta(r);
    try {
      sessionStorage.setItem("mesa-rota", JSON.stringify(r));
    } catch {
      /* sem armazenamento: segue sem restaurar */
    }
  };

  const atividades = useMemo(() => {
    const importadas = estado.atividades.filter(
      (a) => !ATIVIDADES.some((embutida) => embutida.id === a.id),
    );
    return [...ATIVIDADES, ...importadas];
  }, [estado.atividades]);

  const sessao =
    rota.tela === "mesa" ||
    rota.tela === "colecao" ||
    rota.tela === "registro"
      ? estado.sessoes.find((s) => s.id === rota.sessaoId)
      : undefined;

  useEffect(() => {
    document.title = sessao
      ? `${sessao.atividade.titulo} · Árvore de possibilidades`
      : "Árvore de possibilidades";
  }, [rota, sessao]);

  useEffect(() => {
    document.getElementById("conteudo")?.focus();
  }, [rota]);

  function comecar(atividade: Atividade, modo: Modo) {
    // Uma sessão sem nada dentro não vira outra: repetir "Começar" reabre a
    // mesma, em vez de acumular sessões vazias na estante.
    const vazia = estado.sessoes.find(
      (s) =>
        s.atividade.id === atividade.id &&
        s.modo === modo &&
        Object.keys(s.marcas).length === 0 &&
        s.montagens.length === 0 &&
        s.grupos.length === 0 &&
        s.comparacoes.length === 0 &&
        !s.aluno.trim() &&
        !s.explicacao.trim(),
    );
    if (vazia) {
      setRota({ tela: "mesa", sessaoId: vazia.id });
      return;
    }
    const nova = criarSessao(atividade, "", modo);
    setRota({ tela: "mesa", sessaoId: nova.id });
  }

  const abas = abasDaSessao(sessao);
  const area =
    rota.tela === "inicio"
      ? "Atividades"
      : rota.tela === "editor"
        ? "Nova atividade"
        : rota.tela === "entrada"
          ? ""
          : (abas.find((a) => a.tela === rota.tela)?.nome ?? "");

  return (
    <div
      className={`app${rota.tela === "entrada" ? " app-entrada" : ""}${
        sessao ? " app-sessao" : ""
      }`}
    >
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="topo">
        <button
          className="marca"
          onClick={() => setRota({ tela: "inicio" })}
          title="Ir para as atividades"
          aria-label="Árvore de possibilidades — ir para as atividades"
        >
          <LogoArvore tamanho={20} />
          <span>
            Árvore <em>de possibilidades</em>
          </span>
        </button>

        <div className="topo-contexto">
          {sessao ? (
            <>
              <span className="topo-atividade">{sessao.atividade.titulo}</span>
              <span className="topo-sep" aria-hidden="true" />
              <span className="topo-aluno">{sessao.aluno || "sessão local"}</span>
            </>
          ) : rota.tela !== "inicio" && rota.tela !== "entrada" ? (
            <span>{area}</span>
          ) : null}
        </div>

        {sessao && (
          <nav className="abas-sessao" aria-label="Etapas da investigação">
            {abas.map((aba) => (
              <button
                key={aba.tela}
                className="aba-sessao"
                aria-current={rota.tela === aba.tela ? "page" : undefined}
                onClick={() => setRota({ tela: aba.tela, sessaoId: sessao.id })}
              >
                {aba.nome}
                {aba.tela === "colecao" && sessao.montagens.length > 0 && (
                  <span className="aba-contador">{sessao.montagens.length}</span>
                )}
              </button>
            ))}
          </nav>
        )}

        <div className="topo-acoes">
          {sessao && (
            <button
              className="botao-topo botao-voltar"
              onClick={() => setRota({ tela: "inicio" })}
            >
              <span aria-hidden="true">←</span> Atividades
            </button>
          )}
          {rota.tela === "inicio" && (
            <button
              className="botao-topo botao-voltar"
              onClick={() => setRota({ tela: "entrada" })}
            >
              <span aria-hidden="true">←</span> Início
            </button>
          )}
          {rota.tela === "editor" && (
            <button
              className="botao-topo botao-voltar"
              onClick={() => setRota({ tela: "inicio" })}
            >
              <span aria-hidden="true">←</span> Atividades
            </button>
          )}
        </div>
      </header>

      <div className="area">
        {rota.tela === "entrada" && (
          <Entrada aoEntrar={() => setRota({ tela: "inicio" })} />
        )}

        {rota.tela === "inicio" && (
          <Inicio
            atividades={atividades}
            sessoes={estado.sessoes}
            aoComecar={comecar}
            aoContinuar={(s) => setRota({ tela: "mesa", sessaoId: s.id })}
            aoNovaAtividade={() => setRota({ tela: "editor" })}
            aoEditar={(a) => setRota({ tela: "editor", editandoId: a.id })}
          />
        )}

        {rota.tela === "editor" && (
          <Editor
            key={rota.editandoId ?? "nova"}
            atividades={atividades}
            editando={atividades.find((a) => a.id === rota.editandoId)}
            aoTerminar={() => setRota({ tela: "inicio" })}
          />
        )}

        {rota.tela !== "inicio" && rota.tela !== "entrada" && rota.tela !== "editor" && !sessao && (
          <main className="tela" id="conteudo" tabIndex={-1}>
            <div className="vazio">
              <b>Esta sessão não está mais neste dispositivo.</b>
              Ela pode ter sido removida ou aberta em outro computador. Importe uma cópia
              em Atividades ou comece outra atividade.
            </div>
          </main>
        )}

        {sessao && rota.tela === "mesa" &&
          (sessao.modo === "interpretar" ? (
            <Interpretar key={sessao.id} sessao={sessao} />
          ) : (
            <Mesa key={sessao.id} sessao={sessao} />
          ))}

        {sessao && rota.tela === "colecao" && (
          <Colecao
            sessao={sessao}
            aoIrParaMesa={() => setRota({ tela: "mesa", sessaoId: sessao.id })}
          />
        )}

        {sessao && rota.tela === "registro" && (
          <Registro
            key={sessao.id}
            sessao={sessao}
            aoExcluirSessao={() => setRota({ tela: "inicio" })}
          />
        )}
      </div>

      {falhaAoGravar && (
        <footer className="statusbar" role="alert">
          <span className="status-item status-falha">
            Não foi possível salvar. Sem espaço para gravar: salve uma cópia.
          </span>
        </footer>
      )}
    </div>
  );
}
