import { useLocation, useParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { getTrailBySlug } from '../data/curriculum'
import { demoUnit, getMissionDefinition } from '../data/demoMissions'
import { MissionRunner } from '../components/missions/MissionRunner'
import { getLegacyCurriculumRoute } from '../data/legacyCurriculum'
import { trailPath, unitPath, pathUnitAnchor } from '../domain/curriculumPaths'
import { LegacyCurriculumPage } from './LegacyCurriculumPage'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { TrailIcon } from '../components/TrailIcon'
import { PageHeader } from '../components/PageHeader'
import { UnitCard, MissionCard } from '../components/CurriculumCards'
import { AccessibleButton } from '../components/AccessibleButton'
import { BackNavigation } from '../components/BackNavigation'
import { StatusMessage } from '../components/StatusMessage'
import { ProgressIndicator } from '../components/ProgressIndicator'
import { HelpButton } from '../components/HelpButton'
import { EmptyState } from '../components/EmptyState'

export function NotFoundPage() {
  return <div className="container detail-page"><PageHeader eyebrow="PÁGINA NÃO ENCONTRADA" title="Vamos encontrar o caminho?" description="Este endereço não corresponde a um conteúdo da demonstração." /><AccessibleButton to="/">Voltar ao início</AccessibleButton></div>
}

function CurriculumFallback() {
  const { pathname } = useLocation()
  const entry = getLegacyCurriculumRoute(pathname)
  return entry ? <LegacyCurriculumPage entry={entry} /> : <NotFoundPage />
}

export function TrailPage() {
  const { trailSlug } = useParams()
  const trail = getTrailBySlug(trailSlug)
  if (!trail) return <NotFoundPage />
  return <div className="container detail-page">
    <Breadcrumbs items={[{ label: 'Início', to: '/' }, { label: trail.title }]} />
    <TrailIcon theme={trail.theme} />
    <PageHeader eyebrow={`TRILHA ${trail.number} · DEMONSTRAÇÃO`} title={trail.title} description={trail.description} />
    <StatusMessage>Currículo aprovado para implementação, em demonstração. Você pode explorar as unidades na ordem que preferir.</StatusMessage>
    <HelpButton><p>As unidades aparecem na ordem pedagógica proposta. Escolha “Conhecer a unidade” para ver suas duas micromissões. Nenhuma unidade está bloqueada.</p></HelpButton>
    <ProgressIndicator label="Seu caminho nesta trilha" />
    <h2>Unidades desta trilha</h2><ol className="content-list">
      {trail.units.map((unit) => <li key={unit.id}><UnitCard unit={unit} trail={trail} /></li>)}
    </ol>
    {trail.units.length === 0 && <EmptyState title="Unidades em preparação"><p>Os conteúdos desta trilha ainda estão sendo organizados.</p></EmptyState>}
    <BackNavigation to="/">Voltar ao início</BackNavigation>
  </div>
}

export function UnitPage() {
  const { trailSlug, unitSlug } = useParams()
  const trail = getTrailBySlug(trailSlug)
  const unit = trail?.units.find((item) => item.slug === unitSlug)
  if (!trail || !unit) return <CurriculumFallback />
  const currentTrailPath = trailPath(trail)
  return <div className="container detail-page">
    <Breadcrumbs items={[{ label: 'Início', to: '/' }, { label: trail.title, to: currentTrailPath }, { label: unit.title }]} />
    <PageHeader eyebrow={`UNIDADE ${unit.id} · DEMONSTRAÇÃO`} title={unit.title} description={unit.description} />
    <StatusMessage>{unit.missions.some(m => getMissionDefinition(m.id)) ? `${unit.missions.filter(m => getMissionDefinition(m.id)).map(m => m.id).join(' e ')} podem ser praticadas aqui com telas fictícias, sem ordem obrigatória. O progresso fica somente na página aberta.` : 'Estas micromissões têm conteúdo aprovado para implementação. As atividades desta unidade continuam informativas, sem execução.'}</StatusMessage>
    <HelpButton><p>Escolha “Ver a micromissão” para conhecer seu objetivo. Use “Voltar à trilha” para rever as unidades. Você não precisa seguir uma ordem obrigatória.</p></HelpButton>
    <ProgressIndicator label="Seu caminho nesta unidade" />
    <h2>Micromissões para conhecer</h2><ol className="content-list">
      {unit.missions.map((mission) => <li key={mission.id}><MissionCard mission={mission} unitPath={unitPath(trail, unit)} /></li>)}
    </ol>
    {unit.missions.length === 0 && <EmptyState title="Micromissões em preparação"><p>As propostas de atividade ainda estão sendo organizadas.</p></EmptyState>}
    {unit.id === 'U01' && <><h2>Complemento presencial da U01</h2><p>{demoUnit.complement}</p></>}
    <BackNavigation to={currentTrailPath}>Voltar à trilha</BackNavigation>
  </div>
}

export function MissionPage() {
  const { trailSlug, unitSlug, missionSlug } = useParams()
  const trail = getTrailBySlug(trailSlug)
  const unit = trail?.units.find((item) => item.slug === unitSlug)
  const mission = unit?.missions.find((item) => item.slug === missionSlug)
  if (!trail || !unit || !mission) return <CurriculumFallback />
  const currentTrailPath = trailPath(trail)
  const currentUnitPath = unitPath(trail, unit)
  const definition = getMissionDefinition(mission.id)
  return <div className={`container detail-page ${definition ? 'mission-page' : ''}`}>
    {!definition && <Breadcrumbs items={[{ label: 'Início', to: '/' }, { label: trail.title, to: currentTrailPath }, { label: unit.title, to: currentUnitPath }, { label: mission.title }]} />}
    <PageHeader eyebrow={`${unit.id} · ${mission.id} · ${mission.mode === 'guided' ? 'A — Guiada' : 'B — Aplicação'}`} title={mission.title} />
    {!definition && <BackNavigation to={`/trilhas#${pathUnitAnchor(unit.id)}`}>Voltar ao percurso</BackNavigation>}
    {definition ? <>
      <p className="simulation-notice">Simulação: nada será alterado no seu aparelho. Sem limite de tempo.</p>
      <MissionRunner key={`${definition.id}:${definition.version}`} definition={definition} unitPath={currentUnitPath} />
      {mission.id !== 'M01' && mission.id !== 'M02' && <details className="mission-details"><summary>Localização da missão</summary>
        <p>{mission.mode === 'guided' ? 'A — Aprendizagem guiada' : 'B — Aplicação contextualizada'}</p>
        <Breadcrumbs items={[{ label: 'Início', to: '/' }, { label: trail.title, to: currentTrailPath }, { label: unit.title, to: currentUnitPath }, { label: mission.title }]} />
      </details>}
    </> : <>
    <section className="content-card mission-objective" aria-labelledby="objetivo"><BookOpen aria-hidden="true" /><h2 id="objetivo">O que vamos aprender</h2><p>{mission.objective}</p></section>
    <section className="content-card mission-objective" aria-labelledby="cenario"><h2 id="cenario">Situação de exemplo</h2><p>{mission.scenario}</p></section>
    <StatusMessage><h2>Atividade em desenvolvimento</h2><p>Esta página apresenta o objetivo e o cenário aprovados. A execução interativa não está disponível neste percurso curricular.</p><p>Não é necessário inserir dados, acessar contas ou usar senhas reais. Nenhuma resposta ou progresso é registrado.</p></StatusMessage>
    <p>Na proposta do projeto, você poderá praticar novamente sem penalização e contar com a mediação presencial para tirar dúvidas.</p>
    <HelpButton><p>Esta tela apresenta apenas o objetivo da micromissão. Não há respostas a enviar. Você pode voltar à unidade e explorar outra proposta. Durante a intervenção, poderá pedir apoio à pessoa mediadora.</p></HelpButton>
    <BackNavigation to={currentUnitPath}>Voltar à unidade</BackNavigation>
    </>}
  </div>
}
