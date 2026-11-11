import { PrivacyDecisionActivity } from './PrivacyDecisionActivity'
import { InformationCheckActivity } from './InformationCheckActivity'
import { useEffect, useRef } from 'react'
import type { MissionDefinition } from '../../domain/missions/types'
import { useMissionExecution } from '../../app/useMissionExecution'
import { AccessibleButton } from '../AccessibleButton'
import { HelpButton } from '../HelpButton'
import { MissionCompletion, MissionFeedback, MissionProgress } from './MissionPresentation'
import { BackNavigation } from '../BackNavigation'
import { NavigationActivity } from './NavigationActivity'
import { ReadingActivity } from './ReadingActivity'
import { CommunicationActivity } from './CommunicationActivity'
import { SearchActivity } from './SearchActivity'
import { pathUnitAnchor } from '../../domain/curriculumPaths'

export function MissionRunner({ definition, unitPath }: { definition: MissionDefinition; unitPath: string }) {
  const [state, dispatch] = useMissionExecution(definition)
  const heading = useRef<HTMLHeadingElement>(null)
  const screenKey = state.activity.kind === 'navigation' ? `${state.activity.screen}-${state.activity.appId ?? 'home'}` : 'reading'
  const locationKey = `${state.phase}-${state.activity.step}-${screenKey}-${state.attempt}`
  const previousLocation = useRef(locationKey)
  useEffect(() => {
    if (previousLocation.current !== locationKey) heading.current?.focus()
    previousLocation.current = locationKey
  }, [locationKey])

  const step = definition.kind === 'navigation' && state.activity.kind === 'navigation'
    ? definition.content.steps[state.activity.step]
    : definition.kind === 'reading' && state.activity.kind === 'reading'
      ? definition.content.steps[state.activity.step]
      : definition.kind === 'communication' && state.activity.kind === 'communication' ? definition.content.steps[state.activity.step] : definition.kind === 'search' && state.activity.kind === 'search' ? definition.content.steps[state.activity.step] : definition.kind === 'information-check' && state.activity.kind === 'information-check' ? definition.content.steps[state.activity.step] : definition.kind === 'privacy-decision' && state.activity.kind === 'privacy-decision' ? definition.content.steps[state.activity.step] : null
  const titles = { presentation: 'O que vamos praticar', instructions: 'Como participar', activity: step?.title ?? 'Prática', completed: 'Prática concluída nesta demonstração', paused: 'Prática interrompida nesta página' }
  // Agrupamento visual das tarefas; não altera etapas, critérios nem eventos do motor.
  const stage = state.activity.kind === 'navigation'
    ? { find: 1, 'return-first': 2, detour: 2, recover: 2, 'return-final': 3, done: 3 }[state.activity.step]
    : state.activity.kind === 'reading' ? { difficulty: 1, settings: 2, read: 3, done: 3 }[state.activity.step] : state.activity.kind === 'communication' ? { prepare: 1, preview: 2, done: 3 }[state.activity.step] : state.activity.kind === 'search' ? { query: 1, results: 2, collection: 3, done: 3 }[state.activity.step] : state.activity.kind === 'information-check' ? { investigate: 1, decide: 2, review: 3, done: 3 }[state.activity.step] : { prepare: 1, protect: 2, review: 3, done: 3 }[state.activity.step]

  return <section className="mission-runner" aria-label="Execução demonstrativa da micromissão">
    {(state.phase === 'activity' || state.phase === 'completed') && <p className="mission-stage">Etapa {stage} de 3</p>}
    <h2 ref={heading} tabIndex={-1} className="mission-step-heading">{titles[state.phase]}</h2>
    {state.phase === 'presentation' && <>
      <p>{definition.content.objective}</p><p>{definition.content.introduction}</p>
      <AccessibleButton onClick={() => dispatch({ type: 'start-mission' })}>Conhecer a atividade</AccessibleButton>
    </>}
    {state.phase === 'instructions' && <>
      <ol className="mission-instructions">{definition.content.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
      <AccessibleButton onClick={() => dispatch({ type: 'start-activity' })}>Começar a prática</AccessibleButton>
    </>}
    {state.phase === 'paused' && <>
      <p>Você pode fazer uma pausa e retomar no mesmo ponto enquanto esta página permanecer aberta. Sair ou recarregar descarta a prática, sem penalização.</p>
      <AccessibleButton onClick={() => dispatch({ type: 'resume' })}>Retomar a prática</AccessibleButton>
    </>}
    {(state.phase === 'activity' || state.phase === 'completed') && <>
      {state.phase === 'activity' && <p className="mission-current-instruction">{state.activity.kind === 'reading' && state.activity.step === 'settings' ? 'Escolha texto ampliado ou modo de leitura e aplique.' : step?.instruction}</p>}
      {state.phase === 'completed' && <MissionCompletion recognition={definition.content.recognition} onRepeat={() => dispatch({ type: 'repeat' })} />}
      {definition.kind === 'navigation' && state.activity.kind === 'navigation' && <NavigationActivity definition={definition} state={state.activity} onAction={(action) => dispatch({ type: 'activity', action })} completed={state.phase === 'completed'} />}
      {definition.kind === 'reading' && state.activity.kind === 'reading' && <ReadingActivity definition={definition} state={state.activity} onAction={(action) => dispatch({ type: 'activity', action })} />}
      {definition.kind === 'communication' && state.activity.kind === 'communication' && <CommunicationActivity definition={definition} state={state.activity} onAction={action => dispatch({ type: 'activity', action })} />}
      {definition.kind === 'search' && state.activity.kind === 'search' && <SearchActivity definition={definition} state={state.activity} onAction={action => dispatch({ type: 'activity', action })} />}
      {definition.kind === 'information-check' && state.activity.kind === 'information-check' && <InformationCheckActivity definition={definition} state={state.activity} onAction={action => dispatch({ type: 'activity', action })} />}
      {definition.kind === 'privacy-decision' && state.activity.kind === 'privacy-decision' && <PrivacyDecisionActivity definition={definition} state={state.activity} onAction={action => dispatch({ type: 'activity', action })} />}
    </>}
    <MissionFeedback feedback={state.feedback} revision={state.nextSequence} text={state.feedback ? definition.content.feedback[state.feedback.code] ?? 'Você pode rever o passo atual e consultar a ajuda.' : ''} />
    <HelpButton key={locationKey} onOpen={() => dispatch({ type: 'help' })}><p>{state.phase === 'activity' || state.phase === 'completed' ? step?.help : definition.content.help}</p></HelpButton>
    <div className="simulation-actions">
      {(state.phase === 'instructions' || state.phase === 'activity') && <AccessibleButton variant="secondary" onClick={() => dispatch({ type: 'previous' })}>Voltar à etapa anterior</AccessibleButton>}
      <BackNavigation to={`/#${pathUnitAnchor(definition.unitId)}`}>{`Voltar ao percurso da ${definition.unitId}`}</BackNavigation>
    </div>
    <p className="mission-memory-note">Ao sair ou recarregar, esta prática recomeça.</p>
    {(state.status === 'in-progress' || state.status === 'interrupted') && <details key={`options-${locationKey}`} className="mission-options"><summary>Opções da prática</summary>
      <div className="simulation-actions">
      {state.status === 'in-progress' && <AccessibleButton variant="secondary" onClick={() => dispatch({ type: 'interrupt' })}>Interromper a prática</AccessibleButton>}
      {(state.status === 'in-progress' || state.status === 'interrupted') && <AccessibleButton variant="quiet" onClick={() => dispatch({ type: 'restart' })}>Reiniciar a micromissão</AccessibleButton>}
      </div><p>Reiniciar começa uma nova tentativa com os ajustes e objetivos zerados. Voltar à etapa anterior permite refazer somente aquela parte.</p>
    </details>}
    <details className="mission-details"><summary>Sobre esta demonstração</summary>
      {(state.phase === 'activity' || state.phase === 'completed') && <>
        <h3>Objetivos e detalhes da prática</h3><p>{definition.content.objective}</p><p>{definition.content.introduction}</p>
        <p>{step?.instruction}</p>
        <MissionProgress criteria={definition.criteria} completed={state.activity.criteria} />
      </>}
      <p>Versão 0.1.0-dev. Todas as telas e informações são fictícias. Os ajustes afetam somente a prévia, sem alterar seu aparelho.</p>
      <p>O progresso e os eventos de teste ficam apenas na memória desta página. Ao sair ou recarregar, a prática recomeça. Não há envio ou salvamento de respostas.</p>
      <p>Você pode repetir, pedir ajuda e fazer pausas, sem penalização. A retomada funciona somente enquanto esta página estiver aberta.</p>
    </details>
    <BackNavigation to={unitPath}>Voltar à unidade</BackNavigation>
  </section>
}
