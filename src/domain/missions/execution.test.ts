import { describe, expect, it } from 'vitest'
import { navigationMission, readingMission } from '../../data/demoMissions'
import { createExecution, EVENT_LIMIT, reduceExecution } from './execution'
import type { ActivityAction, ExecutionState, MissionDefinition, NavigationAction } from './types'

const ready = (definition: MissionDefinition) => reduceExecution(reduceExecution(createExecution(definition), { type: 'start-mission' }, definition), { type: 'start-activity' }, definition)
const act = (state: ExecutionState, action: ActivityAction, definition: MissionDefinition) => reduceExecution(state, { type: 'activity', action }, definition)
const navigationPath: readonly NavigationAction[] = [
  { kind: 'navigation', type: 'open-app', appId: 'recados' },
  { kind: 'navigation', type: 'go-home' },
  { kind: 'navigation', type: 'open-app', appId: 'calendario' },
  { kind: 'navigation', type: 'go-home' },
  { kind: 'navigation', type: 'open-app', appId: 'recados' },
  { kind: 'navigation', type: 'go-home' },
]
const finishNavigation = () => navigationPath.reduce((state, action) => act(state, action, navigationMission), ready(navigationMission))
const adjustedReading = (presentation: 'enlarged' | 'reading' = 'enlarged') => {
  let state = ready(readingMission)
  state = act(state, { kind: 'reading', type: 'identify-difficulty', difficulty: 'text' }, readingMission)
  state = act(state, { kind: 'reading', type: 'set-presentation', presentation }, readingMission)
  return act(state, { kind: 'reading', type: 'apply-settings' }, readingMission)
}

describe('Estado de execução em memória', () => {
  it('não registra abertura nem conclui apenas por renderização ou por tentar pular a apresentação', () => {
    const state = createExecution(navigationMission)
    expect(state.events).toEqual([])
    expect(state.activity.criteria).toEqual([])
    expect(reduceExecution(state, { type: 'start-activity' }, navigationMission)).toBe(state)
    expect(act(state, navigationPath[0], navigationMission)).toBe(state)
  })

  it('separa início da missão e da prática e não duplica eventos por ação de início repetida', () => {
    const initial = createExecution(navigationMission)
    const started = reduceExecution(initial, { type: 'start-mission' }, navigationMission)
    expect(started.phase).toBe('instructions')
    expect(started.events.map((event) => event.type)).toEqual(['mission_started'])
    expect(reduceExecution(started, { type: 'start-mission' }, navigationMission)).toBe(started)
    const activity = reduceExecution(started, { type: 'start-activity' }, navigationMission)
    expect(activity.phase).toBe('activity')
    expect(activity.events.at(-1)?.type).toBe('step_started')
    expect(initial.phase).toBe('presentation')
  })

  it('ajuda não muda critérios ou fase e usa somente códigos autorais', () => {
    const before = ready(readingMission)
    const after = reduceExecution(before, { type: 'help' }, readingMission)
    expect(after.activity).toBe(before.activity)
    expect(after.phase).toBe(before.phase)
    expect(after.events.at(-1)).toMatchObject({ type: 'help_requested', source: 'local-demo', missionId: 'M02', step: 'difficulty' })
  })

  it('ignora ações de outra modalidade e definição de missão incompatível', () => {
    const state = ready(navigationMission)
    expect(act(state, { kind: 'reading', type: 'apply-settings' }, navigationMission)).toBe(state)
    expect(reduceExecution(state, { type: 'help' }, readingMission)).toBe(state)
  })

  it('registra erro e nova tentativa sem desconto e reconhece a conclusão uma vez', () => {
    let state = ready(navigationMission)
    state = act(state, { kind: 'navigation', type: 'open-app', appId: 'calendario' }, navigationMission)
    expect(state.activity.criteria).toHaveLength(0)
    expect(state.awaitingRetry).toBe(true)
    state = act(state, { kind: 'navigation', type: 'go-home' }, navigationMission)
    expect(state.events.some((event) => event.type === 'new_attempt')).toBe(true)
    state = navigationPath.reduce((current, action) => act(current, action, navigationMission), state)
    expect(state.phase).toBe('completed')
    expect(state.activity.criteria).toHaveLength(3)
    expect(state.events.filter((event) => event.type === 'mission_completed')).toHaveLength(1)
    expect(act(state, navigationPath[0], navigationMission)).toBe(state)
  })

  it('repete voluntariamente com estado limpo, preservando somente o histórico temporário de teste', () => {
    const completed = finishNavigation()
    const repeated = reduceExecution(completed, { type: 'repeat' }, navigationMission)
    expect(repeated.phase).toBe('presentation')
    expect(repeated.activity.criteria).toHaveLength(0)
    expect(repeated.feedback).toBeNull()
    expect(repeated.attempt).toBe(2)
    expect(repeated.events.at(-1)?.type).toBe('mission_restarted')
    expect(createExecution(navigationMission).events).toHaveLength(0)
  })

  it('limita os eventos em memória, sem horário, resposta bruta ou identidade', () => {
    let state = createExecution(navigationMission)
    for (let index = 0; index < EVENT_LIMIT + 5; index++) state = reduceExecution(state, { type: 'help' }, navigationMission)
    expect(state.events).toHaveLength(EVENT_LIMIT)
    expect(new Set(state.events.map((event) => event.sequence)).size).toBe(EVENT_LIMIT)
    expect(Object.keys(state.events[0]).sort()).toEqual(['attempt', 'definitionVersion', 'missionId', 'schemaVersion', 'sequence', 'source', 'step', 'type', 'unitId'])
    expect(state.events[0]).toMatchObject({ unitId: 'U01', definitionVersion: navigationMission.version, schemaVersion: 2, attempt: 1 })
  })
})

