import { accountProtectionMission, privacyPublicationMission } from './privacyMissions'
import { investigationMission, responsibleSharingMission } from './informationMissions'
import { queryMission, communityMission } from './searchMissions'
import type { MissionDefinition, NavigationDefinition, ReadingDefinition } from '../domain/missions/types'
import { messageMission, sharingMission } from './communicationMissions'
import { getMissionById, getUnitById, trails } from './curriculum'
import type { MissionId } from '../domain/curriculum'
import { missionPath, unitPath } from '../domain/curriculumPaths'

const approvedM01 = getMissionById('M01')!
const approvedM02 = getMissionById('M02')!
const approvedU01 = getUnitById('U01')!
const approvedTrail = trails.find((trail) => trail.id === approvedU01.trailId)!

const executionFeedback = {
  'previous-step': 'Você voltou para rever uma etapa. Os objetivos posteriores a esse ponto precisam ser praticados novamente; isso não é uma penalização.',
  'practice-resumed': 'Você retomou a prática no mesmo ponto, com os ajustes e objetivos preservados nesta página.',
}

export const demoUnit = {
  id: approvedU01.id, title: approvedU01.title, path: unitPath(approvedTrail, approvedU01),
  description: 'Duas práticas com telas fictícias para explorar caminhos e adaptar a leitura.',
  complement: 'Na atividade presencial complementar, Wi-Fi, brilho e volume serão explorados em maquetes ou aparelhos da equipe. Este site não conecta redes nem altera configurações do seu celular.',
} as const

export const navigationMission: NavigationDefinition = {
  id: 'M01', routeId: 'm01', unitId: 'U01', kind: 'navigation', version: '0.1.0-demo.2',
  rules: { targetApp: 'recados', detourApp: 'calendario' },
  criteria: [
    { id: 'open-target', label: 'Abrir os recados' },
    { id: 'recover-path', label: 'Recuperar o caminho' },
    { id: 'return-home', label: 'Retornar à tela inicial' },
  ],
  content: {
    title: approvedM01.title,
    objective: approvedM01.objective,
    introduction: approvedM01.scenario,
    instructions: ['Na tela fictícia, abra Recados do bairro.', 'Depois, vamos visitar o Calendário e recuperar o caminho até os recados.', 'Ao terminar, volte à tela inicial da simulação. Você pode tentar novamente e pedir ajuda.'],
    help: 'Use os botões da simulação, com toque ou teclado. O botão “Voltar à tela inicial da simulação” muda apenas esta tela de exemplo. Não é necessário usar controles físicos do celular.',
    recognition: 'Você praticou como encontrar os recados, recuperar um caminho e voltar ao início. Pode rever esta prática quantas vezes quiser.',
    apps: {
      recados: { title: 'Recados do bairro', body: 'Convite de exemplo: vamos nos encontrar para uma roda de leitura no Centro Comunitário.' },
      calendario: { title: 'Calendário', body: 'Esta é uma agenda fictícia. Nenhum compromisso foi criado ou alterado.' },
    },
    steps: {
      find: { title: 'Encontre os recados', instruction: 'Abra Recados do bairro na tela inicial da simulação.', help: 'Procure o botão com o nome “Recados do bairro”. Se entrar no Calendário, volte à tela inicial da simulação e escolha os recados.' },
      'return-first': { title: 'Volte para explorar outro caminho', instruction: 'Você encontrou o convite. Agora volte à tela inicial da simulação.', help: 'Use o botão “Voltar à tela inicial da simulação”, abaixo do recado. O convite continua disponível.' },
      detour: { title: 'Visite outra tela', instruction: 'Neste ensaio, abra o Calendário. Depois vamos retomar os recados.', help: 'Escolha “Calendário”. Esta visita é parte da prática de recuperação e não é um erro.' },
      recover: { title: 'Recupere o caminho até os recados', instruction: 'Volte à tela inicial da simulação e abra Recados do bairro novamente.', help: 'Se estiver no Calendário, use “Voltar à tela inicial da simulação”. Em seguida, escolha “Recados do bairro”. Nada foi perdido.' },
      'return-final': { title: 'Termine voltando ao início', instruction: 'Você retomou os recados. Volte à tela inicial da simulação para concluir.', help: 'O último passo é usar “Voltar à tela inicial da simulação”. Não há pressa.' },
      done: { title: 'Caminho praticado', instruction: 'Você concluiu os três objetivos desta prática.', help: 'Você pode repetir, começando de novo, ou voltar à unidade. O progresso existe apenas enquanto esta página estiver aberta.' },
    },
    feedback: {
      ...executionFeedback,
      'already-home': 'Você já está na tela inicial da simulação. Escolha o aplicativo indicado na orientação.',
      'visit-detour': 'Agora vamos praticar outro caminho: abra o Calendário e depois retome os recados.',
      'recover-target': 'Você voltou à tela inicial. Agora abra Recados do bairro novamente.',
      'navigation-done': 'Você retornou ao início depois de recuperar o caminho. Os três objetivos foram praticados.',
      'home-again': 'Você voltou ao início. Os recados continuam disponíveis para explorar.',
      'use-visible-controls': 'Use os controles da tela atual. Se precisar, volte à tela inicial da simulação.',
      'target-found': 'Você encontrou o convite nos recados. Agora use o retorno à tela inicial da simulação.',
      'detour-opened': 'Você abriu o Calendário como combinado. Agora volte e procure os recados novamente.',
      'path-recovered': 'Você recuperou o caminho e encontrou os recados. Falta apenas retornar à tela inicial da simulação.',
      'need-detour': 'Os recados estão disponíveis, mas neste ensaio vamos visitar o Calendário. Volte à tela inicial da simulação e abra o Calendário.',
      'wrong-app': 'Você abriu o Calendário. Nada foi perdido. Volte à tela inicial da simulação e procure Recados do bairro.',
    },
  },
}

