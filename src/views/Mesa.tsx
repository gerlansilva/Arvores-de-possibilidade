import { useEffect, useMemo, useRef, useState } from "react";
import {
  pecaDaAtividade,
  urlAtividade,
  type Atividade,
  type Peca,
} from "../data/activities";
import { estaCompleta, preenchidas, validar, type Escolhas } from "../engine/comb";
import { guardarMontagem, type Sessao } from "../state/store";
import { Montagem } from "../components/Montagem";
import { useArrastarPeca, type OrigemArrasto } from "../lib/arrastar";
import { Arvore } from "./Arvore";

type Props = {
  sessao: Sessao;
};

/** “Lugar da esquerda” vira “esquerda” em espaços estreitos, sem perder o nome completo. */
function rotuloCurto(rotulo: string): string {
  return rotulo.replace(/^Lugar d[aeo]s? /i, "").replace(/^Posição /i, "");
}

/** Todas as peças de escolha que aparecem em pelo menos um nível, sem repetir. */
function pecasDaMesa(atividade: Atividade): Peca[] {
  const vistas = new Set<string>();
  const lista: Peca[] = [];
  for (const slot of atividade.slots) {
    for (const id of slot.opcoes) {
      if (vistas.has(id)) continue;
      vistas.add(id);
      const peca = pecaDaAtividade(atividade, id);
      if (peca) lista.push(peca);
    }
  }
  return lista;
}

/** Rascunho por sessão: sobrevive à troca de aba sem entrar no armazenamento. */
const RASCUNHOS = new Map<string, Escolhas>();
const CHAVE_RASCUNHO = (id: string) => `mesa-rascunho:${id}`;

/** Lê o rascunho da memória ou, depois de recarregar a página, do sessionStorage. */
function lerRascunho(id: string): Escolhas {
  const guardado = RASCUNHOS.get(id);
  if (guardado) return guardado;
  try {
    const texto = sessionStorage.getItem(CHAVE_RASCUNHO(id));
    if (texto) return JSON.parse(texto) as Escolhas;
  } catch {
    /* sem armazenamento: começa vazio */
  }
  return {};
}

function gravarRascunho(id: string, escolhas: Escolhas): void {
  RASCUNHOS.set(id, escolhas);
  try {
    sessionStorage.setItem(CHAVE_RASCUNHO(id), JSON.stringify(escolhas));
  } catch {
    /* ignora */
  }
}

