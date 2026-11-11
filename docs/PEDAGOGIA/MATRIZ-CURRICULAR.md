# Matriz curricular — base aprovada de implementação

Estado vigente após U05: M01–M10 executáveis; M11–M20 informativas. Fichas e currículo aprovado preservados. [Implementação e limites U05](../AVALIACAO/VERIFICACAO-U05.md). Os avisos anteriores abaixo são históricos.

Estado vigente após U04: M01–M08 executáveis; M09–M20 informativas. Fichas, competências, IDs e metadados aprovados preservados. [Conferência da Trilha 1 e verificação U04](../AVALIACAO/VERIFICACAO-U04.md). Os avisos de escopo anteriores abaixo são históricos.

Estado vigente: execução autorizada de M01–M06, com U03 documentada em [VERIFICACAO-U03](../AVALIACAO/VERIFICACAO-U03.md). M07–M20 continuam informativas. Fichas e currículo aprovado preservados; os avisos de execução anteriores abaixo são históricos.

Atualização de execução: M01–M04 agora estão autorizadas nas rotas oficiais. M05–M20 permanecem informativas. Títulos, objetivos, cenários e campos das fichas foram preservados; ver [verificação U02](../AVALIACAO/VERIFICACAO-U02.md). Os avisos de escopo anterior abaixo são históricos.

Data: 10 de novembro de 2026. Artefato `0.1.0-dev`. **Títulos, objetivos e cenários aprovados como base oficial de implementação**, com refinamentos antes de v1.0.0. Migração registrada no [histórico](HISTORICO-MIGRACAO-CURRICULAR.md). Autorização posterior integrou somente M01/M02 às rotas oficiais, sem alterar a base; ver [motor](../ARQUITETURA/MOTOR-DE-MISSOES.md). Não é homologação, validação ou autorização para demais missões.

## Inspeção e divergências registradas antes de qualquer migração

Foram lidos AGENTS.md, README, ROADMAP, DECISOES-DSR, DESIGN-SYSTEM, `src/domain/curriculum.ts` e `src/data/curriculum.ts`. A estrutura numérica é compatível (3 trilhas, 3/4/3 unidades e duas missões por unidade), mas os temas, a ordem e parte dos objetivos diferem do pedido de 10/11/2026. Os instrumentos T0/T1/T2 não foram encontrados no repositório. Em esclarecimento nesta sessão, o pesquisador forneceu os nomes e a numeração definitivos das dez competências, adotados abaixo.

Decisão anterior: documentar a estrutura U01–U10/M01–M20 sem migrar antes da autorização. Essa autorização foi recebida nesta etapa. Os códigos agora são IDs estáveis do domínio, separados dos títulos/slugs; não são aliases posicionais dos IDs anteriores. O quadro abaixo registra as diferenças históricas, resolvidas por conteúdo no histórico da migração.

| Unidade proposta | Situação no aplicativo existente | Divergência / tratamento proposto |
| --- | --- | --- |
| U01 Operação básica do celular | `conhecendo-o-celular`: botões/tela e gestos; `conexoes-e-ajustes`: Wi-Fi e ajustes | M01 mantém navegação e M02 mantém leitura. Wi-Fi, brilho e volume têm prática explícita no complemento presencial da U01; sem excluir objetivos antigos ou ampliar automaticamente o motor |
| U02 Comunicação digital | `comunicacao` reúne mensagens e busca | Separar comunicação de busca; compartilhamento de arquivo é ampliação proposta |
| U03 Pesquisa de informações | Busca é a segunda missão de `comunicacao`; busca comunitária está em `participacao` | Criar par A/B de busca e uso contextual; não renomear IDs existentes automaticamente |
| U04 Desinformação | `informacoes` é a terceira unidade de segurança | Reordenar apenas na proposta; preservar objetivos antigos de origem e comparação |
| U05 Senhas e privacidade | `senhas` cobre senha/segunda etapa; `privacidade` cobre dados/permissões | Reagrupar senha e código em A, exposição de dados em B; permissões passam à proposta U09 |
| U06 Fraudes digitais | `golpes` cobre suspeita e confirmação por outro canal | Especificar decisão e confirmação em dois cenários simulados, incluindo pedido de Pix |
| U07 Links maliciosos | Não há unidade própria | Lacuna explícita: novas tarefas de inspeção e recuperação segura; exige aprovação antes de migração |
| U08 Serviços essenciais | `servicos`: identificação de serviço e atendimento | Correspondência temática parcial; cenário de saúde e tarefa de serviço comunitário são fictícios |
| U09 Aplicativos e permissões | Permissões estão em `privacidade`; não há unidade de escolha de aplicativo | Reorganização e ampliação propostas, sem controlar o dispositivo real |
| U10 Ajuda e autonomia | `aprender-sempre`: interesse e plano; `participacao`: convivência/comunidade | Preservar intenção de aprendizagem ao longo da vida. Ajuda segura torna-se ação central; convivência atravessa as propostas U02/U10, sem alegar equivalência literal |

