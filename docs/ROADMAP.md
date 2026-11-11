# Roadmap — Trilhas 60+

## Entrega vigente — redesign do participante MVP

- [x] Home curta, três resumos e ação principal; Início/Trilhas/Conquistas com percurso completo separado.
- [x] M01/M02 com entrada única, instruções sob demanda, tarefa e feedback em foco; critérios/ciclo preservados.
- [x] M03–M10 acessíveis e M11–M20 informativas; currículo, logomarca e instrumentos intactos.
- [x] Lint, TypeScript, 331 testes e build aprovados; testes com dois workers para o ambiente Windows.
- [ ] Revisão visual em 360/1280 px, zoom nativo 200%/400%, reflow 320 px, teclado/summary no navegador, contraste renderizado e foco junto à navegação inferior. Bloqueio do controle de navegador documentado.
- [ ] Tecnologias assistivas, toque em aparelhos físicos e avaliação com participantes.
- [ ] Triagem separada dos alertas herdados nas dependências.

[Comparação e evidências](AVALIACAO/REDESIGN-PARTICIPANTE-MVP.md). PR em rascunho até a inspeção visual; sem merge, publicação, persistência, instrumentos alterados ou missões novas. Registros seguintes são históricos.


## Entrega vigente — U05

- [x] M09/M10 nas rotas oficiais: configuração fictícia de conta e edição reversível de convite, sem entrada de credenciais, contas ou envio reais.
- [x] Critérios observáveis de comparação, distinção/proteção de código, minimização contextual, público e revisão; eventos exclusivamente em memória.
- [x] Preservar 290 testes e acrescentar 33, total 323; lint, tipos e build aprovados. Chrome: 50 estados/cinco percursos, zoom nativo 200%/400%, reflow e contraste inconclusivo investigado separadamente. [Verificação U05](AVALIACAO/VERIFICACAO-U05.md).
- [ ] Executar leitor de tela real, toque/dispositivos físicos e avaliação da compreensão e da carga de edição.
- [ ] Revisar materiais CP-U05 e conferir não sobreposição aos instrumentos originais, sem modificá-los.
- [ ] Obter autorização antes de M11/M12, Supabase, persistência, coleta ou publicação.

Escopo atual M01–M10 disponíveis, M11–M20 informativas, 0.1.0-dev. Registros seguintes são históricos.


## Entrega vigente — U04

- [x] Conferência documental da Trilha 1 e distinção aplicativo/complementos presenciais, sem alegar execução ou aprendizagem.
- [x] M07/M08 com investigação, comparação, interpretação justificada, resposta respeitosa e revisão, via modalidade information-check.
- [x] Preservar 253 testes anteriores e acrescentar 37, total 290; lint, tipos e build aprovados. Chrome: 50 estados, cinco percursos, zoom nativo 200%/400%, reflow e investigação dos dois contrastes inconclusivos. [Relatório U04](AVALIACAO/VERIFICACAO-U04.md).
- [ ] Executar leitor de tela real, dispositivos físicos, avaliação de compreensão e revisão de materiais/carga presencial.
- [ ] Conferir não sobreposição com instrumentos originais, sem alterá-los; revisar CP-U04.
- [ ] Obter autorização antes de M09/M10, Supabase, coleta, persistência ou publicação.

Escopo atual: M01–M08 disponíveis, M09–M20 informativas, 0.1.0-dev. Os registros seguintes mantêm o histórico das etapas.


## Entrega vigente — U03

- [x] M05/M06 nas rotas oficiais: pesquisa local determinística, refinamento, comparação, fonte/data, organização e recuperação; sem coleta, backend ou persistência.
- [x] Preservar 225 casos anteriores e ampliar regressão de domínio/interface; ver [relatório U03](AVALIACAO/VERIFICACAO-U03.md) para resultados e evidências.
- [x] Investigar separadamente os três inconclusivos U02; resultado bruto preservado e medição dirigida documentada no relatório U03.
- [ ] Executar Narrador/Edge e inspeção em dispositivos físicos; avaliar carga textual/rolagem com público em etapa autorizada.
- [ ] Revisar materiais do CP-U03 de busca administrativa em saúde fictícia e conferir não sobreposição frente aos instrumentos originais.
- [ ] Obter autorização antes de M07/M08 ou qualquer integração/publicação. Não há progressão automática de escopo.

Os itens históricos seguintes mantêm a situação registrada em cada rodada; não são resultados novos.


Cada nova etapa depende de autorização explícita. A base curricular foi aprovada e migrada, com refinamentos antes de v1.0.0. M01–M06 executam nas rotas oficiais com ciclo de vida em memória. M07–M20, integração de dados e publicação continuam fora do escopo; a versão permanece 0.1.0-dev.

