import type { MissionId, Trail, UnitId } from '../domain/curriculum'

// Base de implementação aprovada pelo pesquisador em 10/11/2026.
// Objetivos e cenários transcritos das fichas pedagógicas, sem execução nova.
export const trails: readonly Trail[] = [
  {
    "id": "T01",
    "slug": "primeiros-passos",
    "order": 1,
    "number": "01",
    "title": "Primeiros Passos no Mundo Digital",
    "description": "Conheça seu celular e descubra novas formas de se comunicar e aprender.",
    "theme": "green",
    "units": [
      {
        "id": "U01",
        "slug": "operacao-basica-do-celular",
        "order": 1,
        "trailId": "T01",
        "title": "Operação básica do celular",
        "description": "operar uma interface e ajustar a apresentação para realizar uma tarefa simples",
        "missions": [
          {
            "id": "M01",
            "slug": "encontrar-os-caminhos-da-tela",
            "order": 1,
            "unitId": "U01",
            "trailId": "T01",
            "mode": "guided",
            "status": "demonstration",
            "title": "Encontrar os caminhos da tela",
            "objective": "abrir um aplicativo fictício a partir da tela inicial, recuperar-se de uma abertura equivocada e retornar ao início usando controles nomeados.",
            "scenario": "localizar um convite no aplicativo fictício “Recados do bairro”; a pessoa abre “Calendário” por engano e precisa retomar o caminho, sem perda de dados."
          },
          {
            "id": "M02",
            "slug": "preparar-a-tela-para-ler-um-convite",
            "order": 2,
            "unitId": "U01",
            "trailId": "T01",
            "mode": "application",
            "status": "demonstration",
            "title": "Preparar a tela para ler um convite",
            "objective": "diante de texto pequeno numa simulação, escolher um ajuste de apresentação, aplicá-lo, voltar ao convite e localizar a informação solicitada.",
            "scenario": "o convite fictício para uma roda de leitura mostra local e horário em uma prévia de texto reduzido. A interface de instrução permanece legível; somente a prévia ilustra o problema."
          }
        ]
      },
      {
        "id": "U02",
        "slug": "comunicacao-digital",
        "order": 2,
        "trailId": "T01",
        "title": "Comunicação digital",
        "description": "comunicar e compartilhar conteúdo com destinatário e contexto adequados",
        "missions": [
          {
            "id": "M03",
            "slug": "preparar-uma-mensagem-para-o-grupo",
            "order": 3,
            "unitId": "U02",
            "trailId": "T01",
            "mode": "guided",
            "status": "demonstration",
            "title": "Preparar uma mensagem para o grupo",
            "objective": "compor um recado sintético pertinente ao grupo, conferir destinatário e revisar antes de simular envio.",
            "scenario": "confirmar participação num grupo fictício de leitura, sem divulgar contatos ou detalhes pessoais."
          },
          {
            "id": "M04",
            "slug": "compartilhar-o-arquivo-certo-com-a-pessoa-certa",
            "order": 4,
            "unitId": "U02",
            "trailId": "T01",
            "mode": "application",
            "status": "demonstration",
            "title": "Compartilhar o arquivo certo com a pessoa certa",
            "objective": "selecionar material pertinente, destino e mensagem de contexto, revisar a prévia e simular compartilhamento sem expor arquivo desnecessário.",
            "scenario": "enviar o programa de uma oficina fictícia a uma pessoa da equipe de leitura; a biblioteca de exemplo também contém imagem ilustrativa de documento, claramente sintética, que não deve ser enviada."
          }
        ]
      },
      {
        "id": "U03",
        "slug": "pesquisa-de-informacoes",
        "order": 3,
        "trailId": "T01",
        "title": "Pesquisa de informações",
        "description": "formular uma busca, selecionar e organizar informação pertinente para uma necessidade",
        "missions": [
          {
            "id": "M05",
            "slug": "transformar-uma-duvida-em-busca",
            "order": 5,
            "unitId": "U03",
            "trailId": "T01",
            "mode": "guided",
            "status": "demonstration",
            "title": "Transformar uma dúvida em busca",
            "objective": "construir uma consulta pertinente, refinar informação ausente e guardar um resultado relevante na coleção da simulação.",
            "scenario": "descobrir o horário de uma biblioteca fictícia do bairro, distinguindo uma agenda antiga do horário atual da instituição de exemplo."
          },
          {
            "id": "M06",
            "slug": "encontrar-uma-atividade-no-bairro",
            "order": 6,
            "unitId": "U03",
            "trailId": "T01",
            "mode": "application",
            "status": "demonstration",
            "title": "Encontrar uma atividade no bairro",
            "objective": "localizar atividade que atenda a condições dadas, comparar sua atualidade e organizar um resumo recuperável de local, dia e fonte.",
            "scenario": "uma pessoa fictícia procura oficina gratuita de jardinagem no sábado, em bairro determinado; resultados incluem outra cidade, evento passado e agenda pertinente."
          }
        ]
      }
    ]
  },
  {
    "id": "T02",
    "slug": "seguranca",
    "order": 2,
    "number": "02",
    "title": "Segurança e Pensamento Crítico",
    "description": "Aprenda a cuidar de suas informações e a olhar com atenção para o que recebe.",
    "theme": "clay",
    "units": [
      {
        "id": "U04",
        "slug": "desinformacao",
        "order": 4,
        "trailId": "T02",
        "title": "Desinformação",
        "description": "examinar fonte, data e evidências antes de decidir sobre compartilhamento",
        "missions": [
          {
            "id": "M07",
            "slug": "investigar-de-onde-veio-a-noticia",
            "order": 7,
            "unitId": "U04",
            "trailId": "T02",
            "mode": "guided",
            "status": "demonstration",
            "title": "Investigar de onde veio a notícia",
            "objective": "abrir evidências de autoria, data e fonte de um aviso e comparar a afirmação com um comunicado independente de referência.",
            "scenario": "mensagem de exemplo afirma que a biblioteca ficará fechada “amanhã”; a imagem usa aviso antigo e recorta a data."
          },
          {
            "id": "M08",
            "slug": "decidir-antes-de-compartilhar",
            "order": 8,
            "unitId": "U04",
            "trailId": "T02",
            "mode": "application",
            "status": "demonstration",
            "title": "Decidir antes de compartilhar",
            "objective": "confrontar uma alegação com evidências disponíveis, decidir não difundir informação não confirmada e preparar resposta respeitosa que explicite a incerteza.",
            "scenario": "num grupo fictício circula aviso de “distribuição de plantas neste domingo”; uma fonte reproduz outra sem comprovação, e o organizador não confirma data."
          }
        ]
      },
      {
        "id": "U05",
        "slug": "senhas-e-privacidade",
        "order": 5,
        "trailId": "T02",
        "title": "Senhas e privacidade",
        "description": "proteger acesso e dados pessoais em decisões simuladas",
        "missions": [
          {
            "id": "M09",
            "slug": "cuidar-da-senha-e-do-codigo-de-acesso",
            "order": 9,
            "unitId": "U05",
            "trailId": "T02",
            "mode": "guided",
            "status": "demonstration",
            "title": "Cuidar da senha e do código de acesso",
            "objective": "escolher uma estratégia de senha longa e exclusiva para uma conta fictícia, diferenciar senha de código adicional e completar um fluxo seguro sem transmitir segredo a interlocutor.",
            "scenario": "preparar acesso fictício à biblioteca; opções prontas contrastam reutilização, dado pessoal óbvio e frase longa sintética exclusiva. Depois, surge pedido de código por mensagem."
          },
          {
            "id": "M10",
            "slug": "escolher-o-que-pode-ser-compartilhado",
            "order": 10,
            "unitId": "U05",
            "trailId": "T02",
            "mode": "application",
            "status": "demonstration",
            "title": "Escolher o que pode ser compartilhado",
            "objective": "revisar um cartão fictício de divulgação, retirar informações pessoais desnecessárias e escolher público coerente com a finalidade.",
            "scenario": "divulgar convite público de uma oficina; o rascunho inclui endereço residencial e imagem sintética de documento, que não são necessários ao convite."
          }
        ]
      },
      {
        "id": "U06",
        "slug": "fraudes-digitais",
        "order": 6,
        "trailId": "T02",
        "title": "Fraudes digitais",
        "description": "reconhecer pressão fraudulenta e confirmar pedidos por canal independente",
        "missions": [
          {
            "id": "M11",
            "slug": "interromper-um-pedido-suspeito",
            "order": 11,
            "unitId": "U06",
            "trailId": "T02",
            "mode": "guided",
            "status": "demonstration",
            "title": "Interromper um pedido suspeito",
            "objective": "identificar pressão e pedido de segredo numa conversa fictícia, interromper a ação e escolher confirmação por canal independente.",
            "scenario": "suposto suporte solicita código para “evitar bloqueio da conta”. A urgência é descrita, sem relógio, alarme ou ameaça animada."
          },
          {
            "id": "M12",
            "slug": "conferir-um-pedido-de-pix-com-seguranca",
            "order": 12,
            "unitId": "U06",
            "trailId": "T02",
            "mode": "application",
            "status": "demonstration",
            "title": "Conferir um pedido de Pix com segurança",
            "objective": "responder a pedido financeiro inesperado interrompendo a transferência e planejando confirmação de identidade por contato prévio independente.",
            "scenario": "suposta pessoa conhecida, em “número novo”, pede Pix para compra urgente. Nome, conversa e valor são sintéticos; não há chave Pix ou formulário de pagamento."
          }
        ]
      },
      {
        "id": "U07",
        "slug": "links-maliciosos",
        "order": 7,
        "trailId": "T02",
        "title": "Links maliciosos",
        "description": "inspecionar endereços e escolher um caminho independente diante de um link suspeito",
        "missions": [
          {
            "id": "M13",
            "slug": "examinar-um-endereco-antes-de-abrir",
            "order": 13,
            "unitId": "U07",
            "trailId": "T02",
            "mode": "guided",
            "status": "demonstration",
            "title": "Examinar um endereço antes de abrir",
            "objective": "comparar o endereço apresentado com uma referência independente da simulação e decidir inspecionar ou buscar outro caminho quando não houver correspondência ou confirmação.",
            "scenario": "aviso usa nome da biblioteca, mas o endereço é `biblioteca-bairro.example`; o catálogo previamente conhecido indica `biblioteca.bairro.example`. Ambos são apenas texto sintético, sem navegação."
          },
          {
            "id": "M14",
            "slug": "sair-de-uma-mensagem-e-buscar-o-caminho-seguro",
            "order": 14,
            "unitId": "U07",
            "trailId": "T02",
            "mode": "application",
            "status": "demonstration",
            "title": "Sair de uma mensagem e buscar o caminho seguro",
            "objective": "interromper acesso proposto por mensagem suspeita e construir uma rota independente para conferir o assunto, recusando entrega de credenciais.",
            "scenario": "falso aviso de entrega de livro pede “atualização de acesso” por endereço encurtado; a pessoa pode consultar o catálogo conhecido de atendimento da biblioteca na simulação."
          }
        ]
      }
    ]
  },
  {
    "id": "T03",
    "slug": "cidadania",
    "order": 3,
    "number": "03",
    "title": "Cidadania e Autonomia Digital",
    "description": "Explore serviços, participe da vida em comunidade e amplie sua autonomia.",
    "theme": "blue",
    "units": [
      {
        "id": "U08",
        "slug": "servicos-essenciais",
        "order": 8,
        "trailId": "T03",
        "title": "Serviços essenciais",
        "description": "localizar serviço pertinente e planejar atendimento sem expor dados",
        "missions": [
          {
            "id": "M15",
            "slug": "encontrar-a-informacao-de-um-servico-essencial",
            "order": 15,
            "unitId": "U08",
            "trailId": "T03",
            "mode": "guided",
            "status": "demonstration",
            "title": "Encontrar a informação de um serviço essencial",
            "objective": "localizar informação de atendimento pertinente numa referência independente e organizar canal, horário e alternativa presencial antes de qualquer identificação.",
            "scenario": "consultar como solicitar reparo de iluminação pública numa cidade fictícia; anúncios e cartões de intermediação aparecem ao lado do diretório de serviços de exemplo."
          },
          {
            "id": "M16",
            "slug": "planejar-um-atendimento-de-saude-simulado",
            "order": 16,
            "unitId": "U08",
            "trailId": "T03",
            "mode": "application",
            "status": "demonstration",
            "title": "Planejar um atendimento de saúde simulado",
            "objective": "organizar os passos para obter informação administrativa de atendimento, verificar canal e reconhecer o limite entre simulação e identificação pessoal.",
            "scenario": "pessoa fictícia quer saber como marcar atendimento numa unidade de saúde de exemplo. Não há sintomas, diagnóstico, prontuário, urgência clínica ou dados de paciente."
          }
        ]
      },
      {
        "id": "U09",
        "slug": "aplicativos-e-permissoes",
        "order": 9,
        "trailId": "T03",
        "title": "Aplicativos e permissões",
        "description": "relacionar finalidade de aplicativo, permissões e necessidade de uso",
        "missions": [
          {
            "id": "M17",
            "slug": "escolher-um-aplicativo-para-uma-necessidade",
            "order": 17,
            "unitId": "U09",
            "trailId": "T03",
            "mode": "guided",
            "status": "demonstration",
            "title": "Escolher um aplicativo para uma necessidade",
            "objective": "comparar finalidade, origem e acessos declarados por aplicativos fictícios e escolher uma solução pertinente ou alternativa sem instalação com justificativa.",
            "scenario": "organizar uma lista de leitura. Três fichas de aplicativo apresentam origem e recursos diferentes; uma opção pede contatos e localização sem relação aparente com a tarefa."
          },
          {
            "id": "M18",
            "slug": "revisar-permissoes-em-uma-situacao-pratica",
            "order": 18,
            "unitId": "U09",
            "trailId": "T03",
            "mode": "application",
            "status": "demonstration",
            "title": "Revisar permissões em uma situação prática",
            "objective": "configurar permissões simuladas segundo a finalidade, recusar acesso não necessário e rever autorização ao mudar a necessidade de uso.",
            "scenario": "um aplicativo fictício de catálogo permite anexar foto de um livro; o cenário pede câmera nessa ação, mas também apresenta pedidos de contatos e localização sem necessidade. Nenhuma imagem real será capturada."
          }
        ]
      },
      {
        "id": "U10",
        "slug": "ajuda-e-autonomia",
        "order": 10,
        "trailId": "T03",
        "title": "Ajuda e autonomia",
        "description": "reconhecer dificuldade, pedir ajuda segura e planejar continuidade",
        "missions": [
          {
            "id": "M19",
            "slug": "pedir-ajuda-sem-compartilhar-segredos",
            "order": 19,
            "unitId": "U10",
            "trailId": "T03",
            "mode": "guided",
            "status": "demonstration",
            "title": "Pedir ajuda sem compartilhar segredos",
            "objective": "descrever uma dificuldade em termos de tarefa e tela, escolher canal de apoio pertinente e formular pedido sem dados secretos.",
            "scenario": "não localizar um arquivo numa biblioteca fictícia; aparecem propostas de mediador conhecido e de suposto suporte não solicitado que pede senha e controle remoto."
          },
          {
            "id": "M20",
            "slug": "construir-e-experimentar-um-plano-de-autonomia",
            "order": 20,
            "unitId": "U10",
            "trailId": "T03",
            "mode": "application",
            "status": "demonstration",
            "title": "Construir e experimentar um plano de autonomia",
            "objective": "elaborar plano de aprendizagem com propósito, passos, limite de segurança e apoio; experimentar um passo e revisar o plano diante de dificuldade introduzida na simulação.",
            "scenario": "personagem escolhe aprender a organizar uma lista de leitura ou localizar atividade cultural; uma informação está ausente durante o ensaio e exige decidir como prosseguir com cuidado."
          }
        ]
      }
    ]
  }
]

export const getTrailBySlug = (slug: string | undefined) => trails.find((trail) => trail.slug === slug)
export const getUnitById = (id: UnitId) => trails.flatMap((trail) => trail.units).find((unit) => unit.id === id)
export const getMissionById = (id: MissionId) => trails.flatMap((trail) => trail.units.flatMap((unit) => unit.missions)).find((mission) => mission.id === id)
