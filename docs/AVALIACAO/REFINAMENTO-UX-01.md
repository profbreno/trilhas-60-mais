# Refinamento UX-01 — apresentação do percurso e das atividades

10/11/2026 · Trilhas 60+ `0.1.0-dev` · verificação intermediária de desenvolvimento DSR.

O refinamento aproxima as primeiras tarefas do início da página e separa a tarefa atual das informações secundárias. **Não é avaliação empírica de usabilidade, D07, demonstração de aprendizagem ou declaração de conformidade integral WCAG 2.2.** Não houve participação de pessoas idosas nesta verificação.

## Problemas observados e decisões

Foram examinadas as capturas anteriores de [PERCURSO](evidencias/PERCURSO/percurso-360-inicio.png) e [U01](evidencias/U01/m02-360-ajustes.png), os componentes e os testes. Antes de editar a interface, foi capturada também uma linha de base homogênea nas quatro larguras. As evidências anteriores foram preservadas.

| Problema / requisito | Decisão e alteração | Evidência / limite |
| --- | --- | --- |
| Duas marcas antes das missões; introdução extensa | Remover somente a marca da apresentação inicial; conservar o PNG oficial no cabeçalho e rodapé. H1 “Seu percurso” e uma frase curta | Não houve alteração, recorte ou recoloração dos arquivos oficiais |
| Dois acessos principais equivalentes | Cabeçalho com um único link “Percurso”; marca continua sendo link de início | Navegação por teclado e rotas existentes preservadas |
| Grande distância até M01 | Reduzir espaçamentos, retirar descrição extensa da trilha neste recorte, recolher atalhos de outras trilhas; descrição continua nas apresentações opcionais | Três trilhas, dez unidades e vinte nós, mesma ordem e dados compartilhados |
| Identificação e progresso dominavam a tarefa | H1 da missão menor, código/modalidade abreviados, “Etapa N de 3”, h2 da tarefa e instrução em destaque | Número da etapa é agrupamento de apresentação, não percentual nem quantidade de critérios cumpridos |
| Detalhes afastavam a área interativa | Objetivos, cenário, instrução integral do passo e critérios reais em “Sobre esta demonstração”; breadcrumbs e modalidade completa em “Localização da missão” | Informação mantida em disclosures HTML nativos, acessíveis sob demanda; nenhum objetivo excluído |
| Texto técnico repetido | Versão e explicações sobre eventos em memória dentro de “Sobre esta demonstração”; versão retirada do rodapé | Avisos necessários continuam visíveis: simulação sem alteração real, sem tempo limite e perda do estado ao sair/recarregar |
| Reiniciar/interromper competiam com tarefa e ajuda | Agrupar em “Opções da prática”, inicialmente recolhido. Manter ajuda, retorno de etapa, retorno ao percurso e ação da tarefa visíveis | Nenhuma função removida. Pausa/retomada só na mesma página; mudança de etapa/fase fecha as opções e reposiciona foco |
| M01 com pouca ênfase no celular | Instrução seguida diretamente da simulação; legenda curta “Celular fictício” | Nomes das telas, controles de retorno, recuperação e feedback preservados |
| M02 em formulário extenso | Apresentação do texto e aplicar primeiro; brilho/volume em “Outros ajustes simulados”; prévia em seguida no DOM, ao lado em desktop | Rádios nativos, prévia sempre disponível, desfazer preservado. Na etapa de leitura, convite precede alternativas |
| Preview recriada ao trocar de etapa | Manter uma única instância de ReadingPreview em posição estável na árvore React | Teste existente de desfazer detectou o problema durante implementação; correção passou sem enfraquecer a asserção |

## Escopo preservado

Não foram editados currículo, definições de missão, validadores, redutor, critérios, tipos de evento ou instrumentos da tese. C1 → U01 → M01/M02 permanece igual. O texto resumido da instrução de ajustes da M02 aparece somente na UI; a orientação original permanece em dados e nos detalhes. Conteúdos, alternativas, feedbacks explicativos, ajudas e eventos `local-demo` não mudaram.

A apresentação agrupa as telas de M01 em três etapas: encontrar; explorar/recuperar; retornar para concluir. M02 apresenta reconhecer; ajustar; localizar informação. Abrir detalhes ou avançar fase não valida critérios. M01/M02 continuam livres, e M03–M20 informativas. Sair da missão retorna à unidade correspondente no percurso, com foco no seu título, e descarta a execução em memória como antes.

Principais arquivos: HomePage, AppHeader/AppLayout, LearningPath, CurriculumPages, MissionRunner, ReadingActivity, NavigationActivity e estilos compartilhados. Reutilizados controles do sistema de design e HTML nativo, sem novos frameworks, dependências, dados, publicação ou persistência.

