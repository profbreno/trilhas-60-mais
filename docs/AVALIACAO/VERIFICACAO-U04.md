# Verificação de implementação — U04 Desinformação

10/11/2026 · Trilhas 60+ `0.1.0-dev`. Verificação intermediária de desenvolvimento, não avaliação final D07, teste com participantes, validação pedagógica ou declaração de conformidade integral WCAG 2.2.

## Inspeção e autorização

Lidos AGENTS, arquitetura, fichas M07/M08, matriz/rastreabilidade, roteiro dos doze encontros, verificação U03, diário DSR e sistema de design. Inspecionados contratos, validadores e componentes M01–M06, checkpoints, critérios e eventos. Autorização deste ciclo: acrescentar apenas M07/M08 e conferir documentalmente a Trilha 1. Não houve mudança dos instrumentos T0/T1/T2, IMI ou SUS.

## Conferência pedagógica integrada da Trilha 1

| Unidade / competência | Implementado no aplicativo | Previsto presencialmente, não executado | Lacunas e resultado documental |
| --- | --- | --- | --- |
| U01 / C1 — Operação Básica e Resolução de Problemas | M01 navegação, caminho equivocado, recuperação e retorno; M02 leitura, brilho/volume representados, desfazer e recuperação do local do convite | CP-U01: Wi-Fi em maquete (5 min); brilho (3); volume/áudio sintético/transcrição (3); recuperação/síntese (4). Sem configuração pessoal | Wi-Fi e prática sonora não estão integralmente no app. Materiais e mediação precisam de revisão; cobertura híbrida está explicitamente prevista |
| U02 / C2 — Comunicação e Colaboração Digital | M03 compor/revisar mensagem, representação de áudio com transcrição; M04 conferir arquivo/destino/contexto, imagem sintética e programa, compartilhar apenas na simulação | CP-U02: selecionar/reproduzir/pausar áudio sintético com transcrição (7 min); compartilhar imagem pública de exemplo com legenda/destino/prévia em maquete (8) | Não há reprodução/pausa sonora real em M03. Compartilhar a imagem pública é complemento, não substitui o programa exigido em M04. Cobertura planejada não é execução comprovada |
| U03 / C3 — Pesquisa e Gestão de Informação | M05 consulta/refinamento e coleção recuperável; M06 fontes/datas, comparação e lembrete de atividade adequada | CP-U03: consulta administrativa de serviço de saúde fictício (7 min); comparar autoria/data/pertinência com referência independente e guardar/recuperar informação (8) | Busca administrativa em saúde e comparação com referência independente estão previstas no complemento, não como nova missão. Sem dados clínicos ou serviços reais |

O roteiro reserva **três encontros**, semanas 1–3, de aproximadamente **60 minutos** cada: 10 de acolhimento/contexto, 30 para duas missões e mediação, 15 de complemento, 5 de síntese. M01–M06 têm estimativa de 5–10 minutos cada, sem limite imposto à pessoa. Não há demonstração de que a carga seja viável na turma real de 20–30 pessoas; equipe, materiais, aparelhos, pausas e equivalência das alternativas exigem preparação e avaliação.

**Não se identificou incompatibilidade pedagógica substantiva impeditiva**, considerando o desenho híbrido aprovado. As lacunas acima são diferenças documentadas entre implementação e prática complementar prevista, não alegação de cobertura integral pelo aplicativo. Nenhum complemento foi executado ou observado nesta etapa. Por isso a expansão autorizada para U04 prosseguiu. Corrigidos somente avisos documentais de disponibilidade e a pendência obsoleta de aprovação da migração, já autorizada anteriormente; objetivos, cenários e distribuição temporal foram preservados.

## M07 — Investigar de onde veio a notícia

Preservado o cenário aprovado: mensagem afirma fechamento da biblioteca “amanhã”, usando recorte de aviso antigo com data cortada. A interface usa **transcrição textual** do recorte e do original, sem exigir reconhecer montagem ou usar lupa. Conversa fictícia em 20 de agosto de 2032; original integral refere-se a 21 de agosto de 2031.

Três pistas nomeadas, em qualquer ordem: autoria/origem do arquivo, data/contexto integral, referência independente do Guia Comunitário. O guia do mês da conversa identifica a biblioteca, mas não esclarece o fechamento no dia alegado. Assim, o aviso antigo não confirma fechamento atual; também não é evidência suficiente para afirmar que a biblioteca certamente abrirá. Condição correta: **ainda não verificada**.

