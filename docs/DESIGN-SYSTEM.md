# Sistema de design — Trilhas 60+

### U05 — conta e publicação fictícias

PrivacyDecisionActivity reutiliza UX-01 e tokens, com passos curtos de preparo, proteção/público e revisão. Conta visual textual com estados de estratégia e etapa adicional; editor de campos com Entender/Retirar/Recolocar, estado escrito e prévia derivada. Documento reutiliza SVG sintético local com descrição integral; não há upload. Campo essencial, dado privado e canal público são distinguidos por texto/finalidade. Grupos nativos, foco em comparação/explicação e botão para conferir a prévia; sem arraste, segredo livre ou prazo. M01–M10 disponíveis. [Evidências e pendências](AVALIACAO/VERIFICACAO-U05.md).


### U04 — investigação textual

InformationCheckActivity preserva UX-01 e tokens. Recorte e original têm transcrição; três botões nomeados abrem fontes/autoria/data/contexto em região focada. Comparação integral fica disponível em details nativo na decisão, com rádio de interpretação, motivos em checkbox e opções de conduta/resposta/próximo passo na M08. Revisão explícita antes da ação final; informações não dependem de cores ou ícones. Não há envio, selo de verdade ou confiança automática por aparência. M01–M08 disponíveis. [Evidências e limites](AVALIACAO/VERIFICACAO-U04.md).


### U03 — pesquisa local

SearchActivity preserva UX-01: pedido breve, cartões Adicionar/Remover, busca, resultados identificados com origem/data, detalhe sob demanda e feedback contextual. Sem arrastar, digitação obrigatória, cores como único significado ou mapa. Comparação usa lista responsiva; lembrete usa selects rotulados e o cartão escolhido aparece inteiro em texto separado. Foco explícito nos detalhes/coleção e avisos de referência temporal fictícia. Tokens e logomarca preservados. M01–M06 disponíveis. [Evidências e limites](AVALIACAO/VERIFICACAO-U03.md).


Versão do artefato: `0.1.0-dev`. Identidade oficial fornecida pelo pesquisador e integrada com os arquivos originais em `public/brand`. Este documento descreve implementação e critérios de inspeção; não declara conformidade WCAG nem validação com o público.

## Direção visual e tokens

### U02 — comunicação simulada

CommunicationActivity reutiliza o layout UX-01 e os controles compartilhados. Frases/arquivos são seleções nativas com nome/descrição; destinatário usa select rotulado e também aparece por extenso como texto. Prévia exige confirmação explícita e oferece Corrigir escolhas. AudioAlternative mantém transcrição e estado local do painel; ao trocar para texto não recolher o controle focado. Documento sintético tem alt e texto equivalente; nunca usar arquivo pessoal, microfone ou envio. Apenas os nós M01–M04 estão disponíveis. [Evidências U02](AVALIACAO/VERIFICACAO-U02.md); sem alegação de validação com pessoas idosas ou leitor de tela.

### Verificação interna de acessibilidade U01

Zoom nativo do Chrome a 200% e 400% foi exercitado separadamente de viewport emulado 320 e fonte padrão dobrada. Correções comprovadas: itens flex do rodapé podem encolher, legendas/palavras longas quebram sem corte, badge tem largura máxima e skip link é ocultado pela própria altura, reaparecendo no foco. Não reduzir fonte, recortar marca ou usar overflow:hidden para mascarar reflow. [Evidências e limites](AVALIACAO/VERIFICACAO-ACESSIBILIDADE-U01.md): 42 estados de layout, quatro percursos e 191 testes aprovados; cinco ocorrências inconclusivas de contraste do skip link permanecem pendentes. Leitor de tela real e dispositivos físicos ainda não foram verificados. Os relatos anteriores de zoom pendente são históricos, não evidência desta verificação.

### Refinamento UX-01 — apresentação progressiva

O cabeçalho mantém a marca oficial e um único acesso “Percurso”; a apresentação inicial usa somente H1 e frase curta. Atalhos de outras trilhas ficam em details/summary. Nas missões executáveis, identificação resumida e etapa visual precedem h2 da tarefa, instrução e área interativa. Ajuda, retorno e ação principal ficam no documento; opções secundárias em “Opções da prática”, informações técnicas/objetivos em “Sobre esta demonstração” e breadcrumbs em “Localização da missão”. Não esconder o aviso de simulação, ausência de limite de tempo ou descarte da prática ao sair/recarregar.

