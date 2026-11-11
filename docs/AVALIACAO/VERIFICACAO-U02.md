# Verificação de implementação — U02 Comunicação digital

Registro histórico da entrega U02. Rodada posterior autorizou M05/M06 e investigou os três inconclusivos de contraste sem alterar as cores: ver [VERIFICACAO-U03](VERIFICACAO-U03.md#investigação-separada-dos-três-contrastes-u02). Os resultados desta página são os da rodada original e permanecem preservados.

10/11/2026 · Trilhas 60+ `0.1.0-dev` · implementação local autorizada somente de M03/M04, sem publicação ou coleta.

## Referências e divergências tratadas

Inspecionados AGENTS, arquitetura, fichas M03/M04 (campos 1–20), matriz/rastreabilidade, sistema de design, UX-01, verificação/fechamento U01 e diário DSR. As fichas e os metadados canônicos prevaleceram. A autorização deste ciclo permite M01–M04 executáveis; M05–M20 continuam informativas. Não altera instrumentos T0/T1/T2, IMI ou SUS.

| Orientação | Tratamento adotado |
| --- | --- |
| Pedido descreve M03 genericamente como informar atividade comunitária; ficha exige confirmar participação no grupo de leitura | Mantidos **objetivo e cenário aprovados**, sem transcrever a descrição genérica para o currículo. O pedido executável é confirmar participação no Grupo de leitura |
| M04 no pedido enfatiza arquivo/destino/revisão; ficha também exige mensagem de contexto e o programa da oficina para pessoa indicada | Mantido programa da oficina, pessoa da equipe de leitura e **frase que identifica o material**. Cartaz e documento sintético não substituem o programa |
| Ficha prevê alternativa de áudio sintético; pedido autoriza componente visual com transcrição, sem microfone | Implementada **representação de áudio**, explicitamente sem gravação, reprodução sonora ou autoria vocal do participante. Transcrição é conferida por ação. Texto é caminho equivalente; áudio não é obrigatório |
| CP-U02 prevê reprodução/pausa de áudio e imagem pública pertinente em complemento presencial | Reprodução/pausa reais **não foram implementadas**. O cartaz público é distinto do documento indevido, mas compartilhá-lo não atende ao pedido central do programa. Não se declara cobertura integral do complemento presencial |

Os originais dos instrumentos da tese continuam pendentes de conferência para não sobreposição literal; nenhuma informação ausente foi inventada. Conteúdos das simulações são autorais e fictícios, não tarefas de avaliação copiadas.

## Funcionamento e critérios observáveis

### M03 — Preparar uma mensagem para o grupo

Na apresentação/instruções existentes, a pessoa conhece o objetivo aprovado. Na prática, seleciona destinatário, saudação, frase de confirmação e fechamento por controles nomeados. Há duas formulações pertinentes de confirmação, duas saudações e dois fechamentos respeitosos; não há texto livre, contato real ou interpretação de digitação.

A alternativa de áudio está sob demanda. Ao escolhê-la, a interface mostra a composição como transcrição de um áudio fictício, sem som, gravação ou microfone. É necessário acionar “Conferir transcrição” antes da prévia nessa alternativa. Mudar frases invalida essa conferência; optar por texto elimina a exigência específica de áudio. Não se avalia acuidade auditiva.

Concluir exige:

1. Grupo de leitura selecionado; saudação/fechamento escolhidos e conteúdo confirmando participação.
2. Abrir a prévia pertinente e marcar “Conferi o destinatário e o conteúdo desta prévia”.
3. Acionar **Simular envio**. A conversa de exemplo é atualizada somente em memória, com feedback e reconhecimento de prática.

Abrir conversa/prévia, pedir ajuda ou pressionar envio antes da revisão não conclui. Corrigir escolhas preserva a composição, volta à preparação e exige nova prévia/revisão. Trata-se de confirmação observável na UI, não prova de leitura atenta, aprendizagem ou domínio.

### M04 — Compartilhar o arquivo certo com a pessoa certa

Coleção interna fechada com três itens: programa textual da oficina, cartaz ilustrado público e imagem de documento sintético. A pessoa escolhe um item, abre seu conteúdo, seleciona a pessoa da equipe de leitura e uma frase de contexto. Nome, tipo, descrição e seleção são textuais; não dependem da miniatura.

O documento sintético contém **Nome: Pessoa Fictícia / Contato: CONTATO INVENTADO**, marcado sem validade. São campos inventados, sem vínculo com pessoas reais. Feedback explica que são desnecessários ao pedido, permite inspeção/remoção e impede seguir para a prévia enquanto o arquivo indevido estiver escolhido. Nenhum arquivo do dispositivo pode ser carregado.

Concluir exige:

1. Programa correto selecionado e **conferido para esse anexo**, pessoa indicada (não grupo público) e contexto pertinente.
2. Prévia aberta e confirmação explícita de revisão do destinatário/conteúdo.
3. Acionar **Simular compartilhamento**, sem documento indevido anexado.

Trocar/remover anexo invalida sua conferência. Corrigir a prévia invalida a confirmação de revisão. Novas tentativas preservam escolhas úteis, sem desconto ou limite de tempo. A mensagem final descreve somente compartilhamento simulado.

## Motor, componentes e eventos

- Uma modalidade `communication`, com variação de conteúdo `message`/`file`, compartilha estado e validador puro em `src/domain/missions/communication.ts`. Não há segundo motor de fases, pontuação ou conclusão paralela.
- Novos contratos em `types.ts`: opções e arquivos sintéticos, estado e ações tipadas. Campos guardam IDs autorais/flags, sem texto livre. `CommunicationStep` é prepare/preview/done.
- O redutor existente resolve a modalidade, conserva ajuda, retorno/checkpoints, pausa/retomada, reinício e repetição. `edit-draft` é tratado como revisão regressiva: não emite `step_completed` nem deixa checkpoint posterior restaurar confirmação incompatível.
- `MissionRunner`, `MissionFeedback`, `MissionCompletion`, `MissionProgress`, HelpButton e controles compartilhados são reutilizados. O renderer novo é `CommunicationActivity`, com PhraseChoices e AudioAlternative internos. O painel de áudio volta aberto ao editar composição em áudio; mudar para texto não oculta o rádio que mantém foco.
- As definições estão em `src/data/communicationMissions.ts`; título/objetivo/cenário são obtidos do currículo. Registro existente disponibiliza as quatro missões, sem duplicar os metadados canônicos.
- SVGs locais em `public/simulations` ilustram cartaz/documento. Não usam marca proprietária, fonte externa, script, embed ou dados do dispositivo. PNGs oficiais intactos.

Critérios internos das duas definições: `prepared`, `reviewed`, `sent`. Eles dependem da validação do conjunto, não de contagem de telas. Etapas visuais e reconhecimento não são nota de pesquisa ou progresso persistente.

Eventos mantêm os **doze tipos existentes**, schemaVersion 2, source `local-demo`, códigos M03/M04 e U02, sequence e attempt. Definições novas usam `0.1.0-u02.1`; M01/M02 mantêm sua versão anterior. Ações como select-recipient, select-file, inspect-file, open-preview, set-review e simulate-send entram somente como **tipo da ação**. ID escolhido, texto da mensagem, conteúdo/imagem, destinatário e nomes de arquivo não são incluídos no evento.

Ajuda é evento próprio, separado de erro. Erro/nova tentativa e conclusão seguem o redutor existente. Repetir preserva o histórico limitado aos 200 itens mais recentes, sem sobrescrever indevidamente a tentativa anterior. Desmontar/recarregar descarta tudo. Não há rede, exportação, data, identidade ou armazenamento. Não se trata do contrato futuro E1–E8 de pesquisa.

## Rotas, percurso e compatibilidade

- M03: `/trilhas/primeiros-passos/unidades/comunicacao-digital/missoes/preparar-uma-mensagem-para-o-grupo`.
- M04: `/trilhas/primeiros-passos/unidades/comunicacao-digital/missoes/compartilhar-o-arquivo-certo-com-a-pessoa-certa`.

M01–M04 aparecem **Disponíveis**; M05–M20, **Em desenvolvimento**. M04 pode ser aberta sem concluir M03. “Voltar ao percurso da U02” vai a `/#percurso-u02` e foca seu título, sem atribuir conclusão ao nó. Páginas de trilha/unidade e endereços legados permanecem.

Os três acessos antigos `/desenvolvimento/u01*` continuam limitados à U01. Durante integração, um teste existente detectou que ampliar o registro fazia `/desenvolvimento/u01/m03` redirecionar indevidamente à U02. O resolver de compatibilidade foi restringido a U01; o teste original passou sem remover sua expectativa. Não foram criados aliases de desenvolvimento para M03/M04.

## Competência e rastreabilidade

**C2 — Comunicação e Colaboração Digital → U02 → M03/M04**, conforme lista oficial fornecida pelo pesquisador.

| Requisito / ficha | Implementação observável | Evidência |
| --- | --- | --- |
| RS-M03, campos 4/8/10 | Compor confirmação pertinente, escolher grupo, abrir/revisar prévia e simular envio | Validador compartilhado, critérios e testes M03 |
| RS-M03, campos 9/17 | Texto equivalente, representação de áudio com transcrição, sem microfone e sem áudio obrigatório | UI, testes de transcrição/invalidação e captura M03 áudio |
| RS-M04, campos 4/8/10 | Conferir programa, pessoa destinatária e contexto; revisar/confirmar | Validador e testes de arquivos/contexto/destino |
| RS-M04, campos 5/13/17 | Distinguir documento pessoal sintético, inspecionar/remover, não compartilhar material indevido | Imagem local com alt e texto equivalente, bloqueio/feedback e testes |
| RS01/RS06 | Conteúdo e biblioteca internos, sem envio ou APIs reais | Inspeção de código, teste de ausência de input file/áudio livre e eventos sem payload |
| RS02/RS03/RS08 | Critérios reais, feedback, ajuda e revisão/repetição sem penalização | Testes de ciclo/estado e interface |
| RS04/RS05 | Controles nativos nomeados, foco e feedback; zoom/reflow | axe parcial, Chrome real e capturas; leitor de tela/dispositivos ainda pendentes |

A associação temática não demonstra desenvolvimento integral da competência, autonomia, eficácia ou validade dos instrumentos.

## Testes e verificação técnica

`npm run check` aprovado: **225 testes em quinze arquivos**, lint sem avisos, TypeScript e build sem erros. Node.js continua 20.17.0 e bibliotecas/lockfile não foram alterados.

Os **191 casos anteriores foram preservados**. Somente expectativas de disponibilidade em LearningPath/CurriculumMigration foram atualizadas para quatro atividades e dezesseis propostas; o caso de proposta informativa passou de M03 para M05, mantendo a verificação. A regressão do endereço antigo de M03 foi preservada e revelou o problema corrigido.

Novos testes: **23 de domínio e 11 de interface**. Cobrem destinatário, conteúdo, alternativas pertinentes, transcrição, arquivo/inspeção, dados pessoais sintéticos, remoção, contexto, prévia, revisão, envio antecipado, edição, ajuda, pausa, retorno, repetição, conclusão, eventos e percurso. Uma regressão adicional confere que mudar áudio para texto mantém o controle focado e visível. Os testes M01/M02 continuam aprovados; hashes de seus validadores navigation.ts/reading.ts, currículo e PNGs oficiais coincidem com a verificação anterior.

[Registro dos hashes preservados](evidencias/U02/preservacao-u01.json). O código de produção foi inspecionado sem chamadas a fetch, getUserMedia, MediaRecorder, storage, sendBeacon, XMLHttpRequest ou Supabase. Os scripts de inspeção locais usam CDP/fetch fora do produto, sem instrumentar participantes.

### Navegador e acessibilidade

Chrome `157.0.8103.50` headless isolado; eventos Tab/Enter/Espaço/setas via CDP. Sem clique/foco programático para executar os percursos do roteiro. Viewports 360 × 900 e 1280 × 900; condição adicional 320 × 900 emulada. Zoom **nativo** do Chrome a 200%/400%, em janela cujo conteúdo inicial é 1280 × 900: larguras internas 640/320, DPR 2/4, escala visual 1. Não equiparar isso ao redimensionamento emulado ou a aparelho físico.

Foram registrados **40 estados**, oito por condição: preparação/áudio/prévia/conclusão M03 e anexo indevido/preparação/prévia/conclusão M04. Todos passaram nas verificações de layout sem overflow/clipping; os cinco percursos concluíram e retornaram com foco U02. Axe-core incluiu contraste/target-size em Chrome e não apontou violações. **Três estados a 320 px tiveram contraste inconclusivo** (M03 preparação/prévia e M04 anexo indevido), mantidos como não verificados nessa parte; não se afirma conformidade integral. Os resultados armazenam `statusContraste` separado de aprovação geométrica.

A primeira execução longa do utilitário foi interrompida ao procurar controles de anexo em 320 px. A reprodução isolada passou; foram acrescentadas esperas explícitas por título/controles da missão após navegação. A execução final completa passou nas cinco condições, sem atribuir esse incidente transitório a um defeito comprovado do produto.

A apresentação preserva UX-01: tarefa/instrução/interação antes de detalhes; informações técnicas e opções secundárias sob demanda. Escolhas essenciais estão expostas. O destinatário selecionado também aparece como texto com quebra de linha, evitando depender da parte visível de um select estreito. O anúncio de feedback usa a região existente polite/atomic; a conversa inteira não recebe aria-live.

Capturas foram examinadas visualmente, incluindo M03 prévia a 360 e M04 preparação a 1280/anexo indevido a 360. O formulário/compositor ainda requer rolagem no mobile, especialmente com áudio/arquivos expandidos; não houve avaliação de compreensão ou esforço com pessoas idosas.

### Evidências e reprodução

- [Resultados, dimensões, foco, auditorias e percursos](evidencias/U02/resultados.json).
- M03: [360, preparação](evidencias/U02/360-m03-preparacao.png), [360, áudio](evidencias/U02/360-m03-audio.png), [360, prévia](evidencias/U02/360-m03-previa.png), [1280, prévia](evidencias/U02/1280-m03-previa.png).
- M04: [360, documento indevido](evidencias/U02/360-m04-anexo-indevido.png), [360, prévia](evidencias/U02/360-m04-previa.png), [1280, preparação](evidencias/U02/1280-m04-preparacao.png), [1280, prévia](evidencias/U02/1280-m04-previa.png).
- Zoom/reflow: [M03 zoom 200%](evidencias/U02/zoom200-m03-previa.png), [M04 zoom 400%](evidencias/U02/zoom400-m04-previa.png), [M04 a 320](evidencias/U02/320-m04-previa.png).

Executar app com `npm run dev`; testes normais com `npm run check`. Para repetir a inspeção opcional, Vite em 5173 e Chrome com perfil temporário, `--headless=new --window-size=1280,1000 --remote-debugging-port=9228 --user-data-dir=<perfil-isolado>`, conforme o procedimento já documentado da U01; executar `node scripts/verificar-u02.mjs`. O argumento opcional 320 executa somente essa condição e grava resultado separado. Usa dependências já instaladas, não altera persistência do app. As imagens mostram viewports reais de navegador, não dispositivos físicos.

## Limitações e próximas verificações

- **Narrador/Edge ainda não executado.** Acrescentar à rodada manual: anúncio do select/destino selecionado, nomes dos grupos de frases, transcrição, alteração áudio→texto, prévia/checkbox de revisão, arquivo conferido/removido, imagem com alt, erros e foco ao editar/retomar/retornar. Registrar esperado/observado; DOM/axe não substituem fala real.
- Verificar fisicamente toque, orientação, alturas menores, alto contraste e indicadores nativos. Rastrear os três resultados inconclusivos de contraste desta rodada antes de aprovação ampla.
- Avaliar carga, descoberta da alternativa de áudio e distinção preparar/revisar/enviar com mediação e pessoas idosas em etapa autorizada. Não inferir competência pela quantidade de eventos ou ausência de ajuda.
- Conferir não sobreposição frente aos instrumentos originais; validar tempo estimado e materiais CP-U02. Reprodução/pausa sonora e compartilhamento alternativo de imagem pública não foram antecipados.
- Esta verificação é **intermediária**, não D07, teste de usabilidade, validação pedagógica ou conformidade integral WCAG 2.2.

M05–M20, Supabase, autenticação, progresso persistente, telemetria real, envio, microfone, câmera, contatos/galeria e publicação não foram implementados. Qualquer próxima missão ou serviço exige nova autorização.
