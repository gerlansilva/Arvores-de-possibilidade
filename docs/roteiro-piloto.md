# Roteiro de piloto: usabilidade e observação pedagógica — "Árvore de possibilidades"

Uso: pesquisador sozinho em sala, 2–3 sessões de 30–40 min, crianças de ~6 a 9 anos.
Referencial: o software se inspira nos Diagramas de Árbol (Aguirre, 2005). Demais referenciais: **a definir pelo pesquisador**.

## 1. Objetivo e perguntas de pesquisa

**Objetivo.** Verificar se crianças conseguem usar a interface (Construir e Interpretar) sem ajuda técnica e observar como o software e a mediação do professor se relacionam com o raciocínio combinatório delas. Não é avaliação das crianças nem teste de eficácia.

**Perguntas (ajustáveis):**
1. Usabilidade: a criança consegue colocar peças nos níveis, guardar, abrir a árvore e marcar "vale"/"não vale" sem ajuda do mediador? Onde trava?
2. Em Construir, que estratégia de listagem aparece (ad hoc, sistemática, por árvore)? A árvore que "cresce só com o que foi guardado" ajuda a perceber casos esquecidos?
3. Em Interpretar, como a criança aplica a regra do problema ao marcar "vale"/"não vale"? Reconhece "a mesma possibilidade" entre dois caminhos?
4. Que ajudas da lista de Mediação são pedidas/necessárias e quais mudam a solução (antes x depois)?
5. O que, na interface, atrapalha ou esconde o conceito (e precisa mudar)?

## 2. Cuidados éticos

- **Aprovação:** verificar se a pesquisa exige submissão ao CEP/Plataforma Brasil conforme a instituição e a natureza do piloto (**a definir pelo pesquisador** com o orientador/comitê). Não iniciar sem essa definição.
- **Consentimento:** TCLE assinado pelos responsáveis, com finalidade, duração, gravação, riscos mínimos, direito de retirar a criança a qualquer momento, contato do pesquisador.
- **Assentimento:** explicar à criança em linguagem simples ("Estou testando um programa, não você; pode parar quando quiser") e registrar o aceite (verbal gravado ou termo ilustrado). Se a criança demonstrar desconforto, encerrar.
- **Anonimização:** no campo de identificação do app usar **somente código** (ex.: P01, P02; pares P01P02), nunca nome. A tabela código–criança fica em papel/arquivo separado, protegido.
- **Gravação:** preferir áudio + tela; se houver vídeo, enquadrar mãos e tela, sem rosto. Falas literais transcritas com o código.
- **Guarda de dados:** o app guarda localmente e exporta JSON. Exportar ao fim de cada sessão, nomear `P01_S1_AAAAMMDD.json`, copiar para pasta criptografada/backup; apagar do equipamento de uso. Prazo de guarda: **a definir pelo pesquisador** (e declarar no TCLE).
- Não avaliar nem comparar crianças perante a turma/escola; devolutiva à escola só agregada.

## 3. Preparação

**Equipamento:** computador/tablet com o app instalado e testado; mouse (ou toque, conforme versão); gravador de áudio (celular em modo avião) e, se possível, gravação de tela; cronômetro; fichas de observação impressas (seção 7); lápis; papel e figurinhas/objetos concretos reserva (para ajuda de nível 4); TCLE/assentimento; relógio visível.

**Sala:** silenciosa, mesa com a criança à frente da tela e o mediador ao lado (não atrás), tela visível para a gravação, sem professores/colegas circulando.

**Individual ou pares:** sugestão — Sessão 1 individual (isola usabilidade); Sessões 2–3 em pares, se quiser observar argumentação entre crianças. Decisão: **a definir pelo pesquisador**. Em pares, uma criança manuseia e a outra explica; trocar na tarefa 2.

**Duração:** 30–40 min por sessão. Ensaio prévio com um adulto para cronometrar.

**O que o software registra sozinho** (confirmar no seu build antes): peças guardadas, árvore final, marcações "vale/não vale", atividade e modalidade, e os campos do Registro/Mediação que você preencher.
**Precisa de gravação/observação:** falas, gestos, hesitações, tempo por tarefa, onde a criança aponta, ajudas dadas na hora, erros de interface que não geram registro, expressões de dúvida/frustração.

**Checagens 15 min antes:** bateria, app aberto na atividade Casquinhas, identificação com código, gravação testada, JSON de teste exportado e reaberto.

## 4. Roteiro minuto a minuto (sessão de ~35 min)

Regra de ouro: **pergunte antes de ajudar; espere ≥10 s**; nunca diga o número total, nem a próxima combinação.

