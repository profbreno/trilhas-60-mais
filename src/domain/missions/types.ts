import type { MissionId, UnitId } from '../curriculum'

export type NavigationStep = 'find' | 'return-first' | 'detour' | 'recover' | 'return-final' | 'done'
export type ReadingStep = 'difficulty' | 'settings' | 'read' | 'done'
export type CommunicationStep = 'prepare' | 'preview' | 'done'
export type SearchStep = 'query' | 'results' | 'collection' | 'done'
export type InformationStep = 'investigate' | 'decide' | 'review' | 'done'
export type PrivacyStep = 'prepare' | 'protect' | 'review' | 'done'
export interface PrivacyChoice { id: string; label: string; detail?: string }
export interface PublicationField { id: string; label: string; value: string; explanation: string; image?: { src: string; alt: string } }
export interface PrivacyDefinition extends MissionBase {
  kind: 'privacy-decision'; mode: 'account' | 'publication'
  rules: { strategyId: string; strategyReasons: readonly string[]; roleId: string; refusalIds: readonly string[]; codeReasons: readonly string[]; purposeId: string; audienceId: string; requiredFields: readonly string[]; privateFields: readonly string[]; publicationReasons: readonly string[] }
  content: MissionContent<PrivacyStep> & {
    request: string; guidance: string; strategies: readonly PrivacyChoice[]; strategyReasons: readonly PrivacyChoice[]
    code: string; solicitation: string; roles: readonly PrivacyChoice[]; refusals: readonly PrivacyChoice[]; codeReasons: readonly PrivacyChoice[]
    fields: readonly PublicationField[]; purposes: readonly PrivacyChoice[]; audiences: readonly PrivacyChoice[]; publicationReasons: readonly PrivacyChoice[]
  }
}
export interface PrivacyState {
  kind: 'privacy-decision'; step: PrivacyStep; guidanceRead: boolean; compared: boolean
  strategyId: string | null; strategyReasons: readonly string[]; secondFactor: boolean; roleId: string | null; usedInAccess: boolean; blockedSend: boolean; refusalId: string | null; codeReasons: readonly string[]
  inspected: readonly string[]; activeField: string | null; included: readonly string[]; purposeId: string | null; audienceId: string | null; publicationReasons: readonly string[]
  reviewed: boolean; criteria: readonly string[]
}
export type PrivacyAction =
  | { kind: 'privacy-decision'; type: 'choose-strategy' | 'toggle-strategy-reason' | 'choose-code-role' | 'choose-refusal' | 'toggle-code-reason' | 'inspect-field' | 'toggle-field' | 'choose-purpose' | 'choose-audience' | 'toggle-publication-reason'; id: string }
  | { kind: 'privacy-decision'; type: 'acknowledge-privacy-review'; checked: boolean }
  | { kind: 'privacy-decision'; type: 'consult-guidance' | 'compare-strategies' | 'continue-protection' | 'activate-second-factor' | 'use-code-in-access' | 'attempt-send-code' | 'prepare-privacy-review' | 'edit-privacy' | 'revise-preparation' | 'confirm-privacy' }
export type InformationVerdict = 'confirmed' | 'contradicted' | 'unverified'
export interface InformationEvidence {
  id: string; title: string; source: string; author: string; date: string; context: string; body: string
  role: 'origin' | 'date' | 'reference' | 'repetition'
}
export interface InformationDefinition extends MissionBase {
  kind: 'information-check'
  mode: 'investigation' | 'sharing'
  rules: { verdict: InformationVerdict; requiredEvidence: readonly string[]; requiredReasons: readonly string[]; acceptedConduct: readonly string[]; acceptedResponses: readonly string[]; acceptedNextSteps: readonly string[] }
  content: MissionContent<InformationStep> & {
    claim: string; received: string; reference: string; evidence: readonly InformationEvidence[]
    reasons: readonly { id: string; label: string }[]
    conduct: readonly { id: string; label: string }[]
    responses: readonly { id: string; label: string }[]
    nextSteps: readonly { id: string; label: string }[]
    synthesis: string
  }
}
export interface InformationState {
  kind: 'information-check'; step: InformationStep; opened: readonly string[]; activeId: string | null
  compared: boolean; verdict: InformationVerdict | null; reasons: readonly string[]
  conductId: string | null; responseId: string | null; nextStepId: string | null; reviewed: boolean; criteria: readonly string[]
}
export type InformationAction =
  | { kind: 'information-check'; type: 'open-evidence' | 'toggle-reason' | 'choose-conduct' | 'choose-response' | 'choose-next-step'; id: string }
  | { kind: 'information-check'; type: 'choose-verdict'; verdict: InformationVerdict }
  | { kind: 'information-check'; type: 'acknowledge-review'; checked: boolean }
  | { kind: 'information-check'; type: 'compare-evidence' | 'prepare-review' | 'revise-investigation' | 'edit-decision' | 'finalize-decision' }
