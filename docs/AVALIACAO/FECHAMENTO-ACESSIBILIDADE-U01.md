# Fechamento técnico de contraste e roteiro do Narrador — U01

Nota de versão posterior: o checklist deste registro retrata a disponibilidade antes da implementação U02. Agora M03/M04 também estão disponíveis; M05–M20 continuam informativas. Para a rodada atual do leitor, usar também as verificações propostas no [relatório U02](VERIFICACAO-U02.md). Os resultados de execução manual continuam Não verificado; o histórico abaixo não foi reclassificado.

10/11/2026 · Trilhas 60+ `0.1.0-dev`.

Este documento encerra a **investigação dirigida** dos cinco resultados inconclusivos e prepara uma inspeção manual. Não encerra a avaliação de acessibilidade do artefato. Não é D07, teste com pessoas idosas, teste executado com leitor de tela ou declaração de conformidade integral com WCAG 2.2.

## Resultado e limites

Os cinco itens são ocorrências do **mesmo componente**, o link de salto `.skip-link`, definido no AppLayout e estilizado no CSS compartilhado. Não são cinco combinações cromáticas diferentes. Todas as ocorrências foram reproduzidas individualmente.

- **Aprovado na medição dirigida:** texto do link visível com foco e com foco+hover: **11,865535301875378:1**. Indicador de foco: **7,526045896933103:1** sobre branco e **7,166582181403303:1** sobre o fundo da página.
- **Reprovado:** nenhuma inconformidade de contraste, semântica ou rótulo comprovada nesta investigação. Não houve correção de produto nem alteração de cores, componentes, currículo, motor, eventos ou marca.
- **Não verificável pela auditoria original:** o link sem foco está totalmente acima da janela; não existe texto pintado no viewport para medir visualmente nesse estado. O axe continua informando sobreposição/fundo indeterminado. Os resultados automáticos históricos permanecem inconclusivos; não foram substituídos por aprovações fictícias.
- **Não executado:** inspeção real do Microsoft Narrador/Edge. O roteiro abaixo está preparado, com todos os resultados aguardando o pesquisador.

## Ambiente, método e referências

Chrome instalado `157.0.8103.50`, Windows, perfil temporário isolado, Vite local. Viewport emulado de 320 × 900 CSS px, zoom nativo 100%, DPR 1. C01 usa fonte padrão 16 px/raiz 18 px; C02–C05 usam preferência nativa de fonte 32 px/raiz 36 px. Não houve instalação de dependências.

Fontes: [verificação anterior](VERIFICACAO-ACESSIBILIDADE-U01.md), [cinco registros históricos](evidencias/A11Y-U01/reinspecao/resultados.json), inspeção dos componentes e [nova medição completa](evidencias/FECHAMENTO-U01/contraste.json). O [utilitário reproduzível](../../scripts/fechar-contraste-u01.mjs) não modifica o produto. O foco no link é obtido por Tab; o hover é forçado por DevTools para obter o estilo CSS correspondente. A preparação do rádio da M02 usa ativação programática, pois esta rodada mede contraste, não constitui novo teste de teclado ou leitor.

As cores-base de pintura são obtidas por getComputedStyle no navegador, considerando fundo próprio ou ancestral opaco, opacidade 1 e ausência de filtros. Capturas confirmam o estado visível. Não se calcula contraste sobre pixels antialiasados das bordas dos glifos. No estado oculto, as cores calculadas são propriedades CSS; não são pixels efetivamente pintados na janela.

Fórmula usada: converter cada canal sRGB normalizado para valor linear (`c/12,92` se `c ≤ 0,04045`; caso contrário `((c+0,055)/1,055)^2,4`); luminância `L=0,2126R+0,7152G+0,0722B`; proporção `(Lmaior+0,05)/(Lmenor+0,05)`. O script compara os valores completos, sem arredondar antes do julgamento; a tabela arredonda somente para leitura.

