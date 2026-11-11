# Histórico da migração curricular

**Data: 10 de novembro de 2026. Versão mantida: 0.1.0-dev.** Migração de conteúdo e navegação local, sem banco, usuários ou progresso.

## Aprovação e fonte de verdade

O pesquisador aprovou nesta solicitação a adoção dos novos títulos, objetivos e cenários das vinte micromissões como base curricular oficial de implementação, com refinamentos pedagógicos possíveis antes da homologação v1.0.0. A aprovação autoriza esta migração controlada; não autoriza nova execução de missões, gamificação, banco, telemetria ou publicação.

Fonte dos textos: campos 1, 2, 4 e 5 de ESPECIFICACAO-20-MISSOES.md e objetivos educacionais das dez unidades na MATRIZ-CURRICULAR.md. Não se alteraram os enunciados dessas fichas para ajustar os testes. Os instrumentos T0/T1/T2, IMI e SUS não foram modificados. Sua versão original não está disponível para revisão independente de não sobreposição; não se alega que essa conferência tenha sido feita.

## Preservação do estado anterior

Arquivo reconstruível por dados: [CURRICULO-ANTERIOR.json](CURRICULO-ANTERIOR.json), contendo as três trilhas, dez unidades, vinte missões e todos os títulos/descrições/objetivos anteriores, na ordem original. Não é importado pelo aplicativo em produção; serve ao histórico e a testes de compatibilidade. Não contém dados pessoais.

Hash SHA-256 da fonte anterior src/data/curriculum.ts: `0b62ec60f701d680e3aa9f48565930498bae270dc03061afc54bf7e8a1c5a026`. Hash da nova fonte nesta entrega: `4b116065a7eb3ec2e4b71ebc5cd97bcce37a1aaf8ea64dbcf63b487062c41dfd`. Não houve reescrita de histórico Git, remoção destrutiva ou migração de progresso.

## Modelo e identificadores atuais

Trilhas usam id T01–T03, slug próprio e ordem 1–3. Unidades usam id U01–U10, slug e order 1–10, além de trailId. Missões usam id M01–M20, slug e order 1–20, além de unitId, trailId, mode (guided/application), title, objective, scenario e status demonstration. Os códigos identificam o conteúdo pedagógico; slugs identificam endereços. Nenhum código depende do título para continuar estável em refinamentos futuros.

| Trilha | Unidade / título aprovado | Slug da unidade | Par A/B |
| --- | --- | --- | --- |
| T01 — Primeiros Passos no Mundo Digital | U01 — Operação básica do celular | `operacao-basica-do-celular` | M01 / M02 |
| T01 — Primeiros Passos no Mundo Digital | U02 — Comunicação digital | `comunicacao-digital` | M03 / M04 |
| T01 — Primeiros Passos no Mundo Digital | U03 — Pesquisa de informações | `pesquisa-de-informacoes` | M05 / M06 |
| T02 — Segurança e Pensamento Crítico | U04 — Desinformação | `desinformacao` | M07 / M08 |
| T02 — Segurança e Pensamento Crítico | U05 — Senhas e privacidade | `senhas-e-privacidade` | M09 / M10 |
| T02 — Segurança e Pensamento Crítico | U06 — Fraudes digitais | `fraudes-digitais` | M11 / M12 |
| T02 — Segurança e Pensamento Crítico | U07 — Links maliciosos | `links-maliciosos` | M13 / M14 |
| T03 — Cidadania e Autonomia Digital | U08 — Serviços essenciais | `servicos-essenciais` | M15 / M16 |
| T03 — Cidadania e Autonomia Digital | U09 — Aplicativos e permissões | `aplicativos-e-permissoes` | M17 / M18 |
| T03 — Cidadania e Autonomia Digital | U10 — Ajuda e autonomia | `ajuda-e-autonomia` | M19 / M20 |

