# Verificação de implementação — U03 Pesquisa de informações

10/11/2026 · Trilhas 60+ `0.1.0-dev` · verificação intermediária de desenvolvimento. Não é D07, teste de usabilidade com pessoas idosas, validação pedagógica ou declaração de conformidade integral WCAG 2.2.

## Escopo e fontes

Lidos AGENTS, arquitetura do motor, fichas M05/M06, matriz e rastreabilidade, sistema de design, diário DSR, UX-01 e verificação U02; inspecionados os três validadores anteriores, redutor, componentes e testes. A autorização deste ciclo acrescenta somente M05/M06: M01–M06 disponíveis e M07–M20 informativas, sem publicação, serviços externos ou persistência.

As fichas aprovadas prevaleceram sobre a descrição genérica do pedido: M05 procura **horário de biblioteca fictícia**, M06 procura **oficina gratuita de jardinagem no sábado, em bairro determinado**. Títulos, objetivos, cenários e códigos de `src/data/curriculum.ts` não foram modificados. A referência temporal autoral é agosto de 2032; a data de hoje não determina a pertinência das respostas. Não se oferecem horários de serviços reais. Os instrumentos originais continuam indisponíveis para conferência da não sobreposição literal; não foram alterados nem se inventaram itens ausentes.

## Funcionamento e critérios de conclusão

### M05 — Transformar uma dúvida em busca

Cartões Adicionar/Remover montam uma consulta sem digitação ou arraste. Pesquisar executa uma busca determinística local. Consulta ampla retorna biblioteca de outro bairro, agenda antiga e informação incompleta; consulta com horário, biblioteca e bairro Jardim retorna agenda antiga, informação incompleta e horário pertinente. Um cartão fora do assunto produz conjunto vazio, permitindo refazer a busca. Assim, as escolhas alteram efetivamente os resultados.

A pessoa abre detalhes, compara o pedido com conteúdo/origem/data, escolhe o resultado pertinente, organiza, guarda e reabre na coleção da página. Abrir o primeiro resultado, pesquisar ou guardar isoladamente não conclui. Se a primeira consulta já for suficiente, não se exige provocar um erro: refinamento é obrigatório **quando necessário**, após busca insuficiente. Quando necessário, a organização é bloqueada até a nova consulta conter assunto e contexto.

Concluir exige: consulta pertinente; resultado pertinente previamente aberto e selecionado; **guardar e recuperar** esse resultado. O horário recuperado e sua fonte continuam visíveis, somente até sair da página. Feedback explica falta de contexto, diferença de local, data antiga e informação ausente. Reconhecimento permanece o texto da ficha.

### M06 — Encontrar uma atividade no bairro

Pedido concreto: oficina gratuita de jardinagem no bairro Jardim, sábado, 21 de agosto de 2032, às 9h. A busca contextual oferece quatro resultados: outro município, encontro encerrado em 2031, convite incompleto e programa pertinente. Todos têm a mesma estrutura textual; não há selo de confiança por aparência, posição ou marca.

É necessário abrir pelo menos três resultados e acionar o quadro comparativo. O quadro expõe local, dia, custo, origem e atualização dos resultados consultados. Para a escolha pertinente, a pessoa também consulta **Origem** e **Atualidade**; conferir outro resultado não satisfaz esses requisitos. Essa é evidência de ação observável, não prova de leitura ou compreensão.

Depois da escolha, um lembrete por cartões deve preservar **dia, local e fonte**. Cartão ausente ou incoerente bloqueia guardar, com orientação para revisão. Guardar não encerra: é preciso reabrir a informação para concluir. O resultado recuperado inclui o lembrete e sua fonte.

Concluir exige: consulta com tema/bairro; resultado adequado; comparação e consultas de origem/data vinculadas à escolha; lembrete coerente; guardar e recuperar. Refinar descarta conferências/coleção anteriores; rever escolha descarta seleção e organização. Ajuda, retorno, pausa/retomada, reinício e repetição reutilizam o ciclo comum, sem penalização.

## Implementação técnica

