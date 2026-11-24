import { Icone } from "../../components/Icone";
import { useState } from "react";
import { totalDeCaminhos } from "../../engine/arbol";
import type { ExemploDoArbol } from "../../data/exemplos-arbol";
import { SITUACOES } from "../../data/situacoes";
import { exportarJson, importarJson } from "../../lib/arquivo";
import { exportarBiblioteca, importarBiblioteca, type ArvoreSalva } from "../../state/arvores";

function descricao(niveis: { nome: string; elementos: string[] }[]): string {
  const partes = niveis.map((n) => `${n.nome} (${n.elementos.length})`).join(" × ");
  const total = totalDeCaminhos(niveis);
  return `${partes} = ${total} ${total === 1 ? "caminho" : "caminhos"}`;
}

type PropsExemplos = {
  exemplos: ExemploDoArbol[];
  aoAbrir: (exemplo: ExemploDoArbol) => void;
  aoVoltar: () => void;
};

/** "Vejo exemplos": os quatro tipos de problema, já montados. */
export function ArbolExemplos({ exemplos, aoAbrir, aoVoltar }: PropsExemplos) {
  return (
    <main className="tela tela-arbol-lista" id="conteudo" tabIndex={-1}>
      <header className="arbol-barra">
        <h1>Exemplos</h1>
        <div className="arbol-barra-acoes">
          <button className="botao" onClick={aoVoltar}>
            <Icone nome="casa" />
            Início
          </button>
        </div>
      </header>
      <p className="arbol-lista-ajuda">
        A árvore mostra todas as possibilidades; pinte as que valem. Os exemplos estão em quatro situações.
      </p>
      {SITUACOES.map((sit) => {
        const doTipo = exemplos.filter((e) => e.tipo === sit.tipo);
        if (doTipo.length === 0) return null;
        return (
          <section key={sit.tipo} className="arbol-situacao" aria-labelledby={`sit-${sit.tipo}`}>
            <h2 id={`sit-${sit.tipo}`}>{sit.titulo}</h2>
            <p className="arbol-situacao-ideia">{sit.ideia}</p>
            <ul className="arbol-cartoes">
              {doTipo.map((e) => (
                <li key={e.id} className="arbol-cartao">
                  <h3>{e.nome}</h3>
                  <p>{e.enunciado}</p>
                  <p className="arbol-niveis">{descricao(e.niveis)}</p>
                  <button className="botao primario" onClick={() => aoAbrir(e)} aria-label={`Abrir o exemplo ${e.nome}`}>
                    <Icone nome="play" />
                    Abrir
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}

type PropsBiblioteca = {
  arvores: ArvoreSalva[];
  aoAbrir: (arvore: ArvoreSalva) => void;
  aoVoltar: () => void;
};

/** "Recupero a biblioteca": as árvores que foram guardadas neste computador. */
export function ArbolBiblioteca({ arvores, aoAbrir, aoVoltar }: PropsBiblioteca) {
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function salvarArquivo() {
    setErro("");
    try {
      const nome = await exportarJson("biblioteca-de-arvores.json", exportarBiblioteca());
      setMensagem(nome ? `Biblioteca salva como ${nome}.` : "Cancelado.");
    } catch (falha) {
      setMensagem("");
      setErro(`Não foi possível salvar: ${String(falha)}`);
    }
  }

  async function abrirArquivo() {
    setErro("");
    try {
      const arquivo = await importarJson();
      if (!arquivo) {
        setMensagem("Cancelado.");
        return;
      }
      const r = importarBiblioteca(arquivo.texto);
      if (r.ok) setMensagem(r.mensagem);
      else {
        setMensagem("");
        setErro(r.mensagem);
      }
    } catch (falha) {
      setMensagem("");
      setErro(`Não foi possível abrir: ${String(falha)}`);
    }
  }

  return (
    <main className="tela tela-arbol-lista" id="conteudo" tabIndex={-1}>
      <header className="arbol-barra">
        <h1>Biblioteca</h1>
        <div className="arbol-barra-acoes">
          <button className="botao" onClick={salvarArquivo} disabled={arvores.length === 0}>
            Salvar em arquivo
          </button>
          <button className="botao" onClick={abrirArquivo}>
            Abrir arquivo
          </button>
          <button className="botao" onClick={aoVoltar}>
            Início
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
      {arvores.length === 0 ? (
        <p className="arbol-lista-ajuda">
          Ainda não há árvores guardadas. Crie uma em “Criar uma árvore” ou guarde um exemplo.
        </p>
      ) : (
        <ul className="arbol-cartoes">
          {arvores.map((a) => (
            <li key={a.id} className="arbol-cartao">
              <h2>{a.nome}</h2>
              <p className="arbol-niveis">{descricao(a.niveis)}</p>
              <p className="arbol-meta">
                {a.marcadas.length} {a.marcadas.length === 1 ? "pintada" : "pintadas"} de vermelho
              </p>
              <button className="botao primario" onClick={() => aoAbrir(a)} aria-label={`Abrir a árvore ${a.nome}`}>
                Abrir
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
