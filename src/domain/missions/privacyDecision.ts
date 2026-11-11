import type { ActivityResult, PrivacyAction, PrivacyDefinition, PrivacyState } from './types'

export const initialPrivacy = (d: PrivacyDefinition): PrivacyState => ({ kind: 'privacy-decision', step: 'prepare', guidanceRead: false, compared: false, strategyId: null, strategyReasons: [], secondFactor: false, roleId: null, usedInAccess: false, blockedSend: false, refusalId: null, codeReasons: [], inspected: [], activeField: null, included: d.content.fields.map(f => f.id), purposeId: null, audienceId: null, publicationReasons: [], reviewed: false, criteria: [] })
const toggle = (ids: readonly string[], id: string) => ids.includes(id) ? ids.filter(v => v !== id) : [...ids, id]
const exact = (ids: readonly string[], required: readonly string[]) => required.every(id => ids.includes(id)) && ids.every(id => required.includes(id))
export function preparationError(s: PrivacyState, d: PrivacyDefinition): string | null {
  if (!s.guidanceRead) return 'guidance-first'
  if (d.mode === 'account') {
    if (!s.compared) return 'compare-first'
    if (s.strategyId !== d.rules.strategyId) return 'strategy-purpose'
    if (!exact(s.strategyReasons, d.rules.strategyReasons)) return 'strategy-reasons'
  } else {
    if (s.purposeId !== d.rules.purposeId) return 'purpose-first'
    if (!d.content.fields.every(f => s.inspected.includes(f.id))) return 'inspect-fields'
    if (d.rules.privateFields.some(id => s.included.includes(id))) return 'private-exposure'
    if (!d.rules.requiredFields.every(id => s.included.includes(id))) return 'invitation-missing'
  }
  return null
}
function protectionError(s: PrivacyState, d: PrivacyDefinition): string | null {
  const preparation = preparationError(s, d)
  if (preparation) return preparation
  if (d.mode === 'account') {
    if (!s.secondFactor || s.roleId !== d.rules.roleId || !s.usedInAccess) return 'code-role-first'
    if (!s.refusalId || !d.rules.refusalIds.includes(s.refusalId)) return 'refuse-first'
    if (!exact(s.codeReasons, d.rules.codeReasons)) return 'code-reasons'
  } else {
    if (s.audienceId !== d.rules.audienceId) return 'audience-purpose'
    if (!exact(s.publicationReasons, d.rules.publicationReasons)) return 'publication-reasons'
  }
  return null
}
export function validatePrivacy(s: PrivacyState, a: PrivacyAction, d: PrivacyDefinition): ActivityResult {
  const result = (activity: PrivacyState, code: string, incorrect = false): ActivityResult => ({ activity, feedback: { code, tone: incorrect ? 'error' : 'info' }, incorrect })
  if (a.type === 'edit-privacy' && s.step === 'review') return result({ ...s, step: 'protect', reviewed: false, criteria: ['prepared'] }, 'privacy-editable')
  if (a.type === 'revise-preparation' && (s.step === 'protect' || s.step === 'review')) return result({ ...s, step: 'prepare', secondFactor: false, roleId: null, usedInAccess: false, blockedSend: false, refusalId: null, codeReasons: [], audienceId: null, publicationReasons: [], reviewed: false, criteria: [] }, 'preparation-editable')
  if (s.step === 'prepare') {
    if (a.type === 'consult-guidance') return result({ ...s, guidanceRead: true }, 'guidance-opened')
    if (d.mode === 'account') {
      if (a.type === 'compare-strategies') return result({ ...s, compared: true }, 'strategies-compared')
      if (a.type === 'choose-strategy' && d.content.strategies.some(c => c.id === a.id)) return result({ ...s, strategyId: a.id }, a.id === d.rules.strategyId ? 'strategy-chosen' : `strategy-${a.id}`, a.id !== d.rules.strategyId)
      if (a.type === 'toggle-strategy-reason' && d.content.strategyReasons.some(c => c.id === a.id)) return result({ ...s, strategyReasons: toggle(s.strategyReasons, a.id) }, 'reason-changed')
    } else {
      if (a.type === 'choose-purpose' && d.content.purposes.some(c => c.id === a.id)) return result({ ...s, purposeId: a.id }, a.id === d.rules.purposeId ? 'purpose-chosen' : 'purpose-first', a.id !== d.rules.purposeId)
      if (a.type === 'inspect-field' && d.content.fields.some(f => f.id === a.id)) return result({ ...s, activeField: a.id, inspected: [...new Set([...s.inspected, a.id])] }, 'field-inspected')
      if (a.type === 'toggle-field' && d.content.fields.some(f => f.id === a.id)) return result({ ...s, included: toggle(s.included, a.id) }, s.included.includes(a.id) ? 'field-removed' : 'field-restored')
    }
    if (a.type === 'continue-protection') {
      const error = preparationError(s, d)
      return error ? result(s, error, true) : result({ ...s, step: 'protect', reviewed: false, criteria: ['prepared'] }, 'preparation-ready')
    }
  }
  if (s.step === 'protect') {
    if (d.mode === 'account') {
      if (a.type === 'activate-second-factor') return result({ ...s, secondFactor: true }, 'second-factor-active')
      if (a.type === 'choose-code-role' && d.content.roles.some(c => c.id === a.id)) return result({ ...s, roleId: a.id, usedInAccess: false }, a.id === d.rules.roleId ? 'role-chosen' : 'code-distinction', a.id !== d.rules.roleId)
      if (a.type === 'attempt-send-code') return result({ ...s, usedInAccess: false, blockedSend: true }, 'code-never-sent', true)
      if (a.type === 'use-code-in-access') return !s.secondFactor || s.roleId !== d.rules.roleId ? result(s, 'code-role-first', true) : result({ ...s, usedInAccess: true, blockedSend: false }, 'code-used')
      if (a.type === 'choose-refusal' && d.content.refusals.some(c => c.id === a.id)) return result({ ...s, refusalId: a.id }, d.rules.refusalIds.includes(a.id) ? 'refusal-chosen' : 'refuse-first', !d.rules.refusalIds.includes(a.id))
      if (a.type === 'toggle-code-reason' && d.content.codeReasons.some(c => c.id === a.id)) return result({ ...s, codeReasons: toggle(s.codeReasons, a.id) }, 'reason-changed')
    } else {
      if (a.type === 'choose-audience' && d.content.audiences.some(c => c.id === a.id)) return result({ ...s, audienceId: a.id }, a.id === d.rules.audienceId ? 'audience-chosen' : 'audience-purpose', a.id !== d.rules.audienceId)
      if (a.type === 'toggle-publication-reason' && d.content.publicationReasons.some(c => c.id === a.id)) return result({ ...s, publicationReasons: toggle(s.publicationReasons, a.id) }, 'reason-changed')
    }
    if (a.type === 'prepare-privacy-review') {
      const error = protectionError(s, d)
      return error ? result(s, error, true) : result({ ...s, step: 'review', reviewed: false, criteria: ['prepared', 'protected'] }, 'privacy-review-ready')
    }
  }
  if (s.step === 'review') {
    if (a.type === 'acknowledge-privacy-review') return result({ ...s, reviewed: a.checked }, a.checked ? 'review-confirmed' : 'review-cleared')
    if (a.type === 'confirm-privacy') {
      const error = protectionError(s, d)
      if (error) return result(s, error, true)
      return s.reviewed ? result({ ...s, step: 'done', criteria: ['prepared', 'protected', 'reviewed'] }, 'privacy-done') : result(s, 'review-first', true)
    }
  }
  return result(s, 'use-current-step', true)
}
