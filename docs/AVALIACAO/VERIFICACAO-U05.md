# Verificação de implementação — U05 Senhas e privacidade

10/11/2026 · Trilhas 60+ `0.1.0-dev`. Verificação intermediária de desenvolvimento; não é D07, teste com pessoas idosas, validação pedagógica ou conformidade integral WCAG 2.2.

## Inspeção, fontes e escopo

Inspecionados AGENTS, arquitetura, fichas M09/M10, matriz e rastreabilidade, sistema de design, diário DSR e verificação U04; examinados contratos, validadores e renderers existentes. A autorização deste ciclo acrescenta somente M09/M10. M01–M10 ficam disponíveis e M11–M20 permanecem informativas, com vinte nós, IDs e slugs oficiais preservados. Nada foi publicado ou integrado a contas/serviços externos.

As fichas aprovadas prevaleceram: a conta da M09 é da **biblioteca fictícia**; a M10 mantém a finalidade de **convite público de oficina** com residência/documento desnecessários. Não se converteu a tarefa em proibir todo compartilhamento. Objetivos, cenários e estrutura curricular não foram modificados. T0/T1/T2, IMI e SUS permanecem separados e intactos; os originais ainda dependem de conferência pelo pesquisador para verificar não sobreposição literal.

Como apoio técnico, foram consultadas as orientações primárias do [NIST sobre senhas e proteção de contas](https://www.nist.gov/cybersecurity-and-privacy/how-do-i-create-good-password) e [autenticação multifator](https://www.nist.gov/itl/smallbusinesscyber/guidance-topic/multi-factor-authentication). O recorte educacional aborda comprimento, exclusividade, apoio de gerenciadores e confirmação adicional, sem prometer inviolabilidade, prescrever política de um serviço real ou acrescentar integração. Links são documentação do desenvolvimento, não chamadas do aplicativo.

## M09 — Cuidar da senha e do código de acesso

A pessoa prepara o acesso fictício à Biblioteca Jardim. Não há campo de senha, entrada livre, conta real ou geração de credencial para armazenamento. A orientação distingue senha de código temporário adicional e menciona gerenciador como apoio, sem solicitar que se abra um gerenciador pessoal.

“Comparar estratégias” apresenta reutilização, dado pessoal óbvio, opção curta com símbolos/números e frase longa exclusiva. A escolha muda o estado da conta e produz feedback sobre suas consequências. Símbolos não são garantia; reutilização aumenta o alcance de um vazamento. A frase autoral de exemplo é explicitamente imprópria para copiar para uma conta real, e não é necessário memorizá-la.

Para continuar é preciso consultar orientação, comparar, escolher a estratégia pertinente e justificar **comprimento e exclusividade**, sem marcar garantia por símbolos. Em seguida a pessoa ativa uma etapa adicional simulada, identifica a função temporária do código e aciona seu uso **somente no acesso que iniciou**. O cartão “CÓDIGO-DE-EXEMPLO — SEM VALIDADE” não expira nesta prática e nunca é recebido por SMS, aplicativo ou e-mail real.

Uma conversa fictícia pede esse código. “Tentar enviar” é bloqueado, explica o risco e não transmite nada; invalida o uso validado até a pessoa refazê-lo no acesso. A pessoa escolhe recusar/permanecer no acesso ou recusar/buscar canal conhecido independente e justifica a recusa. Selecionar somente a frase de senha ou apenas ler explicações não conclui.

**Critérios de conclusão:** comparação fundamentada; estratégia longa/exclusiva; função do código distinta da senha; etapa adicional e uso no acesso iniciado; recusa de repasse com motivos; abrir revisão, confirmar sua conferência e executar a confirmação simulada. A síntese preserva o feedback da ficha: senha exclusiva e etapa adicional são cuidados diferentes que se complementam.

## M10 — Escolher o que pode ser compartilhado

Editor fechado de convite público, sem upload ou texto livre. O rascunho contém título, local público, dia/horário, telefone particular, residência, documento sintético e canal público da organização. Os valores são inventados; telefone/residência não possuem contato ou endereço utilizável. O documento reutiliza SVG local já existente, com descrição textual integral e aviso sem validade.

Cada campo oferece “Entender” e “Retirar/Recolocar”, com estado escrito e prévia derivada das escolhas. A explicação identifica por que o campo é pertinente ou desnecessário. O botão de conferir prévia move o foco para ela. Isso permite desfazer e verificar a mudança; não se avalia somente quantos campos foram removidos.

**Critérios de conclusão:** identificar finalidade pública; consultar as explicações dos campos; retirar telefone privado, residência e documento; manter título, local público e dia/horário; escolher público comunitário compatível; justificar finalidade e minimização; revisar e confirmar apenas o compartilhamento simulado. Remover tudo ou restringir a um grupo sem elaborar o convite não atende ao pedido aprovado.

O canal público é **opcional**: mantê-lo ou retirá-lo é aceito. O feedback diferencia contato institucional pertinente de contato particular desnecessário. Um grupo específico pode ser adequado em outro contexto; não é tratado como intrinsecamente errado, apenas incompatível com a finalidade pública deste cenário. Não se ensina que toda informação pessoal é proibida em qualquer situação.

## Arquitetura e reutilização

| Elemento | Implementação / justificativa |
| --- | --- |
| `src/data/privacyMissions.ts` | Dados, estratégias, campos, motivos, respostas, orientação e feedback de M09/M10; metadados obtidos do currículo aprovado |
| `src/domain/missions/privacyDecision.ts` | Validador puro e estado inicial, sem React, relógio, rede, armazenamento ou fornecedor |
| `src/domain/missions/types.ts` | PrivacyDefinition/State/Action e PublicationField; modalidade privacy-decision com account/publication |
| `src/components/missions/PrivacyDecisionActivity.tsx` | Conta/configuração e editor interativos; grupos nativos e foco em comparação/explicação |
| `PublicationPreview` | Componente interno reutilizado nas fases de edição, público, revisão e conclusão; conteúdo derivado, não duplicado em estado |
| Redutor/MissionRunner existentes | Ciclo único, critérios, feedback, ajuda, pausa/retomada, checkpoints, reinício, repetição e foco; sem motor paralelo |
| Registro/percurso | Acesso direto M09/M10 e retorno /#percurso-u05 com foco; disponibilidade derivada do registro, sem bloqueios ou progresso inventado |

A nova modalidade é necessária porque navegação, comunicação, pesquisa e information-check não representam configuração de acesso nem edição de campos com prévia sem alterar suas próprias regras ou forçar um quiz. A ampliação foi limitada à união de tipos, despacho e renderer. Não se criaram camadas vazias, framework ou dependências adicionais.

Etapas prepare → protect → review → done (visual 1/2/3/3). Critérios prepared/protected/reviewed só chegam ao conjunto completo após revisão e ação final. “Corrigir decisões” preserva escolhas e invalida confirmação; “Rever preparação” preserva estratégia/edição, mas descarta etapa posterior e revisão (uso do código ou público/motivos), exigindo novo percurso coerente. Retornos não geram step_completed indevido. O botão comum de etapa anterior restaura checkpoint; sair/recarregar continua descartando tudo.

## Competência oficial e complemento

**C5 — Segurança Digital (Senhas e Privacidade):** proteção de contas, senha longa/exclusiva, códigos temporários, reconhecimento de pedidos indevidos, privacidade, minimização, escolha de público/destinatários e revisão. A cobertura está vinculada às ações acima, não a um escore ou garantia de proteção real. CP-U05 continua previsto presencialmente: comparar estratégias em cartões e revisar divulgação sintética em dupla, conforme fichas/roteiro. Não foi executado, nem exige abrir contas ou credenciais pessoais. Materiais, mediação e carga precisam de revisão pelo pesquisador.

## Eventos e segurança

Reutilizados doze tipos de evento/schemaVersion 2, com identificadores pedagógicos, versão da definição 0.1.0-u05.1, sequência e tentativa. `action_performed.action` distingue consulta de orientação, comparação, estratégia, etapa adicional, função/uso do código, tentativa bloqueada, edição, público, revisão e confirmação. Ajuda é help_requested; escolhas inadequadas geram attempt_incorrect. A ação final antecede a conclusão única; repetição mantém eventos anteriores dentro do limite de 200 e inicia nova tentativa.

Payload não inclui frase de senha, código, valor de campo, ID escolhido, contato, motivo textual ou texto livre. Ações de uso de código não recebem o código como argumento. Somente tipos predefinidos são registrados; dados permanecem no estado em memória. Nenhuma autenticação, Web Share, clipboard, câmera, seletor de arquivo ou API de contatos é usada. Arquivos de evidência são resultados de testes de desenvolvimento com dados fictícios, não telemetria do participante.

## Testes, problemas e correções

**323 testes em 21 arquivos:** 290 anteriores e 33 novos (25 domínio, oito interface). Preservados os casos anteriores; somente expectativas de disponibilidade foram atualizadas para dez executáveis/dez informativas, e o caso de proposta do percurso passou de M09 para M11. O utilitário antigo recebeu o mesmo ajuste, sem reclassificar sua execução histórica como evidência nova.

Cobertura nova: estratégias/reutilização/símbolos, fundamentos, senha versus código, etapa adicional, uso no acesso e envio bloqueado, recusa equivalente, dados privados e necessários, inspeção/finalidade, remoção/recolocação, canal opcional, público e motivos, revisão/edição, ajuda, pausa, repetição, conclusão única, ordem/minimização dos eventos, rotas/foco e axe em fases representativas.

Corrigidos durante a implementação: import não utilizado apontado pelo lint, invalidação explícita da etapa posterior ao rever preparação e aviso local de bloqueio junto ao pedido na M09. A inspeção visual mostrou que o feedback global podia ficar fora do viewport; o aviso local informa o bloqueio sem criar uma segunda região de anúncio, preservando o status polite existente. A regressão verifica o aviso e seu estado, e a captura foi repetida após o ajuste. A revisão de tipos e os testes passaram após a correção. A primeira inspeção de navegador foi interrompida sem JSON conclusivo; a repetição isolada em 360 passou, e a rodada completa foi executada separadamente. Não se atribuiu a interrupção a falha comprovada do produto.

Lint sem avisos, TypeScript sem erros e build Vite concluído. Node preservado em 20.17.0. [Hashes de preservação](evidencias/U05/preservacao.json) verificam currículo, cinco validadores anteriores e PNGs oficiais. Tokens, identidade e instrumentos não foram alterados; versão permanece 0.1.0-dev.

## Acessibilidade, evidências e limites

Chrome 157.0.8103.50 headless no Windows, perfil temporário isolado, build em preview local. Auditoria axe-core 4.10.3 e eventos reais de teclado via CDP. Não é inspeção com fala de leitor de tela, dispositivo físico ou avaliação humana de compreensão.

| Procedimento | Resultado / evidência |
| --- | --- |
| Viewport emulado 360 × 900 e janela 1280 × 900 | Dez estados por condição; dados, overflow, foco e screenshots no JSON |
| Zoom nativo 200% em base 1280 × 900 | Configuração nativa confirmada; largura interna 640/útil 632, altura 450; distinto de redimensionamento |
| Zoom nativo 400% na mesma base | Largura interna 320/útil 316, altura 225; reflow verificado separadamente |
| Viewport emulado 320 × 900 em zoom 100% | Área útil 305 pela barra; não equivale a smartphone físico ou zoom real |
| Teclado nas duas missões | Estratégias, código, envio bloqueado, recusa, ajuda/pausa, campos reversíveis, prévia, público, revisão, repetição e retorno U05 |
| Axe Chrome e investigação de contraste | Ver resultados finais no resumo e registros brutos; inconclusivos são separados de violações e medições dirigidas |
| Leitor de tela real, dispositivos físicos, fonte isoladamente ampliada e cores forçadas | Não verificado nesta rodada |

Controles HTML nativos, rótulos textuais, foco visível, áreas confortáveis e feedback polite/atomic reaproveitam o padrão existente. Estado de campo é escrito; nenhum dado sensível depende só de cor ou ícone. A leitura da imagem sintética tem alternativa textual. Não há arraste, CAPTCHA, memória obrigatória, expiração simulada ou pressão temporal. Comparação/explicação recebem foco inclusive ao reabrir o mesmo conteúdo; grupos e prévia permanecem alcançáveis.

A edição de sete campos e o deslocamento até explicações/prévia podem exigir bastante rolagem. Avaliar carga, descoberta dos controles e compreensão de senha/código, finalidade e público com mediação e participantes em etapa autorizada. A execução automatizada não prova compreensão, aprendizagem, proteção de contas ou ausência de toda barreira.

### Resultado final e contraste dirigido

**50 estados e cinco percursos aprovados** nas cinco condições, após a correção do aviso contextual. Nenhum overflow/clipping detectado nas medidas e zero violações axe. Houve **3 estados com contraste automático inconclusivo**: 320 / m09-estrategias; 320 / m09-envio-bloqueado; 320 / m10-publico. Todos apontam exclusivamente o skip link oculto fora do viewport, com limitação elmPartiallyObscuring para determinar fundo; não são falhas comprovadas do conteúdo da missão.

Cada ocorrência foi examinada separadamente com foco por Tab e hover: link visível, texto #173e31 sobre branco opaco, 18px/700, razão 11,8655:1; contorno sólido #84430e de 3px, 7,5260:1 contra branco e 7,1666:1 contra a página #f7faf9. A medição do estado visível é aprovada nesse recorte; os resultados brutos do axe continuam inconclusivos. Fórmula sRGB, cores, retângulos e capturas específicas de foco/hover estão no JSON e na pasta de evidências. Não se desativou regra ou alterou cor para obter aprovação. [Método e referências](FECHAMENTO-ACESSIBILIDADE-U01.md). Não se inferem todos os estados nativos, todos os critérios de foco ou conformidade global.

### Arquivos de evidência e reprodução

- [Galeria](evidencias/U05/galeria.html), [resultados brutos](evidencias/U05/resultados.json), [resumo das verificações](evidencias/U05/verificacoes.json), [preservação](evidencias/U05/preservacao.json).
- M09: [360 — estratégias](evidencias/U05/360-m09-estrategias.png), [360 — envio bloqueado](evidencias/U05/360-m09-envio-bloqueado.png), [1280 — revisão](evidencias/U05/1280-m09-revisao.png), [200% — acesso](evidencias/U05/zoom200-m09-acesso-protegido.png).
- M10: [360 — rascunho](evidencias/U05/360-m10-rascunho.png), [360 — editado](evidencias/U05/360-m10-editado.png), [1280 — revisão](evidencias/U05/1280-m10-revisao.png), [400% — editado](evidencias/U05/zoom400-m10-editado.png).

Capturas são de viewport após teclado, com foco/rolagem do estado, não página inteira nem aparelhos físicos. Foram examinadas visualmente M09 envio bloqueado a 360 e M10 revisão a 1280, além das medidas automatizadas dos demais estados. Executar `npm run dev`; validar com `npm run check`. Para repetir a inspeção opcional: `npm run preview -- --port 5177 --strictPort`, Chrome com perfil temporário e `--headless=new --window-size=1280,1000 --remote-debugging-port=9231`, PowerShell `$env:TRILHAS_QA_URL='http://127.0.0.1:5177'` e `node scripts/verificar-u05.mjs`. Argumento opcional `360` grava resultado separado. Aguarde o endpoint de depuração do Chrome responder antes de executar o script. O utilitário restaura zoom/fonte apenas no perfil isolado; não toca no perfil pessoal.

## Roteiro manual pendente e próxima etapa

Todos os itens seguintes estão **Não verificados**. Usar Narrador/Edge no Windows e dispositivos físicos; registrar ambiente/data, observado e classificação:

| Procedimento | Comportamento esperado | Observado / resultado |
| --- | --- | --- |
| Abrir M09/M10 pelo percurso e retornar | Títulos/disponibilidade anunciados e foco U05 | A preencher — Não verificado |
| Comparar estratégias, orientação e motivos | Estados e consequências compreensíveis, sem solicitar senha real | A preencher — Não verificado |
| Ativar etapa, distinguir código, tentar repasse e corrigir | Bloqueio e explicação anunciados; uso restrito ao acesso e recusa disponíveis | A preencher — Não verificado |
| Inspecionar e retirar/recolocar campos M10 | Nomes/estados legíveis, foco lógico, prévia acessível e alternativa textual do documento | A preencher — Não verificado |
| Escolher público e revisar, editar, pausar/retomar | Justificativa compreensível; confirmação invalidada ao editar; estado coerente | A preencher — Não verificado |
| Confirmar, repetir e operar com toque/zoom/orientação | Sem perda de ações, dependência de cor ou gesto complexo; sem envio real | A preencher — Não verificado |

Antes de U06, revisar esses itens, materiais CP-U05 e não sobreposição aos instrumentos originais. M11–M20, Supabase, autenticação, persistência, telemetria real, credenciais verdadeiras, envio/compartilhamento externos, ranking e publicação seguem fora do escopo. Não avançar sem autorização.
