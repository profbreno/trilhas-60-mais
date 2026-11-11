# Revisão técnica e pedagógica intermediária — U01

10/11/2026 · Trilhas 60+ `0.1.0-dev` · ambiente local Windows, Node.js 20.17.0.

**Resultado:** M01 e M02 completaram os percursos verificados; não foi encontrada falha de conclusão indevida nos critérios examinados. Foi corrigido um alvo de navegação abaixo da preferência de 48 × 48 CSS px. Permanecem pendências de avaliação humana, tecnologias assistivas e zoom real a 200%.

Esta é uma verificação intermediária de desenvolvimento no ciclo DSR. **Não constitui a inspeção heurística final D07, teste de usabilidade com pessoas idosas, validação pedagógica ou declaração de conformidade integral com WCAG 2.2.** Nenhum participante foi envolvido. Não se inferem aprendizagem, autonomia, eficácia ou duração a partir destes resultados.

## Escopo, fontes e preservação

- Fichas M01/M02, campos 1–20, de [ESPECIFICACAO-20-MISSOES.md](../PEDAGOGIA/ESPECIFICACAO-20-MISSOES.md), matriz e rastreabilidade pedagógicas.
- Metadados oficiais em `src/data/curriculum.ts`; definições em `src/data/demoMissions.ts`; validadores, redutor, componentes e testes existentes.
- [Contrato demonstrativo do motor](../ARQUITETURA/MOTOR-DE-MISSOES.md), separado dos candidatos de pesquisa E1–E8.
- C1 — **Operação Básica e Resolução de Problemas** → U01 → M01 guiada / M02 contextualizada. Não foram alterados objetivos, cenários, critérios ou instrumentos T0/T1/T2, SUS, IMI e entrevistas.
- Os documentos originais da tese e dos requisitos v3.0 não estavam disponíveis neste recorte. A terminologia oficial e a correspondência fornecidas pelo pesquisador foram preservadas. A ausência dos originais impede atestar não sobreposição literal com os cenários de avaliação.
- SHA-256 curricular preservado: `4b116065a7eb3ec2e4b71ebc5cd97bcce37a1aaf8ea64dbcf63b487062c41dfd`, igual ao histórico de migração. Os dois PNGs oficiais mantiveram seus hashes. Versão, dependências e lockfile não foram alterados.

## Método e categorias de evidência

**V — efetivamente exercitado em navegador:** Chrome instalado `157.0.8103.50`, headless, perfil temporário isolado. Interação enviada por Chrome DevTools Protocol com Tab, Enter, Espaço e setas; não foi utilizado `.click()` ou `.focus()` para realizar as tarefas. Capturas reais de página inteira foram examinadas visualmente. Não se trata de sessão manual com usuário humano, smartphone físico ou leitor de tela.

**A — somente automatizado/inspeção de código:** Vitest, Testing Library, jsdom, axe-core, cálculos de tokens e leitura do código. Evidências de estado/eventos provêm do redutor em testes, sem adicionar painel, exportação ou instrumentação à aplicação.

**N — não verificado:** fala efetiva de leitor de tela, zoom real a 200%, toque em aparelho físico, compreensão/tempo/esforço com pessoas idosas e avaliação final de conformidade. Há roteiro para estes itens abaixo.

O [script reproduzível](../../scripts/revisar-u01.mjs) percorreu 32 estados: dez por largura 360/768/1280 px e dois adicionais a 320 px. Altura de viewport: 900 px. A barra de rolagem do Windows deixa respectivamente 345/753/1265/305 px de área útil; essas medidas estão registradas. Os percursos incluem erro, ajuda, interrupção/retomada de M01, conclusão/repetição das duas missões e desfazer/reaplicar de M02. A retomada de M02 e os controles de brilho/volume também foram verificados nos testes de interface/domínio.

## Verificação funcional e pedagógica

“Nenhuma” na gravidade significa ausência de defeito identificado no procedimento, sem garantia sobre situações não examinadas. Pendências de avaliação não são automaticamente falhas do produto.