describe('M01: critérios de navegação', () => {
  it('exige abrir recados, recuperar via início após Calendário e só então retornar ao início', () => {
    let state = ready(navigationMission)
    state = act(state, navigationPath[0], navigationMission)
    expect(state.activity.criteria).toEqual(['open-target'])
    state = act(state, navigationPath[1], navigationMission)
    expect(state.activity.criteria).not.toContain('return-home')
    for (const action of navigationPath.slice(2, 5)) state = act(state, action, navigationMission)
    expect(state.phase).toBe('activity')
    expect(state.activity.criteria).toEqual(['open-target', 'recover-path'])
    state = act(state, navigationPath[5], navigationMission)
    expect(state.phase).toBe('completed')
    expect(state.activity).toMatchObject({ screen: 'home', appId: null, step: 'done' })
  })

  it('permite explorar o aplicativo errado e retornar sem apagar o progresso', () => {
    let state = ready(navigationMission)
    state = act(state, { kind: 'navigation', type: 'open-app', appId: 'calendario' }, navigationMission)
    expect(state.feedback?.code).toBe('wrong-app')
    expect(state.activity).toMatchObject({ screen: 'app', appId: 'calendario', step: 'find' })
    state = act(state, { kind: 'navigation', type: 'go-home' }, navigationMission)
    state = act(state, navigationPath[0], navigationMission)
    expect(state.activity.criteria).toEqual(['open-target'])
  })

  it('não aceita abrir um app de dentro de outro nem inventar destino', () => {
    let state = act(ready(navigationMission), navigationPath[0], navigationMission)
    state = act(state, { kind: 'navigation', type: 'open-app', appId: 'calendario' }, navigationMission)
    expect(state.activity).toMatchObject({ appId: 'recados', step: 'return-first' })
    state = act(state, { kind: 'navigation', type: 'go-home' }, navigationMission)
    state = act(state, { kind: 'navigation', type: 'open-app', appId: 'inexistente' }, navigationMission)
    expect(state.activity).toMatchObject({ screen: 'home' })
  })
})

