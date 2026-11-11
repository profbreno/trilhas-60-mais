# Percurso integrado — implementação e verificação intermediária

10/11/2026 · `0.1.0-dev` · React/TypeScript, sem novas dependências ou publicação.

A página inicial apresenta as três trilhas, dez unidades e vinte micromissões em um percurso vertical. A ordem visual acompanha a ordem no HTML. Cada unidade tem uma lista ordenada de duas missões, com círculos de 80 CSS px, ícone Lucide decorativo, código, título, modalidade e estado escrito. Linhas entre os nós da unidade são elementos decorativos com `aria-hidden`; não representam progresso. Não há alternância horizontal, animação obrigatória, bloqueio ou conclusão fictícia.

M01/M02 são **Disponíveis** porque têm definição executável no registro atual do motor. M03–M20 são **Em desenvolvimento** e abrem diretamente suas propostas informativas. A disponibilidade não é deduzida da posição nem de progresso. Não é preciso concluir M01 para abrir M02.

## Fluxo e comparação de ações

Contagem de ativações mínimas de controles a partir da página inicial, igual para M01 e M02. Rolagem, quantidade de Tab, leitura e ações internas da tarefa não entram nesta contagem. As etapas de apresentação/instruções do motor foram mantidas.

| Percurso | Até a página funcional da missão | Até iniciar a prática | Páginas de rota visitadas, incluindo início |
| --- | --- | --- | --- |
| Anterior hierárquico: início → trilha → unidade → missão → conhecer → começar | 3 ações | 5 ações | 4 |
| Atalho anterior: início → U01 → missão → conhecer → começar | 2 ações | 4 ações | 3 |
| Atual principal: início/percurso → nó da missão → conhecer → começar | 1 ação | 3 ações | 2 |

O percurso remove duas ativações e duas páginas em relação à navegação hierárquica anterior; remove uma ativação e uma página em relação ao atalho anterior. Dentro da página da missão, apresentação → instruções → prática continuam sendo fases do motor, sem novas rotas ou alterações pedagógicas. Essa redução estrutural **não demonstra melhoria de usabilidade com pessoas idosas**, redução de esforço cognitivo, aprendizagem ou eficácia.

Atalhos permitem ir às três trilhas ou focar a primeira missão disponível. “Voltar ao percurso” retorna à unidade correspondente pelo hash `/#percurso-u01` etc. Em M01/M02 há também retorno ao final do player, disponível nas fases de atividade, interrupção e conclusão. Sair continua descartando a execução e os eventos em memória; não foi criada persistência para manter progresso no percurso.

As rotas oficiais, páginas de trilha/unidade, trinta endereços legados e redirecionamentos de desenvolvimento foram preservados. O acesso hierárquico permanece opcional ao final da página inicial, para consulta e compatibilidade; não é etapa obrigatória. Os caminhos canônicos de M01/M02 continuam iguais.

## Componentes e arquitetura

- `src/components/LearningPath.tsx`: LearningPath e composição interna PathNavigation, PathSection, PathUnit e PathMissionNode. Dados vêm de `trails` e do registro `getMissionDefinition`; não foi copiado o currículo para uma segunda lista.
- `src/pages/HomePage.tsx`: introdução compacta, logomarca oficial, percurso, acessos alternativos e informação do projeto.
- `src/components/AppLayout.tsx`: foco e rolagem para alvos hash existentes, tanto entre rotas quanto dentro do percurso, preservando foco no main quando não há destino específico.
- `src/domain/curriculumPaths.ts`: função de âncora de unidade baseada no identificador estável.
- `AppHeader`, `CurriculumPages` e `MissionRunner`: nomes da navegação e retornos ao percurso; nenhum validador, critério, feedback, ajuda ou evento foi modificado.
- `src/styles/index.css`: estilos do percurso, listas, nós, linhas, estados e foco com tokens existentes.
- `src/app/LearningPath.test.tsx`: dez testes adicionais. Nenhum dos 176 testes anteriores foi editado ou removido.
- `scripts/verificar-percurso.mjs`: verificação opcional no Chrome instalado, com `ws` transitivo e axe-core já presentes no lockfile. Não adiciona telemetria ou captura ao produto.

SHA-256 de `src/data/curriculum.ts` preservado: `4b116065a7eb3ec2e4b71ebc5cd97bcce37a1aaf8ea64dbcf63b487062c41dfd`. Os dois PNGs oficiais conservaram os hashes registrados na revisão U01. Objetivos, instrumentos T0/T1/T2 e identidade visual não foram alterados.

## Verificações realizadas