Concluir exige: consultar as três pistas e comparar; escolher condição coerente; marcar justificativas de autoria, data e contexto, sem marcar justificativa por aparência; abrir revisão, confirmar sua conferência e concluir. Apenas ler o aviso, abrir painéis ou escolher uma condição não conclui. A síntese final preserva o sentido da ficha: “Aviso antigo, não confirma fechamento atual”. Feedback distingue incerteza de falsidade e orienta revisão sem penalização.

## M08 — Decidir antes de compartilhar

Preservado o aviso de **distribuição de plantas no domingo**, recebido de contato conhecido em grupo fictício. Uma página reproduz a mesma mensagem e a organização informa que a data ainda não está confirmada. Copiar não cria confirmação independente; contato conhecido, linguagem formal ou aparência não garantem confiabilidade.

Concluir exige: consultar mensagem, página dependente e comunicado da organização; comparar; identificar condição ainda não verificada; justificar dependência e falta de confirmação; escolher aguardar confirmação/não encaminhar; selecionar resposta respeitosa que explicite incerteza e próximo passo independente; revisar e confirmar decisão simulada. Há duas condutas, duas respostas e dois próximos passos pertinentes aceitos. Tentar compartilhar como fato, hostilizar ou afirmar cancelamento sem evidência não conclui nem provoca envio.

Não basta selecionar “Não compartilhar”. A decisão só abre revisão após investigação e justificativa completas. A resposta propõe consultar a organização por canal conhecido e independente do encaminhamento ou aguardar comunicado com dia/local confirmados. A revisão mostra condição, motivos, conduta, frase e próximo passo. Corrigir escolhas exige nova confirmação; rever evidências exige nova comparação. Ajuda, pausa, retorno e repetição não reduzem reconhecimento.

## Modelo e componentes

| Elemento | Implementação e limite |
| --- | --- |
| `src/data/informationMissions.ts` | Definições M07/M08; fontes, autoria, datas/contextos, motivos e alternativas autorais locais. Metadados vêm do currículo aprovado |
| `src/domain/missions/types.ts` | InformationDefinition, InformationEvidence, InformationState/Action e InformationStep; modalidade information-check com modos investigation/sharing |
| `src/domain/missions/informationCheck.ts` | Validador puro, sem React, relógio, rede ou fornecedor; condições confirmed/contradicted/unverified orientadas por dados editoriais |
| `src/components/missions/InformationCheckActivity.tsx` | Renderer compartilhado: pistas, região focada, comparação em details nativo, grupos rotulados, prévia e resultado |
| Redutor e MissionRunner existentes | Reutilização do ciclo, feedback polite/atomic, critérios, foco, ajuda, checkpoints, interrupção, reinício e repetição. Revisar/editar não emite step_completed indevido |
| Registro e percurso | M01–M08 disponíveis, M09–M20 informativas, vinte nós e slugs oficiais preservados; retorno /#percurso-u04 com foco |

Etapas investigate → decide → review → done, agrupadas visualmente em 1/2/3/3. Critérios investigated/justified/decided só ficam completos após revisão explícita e ação final. Não há progresso persistido ou bloqueio por concluir missão anterior. As rotas antigas de desenvolvimento permanecem restritas à U01.

**Representação das três condições:** o contrato aceita cenários confirmados, contraditos e inconclusivos, com veredito e motivos definidos em dados autorais. Testes usam fixtures com referências e justificativas coerentes para cada condição, até a conclusão. Essas fixtures não são novas missões no registro. Os dois cenários oficiais U04 permanecem não verificados porque isso corresponde às fichas; não se inventaram variantes para forçar uma conclusão diferente. O motor não verifica notícias automaticamente nem interpreta texto por IA.

Os doze tipos de evento/schemaVersion 2 permanecem em memória, limitados a 200 itens. Operações são identificadas por `action_performed.action`: open-evidence, compare-evidence, choose-verdict, toggle-reason, choose-conduct/response/next-step, prepare-review, acknowledge-review e finalize-decision. Ajuda é help_requested e tentativas inadequadas são attempt_incorrect. A ação final precede step_completed e mission_completed; repetição preserva histórico dentro do limite com nova tentativa. Por minimização, os eventos não incluem texto, valor de opinião/resposta ou ID da evidência escolhida; registram a operação, não seu conteúdo. Não há transmissão, persistência, exportação ou Learning Analytics de pesquisa. Definições U04: 0.1.0-u04.1.

## Testes e preservação