export function Mesa({ sessao }: Props) {
  const { atividade, montagens } = sessao;
  const [escolhas, setEscolhas] = useState<Escolhas>(
    () => lerRascunho(sessao.id),
  );
  const [recolhida, setRecolhida] = useState(false);
  const [slotAtivo, setSlotAtivo] = useState(atividade.slots[0].id);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [anuncio, setAnuncio] = useState("");
  const [historico, setHistorico] = useState<Escolhas[]>([]);
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);
  const pecasRef = useRef<HTMLHeadingElement>(null);

  const pecas = useMemo(() => pecasDaMesa(atividade), [atividade]);
  const completa = estaCompleta(atividade, escolhas);
  const totalPreenchido = preenchidas(atividade, escolhas);

  useEffect(() => {
    gravarRascunho(sessao.id, escolhas);
  }, [sessao.id, escolhas]);

  const pecaSelecionada = pecaDaAtividade(atividade, selecionada ?? undefined);
  const slotDaSelecionada = selecionada
    ? atividade.slots.find((slot) => escolhas[slot.id] === selecionada)
    : undefined;

  function registrarHistorico() {
    setHistorico((atual) => [...atual.slice(-19), escolhas]);
  }

  function limpar() {
    setEscolhas({});
    setSlotAtivo(atividade.slots[0].id);
    setSelecionada(null);
    setErro("");
    setMensagem("");
    setHistorico([]);
    setConfirmandoLimpeza(false);
    setAnuncio("Montagem limpa.");
    pecasRef.current?.focus();
  }

  function desfazer() {
    const anterior = historico[historico.length - 1];
    if (!anterior) return;
    setHistorico(historico.slice(0, -1));
    setEscolhas(anterior);
    setSelecionada(null);
    manterSlotAtivoSeguro();
    setErro("");
    setMensagem("");
    setConfirmandoLimpeza(false);
    setAnuncio("Última ação desfeita.");
    pecasRef.current?.focus();
  }

  function manterSlotAtivoSeguro() {
    setSlotAtivo((atual) =>
      atividade.slots.some((s) => s.id === atual) ? atual : atividade.slots[0].id,
    );
  }

  function remover(slotId: string) {
    registrarHistorico();
    setEscolhas((atuais) => {
      const proximas = { ...atuais };
      delete proximas[slotId];
      return proximas;
    });
    setSlotAtivo(slotId);
    setSelecionada(null);
    setErro("");
    setMensagem("");
    const retirada = pecaDaAtividade(atividade, escolhas[slotId]);
    const numero = atividade.slots.findIndex((s) => s.id === slotId) + 1;
    const rotuloSlot =
      atividade.slots.find((s) => s.id === slotId)?.rotulo.toLowerCase() ?? "nível";
    setAnuncio(
      retirada
        ? `${retirada.nome} saiu do nível ${numero}, ${rotuloSlot}.`
        : "Peça retirada.",
    );
    pecasRef.current?.focus();
  }

  function colocar(pecaId: string, slotId: string) {
    const slot = atividade.slots.find((s) => s.id === slotId);
    if (!slot) return;

    if (!slot.opcoes.includes(pecaId)) {
      const peca = pecaDaAtividade(atividade, pecaId);
      setErro(`${peca?.nome ?? "Essa peça"} não entra em ${slot.rotulo.toLowerCase()}.`);
      setMensagem("");
      return;
    }

    const veioDoNivelVazio = document.activeElement instanceof HTMLElement && document.activeElement.matches("button[data-slot]");
    const proximas = { ...escolhas };
    let saiuDe: string | undefined;
    if (atividade.repeticao !== "livre") {
      for (const outro of atividade.slots) {
        if (outro.id !== slotId && proximas[outro.id] === pecaId) {
          delete proximas[outro.id];
          saiuDe = outro.rotulo;
        }
      }
    }
    proximas[slotId] = pecaId;

    const peca = pecaDaAtividade(atividade, pecaId);
    registrarHistorico();
    setEscolhas(proximas);
    setSelecionada(null);
    setErro("");
    setConfirmandoLimpeza(false);
    setMensagem(
      saiuDe
        ? `${peca?.nome ?? "A peça"} saiu de ${saiuDe.toLowerCase()} e foi para ${slot.rotulo.toLowerCase()}.`
        : "",
    );
    const numero = atividade.slots.findIndex((s) => s.id === slotId) + 1;
    setAnuncio(
      saiuDe
        ? `${peca?.nome ?? "A peça"} foi para o nível ${numero}, ${slot.rotulo.toLowerCase()}; saiu de ${saiuDe.toLowerCase()}.`
        : `${peca?.nome ?? "Peça"} no nível ${numero}, ${slot.rotulo.toLowerCase()}.`,
    );

    const vazio = atividade.slots.find((s) => !proximas[s.id]);
    setSlotAtivo(vazio?.id ?? slotId);
    if (veioDoNivelVazio) {
      // O círculo vazio vira a peça colocada: devolve o foco ao novo elemento.
      window.setTimeout(() => {
        document.querySelector<HTMLElement>(`[data-nivel="${numero - 1}"][data-preenchido="sim"]`)?.focus();
      }, 0);
    }
  }

  function clicarNivel(slotId: string) {
    setErro("");
    setMensagem("");
    if (selecionada) {
      const origemId = atividade.slots.find((s) => escolhas[s.id] === selecionada)?.id;
      if (origemId && origemId !== slotId && trocarSePossivel(selecionada, slotId, origemId)) {
        return;
      }
      colocar(selecionada, slotId);
      return;
    }
    const atual = escolhas[slotId];
    setSlotAtivo(slotId);
    if (atual) setSelecionada(atual);
  }

  function trocarSePossivel(pecaId: string, destinoId: string, origemId: string): boolean {
    const destino = atividade.slots.find((s) => s.id === destinoId);
    const origem = atividade.slots.find((s) => s.id === origemId);
    const pecaDestino = escolhas[destinoId];
    if (!destino || !origem || !pecaDestino || pecaDestino === pecaId) return false;
    if (!destino.opcoes.includes(pecaId) || !origem.opcoes.includes(pecaDestino)) {
      return false;
    }
    registrarHistorico();
    setEscolhas({
      ...escolhas,
      [destinoId]: pecaId,
      [origemId]: pecaDestino,
    });
    setSelecionada(null);
    setErro("");
    setMensagem("");
    setConfirmandoLimpeza(false);
    const numeroDestino = atividade.slots.findIndex((s) => s.id === destinoId) + 1;
    const numeroOrigem = atividade.slots.findIndex((s) => s.id === origemId) + 1;
    setAnuncio(
      `${pecaDaAtividade(atividade, pecaId)?.nome ?? "A peça"} foi para o nível ${numeroDestino} e ${
        pecaDaAtividade(atividade, pecaDestino)?.nome ?? "a outra peça"
      } foi para o nível ${numeroOrigem}.`,
    );
    setSlotAtivo(destinoId);
    return true;
  }

  function clicarPeca(
    pecaId: string,
    origem: OrigemArrasto,
    slotOrigem?: string,
  ) {
    if (origem === "paleta") {
      setErro("");
      setMensagem("");
      setSelecionada((atual) => (atual === pecaId ? null : pecaId));
      const destino =
        atividade.slots.find((s) => s.opcoes.includes(pecaId) && !escolhas[s.id]) ??
        atividade.slots.find((s) => s.opcoes.includes(pecaId));
      if (destino) setSlotAtivo(destino.id);
      return;
    }

    if (!slotOrigem) return;
    if (selecionada && selecionada !== pecaId) {
      const origemSelecionada = atividade.slots.find(
        (s) => escolhas[s.id] === selecionada,
      )?.id;
      if (
        origemSelecionada &&
        trocarSePossivel(selecionada, slotOrigem, origemSelecionada)
      ) {
        return;
      }
      colocar(selecionada, slotOrigem);
      return;
    }
    setSlotAtivo(slotOrigem);
    setSelecionada((atual) => (atual === pecaId ? null : pecaId));
    setErro("");
    setMensagem("");
  }

  const { arrasto, slotSobre, pegar } = useArrastarPeca({
    aoSoltar: (pecaId, slotId, origem, slotOrigem) => {
      if (slotId === slotOrigem) {
        clicarPeca(pecaId, origem, slotOrigem);
        return;
      }
      if (slotOrigem && trocarSePossivel(pecaId, slotId, slotOrigem)) return;
      colocar(pecaId, slotId);
    },
    aoClicar: clicarPeca,
    aoCancelar: () => {
      setMensagem("");
    },
  });

  const pecaNaMao = arrasto?.pecaId ?? selecionada;
  const pecaFantasma = pecaDaAtividade(atividade, arrasto?.pecaId);

  function guardar() {
    const veredito = validar(atividade, escolhas);
    if (!veredito.ok) {
      setErro(veredito.motivo);
      setMensagem("");
      return;
    }
    guardarMontagem(sessao.id, escolhas);
    setMensagem(`Montagem ${montagens.length + 1} guardada na árvore.`);
    setErro("");
    setEscolhas({});
    setSlotAtivo(atividade.slots[0].id);
    setSelecionada(null);
    setHistorico([]);
    setConfirmandoLimpeza(false);
    setAnuncio(`Montagem ${montagens.length + 1} guardada.`);
    pecasRef.current?.focus();
  }

  const desfazerRef = useRef(desfazer);
  desfazerRef.current = desfazer;
  const guardarRef = useRef(guardar);
  guardarRef.current = guardar;
  const completaRef = useRef(completa);
  completaRef.current = completa;

  useEffect(() => {
    function atalho(evento: KeyboardEvent) {
      if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === "z") {
        evento.preventDefault();
        desfazerRef.current();
        return;
      }
      if ((evento.metaKey || evento.ctrlKey) && evento.key === "Enter") {
        if (!completaRef.current) return;
        evento.preventDefault();
        guardarRef.current();
        return;
      }
      if (evento.key === "Escape") {
        setSelecionada(null);
        setConfirmandoLimpeza(false);
      }
    }
    window.addEventListener("keydown", atalho);
    return () => window.removeEventListener("keydown", atalho);
  }, []);

  return (
    <main className="tela tela-mesa" id="conteudo" tabIndex={-1}>
      <h1 className="sr-only">{atividade.titulo}</h1>
      <p className="sr-only" role="status" aria-live="polite">
        {anuncio}
      </p>

      <div className="mesa-arvore">
        <Arvore sessao={sessao} embutida aoAmpliar={() => setRecolhida(true)} ampliada={recolhida} />
      </div>

      <section className="bancada" aria-label="Bancada de montagem" data-recolhida={recolhida}>
        <div className="bancada-topo">
          <p className="enunciado">{atividade.enunciado}</p>
          <button
            className="botao discreto bancada-alternar"
            aria-expanded={!recolhida}
            onClick={() => setRecolhida((r) => !r)}
            title={recolhida ? "Voltar a montar" : "Dar mais espaço à árvore"}
          >
            {recolhida ? "Mostrar bancada" : "Ampliar árvore"}
          </button>
        </div>

        <div className="bancada-corpo" hidden={recolhida}>
          <div className="bancada-pecas">
            <h2 className="sr-only" ref={pecasRef} tabIndex={-1}>
              Peças
            </h2>
            <div className="pecas-grade">
              {pecas.map((peca) => {
                const emUso = atividade.slots.some((s) => escolhas[s.id] === peca.id);
                return (
                  <button
                    key={peca.id}
                    className="cartao-peca"
                    aria-pressed={selecionada === peca.id}
                    data-em-uso={emUso ? "sim" : undefined}
                    title={`${peca.nome} · arraste para a montagem`}
                    onPointerDown={(evento) => pegar(evento, peca.id, "paleta")}
                    onClick={(evento) => {
                      if (evento.detail === 0) clicarPeca(peca.id, "paleta");
                    }}
                  >
                    <img src={urlAtividade(peca.arquivo)} alt="" draggable={false} />
                    <span>{peca.nome}</span>
                    {emUso && <span className="peca-em-uso">em uso</span>}
                  </button>
                );
              })}
            </div>
            {pecaSelecionada && slotDaSelecionada && (
              <button
                className="botao texto botao-tirar"
                onClick={() => remover(slotDaSelecionada.id)}
              >
                Tirar {pecaSelecionada.nome}
              </button>
            )}
          </div>

          <div className="bancada-montagem">
            <div className="abas-niveis" role="group" aria-label="Níveis da montagem">
              {atividade.slots.map((s, i) => {
                const escolhida = escolhas[s.id];
                const compativel = pecaNaMao ? s.opcoes.includes(pecaNaMao) : true;
                return (
                  <button
                    key={s.id}
                    aria-pressed={slotAtivo === s.id}
                    className="aba-nivel"
                    data-slot={s.id}
                    data-compativel={pecaNaMao ? (compativel ? "sim" : "nao") : undefined}
                    data-sobre={slotSobre === s.id ? "sim" : undefined}
                    onClick={() => clicarNivel(s.id)}
                    title={s.rotulo}
                  >
                    <span className="aba-nivel-n">{i + 1}</span>
                    <span className="aba-nivel-rotulo">{rotuloCurto(s.rotulo)}</span>
                    {escolhida ? (
                      <>
                        <span className="aba-nivel-ok" aria-hidden="true">
                          ✓
                        </span>
                        <span className="sr-only">escolhido</span>
                      </>
                    ) : (
                      <>
                        <span className="aba-nivel-vazio" aria-hidden="true" />
                        <span className="sr-only">vazio</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="cena-montagem" data-vazia={totalPreenchido === 0}>
              <Montagem
                atividade={atividade}
                escolhas={escolhas}
                interativo
                pecaArrastada={arrasto?.pecaId ?? null}
                slotSobre={slotSobre}
                aoClicarSlot={clicarNivel}
                aoPegarSlot={(slotId, evento) => {
                  const pecaId = escolhas[slotId];
                  if (pecaId) pegar(evento, pecaId, "slot", slotId);
                }}
              />
              {totalPreenchido === 0 && (
                <p className="cena-dica">Arraste uma peça para um nível.</p>
              )}
            </div>

            <div className="bancada-acoes">
              <span id="mesa-status" className="bancada-aviso" aria-live="polite">
                {erro ? (
                  <span className="aviso">{erro}</span>
                ) : mensagem ? (
                  <span className="sucesso">{mensagem}</span>
                ) : totalPreenchido > 0 && !completa ? (
                  <span>
                    Falta:{" "}
                    {atividade.slots
                      .filter((s) => !escolhas[s.id])
                      .map((s) => s.rotulo)
                      .join(", ")}
                  </span>
                ) : null}
              </span>
              <div className="acoes-montagem">
                {historico.length > 0 && (
                  <button
                    className="botao discreto"
                    onClick={desfazer}
                    title="Desfazer a última ação (⌘Z)"
                  >
                    Desfazer
                  </button>
                )}
                {totalPreenchido > 0 &&
                  (confirmandoLimpeza ? (
                    <>
                      <button className="botao perigo" onClick={limpar} autoFocus>
                        Limpar tudo
                      </button>
                      <button
                        className="botao discreto"
                        onClick={() => setConfirmandoLimpeza(false)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button className="botao" onClick={() => setConfirmandoLimpeza(true)}>
                      Limpar
                    </button>
                  ))}
                <button className="botao primario" onClick={guardar} disabled={!completa}>
                  Guardar montagem
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {arrasto && pecaFantasma && (
        <img
          className="peca-fantasma"
          src={urlAtividade(pecaFantasma.arquivo)}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{ left: arrasto.x, top: arrasto.y }}
        />
      )}
    </main>
  );
}
