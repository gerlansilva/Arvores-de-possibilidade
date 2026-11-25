# Estudo de paleta — Quantos Jeitos

Cinco paletas testadas no próprio programa (telas reais de abertura, atividades e Interpretar), com contraste calculado e simulação de daltonismo. As figurinhas não mudam: têm contorno marrom-escuro e cores quentes, então o fundo precisa ser neutro e deixá-las saltar.

## As cinco paletas
- **A · Folha e terra (atual)**: Verde-folha para ação e acerto, marrom de tronco para os ramos.
- **B · Tinta e fruta**: Azul de caneta de caderno para ação; laranja de fruta nos ramos; verde só para 'vale'.
- **C · Grafite e limão**: Neutro frio quase sem cor, deixa as figurinhas saltarem; limão só nos acertos.
- **D · Ameixa e caramelo**: Roxo-ameixa para ação, caramelo nos ramos, verde-musgo nos acertos.
- **E · Mar e coral**: Verde-azulado profundo para ação, coral nos ramos, menta nos acertos.

## Cores por papel
| Papel | A | B | C | D | E |
|---|---|---|---|---|---|
| Fundo | #f3f8f0 | #f6f8fb | #f4f5f6 | #f8f5f9 | #f1f8f8 |
| Texto | #223d36 | #1b2a41 | #1e2124 | #2a1f33 | #0f2f35 |
| Ação (botões) | #205947 | #1f4e8c | #2a2f35 | #5a2d6e | #0f5c66 |
| Ramos | #a9794a | #cb6b1d | #6c747c | #b9782e | #d4572e |
| Acerto ('vale') | #5a9b4e | #2f8f5b | #5f9c1e | #3f8a50 | #2f9a74 |
| Erro ('não vale') | #a33a2a | #a33a2a | #a33a2a | #a33a2a | #a33a2a |

## Medidas
| Medida | A Folha e terra | B Tinta e fruta | C Grafite e limão | D Ameixa e caramelo | E Mar e coral |
|---|---|---|---|---|---|
| Texto sobre fundo (mín. 4,5) | 10.9 | 13.6 | 14.8 | 14.5 | 13.2 |
| Texto secundário (mín. 4,5) | 5.5 | 6.3 | 6.6 | 6.8 | 6.4 |
| Branco sobre botão (mín. 4,5) | 8.1 | 8.3 | 13.5 | 10.3 | 7.7 |
| Ramo sobre fundo (mín. 3) | 3.5 | 3.5 | 4.3 | 3.4 | 3.8 |
| Vale × não vale, diferença de luminosidade (L*) | 18.6 | 13.4 | 18.8 | 12.1 | 17.5 |
| Vale × não vale, diferença de cor com deuteranopia (ΔE) | 15.3 | 21.6 | 20.1 | 16.9 | 30.9 |
| Vale × não vale, diferença de cor com protanopia (ΔE) | 30.5 | 21.6 | 47.3 | 20.6 | 27.1 |

Todas passam nos mínimos de contraste de texto (WCAG AA). Os ramos eram o único ponto fraco: a paleta atual dava 2,5:1 nos ramos (mínimo 3:1) porque eles estavam com 75% de opacidade. Corrigi no programa: opacidade total, que dá 3,5:1.

## O que as imagens mostram
- `paleta/comparacao-normal.png`: abertura, atividades e Interpretar nas cinco paletas.
- `paleta/comparacao-daltonismo.png`: Interpretar em deuteranopia (esquerda) e em escala de cinza (direita).
- Nas cinco, "vale", "não vale" e "sem marca" se distinguem pelo texto, pelo ícone (✓ e ✕) e pelo tracejado, não só pela cor. Em escala de cinza continua legível. Em deuteranopia, o verde de "vale" fica próximo do fundo na A, B e D; a C (limão) é a que mais se destaca.

## Leitura
1. **Verde como cor da marca e do acerto ao mesmo tempo (A, C, E) mistura dois sentidos.** O botão "Entrar" e o "vale" ficam do mesmo verde. Na B (azul) e na D (roxo), a cor da interface e a cor do acerto são diferentes, e o verde só aparece quando algo vale.
2. **A é a mais próxima do padrão "natureza + creme/verde"** que lê como interface feita por IA, mesmo com o fundo já corrigido. É coerente com a árvore, mas é a menos distintiva.
3. **C (grafite e limão)** é a que mais valoriza as figurinhas, mas é fria e clínica para crianças dos anos iniciais.
4. **D (ameixa)** é distintiva, mas o roxo não tem relação com o tema e é a cor padrão de muita interface gerada.
5. **E (mar e coral)** é fresca e coerente, mas repete o problema de A: o verde-azulado de ação e a menta de "vale" são parentes.
6. **B (tinta e fruta)** lembra caderno escolar (azul de caneta), fica complementar às figurinhas quentes (laranja, morango, manga, chocolate), usa o laranja nos ramos (a estrutura da árvore) e reserva o verde para "vale". Tem o melhor contraste de texto entre as que usam cor de ação (13,6:1).

## Recomendação
**B, Tinta e fruta.** Segunda opção: **A**, se você prefere manter o verde que escolheu no início; nesse caso, o ajuste de ramos já está feito.

**Decisão: B aplicada no programa. Logo refeito (variante 1, continuidade).**