**290 testes em 19 arquivos:** 253 anteriores preservados e 37 novos (29 de domínio e oito de interface). Atualizadas expectativas de disponibilidade para oito executáveis/doze informativas e o caso de proposta do percurso de M07 para M09. O utilitário antigo do percurso recebeu o mesmo ajuste; sua rodada histórica não foi reapresentada como execução nova.

Cobertura nova: fonte/autoria/data, ordem livre e duplicação de pistas, guardas, três condições, motivos apoiados/inadequados, compartilhar sem contexto, respostas equivalentes/hostis, próximo passo independente, revisão/edição, ajuda, pausa/retomada, repetição, conclusão única, ordem/minimização dos eventos, rotas/foco e axe em fases representativas. Testes de fixtures não comprovam que as regras editoriais são pedagogicamente validadas.

Uma execução concorrente com a inspeção Chrome teve dois testes anteriores excedendo cinco segundos (M03 áudio e M06 lembrete). A primeira execução completa havia passado; o navegador foi encerrado e a suíte foi repetida sem essa concorrência. O resultado final é o registrado nas evidências. Não se alteraram timeouts nem se atribuíram esses incidentes a defeito comprovado do produto.

Lint sem avisos, TypeScript sem erros e build Vite concluído. Node permanece 20.17.0; nenhuma dependência adicionada ou atualizada. [Preservação por hashes](evidencias/U04/preservacao.json) verifica currículo, validadores anteriores e PNGs da marca. Somente arquivos de integração e novos estilos delimitados à modalidade foram alterados; tokens oficiais foram preservados.

## Acessibilidade e interação no Chrome

Ambiente: Windows, Chrome 157.0.8103.50 headless, perfil temporário isolado, build servido por preview local, axe-core 4.10.3 via CDP. Teclas Tab/Enter/Espaço/setas enviadas ao navegador; não se equipara automação por teclado a inspeção humana com leitor de tela.

| Condição / procedimento | Resultado nos estados examinados | Evidência / limite |
| --- | --- | --- |
| Viewport emulado 360 × 900 e janela 1280 × 900 | Aprovado — dez estados em cada condição | Sem overflow/clipping detectado; não são smartphones físicos |
| Zoom nativo 200%, janela base 1280 × 900 | Aprovado — dez estados | Largura interna 640/útil 632, altura 450; fator nativo confirmado, não CSS zoom |
| Zoom nativo 400% na mesma base | Aprovado — dez estados | Largura interna 320/útil 316, altura 225; reflow distinto de redimensionamento |
| Viewport emulado 320 × 900, zoom 100% | Aprovado — dez estados | Área útil 305 devido à barra; registro separado do zoom real |
| Pistas, interpretação, motivos, correção, revisão, conclusão e retorno por teclado | Aprovado nos cinco percursos programados | Foco nos detalhes/títulos/retorno U04; nenhum bloqueio observado nessas trajetórias |
| Ajuda e opções, pausa/retomada, comparação expansível e repetição | Aprovado nos percursos/testes | Opções e comparação em HTML nativo; revisão invalida confirmação, repetição zera critérios |
| Axe-core Chrome, incluindo contraste e target-size | Zero violações em 50 estados | Dois contrastes inconclusivos, investigados separadamente abaixo |
| Leitor de tela real, toque/dispositivos físicos, cores forçadas, fonte isoladamente ampliada | Não verificado nesta rodada | Não inferir do DOM, axe ou dos resultados históricos U01 |

Rótulos e grupos nativos, textos completos, indicação de autoria/data e motivos textuais independem de ícones e cores. Recorte/original podem ser lidos em texto; nenhuma interação exige gesto complexo, digitação de dado pessoal ou precisão visual. Foco visível e área confortável reaproveitam tokens. Objetivos e ajuda continuam disponíveis; feedback usa região polite/atomic existente, sem declarar avisos estáticos urgentes.

### Contraste inconclusivo

Dois registros a 320: **M08 conduta inadequada** e **M08 comparação**. Ambos apontam exclusivamente `.skip-link`, oculto acima do viewport, com limitação axe `elmPartiallyObscuring` para determinar o fundo. Não são violações comprovadas do aviso ou das opções da missão.

Cada caso foi inspecionado separadamente: foco real por Tab tornou o link visível (topo 18, base 104,375) com texto #173e31 sobre fundo branco opaco, 18px/700 e contraste **11,8655:1**. Contorno #84430e sólido de 3px: **7,5260:1** contra branco e **7,1666:1** contra #f7faf9. Hover sobre o link focado preservou cores/razões. Fórmula de luminância sRGB e dados computados constam no utilitário e JSON.

