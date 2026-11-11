import { initialPrivacy, validatePrivacy } from './privacyDecision'
import { initialInformation, validateInformation } from './informationCheck'
import type { ActivityAction, ActivityState, DemoEvent, DemoEventType, ExecutionAction, ExecutionState, MissionDefinition } from './types'
import { initialNavigation, validateNavigation } from './navigation'
import { initialReading, validateReading } from './reading'
import { initialCommunication, validateCommunication } from './communication'
import { initialSearch, validateSearch } from './search'

export const EVENT_LIMIT = 200
export const initialActivity = (definition: MissionDefinition): ActivityState => definition.kind === 'navigation' ? initialNavigation() : definition.kind === 'reading' ? initialReading() : definition.kind === 'communication' ? initialCommunication() : definition.kind === 'search' ? initialSearch() : definition.kind === 'information-check' ? initialInformation() : initialPrivacy(definition)
export const createExecution = (definition: MissionDefinition): ExecutionState => ({ missionId: definition.id, unitId: definition.unitId, definitionVersion: definition.version, phase: 'presentation', status: 'not-started', resumePhase: null, history: [], activity: initialActivity(definition), feedback: null, awaitingRetry: false, events: [], nextSequence: 1, attempt: 1 })

function record(state: ExecutionState, type: DemoEventType, details: { action?: ActivityAction['type']; reason?: 'repeat' | 'restart' } = {}, step: DemoEvent['step'] = state.phase === 'activity' || state.phase === 'completed' ? state.activity.step : state.phase): ExecutionState {
  const event: DemoEvent = { sequence: state.nextSequence, source: 'local-demo', missionId: state.missionId, unitId: state.unitId, definitionVersion: state.definitionVersion, schemaVersion: 2, attempt: state.attempt, type, step, ...details }
  return { ...state, nextSequence: state.nextSequence + 1, events: [...state.events, event].slice(-EVENT_LIMIT) }
}

/** Redutor puro. Não usa relógio, rede, armazenamento nem identificador de pessoa. */
export function reduceExecution(state: ExecutionState, action: ExecutionAction, definition: MissionDefinition): ExecutionState {
  if (state.missionId !== definition.id || state.unitId !== definition.unitId || state.definitionVersion !== definition.version) return state
  if (action.type === 'help') return record(state, 'help_requested')
  if (action.type === 'start-mission' && state.phase === 'presentation') return { ...(state.status === 'not-started' ? record(state, 'mission_started') : state), phase: 'instructions', status: 'in-progress', feedback: null }
  if (action.type === 'start-activity' && state.phase === 'instructions') return { ...record(state, 'step_started', {}, state.activity.step), phase: 'activity', feedback: null }
  if ((action.type === 'repeat' && state.phase === 'completed') || (action.type === 'restart' && state.status !== 'not-started')) {
    const restarted = record({ ...state, attempt: state.attempt + 1 }, 'mission_restarted', { reason: action.type === 'repeat' ? 'repeat' : 'restart' })
    return { ...createExecution(definition), events: restarted.events, nextSequence: restarted.nextSequence, attempt: restarted.attempt }
  }
  if (action.type === 'interrupt' && state.status === 'in-progress' && state.phase !== 'completed' && state.phase !== 'paused') {
    return { ...record(state, 'mission_interrupted'), phase: 'paused', status: 'interrupted', resumePhase: state.phase, feedback: null }
  }
  if (action.type === 'resume' && state.phase === 'paused' && state.resumePhase) {
    let resumed: ExecutionState = { ...record(state, 'mission_resumed'), phase: state.resumePhase, status: 'in-progress', resumePhase: null, feedback: { code: 'practice-resumed', tone: 'info' } }
    if (resumed.phase === 'activity') resumed = record(resumed, 'step_started')
    return resumed
  }
  if (action.type === 'previous' && (state.phase === 'activity' || state.phase === 'instructions')) {
    const previous = record(state, 'previous_step_requested')
    const checkpoint = state.history.at(-1)
    if (state.phase === 'activity' && checkpoint) {
      return record({ ...previous, activity: checkpoint, history: state.history.slice(0, -1), awaitingRetry: false, feedback: { code: 'previous-step', tone: 'info' } }, 'step_started')
    }
    return { ...previous, phase: state.phase === 'activity' ? 'instructions' : 'presentation', awaitingRetry: false, feedback: { code: 'previous-step', tone: 'info' } }
  }
  if (action.type !== 'activity') return state
  const isDisplayUndo = state.phase === 'completed' && action.action.kind === 'reading' && action.action.type === 'undo-adjustments'
  if (state.phase !== 'activity' && !isDisplayUndo) return state
  const result = definition.kind === 'navigation' && state.activity.kind === 'navigation' && action.action.kind === 'navigation'
    ? validateNavigation(state.activity, action.action, definition)
    : definition.kind === 'reading' && state.activity.kind === 'reading' && action.action.kind === 'reading'
      ? validateReading(state.activity, action.action, definition)
      : definition.kind === 'communication' && state.activity.kind === 'communication' && action.action.kind === 'communication'
        ? validateCommunication(state.activity, action.action, definition)
        : definition.kind === 'search' && state.activity.kind === 'search' && action.action.kind === 'search' ? validateSearch(state.activity, action.action, definition) : definition.kind === 'information-check' && state.activity.kind === 'information-check' && action.action.kind === 'information-check' ? validateInformation(state.activity, action.action, definition) : definition.kind === 'privacy-decision' && state.activity.kind === 'privacy-decision' && action.action.kind === 'privacy-decision' ? validatePrivacy(state.activity, action.action, definition) : null
  if (!result) return state
  let next = state
  if (state.awaitingRetry) next = record(next, 'new_attempt', { action: action.action.type })
  next = record(next, 'action_performed', { action: action.action.type })
  if (result.incorrect) next = record(next, 'attempt_incorrect', { action: action.action.type })
  const stepChanged = result.activity.step !== state.activity.step
  const isUndo = (action.action.kind === 'reading' && action.action.type === 'undo-adjustments') || (action.action.kind === 'communication' && action.action.type === 'edit-draft') || (action.action.kind === 'search' && ['refine-search', 'edit-result'].includes(action.action.type)) || (action.action.kind === 'information-check' && ['revise-investigation', 'edit-decision'].includes(action.action.type)) || (action.action.kind === 'privacy-decision' && ['edit-privacy', 'revise-preparation'].includes(action.action.type))
  if (stepChanged && !result.incorrect && !isUndo) next = record(next, 'step_completed', { action: action.action.type })
  let history = state.history
  if (stepChanged && !result.incorrect && !isUndo) history = [...history, state.activity].slice(-20)
  if (stepChanged && isUndo) {
    // Desfazer é revisão, não conclusão. Descarta checkpoints posteriores ao destino.
    for (let index = history.length - 1; index >= 0; index--) {
      if (history[index].step === result.activity.step) { history = history.slice(0, index); break }
    }
  }
  next = { ...next, activity: result.activity, history, feedback: result.feedback, awaitingRetry: result.incorrect }
  const complete = definition.criteria.every(({ id }) => next.activity.criteria.includes(id))
  if (complete && state.phase !== 'completed') {
    next = { ...next, phase: 'completed', status: 'completed', awaitingRetry: false, feedback: { ...result.feedback, tone: 'success' } }
    next = record(next, 'mission_completed')
  } else if (stepChanged && state.phase === 'activity') next = record(next, 'step_started')
  return next
}
