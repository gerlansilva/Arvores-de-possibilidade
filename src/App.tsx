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
import { Orientacoes } from "./views/Orientacoes";
import { Sobre } from "./views/Sobre";
import { Arbol, type SecaoDoArbol } from "./views/arbol/Arbol";
import { Painel } from "./views/Painel";
import { ArvoreCompleta } from "./views/ArvoreCompleta";
import { useBiblioteca } from "./state/arvores";
import { Icone, type NomeDeIcone } from "./components/Icone";
import { LogoArvore } from "./components/LogoArvore";

type Rota =
  | { tela: "entrada" }
  | { tela: "painel" }
  | { tela: "inicio"; foco?: string }
  | { tela: "arbol"; secao: SecaoDoArbol; n: number }
  | { tela: "orientacoes" | "sobre" }
  | { tela: "editor"; editandoId?: string }
  | { tela: "mesa" | "colecao" | "arvore" | "registro"; sessaoId: string };

type Aba = { tela: "mesa" | "colecao" | "arvore" | "registro"; nome: string };

/** Sessões novas têm as quatro etapas; sessões antigas de Interpretar mantêm as duas que já tinham. */
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
    { tela: "arvore", nome: "Árvore" },
    { tela: "registro", nome: "Registro" },
  ];
}

/** Depois de recarregar a página, volta para a tela em que o professor estava. */
function rotaSalva(): Rota {
  try {
    const r = JSON.parse(sessionStorage.getItem("mesa-rota") ?? "null") as Rota | null;
    if (r && typeof r.tela === "string" && r.tela !== ("arbol" as string)) return r;
  } catch {
    /* ignora */
  }
  return { tela: "entrada" };
}

function irParaArbol(setRota: (r: Rota) => void, secao: SecaoDoArbol) {
  setRota({ tela: "arbol", secao, n: Date.now() });
}

