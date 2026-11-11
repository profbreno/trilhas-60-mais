import { ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { trails } from '../data/curriculum'
import { getOfficialMissionPath, navigationMission } from '../data/demoMissions'
import { TrailIcon } from '../components/TrailIcon'
import { AccessibleButton } from '../components/AccessibleButton'

export function HomePage() {
  return <div className="container participant-home">
    <div className="home-welcome">
      <p className="eyebrow">BEM-VINDO AO TRILHAS 60+</p>
      <h1>Aprenda no seu tempo.</h1>
      <p>Pequenas práticas para o seu dia a dia digital.</p>
    </div>
    <section className="continue-card" aria-labelledby="continuar-titulo">
      <p className="eyebrow">UMA PRÁTICA PARA COMEÇAR · M01</p>
      <h2 id="continuar-titulo">{navigationMission.content.title}</h2>
      <p>Explore um celular fictício e pratique como encontrar e retomar um caminho.</p>
      <AccessibleButton to={getOfficialMissionPath(navigationMission)}>Continuar aprendendo <Play size={21} aria-hidden="true" /></AccessibleButton>
      <p className="continue-note">Sem limite de tempo. Ao sair ou recarregar, a prática recomeça.</p>
    </section>
    <section className="home-trails" aria-labelledby="suas-trilhas">
      <div className="section-heading"><h2 id="suas-trilhas">Três trilhas para explorar</h2><Link className="back-link" to="/trilhas">Ver percurso completo <ArrowRight size={20} aria-hidden="true" /></Link></div>
      <div className="trail-summaries">{trails.map(trail => <article key={trail.id}>
        <Link className="trail-summary" to={`/trilhas#percurso-${trail.id}`}>
          <TrailIcon theme={trail.theme} />
          <span><span className="eyebrow">TRILHA {trail.number}</span><strong>{trail.title}</strong><span>{trail.units.length} unidades · {trail.units.length * 2} micromissões</span></span>
          <ArrowRight size={22} aria-hidden="true" />
        </Link>
      </article>)}</div>
    </section>
    <details id="sobre" tabIndex={-1} className="home-about"><summary>Sobre esta demonstração</summary>
      <p><strong>Você está em uma demonstração.</strong> Protótipo educacional de uma pesquisa de doutorado em Educação. Exemplos fictícios, sem cadastro, coleta ou salvamento de progresso.</p>
      <p>São três trilhas, dez unidades e vinte micromissões. M01–M10 estão disponíveis; M11–M20 apresentam suas propostas. A experiência ainda precisa ser avaliada com pessoas idosas e tecnologias assistivas.</p>
    </details>
  </div>
}