Referências: [WCAG 2.2 — 1.4.3, contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) e [1.4.11, contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). A referência comum é 4,5:1 para texto normal, 3:1 para texto grande e 3:1 para informação visual de componentes/estados relevante. Texto não visível e componentes inativos têm exceções. O texto do link foi comparado conservadoramente com **4,5:1 em todas as ocorrências**, inclusive quando ampliado e negrito. O indicador de foco foi comparado com 3:1 nos fundos conferidos; isso não avalia integralmente todos os requisitos de foco.

## Os cinco itens, individualmente

Em todas as ocorrências: foreground computado e pintado quando visível **#173e31 / rgb(23,62,49)**; fundo próprio opaco **#ffffff / rgb(255,255,255)**; foco **#84430e / rgb(132,67,14)**, outline de 3 CSS px. Foco e hover não mudam o par de texto/fundo; hover altera a decoração do link.

| ID | Registro original / estado | Elemento e condição sem foco | Por que o axe não concluiu | Contraste visível e classificação | Evidências |
| --- | --- | --- | --- | --- | --- |
| C01 | viewport-320 / M01 detalhes abertos, raiz 18 px | AppLayout `.skip-link`, borda inferior -18 CSS px | `color-contrast`: fundo não determinado por sobreposição parcial, embora o retângulo esteja fora da janela | Foco e foco+hover: **11,87:1, aprovado**. Oculto: **não verificável automaticamente**, sem texto visível sujeito à exigência nesse estado | [Oculto](evidencias/FECHAMENTO-U01/C01-original-oculto.png), [foco](evidencias/FECHAMENTO-U01/C01-foco.png) |
| C02 | texto-200-320 / M01 início, raiz 36 px | Mesmo link, borda inferior -36 CSS px | Mesma limitação de determinação do fundo/sobreposição | Foco e foco+hover: **11,87:1, aprovado**. Oculto: **não verificável automaticamente** | [Oculto](evidencias/FECHAMENTO-U01/C02-original-oculto.png), [foco](evidencias/FECHAMENTO-U01/C02-foco.png) |
| C03 | texto-200-320 / M01 detalhes abertos, raiz 36 px | Mesmo link, borda inferior -36 CSS px | Mesma mensagem; não é falha cromática do painel de detalhes | Foco e foco+hover: **11,87:1, aprovado**. Oculto: **não verificável automaticamente** | [Oculto](evidencias/FECHAMENTO-U01/C03-original-oculto.png), [foco](evidencias/FECHAMENTO-U01/C03-foco.png) |
| C04 | texto-200-320 / M01 concluída, raiz 36 px | Mesmo link, borda inferior -36 CSS px | Mesma mensagem; não corresponde aos botões desabilitados da simulação | Foco e foco+hover: **11,87:1, aprovado**. Oculto: **não verificável automaticamente** | [Oculto](evidencias/FECHAMENTO-U01/C04-original-oculto.png), [foco](evidencias/FECHAMENTO-U01/C04-foco.png) |
| C05 | texto-200-320 / M02 concluída, raiz 36 px | Mesmo link, borda inferior -36 CSS px | Mesma mensagem; não corresponde ao feedback ou convite | Foco e foco+hover: **11,87:1, aprovado**. Oculto: **não verificável automaticamente** | [Oculto](evidencias/FECHAMENTO-U01/C05-original-oculto.png), [foco](evidencias/FECHAMENTO-U01/C05-foco.png) |

O diagnóstico completo preserva o seletor e a mensagem do axe em cada caso. A combinação de transformação CSS, posição fora da janela e inferência de sobreposição explica por que **não é possível aceitar a conclusão automática**. A causa interna exata no algoritmo do axe não foi demonstrada; trata-se de uma limitação observada de inferência do fundo neste cenário, não de uma comprovação de que qualquer aviso desse tipo seja falso positivo.

