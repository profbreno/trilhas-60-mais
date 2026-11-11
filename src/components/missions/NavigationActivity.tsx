import { CalendarDays, House, MessageSquare } from 'lucide-react'
import type { NavigationAction, NavigationDefinition, NavigationState } from '../../domain/missions/types'
import { AccessibleButton } from '../AccessibleButton'

export function NavigationActivity({ definition, state, onAction, completed }: {
  definition: NavigationDefinition; state: NavigationState; onAction: (action: NavigationAction) => void; completed: boolean
}) {
  const app = state.appId ? definition.content.apps[state.appId] : null
  return <section className="simulation-device" aria-label="Dispositivo fictício">
    <p className="simulation-caption">Celular fictício</p>
    <h3>{state.screen === 'home' ? 'Tela inicial da simulação' : app?.title}</h3>
    {state.screen === 'home' ? <div className="simulation-actions">
      {Object.entries(definition.content.apps).map(([id, content]) => <AccessibleButton variant="secondary" key={id} disabled={completed} onClick={() => onAction({ kind: 'navigation', type: 'open-app', appId: id })}>
        {id === definition.rules.targetApp ? <MessageSquare aria-hidden="true" /> : <CalendarDays aria-hidden="true" />}{content.title}
      </AccessibleButton>)}
    </div> : <>
      <p>{app?.body}</p>
      <AccessibleButton variant="secondary" onClick={() => onAction({ kind: 'navigation', type: 'go-home' })}><House aria-hidden="true" />Voltar à tela inicial da simulação</AccessibleButton>
    </>}
  </section>
}
