# Auditoria da interface (etapa 1: redesign-existing-projects)

Base: capturas em `docs/telas/`, `src/views/*.tsx`, `src/styles/app.css` (2566 linhas), `DESIGN.md` e a especificação original (`Combinatoria-OpenCode/GUIA-OPENCODE.md`).

## Diagnóstico

1. **A árvore virou uma aba.** No Árbol a árvore é o centro do trabalho. Aqui ela é a 4ª etapa (Mesa → Coleção → Árvore → Registro) e a Mesa é uma tela de três painéis sem árvore. Mesmo os dados (guardadas, coleção, árvore) aparecem em três lugares separados.
2. **Três quadros iguais na Mesa** (Peças | Montagem | Guardadas), cada um com cabeçalho, rodapé, contador e borda. A área de montagem ocupa o meio quase vazia, com uma figura pequena num campo pontilhado.
3. **Escala de ferramenta de adulto.** O CSS usa 9–13 px na maior parte (11,5 px e 10,5 px são os mais frequentes). A especificação pedia enunciado de 20–24 px, controles ≥ 16 px e alvos ≥ 44 px, pensando em projeção na turma e tablet.
4. **Aparência de painel de controle.** Barra superior escura, cinzas frios, abas, barra de status ("Dados locais · sem rede"), miniaturas de 18:10. A especificação pedia marfim `#F6F3EA`, papel `#FFFEFA`, verde-escuro `#223D36`, fonte legível (Atkinson Hyperlegible Next). O `DESIGN.md` registrou o desvio como decisão ("aplicativo de bancada").
5. **Atividades como catálogo web.** Cada cartão repete descrição, "2 níveis", cartão de sessão e botões ("Nova sessão", "Começar"), além de "Salvar cópia / Abrir cópia" no topo. A ação principal não é única.
6. **Ações demais por tela:** Desfazer / Limpar / Guardar montagem; Abrir coleção; abas; Início. Várias são secundárias e disputam atenção com a ação da criança.

## O que as skills genéricas não se aplicam aqui
Fundos com fotos, links legais, página 404, fonte "com personalidade" como Geist/Satoshi, texturas de ruído: não servem a uma ferramenta offline para sala de aula. Valem: hierarquia, estados (vazio, foco, hover), fonte legível, contraste, semântica.

## Direção proposta (para as etapas 2 e 3)
- **Mesa = árvore crescendo.** A tela central é a árvore da criança, que cresce a cada montagem guardada. Peças ficam numa bandeja grande na base; a prévia da montagem atual é pequena e perto das peças; guardadas viram a própria árvore (folhas). Mantém a decisão pedagógica: só mostra o que a criança produziu.
- Coleção, Comparar e Registro viram modos da mesma tela, em vez de quatro etapas.
- Um painel só (papel marfim) sobre a bancada, sem barra escura nem barra de status.
- Texto ≥ 16 px, alvos ≥ 44 px, uma ação principal por tela.
- Paleta marfim + verde-escuro da especificação; logo com duas cores (ramos e folhas).