describe('M02: ajuste pertinente e informação recuperada', () => {
  it.each(['enlarged', 'reading'] as const)('aceita %s sem impor um tamanho numérico único', (presentation) => {
    let state = adjustedReading(presentation)
    expect(state.phase).toBe('activity')
    expect(state.activity.criteria).toEqual(['identify-difficulty', 'apply-adjustment'])
    state = act(state, { kind: 'reading', type: 'select-location', locationId: 'centro' }, readingMission)
    expect(state.phase).toBe('completed')
    expect(state.activity.criteria).toHaveLength(3)
  })

  it('identifica a dificuldade e permite rever uma escolha de som sem penalização', () => {
    let state = ready(readingMission)
    state = act(state, { kind: 'reading', type: 'identify-difficulty', difficulty: 'sound' }, readingMission)
    expect(state.activity.criteria).toHaveLength(0)
    expect(state.feedback?.code).toBe('difficulty-sound')
    state = act(state, { kind: 'reading', type: 'identify-difficulty', difficulty: 'text' }, readingMission)
    expect(state.activity).toMatchObject({ step: 'settings' })
  })

  it('brilho e volume sozinhos não satisfazem ajuste de letras pequenas', () => {
    let state = ready(readingMission)
    state = act(state, { kind: 'reading', type: 'identify-difficulty', difficulty: 'text' }, readingMission)
    state = act(state, { kind: 'reading', type: 'set-brightness', brightness: 'comfortable' }, readingMission)
    state = act(state, { kind: 'reading', type: 'set-volume', volume: 'audible' }, readingMission)
    state = act(state, { kind: 'reading', type: 'apply-settings' }, readingMission)
    expect(state.feedback?.code).toBe('needs-reading-adjustment')
    expect(state.activity.criteria).not.toContain('apply-adjustment')
    state = act(state, { kind: 'reading', type: 'select-location', locationId: 'centro' }, readingMission)
    expect(state.phase).not.toBe('completed')
  })

  it('informação incorreta não apaga o ajuste e pode ser corrigida', () => {
    let state = adjustedReading()
    state = act(state, { kind: 'reading', type: 'select-location', locationId: 'praca' }, readingMission)
    expect(state.feedback?.code).toBe('wrong-location')
    expect(state.activity.criteria).toContain('apply-adjustment')
    expect(state.phase).toBe('activity')
    state = act(state, { kind: 'reading', type: 'select-location', locationId: 'centro' }, readingMission)
    expect(state.phase).toBe('completed')
  })

  it('desfazer antes de responder exige aplicar novamente; depois de concluir não apaga reconhecimento', () => {
    let state = act(adjustedReading(), { kind: 'reading', type: 'undo-adjustments' }, readingMission)
    expect(state.activity.criteria).toEqual(['identify-difficulty'])
    expect(state.activity).toMatchObject({ step: 'settings', settings: { presentation: 'standard' } })
    state = act(state, { kind: 'reading', type: 'set-presentation', presentation: 'reading' }, readingMission)
    state = act(state, { kind: 'reading', type: 'apply-settings' }, readingMission)
    state = act(state, { kind: 'reading', type: 'select-location', locationId: 'centro' }, readingMission)
    state = act(state, { kind: 'reading', type: 'undo-adjustments' }, readingMission)
    expect(state.phase).toBe('completed')
    expect(state.activity.criteria).toHaveLength(3)
    expect(state.events.filter((event) => event.type === 'mission_completed')).toHaveLength(1)
    expect(state.activity).toMatchObject({ settings: { presentation: 'standard' } })
  })
})

