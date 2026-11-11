import { BookOpen, CalendarDays, Compass, Handshake, HeartHandshake, Link as LinkIcon, MessageSquare, Search, Settings, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Mission, Trail, Unit } from '../domain/curriculum'
import { trails } from '../data/curriculum'
import { getMissionDefinition } from '../data/demoMissions'
import { missionPath, pathUnitAnchor } from '../domain/curriculumPaths'
import { HelpButton } from './HelpButton'

const unitIcons = { U01: Smartphone, U02: MessageSquare, U03: Search, U04: BookOpen, U05: ShieldCheck, U06: Handshake, U07: LinkIcon, U08: CalendarDays, U09: Settings, U10: HeartHandshake }

function PathMissionNode({ mission, unit, trail }: { mission: Mission; unit: Unit; trail: Trail }) {
  const available = Boolean(getMissionDefinition(mission.id))
  const Icon = unitIcons[unit.id]
  return <li className={`path-mission ${available ? 'path-mission--available' : ''}`}>
    <span className="path-connector" aria-hidden="true" />
    <Link id={`no-${mission.id}`} className="path-mission-link" to={missionPath(trail, unit, mission)}>
      <span className="path-node"><Icon size={28} aria-hidden="true" /><span>{mission.id}</span></span>
      <span className="path-mission-copy"><strong>{mission.title}</strong>
        <span>{mission.mode === 'guided' ? 'A — Aprendizagem guiada' : 'B — Aplicação'}</span>
        <span className="path-availability">{available ? 'Disponível · Abrir micromissão' : 'Em desenvolvimento · Ver proposta'}</span>
      </span>
    </Link>
  </li>
}

function PathUnit({ unit, trail }: { unit: Unit; trail: Trail }) {
  return <section className="path-unit" aria-labelledby={pathUnitAnchor(unit.id)}>
    <h3 id={pathUnitAnchor(unit.id)} tabIndex={-1}><span>{unit.id}</span> {unit.title}</h3>
    <ol className="path-missions">{unit.missions.map(mission => <PathMissionNode key={mission.id} mission={mission} unit={unit} trail={trail} />)}</ol>
  </section>
}

function PathSection({ trail }: { trail: Trail }) {
  return <section className={`path-section ${trail.theme}`} aria-labelledby={`percurso-${trail.id}`}>
    <div className="path-section-heading"><p className="eyebrow">TRILHA {trail.number}</p><h2 id={`percurso-${trail.id}`} tabIndex={-1}>{trail.title}</h2></div>
    {trail.units.map(unit => <PathUnit key={unit.id} unit={unit} trail={trail} />)}
  </section>
}

function PathNavigation() {
  const first = trails.flatMap(trail => trail.units.flatMap(unit => unit.missions)).find(mission => getMissionDefinition(mission.id))
  return <nav className="path-navigation" aria-label="Atalhos do percurso">
    {first && <Link className="button" to={`/#no-${first.id}`}>Ir à primeira missão disponível</Link>}
    <details><summary>Escolher outra trilha</summary>{trails.map(trail => <Link key={trail.id} to={`/#percurso-${trail.id}`}><Compass size={22} aria-hidden="true" /><span>Trilha {trail.number}: {trail.title}</span></Link>)}</details>
  </nav>
}

export function LearningPath() {
  return <div className="container learning-path" id="trilhas" tabIndex={-1}>
    <PathNavigation />
    <HelpButton><p>Escolha o nome ou o círculo de uma micromissão para abri-la. As missões marcadas como Disponível podem ser escolhidas em qualquer ordem. Nas demais, você pode conhecer a proposta. Use os atalhos para ir a uma trilha. Não há bloqueios nem limite de tempo.</p></HelpButton>
    {trails.map(trail => <PathSection key={trail.id} trail={trail} />)}
  </div>
}