## Etapa 1 — Fundação local (0.1.0-dev)

- [x] Investigar individualmente os cinco inconclusivos: mesmo skip link oculto; contraste visível com foco/hover medido e aprovado, sem alteração da identidade. Resultados brutos do axe continuam inconclusivos. [Fechamento dirigido](AVALIACAO/FECHAMENTO-ACESSIBILIDADE-U01.md).
- [x] Preparar roteiro Narrador/Edge com esperado/observado por teste e checklist dos vinte nós.
- [ ] Executar o roteiro com Narrador/Edge reais e anexar resultados; conferir dispositivos físicos e o indicador gráfico de seleção nativo não medido nesta rodada.

- [x] Verificação interna U01: zoom nativo 200%/400%, fonte ampliada, viewport 320, teclado e correções pontuais de reflow/skip link; 191 testes e check aprovados. [Relatório](AVALIACAO/VERIFICACAO-ACESSIBILIDADE-U01.md).
- [ ] Executar roteiro real com leitor de tela e inspecionar dispositivos físicos; prontidão permanece parcial. Contraste dos cinco itens recebeu medição dirigida posterior, sem converter o resultado automático em aprovação.

- [x] Refinamento visual UX-01: início compacto, informações sob demanda, área interativa priorizada, capturas comparativas e 191 testes aprovados. [Relatório](AVALIACAO/REFINAMENTO-UX-01.md).
- [ ] Avaliar descoberta das opções, relação ajustes/prévia, etapa versus critério e uso em alturas menores; confirmar zoom real 200% e leitor de tela antes de alegar validação.

- [x] Percurso integrado autorizado: vinte nós, atalhos, disponibilidade real, acesso direto M01/M02 e retorno focado à unidade no percurso; rotas antigas preservadas. [Comparação e evidências](AVALIACAO/PERCURSO-INTEGRADO.md), 186 testes e check aprovados.
- [ ] Inspecionar zoom real 200%, leitor de tela, contraste sobre conexões e compreensão/extensão do percurso em dispositivos físicos e avaliação autorizada. Nenhuma expansão de missão iniciada.

- [x] React, TypeScript, Vite, React Router, Tailwind e Lucide.
- [x] Currículo fictício: 3 trilhas, 10 unidades, 20 micromissões.
- [x] Páginas navegáveis de início, trilha, unidade e informação de missão.
- [x] Semântica, teclado, foco, estilos responsivos e avisos de demonstração.
- [x] Lint, tipos, testes de comportamento e build.
- [x] Documentação e Git local, sem remoto.
- [ ] Revisão visual em dispositivos reais, zoom e tecnologias assistivas (pendente).

## Etapa 2 — Sistema de design implementado; avaliação pendente

- [x] Tokens visuais e integração da logomarca oficial, preservando as duas artes originais.
- [x] BrandLogo reutilizável no cabeçalho, início e rodapé, com variantes e nomes acessíveis.
- [x] Layout, cabeçalhos, botões, cartões e retornos compartilhados.
- [x] Ajuda contextual expansível por teclado.
- [x] Progresso sem contagens fictícias e apresentações futuras de sucesso e conquista.
- [x] Testes de componentes, currículo completo, axe-core e contraste dos tokens.
- [x] Documentação do sistema de design e decisões DSR.
- [ ] Inspeção e capturas mobile, tablet e desktop; zoom 200%, reflow, foco, alvos e leitores de tela.
- [x] Revisão técnica intermediária U01: Chrome headless a 360/768/1280 px, reflow M02 adicional a 320 px, 13 capturas e correção pontual de alvo. Ver [evidências e limites](AVALIACAO/REVISAO-TECNICA-U01.md); 176 testes e check aprovados. Não substitui D07.
- [ ] Completar zoom real a 200%, leitores de tela, contraste inconclusivo em cores forçadas e inspeção em aparelho físico; avaliar carga de informação e descoberta da ajuda na M02 antes de expansão autorizada.
- [x] Documentação proposta de matriz, vinte micromissões, doze encontros e rastreabilidade em `docs/PEDAGOGIA`.
- [x] Incorporação dos nomes/números definitivos das dez competências fornecidos pelo pesquisador.
- [x] Organização definitiva: turma de 20–30 pessoas, doze encontros semanais de aproximadamente 60 minutos; U01–U10 nas semanas 1–10, revisão integrada na 11 e consolidação na 12.
- [x] Cobertura adicional documentada nos complementos CP-U01–CP-U10, com micromissões estimadas em 5–10 minutos sem limite punitivo.
- [x] Relatório de divergências das dez unidades e vinte missões, sem migração do código.
- [x] Aprovação dos títulos, objetivos e cenários como base oficial de implementação.
- [ ] Refinamento de feedbacks, carga, materiais e alternativas acessíveis antes de homologação; não equivale a reabrir a adoção já aprovada.
- [ ] Conferência com tese (Apêndice 3, p. 82–83) e requisitos v3.0 (seção 4, p. 5–6), cujos originais não estavam disponíveis no repositório.
- [ ] Revisão de não sobreposição com cenários T0/T1/T2, sem alterar pontuação ou formas do instrumento.
- [x] Migração controlada: IDs separados de slugs/títulos, vínculos válidos, ordem 3/4/3 e duas missões A/B por unidade.
- [x] Arquivo do currículo anterior, histórico de correspondências por conteúdo e tratamento explicativo de trinta URLs antigas.
- [ ] Aprovação de eventuais ampliações centrais PR01–PR05; conferência dos materiais complementares e da mediação para 20–30 pessoas.
- [ ] Avaliação com pessoas idosas em etapa autorizada; nenhum teste com participantes realizado aqui.

