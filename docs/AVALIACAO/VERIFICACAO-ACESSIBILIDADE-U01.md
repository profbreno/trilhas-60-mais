# Verificação interna de acessibilidade e interação — U01

Complemento posterior: [FECHAMENTO-ACESSIBILIDADE-U01.md](FECHAMENTO-ACESSIBILIDADE-U01.md) rastreia os cinco inconclusivos ao skip link oculto e mede sua apresentação visível, preservando os registros originais abaixo. Inclui roteiro manual Narrador/Edge ainda não executado; não constitui validação integral.

10/11/2026 · Trilhas 60+ `0.1.0-dev` · Windows / Chrome `157.0.8103.50` / Node.js 20.17.0.

Esta é uma **verificação intermediária de desenvolvimento**, com execução programática em Chrome real headless, inspeção de capturas e testes automatizados. Não é a avaliação final D07, teste com pessoas idosas, teste real com leitor de tela ou declaração de conformidade integral com WCAG 2.2.

“Aprovado” significa que o procedimento descrito passou nos estados examinados. “Reprovado” registra defeito observado. “Não verificado” indica ausência de evidência suficiente. A aprovação de geometria/teclado não substitui avaliação perceptiva, fala de leitor de tela ou inspeção em aparelho físico.

## Inspeção e escopo

Lidos AGENTS, sistema de design, arquitetura do motor, refinamento UX-01 e diário DSR. Inspecionados AppLayout/AppHeader, HomePage/LearningPath, CurriculumPages, MissionRunner/MissionPresentation, ReadingActivity/NavigationActivity, HelpButton, progressos, mensagens e estilos. A base anterior tinha 191 testes; os 191 foram preservados sem editar seus casos nesta etapa.

Mudanças de produto restritas a CSS: limites de largura, quebra de palavras e ocultação do skip link. Não houve edição do currículo, definições pedagógicas, validadores, redutor, critérios, eventos, rotas ou artes oficiais. Os hashes desses arquivos e dos testes de domínio foram registrados nos JSONs inicial/final e conferidos. Não houve persistência de progresso, telemetria de participantes, autenticação, novas missões ou publicação.

## Ambiente e procedimentos distintos

Chrome instalado foi aberto com perfil temporário exclusivo, sem perfil pessoal. Interações no app usam CDP para enviar Tab, Shift+Tab, Enter, Espaço, setas e Escape. Não há `.click()`/`.focus()` para executar as tarefas. As configurações do **próprio Chrome** são alteradas via chrome.settingsPrivate na página chrome://settings/appearance; essa API não foi incorporada ao app. A [definição do Chromium](https://chromium.googlesource.com/chromium/src/+/main/chrome/common/extensions/api/settings_private.idl) identifica getDefaultZoom/setDefaultZoom como leitura/escrita do fator de zoom da página.

Não foram usados CSS zoom, pinch, setPageScaleFactor ou deviceScaleFactor para representar zoom. Antes de cada condição, a emulação de viewport é limpa. O fator lido da configuração, DPR, escala visual e largura interna são registrados. A janela é ajustada para **1280 × 900 CSS px de conteúdo a 100%**, com dimensão externa 1302 × 998 devido às bordas do Windows/Chrome.

| Ambiente | Procedimento | Métricas verificadas |
| --- | --- | --- |
| B1280 | Janela nativa em 100%, fonte padrão 16 | innerWidth 1280, innerHeight 900, DPR 1, fonte raiz 18 px |
| Z200 | Zoom nativo do navegador 200%, mesma janela | getter 2; innerWidth 640, innerHeight 450, DPR 2, visualViewport.scale 1; raiz continua 18 CSS px |
| Z400 | Zoom nativo 400%, mesma janela | getter aproximadamente 4; innerWidth 320, innerHeight 225, DPR 4; área útil de 316 px com scrollbar |
| V320 | Viewport **emulado por redimensionamento CDP**, zoom 100% | 320 × 900, DPR 1, área útil 305 px; não é zoom nem smartphone físico |
| T1280 | Fonte padrão do Chrome 16 → 32, zoom 100% | Viewport 1280 × 900, DPR 1; fonte raiz 18 → 36 px |
| T320 | Mesma ampliação de fonte, viewport emulado 320 | 320 × 900, DPR 1, raiz 36 px; condição adicional combinada de estresse |

