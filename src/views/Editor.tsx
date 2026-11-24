import { useMemo, useState } from "react";
import {
  ATIVIDADES,
  urlAtividade,
  type Atividade,
  type Equivalencia,
  type Peca,
  type Repeticao,
} from "../data/activities";
import { resultadosDistintos, resumoDaAtividade } from "../engine/comb";
import { removerAtividade, salvarAtividade } from "../state/store";
import { Montagem } from "../components/Montagem";
import { ComparaRegras } from "../components/ComparaRegras";
import { plural } from "../lib/texto";
import extras from "../data/figuras-extras.json";

type Props = {
  atividades: Atividade[];
  /** Atividade do professor que está sendo editada (mantém o mesmo id). */
  editando?: Atividade;
  aoTerminar: () => void;
};

type ItemDaBiblioteca = { id: string; nome: string; arquivo: string; origem: string };
const TEMAS_EXTRAS: Record<string, string> = {
  formas: "Formas",
  cores: "Balões coloridos",
  pizza: "Pizzas",
  brinquedos: "Brinquedos",
  transportes: "Transportes",
  dados: "Dados",
  clima: "Tempo",
  flores: "Flores",
  bebidas: "Bebidas",
};
const FIGURAS_EXTRAS: ItemDaBiblioteca[] = extras.map((f) => ({
  id: `extras__${f.id}`,
  nome: f.nome,
  arquivo: f.arquivo,
  origem: TEMAS_EXTRAS[f.tema] ?? f.tema,
}));
type Nivel = { rotulo: string; opcoes: string[] };

/** Acima disso o modo Interpretar não desenha a árvore inteira. */
const LIMITE_DE_CAMINHOS = 300;
const LIMITE_PARA_CALCULAR = 5000;

const REPETICOES: { valor: Repeticao; texto: string }[] = [
  { valor: "livre", texto: "A mesma peça pode aparecer mais de uma vez no mesmo caso" },
  { valor: "sem-repeticao", texto: "Nenhuma peça se repete no mesmo caso" },
  { valor: "cada-uma-vez", texto: "Todas as peças são usadas, cada uma uma vez" },
];

const EQUIVALENCIAS: { valor: Equivalencia; texto: string }[] = [
  { valor: "ordenada", texto: "A ordem muda o resultado: trocar de lugar é outro caso" },
  { valor: "sem-ordem", texto: "A ordem não muda o resultado: trocar de lugar é o mesmo caso" },
];

/** Perguntas de mediação que dependem da regra, não só do tema. */
function perguntasPadrao(equivalencia: Equivalencia, repeticao: Repeticao): string[] {
  const perguntas = ["O que você já fez?", "Como você pode conferir se falta algum caso?"];
  perguntas.push(
    equivalencia === "ordenada"
      ? "O que muda quando você troca a ordem?"
      : "Trocar a ordem muda o resultado? Por quê?",
  );
  perguntas.push(
    repeticao === "livre"
      ? "Uma mesma peça pode aparecer de novo? Em quais casos?"
      : repeticao === "cada-uma-vez"
        ? "Todas as peças foram usadas? Alguma ficou de fora?"
        : "Alguma peça se repetiu? Isso é permitido aqui?",
  );
  return perguntas;
}

function nivelVazio(i: number): Nivel {
  return { rotulo: `Escolha ${i + 1}`, opcoes: [] };
}

/**
 * Editor do professor: o mesmo problema vale para os dois módulos. Construir e
 * Interpretar leem níveis, peças e regras desta atividade; o total é calculado
 * aqui para o professor conferir antes de usar com a turma.
 */