| Min | Etapa | Ação |
|---|---|---|
| 0–4 | Acolhimento | Conversa breve; assentimento; ligar gravação; "Hoje vamos testar um programa de montar possibilidades. Se algo for difícil, a culpa é do programa." Preencher código no app. |
| 4–7 | Ambientação | Deixar explorar 1 min sem instrução. "O que você acha que dá pra fazer aqui?" |
| 7–20 | **Tarefa 1 — Construir (Casquinhas)** | Enunciado oral: sabores embaixo e em cima da casquinha, escolhendo uma peça por nível. "Monte uma casquinha que você gostaria. Guarde. Quantas casquinhas diferentes você acha que dá para montar?" Deixar seguir até dizer que acabou. Abrir a árvore ao fim: "O que você vê nessa árvore?" |
| 20–29 | **Tarefa 2 — Interpretar** | Abrir atividade com árvore pronta e regra (sugestão: Casquinhas em Interpretar: são 16 caminhos e 4 deles repetem o sabor, que não vale; confirme no app). "Cada caminho é uma possibilidade. Olhe cada um e diga se vale ou não vale pela regra." Observar critério e ordem de varredura. |
| 29–34 | **Tarefa 3 — Comparar dois caminhos** | Escolher dois caminhos com mesmos elementos em ordem diferente (sugestão: Duplas de animais, em que trocar os lados mantém a mesma dupla; confirme no app) e um par realmente distinto. "Esses dois são a mesma possibilidade? Por quê?" |
| 34–38 | Fechamento | "O que foi fácil? O que foi chato ou confuso? O que você mudaria?" Agradecer; encerrar gravação; exportar JSON; preencher Registro. |

### Falas-modelo do mediador (graduadas, sem entregar a resposta)

**Perguntas abertas (sempre primeiro):**
- "Me conta o que você está fazendo." / "Como você escolheu essa?"
- "Como você sabe que já fez todas?" / "Tem alguma que ainda não apareceu?"
- "Essa é igual a alguma que você já guardou? Como você sabe?"
- "Por que esse caminho vale (ou não vale)?"

**Tipos de ajuda (use exatamente a lista do campo "Ajuda dada" da Mediação do app, do menos ao mais direto):**
1. **Nenhuma:** a criança seguiu sozinha.
2. **Reli o enunciado com a criança:** "Vamos reler o que o problema pede?"
3. **Fiz uma pergunta:** aberta, sem indicar a ação ("O que você acha que esse botão faz?", "Olhe a árvore: o que ela mostra até agora?", "Olhe só este sabor de baixo: o que mais pode ir em cima dele?").
4. **Mostrei um exemplo:** só de interface, com outra atividade, nunca na tarefa em curso.
5. **Pedi que explicasse a um colega:** útil em sessões em pares.

Se precisar de material concreto (figurinhas de papel), anote no campo "Pergunta feita" ou na ficha; o app não tem essa opção.

Evitar: "faltam duas", "tente começar pelo morango", "está errado" (usar "me explica como pensou").

## 5. Tarefas de usabilidade e critério de sucesso

Sucesso = **sem ajuda** ("Nenhuma") dentro do tempo-limite; "Reli o enunciado" ou "Fiz uma pergunta" contam como "com apoio leve". Registrar na ficha.

| # | Tarefa | Critério de sucesso | Limite |
|---|---|---|---|
| U1 | Colocar uma peça num nível | Peça fica no nível escolhido (não solta/errada) | 1 min |
| U2 | Completar os dois níveis de uma possibilidade | Possibilidade montada com uma peça por nível | 2 min |
| U3 | Guardar a possibilidade | Aparece na lista/árvore | 1 min |
| U4 | Abrir/ver a árvore | Abre e a criança aponta um caminho | 1 min |
| U5 | Corrigir/trocar uma peça (se existir) | Substitui sem perder o resto | 2 min |
| U6 | Marcar "vale" em um caminho (Interpretar) | Marcação registrada | 1 min |
| U7 | Marcar "não vale" e mudar de ideia | Marcação alterada | 1 min |
| U8 | Comparar dois caminhos e responder "mesma possibilidade" | Escolhe resposta com o controle do app | 1 min |

Também observar: compreensão dos rótulos ("vale", "Guardar"), tamanho/alvo dos controles, feedback visível após cada ação, uso de leitura (crianças de 6 anos podem não ler: anotar se o texto é barreira).

## 6. Sinais a observar

**Interface (anotar como "I"):** cliques repetidos sem efeito; procurar botão; soltar peça fora do nível; guardar sem querer; não perceber que guardou; não achar a árvore; pedir "como faz?"; confusão entre níveis (cima/baixo); texto não lido.

**Conceituais (anotar como "C"):**
- **Ordem importa?** trata "baunilha–morango" e "morango–baunilha" como iguais ou diferentes? Depende do contexto (casquinha x dupla de animais)?
- **Repetição permitida?** monta duas bolas do mesmo sabor? Pergunta se pode? Exclui sem justificar?
- **Esquecer casos:** declara "acabou" com casos faltando? Percebe lacunas ao ver a árvore?
- **Sistematicidade:** fixa um elemento e varia o outro? Segue o ramo? Escolhe ao acaso?
- **Regra do problema:** marca "vale/não vale" por critério explícito ou por gosto pessoal?
- **Equivalência:** compara por aparência, por elementos, por posição na árvore?
- Dúvidas sobre se "guardar" = "a possibilidade existe" (efeito da árvore que só cresce com o guardado).