Uma tentativa de redimensionar a janela nativa para 320 foi limitada pelo Chrome/Windows a 512 CSS px internos. **Não foi apresentada como janela nativa de 320.** V320 utiliza emulação de viewport, explicitamente separada. Já Z400 produziu efetivamente 320 CSS px pela ampliação nativa da janela com conteúdo inicialmente de 1280 CSS px. A geometria inicial/final e a tentativa limitada estão nos JSONs.

Referências de inspeção: [redimensionamento de texto, 1.4.4](https://www.w3.org/TR/WCAG22/#resize-text), [reflow, 1.4.10](https://www.w3.org/TR/WCAG22/#reflow), teclado 2.1.1/2.1.2, foco 2.4.3/2.4.7/2.4.11 e semântica/mensagens 4.1.2/4.1.3. Usá-las como referência não significa que cada critério foi avaliado integralmente.

## Registro das verificações de ampliação e reflow

Estados: percurso; M01 início, detalhes e conclusão; M02 ajustes, ajustes adicionais, feedback inadequado e conclusão. A base/fonte ampliada larga usam os cinco primeiros estados de layout; Z200/Z400/V320/T320 incluem percursos completos. Cada ocorrência está identificada por `profile`/`state` e tem PNG homônimo nos [resultados finais](evidencias/A11Y-U01/reinspecao/resultados.json).

| Tela/estado e ambiente | Critério / procedimento | Resultado inicial | Problema e correção | Reinspeção / evidência |
| --- | --- | --- | --- | --- |
| Percurso, M01/M02 — Z200 | 1.4.4: aplicar zoom nativo; abrir detalhes, ajuda e opções; usar ações principais e concluir | **Aprovado** | Nenhum problema identificado nesses estados | **Aprovado**: getter 2, DPR 2, largura 640; sem overflow. [Percurso 200%](evidencias/A11Y-U01/reinspecao/zoom-real-200-percurso.png) |
| Percurso — Z400 | 1.4.10: mesma janela, zoom 400%; percorrer os vinte nós na ordem e retornar | **Aprovado** | Sem perda funcional observada | **Aprovado**, 320 CSS px por zoom real. [Captura](evidencias/A11Y-U01/reinspecao/zoom-real-400-percurso.png) |
| M01 início/detalhes/conclusão — Z400 | 1.4.10 / 2.1.1: ajuda, erro reversível, retorno de etapa, reinício, pausa e conclusão | **Aprovado** | Sem truncamento ou controle inacessível identificado | **Aprovado**. [Início](evidencias/A11Y-U01/reinspecao/zoom-real-400-m01-inicio.png), [conclusão](evidencias/A11Y-U01/reinspecao/zoom-real-400-m01-concluida.png) |
| M02 ajustes/extras/feedback/conclusão — Z400 | 1.4.10 / 2.1.1: rádios, aplicar, desfazer, ler e concluir | **Aprovado** | Sem perda funcional observada | **Aprovado**. [Ajustes](evidencias/A11Y-U01/reinspecao/zoom-real-400-m02-ajustes.png), [conclusão](evidencias/A11Y-U01/reinspecao/zoom-real-400-m02-concluida.png) |
| Percurso, M01/M02 — V320 | Redimensionamento emulado 320, separado do zoom; estados fechados/abertos e percursos | **Aprovado** | Janela nativa não alcança 320; limitação registrada, não falha do app | **Aprovado no viewport emulado**. [M02](evidencias/A11Y-U01/reinspecao/viewport-320-m02-extras.png) |
| Percurso, M01/M02 — T1280 | Fonte nativa dobrada, sem mudar zoom/viewport | **Aprovado** | Nenhum defeito identificado nesses estados | **Aprovado**, raiz 36 px/DPR 1. [M01](evidencias/A11Y-U01/reinspecao/texto-200-1280-m01-detalhes.png) |
| Todas as páginas — T320 | 1.4.4/1.4.10: fonte dobrada + viewport estreito; medir documento e rodapé | **Reprovado**: scrollWidth 504 contra clientWidth 305 | P01: item flex do rodapé impedia a marca de encolher. Aplicados min-width:0 e max-width:100% aos filhos | **Aprovado após correção**; sem esconder conteúdo ou recortar a marca. [Diagnóstico inicial](evidencias/A11Y-U01/inicial/diagnostico-overflow.json) |
| Legenda M02 — T320 | Conferir limite do grupo “Apresentação do texto” e seu texto | **Reprovado**: borda direita cerca de 321,44 px excedia área útil de 305 | P02: legenda sem limite/quebra suficiente. Aplicados max-width:100% e overflow-wrap:anywhere | **Aprovado após correção**. [Antes](evidencias/A11Y-U01/inicial/texto-200-320-m02-ajustes.png), [depois](evidencias/A11Y-U01/reinspecao/texto-200-320-m02-ajustes.png) |
| Summaries, avisos, cartões, rótulos e reconhecimento — T320 | Conferir scrollWidth/clientWidth internos e limites de controles, palavras longas e badge | **Reprovado**: summary com 262/231 px e transbordamentos adicionais após corrigir o rodapé | P03: regras de quebra insuficientes em conteúdo estreito. Quebra anywhere herdada do body, explícita em summary/legend e largura máxima da badge | **Aprovado nos estados finais**, sem reduzir fonte/conteúdo ou usar overflow:hidden. [Percurso](evidencias/A11Y-U01/reinspecao/texto-200-320-percurso.png) |
| Skip link sem foco — T320 | 2.4.7/2.4.11: inspecionar topo e elemento de contraste inconclusivo do axe | **Reprovado**: deslocamento fixo -150 px deixava parte do link sobre a marca quando sua altura aumentava | P04: ocultação substituída por translateY baseado em 100% da própria altura, com margem; limite de largura e exibição no foco | **Aprovado após correção**, sem parte residual. [Antes](evidencias/A11Y-U01/inicial/texto-200-320-percurso.png), [depois](evidencias/A11Y-U01/reinspecao/texto-200-320-percurso.png) |
| Skip link com foco — Z200/Z400/V320/T320 | Tab inicial, conferir link visível, Enter para main, continuar a navegação | **Não verificado antes da regressão específica** | Regressão real acrescentada ao utilitário | **Aprovado**, foco no link e depois no main. [Foco com fonte dobrada](evidencias/A11Y-U01/reinspecao/texto-200-320-skip-foco.png) |

O primeiro ajuste do rodapé revelou outros transbordamentos que antes eram encobertos pela largura excedente maior. Eles também foram corrigidos, em vez de ocultar a barra horizontal. Todos os ajustes de produto estão em `src/styles/index.css`; nenhuma fonte foi diminuída, informação removida ou função alterada.

## Registro de teclado e funcionalidades sob demanda

Ambiente C = Chrome real headless, eventos de teclado enviados por CDP, sem leitor de tela. Os percursos foram exercitados em Z200, Z400, V320 e T320. Isso é inspeção automatizada de interação real no navegador, não sessão manual de um participante.

| Tela/estado / ambiente C | Critério e procedimento | Resultado / problema | Correção | Reinspeção / evidência |
| --- | --- | --- | --- | --- |
| Percurso e nós M01–M20 | 2.1.1/2.4.3: atalho à primeira missão, vinte Tab na ordem, Shift+Tab de volta a M20 e saída da sequência | **Aprovado** nos perfis registrados; sem armadilha identificada | Nenhuma | `journeys` e ordem de nós no script; rótulos/estados preservados |
| M01 início a conclusão | Enter nos apps/retornos; erro Calendário; ajuda; voltar uma etapa; reiniciar; interromper/retomar; recuperar caminho; concluir/repetir | **Aprovado**; não conclui ao somente abrir informações | Nenhuma no motor | [Conclusão Z200](evidencias/A11Y-U01/reinspecao/zoom-real-200-m01-concluida.png), testes de domínio existentes |
| M02 início a conclusão | Dificuldade inadequada; ajustes extras; rádios por setas/Espaço; aplicar inadequado/adequado; desfazer; modo de leitura; resposta incorreta/correta; repetir | **Aprovado**; feedback continua explicativo, sem perda de ajustes por erro de local | Nenhuma no motor | [Feedback Z200](evidencias/A11Y-U01/reinspecao/zoom-real-200-m02-feedback-inadequado.png), `journeys` |
| Ajuda contextual | Espaço para abrir/fechar, aria-expanded coerente, foco mantido no acionador | **Aprovado** no contrato observado | Nenhuma | Asserções reais no script e testes existentes de HelpButton |
| Opções da prática | Abrir por Enter/Espaço; localizar reinício/interrupção; retornar à tarefa com foco no h2 | **Aprovado** | Nenhuma | Asserções de foco após reinício e fluxo de retomada |
| Sobre esta demonstração | Expandir e acessar objetivo, cenário, orientação integral, critérios/progresso e explicação de memória | **Aprovado**, dados preservados | Nenhuma | M01 detalhes e asserção de objetivo/progresso nos testes; consulta aos componentes |
| Retornos e fechamento por mudança de estado | Voltar de etapa, refazer; fechamento de opções na mudança; foco no h2; retornar ao percurso e focar U01 | **Aprovado** nos percursos | Nenhuma | `journeys`; asserts de `document.activeElement` |
| Escape | Enviar Escape na ajuda e verificar que o percurso permanece operável | **Aprovado no contrato existente**; nenhum diálogo/menu/popup exige Escape. Disclosures fecham pelo acionador com Enter/Espaço, não por Escape | Não acrescentado handler artificial | Registrado em fullKeyboard; não se afirma que Escape fecha details |
| Foco visível / não encoberto | Inspecionar outlines e capturas dos estados; corrigir sobreposição do skip link | **Aprovado nos pontos registrados**; P04 identificado e corrigido | CSS do skip link | Inspeção humana exaustiva de todos os pontos de foco continua **Não verificada** |
| Feedback e estados para tecnologia assistiva | 4.1.2/4.1.3: DOM, região persistente polite/atomic, axe e grupos/rótulos | **Aprovado somente na inspeção semântica automatizada** | Nenhuma alteração às mensagens | Fala real, tempo e inteligibilidade dos anúncios: **Não verificado** |

Não há modal com aprisionamento de foco. Abrir seções técnicas não emite ações pedagógicas; abrir ajuda mantém o evento previsto. O histórico e os critérios continuam sob os mesmos validadores em memória. Não foi utilizado Escape como substituto de um controle nomeado.

## Leitor de tela: impedimento e roteiro Windows

**Resultado real com leitor de tela: Não verificado.** NVDA não foi localizado nos caminhos Program Files, Program Files (x86), LocalAppData consultados ou no PATH, e não estava em execução. `C:\Windows\System32\Narrator.exe` está instalado, mas a sessão de ferramentas não disponibiliza canal de áudio, saída textual do leitor ou controle do leitor que permita avaliar efetivamente a fala e a navegação. Portanto não foi lançado para produzir uma alegação de teste sem poder observar seu resultado. Presença do executável não constitui teste real. Não foi instalado software adicional.

Inspeção do DOM, árvore semântica ou axe **não foi tratada como leitor de tela**. O pesquisador pode executar o roteiro abaixo em janela visível, com Narrador já instalado ou NVDA caso disponível em sua estação, sem participantes e somente com os cenários fictícios. Registrar versão do leitor/navegador, modo de navegação, ação, fala observada e resultado. Encerrar o leitor ao terminar, sem registrar áudio pessoal.

| ID / tela e estado | Procedimento manual e resultado esperado | Resultado nesta sessão |
| --- | --- | --- |
| L01 — início | Abrir Chrome visível no localhost; iniciar leitor. Conferir título da página, idioma, h1 e regiões | **Não verificado** |
| L02 — percurso | Ler as três trilhas, dez unidades e nomes/códigos M01–M20. Confirmar ordem e disponibilidade expressa em palavras | **Não verificado** |
| L03 — entrada M01/M02 | Abrir cada nó; conferir novo título, identificação da missão, tarefa atual e instrução | **Não verificado** |
| L04 — M01 | Abrir Calendário antes do pedido, ouvir feedback, recuperar Recados e reconhecer mudanças de tela sem depender de visão | **Não verificado** |
| L05 — M02 ajustes | Navegar por Tab/setas nos rádios, ouvir legendas, nomes, seleção e opções adicionais expandidas/recolhidas | **Não verificado** |
| L06 — feedback M02 | Aplicar somente brilho/volume e escolher local incorreto. Ouvir mensagem explicativa sem alerta excessivo ou perda de contexto; repetir erro igual | **Não verificado** |
| L07 — etapas e objetivos | Distinguir posição “Etapa N de 3” de critérios praticados. Expandir detalhes e ouvir progresso/itens com nomes e valores corretos | **Não verificado** |
| L08 — ajuda e painéis | Abrir/fechar ajuda e summaries por Enter/Espaço; conferir estado e acesso ao conteúdo. Fechar e verificar foco no acionador | **Não verificado** |
| L09 — reinício/pausa | Reiniciar, interromper e retomar; ouvir tarefa reaberta. Confirmar que não se anuncia conclusão indevida | **Não verificado** |
| L10 — conclusão/retorno | Concluir, ouvir reconhecimento sem nota, repetir e voltar ao percurso. Conferir foco/anúncio de U01 | **Não verificado** |

## Testes, regressões e reprodução

- `npm run check`: **191 testes em treze arquivos**, lint sem avisos, TypeScript e build aprovados. Nenhum caso anterior foi removido/editado nesta etapa.
- Regressões novas são **de renderização em Chrome**, em `scripts/verificar-acessibilidade-u01.mjs`: largura do documento/rodapé, limites dos controles/legendas, transbordamento interno, ocultação do skip link e ativação/foco. Não se criaram testes jsdom que fingissem medir layout.
- A execução inicial reproduziu cinco estados reprovados em T320. Registros [iniciais](evidencias/A11Y-U01/inicial/resultados.json) e [de reinspeção](evidencias/A11Y-U01/reinspecao/resultados.json) preservam ambiente, métricas, foco, resultados axe e hashes. O utilitário termina com erro se houver falha de percurso, overflow, clipping ou violação axe.
- Reinspeção final: **42 estados de layout aprovados**, quatro percursos completos por teclado aprovados e zero erros de percurso. Os 42 axe não apontaram violações. Em **cinco estados**, porém, contraste teve um item inconclusivo; essa parte é **Não verificada**, não aprovada. Os demais 37 estados não tiveram itens inconclusivos. `status` dos registros refere-se à geometria/testes conclusivos; `statusContraste` distingue esse limite.
- O item restante é o skip link: o axe informa sobreposição mesmo com o link transformado totalmente acima da janela, sem foco. Sua geometria final registra borda inferior negativa, e a captura mostra a marca sem sobreposição; a regressão focada também passou. O [diagnóstico](evidencias/A11Y-U01/reinspecao/contraste-inconclusivo.json) preserva a ocorrência. Pode ser uma limitação da inspeção de elementos transformados, mas isso é uma hipótese; recomenda-se confirmar contraste/foco manualmente, sem suprimir a regra.

Para repetir: `npm run dev`; abrir Chrome isolado com `--headless=new --disable-gpu --window-size=1280,1000 --remote-debugging-port=9226 --user-data-dir=<perfil-temporário> --no-first-run --no-default-browser-check about:blank`; executar `node scripts/verificar-acessibilidade-u01.mjs reinspecao`. Usa ws/axe-core já presentes no lockfile, sem instalação nova. O modo `inicial` é histórico: não executá-lo sobre a linha de base atual para fingir reproduzir o CSS anterior. O script restaura zoom 100% e fonte padrão no perfil de teste ao finalizar.

O protocolo exige um perfil isolado. Não apontar a configuração para um Chrome pessoal, pois o teste altera preferências nativas de zoom/fonte desse perfil. Isso não altera configurações do dispositivo dentro das micromissões nem introduz persistência no app.

## Pendências e prontidão para M03/M04

| Verificação pendente | Ambiente/procedimento necessário | Resultado |
| --- | --- | --- |
| Leitor de tela real | Windows com áudio/controle observável, leitor/navegador e roteiro L01–L10 | **Não verificado** |
| Smartphone/tablet físico | Toque, retrato/paisagem, viewport/altura real, zoom do dispositivo, tecnologias assistivas disponíveis | **Não verificado** |
| Inspeção humana exaustiva de foco/contraste | Percorrer manualmente todos os pontos, cores forçadas e estados não capturados | **Não verificado** |
| Contraste inconclusivo do skip link em cinco auditorias | Conferir o link com/sem foco e fonte ampliada em navegador visível | **Não verificado** |
| Compreensão/esforço com pessoas idosas | Etapa de avaliação autorizada e protocolo da pesquisa | **Não verificado**, sem participantes envolvidos aqui |

O motor apresenta base técnica consistente nos fluxos examinados, inclusive com zoom real e após correções de CSS. Recomenda-se usá-la para **planejar** o próximo incremento, mantendo a prontidão de acessibilidade como parcial até o teste real com leitor e dispositivos. Não há certificação ou autorização implícita para M03/M04, coleta, backend ou publicação. As pendências de conferência dos instrumentos originais também permanecem; não foram alterados.
