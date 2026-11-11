import { ArrowRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Trail, Unit, Mission } from '../domain/curriculum'
import { TrailIcon } from './TrailIcon'
import { trailPath, unitPath } from '../domain/curriculumPaths'

export function TrailCard({ trail }: { trail: Trail }) {
  return <article className={`trail-card ${trail.theme}`}>
    <div className="flex items-center justify-between gap-4"><TrailIcon theme={trail.theme} /><span className="trail-number">TRILHA {trail.number}</span></div>
    <h3>{trail.title}</h3><p>{trail.description}</p>
    <p className="card-meta"><BookOpen size={19} aria-hidden="true" />{trail.units.length} unidades · {trail.units.length * 2} micromissões</p>
    <Link className="card-link" to={trailPath(trail)}>Conhecer a trilha<span className="sr-only">: {trail.title}</span><ArrowRight aria-hidden="true" /></Link>
  </article>
}

export function UnitCard({ unit, trail }: { unit: Unit; trail: Trail }) {
  return <article className="content-card"><p className="eyebrow">UNIDADE {unit.id} · {unit.missions.length} MICROMISSÕES</p><h3>{unit.title}</h3><p>{unit.description}</p>
    <Link className="card-link" to={unitPath(trail, unit)}>Conhecer a unidade<span className="sr-only">: {unit.title}</span><ArrowRight aria-hidden="true" /></Link>
  </article>
}

export function MissionCard({ mission, unitPath }: { mission: Mission; unitPath: string }) {
  return <article className="content-card"><p className="eyebrow">{mission.id} · {mission.mode === 'guided' ? 'A — APRENDIZAGEM GUIADA' : 'B — APLICAÇÃO CONTEXTUALIZADA'} · DEMONSTRAÇÃO</p><h3>{mission.title}</h3><p>{mission.objective}</p>
    <Link className="card-link" to={`${unitPath}/missoes/${mission.slug}`}>Ver a micromissão<span className="sr-only">: {mission.title}</span><ArrowRight aria-hidden="true" /></Link>
  </article>
}
