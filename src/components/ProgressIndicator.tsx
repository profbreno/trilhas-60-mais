import { useId } from 'react'
import { BookOpen } from 'lucide-react'

type ProgressProps = { label: string; unitLabel?: string } & (
  { value?: never; total?: never } | { value: number; total: number }
)

export function ProgressIndicator({ label, value, total, unitLabel = 'atividades concluídas' }: ProgressProps) {
  const id = useId()
  const valid = value !== undefined && total !== undefined && Number.isInteger(value) && Number.isInteger(total) && total > 0 && value >= 0 && value <= total
  return <div className="progress-indicator">
    <p id={id}><BookOpen size={20} aria-hidden="true" /><strong>{label}</strong></p>
    {valid ? <><progress aria-labelledby={id} value={value} max={total} /><p>{value} de {total} {unitLabel}</p></>
      : <p>Progresso não registrado nesta demonstração.</p>}
  </div>
}