| Requisito | Procedimento e evidência | Resultado / problema | Gravidade | Correção | Nova verificação / pendência |
| --- | --- | --- | --- | --- | --- |
| M01 abrir Recados | V: iniciar, alcançar Recados por Tab e ativar por Enter; A: validadores/testes | Abre app fictício e valida somente primeiro critério | Nenhuma | Não necessária | Passou nas três larguras |
| M01 Calendário e recuperação | V: escolher Calendário inicialmente por engano, voltar; cumprir Recados → início → Calendário → início → Recados | Tela atual nomeada, erro reversível; Calendário na etapa orientada não é erro | Nenhuma | Não necessária | Passou; critérios anteriores preservados |
| M01 retorno final obrigatório | V: concluir somente após último retorno; A: ações fora de ordem, avanços e checkpoints | Abrir ou percorrer instruções não conclui. Recuperar caminho sem retorno final ainda não conclui | Nenhuma | Não necessária | Testes existentes preservados |
| M01 ajuda e repetição | V: abrir ajuda e repetir após conclusão; A: ajuda em fases e reinício | Ajuda não executa tarefa ou retira critérios; repetição retorna à apresentação | Nenhuma | Não necessária | Histórico temporário preservado até limite documentado |
| M01 interromper/retomar | V: pausar após erro, retomar e continuar; A: isolamento por montagem/rota | Volta ao mesmo estado; somente na página montada | Nenhuma | Não necessária | Sair/recarregar descarta estado, conforme aviso |
| M02 reconhecer dificuldade | V: selecionar som e depois leitura | Feedback explica que volume não muda letras; erro não avança | Nenhuma | Não necessária | Regressão adicional confere foco, status e ausência de conclusão |
| M02 ajustes pertinentes | V: aplicar padrão é recusado; selecionar Texto ampliado e Modo de leitura por setas; A: brilho/volume e prévia | Ambos os modos válidos; brilho/volume sozinhos não completam critério | Nenhuma | Não necessária | Instruções permanecem fora da prévia; som não é reproduzido |
| M02 desfazer | V: desfazer antes de responder, reaplicar outro modo; desfazer após concluir; A: checkpoints | Antes da resposta exige reaplicar. Depois da conclusão desfaz só visual, sem nova conclusão | Nenhuma | Não necessária | Regressão adicional confere foco e critério restaurado |
| M02 recuperar informação | V: escolher Coreto incorretamente, revisar convite e selecionar Salão de leitura do Centro Comunitário | Erro preserva ajustes; resposta adequada conclui somente após etapas anteriores | Nenhuma | Não necessária | Passou nas três larguras |
| M02 ajuda, pausa e repetição | A: testes de ajuda, interrupção/retomada com modo preservado; V: repetição após concluir | Sem pontuação, cronômetro ou perda por pedir ajuda | Nenhuma | Não necessária | Retomada de M02 foi verificada somente por automação jsdom/domínio |
| Sem configurações reais | V: percursos completos apenas no site; A: busca por APIs e leitura dos handlers | Nenhum ajuste de sistema, conexão Wi-Fi ou app real é necessário | Nenhuma | Não necessária | Complemento presencial permanece separado |
| Proteção curricular | A: integridade e hashes; fichas comparadas aos critérios implementados | Correspondência e modalidades A/B preservadas | Nenhuma | Não necessária | Originais dos instrumentos ainda necessários para análise de não sobreposição |

## Experiência do participante e acessibilidade

