# Especificação pedagógica das vinte micromissões

Estado vigente após U05: M01–M10 executáveis; M11–M20 informativas. Fichas e currículo aprovado preservados. [Implementação e limites U05](../AVALIACAO/VERIFICACAO-U05.md). Os avisos anteriores abaixo são históricos.

Estado vigente após U04: M01–M08 executáveis; M09–M20 informativas. Fichas, competências, IDs e metadados aprovados preservados. [Conferência da Trilha 1 e verificação U04](../AVALIACAO/VERIFICACAO-U04.md). Os avisos de escopo anteriores abaixo são históricos.

Estado vigente: execução autorizada de M01–M06, com U03 documentada em [VERIFICACAO-U03](../AVALIACAO/VERIFICACAO-U03.md). M07–M20 continuam informativas. Fichas e currículo aprovado preservados; os avisos de execução anteriores abaixo são históricos.

Atualização de execução: M01–M04 agora estão autorizadas nas rotas oficiais. M05–M20 permanecem informativas. Títulos, objetivos, cenários e campos das fichas foram preservados; ver [verificação U02](../AVALIACAO/VERIFICACAO-U02.md). Os avisos de escopo anterior abaixo são históricos.

10/11/2026 · `0.1.0-dev` · **Títulos, objetivos e cenários aprovados como base curricular oficial de implementação**, sujeitos a refinamentos antes de v1.0.0. As competências e correspondência U/M permanecem definitivas; ver [matriz e fontes](MATRIZ-CURRICULAR.md). Os metadados em src/data/curriculum.ts permanecem intactos. Autorização posterior implementou execução oficial somente de M01/M02; M03–M20 continuam informativas. Os vinte campos de cada ficha foram preservados. C1–C10 abreviam a numeração oficial.

## Convenções comuns às vinte fichas

Estado de implementação: [motor demonstrativo](../ARQUITETURA/MOTOR-DE-MISSOES.md). O pedido atual autorizou controles de brilho e volume simulados na M02, sem novo objetivo de controle do dispositivo; texto ampliado ou modo de leitura atendem ao problema de letras pequenas. A prévia não altera instruções nem o aparelho. Os eventos internos local-demo não implementam o contrato de pesquisa E1–E8. As regras abaixo descrevem a proposta completa; somente o recorte autorizado M01/M02 está executável.

Revisão de consistência de 10/11/2026: turma de 20–30 pessoas, encontros presenciais semanais de aproximadamente 60 minutos; U01–U10 nas primeiras dez semanas, revisão integrada na semana 11 e consolidação pedagógica na semana 12. Organização 10/30/15/5 minutos conforme [roteiro](ROTEIRO-12-ENCONTROS.md). **Cada uma das vinte micromissões tem estimativa de 5–10 minutos**, sem contagem regressiva, incluindo orientação breve e uma primeira execução. Repetições e mediação adicionais usam a margem do bloco de 30 minutos ou retomadas, nunca viram limite de conclusão. Essa estimativa de planejamento não foi validada por teste com participantes.

