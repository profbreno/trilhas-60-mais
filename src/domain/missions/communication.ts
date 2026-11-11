import type { ActivityResult, CommunicationAction, CommunicationDefinition, CommunicationState } from './types'

export const initialCommunication = (): CommunicationState => ({ kind: 'communication', step: 'prepare', recipientId: null, contentId: null, greetingId: null, closingId: null, fileId: null, inspectedFileId: null, format: 'text', audioReviewed: false, reviewed: false, criteria: [] })

function preparationError(s: CommunicationState, d: CommunicationDefinition): string | null {
  if (d.mode === 'file') {
    if (d.content.files?.find(f => f.id === s.fileId)?.privateExample) return 'private-file'
    if (s.fileId !== d.rules.fileId) return 'file-purpose'
    if (s.inspectedFileId !== s.fileId) return 'inspect-first'
  }
  if (s.recipientId !== d.rules.recipientId) return 'recipient-purpose'
  if (!s.contentId || !d.rules.acceptedContentIds.includes(s.contentId)) return 'content-purpose'
  if (d.mode === 'message') {
    if (!d.content.greetings?.some(c => c.id === s.greetingId) || !d.content.closings?.some(c => c.id === s.closingId)) return 'complete-message'
    if (s.format === 'audio' && !s.audioReviewed) return 'review-audio-first'
  }
  return null
}

export function validateCommunication(s: CommunicationState, a: CommunicationAction, d: CommunicationDefinition): ActivityResult {
  const result = (activity: CommunicationState, code: string, incorrect = false): ActivityResult => ({ activity, feedback: { code, tone: incorrect ? 'error' : 'info' }, incorrect })
  if (a.type === 'edit-draft' && s.step === 'preview') return result({ ...s, step: 'prepare', reviewed: false, criteria: [] }, 'draft-editable')
  if (s.step === 'preview') {
    if (a.type === 'set-review') return result({ ...s, reviewed: a.checked, criteria: a.checked ? ['prepared', 'reviewed'] : ['prepared'] }, a.checked ? 'review-confirmed' : 'review-cleared')
    if (a.type === 'simulate-send') {
      const error = preparationError(s, d)
      if (error) return result(s, error, true)
      if (!s.reviewed) return result(s, 'review-first', true)
      return result({ ...s, step: 'done', criteria: ['prepared', 'reviewed', 'sent'] }, 'communication-done')
    }
  }
  if (s.step !== 'prepare') return result(s, 'use-current-step', true)
  if (a.type === 'select-recipient') {
    if (!d.content.recipients.some(c => c.id === a.id)) return result(s, 'use-current-step', true)
    return result({ ...s, recipientId: a.id }, a.id === d.rules.recipientId ? 'recipient-selected' : 'recipient-purpose', a.id !== d.rules.recipientId)
  }
  if (a.type === 'select-content') {
    if (!d.content.phrases.some(c => c.id === a.id)) return result(s, 'use-current-step', true)
    return result({ ...s, contentId: a.id, audioReviewed: false }, d.rules.acceptedContentIds.includes(a.id) ? 'content-selected' : 'content-purpose', !d.rules.acceptedContentIds.includes(a.id))
  }
  if (a.type === 'select-greeting' || a.type === 'select-closing') {
    const choices = a.type === 'select-greeting' ? d.content.greetings : d.content.closings
    if (!choices?.some(c => c.id === a.id)) return result(s, 'use-current-step', true)
    return result({ ...s, [a.type === 'select-greeting' ? 'greetingId' : 'closingId']: a.id, audioReviewed: false }, 'phrase-selected')
  }
  if (a.type === 'set-format' && d.mode === 'message') return result({ ...s, format: a.format, audioReviewed: false }, 'format-selected')
  if (a.type === 'review-audio' && d.mode === 'message' && s.format === 'audio') {
    if (!s.greetingId || !s.contentId || !s.closingId) return result(s, 'complete-message', true)
    return result({ ...s, audioReviewed: true }, 'audio-reviewed')
  }
  if (a.type === 'select-file' && d.mode === 'file') {
    const file = d.content.files?.find(f => f.id === a.id)
    if (!file) return result(s, 'use-current-step', true)
    return result({ ...s, fileId: a.id, inspectedFileId: null }, file.privateExample ? 'private-file' : 'file-selected', Boolean(file.privateExample))
  }
  if (a.type === 'inspect-file' && d.mode === 'file' && s.fileId) return result({ ...s, inspectedFileId: s.fileId }, 'file-inspected')
  if (a.type === 'remove-attachment' && d.mode === 'file') return result({ ...s, fileId: null, inspectedFileId: null }, 'attachment-removed')
  if (a.type === 'open-preview') {
    const error = preparationError(s, d)
    return error ? result(s, error, true) : result({ ...s, step: 'preview', reviewed: false, criteria: ['prepared'] }, 'preview-ready')
  }
  return result(s, 'use-current-step', true)
}