| Requisito | Procedimento e evidência | Resultado / problema | Gravidade | Correção | Nova verificação / pendência |
| --- | --- | --- | --- | --- | --- |
| Alvos confortáveis | V: medir bounding rectangles de links/botões e rótulos clicáveis dos rádios | Link Início nos breadcrumbs: cerca de 36,19 × 48 px, abaixo da preferência do projeto. Não era uma violação apontada pelo axe | Baixa, regra interna de conforto | `min-width: var(--target-min)` nos links dos breadcrumbs; mínimo também explicitado no cabeçalho, com centralização | 32 estados sem alvo ativo medido abaixo de 48 × 48 px. Script agora contém asserção de regressão |
| Navegação e foco | V: Tab/Enter, setas/Espaço nos rádios; foco no h2 após mudança de etapa/tela; A: rota e skip link | Fluxos operáveis, foco de 3 px, sequência acompanha DOM; sem gesto complexo | Nenhuma identificada | Não necessária | Leitor de tela, Shift+Tab sistemático e foco não encoberto em todas as posições exigem inspeção humana |
| Nomes, semântica e feedback | V + A: axe, h1 único, fieldsets/legends, status persistente polite/atomic; regressões de foco | Sem violações apontadas nos estados examinados. Erro mantém foco no controle quando não muda a tela | Nenhuma identificada | Não necessária | Fala real e concorrência entre anúncio e foco não verificadas |
| Contraste renderizado | V/automação: axe-core 4.10.3 com color-contrast habilitado; A: testes matemáticos de tokens | Zero violações e zero verificações inconclusivas nos 31 estados com cores normais | Nenhuma apontada pela ferramenta | Não necessária | Não cobre manualmente cada combinação/estado, imagens ou toda a interface |
| Cores forçadas / movimento reduzido | V/automação: emular ambos a 320 px | Zero violações; uma verificação **inconclusiva de contraste** em um nó. Não tratada como aprovação | Pendente | Não alterada identidade | Conferir contraste e foco manualmente no modo de alto contraste do sistema |
| Reflow e responsividade | V: larguras solicitadas; M02 ajustes adicionalmente a 320 px; leitura das capturas | Sem largura de documento superior à área útil; botões e texto quebram linha | Nenhuma identificada nos estados | Não necessária | Não equivale a inspeção em dispositivo físico ou de todo estado possível |
| Zoom real a 200% | Tentativa de Ctrl+ no Chrome headless e comparação de métricas | innerWidth 758, DPR 1 e escala 1 antes/depois: zoom não comprovado | N, pendência | Nenhuma simulação foi chamada de zoom real | Roteiro manual obrigatório; não usar deviceScaleFactor ou pinch como substituto |
| Clareza e próxima ação | Fichas/código + capturas: orientação corrente, nome de tela, feedback e ajuda | Linguagem descritiva; cenário fictício explícito. Não há evidência de compreensão por participantes | Oportunidade | Não alterados objetivos/textos aprovados | Observar se “aplicar” e “prévia” são compreendidos |
| Carga de informação | Capturas: M02 ajustes a 360 px tem página inteira de aproximadamente 4.600 px | Objetivos, convite, sete opções, feedback e controles exigem bastante rolagem; ajuda fica depois da atividade | Oportunidade de UX, prioridade média | Não feita reorganização substancial nesta revisão | Observar descoberta de ajuda, localização da próxima ação e esforço antes de propor reorganização |
| Recuperação e pressão temporal | V + A: erro, desfazer, voltar, repetir e pausar; busca de temporizadores no código | Sem bloqueio por erro, nota, desconto, ranking ou tempo limite. Sem temporizador de tarefa | Nenhuma | Não necessária | Duração planejada de 5–10 minutos permanece sem validação |
| Avisos de estado temporário | Leitura do texto e teste de sair/voltar | Limitação de retomada explicitada; termos “eventos de teste” e “memória” são técnicos | Oportunidade de redação, baixa | Texto preservado nesta revisão | Propor redação mais cotidiana e conferir compreensão com pesquisador/participantes |

**Limites dos achados:** 32 execuções axe em navegador terminaram com zero violações reportadas. A execução em cores forçadas teve uma ocorrência inconclusiva de contraste, registrada nos JSONs. axe não atesta conformidade. Rádios foram medidos pelo rótulo inteiro, que é clicável, e não pelo círculo nativo de aproximadamente 23 px. A preferência interna de 48 px é distinta dos critérios normativos do axe.

As capturas são de página inteira, não fotografias de dispositivos. O script leva a rolagem ao topo só durante a captura para evitar artefatos de elementos fixed fora do viewport; restaura a posição em seguida. Capturas de M01 recuperação a 1280 px e M02 leitura a 768 px/ajustes a 320 e 360 px foram examinadas, além dos dados automatizados.

## Revisão dos eventos demonstrativos

O pedido menciona oito tipos centrais; o contrato instalado já contém **doze tipos**, incluindo quatro de apoio ao ciclo de vida. Todos foram mantidos, sem criar eventos novos nem convertê-los nos E1–E8 candidatos à pesquisa.

| Tipo central | Verificação no redutor/testes (A) | Resultado |
| --- | --- | --- |
| `mission_started` | Ação de conhecer atividade; renderização não registra | Passou |
| `step_started` | Entrada/retorno/retomada com etapa de destino | Passou |
| `action_performed` | Ação da modalidade antes de resultado da validação | Passou |
| `help_requested` | Abrir ajuda sem critério ou erro | Passou, separado de erros |
| `attempt_incorrect` | Apenas solicitação de revisão pelo validador | Passou, não é penalidade |
| `step_completed` | Etapa de saída, somente transição validada | Passou; voltar e desfazer não a completam |
| `mission_completed` | Todos os critérios, uma vez por tentativa | Passou |
| `mission_restarted` | reason repeat/restart e nova tentativa | Passou, preserva prefixo do histórico até limite |