| Evidência | Procedimento | Resultado |
| --- | --- | --- |
| Suíte existente e ampliada | `npm run check`: lint, Vitest/Testing Library/axe jsdom, tipos e build | **186 testes em doze arquivos**, lint sem avisos, TypeScript e build aprovados |
| Ordem e integridade | Testes das três trilhas, dez unidades e vinte nós/links; modalidades A/B e estados escritos | Ordem e rotas oficiais preservadas; 18 propostas sem motor, dois acessos livres |
| Foco/retorno | Testes dos atalhos, hash direto U10, retorno de M01/M02 interrompidas, M01 concluída e M03 informativa | Foco no título da unidade/região ou no nó da primeira missão; sem progresso fictício |
| Chrome real headless | Chrome 157.0.8103.50 em perfil isolado, 320/360/768/1280 × 900 px | Sem overflow horizontal nos estados examinados; vinte links medidos acima de 48 × 48 px |
| Teclado em navegador | Tab e Enter via CDP; atalho à primeira missão, M02 sem concluir M01, pausa/retorno; M01 conclusão/retorno; M03 proposta/retorno | Quatro larguras passaram, sem usar `.click()` ou `.focus()` para executar ações |
| Axe no navegador | Oito auditorias da página inicial inteira, no topo e após foco em M01, contraste/target-size habilitados | Zero violações reportadas e zero itens inconclusivos na execução final, após corrigir a camada da conexão decorativa. Não equivale a conformidade integral |
| Cores efetivas dos círculos | getComputedStyle em Chrome + cálculo de luminância dos vinte nós | M01/M02 branco sobre verde-petróleo: **8,13:1**; demais códigos sobre branco: **6,43:1**. Cobre os pares sólidos renderizados, não toda combinação de sobreposição ou estado |
| Capturas | Oito PNGs reais; inspeção visual de 360 px (topo/nós) e 1280 px (nós) | Nomes quebram linha; código, modalidade e disponibilidade legíveis; foco contorna o link inteiro |

Na primeira rodada, TypeScript detectou children como lista de strings no retorno; corrigido para expressão única, mantendo o contrato de BackNavigation. Um teste novo usava “Trilha 3” em vez de “Trilha 03”; corrigida somente a expectativa nova. O axe inicialmente deixou contraste inconclusivo em dez códigos por sobreposição de outro elemento. A conexão visual foi explicitamente ocultada das tecnologias assistivas e o link recebeu camada acima da linha (`z-index: 1`), eliminando a interferência na auditoria final. O check final passou. Nenhuma regra foi desativada para obter esse resultado.

## Evidências e reprodução

- [Mobile, início](evidencias/PERCURSO/percurso-360-inicio.png) e [mobile, nós](evidencias/PERCURSO/percurso-360-u01.png).
- [Desktop, início](evidencias/PERCURSO/percurso-1280-inicio.png) e [desktop, nós](evidencias/PERCURSO/percurso-1280-u01.png).
- [320 px](evidencias/PERCURSO/percurso-320-u01.png), [768 px](evidencias/PERCURSO/percurso-768-u01.png).
- [Auditorias e dimensões](evidencias/PERCURSO/navegador.json); [cores renderizadas e contraste dos nós](evidencias/PERCURSO/contraste-nos.json).

Para executar o app: `npm run dev`, acessar `http://127.0.0.1:5173`. Para os testes normais: `npm run check`. Para repetir a inspeção opcional, preparar Vite em 5173 e Chrome isolado conforme o roteiro da [revisão U01](REVISAO-TECNICA-U01.md), substituindo a porta de depuração por **9224**, e executar `node scripts/verificar-percurso.mjs`. As capturas são do navegador de desenvolvimento local, não de um dispositivo físico. O script regrava somente as evidências deste percurso.

## Pendências antes das próximas missões

- Conferir manualmente contraste e foco sobre a conexão, incluindo hover, alto contraste/cores forçadas e estados selecionados. A medição de cores não encerra a inspeção visual.
- Confirmar **zoom real do navegador a 200%**: abrir janela visível, usar menu Zoom 200%, percorrer atalhos/nós/retornos e verificar texto inteiro, foco e ausência de perda de funcionalidade. Viewport de 320 px não substitui essa verificação.
- Com NVDA ou alternativa, ler trilhas/unidades/listas, nomes de links e estados; verificar se o foco de retorno comunica a unidade e se não há repetição excessiva. Rádios/feedback do motor conservam as pendências da revisão U01.
- Repetir em smartphone físico, retrato/paisagem e toque. Verificar navegação reversa por Shift+Tab, gestos usuais de rolagem e descoberta dos atalhos.
- Avaliar extensão da página e compreensão da sequência com pessoas idosas em etapa autorizada. A página com vinte propostas é longa; os atalhos reduzem a necessidade de percorrê-la inteira, mas isso não foi validado empiricamente.
- Preservar instrumentos e conferir os documentos originais ainda pendentes. Obter autorização antes de M03/M04, backend ou coleta.

Este registro é evidência intermediária de construção/verificação DSR. Não é D07, teste com participantes ou declaração de conformidade integral WCAG 2.2. Não foram adicionadas missões, banco, autenticação, progresso persistido, pontuação, ranking, bloqueios ou publicação.