| Arquivo / componente | Responsabilidade |
| --- | --- |
| `src/data/searchMissions.ts` | Duas definições versionadas, palavras, fontes/datas/resultados autorais, cartões, ajuda e feedback; metadados vêm do currículo aprovado |
| `src/domain/missions/search.ts` | Busca e validação puras; nenhum React, relógio, armazenamento ou fornecedor |
| `src/domain/missions/types.ts` | SearchDefinition/State/Action e SearchStep em uniões discriminadas |
| `src/components/missions/SearchActivity.tsx` | Formulário por cartões, lista semântica, detalhes, comparação responsiva e coleção/lembrete |
| `execution.ts`, `MissionRunner.tsx` | Integração no único redutor/renderer; refinar/editar tratados como revisão, sem step_completed indevido |
| `demoMissions.ts`, HomePage | Registro de M05/M06 e aviso de disponibilidade; rotas derivadas do currículo |
| `search.test.ts`, `SearchMissions.test.tsx` | Regressão de busca, critérios, ciclo de vida, eventos, foco, rotas e axe em jsdom |
| `scripts/verificar-u03.mjs`, `scripts/investigar-contraste-u02.mjs` | Inspeção opcional via Chrome isolado/CDP e evidências locais de desenvolvimento |

Não foram adicionadas dependências, frameworks ou APIs. Node permanece 20.17.0. [Hashes de preservação](evidencias/U03/preservacao.json) confirmam currículo, validadores navigation/reading/communication e PNGs oficiais inalterados frente à U02. Os 225 testes anteriores foram preservados, com atualização somente das expectativas de disponibilidade (seis executáveis, quatorze informativas) e transferência do caso informativo do percurso de M05 para M07. Novos 28 casos: vinte de domínio e oito de interface, total **253 em 17 arquivos**.

Eventos continuam nos doze tipos/schemaVersion 2, em memória e limitados a 200 itens, sem consultas, palavras, cartões, resultado selecionado, conteúdo do lembrete ou identidade. `action_performed.action` distingue run-search, refine-search, open-result, select-result, compare-results, inspect-origin/date, set-reminder, save-result e recover-result. Ajuda é help_requested; erro é attempt_incorrect; sequência monotônica e conclusão única foram testadas. Repetição preserva eventos anteriores dentro do limite, com novo ordinal de tentativa. Nada é transmitido, exportado ou persistido. Eventos não constituem pontuação ou Learning Analytics de pesquisa.

## Cobertura da competência oficial 3

**Pesquisa e Gestão de Informação**: formulação por cartões e palavras relevantes; refinamento condicionado à insuficiência; identificação de origem; verificação de atualidade em referência explícita; comparação; organização e recuperação. M05 é guiada e M06 contextualizada. Não se presume competência adquirida pela conclusão.

**CP-U03 permanece presencial, previsto e não executado**, conforme matriz e campos 18 das fichas. Roteiro de cerca de 15 minutos: apresentar necessidade administrativa sobre horário de atendimento de um Centro de Saúde Aurora **inteiramente fictício**; montar consulta com assunto/unidade/bairro (7 minutos); comparar cartão antigo com cartão do mês de referência e referência independente do guia comunitário fictício; justificar pertinência/autoria/data e guardar/recuperar um lembrete por cartões de horário/canal/fonte (8 minutos). As duas fontes devem estar identificadas como materiais autorais, sem logomarca como garantia. Sem sintomas, aconselhamento clínico, localização real, dados pessoais ou acesso a serviços. Materiais finais e não sobreposição aos instrumentos originais dependem de revisão pelo pesquisador; não foram incorporados como critérios adicionais de M05/M06 nem apresentados como aplicação T0/T1/T2.

## Verificações executadas

| Requisito / procedimento | Resultado | Evidência / limite |
| --- | --- | --- |
| Formulação, vazio, consulta ampla/específica, refinamento e conjuntos distintos | Aprovado automatizado | Vinte casos de domínio, incluindo guardas, distratores e lembrete |
| Impedir conclusão prematura, exigir recuperação, revisão, ajuda, pausa e repetição | Aprovado automatizado e percorrido em Chrome | Testes e cinco percursos; clique não comprova compreensão |
| Acesso direto, rotas oficiais e retorno com foco U03 | Aprovado automatizado e Chrome | Vinte nós preservados, quatorze propostas informativas, nenhum progresso fictício |
| 360 × 900 e 1280 × 900 | Aprovado nos estados examinados | Nove estados por perfil; 360 usa viewport emulado, sem alegação de dispositivo físico |
| Zoom real 200%, base 1280 × 900 | Aprovado nos estados examinados | Configuração nativa Chrome, largura interna 640/área útil 632; não CSS zoom ou DPR artificial |
| Zoom real 400%, base 1280 × 900 | Aprovado nos estados examinados | Largura interna 320/útil 316; altura 225; reflow e ações acessíveis por rolagem vertical |
| Viewport emulado 320 × 900 | Aprovado nos estados examinados | Área útil 305 pela barra; distinto do zoom real, com registros separados |
| Teclado Tab/Enter/Espaço/setas, foco no detalhe/conclusão/retorno e recuperação | Aprovado nos cinco percursos programados | Sem armadilha observada nessas trajetórias; não inspeção exaustiva humana de toda combinação |
| Axe-core 4.10.3 no Chrome, incluindo contraste e target-size | Zero violações nos 45 estados | Um contraste inconclusivo: perfil 320, M06 comparação, mesmo skip link oculto; resultado bruto permanece não verificado |
| Ampliação somente de texto, cores forçadas, todos os estados hover/seleção de controles nativos | Não verificado nesta rodada U03 | Não inferir dos resultados históricos U01 nem de zoom de página |
| Narrador/Edge ou NVDA real; dispositivos físicos; compreensão e usabilidade | Não verificado | Roteiro manual abaixo; sem participantes ou fala assistiva observada |