Usar HTML nativo para os disclosures, área mínima de 48 px e foco visível. Não adicionar aria-hidden aos conteúdos nem handlers de teclado que dupliquem o comportamento nativo. “Etapa N de 3” é posição de apresentação e não critério concluído; critérios reais ficam disponíveis sob demanda. Na M02, apresentação do texto e aplicar aparecem antes da prévia durante os ajustes; no desktop ficam lado a lado na mesma ordem do DOM. Brilho/volume são ajustes adicionais expansíveis; desfazer permanece disponível. Preservar identidade da prévia no React entre estados.

[Comparação e evidências](AVALIACAO/REFINAMENTO-UX-01.md): 191 testes aprovados, vinte auditorias Chrome posteriores sem violações/inconclusivos, capturas em 320/360/768/1280 px. Medidas descrevem redução de distância e hierarquia visual, não eficácia ou usabilidade validada. Zoom real 200%, leitor de tela e dispositivos físicos permanecem pendentes. Registros anteriores abaixo descrevem etapas históricas.

### Percurso integrado — 10/11/2026

A navegação principal é Percurso → Micromissão → Atividade. LearningPath compõe PathNavigation, PathSection, PathUnit e PathMissionNode a partir do currículo e do registro de execução existentes. Cada unidade tem lista ordenada de duas missões; círculos de 80 CSS px com ícone decorativo e código, título associado, modalidade A/B e estado escrito. Conexões são elementos aria-hidden, sem significado de progresso. A ordem é vertical e única no DOM, sem zigue-zague, animação obrigatória ou recurso proprietário externo.

M01/M02 aparecem como Disponível; M03–M20, Em desenvolvimento, com links às propostas. Sem conclusão ou percentual inventado e sem bloqueio de M02. O link inteiro do nó é acionável, com foco visível e camada acima da linha decorativa. Atalhos e retornos usam hashes estáveis com foco/rolagem no destino. Páginas antigas continuam opcionais. Logomarca, paleta e tokens são preservados. [Comparação, testes, capturas e limites](AVALIACAO/PERCURSO-INTEGRADO.md): 186 testes e check aprovados; oito auditorias Chrome sem violações apontadas ou itens inconclusivos após corrigir a camada da conexão; pares sólidos dos círculos medidos a 8,13:1/6,43:1. Zoom real 200%, leitor de tela e dispositivos físicos continuam pendentes. Isso não é validação de usabilidade ou conformidade.

Paleta de verde-petróleo, azul-esverdeado, branco e neutros frios suaves. Os acentos das trilhas são discretos; número, título e ícone também identificam cada trilha. Fontes do sistema evitam downloads externos. Fonte mínima base relativa de 112,5% (18 px no padrão usual do navegador), entrelinha 1,65 e títulos sem altura fixa.

Fonte dos tokens: `src/styles/tokens.css`, importada pelo CSS principal. Usar variáveis sem duplicar valores em componentes.

| Família | Tokens principais | Uso |
| --- | --- | --- |
| Superfícies | `background` #f7faf9, `surface` #ffffff, `soft` #eaf3f1 | Fundo, cartões e áreas de apoio |
| Texto | `text` #203d40, `muted` #496367 | Corpo e informação auxiliar |
| Ação | `primary` #15585c, `primary-hover` #104448 | Links, botões e ênfase |
| Limites | `line` #cbdcda, `control` #577c80 | Separadores decorativos e bordas de controles, respectivamente |
| Foco | `focus` #84430e | Contorno de 3 px com afastamento |
| Informação | `info-text` #234e62 / `info-bg` #edf5fa | Avisos estáticos e orientações |
| Sucesso | `success-text` #205638 / `success-bg` #edf6ef | Feedback futuro, acompanhado de texto e ícone |
| Erro | `error-text` #8d2933 / `error-bg` #fff1f1 | Erro com orientação de recuperação |
| Trilhas | `trail-green`, `trail-clay`, `trail-blue` e respectivos `-bg` | Acentos complementares à identificação textual |
| Espaçamento | `space-1` a `space-7`: 0,25 / 0,5 / 0,75 / 1 / 1,5 / 2 / 3 rem | Ritmo dos componentes compartilhados |
| Forma | `radius-sm`, `radius-control`, `radius-card`, `radius-panel` | Cantos de avisos, controles, cartões e painéis |
| Elevação | `shadow-card` | Sombra discreta, sem comunicar estado por si só |
| Tipografia | `font-body`, `text-small`, `text-body`, `text-lead`, `line-body`, `line-heading` | Texto de sistema com unidades relativas |
| Interação | `target-min`: 48 px | Mínimo preferencial para controles, superior à preferência de 44 px do pedido |

