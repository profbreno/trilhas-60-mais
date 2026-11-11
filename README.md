# Trilhas 60+

Estado vigente após U05: **M01–M10 disponíveis**, M11–M20 informativas. M09 protege uma conta fictícia sem pedir credenciais; M10 edita um convite com minimização e público justificado. **323 testes aprovados**, lint, tipos e build sem erros. [Critérios, evidências e limites U05](docs/AVALIACAO/VERIFICACAO-U05.md). Versão 0.1.0-dev; execute npm run dev. Os relatos anteriores abaixo são históricos.

Estado vigente após U04: **M01–M08 disponíveis**; M09–M20 informativas. Modalidade de investigação com fontes fictícias, justificativa, decisão e revisão. **290 testes aprovados**, lint, TypeScript e build sem erros. [Conferência pedagógica, verificações e limites](docs/AVALIACAO/VERIFICACAO-U04.md). Versão 0.1.0-dev, sem serviços externos ou persistência. Execute npm run dev; relatos seguintes são históricos.

Estado vigente: **M01–M06 disponíveis**, com pesquisa simulada local de M05/M06. M07–M20 informativas. **253 testes aprovados**, lint, tipos e build sem erros. Versão 0.1.0-dev, sem busca externa, banco ou persistência. [Funcionamento, verificações e limites da U03](docs/AVALIACAO/VERIFICACAO-U03.md). Execute npm run dev; npm run check verifica lint, testes, tipos e build. Os relatos de entregas anteriores abaixo são históricos.

Estado atual: **M01–M04 disponíveis**, M05–M20 informativas. A U02 permite compor confirmação com texto/representação de áudio e compartilhar programa fictício após conferir arquivo, pessoa e contexto. Tudo exige prévia/revisão e ocorre somente em memória, sem APIs de mensagens ou dispositivo. [Verificação U02 e capturas](docs/AVALIACAO/VERIFICACAO-U02.md): **225 testes**, lint/tipos/build aprovados; teclado, zoom e reflow examinados, leitor de tela/dispositivos pendentes. Execute `npm run dev`. Registros abaixo preservam as etapas anteriores.

Registro atual: [fechamento dirigido de contraste e roteiro Narrador/Edge](docs/AVALIACAO/FECHAMENTO-ACESSIBILIDADE-U01.md). Os cinco inconclusivos correspondem ao skip link oculto; o texto visível com foco/hover mede 11,87:1. Nenhuma inconformidade comprovada exigiu alterar o produto. Os resultados automáticos permanecem separados da medição e o roteiro manual ainda não foi executado. Check aprovado com os 191 testes preservados.

Verificação interna atual: [zoom real, teclado, reflow e correções de acessibilidade U01](docs/AVALIACAO/VERIFICACAO-ACESSIBILIDADE-U01.md). Zoom nativo 200%/400% e fluxos examinados passaram; 191 testes, lint, tipos e build aprovados. Leitor de tela, dispositivos físicos e cinco verificações inconclusivas de contraste permanecem pendentes. Não é conformidade integral WCAG ou avaliação final D07.

Refinamento visual atual: início compacto, tarefa em destaque, opções e informações sob demanda. [Comparação antes/depois e limites](docs/AVALIACAO/REFINAMENTO-UX-01.md). Verificação atual: **191 testes**, lint, tipos e build aprovados; 186 casos anteriores preservados com adaptações de interação. Nenhuma alteração a critérios, validadores ou eventos. Os registros seguintes descrevem as entregas anteriores.

Navegação atual: **Percurso → Micromissão → Atividade**, com vinte nós nas três trilhas. M01/M02 disponíveis; M03–M20 mostram propostas Em desenvolvimento. Atalhos e retornos focam a região escolhida, sem persistência. Check atual: **186 testes**, lint, tipos e build aprovados. [Componentes, comparação das ações, capturas e pendências](docs/AVALIACAO/PERCURSO-INTEGRADO.md). Execute `npm run dev` para abrir localmente. As páginas hierárquicas continuam opcionais.

Revisão intermediária da U01: [relatório técnico, capturas e roteiro manual](docs/AVALIACAO/REVISAO-TECNICA-U01.md). Check atual: **176 testes**, lint, tipos e build aprovados; preservados os 174 anteriores. M01/M02 percorridas por teclado em Chrome headless a 360/768/1280 px; correção de alvo de navegação abaixo da preferência de 48 px. Zoom real a 200%, leitor de tela e avaliação com pessoas idosas permanecem pendentes. A revisão não é D07 nem validação integral WCAG. O script opcional `node scripts/revisar-u01.mjs` requer Vite/Chrome isolado preparados conforme o relatório; não adiciona coleta ao produto.