Fonte raiz 18px, controles confortáveis e foco visível reaproveitam os tokens. Lists, headings, form/fieldset e labels relacionam consulta, resultados e lembrete; origem/data são texto. `aria-expanded` identifica painéis e detalhes; feedback permanece polite/atomic. Selects têm rótulo estável e descrição separada com o cartão inteiro, pois uma opção longa pode exceder a área visível de um select estreito. Nenhuma informação essencial depende apenas de cor.

Foram corrigidas durante o desenvolvimento: reabrir o mesmo detalhe agora move foco ao conteúdo; guardar, ao remover seu botão, foca a coleção; rótulo do select não muda quando seu valor é exibido por extenso. Reinspeção automatizada passou. Não houve alteração de tokens, marca ou critérios aprovados.

A primeira inspeção em servidor com recarga automática teve reinicializações da página enquanto arquivos eram editados. A reprodução isolada passou; a rodada final usou **build estático em preview**, sem recarga de desenvolvimento. Ela terminou com 45 estados e cinco percursos aprovados, sem erros. Não se atribuiu o incidente a defeito comprovado no produto. Há rolagem vertical extensa nos resultados/comparações, especialmente com zoom; carga e compreensão permanecem oportunidades para avaliação, sem reduzir texto necessário por presunção.

### Evidências visuais e reprodução

- [Galeria dos 45 estados](evidencias/U03/galeria.html), [resultados brutos e dimensões](evidencias/U03/resultados.json), [preservação](evidencias/U03/preservacao.json).
- M05: [360 — consulta](evidencias/U03/360-m05-consulta.png), [360 — refinada](evidencias/U03/360-m05-refinada.png), [1280 — refinada](evidencias/U03/1280-m05-refinada.png), [200% — coleção](evidencias/U03/zoom200-m05-colecao.png).
- M06: [360 — comparação](evidencias/U03/360-m06-comparacao.png), [360 — recuperação](evidencias/U03/360-m06-recuperada.png), [1280 — lembrete](evidencias/U03/1280-m06-lembrete.png), [400% — lembrete](evidencias/U03/zoom400-m06-lembrete.png).

As capturas são de viewport após navegação por teclado, com rolagem/foco do estado e, quando aberto, popup nativo do select; não são imagens de dispositivos físicos nem capturas completas da página. Foram examinadas visualmente consulta M05 a 360, lembrete M06 a 1280 e conclusão M06 a 360, além das medidas automatizadas dos demais estados.

Reproduzir: `npm run check`, `npm run preview -- --port 5175`; iniciar Chrome isolado com perfil temporário e `--headless=new --window-size=1280,1000 --remote-debugging-port=9229`. Em PowerShell, definir `$env:TRILHAS_QA_URL='http://127.0.0.1:5175'` e executar `node scripts/verificar-u03.mjs`. Argumento opcional `320` grava resultado separado. O utilitário restaura zoom/fonte no perfil isolado, sem tocar no perfil pessoal. Os scripts não integram o bundle do aplicativo.

## Investigação separada dos três contrastes U02

Chrome 157.0.8103.50, viewport emulado 320 × 900, zoom 100%, raiz 18px. Reproduzidos oito estados de U02 e os três inconclusivos; os resultados históricos não foram sobrescritos. [Dados e medições dirigidas](evidencias/U03/contraste-u02/resultados-320.json).