export interface SearchResult {
  id: string; title: string; description: string; origin: string; updated: string
  originDetail: string; dateDetail: string; location: string; day: string; cost: string; body: string
  issue: 'current' | 'outdated' | 'incomplete' | 'elsewhere'
}
export interface SearchDefinition extends MissionBase {
  kind: 'search'
  mode: 'guided' | 'contextual'
  rules: { requiredTerms: readonly string[]; relevantId: string; comparisonCount: number }
  content: MissionContent<SearchStep> & {
    request: string; reference: string
    terms: readonly { id: string; label: string }[]
    results: readonly SearchResult[]
    genericIds: readonly string[]; specificIds: readonly string[]
    reminder: { day: readonly { id: string; label: string }[]; location: readonly { id: string; label: string }[]; origin: readonly { id: string; label: string }[] }
  }
}
export interface SearchState {
  kind: 'search'; step: SearchStep; terms: readonly string[]; executedTerms: readonly string[]
  needsRefinement: boolean; refined: boolean; opened: readonly string[]; activeId: string | null
  origins: readonly string[]; dates: readonly string[]; compared: boolean; selectedId: string | null
  reminder: { day: string | null; location: string | null; origin: string | null }
  saved: boolean; criteria: readonly string[]
}
export type SearchAction =
  | { kind: 'search'; type: 'toggle-term' | 'open-result' | 'select-result'; id: string }
  | { kind: 'search'; type: 'set-reminder'; field: 'day' | 'location' | 'origin'; id: string }
  | { kind: 'search'; type: 'run-search' | 'refine-search' | 'inspect-origin' | 'inspect-date' | 'compare-results' | 'organize-result' | 'save-result' | 'recover-result' | 'edit-result' }
