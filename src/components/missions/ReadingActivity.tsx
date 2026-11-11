import type { ReadingAction, ReadingDefinition, ReadingState, Presentation } from '../../domain/missions/types'
import { AccessibleButton } from '../AccessibleButton'

export function ReadingPreview({ definition, state }: { definition: ReadingDefinition; state: ReadingState }) {
  const invitation = definition.content.invitation
  return <section className={`invitation-preview invitation-preview--${state.settings.presentation} ${state.settings.brightness === 'comfortable' ? 'invitation-preview--comfortable' : ''}`} aria-label="Convite fictício">
    <p className="simulation-caption">Convite fictício</p>
    <h3>{invitation.title}</h3>
    <dl><dt>Dia</dt><dd>{invitation.date}</dd><dt>Horário</dt><dd>{invitation.time}</dd><dt>Local</dt><dd>{invitation.location}</dd></dl>
    <p className="preview-state">Brilho simulado: {state.settings.brightness === 'comfortable' ? 'confortável' : 'padrão'}. Volume simulado: {state.settings.volume === 'audible' ? 'audível' : 'silenciado'}. Nenhum som é reproduzido.</p>
  </section>
}

export function ReadingActivity({ definition, state, onAction }: {
  definition: ReadingDefinition; state: ReadingState; onAction: (action: ReadingAction) => void
}) {
  return <><div className={`reading-workspace reading-workspace--${state.step}`}>
    {state.step === 'settings' && <form className="simulation-settings" onSubmit={(event) => { event.preventDefault(); onAction({ kind: 'reading', type: 'apply-settings' }) }}>
      <fieldset><legend>Apresentação do texto</legend>
        {([['standard', 'Padrão'], ['enlarged', 'Texto ampliado'], ['reading', 'Modo de leitura']] as const).map(([value, label]) => <label className="simulation-option" key={value}>
          <input type="radio" name="presentation" value={value} checked={state.settings.presentation === value} onChange={() => onAction({ kind: 'reading', type: 'set-presentation', presentation: value as Presentation })} />{label}
        </label>)}
      </fieldset>
      <details className="reading-extra"><summary>Outros ajustes simulados</summary>
      <fieldset><legend>Brilho simulado</legend>
        {([['standard', 'Brilho padrão'], ['comfortable', 'Brilho confortável']] as const).map(([value, label]) => <label className="simulation-option" key={value}>
          <input type="radio" name="brightness" value={value} checked={state.settings.brightness === value} onChange={() => onAction({ kind: 'reading', type: 'set-brightness', brightness: value })} />{label}
        </label>)}
      </fieldset>
      <fieldset><legend>Volume simulado</legend>
        {([['quiet', 'Silenciado'], ['audible', 'Volume audível']] as const).map(([value, label]) => <label className="simulation-option" key={value}>
          <input type="radio" name="volume" value={value} checked={state.settings.volume === value} onChange={() => onAction({ kind: 'reading', type: 'set-volume', volume: value })} />{label}
        </label>)}
      </fieldset>
      <p>Todos os ajustes são representações e afetam somente a prévia. As instruções e o aparelho permanecem disponíveis.</p>
      </details>
      <AccessibleButton type="submit">Aplicar ajustes e ler o convite</AccessibleButton>
    </form>}
    <ReadingPreview definition={definition} state={state} />
    {state.step === 'difficulty' && <div className="simulation-actions">
      <AccessibleButton variant="secondary" onClick={() => onAction({ kind: 'reading', type: 'identify-difficulty', difficulty: 'text' })}>Quero melhorar a leitura do texto</AccessibleButton>
      <AccessibleButton variant="secondary" onClick={() => onAction({ kind: 'reading', type: 'identify-difficulty', difficulty: 'sound' })}>Quero aumentar o som</AccessibleButton>
    </div>}
    {state.step === 'read' && <fieldset className="simulation-settings"><legend>Onde será o encontro?</legend>
      <div className="simulation-actions">{definition.content.locations.map((location) => <AccessibleButton key={location.id} variant="secondary" onClick={() => onAction({ kind: 'reading', type: 'select-location', locationId: location.id })}>{location.label}</AccessibleButton>)}</div>
    </fieldset>}
    </div>{state.step !== 'difficulty' && <AccessibleButton variant="quiet" onClick={() => onAction({ kind: 'reading', type: 'undo-adjustments' })}>Desfazer ajustes da prévia</AccessibleButton>}
  </>
}
