# Trilhas 60+ — regras para contribuições

## Escopo e autorização

Versão inicial: `0.1.0-dev`. Artefato de pesquisa de doutorado em Educação para pessoas 60+. Esta fase é uma demonstração local. Não implementar motor de missões, autenticação, banco, telemetria, persistência de progresso ou publicação sem autorização para a etapa correspondente. Não configurar remoto nem enviar código sem autorização. Preservar alterações existentes e nunca inserir credenciais no repositório.

Escopo vigente: migração curricular controlada aprovada e executada em 10/11/2026, com códigos U01–U10/M01–M20 e títulos/objetivos/cenários aprovados como base oficial de implementação. Preservar código pedagógico separado de slug e título. A fonte anterior está arquivada; consultar `docs/PEDAGOGIA/HISTORICO-MIGRACAO-CURRICULAR.md`.

Autorização atual: execução demonstrativa de M01–M10 (U01/U02/U03/U04/U05) nas rotas oficiais, com ajuda, retorno, interrupção/retomada, reinício e repetição em memória. Os três acessos antigos de desenvolvimento continuam limitados à U01, sem player paralelo. Não implementar M11–M20, backend, persistência, exportação, painel ou coleta. Não alterar o currículo aprovado. Consulte `docs/ARQUITETURA/MOTOR-DE-MISSOES.md` e `docs/AVALIACAO/VERIFICACAO-U02.md`.

## Arquitetura

- React + TypeScript estrito + Vite; npm e package-lock.json versionado.
- React Router para rotas; Tailwind CSS e estilos compartilhados; Lucide para ícones.
- `src/domain`: contratos sem dependência de React ou fornecedores.
- `src/data`: currículo fictício, separado da apresentação.
- `src/components`: interface reutilizável; `src/pages`: páginas; `src/app`: composição e navegação.
- Não acessar serviços diretamente nos componentes. Em futura integração ao Supabase, definir contratos de repositório no domínio e adaptadores separados. Não criar camadas vazias nesta fase.
- Sem frameworks adicionais sem justificativa. Manter identificadores curriculares estáveis, rotas legíveis e erros de endereço tratados.
- Executar `npm run check` após alterações funcionais; testar comportamento e integridade curricular, evitando testes que apenas copiem a implementação.

## Pedagogia

- Três trilhas com 3, 4 e 3 unidades; duas micromissões por unidade (20 no total). Turma de 20–30 pessoas idosas, doze encontros semanais de aproximadamente 60 minutos: U01–U10 nas semanas 1–10, revisão na 11 e consolidação na 12. Organização flexível 10/30/15/5 minutos; missões estimadas em 5–10 minutos, nunca como limite punitivo.
- Linguagem simples, respeitosa e não infantilizada. Não presumir incapacidade por idade.
- Apoiar autonomia, competência e pertencimento; feedback informativo e repetição sem penalidade.
- Proibidos rankings públicos, temporizadores punitivos, competição coercitiva e perda de conquistas por inatividade.
- Não inventar evidências de eficácia, resultados da pesquisa, aprovação ética ou validação dos conteúdos.

## Acessibilidade

- Mobile-first; conteúdo utilizável com teclado, zoom e leitura em telas pequenas.
- HTML semântico, um h1 por página, títulos hierárquicos, rótulos claros, link para pular ao conteúdo e foco visível.
- Em troca de rota, atualizar título e direcionar foco ao conteúdo. Ícones decorativos devem ter `aria-hidden`.
- Priorizar controles com área mínima de 48 × 48 CSS px; verificar contraste (referência de projeto: WCAG 2.2 AA, 4,5:1 para texto comum e 3:1 para texto grande e componentes).
- Não depender apenas de cor, hover ou animação. Respeitar movimento reduzido e cores forçadas.
- Testes automatizados não demonstram conformidade. Não alegar acessibilidade validada; planejar inspeção manual, tecnologias assistivas e avaliação com pessoas idosas.

## Segurança e privacidade

- Usar somente dados fictícios. Não solicitar nome, e-mail, senha real, documento ou dados de saúde nesta fase.
- Sem cookies de rastreamento, analytics, localStorage ou chamadas a serviços de dados.
- Fontes e recursos visuais locais; não adicionar embeds ou recursos externos sem necessidade.
- Em etapa futura, credenciais administrativas nunca devem ir para o navegador. Planejar consentimento, minimização de dados, RLS e revisão ética antes de coletar dados.
- Manter `.env*` fora do Git; revisar dependências e documentar limitações honestamente.

## Sistema de design

- Refinamento UX-01 autorizado: manter a apresentação inicial sem segunda marca, um acesso principal ao percurso, tarefa e interação em destaque. Opções secundárias e informações em details/summary nativos; preservar os avisos de simulação, ausência de tempo limite e descarte ao sair. Etapa visual não é critério concluído. Não restaurar barras/listas extensas acima da tarefa sem evidência; não retirar objetivos, ajustes ou funções. Ver `docs/AVALIACAO/REFINAMENTO-UX-01.md`. Testes de summary em jsdom não substituem sua ativação por teclado no navegador.

- Navegação principal autorizada: LearningPath na página inicial, com dados curriculares compartilhados e disponibilidade derivada de getMissionDefinition. Preservar vinte nós na ordem, estados escritos e linhas decorativas aria-hidden. Não inferir progresso ou bloquear M02. Manter rotas hierárquicas opcionais e retorno por hash de unidade com foco/rolagem; sair continua descartando execução. Ver `docs/AVALIACAO/PERCURSO-INTEGRADO.md`.