describe('Ciclo de vida, retorno e eventos v2', () => {
  it('representa não iniciada, em andamento e concluída sem depender da visualização de telas', () => {
    expect(createExecution(navigationMission).status).toBe('not-started')
    expect(ready(navigationMission).status).toBe('in-progress')
    expect(finishNavigation().status).toBe('completed')
    let state = ready(navigationMission)
    for (let index = 0; index < 3; index++) {
      state = reduceExecution(state, { type: 'previous' }, navigationMission)
      state = reduceExecution(state, { type: 'previous' }, navigationMission)
      state = reduceExecution(state, { type: 'start-mission' }, navigationMission)
      state = reduceExecution(state, { type: 'start-activity' }, navigationMission)
    }
    expect(state.activity.criteria).toHaveLength(0)
    expect(state.events.filter((event) => event.type === 'mission_started')).toHaveLength(1)
    expect(state.events.filter((event) => event.type === 'mission_completed')).toHaveLength(0)
  })

  it('inicia e conclui etapas somente em transições validadas, sem concluir etapa por ajuda', () => {
    let state = ready(navigationMission)
    state = reduceExecution(state, { type: 'help' }, navigationMission)
    state = act(state, { kind: 'navigation', type: 'open-app', appId: 'calendario' }, navigationMission)
    expect(state.events.filter((event) => event.type === 'step_completed')).toHaveLength(0)
    state = act(state, { kind: 'navigation', type: 'go-home' }, navigationMission)
    state = navigationPath.reduce((current, action) => act(current, action, navigationMission), state)
    expect(state.events.filter((event) => event.type === 'step_started').map((event) => event.step)).toEqual(['find', 'return-first', 'detour', 'recover', 'return-final'])
    expect(state.events.filter((event) => event.type === 'step_completed').map((event) => event.step)).toEqual(['find', 'return-first', 'detour', 'recover', 'return-final'])
    expect(state.events.at(-1)?.type).toBe('mission_completed')
  })

  it('retorna um checkpoint da M01 e exige refazer os objetivos posteriores sem apagar tudo', () => {
    let state = navigationPath.slice(0, 5).reduce((current, action) => act(current, action, navigationMission), ready(navigationMission))
    expect(state.activity.criteria).toEqual(['open-target', 'recover-path'])
    state = reduceExecution(state, { type: 'previous' }, navigationMission)
    expect(state.activity).toMatchObject({ step: 'recover', screen: 'home', recoveredViaHome: true, criteria: ['open-target'] })
    state = act(state, navigationPath[4], navigationMission)
    state = act(state, navigationPath[5], navigationMission)
    expect(state.status).toBe('completed')
  })

  it('retorna ao ajuste da M02 preservando escolhas e removendo apenas o critério posterior', () => {
    let state = reduceExecution(adjustedReading('reading'), { type: 'previous' }, readingMission)
    expect(state.activity).toMatchObject({ step: 'settings', settings: { presentation: 'reading' }, criteria: ['identify-difficulty'] })
    state = act(state, { kind: 'reading', type: 'select-location', locationId: 'centro' }, readingMission)
    expect(state.status).not.toBe('completed')
    state = act(state, { kind: 'reading', type: 'apply-settings' }, readingMission)
    state = act(state, { kind: 'reading', type: 'select-location', locationId: 'centro' }, readingMission)
    expect(state.status).toBe('completed')
  })

  it('desfazer não registra conclusão nem permite recuperar um checkpoint que dispense reaplicar ajuste', () => {
    let state = adjustedReading()
    const completedSteps = state.events.filter((event) => event.type === 'step_completed').length
    state = act(state, { kind: 'reading', type: 'undo-adjustments' }, readingMission)
    expect(state.events.filter((event) => event.type === 'step_completed')).toHaveLength(completedSteps)
    state = reduceExecution(state, { type: 'previous' }, readingMission)
    expect(state.activity.step).toBe('difficulty')
    expect(state.activity.criteria).toHaveLength(0)
  })

  it('interrompe sem perder ajustes/objetivos e ignora ações enquanto a prática está pausada', () => {
    const before = adjustedReading()
    let state = reduceExecution(before, { type: 'interrupt' }, readingMission)
    expect(state.status).toBe('interrupted')
    expect(state.phase).toBe('paused')
    expect(state.activity).toBe(before.activity)
    expect(act(state, { kind: 'reading', type: 'select-location', locationId: 'centro' }, readingMission)).toBe(state)
    state = reduceExecution(state, { type: 'help' }, readingMission)
    state = reduceExecution(state, { type: 'resume' }, readingMission)
    expect(state.status).toBe('in-progress')
    expect(state.phase).toBe('activity')
    expect(state.activity).toBe(before.activity)
    expect(state.resumePhase).toBeNull()
    state = act(state, { kind: 'reading', type: 'select-location', locationId: 'centro' }, readingMission)
    expect(state.status).toBe('completed')
  })

  it.each(['activity', 'paused'] as const)('reinicia voluntariamente a partir de %s com nova tentativa sem notas', (phase) => {
    let state = adjustedReading()
    if (phase === 'paused') state = reduceExecution(state, { type: 'interrupt' }, readingMission)
    state = reduceExecution(state, { type: 'restart' }, readingMission)
    expect(state).toMatchObject({ status: 'not-started', phase: 'presentation', attempt: 2, history: [], resumePhase: null, feedback: null })
    expect(state.activity).toMatchObject({ step: 'difficulty', criteria: [], settings: { presentation: 'standard', brightness: 'standard', volume: 'quiet' } })
    expect(state.events.at(-1)).toMatchObject({ type: 'mission_restarted', reason: 'restart', attempt: 2 })
    expect(state).not.toHaveProperty('score')
  })

  it('emite conclusão uma vez por tentativa e distingue repetição de reinício', () => {
    let state = reduceExecution(finishNavigation(), { type: 'repeat' }, navigationMission)
    expect(state.events.at(-1)).toMatchObject({ type: 'mission_restarted', reason: 'repeat', attempt: 2 })
    state = reduceExecution(state, { type: 'start-mission' }, navigationMission)
    state = reduceExecution(state, { type: 'start-activity' }, navigationMission)
    state = navigationPath.reduce((current, action) => act(current, action, navigationMission), state)
    expect(state.events.filter((event) => event.type === 'mission_completed').map((event) => event.attempt)).toEqual([1, 2])
  })

  it('inclui todos os eventos exigidos e somente metadados autorais/versionados', () => {
    let state = ready(navigationMission)
    state = reduceExecution(state, { type: 'help' }, navigationMission)
    state = act(state, { kind: 'navigation', type: 'open-app', appId: 'calendario' }, navigationMission)
    state = act(state, { kind: 'navigation', type: 'go-home' }, navigationMission)
    state = navigationPath.reduce((current, action) => act(current, action, navigationMission), state)
    state = reduceExecution(state, { type: 'repeat' }, navigationMission)
    const names = new Set(state.events.map((event) => event.type))
    for (const name of ['mission_started', 'step_started', 'action_performed', 'help_requested', 'attempt_incorrect', 'step_completed', 'mission_completed', 'mission_restarted'] as const) expect(names.has(name)).toBe(true)
    for (const event of state.events) {
      expect(event).toMatchObject({ missionId: 'M01', unitId: 'U01', schemaVersion: 2, definitionVersion: navigationMission.version, source: 'local-demo' })
      expect(Object.keys(event).every((key) => ['sequence', 'source', 'missionId', 'unitId', 'definitionVersion', 'schemaVersion', 'attempt', 'type', 'step', 'action', 'reason'].includes(key))).toBe(true)
    }
    expect(new Set(state.events.map((event) => event.sequence)).size).toBe(state.events.length)
  })

  it('rejeita definição de versão diferente e não retoma antes de interromper', () => {
    const state = ready(navigationMission)
    expect(reduceExecution(state, { type: 'help' }, { ...navigationMission, version: 'outra-versao' })).toBe(state)
    expect(reduceExecution(state, { type: 'resume' }, navigationMission)).toBe(state)
    expect(reduceExecution(createExecution(navigationMission), { type: 'interrupt' }, navigationMission).status).toBe('not-started')
  })
})