`line` é decorativo e não deve substituir `control` onde a borda for necessária para identificar um controle. Estados desabilitados preservam contraste textual, usam o atributo nativo `disabled` e não devem ser usados para bloquear progressão nesta fase.

## Componentes e contratos

| Componente / arquivo em src/components | Uso |
| --- | --- |
| `AppLayout.tsx` | Skip link, cabeçalho, main único, rodapé; título e foco ao mudar de rota |
| `AppHeader.tsx` | Marca oficial e navegação; link “Trilhas 60+, início” com imagem decorativa. `brandAsset` preservado para composição somente com arte oficial, sem duplicar nome acessível |
| `BrandLogo.tsx` | Arte oficial com size, variant, context, alt ou decorative; dimensões intrínsecas próprias e escala proporcional |
| `PageHeader.tsx` | `eyebrow`, `title`, `description` e conteúdo complementar; um h1 por página |
| `AccessibleButton.tsx` | `primary`, `secondary`, `quiet`; sem `to`, gera button nativo com type button por padrão; com `to`, gera Link. Não usar link desabilitado |
| `CurriculumCards.tsx` | Exporta `TrailCard`, `UnitCard`, `MissionCard`; recebem dados tipados, não alteram o currículo e usam h3 sob seção h2 |
| `ProgressIndicator.tsx` | Sem contagens, informa ausência de registro e não gera progressbar. Futuramente aceita `value` e `total` inteiros válidos e rótulo. Nenhuma página envia contagens fictícias |
| `BackNavigation.tsx` | Link de destino explícito e texto contextual; não depende do histórico do navegador |
| `EmptyState.tsx` | Estado vazio com h2 e orientação; usar em lugar de uma lista sem conteúdos |
| `StatusMessage.tsx` | Tons info/success/error com ícone e texto. `announce` é false por padrão; habilitar apenas para atualizações dinâmicas, evitando anúncios na carga inicial |
| `AchievementBadge` em `StatusMessage.tsx` | Apresentação simbólica com rótulo, preparada para uso futuro; não aparece como conquista atribuída nas páginas |
| `HelpButton.tsx` | Disclosure local, aria-expanded/aria-controls, acionável com Enter e Espaço; mantém foco no botão e não abre modal |
| `Breadcrumbs.tsx`, `TrailIcon.tsx` | Componentes existentes reutilizados; página atual textual com aria-current |

Exemplos de composição:

```tsx
<AccessibleButton variant="secondary" onClick={abrirAjuda}>Ajuda</AccessibleButton>
<AccessibleButton to="/trilhas/seguranca">Conhecer a trilha</AccessibleButton>
<ProgressIndicator label="Seu caminho nesta unidade" />
<StatusMessage tone="info">Conteúdo demonstrativo em desenvolvimento.</StatusMessage>
```

Nas trilhas/unidades e em M03–M20, não preencher progresso ou conquistas fictícios. Nas rotas oficiais M01/M02, ProgressIndicator e AchievementBadge representam critérios validados na página: “objetivos praticados” e “Caminho praticado”. Não equivalem a resultado de pesquisa, domínio, nota ou recompensa persistente.

## Regras de acessibilidade e navegação

### Marca oficial

Arquivos fornecidos pelo pesquisador, inspecionados visualmente e utilizados sem alteração de bytes:

| Variante | Arquivo público | Dimensões intrínsecas | Uso |
| --- | --- | --- | --- |
| Principal, com fundo claro incorporado | `/brand/logo-trilhas60-principal.png` | 460 × 247 px | Cabeçalho (small) e destaque no início (large) |
| Transparente | `/brand/logo-trilhas60-transparente.png` | 489 × 280 px | Rodapé (medium), sobre superfície clara |

