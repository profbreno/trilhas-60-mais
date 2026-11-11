import { useEffect, useRef } from 'react'
import type { PrivacyAction, PrivacyChoice, PrivacyDefinition, PrivacyState } from '../../domain/missions/types'
import { AccessibleButton } from '../AccessibleButton'

function PublicationPreview({ definition: d, state: s }: { definition: PrivacyDefinition; state: PrivacyState }) {
  return <section id="publication-preview" tabIndex={-1} aria-label="Prévia da publicação" className="privacy-preview"><h3>Prévia da publicação</h3>
    <p>Somente nesta simulação. {s.step === 'done' ? 'Compartilhamento simulado confirmado.' : 'Nada foi publicado.'}</p>
    {d.content.fields.filter(f => s.included.includes(f.id)).map(f => <div key={f.id}><h4>{f.label}</h4><p>{f.value}</p>{f.image && <img src={f.image.src} alt={f.image.alt} />}</div>)}
    {!s.included.length && <p>Prévia vazia. O público precisa das informações da oficina.</p>}
    <p><strong>Público:</strong> {d.content.audiences.find(c => c.id === s.audienceId)?.label ?? 'Ainda não escolhido'}</p>
  </section>
}
export function PrivacyDecisionActivity({ definition: d, state: s, onAction }: { definition: PrivacyDefinition; state: PrivacyState; onAction: (a: PrivacyAction) => void }) {
  const fieldDetail = useRef<HTMLElement>(null)
  const comparison = useRef<HTMLElement>(null)
  useEffect(() => { if (s.activeField && s.step === 'prepare') fieldDetail.current?.focus() }, [s.activeField, s.step])
  useEffect(() => { if (s.compared && s.step === 'prepare' && d.mode === 'account') comparison.current?.focus() }, [s.compared, s.step, d.mode])
  const act = (type: 'consult-guidance' | 'compare-strategies' | 'continue-protection' | 'activate-second-factor' | 'use-code-in-access' | 'attempt-send-code' | 'prepare-privacy-review' | 'edit-privacy' | 'revise-preparation' | 'confirm-privacy') => onAction({ kind: 'privacy-decision', type })
  const group = (legend: string, name: string, choices: readonly PrivacyChoice[], selected: string | null, type: 'choose-strategy' | 'choose-code-role' | 'choose-refusal' | 'choose-purpose' | 'choose-audience') => <fieldset><legend>{legend}</legend>{choices.map(c => <label className="privacy-choice" key={c.id}><input type="radio" name={name} value={c.id} checked={selected === c.id} onChange={() => onAction({ kind: 'privacy-decision', type, id: c.id })} /><span>{c.label}{c.detail && <small>{c.detail}</small>}</span></label>)}</fieldset>
  const reasons = (legend: string, choices: readonly PrivacyChoice[], selected: readonly string[], type: 'toggle-strategy-reason' | 'toggle-code-reason' | 'toggle-publication-reason') => <fieldset><legend>{legend}</legend>{choices.map(c => <label className="privacy-choice" key={c.id}><input type="checkbox" checked={selected.includes(c.id)} onChange={() => onAction({ kind: 'privacy-decision', type, id: c.id })} /><span>{c.label}</span></label>)}</fieldset>
  const active = d.content.fields.find(f => f.id === s.activeField)
  return <div className="privacy-simulation">
    {s.step !== 'done' && <p><strong>Tarefa:</strong> {d.content.request}</p>}
    {s.step === 'prepare' && <>
      <AccessibleButton variant="secondary" aria-expanded={s.guidanceRead} aria-controls="privacy-guidance" onClick={() => act('consult-guidance')}>{d.mode === 'account' ? 'Consultar orientação sobre senha e código' : 'Consultar orientação sobre dados e finalidade'}</AccessibleButton>
      <p id="privacy-guidance" hidden={!s.guidanceRead}>{d.content.guidance}</p>
      {d.mode === 'account' ? <>
        <section aria-label="Conta fictícia da biblioteca" className="privacy-preview"><h3>Conta fictícia da Biblioteca Jardim</h3><p>Acesso de exemplo ainda em preparação. Nenhuma senha sua será solicitada.</p><p><strong>Estratégia:</strong> {d.content.strategies.find(c => c.id === s.strategyId)?.label ?? 'Nenhuma selecionada'}</p></section>
        <AccessibleButton variant="secondary" aria-expanded={s.compared} aria-controls="strategy-comparison" onClick={() => { act('compare-strategies'); comparison.current?.focus() }}>Comparar estratégias</AccessibleButton>
        <section id="strategy-comparison" ref={comparison} tabIndex={-1} aria-label="Comparação de estratégias" hidden={!s.compared}>
          {group('Estratégia para esta conta', 'strategy', d.content.strategies, s.strategyId, 'choose-strategy')}
          {reasons('Por que essa estratégia protege melhor?', d.content.strategyReasons, s.strategyReasons, 'toggle-strategy-reason')}
        </section>
      </> : <>
        {group('Finalidade do convite', 'purpose', d.content.purposes, s.purposeId, 'choose-purpose')}
        <h3>Informações do rascunho</h3><ul className="privacy-fields">{d.content.fields.map(f => <li key={f.id}><h4>{f.label}</h4><p>{f.value}</p><p><strong>Estado:</strong> {s.included.includes(f.id) ? 'Na prévia' : 'Retirado da prévia'}</p><div className="simulation-actions"><AccessibleButton variant="secondary" aria-expanded={s.activeField === f.id} aria-controls="privacy-field-detail" onClick={() => { onAction({ kind: 'privacy-decision', type: 'inspect-field', id: f.id }); fieldDetail.current?.focus() }}>Entender: {f.label}</AccessibleButton><AccessibleButton variant="secondary" aria-pressed={s.included.includes(f.id)} onClick={() => onAction({ kind: 'privacy-decision', type: 'toggle-field', id: f.id })}>{s.included.includes(f.id) ? 'Retirar' : 'Recolocar'}: {f.label}</AccessibleButton></div></li>)}</ul>
        <section id="privacy-field-detail" ref={fieldDetail} tabIndex={-1} aria-label="Explicação da informação">{active && <><h3>{active.label}</h3><p>{active.explanation}</p>{active.image && <img src={active.image.src} alt={active.image.alt} />}</>}</section>
        <AccessibleButton variant="secondary" onClick={() => document.getElementById('publication-preview')?.focus()}>Conferir prévia atualizada</AccessibleButton>
        <PublicationPreview definition={d} state={s} />
      </>}
      <AccessibleButton onClick={() => act('continue-protection')}>{d.mode === 'account' ? 'Continuar para proteção adicional' : 'Continuar para escolha de público'}</AccessibleButton>
    </>}
    {s.step === 'protect' && <>
      {d.mode === 'account' ? <>
        <section className="privacy-preview" aria-label="Acesso fictício em andamento"><h3>Acesso iniciado por você</h3><p><strong>Etapa adicional:</strong> {s.secondFactor ? 'Ativada na simulação' : 'Ainda não ativada'}</p><AccessibleButton variant="secondary" aria-pressed={s.secondFactor} onClick={() => act('activate-second-factor')}>Ativar etapa adicional simulada</AccessibleButton>
          {s.secondFactor && <><p><strong>Cartão de código:</strong> {d.content.code}</p><p>Neste exercício o cartão não expira; códigos reais são temporários. Não é necessário copiar ou memorizar.</p></>}
          {group('Qual é a função deste código?', 'code-role', d.content.roles, s.roleId, 'choose-code-role')}
          <AccessibleButton onClick={() => act('use-code-in-access')}>Usar código no acesso que iniciei</AccessibleButton><p>Uso no acesso simulado: {s.usedInAccess ? 'Conferido' : 'Ainda não realizado'}</p>
        </section>
        <section className="privacy-preview" aria-label="Pedido recebido na conversa"><h3>Pedido recebido na conversa</h3><p>{d.content.solicitation}</p><p>Pedido indevido de exemplo; nenhum interlocutor real.</p><AccessibleButton variant="secondary" onClick={() => act('attempt-send-code')}>Tentar enviar código pela conversa — simulação</AccessibleButton>{s.blockedSend && <p className="privacy-blocked-note">Envio bloqueado nesta simulação. Não repasse o código pela conversa; use-o somente no acesso que você iniciou.</p>}
          {group('Como responder ao pedido?', 'refusal', d.content.refusals, s.refusalId, 'choose-refusal')}
          {reasons('Por que recusar o envio?', d.content.codeReasons, s.codeReasons, 'toggle-code-reason')}
        </section>
      </> : <>
        <PublicationPreview definition={d} state={s} />
        {group('Público do convite', 'audience', d.content.audiences, s.audienceId, 'choose-audience')}
        {reasons('Por que esse público e essas informações?', d.content.publicationReasons, s.publicationReasons, 'toggle-publication-reason')}
      </>}
      <div className="simulation-actions"><AccessibleButton onClick={() => act('prepare-privacy-review')}>Revisar decisões de proteção</AccessibleButton><AccessibleButton variant="secondary" onClick={() => act('revise-preparation')}>Rever preparação</AccessibleButton></div>
    </>}
    {(s.step === 'review' || s.step === 'done') && <>
      {d.mode === 'account' ? <section className="privacy-preview" aria-label="Síntese da proteção da conta"><h3>Proteção da conta fictícia</h3><p>{d.content.strategies.find(c => c.id === s.strategyId)?.label}</p><ul>{d.content.strategyReasons.filter(c => s.strategyReasons.includes(c.id)).map(c => <li key={c.id}>{c.label}</li>)}</ul><p>Senha e código têm funções diferentes. O código de exemplo foi usado no acesso, sem repasse à conversa.</p><p>{d.content.refusals.find(c => c.id === s.refusalId)?.label}</p><ul>{d.content.codeReasons.filter(c => s.codeReasons.includes(c.id)).map(c => <li key={c.id}>{c.label}</li>)}</ul></section> : <><PublicationPreview definition={d} state={s} /><ul>{d.content.publicationReasons.filter(c => s.publicationReasons.includes(c.id)).map(c => <li key={c.id}>{c.label}</li>)}</ul></>}
      {s.step === 'review' && <><label className="privacy-choice"><input type="checkbox" checked={s.reviewed} onChange={e => onAction({ kind: 'privacy-decision', type: 'acknowledge-privacy-review', checked: e.target.checked })} /><span>Conferi a prévia e os motivos antes de confirmar.</span></label><div className="simulation-actions"><AccessibleButton onClick={() => act('confirm-privacy')}>{d.mode === 'account' ? 'Confirmar proteção simulada' : 'Confirmar compartilhamento simulado'}</AccessibleButton><AccessibleButton variant="secondary" onClick={() => act('edit-privacy')}>Corrigir decisões de proteção</AccessibleButton><AccessibleButton variant="quiet" onClick={() => act('revise-preparation')}>Rever preparação</AccessibleButton></div><p>Nenhuma conta real será acessada; nada será enviado ou publicado.</p></>}
    </>}
  </div>
}
