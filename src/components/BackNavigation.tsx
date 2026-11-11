import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function BackNavigation({ to, children }: { to: string; children: string }) {
  return <Link className="back-link" to={to}><ArrowLeft aria-hidden="true" />{children}</Link>
}