## Comparação quantitativa

Chrome `157.0.8103.50`, perfil isolado, Windows, viewports 320/360/768/1280 × **900 CSS px**, escala 1. Fonte, paleta e dados mantidos. Valores abaixo arredondados; os JSONs preservam casas decimais. Coordenadas são distâncias em CSS px desde o topo do documento, medidas por getBoundingClientRect + scrollY.

| Largura | Topo de M01 no percurso, antes → depois | Rolagem para mostrar M01 inteira, antes → depois | Primeiro botão de M01, antes → depois | Aplicar ajustes M02, antes → depois |
| --- | --- | --- | --- | --- |
| 320 | 2240 → 792 | 1559 → 110 | 1816 → 606 | 3325 → 795 |
| 360 | 2084 → 735 | 1375 → 27 | 1595 → 550 | 3200 → 795 |
| 768 | 1435 → 589 | 667 → 0 | 1182 → 490 | 2395 → 692 |
| 1280 | 1401 → 589 | 633 → 0 | 1149 → 498 | 2297 → 700 |

Rolagem mínima para o nó inteiro = max(0, borda inferior do link − 900). Não representa gesto, tempo ou esforço humano. O começo de M01 passou a aparecer sem rolagem nas quatro larguras; o nó inteiro ainda exige cerca de 110 px a 320 e 27 px a 360. O atalho direto permanece visível antes dele. Os primeiros botões de M01 e aplicar da M02 ficaram inteiros no viewport inicial de 900 px dos estados examinados. Em aparelhos com altura menor ou zoom, poderá haver rolagem.

Informação acima da primeira missão: a segunda marca, o subtítulo de público, o parágrafo introdutório longo e as três opções abertas de trilha foram retirados/recolhidos. Permanecem H1, frase, aviso breve, atalho inicial, seletor de trilha, ajuda e identificação de trilha/unidade. Os nomes e estados das vinte missões continuam escritos.

| Controles expostos com seções secundárias recolhidas | Antes | Depois |
| --- | --- | --- |
| Página M01, incluindo cabeçalho/rodapé/skip link | 17 | 13 |
| Dentro do player M01 | 8 | 8 |
| Página M02 em ajustes, incluindo cabeçalho/rodapé/skip link | 24 | 17 |
| Dentro do player M02 em ajustes | 15 | 12 |

A contagem inclui controles de toda a página, inclusive fora da janela visível, e exclui descendentes de details fechados; não é contagem de botões visíveis ao mesmo tempo no viewport. Na M01, dois botões secundários recolhidos foram substituídos por dois summaries (opções e informações): o total interno não diminuiu. Na M02, os rádios inicialmente expostos passaram de sete a três, com os outros quatro acessíveis sob demanda. Esses números descrevem a apresentação, sem comprovar menor carga cognitiva.

O campo experimental `wordsBeforeFirst` dos JSONs não é utilizado: a coleta não normalizou espaços antes de buscar a fronteira do nó e não permite uma contagem confiável das palavras anteriores. A comparação de informação usa os blocos efetivamente retirados/recolhidos e a distância medida.

## Capturas comparativas

[Abrir galeria local antes/depois](evidencias/UX-01/comparativo.html): doze pares de capturas de viewport, três telas nas quatro larguras. Há também imagens de página inteira; no percurso elas terminam após o primeiro nó para facilitar a comparação.

| Tela | Antes, 360 px | Depois, 360 px | Antes, 1280 px | Depois, 1280 px |
| --- | --- | --- | --- | --- |
| Percurso | [captura](evidencias/UX-01/antes/percurso-360-inicio.png) | [captura](evidencias/UX-01/depois/percurso-360-inicio.png) | [captura](evidencias/UX-01/antes/percurso-1280-inicio.png) | [captura](evidencias/UX-01/depois/percurso-1280-inicio.png) |
| M01 | [captura](evidencias/UX-01/antes/m01-360-pratica.png) | [captura](evidencias/UX-01/depois/m01-360-pratica.png) | [captura](evidencias/UX-01/antes/m01-1280-pratica.png) | [captura](evidencias/UX-01/depois/m01-1280-pratica.png) |
| M02 | [captura](evidencias/UX-01/antes/m02-360-ajustes.png) | [captura](evidencias/UX-01/depois/m02-360-ajustes.png) | [captura](evidencias/UX-01/antes/m02-1280-ajustes.png) | [captura](evidencias/UX-01/depois/m02-1280-ajustes.png) |

