import { useEffect, useRef, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { AppHeader } from './AppHeader'
import { BrandLogo } from './BrandLogo'
import { ParticipantNavigation } from './ParticipantNavigation'

export function AppLayout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)
  useEffect(() => {
    const heading = mainRef.current?.querySelector('h1')
    document.title = `${heading?.textContent ?? 'Página'} | Trilhas 60+`
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) {
      target.focus()
      target.scrollIntoView({ block: 'start' })
    } else if (previousPath.current !== pathname) {
      mainRef.current?.focus()
      window.scrollTo(0, 0)
    }
    previousPath.current = pathname
  }, [pathname, hash])
  return <>
    <a href="#conteudo" className="skip-link">Ir para o conteúdo principal</a>
    <AppHeader />
    <main id="conteudo" ref={mainRef} tabIndex={-1}>{children}</main>
    <footer className="site-footer"><div className="container flex flex-wrap justify-between gap-6">
      <div><BrandLogo context="footer" size="medium" variant="transparente" /><p>Aprender é um caminho para toda a vida.</p></div>
      <div><p>Protótipo de pesquisa em Educação.</p><p>Demonstração sem cadastro e sem coleta de dados pessoais.</p><Link to="/#sobre">Sobre este projeto <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    </div></footer>
    <ParticipantNavigation />
  </>
}
