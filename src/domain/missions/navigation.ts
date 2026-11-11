import type { ActivityResult, NavigationAction, NavigationDefinition, NavigationState } from './types'

export const initialNavigation = (): NavigationState => ({ kind: 'navigation', step: 'find', screen: 'home', appId: null, recoveredViaHome: false, criteria: [] })

export function validateNavigation(state: NavigationState, action: NavigationAction, definition: NavigationDefinition): ActivityResult {
  const result = (activity: NavigationState, code: string, incorrect = false): ActivityResult => ({ activity, feedback: { code, tone: incorrect ? 'error' : 'info' }, incorrect })
  if (action.type === 'go-home') {
    if (state.screen === 'home') return result(state, 'already-home')
    const home = { ...state, screen: 'home' as const, appId: null }
    if (state.step === 'return-first') return result({ ...home, step: 'detour' }, 'visit-detour')
    if (state.step === 'recover') return result({ ...home, recoveredViaHome: true }, 'recover-target')
    if (state.step === 'return-final') return result({ ...home, step: 'done', criteria: [...state.criteria, 'return-home'] }, 'navigation-done')
    return result(home, 'home-again')
  }
  // Uma ação fora da tela visível não pode satisfazer o critério por chamada direta.
  if (state.screen !== 'home' || !Object.hasOwn(definition.content.apps, action.appId)) return result(state, 'use-visible-controls', true)
  const app = { ...state, screen: 'app' as const, appId: action.appId }
  if (state.step === 'find' && action.appId === definition.rules.targetApp) {
    return result({ ...app, step: 'return-first', criteria: ['open-target'] }, 'target-found')
  }
  if (state.step === 'detour' && action.appId === definition.rules.detourApp) return result({ ...app, step: 'recover' }, 'detour-opened')
  if (state.step === 'recover' && action.appId === definition.rules.targetApp && state.recoveredViaHome) {
    return result({ ...app, step: 'return-final', criteria: [...state.criteria, 'recover-path'] }, 'path-recovered')
  }
  return result(app, state.step === 'detour' ? 'need-detour' : 'wrong-app', true)
}
