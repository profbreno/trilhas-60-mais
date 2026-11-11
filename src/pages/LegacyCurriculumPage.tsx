import { trails, getUnitById } from '../data/curriculum'
import type { LegacyCurriculumRoute } from '../data/legacyCurriculum'
import { trailPath, unitPath } from '../domain/curriculumPaths'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { PageHeader } from '../components/PageHeader'
import { StatusMessage } from '../components/StatusMessage'
import { AccessibleButton } from '../components/AccessibleButton'
import { BackNavigation } from '../components/BackNavigation'

export function LegacyCurriculumPage({ entry }: { entry: LegacyCurriculumRoute }) {
  return <div className="container detail-page">
    <Breadcrumbs items={[{ label: 'Início', to: '/' }, { label: 'Endereço do currículo anterior' }]} />
    <PageHeader eyebrow="CURRÍCULO ATUALIZADO" title="O currículo foi reorganizado" description={`Este endereço apresentava “${entry.title}” na demonstração anterior.`} />
    <StatusMessage>Os conteúdos foram revisados e reorganizados. Este endereço não foi associado automaticamente a uma nova missão, porque os objetivos e cenários mudaram.</StatusMessage>
    <p>Não há progresso de participantes para transferir. Você pode conhecer o currículo atual pelos caminhos abaixo.</p>
    <h2>Conteúdos relacionados no currículo atual</h2>
    <p>Estas unidades tratam de assuntos relacionados. Não são versões equivalentes da atividade anterior.</p>
    <ul className="content-list">{entry.relatedUnitIds.map((id) => {
      const unit = getUnitById(id)
      const trail = trails.find((item) => item.id === unit?.trailId)
      return unit && trail ? <li key={id}><AccessibleButton variant="secondary" to={unitPath(trail, unit)}>{unit.id} — {unit.title}</AccessibleButton></li> : null
    })}</ul>
    <h2>Trilhas do currículo atual</h2>
    <ul className="content-list">{trails.map((trail) => <li key={trail.id}><AccessibleButton variant="secondary" to={trailPath(trail)}>{trail.title}</AccessibleButton></li>)}</ul>
    <BackNavigation to="/">Voltar ao início</BackNavigation>
  </div>
}