Tipos auxiliares examinados: `new_attempt` antes da ação seguinte a um erro; `mission_interrupted`; `mission_resumed`; `previous_step_requested`. Retomada registra a fase pausada como origem do evento e gera `step_started` da etapa reaberta. Novas visitas não são domínio, escore ou critério novo.

Ordem examinada: início → entrada → ação → eventual erro; na revisão seguinte, `new_attempt` → ação; numa transição válida, ação → etapa concluída → próxima etapa iniciada; na última, ação → etapa concluída → missão concluída. Ajuda entra na sequência quando solicitada. Retorno/desfazer não geram etapa concluída. Identificadores: M01/M02, U01, source `local-demo`, schemaVersion 2, definitionVersion `0.1.0-demo.2`, attempt e sequence monotônica.

Repetir não substitui indevidamente eventos anteriores. O limite **intencional de 200** retém somente os mais recentes e mantém sequências únicas; portanto não se promete histórico ilimitado. Não há data, duração, identidade, resposta bruta ou campo livre. O redutor não usa relógio/rede/armazenamento; estado permanece no hook da página e desaparece ao desmontar/recarregar.

Inspeção de `src` não encontrou chamadas a fetch, WebSocket, XMLHttpRequest, sendBeacon, localStorage/sessionStorage ou temporizador de tarefa. Durante os percursos observados, localStorage/sessionStorage estavam vazios, cookies acessíveis ao documento vazios e as **46 URLs HTTP observadas eram locais de Vite/recursos do app**. O socket de HMR do Vite e o protocolo de depuração pertencem ao ambiente de desenvolvimento/revisão, não a um adaptador de eventos do produto. Não houve alteração para expor eventos no navegador. Os JSONs e PNGs deste relatório contêm apenas cenários sintéticos da revisão, não dados de participantes.

## Correção e regressões

- Produto: somente `src/styles/index.css`, dimensões mínimas dos links de navegação. Tokens, paleta e logomarca preservados. O teste de alvo do script inicialmente falhou, detectando o link de 36,19 px; passou após o mínimo nos breadcrumbs. Nenhuma alteração ao domínio ou às definições pedagógicas.
- `src/app/U01Review.test.tsx`: dois testes adicionais de feedback persistente, foco após erro, navegação de rádio por setas e necessidade de reaplicar após desfazer. São evidências automatizadas adicionais, não falhas pedagógicas descobertas.
- `scripts/revisar-u01.mjs`: regressão em Chrome com asserções para conclusão, repetição, zero violações axe, ausência de overflow e alvos ativos de pelo menos 48 px nos estados examinados. Usa `ws` já instalado transitivamente no lockfile e axe-core já existente; não adiciona dependências. Não roda no comando normal `check`, pois requer Chrome local preparado.
- README, roadmap, DSR e arquitetura recebem referência a esta revisão, distinguindo-a das verificações anteriores sem navegador.

## Execução e resultados

| Comando | Resultado |
| --- | --- |
| `npm test` antes da alteração | 174 testes aprovados, dez arquivos |
| `npm run check` final | Aprovado, sem avisos de lint; 176 testes em onze arquivos; TypeScript e build sem erros |
| `node scripts/revisar-u01.mjs` com Chrome e Vite preparados | 32 estados, 13 PNGs, zero violações axe, sem overflow ou alvos ativos abaixo do mínimo após correção; uma verificação inconclusiva de contraste em cores forçadas |

Os 174 testes anteriores não foram editados nem removidos. Node.js, npm, bibliotecas e versão não foram atualizados. As primeiras execuções de lint do utilitário novo identificaram imports CommonJS e um global não declarado; o script foi convertido a ESM com import explícito e o check final passou.

### Evidências e reprodução

- [Dados do navegador, rede local, zoom tentado e auditorias](evidencias/U01/navegador.json); [estados](evidencias/U01/estados.json).
- M01: [360 px, início](evidencias/U01/m01-360-inicio.png), [768 px, recuperação](evidencias/U01/m01-768-recuperacao.png), [1280 px, recuperação](evidencias/U01/m01-1280-recuperacao.png).
- M02: [360 px, ajustes](evidencias/U01/m02-360-ajustes.png), [768 px, leitura](evidencias/U01/m02-768-leitura.png), [1280 px, ajustes](evidencias/U01/m02-1280-ajustes.png), [320 px, reflow](evidencias/U01/m02-320-reflow.png). Demais PNGs no mesmo diretório.

