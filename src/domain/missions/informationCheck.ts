import type { ActivityResult, InformationAction, InformationDefinition, InformationState } from './types'

export const initialInformation = (): InformationState => ({ kind: 'information-check', step: 'investigate', opened: [], activeId: null, compared: false, verdict: null, reasons: [], conductId: null, responseId: null, nextStepId: null, reviewed: false, criteria: [] })
function decisionError(s: InformationState, d: InformationDefinition): string | null {
  if (!d.rules.requiredEvidence.every(id => s.opened.includes(id)) || !s.compared) return 'investigate-first'
  if (s.verdict !== d.rules.verdict) return s.verdict === 'contradicted' && d.rules.verdict === 'unverified' ? 'not-proven-false' : 'verdict-evidence'
  if (!d.rules.requiredReasons.every(id => s.reasons.includes(id)) || s.reasons.some(id => !d.rules.requiredReasons.includes(id))) return 'reason-evidence'
  if (d.mode === 'sharing') {
    if (!s.conductId || !d.rules.acceptedConduct.includes(s.conductId)) return 'conduct-evidence'
    if (!s.responseId || !d.rules.acceptedResponses.includes(s.responseId)) return 'respectful-response'
    if (!s.nextStepId || !d.rules.acceptedNextSteps.includes(s.nextStepId)) return 'independent-next-step'
  }
  return null
}
export function validateInformation(s: InformationState, a: InformationAction, d: InformationDefinition): ActivityResult {
  const result = (activity: InformationState, code: string, incorrect = false): ActivityResult => ({ activity, feedback: { code, tone: incorrect ? 'error' : 'info' }, incorrect })
  if (a.type === 'revise-investigation' && (s.step === 'decide' || s.step === 'review')) return result({ ...s, step: 'investigate', compared: false, reviewed: false, criteria: [] }, 'investigation-editable')
  if (a.type === 'edit-decision' && s.step === 'review') return result({ ...s, step: 'decide', reviewed: false, criteria: ['investigated'] }, 'decision-editable')
  if (s.step === 'investigate') {
    if (a.type === 'open-evidence' && d.content.evidence.some(e => e.id === a.id)) return result({ ...s, activeId: a.id, opened: [...new Set([...s.opened, a.id])] }, 'evidence-opened')
    if (a.type === 'compare-evidence') {
      if (!d.rules.requiredEvidence.every(id => s.opened.includes(id))) return result(s, 'investigate-first', true)
      return result({ ...s, step: 'decide', compared: true, reviewed: false, criteria: ['investigated'] }, 'comparison-ready')
    }
  }
  if (s.step === 'decide') {
    if (a.type === 'choose-verdict') return result({ ...s, verdict: a.verdict, reviewed: false }, 'verdict-chosen')
    if (a.type === 'toggle-reason' && d.content.reasons.some(c => c.id === a.id)) return result({ ...s, reasons: s.reasons.includes(a.id) ? s.reasons.filter(id => id !== a.id) : [...s.reasons, a.id], reviewed: false }, 'reason-chosen')
    if (a.type === 'choose-conduct' && d.mode === 'sharing' && d.content.conduct.some(c => c.id === a.id)) return result({ ...s, conductId: a.id, reviewed: false }, d.rules.acceptedConduct.includes(a.id) ? 'conduct-chosen' : 'conduct-evidence', !d.rules.acceptedConduct.includes(a.id))
    if (a.type === 'choose-response' && d.mode === 'sharing' && d.content.responses.some(c => c.id === a.id)) return result({ ...s, responseId: a.id, reviewed: false }, d.rules.acceptedResponses.includes(a.id) ? 'response-chosen' : 'respectful-response', !d.rules.acceptedResponses.includes(a.id))
    if (a.type === 'choose-next-step' && d.mode === 'sharing' && d.content.nextSteps.some(c => c.id === a.id)) return result({ ...s, nextStepId: a.id, reviewed: false }, d.rules.acceptedNextSteps.includes(a.id) ? 'next-step-chosen' : 'independent-next-step', !d.rules.acceptedNextSteps.includes(a.id))
    if (a.type === 'prepare-review') {
      const error = decisionError(s, d)
      return error ? result(s, error, true) : result({ ...s, step: 'review', reviewed: false, criteria: ['investigated', 'justified'] }, 'review-ready')
    }
  }
  if (s.step === 'review') {
    if (a.type === 'acknowledge-review') return result({ ...s, reviewed: a.checked }, a.checked ? 'review-acknowledged' : 'review-cleared')
    if (a.type === 'finalize-decision') {
      const error = decisionError(s, d)
      if (error) return result(s, error, true)
      if (!s.reviewed) return result(s, 'review-first', true)
      return result({ ...s, step: 'done', criteria: ['investigated', 'justified', 'decided'] }, 'information-done')
    }
  }
  return result(s, 'use-current-step', true)
}
