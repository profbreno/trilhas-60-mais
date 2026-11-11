import { useEffect, useRef } from 'react'
import type { SearchAction, SearchDefinition, SearchState } from '../../domain/missions/types'
import { searchResults } from '../../domain/missions/search'
import { AccessibleButton } from '../AccessibleButton'

export function SearchActivity({ definition: d, state: s, onAction }: { definition: SearchDefinition; state: SearchState; onAction: (action: SearchAction) => void }) {
  const act = (type: 'run-search' | 'refine-search' | 'inspect-origin' | 'inspect-date' | 'compare-results' | 'organize-result' | 'save-result' | 'recover-result' | 'edit-result') => onAction({ kind: 'search', type })
  const selected = d.content.results.find(r => r.id === s.selectedId)
  const active = d.content.results.find(r => r.id === s.activeId)
  const results = searchResults(s, d)
  const details = useRef<HTMLElement>(null)
  const collection = useRef<HTMLElement>(null)
  useEffect(() => { if (s.saved && s.step === 'collection') collection.current?.focus() }, [s.saved, s.step])
  useEffect(() => { if (s.activeId && s.step === 'results') details.current?.focus() }, [s.activeId, s.step])
  return <div className="search-simulation">
    <p><strong>Pedido:</strong> {d.content.request}</p>
    <p className="mission-memory-note">{d.content.reference}</p>
    {s.step === 'query' && <form aria-label="Pesquisa simulada" aria-describedby="search-query" onSubmit={e => { e.preventDefault(); act('run-search') }}>
      <fieldset><legend>Palavras para pesquisar</legend><div className="simulation-actions">{d.content.terms.map(t => <AccessibleButton key={t.id} type="button" variant="secondary" aria-pressed={s.terms.includes(t.id)} onClick={() => onAction({ kind: 'search', type: 'toggle-term', id: t.id })}>{s.terms.includes(t.id) ? 'Remover' : 'Adicionar'} {t.label}</AccessibleButton>)}</div></fieldset>
      <p id="search-query"><strong>Consulta:</strong> {s.terms.map(id => d.content.terms.find(t => t.id === id)!.label).join(' · ') || 'Nenhuma palavra escolhida'}</p>
      <AccessibleButton type="submit">Pesquisar na simulação</AccessibleButton>
    </form>}
    {s.step === 'results' && <>
      <p id="executed-query"><strong>Busca realizada:</strong> {s.executedTerms.map(id => d.content.terms.find(t => t.id === id)!.label).join(' · ')}</p>
      <AccessibleButton variant="secondary" onClick={() => act('refine-search')}>Refinar busca</AccessibleButton>
      <section aria-labelledby="search-results" aria-describedby="executed-query">
        <h3 id="search-results">Resultados da simulação ({results.length})</h3>
        {!results.length && <p>Nenhum resultado para estas palavras. Refine a consulta conforme o pedido.</p>}
        <ol className="search-results">{results.map(r => <li key={r.id}><article aria-labelledby={`result-${r.id}`}>
          <h4 id={`result-${r.id}`}>{r.title}</h4><p>{r.description}</p><p>Origem: {r.origin}<br />Atualização: {r.updated}</p>
          <AccessibleButton variant="secondary" aria-expanded={s.activeId === r.id} aria-controls="result-details" onClick={() => { onAction({ kind: 'search', type: 'open-result', id: r.id }); details.current?.focus() }}>Abrir detalhes: {r.title}</AccessibleButton>
        </article></li>)}</ol>
      </section>
      <section ref={details} id="result-details" aria-label="Detalhes do resultado" tabIndex={-1}>
        {active && <><h3>{active.title}</h3><p>{active.body}</p><dl><dt>Local</dt><dd>{active.location}</dd><dt>Dia</dt><dd>{active.day}</dd><dt>Custo</dt><dd>{active.cost}</dd><dt>Origem</dt><dd>{active.origin}</dd><dt>Atualização</dt><dd>{active.updated}</dd></dl>
          <div className="simulation-actions"><AccessibleButton variant="secondary" aria-expanded={s.origins.includes(active.id)} aria-controls="origin-detail" onClick={() => act('inspect-origin')}>Consultar origem</AccessibleButton><AccessibleButton variant="secondary" aria-expanded={s.dates.includes(active.id)} aria-controls="date-detail" onClick={() => act('inspect-date')}>Consultar atualidade</AccessibleButton></div>
          <p id="origin-detail" hidden={!s.origins.includes(active.id)}>{active.originDetail}</p><p id="date-detail" hidden={!s.dates.includes(active.id)}>{active.dateDetail}</p>
          <AccessibleButton variant="secondary" onClick={() => onAction({ kind: 'search', type: 'select-result', id: active.id })}>Escolher este resultado</AccessibleButton>
        </>}
      </section>
      {d.mode === 'contextual' && <><AccessibleButton variant="secondary" aria-expanded={s.compared} aria-controls="comparison" onClick={() => act('compare-results')}>Comparar resultados abertos</AccessibleButton>
        <section id="comparison" hidden={!s.compared} aria-label="Comparação dos resultados"><h3>Compare as informações</h3><ul className="search-results">{d.content.results.filter(r => s.opened.includes(r.id)).map(r => <li key={r.id}><h4>{r.title}</h4><p>{r.location} · {r.day} · {r.cost}</p><p>Origem: {r.origin}<br />Atualização: {r.updated}</p></li>)}</ul></section></>}
      <p><strong>Escolha:</strong> {selected?.title ?? 'Nenhum resultado escolhido'}</p>
      <AccessibleButton onClick={() => act('organize-result')}>Organizar resultado escolhido</AccessibleButton>
    </>}
    {(s.step === 'collection' || s.step === 'done') && selected && <section ref={collection} tabIndex={-1} aria-label={s.step === 'done' ? 'Resultado recuperado' : 'Coleção temporária'}>
      <h3>{s.step === 'done' ? 'Resultado recuperado' : 'Coleção temporária'}</h3><h4>{selected.title}</h4><p>{selected.body}</p><p>Origem: {selected.origin}<br />Atualização: {selected.updated}</p>
      {d.mode === 'contextual' && <>{s.step === 'collection' && !s.saved ? <fieldset><legend>Lembrete da oficina</legend>{(['day', 'location', 'origin'] as const).map(field => <div className="search-reminder-field" key={field}><label htmlFor={`reminder-${d.id}-${field}`}>{({ day: 'Dia do lembrete', location: 'Local do lembrete', origin: 'Fonte do lembrete' })[field]}</label><select id={`reminder-${d.id}-${field}`} aria-describedby={`chosen-${d.id}-${field}`} value={s.reminder[field] ?? ''} onChange={e => onAction({ kind: 'search', type: 'set-reminder', field, id: e.target.value })}><option value="" disabled>Escolha um cartão</option>{d.content.reminder[field].map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select><span id={`chosen-${d.id}-${field}`}>Cartão escolhido: {d.content.reminder[field].find(c => c.id === s.reminder[field])?.label ?? 'nenhum'}</span></div>)}</fieldset> : <dl>{(['day', 'location', 'origin'] as const).map(field => <div key={field}><dt>{({ day: 'Dia', location: 'Local', origin: 'Fonte' })[field]}</dt><dd>{d.content.reminder[field].find(c => c.id === s.reminder[field])?.label}</dd></div>)}</dl>}</>}
      {s.step === 'collection' && <><p>{s.saved ? 'Guardado nesta página; falta recuperar para conferir.' : 'Ainda não guardado.'}</p><div className="simulation-actions">{!s.saved && <AccessibleButton onClick={() => act('save-result')}>Guardar na coleção temporária</AccessibleButton>}{s.saved && <AccessibleButton onClick={() => act('recover-result')}>Reabrir resultado guardado</AccessibleButton>}<AccessibleButton variant="secondary" onClick={() => act('edit-result')}>Rever escolha e organização</AccessibleButton></div></>}
    </section>}
  </div>
}