O contraste do texto visível e contorno é aprovado nesse recorte, segundo as referências de projeto de 4,5:1/3:1. Os resultados brutos automáticos continuam **inconclusivos**, separados da medição dirigida; não se desativou regra nem se alterou a paleta. Isso não comprova todos os critérios de foco, todos os estados nativos ou conformidade global. [Método e referências já documentados](FECHAMENTO-ACESSIBILIDADE-U01.md).

## Evidências e reprodução

- [Galeria dos 50 estados](evidencias/U04/galeria.html), [dados brutos, dimensões, foco e contraste](evidencias/U04/resultados.json), [resumo de verificações](evidencias/U04/verificacoes.json), [preservação](evidencias/U04/preservacao.json).
- M07: [360 — início](evidencias/U04/360-m07-inicio.png), [360 — data/contexto](evidencias/U04/360-m07-data-contexto.png), [1280 — comparação](evidencias/U04/1280-m07-comparacao.png), [200% — revisão](evidencias/U04/zoom200-m07-revisao.png).
- M08: [360 — conduta inadequada](evidencias/U04/360-m08-conduta-inadequada.png), [360 — revisão](evidencias/U04/360-m08-revisao.png), [1280 — revisão](evidencias/U04/1280-m08-revisao.png), [400% — revisão](evidencias/U04/zoom400-m08-revisao.png).
- Contraste dirigido: [conduta com foco](evidencias/U04/320-m08-conduta-inadequada-foco.png), [comparação com foco/hover](evidencias/U04/320-m08-comparacao-foco-hover.png).

Capturas representam viewport, foco e rolagem do estado, não página inteira ou dispositivo físico. Examinados visualmente M07 data/contexto a 360 e M08 revisão a 1280; demais estados também receberam medidas e auditorias automatizadas. Listas de motivos e resposta M08 podem exigir bastante rolagem no mobile/zoom; extensão, descoberta da comparação e compreensão precisam de avaliação humana. Não se afirmou melhoria empírica.

Executar `npm run dev`; verificar com `npm run check`. Para repetir a captura, servir build com `npm run preview -- --port 5176 --strictPort`, abrir Chrome isolado com `--headless=new --window-size=1280,1000 --remote-debugging-port=9230 --user-data-dir=<perfil-temporario>`, definir em PowerShell `$env:TRILHAS_QA_URL='http://127.0.0.1:5176'` e executar `node scripts/verificar-u04.mjs`. Argumento opcional `360` limita o perfil e grava JSON separado. O utilitário restaura zoom/fonte do perfil isolado; não toca no perfil pessoal ou no armazenamento do app.

## Pendências antes da próxima unidade

Todos os itens manuais abaixo permanecem **Não verificados**:

| Procedimento manual Narrador/Edge e dispositivos físicos | Esperado | Observado / resultado |
| --- | --- | --- |
| Percorrer vinte nós e abrir M07/M08 | Página/título, modalidade e disponibilidade anunciados; retorno focado U04 | A preencher — Não verificado |
| Consultar e reabrir pistas em ordens diferentes | Fonte/autoria/data/contexto legíveis; foco no conteúdo aberto; sem informação exclusiva de imagem | A preencher — Não verificado |
| Abrir comparação, escolher condição e motivos inadequados/adequados | Nomes/estados e feedback anunciados; não confundir incerteza com falsidade | A preencher — Não verificado |
| M08 selecionar conduta, resposta e próximo passo | Grupos compreensíveis; resposta respeitosa disponível; nenhum envio real | A preencher — Não verificado |
| Abrir ajuda/opções, interromper/retomar, rever e confirmar | Foco lógico, escolha preservada quando pertinente, confirmação invalidada ao editar | A preencher — Não verificado |
| Concluir, repetir e retornar; operar com toque, zoom e orientação alterada | Sem perda de controles, armadilha ou dependência de cor/gesto complexo | A preencher — Não verificado |

Revisar materiais CP-U01–CP-U04, duração e recursos da mediação. Responsável com acesso aos instrumentos originais deve conferir não sobreposição sem copiá-los para o repositório. Avaliar compreensão da diferença entre contradita/não verificada e descoberta das seções sob demanda em etapa autorizada. Evidência de cliques não comprova leitura, aprendizagem ou autonomia.

M09–M20, Supabase, autenticação, persistência, telemetria real, busca/compartilhamento externos, redes sociais, ranking e publicação não foram implementados. Qualquer próxima unidade ou integração depende de nova autorização.
