import { getMissionById } from './curriculum'
import type { InformationDefinition, InformationEvidence } from '../domain/missions/types'

const libraryEvidence: readonly InformationEvidence[] = [
  { id: 'origin', role: 'origin', title: 'Autoria e origem do recorte', source: 'Arquivo da Biblioteca Jardim — fictício', author: 'Equipe da Biblioteca Jardim — personagem coletivo', date: 'Edição de agosto de 2031', context: 'O recorte recebido foi retirado de uma publicação arquivada, não de um novo comunicado.', body: 'O aviso original tem autoria identificada. Isso identifica quem publicou o texto antigo, mas não prova que o fechamento se repete em outro ano.' },
  { id: 'date', role: 'date', title: 'Data completa e contexto original', source: 'Aviso integral arquivado — fictício', author: 'Equipe da Biblioteca Jardim — personagem coletivo', date: '20 de agosto de 2031', context: 'Transcrição integral do original: fechamento previsto para 21 de agosto de 2031.', body: '“Amanhã, 21 de agosto de 2031, a Biblioteca Jardim ficará fechada para manutenção.” A mensagem da conversa é de 20 de agosto de 2032. A data foi cortada do recorte; o original não informa fechamento em 2032.' },
  { id: 'reference', role: 'reference', title: 'Referência independente do bairro', source: 'Guia Comunitário Jardim — fictício', author: 'Equipe do guia comunitário — diferente da autoria do aviso', date: '19 de agosto de 2032', context: 'Guia autoral independente do recorte, referente ao mês da conversa.', body: 'O guia identifica a biblioteca e seus canais de atendimento, mas não informa se haverá fechamento em 21 de agosto de 2032. Não confirma nem contradiz o fechamento nesse dia. É preciso obter confirmação específica por um canal independente do encaminhamento.' },
]
const plantsEvidence: readonly InformationEvidence[] = [
  { id: 'origin', role: 'origin', title: 'Mensagem do contato conhecido', source: 'Grupo de exemplo — conversa fictícia', author: 'Contato conhecido — personagem fictício', date: '20 de agosto de 2032', context: 'Transcrição: “Recebi este aviso e estou repassando. Não falei com quem organiza.”', body: '“Vai ter distribuição de plantas neste domingo! Encaminhe para ninguém perder.” A proximidade do contato não confirma local, data ou realização. Não há declaração de confirmação pelo organizador.' },
  { id: 'repeat', role: 'repetition', title: 'Página que repete o aviso', source: 'Mural de jardinagem — fictício', author: 'Equipe do mural de exemplo', date: '20 de agosto de 2032', context: 'O rodapé diz: “Texto copiado da mensagem do grupo”.', body: 'A página repete a distribuição de plantas no domingo, sem apresentar outro documento ou contato com a organização. Não é confirmação independente: tem a mesma origem da mensagem recebida.' },
  { id: 'reference', role: 'reference', title: 'Comunicado da organização', source: 'Agenda da organização comunitária — fictícia', author: 'Equipe organizadora de exemplo', date: '20 de agosto de 2032', context: 'Canal da organização, independente do encaminhamento e da página que o copiou.', body: '“Estamos planejando uma distribuição de plantas. A data ainda não foi confirmada. Publicaremos dia e local quando estiverem definidos.” O comunicado não confirma o domingo e também não afirma que a atividade foi cancelada.' },
]
const feedback = {
  'evidence-opened': 'Evidência aberta. Compare autoria, data, contexto e o que o texto realmente permite concluir.',
  'investigate-first': 'Consulte todas as pistas indicadas antes de comparar. Ler apenas o aviso ou conhecer quem o enviou não confirma a alegação.',
  'comparison-ready': 'As fontes estão reunidas para comparação. Indique a condição da informação e os motivos apoiados nos textos.',
  'verdict-chosen': 'Interpretação selecionada. Ela ainda precisa ser justificada pelas evidências; você pode revisar.',
  'reason-chosen': 'Motivo alterado. Marque apenas o que as evidências permitem afirmar.',
  'not-proven-false': 'Falta de confirmação não prova falsidade. Não há evidência suficiente para afirmar que a situação atual foi contradita. Diferencie “não verificada” de “contradita”.',
  'verdict-evidence': 'Revise a interpretação. Confirmada exige evidência que sustente a alegação; contradita exige evidência incompatível com ela; não verificada indica que faltam elementos para decidir.',
  'reason-evidence': 'Confira os motivos marcados. Autoria, data, contexto e independência das fontes sustentam a análise; aparência, repetição ou proximidade do contato não bastam. Marque todos os motivos apoiados e desmarque os demais.',
  'conduct-chosen': 'Conduta selecionada. Prepare também uma resposta respeitosa com motivo e próximo passo.',
  'conduct-evidence': 'Não divulgue como fato uma alegação sem confirmação suficiente. Aguarde ou não encaminhe e explique o motivo; nenhuma opção provoca compartilhamento real.',
  'response-chosen': 'Resposta selecionada para a prévia. Ela não será enviada.',
  'respectful-response': 'A resposta precisa explicitar a incerteza sem acusar a pessoa. Falta de confirmação não permite dizer que tudo é mentira; revise a frase.',
  'next-step-chosen': 'Próximo passo selecionado. Consulte um canal independente do encaminhamento, sem usar dados reais nesta simulação.',
  'independent-next-step': 'Repetir o aviso ou repassá-lo a mais pessoas não cria confirmação independente. Prefira consultar a organização por um canal conhecido ou aguardar seu comunicado.',
  'review-ready': 'Esta é a revisão. Confira a interpretação, os motivos e, quando houver, a conduta e a resposta antes de concluir.',
  'review-acknowledged': 'Revisão confirmada para esta escolha. Você pode concluir ou voltar para corrigir.',
  'review-cleared': 'Revisão desmarcada. Confira novamente antes da decisão final simulada.',
  'review-first': 'Marque a confirmação de revisão antes de concluir. Apenas abrir a prévia não encerra a atividade.',
  'investigation-editable': 'Evidências disponíveis para nova consulta. Compare novamente antes de rever a decisão; a confirmação de revisão foi desfeita.',
  'decision-editable': 'Decisão editável com suas escolhas preservadas. Alterações exigem uma nova revisão.',
  'information-done': 'Investigação e decisão simulada concluídas com justificativa. Nada foi enviado ou publicado.',
  'previous-step': 'Você voltou para revisar. Confira novamente as evidências e escolhas da etapa atual.',
  'practice-resumed': 'Prática retomada com as escolhas preservadas nesta página.',
  'use-current-step': 'Use os controles da etapa atual. Você pode pedir ajuda ou voltar sem penalização.',
}
function definition(id: 'M07' | 'M08'): InformationDefinition {
  const approved = getMissionById(id)!
  const sharing = id === 'M08'
  return {
    id, unitId: 'U04', routeId: id.toLowerCase(), version: '0.1.0-u04.1', kind: 'information-check', mode: sharing ? 'sharing' : 'investigation',
    criteria: [{ id: 'investigated', label: 'Consultar autoria, data e referência e comparar as evidências' }, { id: 'justified', label: sharing ? 'Justificar interpretação, conduta e resposta respeitosa' : 'Justificar a síntese com evidências de autoria, data e contexto' }, { id: 'decided', label: 'Revisar e confirmar a decisão simulada' }],
    rules: { verdict: 'unverified', requiredEvidence: sharing ? ['origin', 'repeat', 'reference'] : ['origin', 'date', 'reference'], requiredReasons: sharing ? ['dependent', 'missing'] : ['author', 'old-date', 'context'], acceptedConduct: sharing ? ['wait', 'hold'] : [], acceptedResponses: sharing ? ['uncertain', 'not-yet'] : [], acceptedNextSteps: sharing ? ['organizer', 'await-source'] : [] },
    content: {
      title: approved.title, objective: approved.objective, introduction: approved.scenario,
      claim: sharing ? '“Vai ter distribuição de plantas neste domingo! Encaminhe para ninguém perder.”' : '“A biblioteca ficará fechada amanhã.”',
      received: sharing ? 'Mensagem de um contato conhecido no grupo fictício.' : 'Transcrição do recorte recebido: aviso de fechamento, com a data cortada. O texto integral pode ser consultado nas pistas.',
      reference: 'Conversa fictícia de 20 de agosto de 2032. Nenhuma notícia ou serviço real.',
      evidence: sharing ? plantsEvidence : libraryEvidence,
      reasons: sharing ? [
        { id: 'dependent', label: 'A página repete a mensagem; não é confirmação independente.' },
        { id: 'missing', label: 'A organização ainda não confirmou a data.' },
        { id: 'known', label: 'Conhecer o contato garante que a data está correta.' },
        { id: 'popular', label: 'Muitas repetições provam que a informação foi confirmada.' },
      ] : [
        { id: 'author', label: 'A autoria identificada pertence ao aviso arquivado, não a um novo comunicado.' },
        { id: 'old-date', label: 'A data integral é de 2031, anterior à conversa de 2032.' },
        { id: 'context', label: 'A referência independente não confirma o fechamento na data da conversa.' },
        { id: 'appearance', label: 'A aparência formal do aviso prova que vale para qualquer data.' },
      ],
      conduct: [{ id: 'share', label: 'Compartilhar como fato com o grupo' }, { id: 'wait', label: 'Buscar confirmação adicional, sem encaminhar agora' }, { id: 'hold', label: 'Não compartilhar enquanto faltar confirmação' }],
      responses: [{ id: 'uncertain', label: 'Agradeço o aviso. Ainda falta confirmação da data; prefiro aguardar.' }, { id: 'not-yet', label: 'Obrigado por lembrar do grupo. Não temos confirmação suficiente para divulgar como fato.' }, { id: 'hostile', label: 'Você só espalha mentiras. Não mande mais nada.' }, { id: 'assert-false', label: 'É tudo falso; a distribuição foi cancelada com certeza.' }],
      nextSteps: [{ id: 'organizer', label: 'Consultar a organização por um canal conhecido e independente do encaminhamento.' }, { id: 'await-source', label: 'Aguardar o comunicado da organização com dia e local confirmados.' }, { id: 'repeat-more', label: 'Encaminhar para mais pessoas para ver se alguém repete a data.' }],
      synthesis: sharing ? 'Ainda não verificada: repetição não é confirmação independente e a organização não confirmou a data. Não é possível afirmar que a atividade é falsa ou foi cancelada.' : 'Aviso antigo, não confirma fechamento atual. A autoria é do arquivo de 2031; a referência independente não esclarece o fechamento em 21 de agosto de 2032. A situação atual permanece não verificada.',
      instructions: ['Consulte as três pistas, em qualquer ordem, e compare o que cada fonte informa.', 'Escolha uma interpretação e marque os motivos apoiados pelas evidências.', sharing ? 'Prepare uma conduta e resposta respeitosas, revise e confirme somente na simulação.' : 'Revise sua síntese e confirme a investigação. Não é uma pergunta de verdadeiro ou falso.'],
      help: 'Pergunte: quem publicou, quando, em qual contexto e que fonte independente confirma? Imagem, áudio, cadeado ou conteúdo gerado por IA não provam autenticidade ou falsidade. Você pode rever as pistas sem penalização.',
      recognition: sharing ? 'Você evitou ampliar um aviso ainda não confirmado e explicou o cuidado ao grupo com respeito.' : 'Você encontrou a data e comparou o comunicado. O aviso antigo não confirma a situação atual.',
      steps: {
        investigate: { title: 'Investigue as pistas', instruction: 'Abra as três pistas e compare as fontes.', help: 'Consulte autoria, data completa e contexto. Duas páginas copiando o mesmo texto não são duas confirmações independentes. A ordem das pistas é livre.' },
        decide: { title: sharing ? 'Decida com base nas evidências' : 'Explique o que conseguiu verificar', instruction: sharing ? 'Indique a condição da informação, seus motivos e uma conduta com resposta respeitosa.' : 'Indique a condição da informação e marque os motivos sustentados nas pistas.', help: 'Compare os textos disponíveis. “Não verificada” é diferente de “contradita”. Na resposta, explique o limite das evidências e um próximo passo independente, sem hostilidade.' },
        review: { title: 'Revise antes de concluir', instruction: 'Confira sua interpretação e justificativa. Você pode voltar e corrigir.', help: 'Ler a prévia não conclui. Marque a revisão e confirme. Rever decisão ou evidências exige nova confirmação; nada será encaminhado.' },
        done: { title: 'Investigação concluída', instruction: 'A decisão foi simulada, sem envio ou publicação.', help: 'Você pode repetir e pedir ajuda sem penalização. Esta prática não atribui selo de especialista nem nota de pesquisa.' },
      }, feedback,
    },
  }
}
export const investigationMission = definition('M07')
export const responsibleSharingMission = definition('M08')
