import type { ActivityResult, ReadingAction, ReadingDefinition, ReadingSettings, ReadingState } from './types'

export const defaultReadingSettings = (): ReadingSettings => ({ presentation: 'standard', brightness: 'standard', volume: 'quiet' })
export const initialReading = (): ReadingState => ({ kind: 'reading', step: 'difficulty', settings: defaultReadingSettings(), criteria: [] })

export function validateReading(state: ReadingState, action: ReadingAction, definition: ReadingDefinition): ActivityResult {
  const result = (activity: ReadingState, code: string, incorrect = false): ActivityResult => ({ activity, feedback: { code, tone: incorrect ? 'error' : 'info' }, incorrect })
  if (action.type === 'undo-adjustments') {
    if (state.step === 'done') return result({ ...state, settings: defaultReadingSettings() }, 'undo-after-completion')
    if (state.step === 'difficulty') return result(state, 'identify-first', true)
    return result({ ...state, step: 'settings', settings: defaultReadingSettings(), criteria: ['identify-difficulty'] }, 'adjustments-undone')
  }
  if (action.type === 'identify-difficulty' && state.step === 'difficulty') {
    if (action.difficulty !== 'text') return result(state, 'difficulty-sound', true)
    return result({ ...state, step: 'settings', criteria: ['identify-difficulty'] }, 'difficulty-recognized')
  }
  if (state.step === 'settings') {
    if (action.type === 'set-presentation') return result({ ...state, settings: { ...state.settings, presentation: action.presentation } }, 'presentation-preview')
    if (action.type === 'set-brightness') return result({ ...state, settings: { ...state.settings, brightness: action.brightness } }, 'brightness-preview')
    if (action.type === 'set-volume') return result({ ...state, settings: { ...state.settings, volume: action.volume } }, 'volume-preview')
    if (action.type === 'apply-settings') {
      if (state.settings.presentation === 'standard') return result(state, 'needs-reading-adjustment', true)
      return result({ ...state, step: 'read', criteria: ['identify-difficulty', 'apply-adjustment'] }, 'reading-adjustment-applied')
    }
  }
  if (state.step === 'read' && action.type === 'select-location') {
    if (action.locationId !== definition.rules.correctLocationId) return result(state, 'wrong-location', true)
    return result({ ...state, step: 'done', criteria: [...state.criteria, 'retrieve-information'] }, 'reading-done')
  }
  return result(state, 'use-current-step', true)
}
