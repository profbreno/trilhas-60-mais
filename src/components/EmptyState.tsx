import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return <section className="empty-state"><BookOpen aria-hidden="true" /><h2>{title}</h2><div>{children}</div></section>
}
