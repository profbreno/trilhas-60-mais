import { describe, expect, it } from 'vitest'
import { investigationMission, responsibleSharingMission } from '../../data/informationMissions'
import { initialInformation, validateInformation } from './informationCheck'
import { createExecution, reduceExecution } from './execution'
import type { InformationAction, InformationDefinition, InformationState, InformationVerdict } from './types'

type WithoutKind<T> = T extends unknown ? Omit<T, 'kind'> : never
const act = (s: InformationState, a: WithoutKind<InformationAction>, d = investigationMission) => validateInformation(s, { kind: 'information-check', ...a } as InformationAction, d)
function investigated(d = investigationMission) {
  let s = initialInformation()
  for (const id of [...d.rules.requiredEvidence].reverse()) s = act(s, { type: 'open-evidence', id }, d).activity as InformationState
  return act(s, { type: 'compare-evidence' }, d).activity as InformationState
}
function justified(d = investigationMission) {
  let s = investigated(d)
  s = act(s, { type: 'choose-verdict', verdict: d.rules.verdict }, d).activity as InformationState
  for (const id of d.rules.requiredReasons) s = act(s, { type: 'toggle-reason', id }, d).activity as InformationState
  if (d.mode === 'sharing') for (const [type, id] of [['choose-conduct', 'wait'], ['choose-response', 'uncertain'], ['choose-next-step', 'organizer']] as const) s = act(s, { type, id }, d).activity as InformationState
  return s
}
describe('Investigação e decisão fundamentada U04', () => {
  it('não conclui ao ler aviso, comparar sem pistas ou finalizar antecipadamente', () => {
    for (const type of ['compare-evidence', 'prepare-review', 'finalize-decision'] as const) expect(act(initialInformation(), { type }).incorrect).toBe(true)
  })
  it('aceita pistas em qualquer ordem e mantém fonte, autoria, data e contexto nos dados', () => {
    const s = investigated()
    expect(s.opened).toEqual(['reference', 'date', 'origin']); expect(s.criteria).toEqual(['investigated'])
    for (const e of investigationMission.content.evidence) for (const field of ['source', 'author', 'date', 'context', 'body'] as const) expect(e[field].length).toBeGreaterThan(5)
  })
  it('não conta abertura repetida como nova pista nem aceita fonte desconhecida', () => {
    const s = act(initialInformation(), { type: 'open-evidence', id: 'origin' }).activity as InformationState
    expect((act(s, { type: 'open-evidence', id: 'origin' }).activity as InformationState).opened).toEqual(['origin'])
    expect(act(s, { type: 'open-evidence', id: 'externa' }).incorrect).toBe(true)
    expect(act(s, { type: 'compare-evidence' }).incorrect).toBe(true)
  })
  it.each(['confirmed', 'contradicted', 'unverified'] as InformationVerdict[])('representa condição %s com regra e evidências autorais equivalentes', verdict => {
    // Fixtures exclusivas de contrato, não registradas como novas missões.
    const fixture: InformationDefinition = { ...investigationMission, rules: { ...investigationMission.rules, verdict, requiredReasons: ['context'] }, content: { ...investigationMission.content, reasons: [{ id: 'context', label: verdict === 'confirmed' ? 'A referência confirma o fechamento na data indicada.' : verdict === 'contradicted' ? 'A referência documenta atendimento normal e contradiz o fechamento.' : 'A referência não esclarece a situação na data indicada.' }], evidence: investigationMission.content.evidence.map(e => e.id === 'reference' ? { ...e, body: verdict === 'confirmed' ? 'Referência independente confirma o fechamento na data indicada.' : verdict === 'contradicted' ? 'Referência independente documenta atendimento normal na data indicada e contradiz o fechamento.' : 'A referência não esclarece atendimento ou fechamento na data indicada.' } : e) } }
    const r = act(justified(fixture), { type: 'prepare-review' }, fixture)
    expect(r.incorrect).toBe(false); expect(r.activity.step).toBe('review')
    const reviewed = act(r.activity as InformationState, { type: 'acknowledge-review', checked: true }, fixture).activity as InformationState
    expect(act(reviewed, { type: 'finalize-decision' }, fixture).activity.step).toBe('done')
  })
  it.each([investigationMission, responsibleSharingMission])('$id distingue falta de confirmação de falsidade', d => {
    const s = act(justified(d), { type: 'choose-verdict', verdict: 'contradicted' }, d).activity as InformationState
    expect(act(s, { type: 'prepare-review' }, d).feedback.code).toBe('not-proven-false')
    const asserted = act(s, { type: 'choose-verdict', verdict: 'confirmed' }, d).activity as InformationState
    expect(act(asserted, { type: 'prepare-review' }, d).feedback.code).toBe('verdict-evidence')
  })
  it('abrir todas as pistas não substitui interpretação nem justificativa', () => {
    expect(act(investigated(), { type: 'prepare-review' }).incorrect).toBe(true)
    const s = act(investigated(), { type: 'choose-verdict', verdict: 'unverified' }).activity as InformationState
    expect(act(s, { type: 'prepare-review' }).feedback.code).toBe('reason-evidence')
  })
  it.each(['author', 'old-date', 'context'])('M07 exige evidência justificada de %s', id => {
    const s = act(justified(), { type: 'toggle-reason', id }).activity as InformationState
    expect(act(s, { type: 'prepare-review' }).incorrect).toBe(true)
  })
  it.each([['appearance', investigationMission], ['known', responsibleSharingMission], ['popular', responsibleSharingMission]] as const)('rejeita justificativa por %s, mesmo com todos os motivos pertinentes marcados', (id, d) => {
    const s = act(justified(d), { type: 'toggle-reason', id }, d).activity as InformationState
    expect(act(s, { type: 'prepare-review' }, d).feedback.code).toBe('reason-evidence')
  })
  it.each(['wait', 'hold'])('aceita conduta responsável equivalente %s', id => {
    const s = act(justified(responsibleSharingMission), { type: 'choose-conduct', id }, responsibleSharingMission).activity as InformationState
    expect(act(s, { type: 'prepare-review' }, responsibleSharingMission).incorrect).toBe(false)
  })
  it('não conclui apenas por escolher não compartilhar sem investigar', () => {
    expect(act(initialInformation(), { type: 'choose-conduct', id: 'hold' }, responsibleSharingMission).incorrect).toBe(true)
    const s = act(investigated(responsibleSharingMission), { type: 'choose-conduct', id: 'hold' }, responsibleSharingMission).activity as InformationState
    expect(act(s, { type: 'prepare-review' }, responsibleSharingMission).incorrect).toBe(true)
  })
  it.each([['choose-conduct', 'share', 'conduct-evidence'], ['choose-response', 'hostile', 'respectful-response'], ['choose-response', 'assert-false', 'respectful-response'], ['choose-next-step', 'repeat-more', 'independent-next-step']] as const)('bloqueia %s inadequada %s sem publicar', (type, id, code) => {
    const r = act(justified(responsibleSharingMission), { type, id }, responsibleSharingMission)
    expect(r.incorrect).toBe(true); expect(r.feedback.code).toBe(code)
    expect(act(r.activity as InformationState, { type: 'prepare-review' }, responsibleSharingMission).incorrect).toBe(true)
  })
  it.each(['uncertain', 'not-yet'])('aceita resposta respeitosa equivalente %s', id => {
    const s = act(justified(responsibleSharingMission), { type: 'choose-response', id }, responsibleSharingMission).activity as InformationState
    expect(act(s, { type: 'prepare-review' }, responsibleSharingMission).incorrect).toBe(false)
  })
  it.each([investigationMission, responsibleSharingMission])('$id exige revisão explícita e invalida confirmação ao editar', d => {
    let s = act(justified(d), { type: 'prepare-review' }, d).activity as InformationState
    expect(act(s, { type: 'finalize-decision' }, d).feedback.code).toBe('review-first')
    s = act(s, { type: 'acknowledge-review', checked: true }, d).activity as InformationState
    s = act(s, { type: 'edit-decision' }, d).activity as InformationState
    expect(s.reviewed).toBe(false); expect(s.criteria).toEqual(['investigated'])
    s = act(s, { type: 'prepare-review' }, d).activity as InformationState
    expect(act(s, { type: 'finalize-decision' }, d).incorrect).toBe(true)
    s = act(s, { type: 'acknowledge-review', checked: true }, d).activity as InformationState
    expect(act(s, { type: 'finalize-decision' }, d).activity.criteria).toEqual(['investigated', 'justified', 'decided'])
  })
  it('rever evidências exige nova comparação e descarta critérios posteriores', () => {
    const s = act(justified(), { type: 'prepare-review' }).activity as InformationState
    const revised = act(s, { type: 'revise-investigation' }).activity as InformationState
    expect(revised.compared).toBe(false); expect(revised.criteria).toEqual([])
    expect(act(revised, { type: 'prepare-review' }).incorrect).toBe(true)
  })
  it.each([investigationMission, responsibleSharingMission])('$id preserva ajuda, pausa, conclusão única e eventos na repetição', d => {
    let s = reduceExecution(createExecution(d), { type: 'start-mission' }, d)
    s = reduceExecution(s, { type: 'start-activity' }, d)
    const run = (a: WithoutKind<InformationAction>) => { s = reduceExecution(s, { type: 'activity', action: { ...a, kind: 'information-check' } as InformationAction }, d) }
    run({ type: 'compare-evidence' }); s = reduceExecution(s, { type: 'help' }, d)
    for (const id of d.rules.requiredEvidence) run({ type: 'open-evidence', id })
    const activity = s.activity
    s = reduceExecution(s, { type: 'interrupt' }, d); s = reduceExecution(s, { type: 'resume' }, d)
    expect(s.activity).toEqual(activity)
    run({ type: 'compare-evidence' }); run({ type: 'choose-verdict', verdict: d.rules.verdict })
    for (const id of d.rules.requiredReasons) run({ type: 'toggle-reason', id })
    if (d.mode === 'sharing') for (const [type, id] of [['choose-conduct', 'hold'], ['choose-response', 'not-yet'], ['choose-next-step', 'await-source']] as const) run({ type, id })
    run({ type: 'prepare-review' }); run({ type: 'edit-decision' })
    expect(s.events.at(-2)?.type).not.toBe('step_completed')
    run({ type: 'prepare-review' }); run({ type: 'acknowledge-review', checked: true }); run({ type: 'finalize-decision' }); run({ type: 'finalize-decision' })
    expect(s.phase).toBe('completed'); expect(s.events.filter(e => e.type === 'mission_completed')).toHaveLength(1)
    const old = s.events
    s = reduceExecution(s, { type: 'repeat' }, d)
    expect(s.activity).toEqual(initialInformation()); expect(s.events.slice(0, old.length)).toEqual(old)
    expect(s.events.map(e => e.sequence)).toEqual(s.events.map((_, i) => i + 1))
    expect(s.events.some(e => e.type === 'help_requested' && !e.action)).toBe(true)
    for (const e of s.events) {
      expect(e).toMatchObject({ missionId: d.id, unitId: 'U04', source: 'local-demo', schemaVersion: 2 })
      expect(Object.keys(e).every(k => ['sequence', 'source', 'missionId', 'unitId', 'definitionVersion', 'schemaVersion', 'attempt', 'type', 'step', 'action', 'reason'].includes(k))).toBe(true)
    }
    expect(JSON.stringify(s.events)).not.toMatch(/Biblioteca|plantas|unverified|uncertain|await-source/)
  })
})