| Missão | Unidade / trilha | Título aprovado | Slug |
| --- | --- | --- | --- |
| M01 (A) | U01 / T01 | Encontrar os caminhos da tela | `encontrar-os-caminhos-da-tela` |
| M02 (B) | U01 / T01 | Preparar a tela para ler um convite | `preparar-a-tela-para-ler-um-convite` |
| M03 (A) | U02 / T01 | Preparar uma mensagem para o grupo | `preparar-uma-mensagem-para-o-grupo` |
| M04 (B) | U02 / T01 | Compartilhar o arquivo certo com a pessoa certa | `compartilhar-o-arquivo-certo-com-a-pessoa-certa` |
| M05 (A) | U03 / T01 | Transformar uma dúvida em busca | `transformar-uma-duvida-em-busca` |
| M06 (B) | U03 / T01 | Encontrar uma atividade no bairro | `encontrar-uma-atividade-no-bairro` |
| M07 (A) | U04 / T02 | Investigar de onde veio a notícia | `investigar-de-onde-veio-a-noticia` |
| M08 (B) | U04 / T02 | Decidir antes de compartilhar | `decidir-antes-de-compartilhar` |
| M09 (A) | U05 / T02 | Cuidar da senha e do código de acesso | `cuidar-da-senha-e-do-codigo-de-acesso` |
| M10 (B) | U05 / T02 | Escolher o que pode ser compartilhado | `escolher-o-que-pode-ser-compartilhado` |
| M11 (A) | U06 / T02 | Interromper um pedido suspeito | `interromper-um-pedido-suspeito` |
| M12 (B) | U06 / T02 | Conferir um pedido de Pix com segurança | `conferir-um-pedido-de-pix-com-seguranca` |
| M13 (A) | U07 / T02 | Examinar um endereço antes de abrir | `examinar-um-endereco-antes-de-abrir` |
| M14 (B) | U07 / T02 | Sair de uma mensagem e buscar o caminho seguro | `sair-de-uma-mensagem-e-buscar-o-caminho-seguro` |
| M15 (A) | U08 / T03 | Encontrar a informação de um serviço essencial | `encontrar-a-informacao-de-um-servico-essencial` |
| M16 (B) | U08 / T03 | Planejar um atendimento de saúde simulado | `planejar-um-atendimento-de-saude-simulado` |
| M17 (A) | U09 / T03 | Escolher um aplicativo para uma necessidade | `escolher-um-aplicativo-para-uma-necessidade` |
| M18 (B) | U09 / T03 | Revisar permissões em uma situação prática | `revisar-permissoes-em-uma-situacao-pratica` |
| M19 (A) | U10 / T03 | Pedir ajuda sem compartilhar segredos | `pedir-ajuda-sem-compartilhar-segredos` |
| M20 (B) | U10 / T03 | Construir e experimentar um plano de autonomia | `construir-e-experimentar-um-plano-de-autonomia` |

## Reaproveitamento por correspondência pedagógica — unidades

Os destinos desta seção indicam temas reaproveitados; não provam equivalência de objetivos, cenários ou URLs. Não se adotou a posição antiga como regra de correspondência.

| ID técnico anterior | Título anterior | Organização atual relacionada | Decisão |
| --- | --- | --- | --- |
| `conhecendo-o-celular` | Conhecendo o celular | U01 | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |
| `conexoes-e-ajustes` | Conexões e ajustes | U01/CP-U01 | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |
| `comunicacao` | Comunicação no dia a dia | U02/U03 | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |
| `senhas` | Senhas e proteção | U05 | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |
| `golpes` | Atenção aos golpes | U06 | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |
| `informacoes` | Informações com cuidado | U04 | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |
| `privacidade` | Privacidade no cotidiano | U05/U09 | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |
| `servicos` | Serviços digitais | U08 | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |
| `participacao` | Participação e convivência | U02/U03 (transversal) | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |
| `aprender-sempre` | Continuar aprendendo | U10 | Reorganização temática aprovada; novo código/slug. Endereço anterior recebe explicação, sem alias |

## Reaproveitamento e substituição — vinte missões anteriores