Não foi removido transform, alterada a paleta, escondido conteúdo com aria-hidden ou desativada a regra para obter aprovação. A avaliação dirigida verifica o estado realmente visível, com fundo branco opaco próprio. A checagem automática do estado oculto continua registrada separadamente.

### Foco, hover, seleção, erro e desabilitação

O skip link não possui seleção, estado de erro ou desabilitação. Esses estados são **não aplicáveis ao componente investigado**. Para não confundi-los com as cinco ocorrências, foram medidos separadamente exemplos reais da interface:

| Componente / estado | Foreground / fundo efetivo | Proporção | Resultado e escopo |
| --- | --- | --- | --- |
| Skip link com foco, C01–C05 | #173e31 / #ffffff | 11,87:1 | **Aprovado** para texto, referência conservadora 4,5:1 |
| Skip link com foco+hover, C01–C05 | #173e31 / #ffffff | 11,87:1 | **Aprovado** para texto; hover forçado por DevTools, sem alegação de teste físico de mouse |
| Outline de foco do skip link | #84430e / #ffffff e #f7faf9 | 7,53:1 / 7,17:1 | **Aprovado** no contraste dos pares adjacentes conferidos, referência 3:1 |
| Ação principal normal | #ffffff / #15585c | 8,13:1 | **Aprovado** para texto |
| Ação principal hover | #ffffff / #104448 | 10,81:1 | **Aprovado** para texto |
| Feedback de erro M02 | #8d2933 / #fff1f1 | 7,65:1 | **Aprovado** para texto; [captura](evidencias/FECHAMENTO-U01/feedback-erro.png) |
| Rótulo da opção selecionada M02 | #203d40 / #f7faf9 | 11,09:1 | **Aprovado** para o rótulo. O contraste dos pixels do círculo nativo não foi determinado por esse cálculo: **não verificado**. [Captura](evidencias/FECHAMENTO-U01/opcao-selecionada.png) |
| Apps desabilitados após concluir M01 | #496367 / #eaf3f1 | 5,70:1 | Medição informativa; componente comprovadamente inativo, **isento do mínimo normativo aplicável**, sem usá-lo como prova de conformidade |

Os rótulos nativos da M02, fieldsets/legends, nomes de botões e associação da ajuda por aria-controls foram inspecionados no código; não foi identificada associação quebrada neste recorte. Isso não substitui ouvir a sua apresentação pelo Narrador.

## Correções e verificações finais

**Nenhuma inconformidade comprovada exigiu correção do produto.** Somente foram acrescentados o utilitário, evidências e documentação. A identidade oficial e os instrumentos da tese permanecem intactos. Não foi feita reformulação estética para eliminar um aviso automático.

`npm run check` passou: lint sem avisos, TypeScript sem erros, **191 testes aprovados em treze arquivos** e build concluído. Os 191 testes anteriores não foram editados/removidos. O novo utilitário passou nas asserções dos pares cromáticos, posição oculta/visível e indicador de foco; usa ws e axe-core já existentes no lockfile. Não implementa coleta no app.

O [registro de preservação](evidencias/FECHAMENTO-U01/preservacao.json) confere nove arquivos protegidos contra os hashes anteriores: currículo, definições, motor/testes de domínio e PNGs oficiais; nenhuma divergência.

Para repetir a medição, iniciar Vite em 5173 e Chrome com perfil temporário isolado/depuração em 9227 e executar `node scripts/fechar-contraste-u01.mjs`. O procedimento é análogo ao [roteiro de ambiente anterior](VERIFICACAO-ACESSIBILIDADE-U01.md), usando a nova porta e este script. O perfil de teste tem zoom/fonte restaurados ao finalizar. Não usar perfil pessoal para automação.

## Roteiro manual — Microsoft Narrador com Microsoft Edge

**Estado de execução de todo este roteiro: não executado nesta sessão.** A existência do Narrador no Windows não é evidência de execução. Esta seção é um instrumento de registro para o pesquisador, não um resultado com participantes. Os procedimentos não modificam instrumentos da tese.

### Preparação e registro do ambiente