Cuidado: diferenciar "não entendeu o app" de "não entendeu o conceito" — use U1–U8 para separar; se a interface falhou, a leitura conceitual daquele trecho fica **incerta**.

## 7. Ficha de observação (uma por criança/par por sessão)

Código: ____ Sessão: ____ Data: ____ Modalidade/atividade: ____ Individual/par: ____

| Tarefa | Tempo (início–fim) | Ajudas (nível + fala) | Erros (I/C) | Falas literais (aspas) | Hipótese do pesquisador |
|---|---|---|---|---|---|
| Ambientação | | | | | |
| T1 Construir – Casquinhas | | | | | |
| T1b Abrir a árvore | | | | | |
| T2 Interpretar | | | | | |
| T3 Comparar dois caminhos | | | | | |
| Fechamento (opinião da criança) | | | | | |

Marcar também: estratégia vista (ad hoc / sistemática / árvore), momento em que disse "acabou", total que previu x total real, incidentes (cansaço, interrupção). Anotar o tempo no gravador ("T1 começou") para sincronizar.

## 8. Usar o Registro e a Mediação do app durante a sessão

- **Antes:** preencher identificação (código) e atividade.
- **Durante (só o essencial, com gesto rápido ou ao fim de cada tarefa):** não digitar enquanto a criança fala — marque o horário na ficha de papel e complete depois.
- **Campo de explicação da criança:** copiar a fala literal, entre aspas, assim que a tarefa terminar (ou da gravação à noite).
- **Mediação do professor:** registrar (a) a pergunta feita, (b) a ajuda dada escolhendo da lista (conforme os níveis da seção 4; se a lista do app diferir, anotar o equivalente na ficha), (c) **solução antes da ajuda** e **depois da ajuda**, descrevendo o que a árvore tinha em cada momento.
- **Depois da sessão (até 24 h):** completar lacunas, exportar o JSON, conferir que o registro bate com a ficha e a gravação.
- Se ficar pesado preencher sozinho, priorize: ajuda + antes/depois; o restante vem da gravação.

## 9. Protocolo de análise posterior

1. **Organizar:** por sessão, juntar JSON, transcrição, ficha e notas. Conferir códigos; remover qualquer nome.
2. **Separar eventos** em I (interface) e C (conceito); para cada evento marcar a tarefa U/T correspondente.
3. **Categorias provisórias** (revisar à medida que os dados pedirem; referencial teórico **a definir pelo pesquisador**):
   - *Estratégia de listagem:* ad hoc (sem padrão) / sistemática (fixa e varia) / por árvore (usa a estrutura de ramos).
   - *Completude:* declara fim com casos faltando / completa / completa após ajuda.
   - *Reconhecimento de equivalência:* por elementos / por ordem / por aparência / indecisa.
   - *Justificativas:* sem justificativa / perceptual / pela regra / geral (argumento que vale para todos os casos).
   - *Efeito da mediação:* solução antes x depois da ajuda; tipo de ajuda mínimo que produziu mudança.
4. **Triangular** o que a criança disse, fez no app e o que o mediador perguntou (a pergunta pode ter induzido a fala).
5. **Quadro-síntese** por criança e por tarefa; depois o cruzamento entre crianças. Sem generalizar: é piloto, amostra pequena.
6. **Decidir mudanças no software** com a regra:
   - **Corrigir já** se o problema de interface (I) ocorreu com ≥2 crianças ou impediu a tarefa de uma criança.
   - **Reavaliar** se apareceu uma só vez com sinal forte (ex.: desistência).
   - **Questionar o design pedagógico** (não só a interface) se o mesmo erro conceitual ocorreu em várias crianças *depois* de a interface ter funcionado — possível mudança de enunciado, ordem de atividades ou ajuda, não de botão.
   - Registrar cada mudança: problema → evidência (falas/tempos) → decisão → versão do app. Reaplicar nas sessões seguintes.

## 10. Checklist de encerramento

- [ ] Gravação parada, arquivo salvo e nomeado com o código
- [ ] Registro e Mediação preenchidos no app
- [ ] JSON exportado, nomeado e com cópia segura; arquivo apagado do equipamento de uso
- [ ] Ficha de observação completada e foto/scan guardados
- [ ] Tabela código–criança guardada separadamente
- [ ] TCLE/assentimento arquivados
- [ ] Notas de campo (impressões, incidentes) escritas no mesmo dia
- [ ] Lista de ajustes de interface para testar na próxima sessão
- [ ] Criança e responsáveis agradecidos; escola informada da próxima sessão
