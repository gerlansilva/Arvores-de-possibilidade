import { EXEMPLOS } from "../data/exemplos-arbol";
import { urlAtividade, type Atividade } from "../data/activities";
import { SITUACOES, situacaoDaAtividade } from "../data/situacoes";
import type { Sessao } from "../state/store";
import type { ArvoreSalva } from "../state/arvores";
import { Icone, type NomeDeIcone } from "../components/Icone";
import { plural } from "../lib/texto";

type Props = {
  atividades: Atividade[];
  sessoes: Sessao[];
  arvores: ArvoreSalva[];
  aoAtividades: (situacao?: string) => void;
  aoCriar: () => void;
  aoExemplos: () => void;
  aoAbrirSessao: (s: Sessao) => void;
  aoAbrirArvore: (a: ArvoreSalva) => void;
};

function Acao({ icone, titulo, texto, onClick, destaque }: { icone: NomeDeIcone; titulo: string; texto: string; onClick: () => void; destaque?: boolean }) {
  return (
    <button className={`painel-acao${destaque ? " destaque" : ""}`} onClick={onClick}>
      <span className="painel-acao-icone"><Icone nome={icone} tamanho={26} /></span>
      <span className="painel-acao-titulo">{titulo}</span>
      <span className="painel-acao-texto">{texto}</span>
    </button>
  );
}

/** Início do programa: por onde começar, as quatro situações e o que está em andamento. */
export function Painel({ atividades, sessoes, arvores, aoAtividades, aoCriar, aoExemplos, aoAbrirSessao, aoAbrirArvore }: Props) {
  const recentes = [...sessoes]
    .filter((s) => s.montagens.length > 0 || Object.keys(s.marcas).length > 0)
    .sort((a, b) => Date.parse(b.atualizadaEm) - Date.parse(a.atualizadaEm))
    .slice(0, 4);
  const guardadas = [...arvores].sort((a, b) => b.atualizadaEm.localeCompare(a.atualizadaEm)).slice(0, 4);

  return (
    <main className="tela tela-painel" id="conteudo" tabIndex={-1}>
      <header className="painel-cabecalho">
        <h1>Árvore de possibilidades</h1>
        <p>Investigue todas as possibilidades de um problema: monte com figurinhas, veja a árvore completa e pinte de vermelho as que valem.</p>
      </header>

      <section className="painel-secao" aria-labelledby="p-comecar">
        <h2 id="p-comecar">Comece por aqui</h2>
        <div className="painel-acoes">
          <Acao destaque icone="figurinhas" titulo="Atividades com figurinhas" texto="Escolha um problema, monte as possibilidades e veja a árvore." onClick={() => aoAtividades()} />
          <Acao icone="arvore" titulo="Criar uma árvore" texto="Defina os níveis e os elementos do seu próprio problema." onClick={aoCriar} />
          <Acao icone="livro" titulo="Ver exemplos" texto="Problemas prontos das quatro situações, em árvore." onClick={aoExemplos} />
        </div>
      </section>

      <section className="painel-secao" aria-labelledby="p-situacoes">
        <h2 id="p-situacoes">As quatro situações</h2>
        <ul className="painel-situacoes">
          {SITUACOES.map((sit) => {
            const dela = atividades.filter((a) => situacaoDaAtividade(a) === sit.tipo);
            const exemplos = EXEMPLOS.filter((e) => e.tipo === sit.tipo).length;
            const figura = dela[0]?.convite.arquivo;
            return (
              <li key={sit.tipo}>
                <button className="painel-situacao" onClick={() => aoAtividades(sit.tipo)}>
                  <span className="painel-situacao-arte">
                    {figura ? <img src={urlAtividade(figura)} alt="" /> : <Icone nome="arvore" tamanho={30} />}
                  </span>
                  <span className="painel-situacao-titulo">{sit.titulo}</span>
                  <span className="painel-situacao-ideia">{sit.ideia}</span>
                  <span className="painel-situacao-meta">
                    {sit.formal} · {plural(dela.length, "atividade", "atividades")} · {plural(exemplos, "exemplo", "exemplos")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {(recentes.length > 0 || guardadas.length > 0) && (
        <section className="painel-secao" aria-labelledby="p-continuar">
          <h2 id="p-continuar">Continuar de onde parou</h2>
          <div className="painel-continuar">
            {recentes.length > 0 && (
              <ul aria-label="Sessões recentes">
                {recentes.map((s) => (
                  <li key={s.id}>
                    <button className="painel-item" onClick={() => aoAbrirSessao(s)}>
                      <Icone nome="figurinhas" />
                      <span>
                        <b>{s.atividade.titulo}</b>
                        <small>{s.aluno || "sem identificação"} · {plural(s.montagens.length, "montagem", "montagens")}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {guardadas.length > 0 && (
              <ul aria-label="Árvores guardadas">
                {guardadas.map((a) => (
                  <li key={a.id}>
                    <button className="painel-item" onClick={() => aoAbrirArvore(a)}>
                      <Icone nome="arvore" />
                      <span>
                        <b>{a.nome}</b>
                        <small>{plural(a.niveis.length, "nível", "níveis")} · {plural(a.marcadas.length, "caminho pintado", "caminhos pintados")}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