1. Executar `npm run dev` e abrir `http://127.0.0.1:5173` em **Edge visível**. Fechar outras abas que possam confundir a leitura. Usar os dados fictícios do app; não abrir serviços, contas ou configurações reais do celular.
2. Registrar: data ___; Windows/versão ___; Edge/versão ___; Narrador/versão ___; zoom ___; resolução ___; voz/idioma ___; modo de varredura inicial ___; código do registro ___ . Não é necessário identificar pessoa ou participante.
3. Começar com zoom 100% e voz audível. Ativar/desativar Narrador por **Windows+Ctrl+Enter**. Caps Lock ou Insert é a tecla Narrador padrão; **Narrador+Espaço** alterna o modo de varredura. [Comandos oficiais da Microsoft](https://support.microsoft.com/pt-br/accessibility/windows/narrator/appendix-b-narrator-keyboard-commands-and-touch-gestures).
4. Em modo de varredura, usar setas para leitura, **H/Shift+H** para títulos e **K/Shift+K** para links. Para interação, usar Tab/Shift+Tab, Enter e Espaço conforme o controle. Se o modo de varredura interceptar setas dos rádios, alterná-lo para interagir e registrar a mudança. [Modo de varredura no Edge](https://support.microsoft.com/pt-br/accessibility/windows/narrator/chapter-3-using-scan-mode).
5. Em cada teste registrar fala observada, controle/foco, silêncio/duplicação inesperada, modo ativo e evidência. A formulação exata da voz pode variar: julgar a informação transmitida, não igualdade literal de frases. Esperar a fala terminar antes da próxima ação; não há prazo para concluir.
6. Classificar após execução como Aprovado, Reprovado ou Não verificado, justificando impedimentos. Não marcar aprovação por uma inspeção do DOM. Para nova rodada, usar Reiniciar/ Repetir ou recarregar; o estado em memória será descartado.

### Casos de execução e campos de observação

Todos os campos de observado estão intencionalmente vazios. Todos os resultados abaixo permanecem **Não executado — Não verificado** até preenchimento pelo pesquisador.

| ID / tela | Ação do pesquisador | Comportamento esperado | Comportamento observado / evidência | Resultado inicial |
| --- | --- | --- | --- | --- |
| N01 — início | Abrir/recarregar página e ler título/h1/regiões | Identificação “Seu percurso”, Trilhas 60+, aviso de demonstração; marca não anunciada repetidamente como conteúdo sem função | __________________ | Não verificado |
| N02 — skip link | Tab inicial, ouvir nome, Enter | Link “Ir para o conteúdo principal”; foco/leitura no conteúdo principal; continuação operável | __________________ | Não verificado |
| N03 — percurso | Ler títulos, listas e nós; completar checklist abaixo com H/K ou Tab | Três trilhas, dez unidades, vinte missões em ordem; código, título, modalidade e disponibilidade compreensíveis; linhas/ícones decorativos sem leitura indevida | __________________ | Não verificado |
| N04 — atalhos | Expandir “Escolher outra trilha”, ativar uma trilha; usar primeira missão disponível | Estado expandido/recolhido e destino compreensíveis; foco no título/nó correspondente; nenhum bloqueio por desempenho | __________________ | Não verificado |
| N05 — abrir M01 | Ativar nó M01 e ler apresentação | Título de página/missão identificável; objetivo e cenário lidos; aviso de simulação claro | __________________ | Não verificado |
| N06 — instruções M01 | Conhecer atividade → ler instruções → começar | Lista de orientações e ação principal nomeadas; nova tarefa e etapa reconhecíveis após começar | __________________ | Não verificado |
| N07 — botões M01 | Identificar Recados e Calendário sem visão; abrir Calendário antes do pedido | Botões com nomes explícitos, tela atual reconhecível; feedback orienta recuperação sem perda/penalidade | __________________ | Não verificado |
| N08 — recuperar M01 | Voltar ao início; Recados → início → Calendário → início → Recados → início | Mudanças de tela e tarefa identificáveis; conclusão somente após retorno final; feedback compreensível | __________________ | Não verificado |
| N09 — ajuda | Em rodada auxiliar, abrir/fechar Ajuda por Enter/Espaço | Nome e estado coerentes; conteúdo alcançável; fechamento mantém contexto/foco no acionador | __________________ | Não verificado |
| N10 — informações | Na prática, expandir Sobre esta demonstração e Localização da missão | Objetivo, cenário, instrução integral, critérios/progresso e breadcrumbs acessíveis; distinguir etapa visual de objetivos praticados | __________________ | Não verificado |
| N11 — opções | Abrir Opções, interromper, retomar; testar voltar etapa e reiniciar em rodada auxiliar | Opções nomeadas e alcançáveis; foco/tarefa restaurados após retomada; reinício informado, sem conclusão indevida | __________________ | Não verificado |
| N12 — abrir M02 | Voltar ao percurso e abrir M02 sem concluir M01, se necessário em rodada nova | M02 acessível livremente; título, objetivo, cenário e instruções identificáveis | __________________ | Não verificado |
| N13 — dificuldade M02 | Começar; escolher som e depois leitura | Feedback explica que volume não aumenta letras; escolha inadequada continua editável; instrução seguinte reconhecível | __________________ | Não verificado |
| N14 — controles M02 | Ler grupo Apresentação; alternar rádios; abrir Outros ajustes | Legend/grupo, nomes, selecionado/não selecionado e expansão comunicados; não depender da cor | __________________ | Não verificado |
| N15 — ajuste inadequado | Manter Padrão, mudar brilho/volume e aplicar | Explicação anunciada; não avança para resposta; foco/contexto preservados. Repetir uma escolha inadequada e conferir novo anúncio | __________________ | Não verificado |
| N16 — aplicar e convite | Escolher Texto ampliado ou Modo de leitura e aplicar | Convite completo legível pelo leitor, com Dia/Horário/Local; reconhecimento do ajuste sem inferir domínio ou nota | __________________ | Não verificado |
| N17 — resposta inadequada | Escolher Coreto da Praça das Flores | Feedback explica divergência e orienta consultar Local; ajustes preservados; anúncio útil, sem assertividade excessiva ou silêncio indevido | __________________ | Não verificado |
| N18 — desfazer | Antes da resposta correta, desfazer e reaplicar outra apresentação | Volta às configurações com padrão reconhecível; necessidade de reaplicar; foco na tarefa reaberta | __________________ | Não verificado |
| N19 — concluir M02 | Selecionar Salão de leitura do Centro Comunitário | Conclusão reconhecida após critérios; mensagem e título perceptíveis; nenhum percentual de domínio/nota | __________________ | Não verificado |
| N20 — desfazer após concluir | Desfazer apresentação e consultar reconhecimento | Prévia volta ao padrão, mas prática concluída permanece reconhecida; sem nova conclusão ou penalidade | __________________ | Não verificado |
| N21 — repetir e retornar | Repetir; voltar ao percurso da U01 | Nova tentativa identificável; retorno anuncia/posiciona U01; percurso não atribui conclusão persistente | __________________ | Não verificado |
| N22 — foco e reversão | Repetir pontos com Shift+Tab, abrir/fechar painéis; testar Escape onde houver contrato | Sem armadilha. Não se exige Escape para details/ajuda não modal; Enter/Espaço no acionador fecha. Leitura e foco não ficam em conteúdo recolhido | __________________ | Não verificado |

### Checklist dos vinte nós

Para cada nó, registrar nome ouvido, modalidade e estado. M01/M02 devem ser Disponíveis; M03–M20, Em desenvolvimento, com proposta informativa. Não é preciso abrir cada proposta para conferir o rótulo, mas M01/M02 devem ser abertas nos casos acima. Títulos abaixo foram transcritos da fonte curricular vigente, apenas como referência de inspeção.

| Nó | Nome / modalidade / estado esperado | Nome e estado ouvidos / observações | Resultado inicial |
| --- | --- | --- | --- |
| M01 | Encontrar os caminhos da tela · A — Guiada · Disponível | __________________ | Não verificado |
| M02 | Preparar a tela para ler um convite · B — Aplicação · Disponível | __________________ | Não verificado |
| M03 | Preparar uma mensagem para o grupo · A — Guiada · Em desenvolvimento | __________________ | Não verificado |
| M04 | Compartilhar o arquivo certo com a pessoa certa · B — Aplicação · Em desenvolvimento | __________________ | Não verificado |
| M05 | Transformar uma dúvida em busca · A — Guiada · Em desenvolvimento | __________________ | Não verificado |
| M06 | Encontrar uma atividade no bairro · B — Aplicação · Em desenvolvimento | __________________ | Não verificado |
| M07 | Investigar de onde veio a notícia · A — Guiada · Em desenvolvimento | __________________ | Não verificado |
| M08 | Decidir antes de compartilhar · B — Aplicação · Em desenvolvimento | __________________ | Não verificado |
| M09 | Cuidar da senha e do código de acesso · A — Guiada · Em desenvolvimento | __________________ | Não verificado |
| M10 | Escolher o que pode ser compartilhado · B — Aplicação · Em desenvolvimento | __________________ | Não verificado |
| M11 | Interromper um pedido suspeito · A — Guiada · Em desenvolvimento | __________________ | Não verificado |
| M12 | Conferir um pedido de Pix com segurança · B — Aplicação · Em desenvolvimento | __________________ | Não verificado |
| M13 | Examinar um endereço antes de abrir · A — Guiada · Em desenvolvimento | __________________ | Não verificado |
| M14 | Sair de uma mensagem e buscar o caminho seguro · B — Aplicação · Em desenvolvimento | __________________ | Não verificado |
| M15 | Encontrar a informação de um serviço essencial · A — Guiada · Em desenvolvimento | __________________ | Não verificado |
| M16 | Planejar um atendimento de saúde simulado · B — Aplicação · Em desenvolvimento | __________________ | Não verificado |
| M17 | Escolher um aplicativo para uma necessidade · A — Guiada · Em desenvolvimento | __________________ | Não verificado |
| M18 | Revisar permissões em uma situação prática · B — Aplicação · Em desenvolvimento | __________________ | Não verificado |
| M19 | Pedir ajuda sem compartilhar segredos · A — Guiada · Em desenvolvimento | __________________ | Não verificado |
| M20 | Construir e experimentar um plano de autonomia · B — Aplicação · Em desenvolvimento | __________________ | Não verificado |


### Encerramento da rodada manual

Registrar: testes aprovados ___; reprovados ___; não verificados ___; problemas e passos de reprodução ___; capturas/transcrição somente do app ___; decisão de reinspeção ___ . Desativar o Narrador com Windows+Ctrl+Enter ao terminar. Anexar o registro preenchido como evidência nova, sem alterar este documento para sugerir que a execução ocorreu nesta sessão.

## Pendências

1. Executar e registrar N01–N22 e o checklist de nós com Narrador/Edge reais; avaliar fala, descoberta e retomada de contexto.
2. Confirmar em dispositivo físico, alto contraste/cores forçadas e configurações diferentes. Esta medição não cobre todas as combinações possíveis.
3. O círculo de seleção nativo teve rótulo/estado conferidos, mas seu contraste gráfico específico não foi avaliado aqui; não generalizar a aprovação do texto para todo o controle.
4. Manter os cinco resultados brutos do axe como inconclusivos; a evidência dirigida fecha o contraste do texto visível, não transforma o algoritmo em resultado automático aprovado.
5. Não avançar para M03/M04, serviços, dados ou publicação sem autorização. O fechamento é técnico e parcial, sem envolver participantes nem modificar instrumentos da tese.