1. `npm ci` se necessário; `npm run dev` em um terminal. Não é preciso instalar navegador ou atualizar Node para reproduzir neste ambiente.
2. Em outro terminal PowerShell, iniciar Chrome com perfil de teste isolado (não usar perfil pessoal):

   ```powershell
   $perfilRevisao = Join-Path $env:TEMP ('trilhas-u01-' + [guid]::NewGuid())
   $chromeRevisao = Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -WindowStyle Hidden -ArgumentList @('--headless=new', '--disable-gpu', '--remote-debugging-port=9223', "--user-data-dir=$perfilRevisao", '--no-first-run', '--no-default-browser-check', 'about:blank') -PassThru
   node scripts/revisar-u01.mjs
   Stop-Process -Id $chromeRevisao.Id
   ```

   Reservar a porta 9223 para este processo. O script requer Vite na porta 5173, escreve novamente somente as evidências da revisão e usa o `ws` presente no lockfile atual. Não usa perfil do participante nem ativa coleta no app.

3. Executar `npm run check` para a suíte normal. O app pode ser iniciado por `npm run dev` e acessado a partir de `http://127.0.0.1:5173` → Experimentar as atividades da U01.

## Roteiro manual pendente e recomendações antes de M03/M04

Registrar navegador/versão, sistema, resolução, zoom, tecnologia assistiva, ação, esperado/observado e captura de cada falha. Não registrar dados pessoais nas evidências.

1. **Zoom real:** abrir Chrome/Edge em janela visível a aproximadamente 1280 px; menu do navegador → Zoom → **200%** e confirmar valor. Percorrer ambas as missões, inclusive ajustes/erro/ajuda/pausa/conclusão. Esperado: texto e botões inteiros, nenhuma funcionalidade perdida, ausência de necessidade de rolagem horizontal para ler. Repetir em janela estreita e com texto ampliado/modo de leitura; restaurar zoom. Registrar resultados, não substituir pelo DPR ou zoom de pinça.
2. **Teclado e foco:** recarregar; usar apenas Tab, Shift+Tab, Enter, Espaço e setas. Acionar skip link, seguir U01/M01, voltar, repetir com M02. Conferir foco sempre visível e não encoberto, ordem reversa, ida/volta da ajuda e ausência de armadilha. Durante rádio, foco não deve saltar; na troca de etapa deve identificar a etapa nova. Conferir feedback mesmo quando exige rolagem.
3. **Leitor de tela:** NVDA com navegador visível, ou alternativa disponível. Conferir idioma, nome/nível dos títulos, regiões, nomes/estado de rádios, nome/estado do progresso e ajuda expandida/recolhida. Repetir erros iguais, pausa/retomada e desfazer; verificar se status é anunciado de maneira compreensível, sem duplicação ou interrupção excessiva.
4. **Contraste e visual:** conferir manualmente texto, bordas, foco e controles em estados normal/hover/focus/selecionado/desabilitado; modo de alto contraste do sistema e movimento reduzido. Resolver o contraste inconclusivo em cores forçadas antes de concluir essa parte da revisão.
5. **Aparelho físico:** repetir a 360 px aproximados, retrato/paisagem e toque simples, sem recorrer a configurações reais. Verificar alvos com mão, teclado virtual quando aplicável e ausência de perdas após rolagem. As emulações desta revisão não substituem esse procedimento.
6. **Revisão pedagógica com pesquisador:** conferir os originais dos instrumentos quanto a não sobreposição, mantendo-os intactos. Observar se é entendido que visitar Calendário no ensaio não é erro. Observar compreensão de “prévia/aplicar”, diferença entre desfazer/voltar/reiniciar e limitação da retomada. Avaliar carga e descoberta de ajuda da M02 antes de aprovar mudanças maiores.
7. **Avaliação autorizada com pessoas idosas:** observar próxima ação, solicitação de ajuda, recuperação e repetição sem interpretar ajuda como falta de autonomia. Medir/relatar esforço e duração apenas com protocolo autorizado, sem adicionar telemetria por consequência desta revisão.

Recomendação técnica: resolver/registrar as pendências de acesso e revisão pedagógica antes de expandir o motor; reaplicar o checklist de foco, ajuda, critérios e eventos a M03/M04 **somente após autorização**. Não foram implementadas novas missões, Supabase, autenticação, persistência, telemetria de participantes ou publicação.