Dados: [linha de base](evidencias/UX-01/antes/navegador.json) e [após refinamento](evidencias/UX-01/depois/navegador.json). A pasta contém 64 PNGs: 24 anteriores e 40 posteriores, incluindo ajustes adicionais e feedback da M02. As capturas são reais de navegador headless; não fotografias de dispositivos ou montagens geradas. Capturas antigas de U01/PERCURSO não foram sobrescritas.

## Testes e acessibilidade

- `npm run check`: lint sem avisos, TypeScript sem erros, **191 testes em treze arquivos** e build concluído. Node.js permanece 20.17.0, versão do artefato 0.1.0-dev.
- Os 186 casos anteriores foram preservados. Cinco arquivos de testes receberam adaptação da apresentação: abrir opções antes de interromper/reiniciar; expandir detalhes antes de consultar progresso/breadcrumbs/ajustes adicionais; abrir atalhos de trilha; conferir ausência da marca duplicada. Nenhuma asserção de critério/validador/evento foi removida.
- Cinco regressões em `UXRefinement.test.tsx`: marca e navegação únicas; opções e foco na pausa; objetivos/progresso sob demanda; etapa visual distinta de critério; ajustes adicionais e feedback sem conclusão indevida.
- jsdom não reproduz inteiramente o comportamento/accessibility tree de details ou sua ativação nativa por Enter. Testes verificam visibilidade e usam clique para ativar summary; **a ativação por Tab/Enter foi exercitada no Chrome real**, sem adicionar handler artificial ao produto.
- Doze auditorias Chrome anteriores e vinte posteriores com axe-core 4.10.3, incluindo contraste e tamanho de alvo: **zero violações e zero itens inconclusivos** nos estados registrados. Verificados estados com ajustes adicionais abertos e feedback de solução inadequada. Os controles medidos, incluindo summaries e rótulos clicáveis, atenderam a 48 × 48 px; não houve overflow horizontal nos estados examinados.
- No Chrome, por Tab/Enter nas quatro larguras: abrir opções, interromper/retomar M01/M02, concluir M01, abrir/fechar ajustes adicionais, provocar feedback, consultar objetivos e voltar ao percurso com foco no título U01. Regressões existentes preservam alternativas de leitura, desfazer, critérios e eventos.
- Instruções principais continuam em fonte relativa acima de 16 px; foco visível, HTML semântico, rádios nativos, ausência de tempo punitivo e região de status polite/atomic persistente. Abrir seções informativas não gera eventos do motor. Ajuda continua registrando somente a solicitação prevista.

A estrutura e o texto dos feedbacks foram preservados e o estado incorreto continua editável. A visibilidade foi examinada e as mensagens têm suporte semântico ao anúncio; **a fala efetiva de leitor de tela e a compreensão humana não foram verificadas**. Não há evidência empírica de que a simplificação melhorou usabilidade ou aprendizagem.

### Reprodução

Executar `npm run dev` e `npm run check`. Para a captura opcional, iniciar Chrome com perfil temporário isolado e `--remote-debugging-port=9225`, conforme o procedimento da [revisão U01](REVISAO-TECNICA-U01.md), e executar `node scripts/refinamento-ux01.mjs depois`. O utilitário usa ws e axe-core já instalados, sem novas dependências. O modo `antes` foi executado **antes de editar o layout**; executá-lo agora registraria a interface atual, não recriaria o estado anterior. Não sobrescrever a linha de base histórica para comparação futura.

## Pendências e recomendações

1. Confirmar zoom **real do navegador a 200%** em janela visível: percurso, ajustes fechados/abertos, erro, ajuda, detalhes e retorno. Viewport estreito não substitui zoom; esta condição continua não verificada.
2. Testar NVDA ou alternativa: leitura das etapas, operação dos summaries, anúncio do feedback, leitura de critérios quando expandidos e foco ao retomar/retornar. Fazer inspeção humana de Shift+Tab, foco não encoberto, cores forçadas e orientação horizontal.
3. Repetir em smartphone físico e alturas menores que 900 px. Ajuda e retorno são elementos normais do documento, não barras fixas; ainda podem exigir rolagem, especialmente após abrir detalhes/convite.
4. Avaliar com pessoas idosas a descoberta de “Opções da prática”, a distinção entre etapa e objetivo e a relação entre ajustes e prévia agora apresentada em seguida no mobile. Sem essa avaliação, não afirmar melhoria de compreensão.
5. A página de vinte propostas continua longa; cabeçalhos, nomes e alvos não foram reduzidos para caber artificialmente. Considerar novos refinamentos somente a partir das evidências e de autorização pertinente.
6. Resolver as pendências já registradas de revisão frente aos instrumentos originais, sem alterá-los. Não iniciar M03/M04, coleta, Supabase, autenticação, persistência ou publicação por consequência deste refinamento.
