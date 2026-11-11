# Redesign do participante — protótipo MVP

Data: 11/11/2026. Versão: `0.1.0-dev`. Base: `master` em `810c4f307f561b8c98d1740339cf4cda0fd07fee`. Branch: `feat/redesign-participante-mvp`. Sem publicação, persistência ou alteração de instrumentos de pesquisa.

## Alterações concretas

- Início: saudação curta, cartão M01 com “Continuar aprendendo” e três resumos do currículo oficial. Informações institucionais sob demanda. A ação sugere M01; não presume uma execução anterior ou retomada salva.
- Navegação inferior: Início / Trilhas / Conquistas, com texto, ícone decorativo, indicação de página atual e foco visível. “Trilhas” fica selecionada também nas rotas oficiais de unidade e missão.
- `/trilhas`: percurso completo reutiliza LearningPath, vinte nós, ordem 3/4/3 unidades e disponibilidade derivada de getMissionDefinition. Links e retornos usam os mesmos slugs e âncoras de unidade, agora nesta aba.
- `/conquistas`: explica a ausência de histórico salvo, sem porcentagem, medalhas atribuídas, pontos ou conquistas fictícias.
- M01/M02: apresentação e instruções reunidas; um botão começa a prática. Instruções completas em “Como participar”. Uma tarefa por vez, feedback inline, ajuda local discreta, retorno de etapa e percurso. A conclusão da M01 não mantém os controles do celular desabilitados à vista; na M02, convite e desfazer ficam disponíveis em “Rever o convite e os ajustes”. Repetir continua disponível.
- Breadcrumbs removidos de M01/M02; retorno hierárquico opcional em “Outros caminhos”. M03–M10 preservam seus renderers e entradas, com retorno atualizado para a aba Trilhas. M11–M20 permanecem informativas.

Não houve alteração em `src/domain`, `src/data`, critérios, contratos/eventos, identificadores, instrumentos de pesquisa, arquivos oficiais da marca, tokens de cor, dependências ou lockfile. O botão de início de M01/M02 despacha as duas transições existentes (`start-mission`, `start-activity`), mantendo `mission_started` e `step_started`; consultar instruções não valida critérios. Pausa retém estado só na página montada; sair ou trocar de aba descarta a execução.

## Antes/depois: telas e ações

Contagem por inspeção da navegação implementada, sem tempo de tarefa ou avaliação com participantes. “Tela” abaixo significa estado apresentado, não uma nova URL. Não conta rolagem nem abertura opcional de ajuda/instruções.

| Caminho | Antes | Depois |
| --- | --- | --- |
| Home → primeira tarefa M01 | Nó M01 → Conhecer → Começar: 3 ações; 4 estados incluindo home | Continuar → Começar: 2 ações; 3 estados incluindo home |
| Home → primeira tarefa M02 | Nó M02 → Conhecer → Começar: 3 ações; 4 estados | Trilhas → M02 → Começar: 3 ações; 4 estados |
| Home → primeira tarefa M03–M10 | Nó → Conhecer → Começar: 3 ações | Trilhas → nó → Conhecer → Começar: 4 ações; custo de um acesso ao percurso separado |
| Link direto M01/M02 → tarefa | 2 ações e 3 estados | 1 ação e 2 estados |
| Conteúdo inicial | 20 nós, 10 unidades, 3 cartões extensos e apresentação institucional | 1 cartão principal, 3 resumos e informações expansíveis; 20 nós só em Trilhas |
| Conclusão M01 | Reconhecimento, feedback e celular com controles desabilitados | Reconhecimento, repetir e retorno; sem celular redundante |

## Uso seletivo do aplicativo antigo

Revisados na branch `main` de `profbreno/trilhas-60-plus` (referência `8218f31ba3ee031b97d68fa1080ddf23bc9f4088`): `src/screens/HomeScreen.tsx`, `src/pages/participant/HomePage.tsx`, `TrailPage.tsx`, `src/components/layout/BottomNav.tsx` e `AppShell.tsx`.

Reaproveitada a ideia de cartão de ação e navegação inferior com nome/ícone. Componentes reimplementados nos contratos existentes: NavLink, AccessibleButton, TrailIcon, AppLayout e tokens. Não foram importados serviços, hooks, esquemas ou dependências do antigo. Seus percentuais de exemplo, autenticação, localStorage, consultas Supabase, analytics, perfil e conteúdo curricular antigo não servem de fonte para este protótipo. Nenhuma credencial foi copiada.

## Verificações e limites

Resultados: lint sem avisos, TypeScript sem erros, **331/331 testes aprovados** e build Vite concluído. A execução completa dos testes usou `npx vitest run --maxWorkers=2`. As tentativas com paralelismo padrão excederam prazos no ambiente Windows; limitar a concorrência a dois workers resolveu isso, sem relaxar critérios ou prazos. Essa configuração foi incorporada ao Vitest para que `npm run check` use o mesmo limite. `git diff --check` aprovado.

A suíte mantém os 323 casos anteriores, adaptando somente a navegação/entrada alteradas, e acrescenta oito: seis de redesign e duas rotas no axe. Preserva verificações curriculares, motor, M01–M10, retorno, pausa/repetição, critérios e eventos. Novos casos cobrem abas, foco/título/seleção, home → tarefa, instruções sem conclusão e descarte de M01/M02 ao trocar de aba; axe acrescenta Trilhas e Conquistas. Axe em jsdom não mede layout, contraste renderizado ou áreas de toque; os testes matemáticos de contraste continuam aprovados.

A implementação mantém cores com os testes matemáticos existentes, fonte relativa, quebra de texto sem truncamento, controles de pelo menos 48 CSS px, navegação por links/botões nativos e foco. A barra inferior reserva espaço e deixa de ser fixa quando a altura disponível é de até 480 CSS px, para reduzir obstrução em zoom/reflow. Isso é intenção de implementação, não comprovação de layout.

**Inspeção visual bloqueada nesta sessão.** O navegador integrado não alcançou `http://127.0.0.1:5173` (`ERR_CONNECTION_TIMED_OUT`). A tentativa de selecionar o Chrome local foi interrompida pelo controle do computador porque não conseguiu determinar a URL atual com segurança. Nenhuma captura do novo layout foi produzida. Relatórios/capturas históricos não validam este redesign.

Pendências antes de considerar o redesign revisado visualmente:

1. Abrir Início/Trilhas/Conquistas e completar M01/M02 em 360 × 800 e 1280 × 900; examinar hierarquia, conteúdo abaixo da dobra, conclusão e retorno.
2. Verificar zoom nativo 200%/400% e reflow a 320 CSS px; texto ampliado, navegação inferior, legendas, marca inteira e ausência de rolagem horizontal ou foco encoberto.
3. Percorrer por Tab/Shift+Tab/Enter/Espaço/setas, incluindo summary nativo, ajuda, erro, voltar, pausa e repetição; verificar alvos e contraste renderizado, cores forçadas e movimento reduzido.
4. Testar leitor de tela, dispositivos físicos/toque e compreensão com participantes em etapa autorizada. Não há alegação de conformidade WCAG, eficácia ou validação empírica.
5. Triar separadamente os 10 alertas herdados apontados por `npm ci` (8 moderados, 2 críticos); dependências não foram modificadas nesta entrega.

O PR deve permanecer rascunho até a inspeção visual. Nenhum merge ou implantação faz parte desta entrega.
