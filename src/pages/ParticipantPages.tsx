import { LearningPath } from '../components/LearningPath'
import { PageHeader } from '../components/PageHeader'
import { AccessibleButton } from '../components/AccessibleButton'

export function TrailsPage() {
  return <>
    <div className="container path-intro"><PageHeader eyebrow="PERCURSO COMPLETO" title="Suas trilhas" description="Escolha uma micromissão e pratique no seu tempo. Não há ordem obrigatória." /></div>
    <LearningPath />
  </>
}

export function AchievementsPage() {
  return <div className="container participant-page">
    <PageHeader eyebrow="SUAS PRÁTICAS" title="Conquistas" description="Cada prática é uma oportunidade de aprender e tentar de novo." />
    <section className="content-card" aria-labelledby="conquistas-titulo">
      <h2 id="conquistas-titulo">Seu caminho, no seu tempo</h2>
      <p>Nesta demonstração, não há histórico de conquistas salvo. Ao concluir uma micromissão, você verá o reconhecimento da prática naquela página.</p>
      <p>Ao sair ou recarregar, a prática recomeça. Não há pontos, ranking ou perda por inatividade.</p>
      <AccessibleButton to="/trilhas">Escolher uma prática</AccessibleButton>
    </section>
  </div>
}