As habilidades adicionais exigidas nesta revisão foram distribuídas nos complementos presenciais dos campos 18, sem acrescentar etapas obrigatórias às micromissões. Seus enunciados completos propostos estão no [quadro de cobertura da matriz](MATRIZ-CURRICULAR.md#cobertura-explícita-das-habilidades). Mudanças substanciais de objetivo/cenário, inclusive eventual incorporação desses complementos ao motor, exigem revisão e aprovação antes de alterar `src/data`. IDs, títulos e critérios centrais das vinte fichas foram preservados.

Cada ficha contém os vinte campos solicitados. A é aprendizagem/prática guiada; B é aplicação em outro contexto, com apoio opcional. “Concluir” é critério didático proposto, não escore T0/T1/T2 nem comprovação de domínio. Ajuda não reduz reconhecimento. Todas permitem pausa, retorno, repetição ilimitada e revisão sem penalização, tempo limite, ranking ou recompensa por velocidade. Não inventar conclusão no protótipo atual.

Respostas incorretas deixam o passo editável e explicam um caminho de revisão; nunca avançam uma ação perigosa. Critérios especificam o estado final verificável; a pessoa pode chegar a ele após feedback e com mediação. Na indisponibilidade de uma modalidade, oferecer alternativa equivalente, sem tratar barreira de acesso como erro de aprendizagem.

Todos os textos para participantes são propostas revisáveis. Nenhum campo aceita nome real, senha, CPF, conta, chave Pix, arquivo do dispositivo ou relato pessoal. Composição usa cartões/frases sintéticas selecionáveis. O botão “Enviar” nas simulações deve ser “Simular envio”, acompanhado de aviso persistente. Nenhum envio, instalação ou configuração ocorre fora da simulação.

### Requisitos transversais de software (especificação futura)

| Código | Requisito e aceitação proposta |
| --- | --- |
| RS01 | Simulador isolado e conteúdo sintético: interações não navegam para serviços, não iniciam transações, não pedem credenciais nem APIs de câmera, contatos, arquivo, áudio ou configuração do sistema |
| RS02 | Estado didático verificável por passo; revisão e repetição sem limite; não concluir ao apenas abrir/ler; saídas de pausa e ajuda separadas de conclusão |
| RS03 | Ajuda contextual opcional, instrução de uma ação por vez e feedback específico; preservar o trabalho ao abrir/fechar ajuda |
| RS04 | Teclado e leitor de tela: botões nativos, nomes acessíveis, agrupamentos, foco previsível, feedback dinâmico anunciado sem roubar foco; nenhuma operação exige arrastar, pinçar, longa pressão ou precisão fina |
| RS05 | Tokens do sistema de design; alvos preferenciais 48 px, zoom 200%, reflow 320 CSS px, contraste aplicável e movimento reduzido; inspeção manual necessária |
| RS06 | Sem dados reais ou coleta nesta fase. Qualquer adaptador futuro de eventos deve permanecer desativado até autorização técnica/ética própria |
| RS07 | Conteúdo/regras em configuração separada da UI, códigos documentais versionados e resolução explícita dos IDs antigos antes de migração; testar trajetórias de ajuda, erro, revisão, conclusão e pausa |
| RS08 | Progresso/conquista somente mediante ação validada e autorização futura; privada, opcional e sem nota de pesquisa ou inferência automática de autonomia |

RS-M01–RS-M20 são requisitos específicos descritos no campo 19 de cada ficha. A [rastreabilidade](RASTREABILIDADE-PEDAGOGICA.md) associa cada um à evidência prevista. G1–G6 e F1–F8 estão na matriz. A etapa documental não executava requisitos; a autorização posterior implementou somente o recorte M01/M02 e a infraestrutura correspondente, descritos na arquitetura. Requisitos de pesquisa, persistência e demais modalidades não foram antecipados.

### Learning Analytics: eventos candidatos, sem coleta

Os eventos são **candidatos à revisão de necessidade**, não autorização para instrumentar nem promessa de armazenamento. O conjunto mínimo futuro deve ser justificado por pergunta de pesquisa ou necessidade de apoio; não medir velocidade, usar ranking ou interpretar número de erros/ajudas como incapacidade.

| Código | Nome proposto | Significado / campos permitidos propostos |
| --- | --- | --- |
| E1 | `mission_opened` | Abertura explícita; mission_code e content_version |
| E2 | `guidance_viewed` | Demonstração opcional aberta; step_code |
| E3 | `action_reviewed` | Ação enviada para revisão; step_code e outcome enum `adequada/revisar`, sem texto ou valor selecionado |
| E4 | `feedback_presented` | Feedback de regra apresentado; feedback_code, sem transcrição |
| E5 | `help_opened` | Ajuda solicitada; step_code, sem pergunta digitada |
| E6 | `retry_requested` | Reinício solicitado pela pessoa; scope enum `passo/missao` |
| E7 | `practice_completed` | Critério didático atendido; criterion_version e support_mode enum `orientacao_disponivel/mediacao_declarada/nao_informado`. Nunca inferir independência pelo silêncio do botão de ajuda |
| E8 | `mission_left` | Saída explícita do fluxo; state enum `pausada/concluida`. Não inferir abandono ao fechar aba |

Cada evento contém somente os códigos autorais pertinentes. Os códigos de passo abaixo são do conteúdo, não do participante. Não incluir resposta bruta, senha sintética selecionada, URL, consulta, IP, dispositivo, localização, saúde, áudio, tela, nome ou identificadores externos. E1–E8 não incluem vínculo a participante ou sessão nesta proposta; se a pesquisa precisar de ligação longitudinal, sua necessidade e pseudonimização deverão ser aprovadas separadamente. Pseudonimização não torna um dado anônimo. Granularidade temporal, deduplicação, retenção, exclusão, acesso e eventual opt-out dependem de protocolo próprio. O jogo não deve exigir consentimento de pesquisa para acessar conteúdo sem justificativa institucional aprovada. Os eventos não substituem os testes externos nem permitem calcular seus escores.

Nas fichas, “base E1/E4/E5/E6/E8” indica os mesmos eventos apenas quando houver a ação correspondente; E2 somente se a orientação for aberta; E7 somente após critério satisfeito. Não registrar nada agora.

## Trilha 1 — Primeiros Passos no Mundo Digital

### M01 — Encontrar os caminhos da tela

1. **Código e título:** M01 — Encontrar os caminhos da tela (A, guiada).
2. **Trilha e unidade:** Trilha 1; U01 — Operação básica do celular.
3. **Competência:** C1 — Operação Básica e Resolução de Problemas; referência temática DigComp 5.1/5.2.
4. **Objetivo observável:** abrir um aplicativo fictício a partir da tela inicial, recuperar-se de uma abertura equivocada e retornar ao início usando controles nomeados.
5. **Situação cotidiana:** localizar um convite no aplicativo fictício “Recados do bairro”; a pessoa abre “Calendário” por engano e precisa retomar o caminho, sem perda de dados.
6. **Conhecimentos prévios:** reconhecer a instrução e escolher um controle com toque ou teclado; mediação de leitura e exploração dos controles disponível, sem requisito eliminatório.
7. **Instruções iniciais:** “Vamos explorar uma tela de exemplo. Nada será alterado no seu celular. Primeiro, escolha ‘Recados do bairro’. Você pode pedir ajuda ou tentar novamente.”
8. **Interações:** (a) explorar demonstração opcional com nomes dos controles; (b) abrir Recados; (c) voltar ao início; (d) abrir Calendário no ensaio indicado; (e) usar Voltar e abrir Recados; (f) retornar ao início e revisar o caminho. Após uma escolha diferente, indicar onde está e permitir voltar, sem reiniciar todo o exercício.
9. **Tipo:** navegação funcional por telas simuladas, com botões equivalentes a controles visuais; não é pergunta de memorização de ícones.
10. **Conclusão:** cumprir os passos `abrir-recados`, `recuperar-caminho` e `retornar-inicio`; abrir a ajuda não impede concluir. Apenas assistir à demonstração não satisfaz o critério.
11. **Feedback adequado:** “Você voltou ao início e encontrou os recados. O botão ‘Voltar’ ajudou a retomar seu caminho.”
12. **Feedback de dificuldade:** “Você está no Calendário de exemplo. Nada foi perdido. Use ‘Voltar à tela inicial’ e procure ‘Recados do bairro’.”
13. **Ajuda:** nomear tela atual, objetivo do passo e controle de retorno; oferecer exemplo narrado em texto e retomada com mediador, sem executar a tarefa pela pessoa.
14. **Repetição:** refazer um passo ou toda a navegação; sem limite, desconto, cronômetro ou exigência de velocidade.
15. **Gamificação:** G1 objetivo/passos e G3 feedback informativo; futuro G4 reconhece o percurso praticado, sem declarar “domínio do celular”.
16. **Eventos futuros:** base E1/E4/E5/E6/E8; E2 na demonstração; E3 nos três passos nomeados; E7 após os três. Não registrar posição do toque ou trajetória de ponteiro.
17. **Acessibilidade específica:** controles com nome visível e acessível; ordem de foco equivalente à ordem visual; nenhuma navegação depende de swipe ou botão físico real; mudança de tela deve ser identificada ao leitor de tela.
18. **Complemento presencial:** primeiro segmento do complemento único de 15 minutos da U01: praticar Wi-Fi por cerca de 5 minutos em maquete/aparelho da equipe. Localizar Wi-Fi, selecionar rede fictícia previamente indicada, conferir estado textual e distinguir “conectado à rede” de informação ainda indisponível; escolher voltar ou pedir ajuda, sem digitar senha. Sem conexão real ou inspeção de redes pessoais. M01 mantém foco em navegação/recuperação (5–10 min); ajuda pode relacionar dificuldade de conexão ao pedido de apoio, sem nova etapa obrigatória.
19. **Software:** RS01–RS08; **RS-M01:** simulador precisa permitir uma abertura equivocada reversível, identificar a tela corrente e comprovar os três passos por ações, com ensaio por teclado e teste de que não há chamada ao sistema do aparelho.
20. **Justificativa:** proposta de ligar o controle a um propósito e a uma recuperação concreta, em vez de decorar símbolos (F3). A escolha de apoio e o feedback descritivo são hipóteses de suporte à autonomia/competência (F2); não constituem resultado demonstrado para este público.

### M02 — Preparar a tela para ler um convite

1. **Código e título:** M02 — Preparar a tela para ler um convite (B, contextualizada).
2. **Trilha e unidade:** Trilha 1; U01 — Operação básica do celular.
3. **Competência:** C1 — Operação Básica e Resolução de Problemas; DigComp 5.1/5.2.
4. **Objetivo observável:** diante de texto pequeno numa simulação, escolher um ajuste de apresentação, aplicá-lo, voltar ao convite e localizar a informação solicitada.
5. **Situação cotidiana:** o convite fictício para uma roda de leitura mostra local e horário em uma prévia de texto reduzido. A interface de instrução permanece legível; somente a prévia ilustra o problema.
6. **Conhecimentos prévios:** navegação explorada em M01 ou orientação equivalente. M01 não é bloqueio; oferecer retomada guiada.
7. **Instruções iniciais:** “O texto do convite de exemplo está pequeno. Prepare uma forma mais confortável de ler e encontre o local do encontro. Os ajustes valem apenas nesta atividade.”
8. **Interações:** (a) identificar a dificuldade por opções como “preciso ampliar o texto”; (b) escolher Abrir ajustes da simulação; (c) selecionar apresentação ampliada ou modo de leitura equivalente; (d) aplicar e retornar ao convite; (e) selecionar o cartão do local entre os campos do próprio convite; (f) conferir o antes/depois e, se desejar, desfazer. Não exigir tamanho único como prova de acerto.
9. **Tipo:** resolução de problema em simulador de preferências, com prévia e transferência de volta à tarefa.
10. **Conclusão:** escolher uma solução de apresentação pertinente, aplicá-la e recuperar o local correto a partir do convite; aceite de modo ampliado ou alternativa de leitura equivalentes. Desfazer depois não apaga a prática concluída.
11. **Feedback adequado:** “Você ajustou a apresentação e encontrou o local. Adaptar a leitura às suas necessidades é uma forma de usar a tecnologia com autonomia.”
12. **Feedback de dificuldade:** “Esse controle muda o volume, mas o desafio está na leitura. Experimente ‘Texto ampliado’ ou ‘Modo de leitura’. Seu convite continua disponível.”
13. **Ajuda:** distinguir apresentação da prévia de configurações reais; mostrar como abrir, aplicar, voltar e desfazer; oferecer descrição textual integral do convite e mediação sem punição.
14. **Repetição:** reiniciar com outro convite sintético de mesma complexidade ou repetir o atual; sem limite ou comparação entre tentativas.
15. **Gamificação:** G2 escolha de solução pertinente, G3 explicação e futuro G4 marco privado de prática; não premiar letras menores ou execução sem ajuda.
16. **Eventos futuros:** base; E2 se demonstração aberta; E3 em `identificar-dificuldade`, `aplicar-apresentacao` e `recuperar-local`; E7 após critério. Nunca registrar tamanho de fonte pessoal, preferência do navegador ou suposta condição visual.
17. **Acessibilidade específica:** prévia problemática nunca deve tornar a atividade inacessível; leitura textual equivalente sempre disponível. Botões “Aumentar texto”/“Modo de leitura” substituem pinça; zoom do navegador continua funcional; nenhuma altura fixa ou truncamento.
18. **Complemento presencial:** segundo segmento do mesmo complemento único de 15 minutos da U01: praticar brilho e volume em maquete, cerca de 3 minutos cada; ajustar brilho representado na prévia, indicar mudança e desfazer; ajustar volume representado de áudio sintético com transcrição e mostrar estado “silenciado/audível”, sem tocar som alto. Usar os 4 minutos restantes para recuperar caminho, comparar ajustes e sintetizar (5+3+3+4=15). Controles reais do aparelho pessoal não são necessários. M02 mantém seu cenário de leitura (5–10 min); volume não resolve texto pequeno, como informa seu feedback.
19. **Software:** RS01–RS08; **RS-M02:** preferências afetam somente a prévia isolada; suportar aplicar, retornar e desfazer; avaliar adequação da solução e recuperação da informação, não um valor fixo de fonte. Testar que instruções e zoom não são reduzidos pela simulação.
20. **Justificativa:** o ajuste é meio para ler um convite, conectando problema e uso (F3). Oferecer caminhos equivalentes é decisão de inclusão (F8) e escolha apoiada (F2), sujeita à inspeção; não diagnostica condição sensorial nem comprova autonomia geral.

### M03 — Preparar uma mensagem para o grupo

1. **Código e título:** M03 — Preparar uma mensagem para o grupo (A, guiada).
2. **Trilha e unidade:** Trilha 1; U02 — Comunicação digital.
3. **Competência:** C2 — Comunicação e Colaboração Digital; DigComp 2.1/2.5.
4. **Objetivo observável:** compor um recado sintético pertinente ao grupo, conferir destinatário e revisar antes de simular envio.
5. **Situação cotidiana:** confirmar participação num grupo fictício de leitura, sem divulgar contatos ou detalhes pessoais.
6. **Conhecimentos prévios:** escolher controles e retornar; apoio equivalente a M01 disponível.
7. **Instruções iniciais:** “Prepare um recado para o grupo de exemplo. Escolha as frases, confira para quem vai e revise. Nada será enviado de verdade.”
8. **Interações:** escolher destinatário “Grupo de leitura”; montar recado com cartões de saudação, confirmação e fechamento; abrir prévia; corrigir destinatário ou frase se necessário; acionar Simular envio; observar conversa de exemplo atualizada.
9. **Tipo:** composição guiada e revisão em mensageria simulada; alternativa de mensagem de áudio pré-gravada sintética, com transcrição, sem microfone.
10. **Conclusão:** recado atende ao pedido de confirmação, tem destinatário correto e passa pela prévia antes do envio simulado; diferentes frases respeitosas são aceitas.
11. **Feedback adequado:** “Seu recado confirma a participação e foi dirigido ao grupo certo. A revisão ajudou a conferir a mensagem.”
12. **Feedback de dificuldade:** “Esse recado fala de outro assunto. Volte às frases de confirmação. Você pode revisar antes de simular o envio.”
13. **Ajuda:** explicar destinatário, prévia e envio simulado; demonstrar editar sem perder a composição; lembrar que não é necessário escrever informação pessoal.
14. **Repetição:** reconstruir o recado livremente e repetir com outra finalidade sintética; sem penalidade.
15. **Gamificação:** G1 tarefa clara, G2 modalidade equivalente, G3 feedback e G5 troca voluntária sobre comunicação respeitosa.
16. **Eventos futuros:** base; E2 opcional; E3 `destinatario`, `composicao`, `revisao-envio`; E7 após confirmação adequada. Sem transcrição ou áudio de participante.
17. **Acessibilidade específica:** frases selecionáveis por teclado, sem arrastar; áudio nunca obrigatório; lista de frases e prévia com nomes/agrupamentos; anúncio de atualização sem leitura automática de toda a conversa.
18. **Complemento presencial:** primeira parte do complemento de 15 minutos da U02, cerca de 7 minutos: em duplas voluntárias, selecionar, reproduzir/pausar e revisar áudio sintético com transcrição antes de simular recado; sem gravar voz ou abrir grupos reais. Alternativa textual equivalente sempre disponível. Áudio é conteúdo de aprendizagem e não prova de acuidade auditiva.
19. **Software:** RS01–RS08; **RS-M03:** compositor por frases, edição e prévia obrigatória antes de simulação; nenhuma API de envio/áudio; aceitar múltiplas formulações pertinentes.
20. **Justificativa:** compor para uma finalidade compartilhada aproxima comunicação e participação (F3); revisão antes da ação favorece feedback útil, sem recompensa condicionada à exposição pessoal (interpretação de F2).

### M04 — Compartilhar o arquivo certo com a pessoa certa

1. **Código e título:** M04 — Compartilhar o arquivo certo com a pessoa certa (B, contextualizada).
2. **Trilha e unidade:** Trilha 1; U02 — Comunicação digital.
3. **Competência:** C2 — Comunicação e Colaboração Digital; DigComp 2.1/2.2/2.5.
4. **Objetivo observável:** selecionar material pertinente, destino e mensagem de contexto, revisar a prévia e simular compartilhamento sem expor arquivo desnecessário.
5. **Situação cotidiana:** enviar o programa de uma oficina fictícia a uma pessoa da equipe de leitura; a biblioteca de exemplo também contém imagem ilustrativa de documento, claramente sintética, que não deve ser enviada.
6. **Conhecimentos prévios:** destinatário e revisão de M03; instrução equivalente disponível.
7. **Instruções iniciais:** “Uma pessoa pediu o programa da oficina. Escolha o material de exemplo e confira quem deve recebê-lo. Não abra arquivos do seu celular.”
8. **Interações:** ler pedido; explorar nomes/descrições de três arquivos internos; selecionar programa; escolher contato fictício indicado, em vez de grupo público; adicionar frase de contexto; inspecionar prévia; corrigir e confirmar compartilhamento simulado.
9. **Tipo:** resolução de pedido com seleção de arquivo, destinatário e revisão em biblioteca interna.
10. **Conclusão:** arquivo e destinatário correspondem ao pedido, texto identifica o conteúdo e pessoa confirma prévia sem anexar material privado sintético; revisão é livre.
11. **Feedback adequado:** “Você selecionou o programa e conferiu quem vai recebê-lo. O recado também explica o conteúdo do arquivo.”
12. **Feedback de dificuldade:** “Esse arquivo não é o programa solicitado. Revise o nome e a descrição. Nenhum material saiu desta simulação.”
13. **Ajuda:** orientar leitura de nome, tipo e descrição; distinguir anexar de enviar; indicar como remover anexo e mudar destino.
14. **Repetição:** refazer seleção e repetir pedido alternativo equivalente; sem desconto por troca de anexo.
15. **Gamificação:** G2 escolha justificada, G3 retorno específico e G5 revisão presencial em dupla opcional.
16. **Eventos futuros:** base, E2 opcional; E3 `arquivo-pertinente`, `destino`, `previa`; E7 após conjunto coerente. Não registrar nome de arquivo ou contato real; ambos inexistem no simulador.
17. **Acessibilidade específica:** descrições textuais dos arquivos e estado “selecionado”; botão de remover com nome do anexo; sem seletor nativo de arquivos, arrastar ou dependência de miniaturas.
18. **Complemento presencial:** segunda parte do mesmo complemento da U02, cerca de 8 minutos: escolher uma imagem sintética pertinente ao convite, abrir sua descrição/legenda, selecionar destinatário, revisar e remover anexo desnecessário antes do compartilhamento simulado; explicar por que documento privado não deve circular. Sem galeria pessoal. A imagem pública pertinente é material diferente da imagem de documento indevida no cenário central de M04.
19. **Software:** RS01–RS08; **RS-M04:** biblioteca sintética fechada, prévia editável, remoção de anexo e confirmação; testar impossibilidade de carregar arquivo do dispositivo.
20. **Justificativa:** escolher conteúdo para um destinatário torna o compartilhamento uma decisão com finalidade, não um clique isolado (F3). O feedback explicita cuidado e competência sem constranger pelo erro (F2).

### M05 — Transformar uma dúvida em busca

1. **Código e título:** M05 — Transformar uma dúvida em busca (A, guiada).
2. **Trilha e unidade:** Trilha 1; U03 — Pesquisa de informações.
3. **Competência:** C3 — Pesquisa e Gestão de Informação; DigComp 1.1/1.3.
4. **Objetivo observável:** construir uma consulta pertinente, refinar informação ausente e guardar um resultado relevante na coleção da simulação.
5. **Situação cotidiana:** descobrir o horário de uma biblioteca fictícia do bairro, distinguindo uma agenda antiga do horário atual da instituição de exemplo.
6. **Conhecimentos prévios:** navegação por controles; não pressupor uso prévio de buscador ou digitação fluente.
7. **Instruções iniciais:** “Vamos procurar o horário da biblioteca de exemplo. Escolha palavras que ajudem a busca e guarde a informação útil nesta atividade.”
8. **Interações:** escolher necessidade; montar consulta com cartões “horário / biblioteca / bairro”; simular busca; explorar resultados locais; acrescentar o bairro se faltar contexto; abrir resultado pertinente e salvar na coleção local da atividade com rótulo pronto.
9. **Tipo:** construção/refinamento de consulta e organização de resultado, sem busca real na internet.
10. **Conclusão:** consulta inclui assunto e contexto suficientes; resultado responde à necessidade e é recuperável pela coleção da simulação.
11. **Feedback adequado:** “Sua busca ficou mais específica. Você encontrou o horário e guardou a informação para consultar novamente.”
12. **Feedback de dificuldade:** “A busca ainda não informa qual biblioteca. Acrescente o bairro e compare os resultados novamente.”
13. **Ajuda:** comparar consulta ampla/específica com outro exemplo; explicar que posição na lista não prova qualidade e mostrar onde fica a coleção.
14. **Repetição:** trocar palavras, voltar aos resultados ou reiniciar com necessidade sintética equivalente, sem penalização.
15. **Gamificação:** G1 objetivo, G2 montagem de caminhos equivalentes e G3 explicação do refinamento; futuro G4 privado.
16. **Eventos futuros:** base, E2 opcional; E3 `consulta`, `refinamento`, `guardar-resultado`; E7 após recuperação. Sem coletar palavras/consultas ou histórico de navegação.
17. **Acessibilidade específica:** ordenar palavras por botões “Adicionar/Remover”, não arrastar; resultados como lista de títulos/descrições; “Guardar” com estado textual e retorno à coleção por teclado.
18. **Complemento presencial:** primeira parte do complemento da U03, cerca de 7 minutos: montar consulta sobre horário de um serviço de saúde fictício, localizar e comparar dois cartões por autoria, data e pertinência. São informações administrativas, sem sintomas, aconselhamento clínico ou dado pessoal; não se abre buscador real. Retoma os passos de busca sem substituir o cenário central da biblioteca.
19. **Software:** RS01–RS08; **RS-M05:** buscador determinístico com resultados autorais, refinamento e coleção apenas no estado transitório da simulação; nenhuma chamada a motor de busca externo.
20. **Justificativa:** explicitar a necessidade e modificar uma busca permite agir sobre um problema de informação (F3). A tarefa foi desenhada para produzir evidência observável e permitir revisão; o mapeamento é uma adaptação curricular de F1.

### M06 — Encontrar uma atividade no bairro

1. **Código e título:** M06 — Encontrar uma atividade no bairro (B, contextualizada).
2. **Trilha e unidade:** Trilha 1; U03 — Pesquisa de informações.
3. **Competência:** C3 — Pesquisa e Gestão de Informação; DigComp 1.1/1.2/1.3.
4. **Objetivo observável:** localizar atividade que atenda a condições dadas, comparar sua atualidade e organizar um resumo recuperável de local, dia e fonte.
5. **Situação cotidiana:** uma pessoa fictícia procura oficina gratuita de jardinagem no sábado, em bairro determinado; resultados incluem outra cidade, evento passado e agenda pertinente.
6. **Conhecimentos prévios:** consulta e coleção de M05 ou orientação equivalente; comparações com pistas explícitas, sem exigir repertório local.
7. **Instruções iniciais:** “Encontre uma oficina que combine com o pedido. Confira local e data e monte um lembrete de exemplo. Não será feita inscrição.”
8. **Interações:** identificar condições do pedido; montar consulta; comparar três resultados; abrir detalhes; selecionar opção pertinente ou refinar busca; preencher lembrete com cartões de dia/local/fonte; guardar e reabrir para conferir.
9. **Tipo:** busca contextual com restrições, comparação e síntese organizada.
10. **Conclusão:** atividade atende a tema, local, gratuidade e dia definidos; lembrete reproduz corretamente informações e fonte e pode ser reaberto.
11. **Feedback adequado:** “Você comparou as opções e guardou os dados da oficina que atende ao pedido. A fonte ficou junto do lembrete.”
12. **Feedback de dificuldade:** “Essa oficina aconteceu em outra data. Confira a agenda e revise o lembrete. Você pode voltar aos resultados.”
13. **Ajuda:** checklist de tema/local/data/custo; demonstrar consulta com outro assunto e orientar onde rever fonte, sem apontar imediatamente a alternativa final.
14. **Repetição:** refazer qualquer comparação ou recomeçar; variantes autorais de complexidade semelhante, sem surpresa punitiva.
15. **Gamificação:** G2 escolha do tema entre versões equivalentes, G3 feedback e G5 troca sobre estratégias de busca, opcional.
16. **Eventos futuros:** base; E2 se ajuda guiada aberta; E3 `condicoes`, `resultado`, `lembrete-recuperado`; E7 após critério. Não registrar localização real ou interesse inferido.
17. **Acessibilidade específica:** datas por extenso, custo textual, sem mapa obrigatório; cards com mesma estrutura; lembrete navegável por teclado e sem calendário dependente de gesto.
18. **Complemento presencial:** segunda parte do mesmo complemento da U03, cerca de 8 minutos: escolher o cartão atualizado e pertinente do serviço de saúde fictício, justificar confiabilidade por referência independente, guardar horário/canal/fonte em lembrete por cartões e recuperá-lo. Não tratar posição, logomarca ou data isoladas como garantia. Sem reproduzir item de teste; M06 mantém a oficina de bairro como cenário central.
19. **Software:** RS01–RS08; **RS-M06:** verificar coerência entre condições, resultado e lembrete; permitir refinar, editar e recuperar sem calendário externo, geolocalização ou inscrição real.
20. **Justificativa:** organizar o que foi encontrado liga busca a uso posterior, evitando reduzir gestão da informação à leitura de resultados. É uma proposta situada (F3), com escolhas adequadas ao interesse sem exigir autorrelato (F2).

## Trilha 2 — Segurança e Pensamento Crítico

### M07 — Investigar de onde veio a notícia

1. **Código e título:** M07 — Investigar de onde veio a notícia (A, guiada).
2. **Trilha e unidade:** Trilha 2; U04 — Desinformação.
3. **Competência:** C4 — Avaliação Crítica da Informação (Desinformação); DigComp 1.2.
4. **Objetivo observável:** abrir evidências de autoria, data e fonte de um aviso e comparar a afirmação com um comunicado independente de referência.
5. **Situação cotidiana:** mensagem de exemplo afirma que a biblioteca ficará fechada “amanhã”; a imagem usa aviso antigo e recorta a data.
6. **Conhecimentos prévios:** abrir detalhes e comparar informação, com retomada de M05/M06 se desejada.
7. **Instruções iniciais:** “Antes de decidir sobre este aviso, vamos procurar quem publicou, quando e em qual contexto. Uma imagem sozinha pode não contar toda a história.”
8. **Interações:** abrir painel de origem; revelar data completa; consultar comunicado simulado independente; marcar as evidências que respondem a autoria/data/contexto; reconstruir a afirmação como “aviso antigo, não confirma fechamento atual”.
9. **Tipo:** investigação de evidências e reconstrução do contexto, sem quiz sobre “verdadeiro/falso” pela aparência.
10. **Conclusão:** consultar três pistas, comparar as duas fontes e produzir síntese compatível com a diferença de data/contexto; reputação visual isolada não basta.
11. **Feedback adequado:** “Você encontrou a data e comparou o comunicado. O aviso antigo não confirma a situação atual.”
12. **Feedback de dificuldade:** “A imagem parece convincente, mas falta conferir quando foi publicada. Abra a data completa e compare com o comunicado.”
13. **Ajuda:** perguntas “Quem? Quando? Qual contexto? Que outra fonte confirma?”; lembrar que imagem, áudio ou conteúdo gerado com IA não é prova automática de autenticidade ou falsidade.
14. **Repetição:** rever evidências e síntese com orientação; sem penalidade por mudar de interpretação.
15. **Gamificação:** G1 investigação com propósito, G3 revisão explicada e futuro G6 “prática de verificação”, sem selo de especialista.
16. **Eventos futuros:** base; E2 opcional; E3 `origem`, `comparacao`, `sintese`; E7 após conjunto; não armazenar crença pessoal ou notícia real.
17. **Acessibilidade específica:** a imagem tem transcrição integral, inclusive data e contexto; evidências em botões nomeados, não lupa de precisão; nada exige reconhecer montagem visual.
18. **Complemento presencial:** comparar versões de avisos fictícios e localizar o que foi cortado ou retirado de contexto.
19. **Software:** RS01–RS08; **RS-M07:** painéis de evidências rastreáveis e fontes simuladas divergentes; aceitar consulta em qualquer ordem; exigir síntese fundamentada, não somente abrir painéis.
20. **Justificativa:** investigar o contexto em vez de memorizar marcas de “notícia falsa” é decisão de tarefa apoiada no foco crítico de F1. A revisão de interpretação integra o problema e a ação (F3), sem inferir mudança de crenças.

### M08 — Decidir antes de compartilhar

1. **Código e título:** M08 — Decidir antes de compartilhar (B, contextualizada).
2. **Trilha e unidade:** Trilha 2; U04 — Desinformação.
3. **Competência:** C4 — Avaliação Crítica da Informação (Desinformação); DigComp 1.2/2.2.
4. **Objetivo observável:** confrontar uma alegação com evidências disponíveis, decidir não difundir informação não confirmada e preparar resposta respeitosa que explicite a incerteza.
5. **Situação cotidiana:** num grupo fictício circula aviso de “distribuição de plantas neste domingo”; uma fonte reproduz outra sem comprovação, e o organizador não confirma data.
6. **Conhecimentos prévios:** pistas de M07; orientação e checklist permanecem acessíveis.
7. **Instruções iniciais:** “O grupo recebeu um aviso. Confira o que sabemos antes de compartilhar. Se faltar confirmação, você pode aguardar e explicar o motivo.”
8. **Interações:** consultar mensagem e duas fontes; identificar que repetição não é confirmação independente; escolher ação “aguardar confirmação/não encaminhar”; compor resposta por frases respeitosas com motivo e próximo passo; revisar.
9. **Tipo:** tomada de decisão argumentada e composição de resposta, com ramificação segura se houver tentativa de encaminhar.
10. **Conclusão:** decisão coerente com evidência insuficiente, justificativa identifica ausência de confirmação e resposta não hostil propõe consultar organizador por canal independente; sem envio real.
11. **Feedback adequado:** “Você evitou ampliar um aviso ainda não confirmado e explicou o cuidado ao grupo com respeito.”
12. **Feedback de dificuldade:** “Duas páginas repetem o mesmo aviso, mas não mostram a confirmação do organizador. Revise a origem antes de decidir.”
13. **Ajuda:** diferenciar número de compartilhamentos de evidência; oferecer resposta-modelo de outro tema; não exigir classificar tudo como falso quando falta informação.
14. **Repetição:** rever decisão/resposta; exemplos equivalentes de incerteza e confirmação poderão ser revisitados sem punição.
15. **Gamificação:** G2 decisão refletida, G3 feedback e G5 conversa voluntária sobre cuidados coletivos, sem expor convicções individuais.
16. **Eventos futuros:** base, E2 opcional; E3 `independencia-fontes`, `decisao`, `resposta`; E7 após critério. Não registrar posicionamentos políticos, temas sensíveis ou texto livre.
17. **Acessibilidade específica:** comparação em sequência linear alternativa à tabela; incerteza expressa em texto; frases selecionáveis sem arrastar e com leitura da prévia.
18. **Complemento presencial:** representar uma conversa respeitosa usando cartões de papéis e notícias inventadas não sensíveis.
19. **Software:** RS01–RS08; **RS-M08:** ramificar sem encaminhar conteúdo, aceitar justificativas equivalentes e revisar coerência entre fontes, ação e resposta; erro nunca provoca publicação.
20. **Justificativa:** a aplicação exige posicionar-se sobre evidência e responsabilidade, em vez de lembrar uma definição (F3). A colaboração é proposta como apoio, sem pressão para concordância pública (F2).

### M09 — Cuidar da senha e do código de acesso

1. **Código e título:** M09 — Cuidar da senha e do código de acesso (A, guiada).
2. **Trilha e unidade:** Trilha 2; U05 — Senhas e privacidade.
3. **Competência:** C5 — Segurança Digital (Senhas e Privacidade); DigComp 4.1/4.2.
4. **Objetivo observável:** escolher uma estratégia de senha longa e exclusiva para uma conta fictícia, diferenciar senha de código adicional e completar um fluxo seguro sem transmitir segredo a interlocutor.
5. **Situação cotidiana:** preparar acesso fictício à biblioteca; opções prontas contrastam reutilização, dado pessoal óbvio e frase longa sintética exclusiva. Depois, surge pedido de código por mensagem.
6. **Conhecimentos prévios:** destinatário e mensagem; não precisa ter conta nem saber sua senha atual.
7. **Instruções iniciais:** “Use apenas as opções de exemplo. Não escreva uma senha sua. Vamos cuidar do acesso e descobrir por que um código adicional não deve ser enviado a outra pessoa.”
8. **Interações:** comparar estratégias prontas; escolher a longa/exclusiva e seu motivo; localizar proteção adicional numa tela simulada; receber cartão “código de exemplo”; escolher usá-lo somente na etapa de acesso iniciada pela própria pessoa; recusar compartilhamento pedido em conversa.
9. **Tipo:** configuração guiada por escolhas e simulação de segundo fator, sem campo de senha livre ou serviço real.
10. **Conclusão:** estratégia adequada, distinção da função do código e recusa de envio a terceiro, com explicação selecionada; não exigir memorizar a senha sintética.
11. **Feedback adequado:** “Você separou o acesso à conta de uma conversa. A senha exclusiva e a etapa adicional são cuidados diferentes que se complementam.”
12. **Feedback de dificuldade:** “Esse pedido quer que o código saia do acesso que você iniciou. Não o envie pela conversa. Volte e escolha como proteger o código.”
13. **Ajuda:** explicar exclusividade, diferença entre segredo e contato público e papel do código; nunca pedir demonstração com credenciais reais; não prometer senha inviolável ou impor composição arbitrária.
14. **Repetição:** rever escolhas de estratégia e código sem expiração simulada ou punição.
15. **Gamificação:** G1 objetivo, G3 feedback explicativo, futuro G4 prática privada; sem pontuar complexidade da senha ou rapidez.
16. **Eventos futuros:** base, E2 opcional; E3 `estrategia-acesso`, `papel-codigo`, `recusa-compartilhar`; E7 após critério. Jamais registrar senha, código ou valor sintético escolhido.
17. **Acessibilidade específica:** opções descritas por texto, não medidor apenas colorido; códigos exemplificativos não expiram; sem CAPTCHA ou teste de memória; leitura não revela segredo real, pois nenhum existe.
18. **Complemento presencial:** comparar estratégias por cartões; discutir apoio seguro sem abrir gerenciadores de senhas pessoais.
19. **Software:** RS01–RS08; **RS-M09:** apenas opções autorais de estratégia, código sintético sem relógio, nenhuma autenticação ou entrada de segredo; testar que não se conclui ao enviar código para conversa.
20. **Justificativa:** atuar no fluxo e justificar proteção é proposta de prática situada (F3). F6/F7 motivam cuidado com segredos e acesso; a ficha não prescreve política real de senhas nem substitui instruções atuais do serviço.

### M10 — Escolher o que pode ser compartilhado

1. **Código e título:** M10 — Escolher o que pode ser compartilhado (B, contextualizada).
2. **Trilha e unidade:** Trilha 2; U05 — Senhas e privacidade.
3. **Competência:** C5 — Segurança Digital (Senhas e Privacidade); DigComp 4.2.
4. **Objetivo observável:** revisar um cartão fictício de divulgação, retirar informações pessoais desnecessárias e escolher público coerente com a finalidade.
5. **Situação cotidiana:** divulgar convite público de uma oficina; o rascunho inclui endereço residencial e imagem sintética de documento, que não são necessários ao convite.
6. **Conhecimentos prévios:** compartilhamento de M04; ajuda para distinguir dado e finalidade disponível.
7. **Instruções iniciais:** “Prepare um convite para divulgar. Confira o que o público precisa saber e retire os dados que não são necessários. Tudo nesta tela é fictício.”
8. **Interações:** identificar finalidade; inspecionar cartões de informação; manter título, local público e horário da oficina; remover contato privado/endereço pessoal/documento sintéticos; escolher público; revisar prévia e justificar remoções por motivos prontos.
9. **Tipo:** edição de divulgação e escolha de destinatários, sem upload ou postagem.
10. **Conclusão:** prévia contém informação suficiente para o convite, exclui dados pessoais desnecessários e usa público coerente; recusa geral de divulgar tudo sem elaborar convite não conclui a tarefa.
11. **Feedback adequado:** “O convite informa o necessário sem expor dados privados que não ajudam o público a participar.”
12. **Feedback de dificuldade:** “O endereço residencial não é o local da oficina. Você pode removê-lo e manter o endereço público do encontro.”
13. **Ajuda:** relacionar cada campo à pergunta “para que precisa disso?” e mostrar como remover/recolocar; lembrar que até dado aparentemente comum pode identificar uma pessoa.
14. **Repetição:** editar e comparar versões; sem perda de conquista por rever uma decisão.
15. **Gamificação:** G2 escolha do que divulgar, G3 explicação e futuro G6 marco de “prática de cuidado”, sem selo de proteção garantida.
16. **Eventos futuros:** base, E2 opcional; E3 `finalidade`, `edicao`, `publico-previa`; E7 após critério. Não coletar os campos, destinatários ou justificativa textual de pessoas.
17. **Acessibilidade específica:** cada campo tem rótulo e controle “Manter/Retirar”; estado textual, desfazer e leitura linear da prévia; documento fictício inteiramente descrito, sem depender de imagem.
18. **Complemento presencial:** revisar convite impresso sintético em dupla e explicar quais informações são pertinentes ao público escolhido.
19. **Software:** RS01–RS08; **RS-M10:** editor fechado com estado reversível, finalidade explícita e prévia; validar pertinência, não apenas quantidade de campos removidos.
20. **Justificativa:** a decisão depende da finalidade e não de uma lista abstrata de palavras proibidas (F3). O cuidado com minimização é tema orientado por F7, aplicado aqui como proposta educacional, não parecer de conformidade legal.

### M11 — Interromper um pedido suspeito

1. **Código e título:** M11 — Interromper um pedido suspeito (A, guiada).
2. **Trilha e unidade:** Trilha 2; U06 — Fraudes digitais.
3. **Competência:** C6 — Prevenção contra Fraudes (Engenharia Social); DigComp 4.1/4.2.
4. **Objetivo observável:** identificar pressão e pedido de segredo numa conversa fictícia, interromper a ação e escolher confirmação por canal independente.
5. **Situação cotidiana:** suposto suporte solicita código para “evitar bloqueio da conta”. A urgência é descrita, sem relógio, alarme ou ameaça animada.
6. **Conhecimentos prévios:** proteção do código em M09, com explicação disponível se ainda não explorada.
7. **Instruções iniciais:** “Esta conversa é inventada para praticarmos cuidado. Observe o pedido e decida como agir sem informar segredos.”
8. **Interações:** examinar conversa; selecionar trechos de pressão e pedido de código por controles nomeados; escolher interromper; abrir lista de canais já conhecidos na simulação; selecionar canal independente da mensagem e motivo; revisar plano.
9. **Tipo:** reconhecimento de mecanismos de engenharia social e construção guiada de sequência de proteção.
10. **Conclusão:** reconhecer os dois sinais, não compartilhar código e montar plano de interromper/verificar por canal independente; “responder pedindo prova ao mesmo remetente” não satisfaz confirmação independente.
11. **Feedback adequado:** “Você interrompeu o pedido e escolheu conferir por um caminho independente. Não precisa decidir sob pressão.”
12. **Feedback de dificuldade:** “Esse contato foi fornecido pela própria mensagem. Procure um canal que já era conhecido antes do pedido.”
13. **Ajuda:** explicar pressão, identidade alegada e canal independente; oferecer pausa ou mudança para cenário equivalente se o tema provocar desconforto.
14. **Repetição:** reorganizar plano sem punição; não desencadear simulação de prejuízo como consequência de erro.
15. **Gamificação:** G1 objetivo de cuidado, G2 pausa/apoio e G3 feedback sem culpabilização; não atribuir rótulo de “vítima fácil”.
16. **Eventos futuros:** base, E2 opcional; E3 `sinais`, `interromper`, `canal-independente`; E7 após critério. Não registrar relatos de golpes, valor de perda ou conteúdo de mensagem pessoal.
17. **Acessibilidade específica:** texto estático e transcrição de qualquer dramatização; trechos selecionáveis por botões, não realce arrastado; sem sons alarmantes nem urgência real.
18. **Complemento presencial:** ensaiar frases de interrupção respeitosa em papéis fictícios; ninguém precisa contar experiência de fraude.
19. **Software:** RS01–RS08; **RS-M11:** distinguir origem dos canais, permitir parar e retomar; qualquer escolha perigosa produz revisão local, nunca envio de código ou consequência externa.
20. **Justificativa:** ensaiar uma recusa e uma verificação oferece ação concreta para lidar com pressão. É desenho contextual proposto (F3), com cuidado de segurança inspirado em F6 e apoio não controlador inspirado em F2.

### M12 — Conferir um pedido de Pix com segurança

1. **Código e título:** M12 — Conferir um pedido de Pix com segurança (B, contextualizada).
2. **Trilha e unidade:** Trilha 2; U06 — Fraudes digitais.
3. **Competência:** C6 — Prevenção contra Fraudes (Engenharia Social); DigComp 4.1/4.2.
4. **Objetivo observável:** responder a pedido financeiro inesperado interrompendo a transferência e planejando confirmação de identidade por contato prévio independente.
5. **Situação cotidiana:** suposta pessoa conhecida, em “número novo”, pede Pix para compra urgente. Nome, conversa e valor são sintéticos; não há chave Pix ou formulário de pagamento.
6. **Conhecimentos prévios:** plano de M11 ou apoio equivalente; não é necessário usar ou possuir Pix.
7. **Instruções iniciais:** “Vamos decidir como conferir um pedido de dinheiro de exemplo. Não haverá pagamento. Você pode parar, verificar e pedir apoio.”
8. **Interações:** inspecionar pedido; apontar troca de número e pressão como sinais que justificam cautela, não prova isolada; escolher não transferir naquele momento; abrir contatos previamente conhecidos da simulação; montar plano de confirmação por canal anterior; selecionar conduta diante de identidade não confirmada e revisar.
9. **Tipo:** decisão contextual e planejamento de verificação, sem operação financeira simulada completa ou real.
10. **Conclusão:** plano não transfere nem compartilha segredo, usa canal prévio independente e mantém suspensão quando identidade não é confirmada. Foto, voz e nome não são aceitos como verificação suficiente.
11. **Feedback adequado:** “Você separou o pedido da verificação de identidade e manteve a transferência suspensa enquanto faltava confirmação.”
12. **Feedback de dificuldade:** “A foto pode ser copiada. Volte aos contatos já conhecidos e escolha como confirmar fora dessa conversa.”
13. **Ajuda:** explicitar que urgência não obriga a pagar; distinguir canal anterior de contato fornecido pelo solicitante; se houver dúvida fora da aula, buscar apoio por canal institucional conhecido, sem prometer devolução.
14. **Repetição:** rever plano e comparar contexto semelhante sem contagem de perdas ou exposição pública.
15. **Gamificação:** G2 decisão autônoma e G3 retorno do raciocínio; futuro G4 reconhece cuidado praticado, sem prêmio por “pegar golpista”.
16. **Eventos futuros:** base, E2 opcional; E3 `suspender`, `confirmar-identidade`, `plano-final`; E7 após critério. Sem valor financeiro, chave, telefone, banco ou transação nos eventos.
17. **Acessibilidade específica:** mensagens disponíveis em texto; sinalizações explicadas sem depender de avatar ou cor; controles sem tempo limite; pausar não é falhar.
18. **Complemento presencial:** montar uma rede fictícia de canais de confirmação em cartões; conversa sobre apoio sem relato obrigatório de perdas pessoais.
19. **Software:** RS01–RS08; **RS-M12:** ausência de entrada de dados financeiros e APIs de pagamento; estados explícitos “pedido não confirmado” e “transferência não realizada”; testar que nenhuma ramificação executa pagamento.
20. **Justificativa:** a situação exige aplicar interrupção/verificação em outro pedido, como proposta de transferência próxima (F3). F6 fundamenta o cuidado com confirmação; não é ensino de transação ou garantia contra fraude.

### M13 — Examinar um endereço antes de abrir

1. **Código e título:** M13 — Examinar um endereço antes de abrir (A, guiada).
2. **Trilha e unidade:** Trilha 2; U07 — Links maliciosos.
3. **Competência:** C7 — Prevenção contra Links Maliciosos (Phishing); DigComp 1.2/4.1.
4. **Objetivo observável:** comparar o endereço apresentado com uma referência independente da simulação e decidir inspecionar ou buscar outro caminho quando não houver correspondência ou confirmação.
5. **Situação cotidiana:** aviso usa nome da biblioteca, mas o endereço é `biblioteca-bairro.example`; o catálogo previamente conhecido indica `biblioteca.bairro.example`. Ambos são apenas texto sintético, sem navegação.
6. **Conhecimentos prévios:** leitura de mensagens; não exigir conhecimento técnico prévio de domínio, subdomínio ou HTTPS.
7. **Instruções iniciais:** “O nome da mensagem e o endereço podem ser diferentes. Compare com a referência da simulação. Não precisamos abrir o endereço para investigar.”
8. **Interações:** abrir detalhes de endereço por botão; ler nome apresentado e destino textual; consultar catálogo independente; comparar partes com rótulos explicativos; identificar divergência; escolher não usar aquele caminho e apontar a consulta ao catálogo como próximo passo.
9. **Tipo:** inspeção guiada e decisão baseada em referência, sem link real, hover ou pressão longa.
10. **Conclusão:** reconhecer a divergência, recusar o destino não confirmado e indicar caminho independente. Terminação de URL, cadeado, HTTPS ou grafia sozinhos não certificam segurança.
11. **Feedback adequado:** “Você comparou o destino com uma referência independente e encontrou uma diferença. Escolheu conferir por outro caminho.”
12. **Feedback de dificuldade:** “O nome parece semelhante, mas os endereços não são iguais. Abra os detalhes textuais e compare com o catálogo.”
13. **Ajuda:** explicação por partes, leitura em texto e exemplo de endereço encurtado cujo destino não está claro; orientar caminho independente sem exigir resolver o encurtamento.
14. **Repetição:** comparar novamente e experimentar exemplo autoral com outra diferença, sem penalidade.
15. **Gamificação:** G1 exploração com objetivo, G3 explicação de pista e futuro G6 reconhecimento de verificação, sem selo “link seguro”.
16. **Eventos futuros:** base, E2 opcional; E3 `inspecao`, `comparacao`, `decisao`; E7 após critério. Nenhuma URL ou domínio visitado pela pessoa será registrado.
17. **Acessibilidade específica:** endereços quebram linha sem cortar informação; leitura assistiva tem rótulos de partes; botão de copiar não é necessário; não depender de identificar um caractere apenas pela visão.
18. **Complemento presencial:** comparar cartões de endereço com catálogo fictício; discutir por que aparência conhecida não resolve confiança.
19. **Software:** RS01–RS08; **RS-M13:** URLs autorais como texto não clicável, painel de comparação acessível e referência separada; não resolver DNS, pré-carregar destino ou oferecer abertura externa.
20. **Justificativa:** inspeção é ligada à decisão de navegação e a uma fonte de referência, evitando regra superficial de aparência (proposta alinhada a F1 e F3). O simulador mantém erro sem exposição a ameaça real.

### M14 — Sair de uma mensagem e buscar o caminho seguro

1. **Código e título:** M14 — Sair de uma mensagem e buscar o caminho seguro (B, contextualizada).
2. **Trilha e unidade:** Trilha 2; U07 — Links maliciosos.
3. **Competência:** C7 — Prevenção contra Links Maliciosos (Phishing); DigComp 1.2/4.1.
4. **Objetivo observável:** interromper acesso proposto por mensagem suspeita e construir uma rota independente para conferir o assunto, recusando entrega de credenciais.
5. **Situação cotidiana:** falso aviso de entrega de livro pede “atualização de acesso” por endereço encurtado; a pessoa pode consultar o catálogo conhecido de atendimento da biblioteca na simulação.
6. **Conhecimentos prévios:** inspeção de M13, com orientação disponível; nenhuma familiaridade com rastreamento real é exigida.
7. **Instruções iniciais:** “O aviso oferece um caminho que não conseguimos confirmar. Saia da mensagem e procure uma forma independente de conferir a entrega de exemplo.”
8. **Interações:** inspecionar o pedido sem abrir URL; reconhecer pedido de credencial; escolher sair/não preencher; abrir catálogo independente; selecionar atendimento pertinente e organizar pergunta sem dados secretos; verificar que nenhum dado foi enviado.
9. **Tipo:** navegação alternativa e plano de consulta, com exercício de recuperação se a pessoa selecionar a prévia de página suspeita interna.
10. **Conclusão:** não inserir/entregar credenciais, sair do caminho proposto e chegar à informação de atendimento independente com pergunta pertinente. Se abrir prévia interna por engano, voltar e revisar permite concluir igualmente.
11. **Feedback adequado:** “Você deixou o caminho não confirmado e encontrou uma forma independente de conferir o assunto, sem fornecer acesso à conta.”
12. **Feedback de dificuldade:** “Essa página de exemplo continua pedindo um segredo. Não precisa preencher nada. Use ‘Voltar à mensagem’ e procure o catálogo independente.”
13. **Ajuda:** mostrar retorno e diferença entre repetir o link recebido e buscar canal anterior; lembrar que não se pode avaliar segurança apenas pela presença de cadeado.
14. **Repetição:** refazer o caminho, inclusive a recuperação de uma escolha equivocada; sem marca permanente de erro.
15. **Gamificação:** G2 escolha de rota pertinente, G3 revisão e G4 futuro reconhecimento de recuperação, sem premiar ausência de erros.
16. **Eventos futuros:** base, E2 opcional; E3 `interromper-preenchimento`, `rota-independente`, `consulta-segura`; E7 após critério. Não registrar URL, supostas credenciais ou histórico externo.
17. **Acessibilidade específica:** controles de sair e retornar sempre visíveis; prévia suspeita tem aviso de simulação e não captura foco; nenhuma janela pop-up obrigatória ou mensagem que impeça sair.
18. **Complemento presencial:** reconstruir rotas de confirmação com cartões, considerando também canal presencial ou telefone já conhecido sem efetuar chamadas.
19. **Software:** RS01–RS08; **RS-M14:** todas as ramificações ficam locais; página suspeita é representação sem formulário real; permitir recuperação e validar o plano independente após revisão.
20. **Justificativa:** a aplicação inclui recuperação após uma decisão inicial inadequada, tornando o erro reversível e útil para prática (proposta apoiada em F3). Autonomia inclui interromper e procurar apoio, não provar que nunca se engana (interpretação de F2).

## Trilha 3 — Cidadania e Autonomia Digital

### M15 — Encontrar a informação de um serviço essencial

1. **Código e título:** M15 — Encontrar a informação de um serviço essencial (A, guiada).
2. **Trilha e unidade:** Trilha 3; U08 — Serviços essenciais.
3. **Competência:** C8 — Serviços Essenciais e Cidadania Digital; DigComp 2.3/1.1/4.2.
4. **Objetivo observável:** localizar informação de atendimento pertinente numa referência independente e organizar canal, horário e alternativa presencial antes de qualquer identificação.
5. **Situação cotidiana:** consultar como solicitar reparo de iluminação pública numa cidade fictícia; anúncios e cartões de intermediação aparecem ao lado do diretório de serviços de exemplo.
6. **Conhecimentos prévios:** consulta e conferência de caminho em M05/M13; orientação equivalente disponível.
7. **Instruções iniciais:** “Descubra onde pedir informação sobre iluminação no bairro de exemplo. Vamos conferir o canal e as opções de atendimento. Não será aberto um pedido real.”
8. **Interações:** identificar necessidade; consultar diretório conhecido da cidade fictícia; comparar destinos sem abrir URLs; selecionar página pertinente ao serviço; localizar atendimento e horário; guardar cartão-resumo de canal digital e alternativa presencial; revisar.
9. **Tipo:** navegação guiada em catálogo de serviços, com seleção por finalidade e organização de informação.
10. **Conclusão:** canal corresponde à referência e ao problema, resumo reúne horário e alternativa; logomarca, posição patrocinada ou terminação de endereço isoladas não são prova suficiente.
11. **Feedback adequado:** “Você encontrou o serviço pertinente e conferiu as formas de atendimento antes de fornecer qualquer informação.”
12. **Feedback de dificuldade:** “Esse cartão é uma intermediação e não consta como atendimento no diretório da simulação. Volte à referência e confira a finalidade.”
13. **Ajuda:** explicar necessidade, serviço e canal; indicar que atendimento presencial é opção legítima; nunca ensinar a reconhecer órgão apenas por brasão ou aparência.
14. **Repetição:** explorar novamente ou escolher outro serviço sintético de complexidade equivalente; sem penalização.
15. **Gamificação:** G1 caminho claro, G2 alternativa de atendimento e G3 feedback; futuro G4 privado, sem premiar preferência pelo canal digital.
16. **Eventos futuros:** base, E2 opcional; E3 `servico-pertinente`, `referencia-canal`, `resumo`; E7 após critério. Não registrar município real, endereço ou solicitação pessoal.
17. **Acessibilidade específica:** catálogo linear com rótulos claros, resumo textual e horários por extenso; alternativa presencial em texto, sem mapa ou imagem obrigatória.
18. **Complemento presencial:** simular pedido de orientação num balcão com cartões, sem acessar portais reais ou consultar cadastros.
19. **Software:** RS01–RS08; **RS-M15:** catálogo sintético com intermediação distinguível pela origem, referência independente e resumo recuperável; nenhum login ou protocolo de atendimento verdadeiro.
20. **Justificativa:** o serviço é tratado como meio de participação e escolha, não como obrigação de digitalização (adaptação de F1). Planejar o canal antes de agir relaciona contexto e decisão (F3).

### M16 — Planejar um atendimento de saúde simulado

1. **Código e título:** M16 — Planejar um atendimento de saúde simulado (B, contextualizada).
2. **Trilha e unidade:** Trilha 3; U08 — Serviços essenciais.
3. **Competência:** C8 — Serviços Essenciais e Cidadania Digital; DigComp 2.3/1.1/4.2.
4. **Objetivo observável:** organizar os passos para obter informação administrativa de atendimento, verificar canal e reconhecer o limite entre simulação e identificação pessoal.
5. **Situação cotidiana:** pessoa fictícia quer saber como marcar atendimento numa unidade de saúde de exemplo. Não há sintomas, diagnóstico, prontuário, urgência clínica ou dados de paciente.
6. **Conhecimentos prévios:** seleção de serviço em M15; recursos de retorno disponíveis.
7. **Instruções iniciais:** “Monte um plano para consultar as formas de atendimento da unidade de exemplo. Não informe documento ou dados de saúde. Nenhum agendamento será feito.”
8. **Interações:** abrir necessidade administrativa; escolher referência da simulação; localizar instruções gerais; ordenar passos por botões de posição; optar por canal digital ou apoio presencial compatível; parar no marco “identificação seria necessária num serviço real”; montar resumo dos próximos passos sem dados e revisar.
9. **Tipo:** planejamento contextual de fluxo com alternativas legítimas, sem formulário de paciente ou encaminhamento médico.
10. **Conclusão:** plano começa por canal confirmado, contém sequência viável e alternativa de apoio, e não tenta inserir informação pessoal na simulação; diferentes canais válidos são aceitos.
11. **Feedback adequado:** “Seu plano identifica o canal, a sequência e onde buscar apoio. Você reconheceu o momento em que sairíamos desta simulação.”
12. **Feedback de dificuldade:** “Esse caminho pede dados antes de confirmar o serviço. Volte à referência e organize a consulta às instruções gerais primeiro.”
13. **Ajuda:** explicar diferença entre conhecer o procedimento e realizar atendimento real; oferecer sequência exemplo de outro serviço; não recomendar condutas de saúde ou presumir regras universais de agendamento.
14. **Repetição:** reorganizar plano e explorar o outro canal sem perder reconhecimento da prática.
15. **Gamificação:** G2 escolhas equivalentes, G3 feedback e G5 ensaio de pedir orientação presencial, voluntário.
16. **Eventos futuros:** base, E2 opcional; E3 `canal`, `sequencia`, `limite-dados`; E7 após critério. Nenhum evento com serviço real procurado, dado de saúde, documento ou motivo de consulta.
17. **Acessibilidade específica:** passos ordenáveis por botões “Mover antes/depois”; leitura da ordem atual; sem calendário drag-and-drop, campos de documento ou mapa obrigatório.
18. **Complemento presencial:** ensaiar perguntas administrativas com papéis fictícios; se surgir demanda de saúde real, tratá-la fora da atividade por canais apropriados, sem registrá-la como dado pedagógico.
19. **Software:** RS01–RS08; **RS-M16:** fluxo para antes de qualquer cadastro; validar sequência por dependências, aceitando mais de uma ordem viável; nenhum pedido real de atendimento.
20. **Justificativa:** planejar um serviço de interesse cotidiano é proposta situada (F3), com alternativa presencial coerente com apoio à autonomia (F2). O cuidado de privacidade retoma F7 sem simular validação clínica.

### M17 — Escolher um aplicativo para uma necessidade

1. **Código e título:** M17 — Escolher um aplicativo para uma necessidade (A, guiada).
2. **Trilha e unidade:** Trilha 3; U09 — Aplicativos e permissões.
3. **Competência:** C9 — Gestão de Aplicativos e Permissões; DigComp 5.2/4.2.
4. **Objetivo observável:** comparar finalidade, origem e acessos declarados por aplicativos fictícios e escolher uma solução pertinente ou alternativa sem instalação com justificativa.
5. **Situação cotidiana:** organizar uma lista de leitura. Três fichas de aplicativo apresentam origem e recursos diferentes; uma opção pede contatos e localização sem relação aparente com a tarefa.
6. **Conhecimentos prévios:** relacionar finalidade e dado de M10; não pressupor experiência com loja de aplicativos.
7. **Instruções iniciais:** “Compare as opções para organizar uma lista de leitura. Veja para que servem e o que pedem para acessar. Nada será instalado no celular.”
8. **Interações:** selecionar objetivo; abrir ficha de origem e funcionalidades; examinar pedidos de acesso; relacionar permissões à tarefa; comparar pelo menos duas opções; escolher solução adequada de referência confirmada ou ferramenta já disponível no cenário; montar motivo por cartões.
9. **Tipo:** comparação orientada e escolha justificada de solução, sem loja ou instalação real.
10. **Conclusão:** escolha atende à necessidade e considera origem e acessos; justificar pela popularidade ou estrelas isoladamente não basta. Alternativa sem instalar é válida se cumpre o propósito.
11. **Feedback adequado:** “Você comparou a finalidade e os acessos e escolheu uma forma de organizar a lista sem permissões desnecessárias.”
12. **Feedback de dificuldade:** “Essa escolha atende à lista, mas pede acessos que não foram explicados. Abra a ficha e compare com outra opção antes de decidir.”
13. **Ajuda:** explicar diferença entre função, origem e permissão; lojas conhecidas reduzem alguns riscos, mas não garantem segurança; mostrar comparação de tarefa diferente.
14. **Repetição:** rever fichas e escolher outra solução coerente; sem obrigatoriedade de instalar ou manter escolha inicial.
15. **Gamificação:** G2 escolha da solução, G3 feedback e futuro G4 marco privado de decisão informada, sem recompensa por número de aplicativos.
16. **Eventos futuros:** base, E2 opcional; E3 `comparacao`, `finalidade-acessos`, `escolha-justificada`; E7 após critério. Sem lista de apps instalados ou preferências reais do aparelho.
17. **Acessibilidade específica:** fichas com estrutura e títulos consistentes; comparação linear alternativa à tabela; não depender de ícone, estrelas, marca ou vídeo de demonstração.
18. **Complemento presencial:** primeira parte do complemento da U09, cerca de 7 minutos: comparar fichas e, em maquete de aplicativos abertos, selecionar o catálogo fictício, usar “Encerrar aplicativo de exemplo” e reconhecer que a tela foi fechada; reabrir a representação. Distinguir encerramento, desinstalação e revogação de permissão: fechar não remove o app nem revoga acesso. A página web não encerra apps reais e o exercício não implica que fechar apps sempre melhora o aparelho.
19. **Software:** RS01–RS08; **RS-M17:** catálogo interno sem links de instalação, critérios que aceitam alternativas pertinentes e controles explícitos para comparar e rever; não acessar inventário de apps do dispositivo.
20. **Justificativa:** escolher tecnologia a partir da necessidade evita equiparar aprendizagem a acumular aplicativos (adaptação de F1). A comparação com justificativa é proposta de escolha apoiada (F2/F3).

### M18 — Revisar permissões em uma situação prática

1. **Código e título:** M18 — Revisar permissões em uma situação prática (B, contextualizada).
2. **Trilha e unidade:** Trilha 3; U09 — Aplicativos e permissões.
3. **Competência:** C9 — Gestão de Aplicativos e Permissões; DigComp 5.2/4.2.
4. **Objetivo observável:** configurar permissões simuladas segundo a finalidade, recusar acesso não necessário e rever autorização ao mudar a necessidade de uso.
5. **Situação cotidiana:** um aplicativo fictício de catálogo permite anexar foto de um livro; o cenário pede câmera nessa ação, mas também apresenta pedidos de contatos e localização sem necessidade. Nenhuma imagem real será capturada.
6. **Conhecimentos prévios:** relação finalidade/acesso de M17; orientação equivalente disponível.
7. **Instruções iniciais:** “Ajuste os acessos apenas no aplicativo de exemplo. Pense no que a tarefa precisa. Ao terminar, reveja as permissões. Seu aparelho não será alterado.”
8. **Interações:** identificar tarefa; abrir configurações internas simuladas; escolher câmera “somente durante o uso” para a ação ou alternativa de imagem interna sem câmera; recusar contatos/localização; revisar prévia; após a mudança para lista somente textual, revogar câmera ou optar por remover app na simulação; rever resultado.
9. **Tipo:** configuração contextual reversível, com revisão após mudança de finalidade.
10. **Conclusão:** escolhas correspondem ao caminho adotado, acessos desnecessários são recusados e autorização é revista no segundo contexto; negar tudo só conclui se a alternativa selecionada realiza a tarefa.
11. **Feedback adequado:** “Suas permissões acompanharam a necessidade. Você também revisou o acesso quando a tarefa mudou.”
12. **Feedback de dificuldade:** “A lista não precisa dos contatos. Volte a esse acesso e compare a finalidade antes de confirmar.”
13. **Ajuda:** explicar permitir/recusar/revogar e alternativa sem recurso; lembrar que telas reais variam e que este site não pode fazer os ajustes por você.
14. **Repetição:** testar configurações e desfazer sem efeitos no aparelho; não perder conclusão ao rever escolha.
15. **Gamificação:** G2 caminhos equivalentes, G3 feedback por finalidade e futuro G6 marco de revisão, sem prêmio por negar indiscriminadamente.
16. **Eventos futuros:** base, E2 opcional; E3 `permissoes-tarefa`, `previa`, `revisao-contexto`; E7 após critério. Não registrar permissões reais, câmera, localização, contatos ou arquivos.
17. **Acessibilidade específica:** controles com rótulos e estados anunciados; sem switch apenas colorido; imagem pronta com descrição; revisão por botões e foco estável.
18. **Complemento presencial:** segunda parte do mesmo complemento da U09, cerca de 8 minutos: em maquete, rever/revogar permissão e contrastar seu efeito com encerrar ou remover o aplicativo; confirmar cada estado em texto e retornar. Telas reais variam. Não inspecionar nem modificar apps, permissões ou câmera do telefone pessoal.
19. **Software:** RS01–RS08; **RS-M18:** estados de permissão exclusivamente internos e reversíveis; não chamar APIs do navegador/dispositivo; aceitar caminho sem câmera e testar revisão/revogação após mudança de finalidade.
20. **Justificativa:** a mudança de contexto exige reavaliar a própria decisão, em vez de decorar “aceitar” ou “negar” (F3). O desenho favorece escolha informada e controle (interpretação de F2), com tema de privacidade de F7.

### M19 — Pedir ajuda sem compartilhar segredos

1. **Código e título:** M19 — Pedir ajuda sem compartilhar segredos (A, guiada).
2. **Trilha e unidade:** Trilha 3; U10 — Ajuda e autonomia.
3. **Competência:** C10 — Autonomia e Busca de Ajuda Segura; DigComp 5.1/5.4/2.1.
4. **Objetivo observável:** descrever uma dificuldade em termos de tarefa e tela, escolher canal de apoio pertinente e formular pedido sem dados secretos.
5. **Situação cotidiana:** não localizar um arquivo numa biblioteca fictícia; aparecem propostas de mediador conhecido e de suposto suporte não solicitado que pede senha e controle remoto.
6. **Conhecimentos prévios:** retorno e reconhecimento de segredos; não exigir ter esgotado tentativas sozinho.
7. **Instruções iniciais:** “Você pode pedir ajuda. Conte o que tentou usando as frases de exemplo e escolha um apoio adequado. Não é preciso mostrar senha ou entregar o controle do aparelho.”
8. **Interações:** identificar o objetivo e a tela onde surgiu dificuldade; selecionar passos tentados por cartões; escolher apoio conhecido/confirmado; montar pedido com tarefa, tela e dúvida; remover oferta de senha sintética; revisar e simular solicitação sem envio externo.
9. **Tipo:** composição guiada de solicitação segura e escolha de apoio, não teste de resistência sem ajuda.
10. **Conclusão:** pedido descreve dificuldade suficiente para orientar apoio, usa canal pertinente e não inclui segredo nem autoriza acesso remoto de pessoa não confirmada.
11. **Feedback adequado:** “Seu pedido explica a dificuldade e preserva os segredos. Buscar apoio faz parte de agir com autonomia.”
12. **Feedback de dificuldade:** “Não precisamos de senha para explicar onde surgiu a dúvida. Retire essa parte e indique qual tarefa você queria realizar.”
13. **Ajuda:** roteiro “O que quero fazer? Onde parei? O que já tentei?”; orientar que confiança não implica compartilhar senha e que o HelpButton do protótipo não contata ninguém.
14. **Repetição:** revisar pedido ou trocar cenário sintético; sem marca negativa pelo número de pedidos de ajuda.
15. **Gamificação:** G3 reconhecimento do pedido bem formulado e G5 apoio presencial opcional; G4 futuro não distingue “melhor participante” por usar menos ajuda.
16. **Eventos futuros:** base, E2 opcional; E3 `descrever-dificuldade`, `canal-apoio`, `pedido-seguro`; E7 após critério. Nenhum texto livre de pedido, contato ou narrativa de problema pessoal.
17. **Acessibilidade específica:** frases prontas editáveis por seleção, leitura da prévia e alternativa de apontar cartões ao mediador; nenhuma necessidade de digitação longa ou fala gravada.
18. **Complemento presencial:** primeira parte do complemento da U10, cerca de 7 minutos: encenar pedido e resposta sem segredos; a pessoa escolhe abrir a ajuda, localizar a tela atual e o retorno, fechar a ajuda e retomar a tarefa em maquete. O colega orienta sem assumir a decisão. Não há solicitação real a suporte.
19. **Software:** RS01–RS08; **RS-M19:** compositor fechado e revisão de dados mínimos; “Simular pedido” não abre chat, e-mail ou suporte real; ajuda contextual continua disponível em todos os passos.
20. **Justificativa:** explicitar a dúvida transforma apoio em ação escolhida, com potencial de vínculo e competência (interpretação de F2). A mediação é proposta com atenção à heterogeneidade descrita no contexto de F5, sem pressupor dependência de toda pessoa idosa.

### M20 — Construir e experimentar um plano de autonomia

1. **Código e título:** M20 — Construir e experimentar um plano de autonomia (B, contextualizada).
2. **Trilha e unidade:** Trilha 3; U10 — Ajuda e autonomia.
3. **Competência:** C10 — Autonomia e Busca de Ajuda Segura; DigComp 5.1/5.4/2.1.
4. **Objetivo observável:** elaborar plano de aprendizagem com propósito, passos, limite de segurança e apoio; experimentar um passo e revisar o plano diante de dificuldade introduzida na simulação.
5. **Situação cotidiana:** personagem escolhe aprender a organizar uma lista de leitura ou localizar atividade cultural; uma informação está ausente durante o ensaio e exige decidir como prosseguir com cuidado.
6. **Conhecimentos prévios:** pedido de ajuda de M19 e recursos pertinentes ao tema escolhido; retomada das orientações sempre disponível.
7. **Instruções iniciais:** “Escolha um objetivo de exemplo e prepare um plano. Experimente um passo. Se faltar informação, revise o caminho ou peça apoio. Não é preciso fazer tudo sozinho.”
8. **Interações:** escolher tema entre contextos equivalentes; montar passos por cartões; acrescentar condição de parar/verificar e apoio seguro; executar miniensaio de um passo; diante de lacuna, escolher revisar a busca ou pedir ajuda sem segredo; atualizar plano e rever o que faria depois.
9. **Tipo:** planejamento com ensaio e revisão contextual; não basta selecionar “quero continuar aprendendo”.
10. **Conclusão:** plano tem propósito, passos viáveis, limite e canal de apoio; um passo é experimentado e o plano é revisado coerentemente após a lacuna. Recorrer a apoio não reduz o reconhecimento.
11. **Feedback adequado:** “Você experimentou um passo e ajustou seu plano quando faltou informação. Seu caminho inclui cuidado e apoio quando necessário.”
12. **Feedback de dificuldade:** “O plano ainda não indica o que fazer se a informação faltar. Acrescente um passo de verificação ou ajuda e retome o ensaio.”
13. **Ajuda:** modelo de plano de outro tema, explicação de limite de segurança e alternativas de apoio; lembrar que o plano não precisa conter hábito, objetivo íntimo ou dado pessoal.
14. **Repetição:** experimentar o outro contexto ou refazer plano, sem cobrança de rotina, streak ou perda por pausa.
15. **Gamificação:** G2 escolha, G3 feedback, G5 troca voluntária e futuro G6 marco simbólico de percurso praticado; nunca certificado de autonomia geral ou aprovação na pesquisa.
16. **Eventos futuros:** base, E2 opcional; E3 `plano`, `ensaio`, `revisao-com-apoio`; E7 após critério. Não inferir interesse pessoal, coletar metas livres ou produzir escore de autonomia.
17. **Acessibilidade específica:** passos por botões em lista linear, possibilidade de revisar sem arrastar; resumo completo em texto e manutenção do foco; miniensaio com alternativa equivalente para cada modalidade.
18. **Complemento presencial:** segunda parte do mesmo complemento da U10, cerca de 8 minutos: ensaiar rota com abertura equivocada em maquete, identificar tela atual, voltar à unidade/início por controle nomeado e retomar objetivo; se persistir a dúvida, formular pedido seguro e rever o plano com apoio. Explicar plano por personagem, se desejar; reflexão pessoal permanece privada e não é entregue à pesquisa.
19. **Software:** RS01–RS08; **RS-M20:** plano e ensaio associados por regras explícitas, com lacuna autoral recuperável; validar revisão e apoio, sem texto pessoal, persistência, exportação automática ou inferência de domínio.
20. **Justificativa:** objetivo escolhido, ensaio e revisão propõem continuidade de aprendizagem em situação significativa (F3). Apoio é parte da autonomia, não seu oposto; essa interpretação de F2 orienta o design, sem afirmar que a missão mede o construto psicológico.

## Dependências antes da implementação

Revisão dos vinte roteiros: campos 4 e 8–13 mantêm ações, critérios, feedbacks e ajuda observáveis; campo 17 especifica alternativas; campo 14 e convenções comuns preservam repetição sem prazo. Nos pares em que os novos conteúdos exigiriam ampliar o núcleo da missão, optou-se por complemento presencial explícito. Nenhum título foi substituído. Transformar Wi-Fi, brilho, volume, áudio/imagem, busca administrativa de saúde ou encerramento de apps em critérios novos do motor constitui proposta de ampliação, registrada na matriz para aprovação. T0/T1/T2, SUS, IMI e entrevistas seguem o protocolo, fora desses critérios e sem alteração de pontuação ou momento de aplicação.

Revisar todos os títulos, enunciados, distratores, caminhos equivalentes e feedbacks com o pesquisador; confirmar que os cenários não reproduzem itens T0/T1/T2; resolver migração dos dados antigos; definir arquitetura do motor e testes de estados em etapa autorizada; inspecionar acessibilidade de cada interação; e separar autorização pedagógica de qualquer autorização de pesquisa/analytics. Nada nesta especificação habilita banco, autenticação, coleta, recompensas persistentes ou publicação.
