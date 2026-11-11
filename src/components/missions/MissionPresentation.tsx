import type { Feedback, MissionDefinition } from '../../domain/missions/types'
import { AccessibleButton } from '../AccessibleButton'
import { ProgressIndicator } from '../ProgressIndicator'
import { StatusMessage, AchievementBadge } from '../StatusMessage'

export function MissionProgress({ criteria, completed }: { criteria: MissionDefinition['criteria']; completed: readonly string[] }) {
  return <><ProgressIndicator label="Objetivos desta prática" value={completed.length} total={criteria.length} unitLabel="objetivos praticados" />
    <ul className="criteria-list">{criteria.map((criterion) => <li key={criterion.id}><span>{completed.includes(criterion.id) ? 'Praticado' : 'A praticar'}</span> — {criterion.label}</li>)}</ul>
  </>
}

export function MissionFeedback({ feedback, text, revision }: { feedback: Feedback | null; text: string; revision: number }) {
  return <div role="status" aria-live="polite" aria-atomic="true" className="mission-feedback">
    {feedback && <StatusMessage key={revision} tone={feedback.tone}><p>{text}</p></StatusMessage>}
  </div>
}

export function MissionCompletion({ recognition, onRepeat }: { recognition: string; onRepeat: () => void }) {
  return <><AchievementBadge label="Caminho praticado" /><p>{recognition}</p><p>Este reconhecimento é apenas desta demonstração. Não é uma nota ou resultado dos testes da pesquisa.</p><AccessibleButton onClick={onRepeat}>Repetir a micromissão</AccessibleButton></>
}
