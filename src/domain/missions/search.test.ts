import { describe, expect, it } from 'vitest'
import { queryMission, communityMission } from '../../data/searchMissions'
import { initialSearch, searchResults, validateSearch } from './search'
import { createExecution, reduceExecution } from './execution'
import type { SearchAction, SearchDefinition, SearchState } from './types'

type WithoutKind<T> = T extends unknown ? Omit<T, 'kind'> : never
const action = (s: SearchState, a: WithoutKind<SearchAction>, d = queryMission) => validateSearch(s, { kind: 'search', ...a } as SearchAction, d)
const query = (d = queryMission, ids: readonly string[] = d.rules.requiredTerms) => {
  let s = initialSearch()
  for (const id of ids) s = action(s, { type: 'toggle-term', id }, d).activity as SearchState
  return action(s, { type: 'run-search' }, d).activity as SearchState
}
function prepared(d: SearchDefinition) {
  let s = query(d)
  for (const id of ['old', 'partial', 'current']) s = action(s, { type: 'open-result', id }, d).activity as SearchState
  for (const type of ['inspect-origin', 'inspect-date', 'compare-results'] as const) s = action(s, { type }, d).activity as SearchState
  return action(s, { type: 'select-result', id: 'current' }, d).activity as SearchState
}
describe('Pesquisa local e gestão de informação U03', () => {
  it.each([queryMission, communityMission])('$id registra conclusão uma vez e preserva eventos ao repetir', d => {
    let s = reduceExecution(createExecution(d), { type: 'start-mission' }, d)
    s = reduceExecution(s, { type: 'start-activity' }, d)
    const run = (a: WithoutKind<SearchAction>) => { s = reduceExecution(s, { type: 'activity', action: { ...a, kind: 'search' } as SearchAction }, d) }
    for (const id of d.rules.requiredTerms) run({ type: 'toggle-term', id })
    run({ type: 'run-search' })
    for (const id of ['old', 'partial', 'current']) run({ type: 'open-result', id })
    for (const type of ['inspect-origin', 'inspect-date', 'compare-results'] as const) run({ type })
    run({ type: 'select-result', id: 'current' }); run({ type: 'organize-result' })
    if (d.mode === 'contextual') for (const field of ['day', 'location', 'origin'] as const) run({ type: 'set-reminder', field, id: 'correct' })
    run({ type: 'save-result' }); expect(s.phase).toBe('activity')
    run({ type: 'recover-result' }); expect(s.phase).toBe('completed')
    run({ type: 'recover-result' }); expect(s.events.filter(e => e.type === 'mission_completed')).toHaveLength(1)
    expect(s.events.at(-1)?.step).toBe('done')
    const before = s.events
    s = reduceExecution(s, { type: 'repeat' }, d)
    expect(s.activity).toEqual(initialSearch()); expect(s.events.slice(0, before.length)).toEqual(before)
    expect(s.events.at(-1)).toMatchObject({ type: 'mission_restarted', reason: 'repeat', attempt: 2 })
  })
  it('não pesquisa sem palavras e não aceita cartões inexistentes', () => {
    expect(action(initialSearch(), { type: 'run-search' }).incorrect).toBe(true)
    expect(action(initialSearch(), { type: 'toggle-term', id: 'inventado' }).activity).toEqual(initialSearch())
  })
  it('adiciona e remove palavras sem arrastar ou digitar', () => {
    const s = action(initialSearch(), { type: 'toggle-term', id: 'biblioteca' }).activity as SearchState
    expect(s.terms).toEqual(['biblioteca'])
    expect((action(s, { type: 'toggle-term', id: 'biblioteca' }).activity as SearchState).terms).toEqual([])
  })
  it('retorna conjuntos distintos para consulta genérica, específica e fora do assunto', () => {
    expect(searchResults(query(queryMission, ['biblioteca']), queryMission).map(r => r.id)).toEqual(['other', 'old', 'partial'])
    expect(searchResults(query(), queryMission).map(r => r.id)).toEqual(['old', 'partial', 'current'])
    expect(searchResults(query(queryMission, ['outro']), queryMission)).toEqual([])
  })
  it('refina quando necessário, sem exigir uma tentativa inadequada de quem iniciou com contexto suficiente', () => {
    let s = query(queryMission, ['biblioteca'])
    expect(s.criteria).toEqual([])
    s = action(s, { type: 'refine-search' }).activity as SearchState
    for (const id of ['horario', 'bairro']) s = action(s, { type: 'toggle-term', id }).activity as SearchState
    s = action(s, { type: 'run-search' }).activity as SearchState
    expect(s.refined).toBe(true)
    expect(s.criteria).toEqual(['query'])
    expect(query().criteria).toEqual(['query'])
  })
  it.each([['old', 'outdated'], ['partial', 'incomplete']])('explica resultado inadequado %s', (id, code) => {
    const s = action(query(), { type: 'open-result', id }).activity as SearchState
    const r = action(s, { type: 'select-result', id })
    expect(r.feedback.code).toBe(code); expect(r.incorrect).toBe(true)
    expect((r.activity as SearchState).selectedId).toBeNull()
  })
  it('explica por que outra cidade não atende à oficina', () => {
    const s = action(query(communityMission), { type: 'open-result', id: 'other' }, communityMission).activity as SearchState
    expect(action(s, { type: 'select-result', id: 'other' }, communityMission).feedback.code).toBe('elsewhere')
  })
  it('não escolhe resultado não aberto ou fora do conjunto pesquisado', () => {
    expect(action(query(), { type: 'select-result', id: 'current' }).feedback.code).toBe('open-first')
    expect(action(query(queryMission, ['biblioteca']), { type: 'open-result', id: 'current' }).incorrect).toBe(true)
  })
  it('não organiza só por pesquisar ou por selecionar a primeira alternativa', () => {
    expect(action(query(), { type: 'organize-result' }).incorrect).toBe(true)
    expect(action(query(queryMission, ['biblioteca']), { type: 'organize-result' }).feedback.code).toBe('generic')
  })
  it.each([queryMission, communityMission])('$id exige guardar e recuperar; guardar sozinho não completa', d => {
    let s = action(prepared(d), { type: 'organize-result' }, d).activity as SearchState
    expect(action(s, { type: 'recover-result' }, d).incorrect).toBe(true)
    if (d.mode === 'contextual') for (const field of ['day', 'location', 'origin'] as const) s = action(s, { type: 'set-reminder', field, id: 'correct' }, d).activity as SearchState
    s = action(s, { type: 'save-result' }, d).activity as SearchState
    expect(s.saved).toBe(true); expect(s.criteria).not.toContain('recovered')
    s = action(s, { type: 'recover-result' }, d).activity as SearchState
    expect(s.step).toBe('done'); expect(s.criteria).toEqual(['query', 'selected', 'recovered'])
  })
  it('exige comparação de três resultados e consulta de origem/data da escolha em M06', () => {
    let s = query(communityMission)
    expect(action(s, { type: 'compare-results' }, communityMission).incorrect).toBe(true)
    s = action(s, { type: 'open-result', id: 'current' }, communityMission).activity as SearchState
    s = action(s, { type: 'select-result', id: 'current' }, communityMission).activity as SearchState
    expect(action(s, { type: 'organize-result' }, communityMission).feedback.code).toBe('verify-first')
    for (const id of ['old', 'partial']) s = action(s, { type: 'open-result', id }, communityMission).activity as SearchState
    for (const type of ['inspect-origin', 'inspect-date', 'compare-results'] as const) s = action(s, { type }, communityMission).activity as SearchState
    // Conferir outro resultado não confere a atividade escolhida.
    expect(action(s, { type: 'organize-result' }, communityMission).incorrect).toBe(true)
  })
  it.each(['day', 'location', 'origin'] as const)('rejeita lembrete com %s incorreto ou ausente', field => {
    let s = action(prepared(communityMission), { type: 'organize-result' }, communityMission).activity as SearchState
    for (const f of ['day', 'location', 'origin'] as const) if (f !== field) s = action(s, { type: 'set-reminder', field: f, id: 'correct' }, communityMission).activity as SearchState
    expect(action(s, { type: 'save-result' }, communityMission).feedback.code).toBe('reminder-wrong')
    s = action(s, { type: 'set-reminder', field, id: communityMission.content.reminder[field][0].id }, communityMission).activity as SearchState
    expect(action(s, { type: 'save-result' }, communityMission).incorrect).toBe(true)
  })
  it('revisar escolha descarta organização; refinar descarta conferências e coleção', () => {
    const s = action(prepared(communityMission), { type: 'organize-result' }, communityMission).activity as SearchState
    const edited = action(s, { type: 'edit-result' }, communityMission).activity as SearchState
    expect(edited.selectedId).toBeNull(); expect(edited.criteria).toEqual(['query'])
    const refined = action(s, { type: 'refine-search' }, communityMission).activity as SearchState
    expect(refined.opened).toEqual([]); expect(refined.saved).toBe(false); expect(refined.origins).toEqual([])
  })
  it.each([queryMission, communityMission])('$id preserva ajuda, pausa, retorno e reinício sem vazar escolhas nos eventos', d => {
    let s = reduceExecution(createExecution(d), { type: 'start-mission' }, d)
    s = reduceExecution(s, { type: 'start-activity' }, d)
    const run = (a: SearchAction) => { s = reduceExecution(s, { type: 'activity', action: a }, d) }
    for (const id of d.rules.requiredTerms) run({ kind: 'search', type: 'toggle-term', id })
    run({ kind: 'search', type: 'run-search' })
    const activity = s.activity
    s = reduceExecution(s, { type: 'help' }, d)
    s = reduceExecution(s, { type: 'interrupt' }, d)
    s = reduceExecution(s, { type: 'resume' }, d)
    expect(s.activity).toEqual(activity)
    run({ kind: 'search', type: 'refine-search' })
    expect(s.events.at(-2)?.type).not.toBe('step_completed')
    s = reduceExecution(s, { type: 'previous' }, d)
    s = reduceExecution(s, { type: 'restart' }, d)
    expect(s.attempt).toBe(2); expect(s.activity).toEqual(initialSearch())
    expect(s.events.map(e => e.sequence)).toEqual(s.events.map((_, i) => i + 1))
    expect(s.events.some(e => e.type === 'help_requested')).toBe(true)
    for (const e of s.events) {
      expect(e.missionId).toBe(d.id); expect(e.unitId).toBe('U03')
      expect(Object.keys(e).every(key => ['sequence', 'source', 'missionId', 'unitId', 'definitionVersion', 'schemaVersion', 'attempt', 'type', 'step', 'action', 'reason'].includes(key))).toBe(true)
    }
    expect(JSON.stringify(s.events)).not.toContain('bairro')
  })
})
