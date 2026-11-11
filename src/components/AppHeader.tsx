import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'

/** A marca é decorativa neste link, cujo nome acessível já identifica o destino. */
export function AppHeader({ brandAsset }: { brandAsset?: ReactNode }) {
  return <header className="site-header"><div className="container flex flex-wrap items-center justify-between gap-4">
    <Link className="brand" to="/" aria-label="Trilhas 60+, início">{brandAsset ?? <BrandLogo context="header" size="small" decorative />}</Link>
    <nav aria-label="Navegação principal" className="flex flex-wrap gap-3 sm:gap-6">
      <NavLink end to="/">Percurso</NavLink>
    </nav>
  </div></header>
}
