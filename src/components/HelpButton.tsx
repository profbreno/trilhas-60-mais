import { useId, useState, type ReactNode } from 'react'
import { CircleHelp } from 'lucide-react'
import { AccessibleButton } from './AccessibleButton'

export function HelpButton({ children, onOpen }: { children: ReactNode; onOpen?: () => void }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return <div className="context-help">
    <AccessibleButton variant="secondary" aria-expanded={open} aria-controls={id} onClick={() => { if (!open) onOpen?.(); setOpen(!open) }}>
      <CircleHelp aria-hidden="true" />Ajuda nesta página
    </AccessibleButton>
    <div id={id} hidden={!open} className="help-content">{children}</div>
  </div>
}
