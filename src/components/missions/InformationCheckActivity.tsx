import { useEffect, useRef } from 'react'
import type { InformationAction, InformationDefinition, InformationState, InformationVerdict } from '../../domain/missions/types'
import { AccessibleButton } from '../AccessibleButton'

const verdictLabels: Readonly<Record<InformationVerdict, string>> = { confirmed: 'Confirmada pelas evidências', contradicted: 'Contradita pelas evidências', unverified: 'Ainda não verificada' }
export function InformationCheckActivity({ definition: d, state: s, onAction }: { definition: InformationDefinition; state: InformationState; onAction: (action: InformationAction) => void }) {
  const detail = useRef<HTMLElement>(null)
  useEffect(() => { if (s.activeId && s.step === 'investigate') detail.current?.focus() }, [s.activeId, s.step])
  const active = d.content.evidence.find(e => e.id === s.activeId)
  const act = (type: 'compare-evidence' | 'prepare-review' | 'revise-investigation' | 'edit-decision' | 'finalize-decision') => onAction({ kind: 'information-check', type })
  const radioGroup = (legend: string, name: string, choices: readonly { id: string; label: string }[], selected: string | null, type: 'choose-conduct' | 'choose-response' | 'choose-next-step') => <fieldset><legend>{legend}</legend>{choices.map(c => <label className="information-choice" key={c.id}><input type="radio" name={name} value={c.id} checked={selected === c.id} onChange={() => onAction({ kind: 'information-check', type, id: c.id })} /><span>{c.label}</span></label>)}</fieldset>
  return <div className="information-simulation">
    {s.step !== 'done' && <><p className="mission-memory-note">{d.content.reference}</p><figure><blockquote>{d.content.claim}</blockquote><figcaption>{d.content.received}</figcaption></figure></>}
    {s.step === 'investigate' && <>
      <div className="simulation-actions">{d.content.evidence.map(e => <AccessibleButton key={e.id} variant="secondary" aria-expanded={s.activeId === e.id} aria-controls="information-detail" onClick={() => { onAction({ kind: 'information-check', type: 'open-evidence', id: e.id }); detail.current?.focus() }}>{e.title}</AccessibleButton>)}</div>
      <p>Pistas consultadas: {s.opened.length} de {d.content.evidence.length}. Abrir pistas não conclui a investigação.</p>
      <section id="information-detail" ref={detail} tabIndex={-1} aria-label="Evidência consultada">{active && <><h3>{active.title}</h3><dl><dt>Fonte</dt><dd>{active.source}</dd><dt>Autoria</dt><dd>{active.author}</dd><dt>Data</dt><dd>{active.date}</dd></dl><p>{active.context}</p><p>{active.body}</p></>}</section>
      <AccessibleButton onClick={() => act('compare-evidence')}>Comparar evidências</AccessibleButton>
    </>}
    {s.step === 'decide' && <>
      <details className="information-comparison"><summary>Consultar comparação das fontes</summary><ul>{d.content.evidence.filter(e => s.opened.includes(e.id)).map(e => <li key={e.id}><h3>{e.title}</h3><p>Fonte: {e.source}<br />Autoria: {e.author}<br />Data: {e.date}</p><p>{e.context}</p><p>{e.body}</p></li>)}</ul></details>
      <fieldset><legend>O que as evidências permitem concluir?</legend>{(Object.keys(verdictLabels) as InformationVerdict[]).map(v => <label className="information-choice" key={v}><input type="radio" name="verdict" checked={s.verdict === v} onChange={() => onAction({ kind: 'information-check', type: 'choose-verdict', verdict: v })} /><span>{verdictLabels[v]}</span></label>)}</fieldset>
      <fieldset><legend>Quais motivos sustentam sua interpretação?</legend>{d.content.reasons.map(c => <label className="information-choice" key={c.id}><input type="checkbox" checked={s.reasons.includes(c.id)} onChange={() => onAction({ kind: 'information-check', type: 'toggle-reason', id: c.id })} /><span>{c.label}</span></label>)}</fieldset>
      {d.mode === 'sharing' && <>{radioGroup('Como proceder?', 'conduct', d.content.conduct, s.conductId, 'choose-conduct')}{radioGroup('Resposta respeitosa ao contato', 'response', d.content.responses, s.responseId, 'choose-response')}{radioGroup('Próximo passo da resposta', 'next-step', d.content.nextSteps, s.nextStepId, 'choose-next-step')}</>}
      <div className="simulation-actions"><AccessibleButton onClick={() => act('prepare-review')}>Revisar interpretação e decisão</AccessibleButton><AccessibleButton variant="secondary" onClick={() => act('revise-investigation')}>Rever evidências</AccessibleButton></div>
    </>}
    {(s.step === 'review' || s.step === 'done') && <section aria-label={s.step === 'done' ? 'Resultado da investigação' : 'Revisão da investigação'}>
      <h3>{s.step === 'done' ? 'Síntese fundamentada' : 'Sua interpretação e justificativa'}</h3><p><strong>Condição:</strong> {s.verdict && verdictLabels[s.verdict]}</p><ul>{d.content.reasons.filter(c => s.reasons.includes(c.id)).map(c => <li key={c.id}>{c.label}</li>)}</ul>
      {d.mode === 'sharing' && <><p><strong>Conduta:</strong> {d.content.conduct.find(c => c.id === s.conductId)?.label}</p><p><strong>Resposta:</strong> {d.content.responses.find(c => c.id === s.responseId)?.label}</p><p><strong>Próximo passo:</strong> {d.content.nextSteps.find(c => c.id === s.nextStepId)?.label}</p></>}
      {s.step === 'review' ? <><label className="information-choice"><input type="checkbox" checked={s.reviewed} onChange={e => onAction({ kind: 'information-check', type: 'acknowledge-review', checked: e.target.checked })} /><span>Conferi a interpretação, os motivos e a decisão desta revisão.</span></label><div className="simulation-actions"><AccessibleButton onClick={() => act('finalize-decision')}>{d.mode === 'sharing' ? 'Confirmar decisão simulada' : 'Concluir investigação'}</AccessibleButton><AccessibleButton variant="secondary" onClick={() => act('edit-decision')}>Corrigir interpretação e decisão</AccessibleButton><AccessibleButton variant="quiet" onClick={() => act('revise-investigation')}>Rever evidências</AccessibleButton></div><p>Nada será enviado ou compartilhado.</p></> : <p>{d.content.synthesis}</p>}
    </section>}
  </div>
}
