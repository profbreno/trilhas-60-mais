import type { ReactNode } from 'react'

export function PageHeader({ eyebrow, title, description, children }: {
  eyebrow: string; title: string; description?: string; children?: ReactNode
}) {
  return <header className="page-header"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>
    {description && <p className="detail-lead">{description}</p>}{children}
  </header>
}