Protótipo educacional gamificado de uma pesquisa de doutorado em Educação, voltado ao letramento digital de pessoas 60+. Versão **0.1.0-dev**. Fundação local com conteúdo fictício; não há validação de acessibilidade nem evidência de eficácia educacional nesta etapa.

## Instalação e execução

Requisitos: Node.js >= 20.17 e npm >= 10. O ambiente de construção utiliza Node 20.17.0 e npm 10.8.2. Recomenda-se revisar a versão LTS do Node e atualizar a toolchain antes da futura publicação.

```sh
npm ci
npm run dev
```

Abra o endereço indicado pelo Vite, normalmente http://127.0.0.1:5173. O servidor fica restrito à máquina local por padrão. Dependências instaladas e fixadas no `package-lock.json`; não é necessário configurar variáveis de ambiente ou Supabase.

```sh
npm run typecheck   # TypeScript estrito
npm run lint        # ESLint, sem avisos permitidos
npm test            # Vitest + React Testing Library
npm run test:watch  # desenvolvimento de testes
npm run build       # tipos e compilação em dist/
npm run preview     # servir o build local
npm run check       # lint, testes, tipos e build
```

## Estrutura

```text
src/
  app/          composição, rotas e testes de navegação
  components/   breadcrumbs e identificação visual das trilhas
  data/         currículo fictício e testes de integridade
  domain/       tipos de trilha, unidade e micromissão
  pages/        início, trilha, unidade, missão e página não encontrada
  styles/       Tailwind, tokens e estilos responsivos compartilhados
  test/         configuração do ambiente de testes
  main.tsx      entrada React e BrowserRouter
docs/
  DECISOES-DSR.md
  ROADMAP.md
AGENTS.md       regras para futuras contribuições
```

