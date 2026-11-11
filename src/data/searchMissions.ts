import { getMissionById } from './curriculum'
import type { SearchDefinition, SearchResult } from '../domain/missions/types'

const libraryResults: readonly SearchResult[] = [
  { id: 'other', title: 'Biblioteca do bairro Lago Azul', description: 'Horários em outro bairro.', origin: 'Agenda Lago Azul — fictícia', updated: '2 de agosto de 2032', originDetail: 'Agenda da biblioteca Lago Azul, em outro bairro. A autoria não resolve a diferença de localização.', dateDetail: 'Edição do mês de referência, mas de outro bairro.', location: 'Bairro Lago Azul', day: 'Segunda a sexta', cost: 'Gratuito', body: 'Atendimento das 9h às 17h, no bairro Lago Azul.', issue: 'elsewhere' },
  { id: 'old', title: 'Horário da Biblioteca Jardim — edição antiga', description: 'Arquivo de uma agenda anterior.', origin: 'Biblioteca Jardim — agenda fictícia', updated: '3 de agosto de 2031', originDetail: 'Arquivo da mesma biblioteca, mantido como registro histórico.', dateDetail: 'Publicação de um ano antes do mês de referência. Não informa o horário vigente.', location: 'Bairro Jardim', day: 'Segunda a sexta', cost: 'Gratuito', body: 'Horário antigo: das 10h às 16h. Consulte a edição do mês de referência antes de planejar a visita.', issue: 'outdated' },
  { id: 'partial', title: 'Conheça a Biblioteca Jardim', description: 'Apresentação sem horário de atendimento.', origin: 'Mural comunitário — fictício', updated: 'Data de atualização não informada', originDetail: 'Mural sem responsável identificado nem referência para o horário.', dateDetail: 'Sem data de atualização: não é possível determinar a vigência.', location: 'Bairro Jardim', day: 'Não informado', cost: 'Gratuito', body: 'Há livros e rodas de leitura. O horário de atendimento não está informado.', issue: 'incomplete' },
  { id: 'current', title: 'Biblioteca Jardim — horário de agosto', description: 'Horário de atendimento no bairro Jardim.', origin: 'Biblioteca Jardim — agenda fictícia', updated: '2 de agosto de 2032', originDetail: 'Agenda identificada da Biblioteca Jardim. Compare também assunto, bairro e vigência; aparência institucional não é garantia isolada.', dateDetail: 'Edição de agosto de 2032, o mês de referência desta simulação.', location: 'Bairro Jardim', day: 'Segunda a sexta', cost: 'Gratuito', body: 'Em agosto de 2032, atendimento de segunda a sexta, das 8h às 18h, na Biblioteca Jardim, bairro Jardim.', issue: 'current' },
]
const workshopResults: readonly SearchResult[] = [
  { id: 'other', title: 'Jardinagem no município de Vale Verde', description: 'Oficina gratuita, mas em outra cidade.', origin: 'Agenda Vale Verde — fictícia', updated: '2 de agosto de 2032', originDetail: 'Agenda identificada de outro município. A origem não atende ao bairro solicitado.', dateDetail: 'Edição do mês de referência. Data recente não corrige a localização inadequada.', location: 'Vale Verde — outra cidade', day: 'Sábado, 21 de agosto de 2032', cost: 'Gratuito', body: 'Oficina de jardinagem, às 9h, na praça de Vale Verde.', issue: 'elsewhere' },
  { id: 'old', title: 'Oficina de jardinagem — encontro encerrado', description: 'Atividade do ano anterior no bairro Jardim.', origin: 'Centro Comunitário Jardim — fictício', updated: '1 de agosto de 2031', originDetail: 'Arquivo do Centro Comunitário Jardim, com autoria e local identificados.', dateDetail: 'Encontro encerrado em agosto de 2031. O mês de referência é agosto de 2032.', location: 'Centro Comunitário Jardim', day: 'Sábado, 23 de agosto de 2031', cost: 'Gratuito', body: 'Arquivo: oficina realizada em agosto de 2031. Não há inscrição ou novo encontro nesta publicação.', issue: 'outdated' },
  { id: 'partial', title: 'Jardinagem para a comunidade', description: 'Convite sem dia, custo ou endereço completo.', origin: 'Mural sem autoria identificada — fictício', updated: 'Data de atualização não informada', originDetail: 'Não indica responsável ou referência verificável. Não deduza confiabilidade pela apresentação.', dateDetail: 'Não há data para conferir a atualidade.', location: 'Endereço não informado', day: 'Não informado', cost: 'Não informado', body: 'Participe de uma oficina de jardinagem. Faltam dia, local completo e custo.', issue: 'incomplete' },
  { id: 'current', title: 'Jardinagem no Centro Comunitário Jardim', description: 'Oficina gratuita no sábado, no bairro Jardim.', origin: 'Centro Comunitário Jardim — agenda fictícia', updated: '2 de agosto de 2032', originDetail: 'Agenda atribuída ao Centro Comunitário Jardim, com referência ao programa de agosto do próprio centro. Nesta simulação ambos os textos são autorais, não verificação externa. Compare autoria com data e condições.', dateDetail: 'Programa de agosto de 2032. Encontro previsto para sábado, 21 de agosto de 2032, às 9h, dentro do mês de referência.', location: 'Centro Comunitário Jardim', day: 'Sábado, 21 de agosto de 2032, às 9h', cost: 'Gratuito', body: 'Oficina gratuita de jardinagem no Centro Comunitário Jardim, bairro Jardim, sábado, 21 de agosto de 2032, às 9h. O programa do mês confirma local, dia e gratuidade. Nenhuma inscrição real será feita.', issue: 'current' },
]
const feedback = {
  term: 'Palavras alteradas. A busca só acontece quando você aciona Pesquisar na simulação.',
  empty: 'Escolha pelo menos uma palavra para pesquisar. Não é preciso digitar.',
  generic: 'Revise as palavras para manter o assunto e o bairro do pedido. Use Refinar busca para acrescentar o que falta ou remover outro assunto; compare os resultados novamente.',
  specific: 'A consulta contém assunto e contexto. Abra e compare os resultados: uma consulta específica também pode trazer informação antiga ou incompleta.',
  refine: 'Você pode acrescentar ou remover palavras e pesquisar novamente. As escolhas anteriores não valem para a nova busca.',
  opened: 'Detalhes abertos abaixo dos resultados. Compare o conteúdo com o pedido, a origem e a data.',
  origin: 'Origem consultada. Autoria ou aparência institucional, sozinhas, não garantem que a informação atenda ao pedido.',
  date: 'Referência de data aberta. Compare com agosto de 2032, o mês fictício desta atividade, e não com a data de hoje.',
  'open-first': 'Abra os detalhes do resultado antes de escolhê-lo.',
  outdated: 'Essa informação pertence a uma edição anterior. Confira a data e procure a edição do mês de referência; você pode tentar novamente.',
  incomplete: 'Faltam dados para atender ao pedido. Uma apresentação atraente não substitui dia, local e fonte identificada.',
  elsewhere: 'Esse resultado é de outro local. Compare o bairro solicitado com o local informado.',
  selected: 'Resultado escolhido. Você ainda precisa organizar, guardar e reabrir a informação.',
  'select-first': 'Abra e escolha um resultado que responda ao pedido antes de organizar.',
  'compare-first': 'Abra pelo menos três resultados para comparar as informações, inclusive as diferenças de local, data e fonte.',
  compared: 'Quadro comparativo aberto. Compare tema, local, dia, custo, origem e atualização antes de escolher.',
  'verify-first': 'Compare pelo menos três resultados e consulte Origem e Atualidade nos detalhes da atividade escolhida.',
  organize: 'Confira o resultado antes de guardar. Tudo fica somente na coleção desta página.',
  reminder: 'Cartão do lembrete alterado. Confira se ele corresponde ao resultado escolhido.',
  'reminder-wrong': 'O lembrete precisa preservar dia, local e fonte da atividade escolhida. Consulte os detalhes acima e revise os cartões.',
  saved: 'Resultado guardado na coleção temporária. Use Reabrir resultado guardado para conferir se consegue recuperá-lo.',
  'save-first': 'Guarde o resultado antes de tentar recuperá-lo.',
  edit: 'Você voltou aos resultados. A organização anterior foi descartada; escolha e confira novamente.',
  'search-done': 'Você pesquisou, escolheu uma informação pertinente e recuperou o resultado guardado nesta simulação.',
  'previous-step': 'Você voltou para rever a etapa. Confira novamente as escolhas antes de guardar.',
  'practice-resumed': 'Prática retomada com as escolhas preservadas nesta página.',
  'use-current-step': 'Use os controles da etapa atual. A ajuda permanece disponível e você pode voltar sem penalização.',
}
function definition(id: 'M05' | 'M06'): SearchDefinition {
  const approved = getMissionById(id)!
  const guided = id === 'M05'
  const results = guided ? libraryResults : workshopResults
  const current = results.find(r => r.id === 'current')!
  return {
    id, unitId: 'U03', routeId: id.toLowerCase(), version: '0.1.0-u03.1', kind: 'search', mode: guided ? 'guided' : 'contextual',
    criteria: [{ id: 'query', label: 'Pesquisar com assunto e contexto suficientes' }, { id: 'selected', label: guided ? 'Escolher um resultado pertinente' : 'Comparar resultados e verificar origem e atualidade' }, { id: 'recovered', label: 'Organizar, guardar e recuperar a informação' }],
    rules: { requiredTerms: guided ? ['horario', 'biblioteca', 'bairro'] : ['jardinagem', 'bairro'], relevantId: 'current', comparisonCount: guided ? 0 : 3 },
    content: {
      title: approved.title, objective: approved.objective, introduction: approved.scenario,
      request: guided ? 'Descubra o horário da Biblioteca Jardim, no bairro Jardim, no mês de referência.' : 'Encontre uma oficina gratuita de jardinagem, no bairro Jardim, no sábado, 21 de agosto de 2032, às 9h.',
      reference: 'Mês de referência: agosto de 2032. Datas, locais e fontes são inventados e não descrevem serviços reais.',
      terms: guided ? [{ id: 'horario', label: 'horário' }, { id: 'biblioteca', label: 'biblioteca' }, { id: 'bairro', label: 'bairro Jardim' }, { id: 'outro', label: 'receita de bolo' }] : [{ id: 'jardinagem', label: 'oficina de jardinagem' }, { id: 'bairro', label: 'bairro Jardim' }, { id: 'sabado', label: 'sábado' }, { id: 'outro', label: 'receita de bolo' }],
      results, genericIds: ['other', 'old', 'partial'], specificIds: guided ? ['old', 'partial', 'current'] : ['other', 'old', 'partial', 'current'],
      reminder: {
        day: [{ id: 'old', label: 'Agosto de 2031 — edição anterior' }, { id: 'correct', label: current.day }],
        location: [{ id: 'other', label: 'Vale Verde — outra cidade' }, { id: 'correct', label: current.location }],
        origin: [{ id: 'partial', label: 'Mural sem autoria identificada' }, { id: 'correct', label: current.origin }],
      },
      instructions: ['Monte a consulta com os cartões de palavras e pesquise somente nesta simulação.', guided ? 'Abra resultados, refine a consulta se faltar contexto e escolha a informação que atende ao pedido.' : 'Abra pelo menos três resultados, compare-os e confira origem e atualidade da atividade escolhida.', 'Organize, guarde e reabra a informação na coleção temporária. Não há limite de tempo.'],
      help: 'Use apenas as palavras e informações de exemplo. Nenhuma busca sai desta página. Você pode voltar, pedir ajuda e repetir sem penalização.',
      recognition: guided ? 'Sua busca ficou mais específica. Você encontrou o horário e guardou a informação para consultar novamente.' : 'Você comparou as opções e guardou os dados da oficina que atende ao pedido. A fonte ficou junto do lembrete.',
      steps: {
        query: { title: 'Monte sua busca', instruction: 'Escolha palavras que expressem o pedido e acione Pesquisar na simulação.', help: 'Em uma busca por uma feira, “feira” é amplo; acrescentar assunto e bairro ajuda. Use Adicionar ou Remover, sem arrastar.' },
        results: { title: 'Compare os resultados', instruction: guided ? 'Abra os detalhes e escolha a informação útil. Se faltar contexto, refine a busca.' : 'Abra três resultados, compare e confira origem e atualidade da atividade escolhida.', help: 'A primeira posição não prova qualidade. Compare assunto, bairro e data. Na oficina, confira também dia e gratuidade; use Comparar resultados e as opções Origem e Atualidade.' },
        collection: { title: 'Guarde para consultar novamente', instruction: guided ? 'Confira o resultado, guarde e reabra na coleção temporária.' : 'Monte o lembrete com dia, local e fonte; guarde e reabra para conferir.', help: 'O lembrete deve corresponder aos detalhes escolhidos. Guardar não encerra: reabra para recuperar a informação. Sair descarta a coleção.' },
        done: { title: 'Informação recuperada', instruction: 'O resultado foi recuperado da coleção desta página.', help: 'Você pode repetir sem penalização. Esta coleção desaparece ao sair; não é um favorito do navegador.' },
      }, feedback,
    },
  }
}
export const queryMission = definition('M05')
export const communityMission = definition('M06')