export default function App() {
  const estado = useEstado();
  const biblioteca = useBiblioteca();
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
    rota.tela === "arvore" ||
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

  function comecar(atividade: Atividade, modo: Modo = "construir") {
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
    rota.tela === "painel"
      ? "Início"
      : rota.tela === "inicio"
        ? "Atividades"
        : rota.tela === "editor"
          ? rota.editandoId
            ? "Editar atividade"
            : "Nova atividade"
          : rota.tela === "orientacoes"
            ? "Orientações"
            : rota.tela === "sobre"
              ? "Sobre"
              : rota.tela === "arbol"
                ? "Árvore livre"
                : rota.tela === "entrada"
                  ? ""
                  : (abas.find((a) => a.tela === rota.tela)?.nome ?? "");

  const painel = () => setRota({ tela: "painel" });
  const secaoDoArbol = rota.tela === "arbol" ? rota.secao : undefined;
  const itens: { grupo: string; itens: { id: string; icone: NomeDeIcone; nome: string; ativo: boolean; ir: () => void; contador?: number }[] }[] = [
    {
      grupo: "",
      itens: [{ id: "painel", icone: "casa", nome: "Início", ativo: rota.tela === "painel", ir: painel }],
    },
    {
      grupo: "Atividades",
      itens: [
        {
          id: "atividades",
          icone: "figurinhas",
          nome: "Atividades",
          ativo: rota.tela === "inicio" || Boolean(sessao),
          ir: () => setRota({ tela: "inicio" }),
        },
        {
          id: "nova",
          icone: "mais",
          nome: "Nova atividade",
          ativo: rota.tela === "editor",
          ir: () => setRota({ tela: "editor" }),
        },
      ],
    },
    {
      grupo: "Árvore livre",
      itens: [
        { id: "criar", icone: "arvore", nome: "Criar uma árvore", ativo: secaoDoArbol === "criar", ir: () => irParaArbol(setRota, "criar") },
        { id: "exemplos", icone: "livro", nome: "Exemplos", ativo: secaoDoArbol === "exemplos", ir: () => irParaArbol(setRota, "exemplos") },
        {
          id: "biblioteca",
          icone: "abrir",
          nome: "Biblioteca",
          contador: biblioteca.length,
          ativo: secaoDoArbol === "biblioteca" || typeof secaoDoArbol === "object",
          ir: () => irParaArbol(setRota, "biblioteca"),
        },
        { id: "como", icone: "info", nome: "Como usar", ativo: secaoDoArbol === "instrucoes", ir: () => irParaArbol(setRota, "instrucoes") },
      ],
    },
    {
      grupo: "Para o professor",
      itens: [
        { id: "orient", icone: "professor", nome: "Orientações", ativo: rota.tela === "orientacoes", ir: () => setRota({ tela: "orientacoes" }) },
        { id: "sobre", icone: "ajuda", nome: "Sobre", ativo: rota.tela === "sobre", ir: () => setRota({ tela: "sobre" }) },
      ],
    },
  ];

  return (
    <div
      className={`app${rota.tela === "entrada" ? " app-entrada" : ""}${
        sessao ? " app-sessao" : ""
      }`}
    >
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>

      {rota.tela !== "entrada" && (
        <aside className="lateral nao-imprimir">
          <button className="marca" onClick={painel} title="Ir para o início" aria-label="Árvore de possibilidades — ir para o início">
            <LogoArvore tamanho={26} />
            <span>
              Árvore <em>de possibilidades</em>
            </span>
          </button>
          <nav className="lateral-menu" aria-label="Menu do programa">
            {itens.map((g, i) => (
              <div key={i} className="lateral-grupo">
                {g.grupo && <p className="lateral-titulo">{g.grupo}</p>}
                {g.itens.map((it) => (
                  <button key={it.id} className="lateral-item" aria-current={it.ativo ? "page" : undefined} onClick={it.ir}>
                    <Icone nome={it.icone} />
                    <span>{it.nome}</span>
                    {it.contador ? <span className="lateral-contador">{it.contador}</span> : null}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <p className="lateral-rodape">Dados só neste computador. Nada é enviado.</p>
        </aside>
      )}

      <div className="app-coluna">
        <header className="topo">
          <div className="topo-contexto">
            {sessao ? (
              <>
                <span className="topo-atividade">{sessao.atividade.titulo}</span>
                <span className="topo-sep" aria-hidden="true" />
                <span className="topo-aluno">{sessao.aluno || "sessão local"}</span>
              </>
            ) : (
              <span className="topo-atividade">{area}</span>
            )}
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
                  {aba.tela === "arvore" && Object.keys(sessao.marcas).length > 0 && (
                    <span className="aba-contador">{Object.keys(sessao.marcas).length}</span>
                  )}
                </button>
              ))}
            </nav>
          )}

          <div className="topo-acoes">
            {sessao && (
              <button className="botao" onClick={() => setRota({ tela: "inicio" })}>
                <Icone nome="voltar" />
                Atividades
              </button>
            )}
            {rota.tela === "editor" && (
              <button className="botao" onClick={() => setRota({ tela: "inicio" })}>
                <Icone nome="voltar" />
                Atividades
              </button>
            )}
          </div>
        </header>

        <div className="area">
          {rota.tela === "entrada" && (
            <Entrada
              aoEntrar={painel}
              aoOrientacoes={() => setRota({ tela: "orientacoes" })}
              aoSobre={() => setRota({ tela: "sobre" })}
            />
          )}

          {rota.tela === "painel" && (
            <Painel
              atividades={atividades}
              sessoes={estado.sessoes}
              arvores={biblioteca}
              aoAtividades={(foco) => setRota({ tela: "inicio", foco })}
              aoCriar={() => irParaArbol(setRota, "criar")}
              aoExemplos={() => irParaArbol(setRota, "exemplos")}
              aoAbrirSessao={(s) => setRota({ tela: "mesa", sessaoId: s.id })}
              aoAbrirArvore={(a) => irParaArbol(setRota, { ver: a.id })}
            />
          )}

          {rota.tela === "arbol" && <Arbol key={rota.n} secao={rota.secao} aoPainel={painel} />}

          {rota.tela === "inicio" && (
            <Inicio
              key={`${rota.foco ?? ""}`}
              foco={rota.foco}
              atividades={atividades}
              sessoes={estado.sessoes}
              aoComecar={(a) => comecar(a)}
              aoContinuar={(s) => setRota({ tela: "mesa", sessaoId: s.id })}
              aoNovaAtividade={() => setRota({ tela: "editor" })}
              aoEditar={(a) => setRota({ tela: "editor", editandoId: a.id })}
            />
          )}

          {rota.tela === "orientacoes" && <Orientacoes aoVoltar={painel} rotuloVoltar="Início" />}
          {rota.tela === "sobre" && <Sobre aoVoltar={painel} rotuloVoltar="Início" />}

          {rota.tela === "editor" && (
            <Editor
              key={rota.editandoId ?? "nova"}
              atividades={atividades}
              editando={atividades.find((a) => a.id === rota.editandoId)}
              aoTerminar={() => setRota({ tela: "inicio" })}
            />
          )}

          {(rota.tela === "mesa" || rota.tela === "colecao" || rota.tela === "arvore" || rota.tela === "registro") && !sessao && (
            <main className="tela" id="conteudo" tabIndex={-1}>
              <div className="vazio">
                <b>Esta sessão não está mais neste dispositivo.</b>
                Ela pode ter sido removida ou aberta em outro computador. Importe uma cópia em Atividades ou comece
                outra atividade.
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
            <Colecao sessao={sessao} aoIrParaMesa={() => setRota({ tela: "mesa", sessaoId: sessao.id })} />
          )}

          {sessao && rota.tela === "arvore" && <ArvoreCompleta key={sessao.id} sessao={sessao} />}

          {sessao && rota.tela === "registro" && (
            <Registro key={sessao.id} sessao={sessao} aoExcluirSessao={() => setRota({ tela: "inicio" })} />
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
    </div>
  );
}