Os títulos/objetivos e IDs anteriores estão preservados em [CURRICULO-ANTERIOR.json](CURRICULO-ANTERIOR.json). A [fonte atual](../../src/data/curriculum.ts) usa os valores aprovados. O [relatório de divergências](DIVERGENCIAS-CURRICULARES.md) mantém o diagnóstico histórico e remete à resolução. Wi-Fi é cobertura obrigatória explicitada no complemento presencial, sem missão autônoma no novo par.

## Competências oficiais e objetivos educacionais propostos

**A numeração 1–10 e os nomes abaixo reproduzem a lista definitiva fornecida pelo pesquisador nesta sessão.** Fonte primária informada: tese, Apêndice 3, *Teste Prático e Objetivo de Conhecimento Tecnológico (T0, T1 e T2)*, páginas 82–83 do PDF. Fonte de implementação informada: Documento de Requisitos do Trilhas 60+ v3.0, seção 4, páginas 5–6. Esses originais não estavam disponíveis no repositório e não foram inspecionados. A lista fornecida é suficiente para fixar o conteúdo curricular; a não sobreposição com os itens depende de conferência posterior dos originais. C1–C10, quando usados nas fichas, são apenas abreviações documentais de “Competência 1” a “Competência 10”, não novos identificadores de instrumento. As competências do projeto não se confundem com as 21 competências do DigComp.