Slogan oficial: **CONEXÃO • APRENDIZAGEM • AUTONOMIA**. Preservar a arte inteira: não redesenhar em HTML, recolorir, alterar tipografia/elementos, esticar, recortar, aplicar filtros/opacidade ou remover fundo. A paleta da UI (#15585c e #203d40) continua independente das cores originais da marca.

BrandLogo aceita `size` small/medium/large (tokens de 9/13/23 rem), `variant` principal/transparente e `context` header/home/footer/institutional. O tamanho é limitado a 100% do contêiner; imagem com width 100% e height auto. Atributos intrínsecos width/height são específicos de cada variante. O contêiner usa `--brand-surface: #faf9f7`, compatível com o fundo claro da arte, sem alterar o PNG. A variante transparente também fica sobre superfície clara para manter os elementos originais legíveis. Não ocultar conteúdo ou recortar a imagem para encaixá-la.

Nome alternativo padrão: “Trilhas 60+. CONEXÃO • APRENDIZAGEM • AUTONOMIA”. `alt` permite adequação ao contexto. Quando o nome já identifica o contexto, usar `decorative`: alt vazio e aria-hidden. No cabeçalho, o link já se chama “Trilhas 60+, início”; a imagem é decorativa e não há recriação textual adjacente. No início e rodapé, as imagens são informativas. Os tipos impedem fornecer alt junto de decorative.

```tsx
<BrandLogo context="home" size="large" />
<BrandLogo context="footer" size="medium" variant="transparente" />
<Link to="/" aria-label="Trilhas 60+, início">
  <BrandLogo context="header" size="small" decorative />
</Link>
```

Testes verificam recursos, dimensões, variantes, tamanhos, contexto, texto alternativo, modo decorativo e integração nos três locais. jsdom não comprova escala visual, legibilidade do slogan em miniatura ou ausência de overflow real. Permanecem inspeção manual em 320 CSS px/desktop, zoom 200%, cores forçadas e leitor de tela, sem modificar a arte para atender esses ensaios.

### Critérios de interface

Nas práticas interativas, mudanças de fase/etapa/tela levam foco ao h2 do passo; mudanças de rádio conservam o foco no controle. Feedback usa região persistente de status polite/atomic, sem alertas assertivos para cada erro. Fieldsets, legends e radios nativos permitem toque/teclado. A prévia da M02 muda somente dentro da simulação e nunca reduz a legibilidade das instruções. A ajuda por passo está disponível em todas as fases. `HelpButton.onOpen` é callback opcional para evento interno; `ProgressIndicator.unitLabel` permite “objetivos praticados”, mantendo padrão anterior nos demais usos.

MissionPresentation compõe MissionProgress, MissionFeedback e MissionCompletion com os componentes existentes. MissionRunner oferece retorno de etapa, interrupção, retomada e reinício, com foco no título após a ação. O texto informa que a pausa só conserva estado na página aberta e que sair/recarregar o descarta. Não há contagem regressiva ou exigência de concluir M01 antes de M02.

Referência: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), especialmente 1.3.1, 1.4.3, 1.4.4, 1.4.10, 1.4.11, 2.1.1, 2.4.1, 2.4.2, 2.4.3, 2.4.7, 2.4.11, 2.5.8, 3.2.3 e 4.1.2. A referência não é declaração de atendimento integral.

- Texto comum: contraste mínimo pretendido 4,5:1; componentes relevantes e foco: 3:1. Pares de tokens possuem testes matemáticos; isso não verifica todas as combinações renderizadas.
- Sem alturas fixas de conteúdo ou truncamento. Grids colapsam para uma coluna em telas pequenas; cabeçalho, breadcrumbs e metadados quebram linha. Inspecionar zoom a 200%, texto ampliado e reflow a 320 CSS px.
- Alvos preferenciais de 48 px, espaço entre controles e nenhuma interação exclusivamente por hover ou gesto complexo.
- Link “Ir para o conteúdo principal”, landmarks, um h1, títulos hierárquicos, ícones decorativos ocultos das tecnologias assistivas e texto para ações.
- Unidade e trilha identificadas por breadcrumbs; unidade numerada na ordem curricular; retorno sempre com destino explícito.
- Foco visível, sem header fixo que o encubra; movimento reduzido e cores forçadas preservados.
- Sem dados pessoais, persistência, bloqueios, ranking, pontuação ou temporizadores.

## Verificações e limites

Vitest/Testing Library verificam navegação, semântica, estados dos componentes, teclado da ajuda, ordem de todo o currículo e ausência de progresso fictício. axe-core executa regras A/AA selecionadas em jsdom em cinco telas representativas; contraste e tamanho de alvo são desativados nessa execução porque jsdom não renderiza layout. Testes separados verificam matematicamente os pares de cores declarados.

Na etapa inicial do sistema de design não houve captura mobile/desktop. Posteriormente, a revisão U01 e o percurso integrado acrescentaram inspeção parcial em Chrome e capturas reais, conforme seus relatórios. Testes em jsdom continuam sem comprovar layout/zoom/contraste renderizado; permanecem pendentes inspeção em aparelhos físicos, zoom real a 200%, tecnologias assistivas e compreensão com pessoas idosas.

Resultado da verificação desta etapa: lint sem avisos, TypeScript sem erros, 55 testes aprovados em cinco arquivos (incluindo os 11 da fundação) e build concluído. Vinte desses testes verificam pares de contraste; cinco executam axe-core em telas representativas. Este resultado descreve apenas o escopo automatizado acima.