- Seguir `docs/DESIGN-SYSTEM.md` e os tokens em `src/styles/tokens.css`. Usar BrandLogo com os PNGs oficiais em `public/brand`; preservar cores, tipografia, elementos, fundo e proporções de cada variante. Não redesenhar, recolorir, recortar ou substituir por recriação textual. Slogan: “CONEXÃO • APRENDIZAGEM • AUTONOMIA”.
- Reutilizar AppLayout, AppHeader, PageHeader e cartões compartilhados. AccessibleButton usa botão para ações e link para navegação. BackNavigation tem destino explícito.
- HelpButton é ajuda local expansível por teclado; não envia solicitações a terceiros.
- ProgressIndicator permanece sem contagens em trilhas/unidades e nas dez missões informativas. Em M01–M10 oficiais, usar somente critérios validados em memória. Success/AchievementBadge reconhecem prática efetiva, sem nota, proficiência, competição ou conquista persistente. Voltar restaura critérios do checkpoint; reinício limpa a tentativa sem penalização.
- U02 usa modalidade communication compartilhada: preparo pertinente, prévia, confirmação de revisão e simulação. Editar exige nova revisão; trocar arquivo invalida conferência do anexo. Preservar confirmação no Grupo de leitura (M03) e programa/pessoa/contexto (M04). Áudio é representação com transcrição, nunca voz do participante ou API real; texto é equivalente. Não incluir escolhas, mensagens ou conteúdo de arquivos nos eventos.
- StatusMessage anuncia somente atualizações dinâmicas marcadas com announce. Não anunciar avisos estáticos como urgentes.
- Preservar os testes de fundação; texto do skip link foi ajustado conforme pedido. Executar testes de componentes, axe-core e contraste ao modificar componentes e tokens.
- axe-core em jsdom exclui contraste e tamanho de alvo. Testes matemáticos dos tokens não verificam cores renderizadas. Zoom a 200%, reflow, dispositivos e leitores de tela exigem inspeção manual.

- U03 usa modalidade search determinística, com cartões e resultados autorais locais, sem consultas livres ou busca externa. Preservar biblioteca em M05 e oficina gratuita de jardinagem em M06. Guardar não conclui: recuperar é obrigatório. M06 exige comparação, origem/data e lembrete coerente; referência temporal fictícia fixa. Refinamento/edição invalidam evidências posteriores. CP-U03 de saúde permanece presencial e sem conteúdo clínico. Ver docs/AVALIACAO/VERIFICACAO-U03.md.

- U04 usa information-check: três pistas em qualquer ordem, comparação, interpretação justificada, revisão e decisão simulada. M07 preserva aviso antigo da biblioteca; M08 preserva distribuição de plantas não confirmada. Não confundir contradita com não verificada nem inferir confiança de aparência, cadeado, linguagem formal ou contato conhecido. Resposta M08 deve ser respeitosa, explicitar incerteza e próximo passo independente. Editar invalida revisão, rever investigação exige nova comparação. Suporte a três condições no contrato não autoriza novas missões. Ver docs/AVALIACAO/VERIFICACAO-U04.md.

- U05 usa privacy-decision com configuração fictícia de conta e editor fechado de convite. Sem campos livres, senha/código real ou autenticação. M09 exige comparação fundamentada, etapa adicional, função/uso do código no acesso e recusa de repasse com motivo; tentativa de enviar nunca transmite ou conclui. M10 exige convite útil e minimizado para a finalidade pública, com remoção/recolocação, público justificado e revisão. Canal público opcional não é contato privado. Rever preparação invalida decisões posteriores; editar invalida revisão. Não registrar valores sintéticos ou escolhas nos eventos. Ver docs/AVALIACAO/VERIFICACAO-U05.md.

## Registro das decisões

Registrar decisões e suas justificativas em `docs/DECISOES-DSR.md`; manter `docs/ROADMAP.md` e README coerentes com o escopo implementado. Distinguir intenção de design, implementação e evidência de avaliação.

Cobertura adicional está nos complementos CP-U01–CP-U10 e nos campos 18 das fichas. A migração dos metadados foi autorizada; PR01–PR05 não autorizam expansão da execução. URLs antigas de unidades/missões recebem explicação e links temáticos, sem aliases por posição ou equivalência presumida. Preservar instrumentos T0/T1/T2, SUS, IMI e entrevistas conforme protocolo, sem exigir que caibam integralmente no encontro e sem copiar itens para as missões.

O pedido do motor autorizou brilho e volume simulados na M02. Não transformar esse controle em ajuste do aparelho ou em critério de domínio; tamanho de texto é atendido por texto ampliado ou modo de leitura. Eventos `local-demo` não são o contrato futuro de Learning Analytics E1–E8, não contêm respostas brutas/identidade e não saem da página.

Contrato demonstrativo atual: schemaVersion 2, códigos pedagógicos, definitionVersion e ordinal de tentativa; eventos step_started/step_completed, attempt_incorrect e mission_restarted, além do ciclo documentado. Não usar eventos como escore ou prova de autonomia. Interrupção só retoma na mesma página montada; sair/recarregar descarta o estado.
