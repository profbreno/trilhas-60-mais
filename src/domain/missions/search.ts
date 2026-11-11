import type { ActivityResult, SearchAction, SearchDefinition, SearchState } from './types'

export const initialSearch = (): SearchState => ({ kind: 'search', step: 'query', terms: [], executedTerms: [], needsRefinement: false, refined: false, opened: [], activeId: null, origins: [], dates: [], compared: false, selectedId: null, reminder: { day: null, location: null, origin: null }, saved: false, criteria: [] })
export const pertinentQuery = (terms: readonly string[], d: SearchDefinition) => d.rules.requiredTerms.every(id => terms.includes(id)) && !terms.includes('outro')
export const searchResults = (s: SearchState, d: SearchDefinition) => (s.executedTerms.includes('outro') ? [] : pertinentQuery(s.executedTerms, d) ? d.content.specificIds : d.content.genericIds).map(id => d.content.results.find(r => r.id === id)!).filter(Boolean)
const add = (values: readonly string[], id: string) => [...new Set([...values, id])]

export function validateSearch(s: SearchState, a: SearchAction, d: SearchDefinition): ActivityResult {
  const result = (activity: SearchState, code: string, incorrect = false): ActivityResult => ({ activity, feedback: { code, tone: incorrect ? 'error' : 'info' }, incorrect })
  if (a.type === 'refine-search' && (s.step === 'results' || s.step === 'collection')) return result({ ...initialSearch(), terms: s.terms, needsRefinement: s.needsRefinement || !pertinentQuery(s.executedTerms, d), refined: s.refined }, 'refine')
  if (a.type === 'edit-result' && s.step === 'collection') return result({ ...s, step: 'results', selectedId: null, saved: false, reminder: { day: null, location: null, origin: null }, criteria: s.criteria.filter(c => c === 'query') }, 'edit')
  if (s.step === 'query') {
    if (a.type === 'toggle-term' && d.content.terms.some(t => t.id === a.id)) return result({ ...s, terms: s.terms.includes(a.id) ? s.terms.filter(id => id !== a.id) : [...s.terms, a.id] }, 'term')
    if (a.type === 'run-search') {
      if (!s.terms.length) return result(s, 'empty', true)
      const relevant = pertinentQuery(s.terms, d)
      return result({ ...s, step: 'results', executedTerms: [...s.terms], needsRefinement: s.needsRefinement || !relevant, refined: s.needsRefinement && relevant, criteria: relevant ? ['query'] : [] }, relevant ? 'specific' : 'generic', !relevant)
    }
  }
  if (s.step === 'results') {
    const visible = searchResults(s, d)
    if (a.type === 'open-result' && visible.some(r => r.id === a.id)) return result({ ...s, activeId: a.id, opened: add(s.opened, a.id) }, 'opened')
    if ((a.type === 'inspect-origin' || a.type === 'inspect-date') && s.activeId) return result({ ...s, [a.type === 'inspect-origin' ? 'origins' : 'dates']: add(a.type === 'inspect-origin' ? s.origins : s.dates, s.activeId) }, a.type === 'inspect-origin' ? 'origin' : 'date')
    if (a.type === 'compare-results') {
      if (s.opened.length < d.rules.comparisonCount) return result(s, 'compare-first', true)
      return result({ ...s, compared: true }, 'compared')
    }
    if (a.type === 'select-result' && visible.some(r => r.id === a.id)) {
      if (!s.opened.includes(a.id)) return result(s, 'open-first', true)
      const chosen = visible.find(r => r.id === a.id)!
      if (a.id !== d.rules.relevantId) return result({ ...s, selectedId: null }, chosen.issue, true)
      return result({ ...s, selectedId: a.id }, 'selected')
    }
    if (a.type === 'organize-result') {
      if (!pertinentQuery(s.executedTerms, d)) return result(s, 'generic', true)
      if (s.needsRefinement && !s.refined) return result(s, 'generic', true)
      if (s.selectedId !== d.rules.relevantId) return result(s, 'select-first', true)
      if (d.mode === 'contextual' && (!s.compared || !s.origins.includes(s.selectedId) || !s.dates.includes(s.selectedId))) return result(s, 'verify-first', true)
      return result({ ...s, step: 'collection', criteria: ['query', 'selected'] }, 'organize')
    }
  }
  if (s.step === 'collection') {
    if (a.type === 'set-reminder' && !s.saved && d.content.reminder[a.field].some(c => c.id === a.id)) return result({ ...s, reminder: { ...s.reminder, [a.field]: a.id } }, 'reminder')
    if (a.type === 'save-result') {
      if (d.mode === 'contextual' && Object.values(s.reminder).some(id => id !== 'correct')) return result(s, 'reminder-wrong', true)
      return result({ ...s, saved: true }, 'saved')
    }
    if (a.type === 'recover-result') {
      if (!s.saved) return result(s, 'save-first', true)
      return result({ ...s, step: 'done', criteria: ['query', 'selected', 'recovered'] }, 'search-done')
    }
  }
  return result(s, 'use-current-step', true)
}
