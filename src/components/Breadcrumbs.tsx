import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return <nav aria-label="Você está aqui" className="breadcrumbs"><ol>
    {items.map((item, index) => <li key={item.label}>
      {index > 0 && <ChevronRight size={16} aria-hidden="true" />}
      {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
    </li>)}
  </ol></nav>
}