export const readingMission: ReadingDefinition = {
  id: 'M02', routeId: 'm02', unitId: 'U01', kind: 'reading', version: '0.1.0-demo.2',
  rules: { correctLocationId: 'centro' },
  criteria: [
    { id: 'identify-difficulty', label: 'Reconhecer a dificuldade de leitura' },
    { id: 'apply-adjustment', label: 'Aplicar um ajuste pertinente' },
    { id: 'retrieve-information', label: 'Localizar a informação no convite' },
  ],
  content: {
    title: approvedM02.title,
    objective: approvedM02.objective,
    introduction: approvedM02.scenario,
    instructions: ['Identifique o que pode melhorar na leitura do convite.', 'Experimente texto ampliado ou modo de leitura. Brilho e volume são apenas representações nesta atividade.', 'Aplique a apresentação escolhida e encontre o local do encontro. Você pode desfazer os ajustes ou pedir ajuda.'],
    help: 'Tudo muda somente a prévia da atividade. Texto ampliado e modo de leitura são caminhos válidos; não há tamanho único obrigatório. O volume não aumenta as letras. O zoom do navegador continua disponível.',
    recognition: 'Você praticou como adaptar a leitura e encontrar uma informação. Rever os ajustes e pedir ajuda também fazem parte de aprender.',
    invitation: { title: 'Roda de leitura do bairro', date: 'Sábado, 21 de novembro — convite fictício', time: 'Às 15 horas', location: 'Salão de leitura do Centro Comunitário' },
    locations: [
      { id: 'praca', label: 'Coreto da Praça das Flores' },
      { id: 'centro', label: 'Salão de leitura do Centro Comunitário' },
      { id: 'biblioteca', label: 'Pátio da Biblioteca do Jardim' },
    ],
    steps: {
      difficulty: { title: 'Reconheça a dificuldade', instruction: 'Imagine que as letras do convite parecem pequenas. Qual dificuldade você quer resolver?', help: 'A necessidade descrita é ler o texto. Não é um teste da sua visão: a prévia e as instruções continuam legíveis.' },
      settings: { title: 'Experimente uma apresentação', instruction: 'Escolha texto ampliado ou modo de leitura e aplique os ajustes para voltar ao convite.', help: 'Você pode experimentar brilho e volume. Para letras pequenas, use texto ampliado ou modo de leitura. O brilho é uma representação de conforto; sozinho, não aumenta o texto.' },
      read: { title: 'Encontre o local do encontro', instruction: 'Leia o convite com a apresentação escolhida e indique onde será o encontro.', help: 'Procure o campo “Local” no convite. Se quiser rever a apresentação, use “Desfazer ajustes da prévia”. Depois, você poderá aplicá-los novamente.' },
      done: { title: 'Leitura praticada', instruction: 'Você adaptou a apresentação e localizou a informação.', help: 'É possível desfazer os ajustes visuais sem apagar a prática concluída, repetir toda a atividade ou voltar à unidade.' },
    },
    feedback: {
      ...executionFeedback,
      'identify-first': 'Primeiro identifique a dificuldade descrita na atividade. A ajuda está disponível.',
      'difficulty-sound': 'O cenário descreve letras pequenas. O volume pode ajudar com sons, mas não muda o tamanho do texto. Você pode rever sua escolha.',
      'difficulty-recognized': 'Você identificou uma necessidade de leitura. Agora experimente uma apresentação mais confortável.',
      'presentation-preview': 'A prévia mostra a apresentação escolhida. Quando estiver pronto, aplique os ajustes para voltar ao convite.',
      'brightness-preview': 'O brilho simulado está representado na prévia. Ele não altera o aparelho nem aumenta o tamanho das letras.',
      'volume-preview': 'O volume mudou apenas como representação. Esse controle não aumenta as letras e não reproduz som.',
      'needs-reading-adjustment': 'Brilho ou volume, sozinhos, não resolvem o tamanho do texto. Experimente texto ampliado ou modo de leitura e aplique novamente.',
      'reading-adjustment-applied': 'Você aplicou uma apresentação pertinente. Agora procure o local do encontro no convite.',
      'wrong-location': 'Esse local não corresponde ao convite. Consulte o campo “Local” e escolha novamente; os ajustes continuam disponíveis.',
      'reading-done': 'Você encontrou o local do encontro depois de adaptar a apresentação. A prática está concluída.',
      'adjustments-undone': 'A prévia voltou ao padrão. Você pode experimentar e aplicar outra apresentação antes de continuar.',
      'undo-after-completion': 'A prévia voltou ao padrão. A prática já concluída continua reconhecida nesta página.',
      'use-current-step': 'Siga a orientação do passo atual. A ajuda explica como continuar ou rever os ajustes.',
    },
  },
}

export const demoMissions: readonly MissionDefinition[] = [navigationMission, readingMission, messageMission, sharingMission, queryMission, communityMission, investigationMission, responsibleSharingMission, accountProtectionMission, privacyPublicationMission]
export const getDemoMission = (routeId: string | undefined) => demoMissions.find((mission) => mission.unitId === 'U01' && mission.routeId === routeId)
export const getMissionDefinition = (id: MissionId) => demoMissions.find((mission) => mission.id === id)
export const getOfficialMissionPath = (definition: MissionDefinition) => {
  const mission = getMissionById(definition.id)!
  const unit = getUnitById(definition.unitId)!
  const trail = trails.find((item) => item.id === unit.trailId)!
  return missionPath(trail, unit, mission)
}