Revisar atividades, materiais e capacidade de mediação dentro da organização temporal já definida, sem pedir nova aprovação da duração. T0/T1/T2, SUS, IMI e entrevistas seguem seus momentos previstos no protocolo, sem obrigação de caber integralmente nos 60 minutos. Realizar inspeção por teclado, contraste, reflow a 320 CSS px, zoom a 200% e 400%, leitores de tela e, em etapa própria, testes com pessoas idosas. Registrar problemas e ajustes sem alegar eficácia educacional.

## Etapa 3 — Motor demonstrativo e M01–M04 implementados

- [x] U02 autorizada: M03 composição/confirmação e áudio representado; M04 arquivo conferido, destinatário/contexto, revisão e simulação, com edição/remoção.
- [x] Modalidade compartilhada communication, mantendo ciclos, critérios e eventos existentes; quatro nós disponíveis e dezesseis informativos.
- [x] 225 testes (191 anteriores + 34 novos), check aprovado; 40 estados Chrome, teclado, zoom nativo e reflow. [Relatório U02](AVALIACAO/VERIFICACAO-U02.md).
- [ ] Inspecionar Narrador/Edge, dispositivos físicos e três itens inconclusivos de contraste; avaliar carga/compreensão e materiais CP-U02 antes de ampliar o recorte.

Itens seguintes preservam o histórico de implementação da U01:

- [x] Definições tipadas, conteúdo separado, validadores puros e estado de execução independente da UI.
- [x] Apresentação, instruções, prática, feedback, ajuda, critérios reais, reconhecimento e repetição sem penalização.
- [x] M01 com navegação e recuperação; M02 com ajustes isolados, alternativas equivalentes e localização de informação.
- [x] Execução oficial M01/M02; acessos anteriores de desenvolvimento redirecionam para a unidade/missões oficiais, sem duplicidade pedagógica.
- [x] Retorno com checkpoint, interrupção/retomada na página, reinício e repetição voluntários.
- [x] Eventos demonstrativos v2 com códigos/versão da definição, sem identidade, resposta bruta ou transmissão.
- [x] Eventos demonstrativos limitados em memória, sem identidade, respostas brutas, exportação ou transmissão.
- [x] Testes do domínio/fluxos/semântica e documentação em `docs/ARQUITETURA/MOTOR-DE-MISSOES.md`.
- [ ] Inspeção visual/assistiva e revisão pedagógica das duas práticas, incluindo tempo estimado e conferência com instrumentos originais.
- [x] Base curricular preservada e integração somente de M01/M02, sem bloqueio de acesso entre elas.
- [x] 174 testes, incluindo os 153 anteriores adaptados apenas às mudanças autorizadas; tipos/lint/build aprovados.
- [ ] Autorização para M05–M20 e demais funcionalidades; permanecem informativas.

Wi-Fi continua no complemento presencial. Candidatos E1–E8 de Learning Analytics não foram instrumentados; os eventos internos `local-demo` servem somente aos testes do motor. Coleta, backend e persistência exigem etapa própria.

## Etapa 4 — Persistência e identidade (não iniciada)

Definir requisitos mínimos de identidade, consentimento e retenção. Somente depois implementar adaptadores Supabase, schema, RLS e testes de autorização. Revisar condições éticas e privacidade antes de qualquer dado real.

## Etapa 5 — Publicação e intervenção (não iniciada)

Autorizar e configurar GitHub e Vercel; revisar versões de Node e ferramentas, segurança, fallback das rotas SPA e ambiente de produção. Planejar suporte e avaliação da intervenção híbrida de 12 semanas. Não iniciar coleta ou intervenção pela simples conclusão técnica do protótipo.