| Item original | Elemento / motivo automático | Medição e classificação dirigida |
| --- | --- | --- |
| M03 preparação, 320 | `.skip-link`; axe `elmPartiallyObscuring`, não determina fundo por sobreposição parcial; retângulo fora da janela, topo −104,375 e base −18 | Oculto: medição visual automática **não verificável**. Visível com foco/hover: **aprovado**, texto 11,8655:1 |
| M03 prévia, 320 | Mesmo link, mesma geometria, cores e razão da limitação | Mesmo resultado dirigido, medido separadamente no estado; **aprovado** no foco/hover |
| M04 anexo indevido, 320 | Mesmo link; não é o texto da imagem, o aviso de privacidade ou o radio de arquivo | Mesmo resultado dirigido, medido separadamente; **aprovado** no foco/hover |

Cores computadas efetivas: texto `rgb(23,62,49)` / **#173e31**, fundo opaco **#ffffff**, fonte 18px/700, opacidade 1. Quando focado por Tab, topo 18 e base 104,375: link visível com `:focus-visible`. Contorno sólido 3px **#84430e**, contraste **7,5260:1** contra branco e **7,1666:1** contra a página **#f7faf9**. Hover real sobre o link focado preserva essas cores e razões. Cálculo pela luminância relativa sRGB, `(Lmaior + 0,05)/(Lmenor + 0,05)`, sem arredondar antes da comparação.

Texto atende a referência 4,5:1 de [WCAG 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum); contorno excede 3:1 em relação aos fundos adjacentes de [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). Isso não atesta todos os critérios de foco nem conformidade global. Nenhuma inconformidade de contraste foi comprovada nesses itens, portanto **nenhuma cor foi alterada**. Os três registros axe permanecem inconclusivos; a medição dirigida do estado visível é evidência separada. O novo inconclusivo U03 também foi identificado como skip link oculto; seu resultado bruto não foi convertido em aprovação automática.

Capturas dirigidas: [M03 preparação com foco](evidencias/U03/contraste-u02/320-m03-preparacao-foco.png), [M03 prévia com hover/foco](evidencias/U03/contraste-u02/320-m03-previa-foco-hover.png), [M04 com foco](evidencias/U03/contraste-u02/320-m04-anexo-indevido-foco.png). Reproduzir no mesmo Chrome/preview com `node scripts/investigar-contraste-u02.mjs 320`.

## Pendências e roteiro de inspeção humana

Todos os itens abaixo estão **Não verificados**. Executar Narrador/Edge no Windows e registrar versão, data, esperado/observado e resultado, sem substituir fala por DOM/axe:

| Procedimento | Comportamento esperado | Observado / resultado |
| --- | --- | --- |
| Abrir percurso, percorrer vinte nós e abrir M05/M06 | Página/título e disponibilidade anunciados; sem progresso inventado | A preencher — Não verificado |
| Ler objetivo/instruções, adicionar/remover palavras e pesquisar | Nomes/estados de botões, consulta e seção de resultados compreensíveis | A preencher — Não verificado |
| Consultar busca ampla, refinar e provocar escolha antiga/incompleta | Feedback explicado e anunciado; ação de revisão alcançável | A preencher — Não verificado |
| Abrir e reabrir detalhes, origem/data e comparação M06 | Foco no conteúdo aberto, título/estrutura/fontes acessíveis; sem confundir aparência com garantia | A preencher — Não verificado |
| Organizar lembrete e revisar cartões | Rótulos estáveis, opção e descrição integral identificadas; erro anunciado sem apagar escolhas | A preencher — Não verificado |
| Abrir ajuda/opções, interromper, retomar e voltar à etapa anterior | Funções descobertas e operáveis; foco lógico e estado coerente | A preencher — Não verificado |
| Guardar, reabrir, repetir e retornar ao percurso | Foco preservado, recuperação anunciada e retorno ao título U03 | A preencher — Não verificado |

Inspecionar também smartphones físicos, toque, orientação, altura reduzida, fonte ampliada sem zoom, cores forçadas e compreensão da referência temporal/coleção transitória. Revisar extensão da lista e descoberta de comparação/recuperação com o pesquisador; nenhuma melhoria empírica é alegada. Antes de U04, concluir essas pendências e revisar a adequação das evidências de autoria/data, sem antecipar novas missões.

Lint sem avisos, TypeScript sem erros, **253 testes aprovados** e build Vite concluído. Nenhum T0/T1/T2, IMI ou SUS modificado. M07–M20, Supabase, autenticação, persistência, busca externa, Learning Analytics real, ranking e publicação permanecem fora do escopo e dependem de nova autorização.