| ID anterior / título | Destino de conteúdo relacionado | Reaproveitamento, ampliação ou substituição |
| --- | --- | --- |
| `conhecendo-o-celular-1` — Reconhecer os botões e a tela | M01 | Controles deixam de ser apenas reconhecidos: passam a ser usados para abrir, voltar e recuperar caminho. |
| `conhecendo-o-celular-2` — Experimentar toques e gestos | M01/M02 e CP-U01 | Exploração de gestos é substituída por ações com botões e alternativas de teclado; operação do dispositivo permanece como tema. |
| `conexoes-e-ajustes-1` — Conhecer a conexão Wi-Fi | CP-U01 | Wi-Fi deixa de ser uma missão própria; é praticado no complemento presencial de U01, sem controle real do aparelho. |
| `conexoes-e-ajustes-2` — Ajustar texto e volume | M02 e CP-U01 | Ajuste de leitura é contextualizado no convite; brilho e volume têm representação demonstrativa e prática complementar. |
| `comunicacao-1` — Conhecer as mensagens | M03/M04 e CP-U02 | Mensagens e áudio são retomados em composição/revisão; imagens e compartilhamento são explicitados. |
| `comunicacao-2` — Explorar uma busca | M05/M06 | Busca é separada de comunicação e ampliada por refinamento, organização e recuperação da informação. |
| `senhas-1` — Reconhecer uma senha forte | M09 | Comparação de estratégia de senha é integrada à prática de proteção de acesso; sem senha real. |
| `senhas-2` — Conhecer a proteção em duas etapas | M09 | Segunda etapa passa a integrar a mesma missão de acesso, com distinção entre código e conversa. |
| `golpes-1` — Observar uma mensagem suspeita | M11/M12 | Sinais suspeitos são retomados como interrupção e decisão contextual diante de engenharia social. |
| `golpes-2` — Conferir antes de agir | M11/M12 | Confirmação por outro canal é preservada e aplicada ao pedido suspeito de Pix. |
| `informacoes-1` — Investigar a origem | M07 | Autoria, data e contexto são retomados numa investigação de aviso fora de contexto. |
| `informacoes-2` — Comparar informações | M07/M08 | Comparação se torna análise de evidências/independência e decisão de compartilhamento. |
| `privacidade-1` — Reconhecer dados pessoais | M10 | Identificação de dado pessoal é contextualizada na edição de divulgação e escolha de público. |
| `privacidade-2` — Conhecer permissões de aplicativos | M17/M18 | Permissões são deslocadas à U09 e relacionadas à finalidade, escolha e revisão de aplicativos. |
| `servicos-1` — Reconhecer um serviço oficial | M15 | Identificação de serviço evolui para consulta independente e organização de informação administrativa. |
| `servicos-2` — Planejar um atendimento | M16 | Planejamento é aplicado a atendimento de saúde fictício, com parada antes da identificação. |
| `participacao-1` — Conversar com respeito | M03/M08 e CP-U02 | Convivência respeitosa permanece transversal à composição/resposta em grupo, sem unidade própria. |
| `participacao-2` — Encontrar iniciativas da comunidade | M06 | Busca comunitária é retomada na seleção de atividade no bairro e organização de lembrete. |
| `aprender-sempre-1` — Escolher algo para aprender | M20 | Escolha de objetivo é retomada no plano por personagem; não se pede meta pessoal identificada. |
| `aprender-sempre-2` — Construir um plano de autonomia | M19/M20 | Plano e apoio são retomados em pedido seguro, ensaio e revisão diante de dificuldade. |

Conteúdos novos explicitados incluem compartilhamento contextual de arquivo (M04), organização/recuperação de busca (M05/M06), unidade própria de phishing (U07), escolha/gestão de aplicativos (U09) e pedido de ajuda segura (M19). Conteúdos anteriores não mantidos como missão autônoma, como Wi-Fi e convivência, têm realocação acima; seus textos originais permanecem no arquivo histórico. Não se declara equivalência literal por afinidade temática.

## Rotas e tratamento do legado

URLs atuais: `/trilhas/:trailSlug/unidades/:unitSlug/missoes/:missionSlug`. Exemplo: `/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/encontrar-os-caminhos-da-tela`. Parâmetros de rota passaram a ter nomes de slug para evitar uso acidental de IDs pedagógicos nas URLs. Os três slugs de trilha (`primeiros-passos`, `seguranca`, `cidadania`) foram mantidos porque seus títulos/temas continuam os mesmos; nenhuma competência diferente recebeu um slug antigo de unidade/missão.