Os números DigComp abaixo remetem às competências da página oficial da edição 3.0; a tradução resumida e a associação ao currículo são interpretações de design, não correspondência certificada. U01 trabalha condições operacionais para aprender, sem equiparar domínio de gestos a proficiência DigComp. O escopo seleciona algumas competências e não cobre integralmente o framework. [F1](#referências-e-limites-da-fundamentação)

| Competência oficial — objetivo educacional proposto | Referência DigComp 3.0 | Trilha / unidade obrigatória | A: guiada | B: contextualizada |
| --- | --- | --- | --- | --- |
| **1. Operação Básica e Resolução de Problemas** — operar uma interface e ajustar a apresentação para realizar uma tarefa simples | 5.1, 5.2 | 1 · U01 Operação básica do celular | M01 Encontrar os caminhos da tela | M02 Preparar a tela para ler um convite |
| **2. Comunicação e Colaboração Digital** — comunicar e compartilhar conteúdo com destinatário e contexto adequados | 2.1, 2.2, 2.5 | 1 · U02 Comunicação digital | M03 Preparar uma mensagem para o grupo | M04 Compartilhar o arquivo certo com a pessoa certa |
| **3. Pesquisa e Gestão de Informação** — formular uma busca, selecionar e organizar informação pertinente para uma necessidade | 1.1, 1.2, 1.3 | 1 · U03 Pesquisa de informações | M05 Transformar uma dúvida em busca | M06 Encontrar uma atividade no bairro |
| **4. Avaliação Crítica da Informação (Desinformação)** — examinar fonte, data e evidências antes de decidir sobre compartilhamento | 1.2, 2.2 | 2 · U04 Desinformação | M07 Investigar de onde veio a notícia | M08 Decidir antes de compartilhar |
| **5. Segurança Digital (Senhas e Privacidade)** — proteger acesso e dados pessoais em decisões simuladas | 4.1, 4.2 | 2 · U05 Senhas e privacidade | M09 Cuidar da senha e do código de acesso | M10 Escolher o que pode ser compartilhado |
| **6. Prevenção contra Fraudes (Engenharia Social)** — reconhecer pressão fraudulenta e confirmar pedidos por canal independente | 4.1, 4.2 | 2 · U06 Fraudes digitais | M11 Interromper um pedido suspeito | M12 Conferir um pedido de Pix com segurança |
| **7. Prevenção contra Links Maliciosos (Phishing)** — inspecionar endereços e escolher um caminho independente diante de um link suspeito | 1.2, 4.1 | 2 · U07 Links maliciosos | M13 Examinar um endereço antes de abrir | M14 Sair de uma mensagem e buscar o caminho seguro |
| **8. Serviços Essenciais e Cidadania Digital** — localizar serviço pertinente e planejar atendimento sem expor dados | 2.3, 1.1, 4.2 | 3 · U08 Serviços essenciais | M15 Encontrar a informação de um serviço essencial | M16 Planejar um atendimento de saúde simulado |
| **9. Gestão de Aplicativos e Permissões** — relacionar finalidade de aplicativo, permissões e necessidade de uso | 5.2, 4.2 | 3 · U09 Aplicativos e permissões | M17 Escolher um aplicativo para uma necessidade | M18 Revisar permissões em uma situação prática |
| **10. Autonomia e Busca de Ajuda Segura** — reconhecer dificuldade, pedir ajuda segura e planejar continuidade | 5.1, 5.4, 2.1 | 3 · U10 Ajuda e autonomia | M19 Pedir ajuda sem compartilhar segredos | M20 Construir e experimentar um plano de autonomia |

São dez objetivos educacionais de trabalho, vinte tarefas e dez pares A/B. A ordem é recomendação pedagógica, não bloqueio de navegação. Conhecimentos prévios servem ao planejamento de apoio; não são exames de acesso.

## Organização dos encontros

Decisão metodológica atualizada: turma de 20–30 pessoas idosas; doze encontros semanais de aproximadamente 60 minutos (10 acolhimento/contextualização + 30 micromissões/mediação + 15 complemento presencial + 5 síntese). U01–U10 nas semanas 1–10, revisão integrada na 11 e consolidação na 12. Cada M01–M20 está estimada em 5–10 minutos, sem relógio ou corte da atividade; orientação, pausas e revisão usam a margem do bloco mediado. A duração é organização do encontro, não medida de desempenho.

## Cobertura explícita das habilidades

O quadro distingue o núcleo das missões das ações presenciais propostas para completar a cobertura sem sobrecarga. Referências CP-Uxx abaixo identificam apenas complementos presenciais, não competências ou missões adicionais. Cada complemento ocupa **um único bloco de cerca de 15 minutos por unidade**, compartilhado pelos campos 18 das suas duas fichas; não são 15 minutos para cada missão. Habilidades estão especificadas, mas a adequação da carga e a aprendizagem não foram validadas.

| Unidade / competência oficial | Cobertura nas missões (5–10 min cada) | Complemento presencial e ação verificável | Situação / pendência |
| --- | --- | --- | --- |
| U01 · 1 | M01: abrir, errar caminho e recuperar; M02: ajuste de leitura e recuperação de informação. Ajuda relaciona dificuldade ao pedido de apoio | **CP-U01, 15 min:** Wi-Fi 5 min: localizar controle, escolher rede fictícia indicada, conferir estado textual e pedir apoio se informação indisponível; brilho 3 min: mudar prévia representada e desfazer; volume 3 min: mudar estado simulado com áudio sintético/transcrição; recuperação/síntese 4 min. Maquete ou aparelho da equipe sem conexão/configuração real | Cobertura explícita de Wi-Fi, brilho, volume e navegação. Preservados núcleos M01/M02. Aprovar materiais/carga; levar novos critérios ao motor exigiria aprovação específica |
| U02 · 2 | M03: mensagens/frases e áudio sintético opcional com transcrição; M04: arquivo/destino/prévia/compartilhamento | **CP-U02, 15 min:** áudio 7 min: selecionar, reproduzir/pausar e revisar; imagem 8 min: escolher imagem pública sintética, ler descrição/legenda, conferir destinatário e compartilhar na maquete. Sem gravação, contatos ou galeria pessoal | Mensagem, áudio, imagem e compartilhamento explícitos. Alternativa textual deve ser equivalente; não avaliar audição ou identificação visual |
| U03 · 3 | M05: busca/refinamento/coleção; M06: relevância, data/local e lembrete | **CP-U03, 15 min:** consulta administrativa sobre horário de serviço de saúde fictício (7 min); comparar autoria/data/pertinência com referência independente, selecionar, guardar e recuperar informação/fonte (8 min) | Busca e avaliação, inclusive serviço de saúde, explícitas. Não são aconselhamento clínico, acesso real ou reprodução de teste; revisar materiais |
| U04 · 4 | M07: autoria/data/contexto e comparação; M08: fontes independentes, incerteza e decisão de compartilhar | **CP-U04, 15 min:** comparar aviso antigo e atual em cartões (7 min), explicar confiabilidade/limite das evidências e ensaiar resposta respeitosa (8 min) | Cobertura explícita; não reduzir confiabilidade a aparência ou repetição da mensagem |
| U05 · 5 | M09: estratégia de senha e código adicional; M10: finalidade/público e privacidade | **CP-U05, 15 min:** comparar estratégias de acesso (7 min) e revisar divulgação sintética retirando dados desnecessários (8 min), explicando a decisão | Cobertura explícita; nenhum segredo real ou dado de participante |
| U06 · 6 | M11: pressão, interrupção e canal independente; M12: pedido suspeito de Pix sem pagamento | **CP-U06, 15 min:** ensaiar interrupção respeitosa (7 min) e montar confirmação por contatos fictícios previamente conhecidos (8 min) | Cobertura explícita; sem pedido de relato de fraude, chave Pix ou prejuízo real |
| U07 · 7 | M13: inspecionar destino comparando referência; M14: interromper preenchimento e recuperar caminho independente | **CP-U07, 15 min:** comparar endereços autorais não navegáveis (7 min), reconstruir rota de verificação e justificar não compartilhar credencial (8 min) | Cobertura explícita de phishing/links; aparência/HTTPS não certificam confiança |
| U08 · 8 | M15: diretório de serviço público e informação de atendimento; M16: sequência administrativa de atendimento de saúde simulado | **CP-U08, 15 min:** simular consulta de canal/horário num balcão (7 min), ordenar passos de atendimento e reconhecer limite antes de identificação (8 min) | Acesso simulado a informação pública e de saúde explícito; sem login, documento, prontuário ou agendamento |
| U09 · 9 | M17: escolher app por finalidade/origem/acessos; M18: ajustar/revogar permissões de acordo com contexto | **CP-U09, 15 min:** localizar app aberto, encerrar e reabrir em maquete (7 min); contrastar encerrar, remover e revogar permissão (8 min). Cada pessoa reconhece o estado resultante | Gerenciamento, encerramento e permissões explícitos. Fechar não desinstala nem revoga acesso; sem promessa de acelerar aparelho ou controle real pelo site |
| U10 · 10 | M19: ajuda segura e descrição da dificuldade; M20: plano, ensaio e revisão com apoio | **CP-U10, 15 min:** abrir ajuda, identificar posição e fechar/retomar (7 min); recuperar abertura equivocada por retorno nomeado, retomar objetivo e pedir apoio se necessário (8 min) | Ajuda e recuperação segura explícitas; não confundir autonomia com agir sem apoio |

Nas dez linhas, confirmar materiais, equivalência de modalidade, capacidade de mediação da turma e suficiência de tempo antes da intervenção. Não há lacuna de habilidade obrigatória sem local de trabalho explicitado; há pendência de revisão/validação das atividades. Somente M01/M02 são executáveis nas rotas oficiais; os complementos presenciais não foram convertidos em motor.

## Propostas de revisão que exigem aprovação

**PR01:** incorporar Wi-Fi/brilho/volume como objetivos e critérios adicionais dentro de M01/M02, em vez da distribuição presencial acima. **PR02:** tornar áudio/imagem tarefas obrigatórias no núcleo de M03/M04. **PR03:** trocar o cenário de biblioteca/oficina de M05/M06 por serviço de saúde. **PR04:** acrescentar encerramento de app como condição obrigatória de M17/M18. **PR05:** alterar critérios centrais de M19/M20 para exigir nova rota de recuperação. Essas ampliações não foram aplicadas às fichas centrais nem a `src/data`; os complementos oferecem cobertura proposta sem substituir títulos, cenários ou critérios existentes. A tabela de divergências detalha as recomendações de migração, todas pendentes de aprovação.

## Organização didática e gamificação — regras comuns

Cada A apresenta um problema, uma demonstração opcional, prática acompanhada e feedback. Cada B muda o contexto e exige produzir uma decisão ou configuração e justificá-la por opções significativas, com ajuda disponível. A retirada de orientação é gradual e reversível; apoio não invalida a conclusão didática. Repetição não gera punição e não exige esperar outro dia.

| Código | Elemento proposto | Limite |
| --- | --- | --- |
| G1 | Objetivo claro e passos com nomes | Não usar cronômetro ou premiar rapidez |
| G2 | Escolha de contexto, modalidade e nível de ajuda | Escolhas equivalentes precisam atender ao mesmo objetivo |
| G3 | Feedback que explica a decisão e permite revisar | Sem humilhação, vidas perdidas ou desconto por erro |
| G4 | Reconhecimento individual do percurso, futuramente privado | Sem contagens fictícias agora; conclusão de prática não prova domínio da competência |
| G5 | Troca presencial opcional e colaboração | Sem exposição pública de erros ou comparação de participantes |
| G6 | Marco simbólico descritivo, opcional e futuro | Sem valor material, dependência de velocidade, prêmio por frequência ou atribuição nesta etapa |

Essas são hipóteses de design da equipe. A relação proposta com autonomia, competência e pertencimento se inspira em F2; o uso de elementos de jogo deve ser testado no contexto e não tratado como motivação garantida (F4).

## Ensino, avaliação e segurança

Conclusão didática significa executar os passos definidos na ficha da missão, com repetição e apoio permitidos. Não há nota. “Pausar”, “ver ajuda” e “pedir mediação” não contam como fracasso; isoladamente também não comprovam conclusão. O motor inicial M01/M02 valida critérios e mantém somente estado/eventos de teste em memória; não declara independência nem avalia autonomia a partir de cliques. Distinções de apoio e registros para pesquisa permanecem decisões futuras, sem coleta nesta fase.

T0/T1/T2 permanecem instrumentos independentes, fora do motor. Conforme informado pelo pesquisador, preveem dez tarefas, pontuação de 0 a 2 por item, total máximo de 20 pontos e formas equivalentes nos três momentos. Essas regras não foram alteradas nem transferidas para as práticas. A revisão de não sobreposição de cenários deverá ser feita por responsável com acesso aos instrumentos, sem copiar seus itens para estes documentos. A correspondência às dez competências fornecidas é explícita; a equivalência de formas, validade e sensibilidade do instrumento não foram verificadas nesta etapa.

Todos os nomes, mensagens, arquivos, portais e códigos das atividades são sintéticos. Interfaces de senha, Pix, saúde, aplicativos e permissões são simulações. Não acessar microfone, câmera, contatos, arquivos ou configurações reais. Exemplos de URLs usam domínios reservados `.example` e não serão links navegáveis; aparência de endereço ou cadeado não certifica confiança. Nenhuma tarefa solicita dado pessoal, segredo ou transação real. Práticas de segurança propostas se apoiam em fontes institucionais F6/F7, sem prometer ausência de riscos.

## Referências e limites da fundamentação

Fontes consultadas em 10/11/2026. As fichas usam F1–F8 para remeter a este registro; cada escolha concreta de tarefa é uma proposta dos autores do artefato.

- **F1 — DigComp 3.0.** Cosgrove, J.; Cachia, R. (2025). *DigComp 3.0: European Digital Competence Framework*. JRC144121. [Registro bibliográfico](https://publications.jrc.ec.europa.eu/repository/handle/JRC144121) e [competências e níveis na página oficial JRC](https://joint-research-centre.ec.europa.eu/scientific-activities/key-competences-lifelong-learning/digital-competence-framework-digcomp/digcomp-30_en). A edição contempla 21 competências em cinco áreas e quatro níveis. Aqui se propõem tarefas simples com orientação disponível; não se atribui nível certificado. Foram conferidos os descritores da página oficial; não se transcreveram resultados de aprendizagem numerados do PDF, cuja obtenção falhou nesta sessão.
- **F2 — Teoria da Autodeterminação.** Ryan, R. M.; Deci, E. L. (2000). *Self-Determination Theory and the Facilitation of Intrinsic Motivation, Social Development, and Well-Being*. American Psychologist, 55(1), 68–78. [Artigo dos autores](https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf). A teoria orienta a atenção às necessidades de autonomia, competência e vínculo; as escolhas de interface e apoio aqui são interpretações para este projeto, ainda não avaliadas.
- **F3 — Aprendizagem situada.** Brown, J. S.; Collins, A.; Duguid, P. (1989). *Situated Cognition and the Culture of Learning*. Educational Researcher, 18(1), 32–42. [Texto disponibilizado pelo autor](https://people.ischool.berkeley.edu/~duguid/articles/Situated_Learning.htm). Inspira o vínculo entre saber e agir em atividades socialmente significativas. Cenários simulados não garantem transferência ao mundo real.
- **F4 — Gamificação.** Sailer, M.; Hense, J. U.; Mayr, S. K.; Mandl, H. (2017). *How gamification motivates: An experimental study of the effects of specific game design elements on psychological need satisfaction*. Computers in Human Behavior, 69, 371–380. [Registro do artigo](https://www.sciencedirect.com/science/article/pii/S074756321630855X). Referência ao estudo de configurações de elementos e necessidades psicológicas, sem extrapolar resultados a pessoas idosas. Nesta sessão foi consultado o resumo indexado; o texto integral não estava acessível. Não constitui evidência de eficácia deste artefato.
- **F5 — Educação digital de pessoas idosas.** *Digital Literacy Training for Low-Income Older Adults Through Undergraduate Community-Engaged Learning: Single-Group Pretest-Posttest Study* (2024). [Artigo original em JMIR Aging](https://aging.jmir.org/2024/1/e51675/). O estudo descreve formação mediada, prática e feedback em contexto próprio. Serve como referência empírica complementar de desenho, não como validação causal do Trilhas 60+ ou regra universal sobre o público 60+.
- **F6 — Segurança.** Banco Central do Brasil. [Dicas gerais para evitar golpes](https://www.bcb.gov.br/meubc/faqs/p/dicas-gerais-para-evitar-golpes). Orienta o cuidado com pedidos inesperados e confirmação independente. Conteúdo consultado pelo resultado indexado; página depende de JavaScript. Não se implementa atendimento bancário ou procedimento de devolução neste currículo.
- **F7 — Privacidade.** ANPD. [Guia orientativo: como proteger seus dados pessoais](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_como_proteger_seus_dados_pessoais). Fonte institucional para revisão dos cuidados com dados; instruções concretas de cada missão são propostas de simulação, não parecer jurídico.
- **F8 — Acessibilidade.** W3C. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) e [sistema de design local](../DESIGN-SYSTEM.md). Referência de implementação/inspeção; não há alegação de conformidade integral.

## Revisões remanescentes antes da homologação

1. A adoção da matriz e a migração de metadados estão aprovadas e executadas. Refinamentos substantivos posteriores devem ser registrados e revisados antes de v1.0.0; não reabrir a aprovação já fornecida.
2. Conferir os objetivos propostos frente aos originais indicados e realizar revisão independente de não sobreposição dos cenários, mantendo os nomes e números definitivos fornecidos.
3. Aprovar linguagem, carga e critérios didáticos das vinte fichas, incluindo alternativas acessíveis equivalentes.
4. Aprovar o roteiro de encontros e a posição de avaliações externas conforme protocolo vigente.
5. Rever elementos simbólicos e feedback com a equipe pedagógica antes de implementá-los.
6. Definir necessidade, base ética, minimização, retenção e governança de qualquer Learning Analytics futuro. Aprovação pedagógica não autoriza coleta.