export function Editor({ atividades, editando, aoTerminar }: Props) {
  const [baseId, setBaseId] = useState("");
  const [titulo, setTitulo] = useState(editando?.titulo ?? "");
  const [enunciado, setEnunciado] = useState(editando?.enunciado ?? "");
  const [niveis, setNiveis] = useState<Nivel[]>(
    editando
      ? editando.slots.map((s) => ({ rotulo: s.rotulo, opcoes: [...s.opcoes] }))
      : [nivelVazio(0), nivelVazio(1)],
  );
  const [escolhidas, setEscolhidas] = useState<string[]>(
    editando ? [...new Set(editando.slots.flatMap((s) => s.opcoes))] : [],
  );
  const [repeticao, setRepeticao] = useState<Repeticao>(editando?.repeticao ?? "livre");
  const [equivalencia, setEquivalencia] = useState<Equivalencia>(editando?.equivalencia ?? "ordenada");
  const [erro, setErro] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  const base = baseId ? atividades.find((a) => a.id === baseId) : undefined;

  const biblioteca = useMemo<ItemDaBiblioteca[]>(() => {
    if (base) {
      return base.pecas
        .filter((p) => p.papel === "escolha")
        .map((p) => ({ id: p.id, nome: p.nome, arquivo: p.arquivo, origem: base.titulo }));
    }
    const proprias: ItemDaBiblioteca[] = (editando?.pecas ?? [])
      .filter((p) => p.papel === "escolha")
      .map((p) => ({ id: p.id, nome: p.nome, arquivo: p.arquivo, origem: "Desta atividade" }));
    const demais = [
      ...ATIVIDADES.flatMap((a) =>
        a.pecas
          .filter((p) => p.papel === "escolha")
          .map((p) => ({ id: `${a.id}__${p.id}`, nome: p.nome, arquivo: p.arquivo, origem: a.titulo })),
      ),
      ...FIGURAS_EXTRAS,
    ].filter((i) => !proprias.some((p) => p.id === i.id));
    return [...proprias, ...demais];
  }, [base, editando]);

  const grupos = useMemo(() => {
    const mapa = new Map<string, ItemDaBiblioteca[]>();
    for (const item of biblioteca) mapa.set(item.origem, [...(mapa.get(item.origem) ?? []), item]);
    return [...mapa.entries()];
  }, [biblioteca]);

  const nomeDaPeca = (id: string) => biblioteca.find((p) => p.id === id)?.nome ?? id;

  function escolherBase(id: string) {
    setBaseId(id);
    setErro("");
    const origem = id ? atividades.find((a) => a.id === id) : undefined;
    if (!origem) {
      setTitulo("");
      setEnunciado("");
      setNiveis([nivelVazio(0), nivelVazio(1)]);
      setEscolhidas([]);
      setRepeticao("livre");
      setEquivalencia("ordenada");
      return;
    }
    setTitulo(`${origem.titulo} (variação)`);
    setEnunciado(origem.enunciado);
    setNiveis(origem.slots.map((s) => ({ rotulo: s.rotulo, opcoes: [...s.opcoes] })));
    setEscolhidas([...new Set(origem.slots.flatMap((s) => s.opcoes))]);
    setRepeticao(origem.repeticao);
    setEquivalencia(origem.equivalencia);
  }

  function alternarPeca(id: string) {
    const tem = escolhidas.includes(id);
    setEscolhidas(tem ? escolhidas.filter((x) => x !== id) : [...escolhidas, id]);
    setNiveis((atuais) =>
      atuais.map((n) => ({
        ...n,
        opcoes: tem ? n.opcoes.filter((o) => o !== id) : [...n.opcoes, id],
      })),
    );
  }

  function alternarNoNivel(indice: number, id: string) {
    setNiveis((atuais) =>
      atuais.map((n, i) =>
        i !== indice
          ? n
          : { ...n, opcoes: n.opcoes.includes(id) ? n.opcoes.filter((o) => o !== id) : [...n.opcoes, id] },
      ),
    );
  }

  function mudarRotulo(indice: number, rotulo: string) {
    setNiveis((atuais) => atuais.map((n, i) => (i === indice ? { ...n, rotulo } : n)));
  }

  const podeMudarNiveis = !base;

  const rascunho = useMemo<Atividade>(() => {
    const pecasDaBase: Peca[] = base
      ? base.pecas
      : biblioteca.map((b) => ({ id: b.id, nome: b.nome, arquivo: b.arquivo, papel: "escolha" as const }));
    const fixas = !base && editando ? editando.pecas.filter((p) => p.papel === "suporte-fixo") : [];
    const pecas = [
      ...fixas,
      ...pecasDaBase.filter((p) => p.papel === "suporte-fixo" || escolhidas.includes(p.id)),
    ];
    const primeira = pecas.find((p) => p.papel === "escolha");
    return {
      id: "rascunho",
      versao: 1,
      titulo: titulo.trim() || "Nova atividade",
      enunciado: enunciado.trim(),
      convite: primeira
        ? { arquivo: primeira.arquivo, alt: primeira.nome }
        : { arquivo: base?.convite.arquivo ?? "", alt: "" },
      pecas,
      slots: niveis.map((n, i) => ({
        id: `n${i + 1}`,
        rotulo: n.rotulo.trim() || `Escolha ${i + 1}`,
        opcoes: n.opcoes.filter((o) => escolhidas.includes(o)),
      })),
      repeticao,
      equivalencia,
      composicao: (base ?? editando)?.composicao ?? "fila",
      suporteId: (base ?? editando)?.suporteId,
      perguntas: perguntasPadrao(equivalencia, repeticao),
    };
  }, [base, editando, biblioteca, escolhidas, niveis, titulo, enunciado, repeticao, equivalencia]);

  const completo = rascunho.slots.every((s) => s.opcoes.length > 0);
  const produto = rascunho.slots.reduce((total, s) => total * Math.max(s.opcoes.length, 1), 1);
  const calculavel = completo && produto <= LIMITE_PARA_CALCULAR;
  const resumo = useMemo(() => (calculavel ? resumoDaAtividade(rascunho) : null), [calculavel, rascunho]);
  const exemplos = useMemo(
    () => (calculavel ? [...resultadosDistintos(rascunho).values()].slice(0, 2) : []),
    [calculavel, rascunho],
  );

  const pronto = Boolean(titulo.trim() && enunciado.trim() && completo && resumo && resumo.validos > 0);

  function salvar() {
    if (!titulo.trim() || !enunciado.trim()) {
      setErro("Escreva o título e o enunciado.");
      return;
    }
    if (!completo) {
      setErro("Cada nível precisa de pelo menos uma peça.");
      return;
    }
    if (!resumo || resumo.validos === 0) {
      setErro("Nenhum caminho segue a regra. Confira as peças, os níveis e as regras.");
      return;
    }
    const atividade: Atividade = {
      ...rascunho,
      id: editando
        ? editando.id
        : `prof-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      versao: editando ? (editando.versao ?? 1) + 1 : rascunho.versao,
    };
    salvarAtividade(atividade);
    aoTerminar();
  }

  return (
    <main className="tela tela-editor" id="conteudo" tabIndex={-1}>
      <header className="barra-ferramentas">
        <div>
          <h1>{editando ? "Editar atividade" : "Nova atividade"}</h1>
          <p>O problema vale para os dois módulos: Construir e Interpretar.</p>
        </div>
        <div className="acoes">
          {editando &&
            (excluindo ? (
              <span role="group" aria-label="Confirmar exclusão da atividade">
                Excluir esta atividade? As sessões já feitas continuam.{" "}
                <button
                  className="botao"
                  onClick={() => {
                    removerAtividade(editando.id);
                    aoTerminar();
                  }}
                >
                  Sim, excluir
                </button>{" "}
                <button className="botao" autoFocus onClick={() => setExcluindo(false)}>
                  Manter
                </button>
              </span>
            ) : (
              <button className="botao" onClick={() => setExcluindo(true)}>
                Excluir atividade
              </button>
            ))}
          <button className="botao" onClick={aoTerminar}>
            Cancelar
          </button>
          <button className="botao primario" onClick={salvar} aria-disabled={!pronto}>
            {editando ? "Salvar alterações" : "Salvar atividade"}
          </button>
        </div>
      </header>

      <div className="editor-grade">
        <div className="editor-form">
          {!editando && (
          <section className="editor-secao">
            <label>
              <span className="rotulo-campo">Começar de</span>
              <select
                className="campo"
                value={baseId}
                onChange={(e) => escolherBase(e.target.value)}
              >
                <option value="">Atividade em branco (todas as figurinhas)</option>
                {atividades.map((a) => (
                  <option key={a.id} value={a.id}>
                    Variar “{a.titulo}”
                  </option>
                ))}
              </select>
            </label>
            {base && (
              <p className="campo-nota">
                Uma variação mantém o desenho e o número de níveis da atividade original.
              </p>
            )}
          </section>
          )}

          <section className="editor-secao">
            <label>
              <span className="rotulo-campo">Título</span>
              <input
                className="campo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex.: Fotografia da turma"
                maxLength={80}
              />
            </label>
            <label>
              <span className="rotulo-campo">Enunciado</span>
              <textarea
                className="campo"
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                placeholder="O que a criança deve descobrir, com as regras escritas no texto."
                maxLength={400}
              />
            </label>
          </section>

          <section className="editor-secao">
            <h2>Elementos</h2>
            <p className="campo-nota">Marque as figurinhas que entram no problema.</p>
            {grupos.map(([origem, itens]) => (
              <div key={origem} className="editor-grupo">
                <h3>{origem}</h3>
                <div className="editor-pecas">
                  {itens.map((item) => (
                    <button
                      key={item.id}
                      className="editor-peca"
                      aria-pressed={escolhidas.includes(item.id)}
                      onClick={() => alternarPeca(item.id)}
                    >
                      <img src={urlAtividade(item.arquivo)} alt="" draggable={false} />
                      <span>{item.nome}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="editor-secao">
            <h2>Níveis</h2>
            <p className="campo-nota">
              Cada nível é uma escolha que a criança faz, na ordem em que aparece na árvore.
            </p>
            {niveis.map((nivel, i) => (
              <div key={i} className="editor-nivel">
                <label>
                  <span className="rotulo-campo">Nível {i + 1}</span>
                  <input
                    className="campo"
                    value={nivel.rotulo}
                    onChange={(e) => mudarRotulo(i, e.target.value)}
                  />
                </label>
                <div className="editor-opcoes" role="group" aria-label={`Peças do nível ${i + 1}`}>
                  {escolhidas.length === 0 ? (
                    <span className="campo-nota">Marque elementos acima.</span>
                  ) : (
                    escolhidas.map((id) => (
                      <button
                        key={id}
                        className="editor-opcao"
                        aria-pressed={nivel.opcoes.includes(id)}
                        onClick={() => alternarNoNivel(i, id)}
                      >
                        {nomeDaPeca(id)}
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))}
            {podeMudarNiveis && (
              <div className="editor-niveis-acoes">
                <button
                  className="botao"
                  onClick={() => setNiveis((n) => [...n, { ...nivelVazio(n.length), opcoes: [...escolhidas] }])}
                  disabled={niveis.length >= 4}
                >
                  Adicionar nível
                </button>
                <button
                  className="botao discreto"
                  onClick={() => setNiveis((n) => n.slice(0, -1))}
                  disabled={niveis.length <= 2}
                >
                  Remover o último
                </button>
              </div>
            )}
          </section>

          <section className="editor-secao">
            <h2>Regras</h2>
            <fieldset className="editor-regra">
              <legend className="rotulo-campo">Repetição</legend>
              {REPETICOES.map((r) => (
                <label key={r.valor} className="editor-radio">
                  <input
                    type="radio"
                    name="repeticao"
                    checked={repeticao === r.valor}
                    onChange={() => setRepeticao(r.valor)}
                  />
                  <span>{r.texto}</span>
                </label>
              ))}
            </fieldset>
            <fieldset className="editor-regra">
              <legend className="rotulo-campo">Ordem</legend>
              {EQUIVALENCIAS.map((r) => (
                <label key={r.valor} className="editor-radio">
                  <input
                    type="radio"
                    name="equivalencia"
                    checked={equivalencia === r.valor}
                    onChange={() => setEquivalencia(r.valor)}
                  />
                  <span>{r.texto}</span>
                </label>
              ))}
            </fieldset>
          </section>
        </div>

        <aside className="editor-resumo" aria-label="Conferência da atividade" aria-live="polite">
          <h2>O que a regra produz</h2>
          {!completo ? (
            <p>Cada nível precisa de pelo menos uma peça para calcular os caminhos.</p>
          ) : !resumo ? (
            <p>
              São {produto} caminhos: demais para calcular aqui. Use menos peças ou menos níveis.
            </p>
          ) : (
            <>
              <dl className="editor-numeros">
                <div>
                  <dt>Caminhos na árvore completa</dt>
                  <dd>{resumo.total}</dd>
                </div>
                <div>
                  <dt>Seguem a regra</dt>
                  <dd>{resumo.validos}</dd>
                </div>
                <div>
                  <dt>Casos diferentes</dt>
                  <dd>{resumo.distintos}</dd>
                </div>
              </dl>
              {resumo.validos === 0 && (
                <p className="aviso">
                  Nenhum caminho segue esta regra. Confira se há peças suficientes para os níveis.
                </p>
              )}
              {resumo.total > LIMITE_DE_CAMINHOS && (
                <p className="aviso">
                  Com {resumo.total} caminhos, o modo Interpretar não desenha a árvore inteira. O
                  modo Construir continua funcionando.
                </p>
              )}
              {exemplos.length > 0 && (
                <>
                  <h3>
                    {plural(exemplos.length, "exemplo", "exemplos")} para conferir
                  </h3>
                  <div className="editor-exemplos">
                    {exemplos.map((escolhas, i) => (
                      <Montagem key={i} atividade={rascunho} escolhas={escolhas} tamanho="m" />
                    ))}
                  </div>
                </>
              )}
              <ComparaRegras atividade={rascunho} />
              <h3>Perguntas para a mediação</h3>
              <ul className="editor-perguntas">
                {rascunho.perguntas.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </>
          )}
          {erro && (
            <p className="aviso" role="alert">
              {erro}
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
