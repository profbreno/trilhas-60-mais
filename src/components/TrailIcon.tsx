import { Compass, ShieldCheck, Sprout } from 'lucide-react'
import type { Trail } from '../domain/curriculum'

export function TrailIcon({ theme }: { theme: Trail['theme'] }) {
  const Icon = { green: Sprout, clay: ShieldCheck, blue: Compass }[theme]
  return <span className={`trail-icon ${theme}`}><Icon size={30} aria-hidden="true" /></span>
}
