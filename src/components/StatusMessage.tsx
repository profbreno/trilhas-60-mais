import type { ReactNode } from 'react'
import { CircleCheck, Info, CircleAlert, Award } from 'lucide-react'

export function StatusMessage({ tone = 'info', title, children, announce = false }: {
  tone?: 'info' | 'success' | 'error'; title?: string; children: ReactNode; announce?: boolean
}) {
  const Icon = { info: Info, success: CircleCheck, error: CircleAlert }[tone]
  return <div className={`status-message status-message--${tone}`} role={announce ? (tone === 'error' ? 'alert' : 'status') : undefined}>
    <Icon aria-hidden="true" /><div>{title && <p className="status-title">{title}</p>}{children}</div>
  </div>
}

export function AchievementBadge({ label }: { label: string }) {
  return <span className="achievement-badge"><Award aria-hidden="true" />{label}</span>
}