export type Presentation = 'standard' | 'enlarged' | 'reading'
export interface StepCopy { title: string; instruction: string; help: string }
export interface MissionContent<Step extends string> {
  title: string
  objective: string
  introduction: string
  instructions: readonly string[]
  help: string
  steps: Readonly<Record<Step, StepCopy>>
  feedback: Readonly<Record<string, string>>
  recognition: string
}
interface MissionBase {
  id: MissionId
  routeId: string
  unitId: UnitId
  version: string
  criteria: readonly { id: string; label: string }[]
}
export interface NavigationDefinition extends MissionBase {
  kind: 'navigation'
  rules: { targetApp: string; detourApp: string }
  content: MissionContent<NavigationStep> & { apps: Readonly<Record<string, { title: string; body: string }>> }
}
export interface ReadingDefinition extends MissionBase {
  kind: 'reading'
  rules: { correctLocationId: string }
  content: MissionContent<ReadingStep> & {
    invitation: { title: string; date: string; time: string; location: string }
    locations: readonly { id: string; label: string }[]
  }
}
export interface CommunicationChoice { id: string; label: string }
export interface SimulatedFile extends CommunicationChoice {
  type: string
  description: string
  body: string
  image?: { src: string; alt: string }
  privateExample?: boolean
}
export interface CommunicationDefinition extends MissionBase {
  kind: 'communication'
  mode: 'message' | 'file'
  rules: { recipientId: string; acceptedContentIds: readonly string[]; fileId?: string }
  content: MissionContent<CommunicationStep> & {
    request: string
    recipients: readonly CommunicationChoice[]
    phrases: readonly CommunicationChoice[]
    greetings?: readonly CommunicationChoice[]
    closings?: readonly CommunicationChoice[]
    files?: readonly SimulatedFile[]
  }
}
export type MissionDefinition = NavigationDefinition | ReadingDefinition | CommunicationDefinition | SearchDefinition | InformationDefinition | PrivacyDefinition
export interface NavigationState {
  kind: 'navigation'
  step: NavigationStep
  screen: 'home' | 'app'
  appId: string | null
  recoveredViaHome: boolean
  criteria: readonly string[]
}
export interface ReadingSettings { presentation: Presentation; brightness: 'standard' | 'comfortable'; volume: 'quiet' | 'audible' }
export interface ReadingState {
  kind: 'reading'
  step: ReadingStep
  settings: ReadingSettings
  criteria: readonly string[]
}
export interface CommunicationState {
  kind: 'communication'
  step: CommunicationStep
  recipientId: string | null
  contentId: string | null
  greetingId: string | null
  closingId: string | null
  fileId: string | null
  inspectedFileId: string | null
  format: 'text' | 'audio'
  audioReviewed: boolean
  reviewed: boolean
  criteria: readonly string[]
}
export type ActivityState = NavigationState | ReadingState | CommunicationState | SearchState | InformationState | PrivacyState
export type NavigationAction = { kind: 'navigation'; type: 'open-app'; appId: string } | { kind: 'navigation'; type: 'go-home' }
export type ReadingAction =
  | { kind: 'reading'; type: 'identify-difficulty'; difficulty: 'text' | 'sound' }
  | { kind: 'reading'; type: 'set-presentation'; presentation: Presentation }
  | { kind: 'reading'; type: 'set-brightness'; brightness: ReadingSettings['brightness'] }
  | { kind: 'reading'; type: 'set-volume'; volume: ReadingSettings['volume'] }
  | { kind: 'reading'; type: 'apply-settings' }
  | { kind: 'reading'; type: 'undo-adjustments' }
  | { kind: 'reading'; type: 'select-location'; locationId: string }
export type CommunicationAction =
  | { kind: 'communication'; type: 'select-recipient' | 'select-content' | 'select-greeting' | 'select-closing' | 'select-file'; id: string }
  | { kind: 'communication'; type: 'set-format'; format: 'text' | 'audio' }
  | { kind: 'communication'; type: 'set-review'; checked: boolean }
  | { kind: 'communication'; type: 'inspect-file' | 'remove-attachment' | 'review-audio' | 'open-preview' | 'edit-draft' | 'simulate-send' }
export type ActivityAction = NavigationAction | ReadingAction | CommunicationAction | SearchAction | InformationAction | PrivacyAction
export interface Feedback { code: string; tone: 'info' | 'success' | 'error' }
export interface ActivityResult { activity: ActivityState; feedback: Feedback; incorrect: boolean }
export type ExecutionPhase = 'presentation' | 'instructions' | 'activity' | 'completed' | 'paused'
export type DemoEventType = 'mission_started' | 'step_started' | 'action_performed' | 'help_requested' | 'attempt_incorrect' | 'step_completed' | 'mission_completed' | 'mission_restarted' | 'new_attempt' | 'mission_interrupted' | 'mission_resumed' | 'previous_step_requested'
export interface DemoEvent {
  sequence: number
  source: 'local-demo'
  missionId: MissionId
  unitId: UnitId
  definitionVersion: string
  schemaVersion: 2
  attempt: number
  type: DemoEventType
  step: ExecutionPhase | NavigationStep | ReadingStep | CommunicationStep | SearchStep | InformationStep | PrivacyStep
  action?: ActivityAction['type']
  reason?: 'repeat' | 'restart'
}
export interface ExecutionState {
  missionId: MissionId
  unitId: UnitId
  definitionVersion: string
  phase: ExecutionPhase
  status: 'not-started' | 'in-progress' | 'completed' | 'interrupted'
  resumePhase: 'presentation' | 'instructions' | 'activity' | null
  history: readonly ActivityState[]
  activity: ActivityState
  feedback: Feedback | null
  awaitingRetry: boolean
  events: readonly DemoEvent[]
  nextSequence: number
  attempt: number
}
export type ExecutionAction = { type: 'start-mission' | 'start-activity' | 'repeat' | 'restart' | 'previous' | 'interrupt' | 'resume' | 'help' } | { type: 'activity'; action: ActivityAction }
