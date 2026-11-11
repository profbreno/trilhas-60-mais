import { describe, expect, it } from 'vitest'
import { accountProtectionMission, privacyPublicationMission } from '../../data/privacyMissions'
import { initialPrivacy, validatePrivacy } from './privacyDecision'
import { createExecution, reduceExecution } from './execution'
import type { PrivacyAction, PrivacyState } from './types'

type WithoutKind<T> = T extends unknown ? Omit<T, 'kind'> : never
const act = (s: PrivacyState, a: WithoutKind<PrivacyAction>, d = accountProtectionMission) => validatePrivacy(s, { kind: 'privacy-decision', ...a } as PrivacyAction, d)
function prepared(d = accountProtectionMission) {
  let s = initialPrivacy(d)
  const run = (a: WithoutKind<PrivacyAction>) => { s = act(s, a, d).activity as PrivacyState }
  run({ type: 'consult-guidance' })
  if (d.mode === 'account') {
    run({ type: 'compare-strategies' }); run({ type: 'choose-strategy', id: 'exclusive' })
    for (const id of d.rules.strategyReasons) run({ type: 'toggle-strategy-reason', id })
  } else {
    run({ type: 'choose-purpose', id: 'public-invitation' })
    for (const f of d.content.fields) run({ type: 'inspect-field', id: f.id })
    for (const id of d.rules.privateFields) run({ type: 'toggle-field', id })
  }
  run({ type: 'continue-protection' }); return s
}
function protectedState(d = accountProtectionMission) {
  let s = prepared(d)
  const run = (a: WithoutKind<PrivacyAction>) => { s = act(s, a, d).activity as PrivacyState }
  if (d.mode === 'account') {
    run({ type: 'activate-second-factor' }); run({ type: 'choose-code-role', id: 'temporary' }); run({ type: 'use-code-in-access' }); run({ type: 'choose-refusal', id: 'refuse' })
    for (const id of d.rules.codeReasons) run({ type: 'toggle-code-reason', id })
  } else {
    run({ type: 'choose-audience', id: 'public' }); for (const id of d.rules.publicationReasons) run({ type: 'toggle-publication-reason', id })
  }
  return s
}
describe('U05 — decisões de proteção por contexto', () => {
  it.each([accountProtectionMission, privacyPublicationMission])('$id não conclui só por ler ou confirmar fora da etapa', d => {
    let s = initialPrivacy(d)
    expect(act(s, { type: 'confirm-privacy' }, d).incorrect).toBe(true)
    expect(act(s, { type: 'continue-protection' }, d).feedback.code).toBe('guidance-first')
    s = act(s, { type: 'consult-guidance' }, d).activity as PrivacyState
    expect(act(s, { type: 'continue-protection' }, d).incorrect).toBe(true)
  })
  it.each(['reuse', 'personal', 'symbols'])('explica consequência da estratégia %s e bloqueia avanço', id => {
    let s = initialPrivacy(accountProtectionMission)
    for (const type of ['consult-guidance', 'compare-strategies'] as const) s = act(s, { type }).activity as PrivacyState
    const r = act(s, { type: 'choose-strategy', id })
    expect(r.incorrect).toBe(true); expect(r.feedback.code).toBe(`strategy-${id}`)
    expect(act(r.activity as PrivacyState, { type: 'continue-protection' }).incorrect).toBe(true)
  })
  it('exige comprimento e exclusividade, sem tratar símbolos como garantia', () => {
    let s = act(prepared(), { type: 'revise-preparation' }).activity as PrivacyState
    s = act(s, { type: 'toggle-strategy-reason', id: 'unique' }).activity as PrivacyState
    expect(act(s, { type: 'continue-protection' }).feedback.code).toBe('strategy-reasons')
    s = act(s, { type: 'toggle-strategy-reason', id: 'unique' }).activity as PrivacyState
    s = act(s, { type: 'toggle-strategy-reason', id: 'symbols-only' }).activity as PrivacyState
    expect(act(s, { type: 'continue-protection' }).incorrect).toBe(true)
  })
  it('exige etapa adicional, função do código e uso no acesso iniciado', () => {
    let s = prepared()
    expect(act(s, { type: 'use-code-in-access' }).incorrect).toBe(true)
    s = act(s, { type: 'activate-second-factor' }).activity as PrivacyState
    s = act(s, { type: 'choose-code-role', id: 'password' }).activity as PrivacyState
    expect(act(s, { type: 'use-code-in-access' }).incorrect).toBe(true)
    s = act(s, { type: 'choose-code-role', id: 'temporary' }).activity as PrivacyState
    expect((act(s, { type: 'use-code-in-access' }).activity as PrivacyState).usedInAccess).toBe(true)
  })
  it('tentativa de enviar código nunca completa nem transmite, invalidando o uso até revisão', () => {
    const r = act(protectedState(), { type: 'attempt-send-code' })
    expect(r.feedback.code).toBe('code-never-sent'); expect(r.incorrect).toBe(true)
    expect((r.activity as PrivacyState).usedInAccess).toBe(false)
    expect((r.activity as PrivacyState).blockedSend).toBe(true)
    expect((act(r.activity as PrivacyState, { type: 'use-code-in-access' }).activity as PrivacyState).blockedSend).toBe(false)
    expect(act(r.activity as PrivacyState, { type: 'prepare-privacy-review' }).incorrect).toBe(true)
  })
  it.each(['refuse', 'independent'])('aceita recusa segura equivalente %s, com explicação', id => {
    let s = act(protectedState(), { type: 'choose-refusal', id }).activity as PrivacyState
    expect(act(s, { type: 'prepare-privacy-review' }).incorrect).toBe(false)
    s = act(s, { type: 'toggle-code-reason', id: 'no-third-party' }).activity as PrivacyState
    expect(act(s, { type: 'prepare-privacy-review' }).feedback.code).toBe('code-reasons')
  })
  it('rejeita combinar envio com falso suporte e justificativa de confiança no interlocutor', () => {
    const r = act(protectedState(), { type: 'choose-refusal', id: 'send' })
    expect(r.incorrect).toBe(true)
    const s = act(protectedState(), { type: 'toggle-code-reason', id: 'support' }).activity as PrivacyState
    expect(act(s, { type: 'prepare-privacy-review' }).incorrect).toBe(true)
  })
  it.each(['phone', 'home', 'document'])('M10 exige retirar campo privado desnecessário %s', id => {
    const d = privacyPublicationMission
    let s = act(prepared(d), { type: 'revise-preparation' }, d).activity as PrivacyState
    s = act(s, { type: 'toggle-field', id }, d).activity as PrivacyState
    expect(s.included).toContain(id)
    expect(act(s, { type: 'continue-protection' }, d).feedback.code).toBe('private-exposure')
  })
  it.each(['title', 'venue', 'time'])('M10 preserva informação necessária %s, não valida quantidade removida', id => {
    const d = privacyPublicationMission
    let s = act(prepared(d), { type: 'revise-preparation' }, d).activity as PrivacyState
    s = act(s, { type: 'toggle-field', id }, d).activity as PrivacyState
    expect(act(s, { type: 'continue-protection' }, d).feedback.code).toBe('invitation-missing')
    s = act(s, { type: 'toggle-field', id }, d).activity as PrivacyState
    expect(act(s, { type: 'continue-protection' }, d).incorrect).toBe(false)
  })
  it('M10 exige reconhecer finalidade e inspecionar dados, mesmo após remover os campos certos', () => {
    const d = privacyPublicationMission
    let s = initialPrivacy(d)
    s = act(s, { type: 'consult-guidance' }, d).activity as PrivacyState
    for (const id of d.rules.privateFields) s = act(s, { type: 'toggle-field', id }, d).activity as PrivacyState
    expect(act(s, { type: 'continue-protection' }, d).feedback.code).toBe('purpose-first')
    s = act(s, { type: 'choose-purpose', id: 'public-invitation' }, d).activity as PrivacyState
    expect(act(s, { type: 'continue-protection' }, d).feedback.code).toBe('inspect-fields')
  })
  it('M10 permite manter ou retirar canal público opcional sem proibir todo contato', () => {
    const d = privacyPublicationMission
    let s = act(prepared(d), { type: 'revise-preparation' }, d).activity as PrivacyState
    s = act(s, { type: 'toggle-field', id: 'public-channel' }, d).activity as PrivacyState
    expect(act(s, { type: 'continue-protection' }, d).incorrect).toBe(false)
    expect(prepared(d).included).toContain('public-channel')
  })
  it('M10 exige público coerente e justificativa de minimização contextual', () => {
    const d = privacyPublicationMission
    let s = act(protectedState(d), { type: 'choose-audience', id: 'specific-group' }, d).activity as PrivacyState
    expect(act(s, { type: 'prepare-privacy-review' }, d).feedback.code).toBe('audience-purpose')
    s = act(protectedState(d), { type: 'toggle-publication-reason', id: 'ban-all' }, d).activity as PrivacyState
    expect(act(s, { type: 'prepare-privacy-review' }, d).feedback.code).toBe('publication-reasons')
  })
  it.each([accountProtectionMission, privacyPublicationMission])('$id exige revisão explícita e desfaz critérios posteriores ao editar', d => {
    let s = act(protectedState(d), { type: 'prepare-privacy-review' }, d).activity as PrivacyState
    expect(act(s, { type: 'confirm-privacy' }, d).feedback.code).toBe('review-first')
    s = act(s, { type: 'acknowledge-privacy-review', checked: true }, d).activity as PrivacyState
    s = act(s, { type: 'edit-privacy' }, d).activity as PrivacyState
    expect(s.reviewed).toBe(false); expect(s.criteria).toEqual(['prepared'])
    s = act(s, { type: 'revise-preparation' }, d).activity as PrivacyState
    expect(s.criteria).toEqual([]); expect(s.usedInAccess).toBe(false); expect(s.audienceId).toBeNull()
  })
  it('não aceita campos inexistentes nem ações da outra modalidade', () => {
    expect(act(initialPrivacy(accountProtectionMission), { type: 'toggle-field', id: 'home' }).incorrect).toBe(true)
    expect(act(initialPrivacy(privacyPublicationMission), { type: 'choose-strategy', id: 'exclusive' }, privacyPublicationMission).incorrect).toBe(true)
    expect(act(initialPrivacy(privacyPublicationMission), { type: 'inspect-field', id: 'inventado' }, privacyPublicationMission).incorrect).toBe(true)
  })
  it.each([accountProtectionMission, privacyPublicationMission])('$id mantém ciclo, conclusão única e eventos sem segredos ou escolhas', d => {
    let s = reduceExecution(createExecution(d), { type: 'start-mission' }, d)
    s = reduceExecution(s, { type: 'start-activity' }, d)
    const run = (a: WithoutKind<PrivacyAction>) => { s = reduceExecution(s, { type: 'activity', action: { ...a, kind: 'privacy-decision' } as PrivacyAction }, d) }
    run({ type: 'continue-protection' }); s = reduceExecution(s, { type: 'help' }, d); run({ type: 'consult-guidance' })
    if (d.mode === 'account') {
      run({ type: 'compare-strategies' }); run({ type: 'choose-strategy', id: 'exclusive' }); for (const id of d.rules.strategyReasons) run({ type: 'toggle-strategy-reason', id })
    } else {
      run({ type: 'choose-purpose', id: 'public-invitation' }); for (const f of d.content.fields) run({ type: 'inspect-field', id: f.id }); for (const id of d.rules.privateFields) run({ type: 'toggle-field', id })
    }
    run({ type: 'continue-protection' }); const before = s.activity
    s = reduceExecution(s, { type: 'interrupt' }, d); s = reduceExecution(s, { type: 'resume' }, d); expect(s.activity).toEqual(before)
    if (d.mode === 'account') {
      run({ type: 'activate-second-factor' }); run({ type: 'choose-code-role', id: 'temporary' }); run({ type: 'use-code-in-access' }); run({ type: 'choose-refusal', id: 'refuse' }); for (const id of d.rules.codeReasons) run({ type: 'toggle-code-reason', id })
    } else {
      run({ type: 'choose-audience', id: 'public' }); for (const id of d.rules.publicationReasons) run({ type: 'toggle-publication-reason', id })
    }
    run({ type: 'prepare-privacy-review' }); run({ type: 'edit-privacy' }); expect(s.events.at(-2)?.type).not.toBe('step_completed')
    run({ type: 'prepare-privacy-review' }); run({ type: 'acknowledge-privacy-review', checked: true }); run({ type: 'confirm-privacy' }); run({ type: 'confirm-privacy' })
    expect(s.phase).toBe('completed'); expect(s.events.filter(e => e.type === 'mission_completed')).toHaveLength(1)
    const old = s.events; s = reduceExecution(s, { type: 'repeat' }, d); expect(s.activity).toEqual(initialPrivacy(d)); expect(s.events.slice(0, old.length)).toEqual(old)
    expect(s.events.map(e => e.sequence)).toEqual(s.events.map((_, i) => i + 1))
    for (const e of s.events) {
      expect(e).toMatchObject({ missionId: d.id, unitId: 'U05', source: 'local-demo', schemaVersion: 2 })
      expect(Object.keys(e).every(k => ['sequence', 'source', 'missionId', 'unitId', 'definitionVersion', 'schemaVersion', 'attempt', 'type', 'step', 'action', 'reason'].includes(k))).toBe(true)
    }
    expect(JSON.stringify(s.events)).not.toMatch(/CÓDIGO-DE-EXEMPLO|Nuvem tranquila|CONTATO PARTICULAR|RESIDÊNCIA DE EXEMPLO|longa-exclusiva|public-invitation/)
    expect(s.events.some(e => e.type === 'help_requested' && !e.action)).toBe(true)
  })
})