As trinta URLs anteriores conhecidas (dez unidades e vinte missões) estão em `src/data/legacyCurriculum.ts`. Todas mostram “O currículo foi reorganizado”, identificam o conteúdo anterior e oferecem unidades tematicamente relacionadas e acesso às trilhas atuais. Não há redirecionamento automático para unidades/missões: sobreposição temática não demonstrou equivalência integral. Endereços inventados continuam na página de não encontrado. Barra final em URL antiga é normalizada para reconhecimento, não convertida em novo objetivo.

Não se criou alias por índice, número da missão ou posição de unidade. Os links da UI usam funções de caminho e slugs explícitos. Não existe migração fictícia de estado de participante. As demonstrações independentes `/desenvolvimento/u01/m01` e `/m02` já existiam: foram preservadas, sem alteração de regras ou expansão do motor; seus metadados de título/objetivo/cenário passaram a referenciar a fonte aprovada para evitar duplicação. As vinte fichas curriculares permanecem informativas.

## Arquivos criados ou modificados

- Contratos e caminhos: `src/domain/curriculum.ts`, `src/domain/curriculumPaths.ts`.
- Dados: `src/data/curriculum.ts`, `src/data/legacyCurriculum.ts`; `src/data/demoMissions.ts` somente para referência aos metadados canônicos, sem novas regras de execução.
- Interface e rotas: `src/components/CurriculumCards.tsx`, `src/pages/CurriculumPages.tsx`, `src/pages/LegacyCurriculumPage.tsx`, `src/app/App.tsx`.
- Testes: `src/data/curriculum.test.ts`, `src/app/App.test.tsx`, `src/app/Accessibility.test.tsx`, `src/app/DemoMissions.test.tsx`, `src/app/CurriculumMigration.test.tsx`.
- Documentação geral: `AGENTS.md`, `README.md`, `docs/ROADMAP.md`, `docs/DECISOES-DSR.md`, `docs/ARQUITETURA/MOTOR-DE-MISSOES.md`.
- Documentação pedagógica: matriz, especificação, roteiro, rastreabilidade, divergências, este histórico e `CURRICULO-ANTERIOR.json` em `docs/PEDAGOGIA`.

## Requisitos afetados pela migração

Relação código/título/slug, hierarquia e integridade curricular, ordem pedagógica, modo A/B, preservação do legado, semântica de navegação e rastreabilidade. RS07 passa a contar com a fonte curricular reconciliada e IDs estáveis; isso não implementa regras de execução ou outros RS-Mxx. Foram preservadas identidade visual, marcas, duração aproximada dos doze encontros e separação dos instrumentos externos.

## Verificação e pendências

`npm run check`: lint sem avisos, TypeScript sem erros, 153 testes em nove arquivos e build aprovado. Preservados os testes existentes, com atualização legítima dos que usavam títulos/slugs antigos; cinco testes de integridade adicionais e 57 de migração/navegação foram acrescentados. Testes comparam títulos, objetivos e cenários diretamente às fichas aprovadas, validam vínculos/códigos/slugs/ordem, percorrem as vinte fichas e as trinta URLs antigas, e inspecionam semântica parcial com axe-core.

O servidor local iniciou; início, trilha, unidade/missões novas, URL antiga conhecida e demonstração M01 preexistente responderam HTTP 200. Trinta e nove links locais de documentação foram verificados; o hash da nova fonte coincide com o registro deste histórico, e os dois PNGs oficiais continuam intactos. A validação de comportamento das páginas usa os testes de interface; resposta HTTP de uma SPA não demonstra sozinha qual página foi renderizada.

Testes automatizados não homologam o currículo nem validam aprendizagem/acessibilidade. Permanecem revisão pedagógica iterativa antes de v1.0.0, conferência com os instrumentos originais e inspeção manual/assistiva. Qualquer expansão do motor, execução no currículo canônico, persistência, autenticação ou publicação exige autorização própria.