Configurações na raiz: `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `package.json`, `package-lock.json`, `index.html` e `.gitignore`.

## Tecnologias e arquitetura

React 19, TypeScript 5.9, Vite 6, React Router 7, Tailwind CSS 4, Lucide React, ESLint 9, Vitest 3 e Testing Library. Vite 6/Vitest 3 foram escolhidos para executar no Node 20.17 existente. A linha typescript-eslint é fixada por compatibilidade; o lockfile preserva a resolução exata. Revisar o ciclo de suporte dessas versões antes de produção.

Tailwind usa seu plugin Vite e configuração CSS-first, sem necessidade de `tailwind.config.js`. Contratos do domínio não importam React ou SDKs. O currículo está separado da UI; futuros repositórios e adaptadores Supabase devem respeitar essa separação. Ainda não há camadas de serviços ou abstrações de persistência sem uso.

## Navegação e currículo

- `/`: apresentação do aplicativo e das três trilhas.
- `/trilhas/:trailSlug`: unidades da trilha.
- `/trilhas/:trailSlug/unidades/:unitSlug`: duas micromissões da unidade.
- `/trilhas/:trailSlug/unidades/:unitSlug/missoes/:missionSlug`: execução oficial de M01/M02; objetivo/cenário e aviso de atividade não implementada em M03–M20.
- Endereços desconhecidos exibem recuperação para o início.

Exemplo completo: `/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/encontrar-os-caminhos-da-tela`.

O currículo aprovado contém três trilhas, com 3/4/3 unidades, e vinte micromissões fictícias. IDs T01–T03/U01–U10/M01–M20, slugs e títulos são separados. M01/M02 executam nas rotas oficiais; M03–M20 permanecem informativas. Não há progresso inventado ou bloqueio entre as duas práticas. Encontros: doze semanas de aproximadamente 60 minutos; refinamentos permanecem antes da homologação.

## Acessibilidade e privacidade

Layout mobile-first, fontes do sistema, texto base relativo de 18 px, foco visível, link para pular ao conteúdo, landmarks semânticos, links descritivos e atualização de título/foco entre rotas. Não há temporizadores, rankings ou mecânicas punitivas.

Os testes em jsdom verificam comportamento e parte da navegação por teclado, sem renderização visual real. Permanecem pendentes revisão manual em smartphones e desktops, contraste, zoom, reflow, leitores de tela e avaliação com pessoas idosas. **Não se alega conformidade ou validação de acessibilidade.**

Não há banco, autenticação, formulários de dados pessoais, analytics, cookies de rastreamento ou armazenamento de respostas/progresso. Não inserir informações ou credenciais reais nos exemplos. Recursos não dependem de fontes ou imagens remotas.

## Verificação da fundação

Os testes cobrem distribuição curricular, identificadores, objetivos, apresentação das trilhas, fluxo entre páginas, retorno, foco e endereços inválidos. Execute `npm run check` para repetir as verificações. A resposta HTTP do servidor local também deve ser conferida; isso não substitui inspeção visual.

Na entrega inicial, `npm run check` passou: lint sem avisos, 11 testes aprovados, TypeScript sem erros e build concluído. `npm run dev` iniciou e as URLs de início, trilha, unidade e missão responderam HTTP 200. Não houve inspeção visual em navegador nesta sessão.

O Git foi criado pelo usuário do sandbox. Se o Git do seu usuário acusar `detected dubious ownership`, confira o caminho e utilize uma exceção restrita ao comando, por exemplo `git -c safe.directory=C:/Projetos/trilhas-60-mais status`. A entrega não altera a configuração global do Git. Para uso permanente, revisar o proprietário da pasta `.git` no Windows.

## Limites desta entrega

O motor executa somente M01/M02 nas rotas oficiais, com progresso e reconhecimento validados em memória. Não há execução de M03–M20, recompensa persistente, cadastro, login, Supabase, telemetria externa ou publicação. Git é local, sem remoto; não há GitHub ou Vercel configurados. Hospedagem/fallback SPA dependem de autorização.

## Sistema de design — refinamento visual

Tokens em `src/styles/tokens.css` e componentes compartilhados em `src/components`: AppLayout, AppHeader, BrandLogo, PageHeader, AccessibleButton, TrailCard, UnitCard, MissionCard, ProgressIndicator, BackNavigation, EmptyState, StatusMessage, HelpButton e apresentação futura AchievementBadge. Logomarca oficial no cabeçalho, início e rodapé, ajuda expansível e progresso explicitamente não registrado. Nenhum objetivo curricular ou rota foi alterado.

Os testes adicionais incluem axe-core em cinco telas representativas em jsdom, com contraste e tamanho de alvo desativados por falta de renderização real. Testes separados verificam matematicamente os pares de tokens. Não houve captura ou inspeção visual mobile/desktop nesta sessão. Não se alega conformidade WCAG integral. Apenas axe-core foi adicionado como dependência de desenvolvimento, sem mudanças de versões principais.

Consulte [o sistema de design](docs/DESIGN-SYSTEM.md), [as regras do projeto](AGENTS.md), [o roadmap](docs/ROADMAP.md) e [as decisões de DSR](docs/DECISOES-DSR.md). As próximas etapas dependem de autorização.

## Especificação pedagógica — proposta documental

Em `docs/PEDAGOGIA`: [matriz curricular](docs/PEDAGOGIA/MATRIZ-CURRICULAR.md), [especificação das vinte micromissões](docs/PEDAGOGIA/ESPECIFICACAO-20-MISSOES.md), [roteiro de doze encontros](docs/PEDAGOGIA/ROTEIRO-12-ENCONTROS.md) e [rastreabilidade](docs/PEDAGOGIA/RASTREABILIDADE-PEDAGOGICA.md).

A lista definitiva das dez competências e sua correspondência U01–U10/M01–M20 foi fornecida pelo pesquisador a partir do Apêndice 3 da tese e dos requisitos v3.0. Os originais não estavam disponíveis no repositório. As fichas propõem títulos, interações, feedback, ajuda, critérios didáticos e requisitos futuros; não alteram os instrumentos T0/T1/T2, suas dez tarefas, seus escores 0–2 por item ou total máximo 20. Revisão contra os cenários originais ainda é necessária.

A etapa exclusivamente documental preservou o currículo anterior. Posteriormente, o pesquisador aprovou a adoção dos novos títulos/objetivos/cenários e a migração foi executada, conforme histórico abaixo. Os documentos não são código de execução do motor. Candidatos a eventos de Learning Analytics não foram implementados e não autorizam coleta.

## Revisão de consistência e marca oficial

Revisão posterior à etapa exclusivamente documental: BrandLogo integra os dois PNGs fornecidos em `public/brand`, sem editar cores, elementos, proporções ou fundo. A versão principal aparece no cabeçalho e início; a transparente, no rodapé. O slogan oficial é “CONEXÃO • APRENDIZAGEM • AUTONOMIA”. Dimensões, variantes e regras de acessibilidade estão no sistema de design.

Organização definitiva: turma de 20–30 pessoas idosas; doze encontros presenciais semanais de cerca de 60 minutos; dez unidades nas semanas 1–10, revisão na semana 11 e consolidação na semana 12. Blocos flexíveis de 10/30/15/5 minutos e micromissões estimadas em 5–10 minutos, sem contagem regressiva. As habilidades complementares estão nos campos 18 das fichas e no quadro de cobertura da matriz. Instrumentos T0/T1/T2, SUS, IMI e entrevistas respeitam o protocolo e não precisam caber integralmente nesses 60 minutos.

O [relatório de divergências curriculares](docs/PEDAGOGIA/DIVERGENCIAS-CURRICULARES.md) compara trinta entradas, sem executar migração. Dados, IDs, rotas, versão e dependências foram preservados. Lint, tipos, 63 testes (55 anteriores e 8 novos da marca) e build aprovados. A revisão visual em dispositivos/zoom permanece pendente; não há validação integral de acessibilidade.

## Motor demonstrativo — M01 e M02

Com `npm run dev`, abrir http://127.0.0.1:5173/trilhas/primeiros-passos/unidades/operacao-basica-do-celular ou usar o atalho da U01 no início. Rotas oficiais:

- `/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/encontrar-os-caminhos-da-tela`
- `/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/preparar-a-tela-para-ler-um-convite`

Os três acessos anteriores de desenvolvimento redirecionam para essas mesmas páginas/unidade, sem player paralelo. As trinta URLs anteriores à migração conservam a página explicativa existente.

- M01: abrir Recados, visitar Calendário, recuperar o caminho e retornar ao início da simulação.
- M02: reconhecer necessidade de leitura, experimentar controles de texto/brilho/volume, aplicar texto ampliado ou modo de leitura e localizar o local do convite fictício. Brilho/volume sozinhos não resolvem letras pequenas.
- Ajuda, feedback, repetição e reconhecimento sem nota ou limite de tempo. Wi-Fi continua no complemento presencial.
- Estado e eventos internos `local-demo` existem somente na página aberta, sem rede, exportação ou armazenamento. Sair/recarregar reinicia a prática. Nenhum ajuste afeta o aparelho real.

Conteúdo em `src/data/demoMissions.ts`, regras e redutor puros em `src/domain/missions`, hook em `src/app/useMissionExecution.ts`, UI em `src/components/missions` e integração em `src/pages/CurriculumPages.tsx`. DemoMissionPages mantém apenas a compatibilidade de endereços. Detalhes e contrato em [MOTOR-DE-MISSOES.md](docs/ARQUITETURA/MOTOR-DE-MISSOES.md).

Atualização de integração oficial: MissionPage monta MissionRunner somente para M01/M02; DemoMissionPages agora contém apenas redirecionamentos. O ciclo inclui retorno de etapa com checkpoint, interrupção/retomada na mesma página, reinício e repetição. Sair ou recarregar descarta tudo. Eventos internos v2 incluem códigos pedagógicos, versão da definição e tipo da ação, sem identidade, respostas livres ou transmissão.

As demonstrações foram preservadas na migração; a autorização posterior integrou M01/M02 ao percurso oficial, compartilhando título/objetivo/cenário canônicos. M03–M20 ainda exigem autorização de execução. A etapa inicial do motor passou com 91 testes e a migração com 153; a integração oficial passou com 174. axe-core em jsdom não verifica layout/contraste real; não houve avaliação com pessoas idosas.

## Migração curricular aprovada — 10/11/2026

Títulos, objetivos e cenários das vinte fichas foram adotados como base oficial de implementação, sem homologação v1.0.0. Fonte atual: `src/data/curriculum.ts`. Snapshot anterior: `docs/PEDAGOGIA/CURRICULO-ANTERIOR.json`, somente para histórico/testes. Registro de aprovação, inventário de IDs/slugs, reaproveitamento e rotas em [HISTORICO-MIGRACAO-CURRICULAR.md](docs/PEDAGOGIA/HISTORICO-MIGRACAO-CURRICULAR.md).

As trinta URLs antigas de unidades/missões mostram uma explicação e acesso ao currículo atual; não há redirecionamento ou alias por posição. Os três slugs de trilha foram mantidos porque seus temas/títulos não mudaram. Nenhum progresso de usuário foi criado ou transferido. As vinte fichas mostram conteúdos aprovados, mantendo a execução fora deste percurso.

Verificação: `npm run check` aprovado, lint/tipos/build sem erros e 153 testes em nove arquivos. Foram preservadas as verificações anteriores e adaptadas apenas expectativas ligadas aos dados migrados. Testes adicionais verificam títulos/objetivos/cenários contra as fichas, ordem, cardinalidade, unicidade de códigos/slugs, vínculos e navegação das vinte fichas/trinta URLs legadas. Continuam pendentes refinamentos pedagógicos, revisão de não sobreposição frente aos instrumentos originais e inspeção manual/assistiva. Não houve mudança de dependências, nova execução de missões, dados pessoais ou publicação.

Verificação posterior da integração oficial: **174 testes em dez arquivos**, lint sem avisos, TypeScript e build aprovados. Mantidos os 153 testes, com expectativas alteradas apenas nas mudanças autorizadas de rota/disponibilidade e evento versionado; onze testes de domínio e dez de integração foram adicionados. Não havia ferramenta de navegador/captura disponível nesta sessão. Continuam pendentes inspeção de layout/zoom/reflow e leitor de tela real; os testes não demonstram conformidade integral WCAG 2.2.
