import { trails } from '../data/curriculum'
import { TrailCard } from '../components/CurriculumCards'
import { LearningPath } from '../components/LearningPath'
import { StatusMessage } from '../components/StatusMessage'
import { AccessibleButton } from '../components/AccessibleButton'
import { demoUnit } from '../data/demoMissions'

export function HomePage() {
  return <>
    <section className="path-intro container">
      <h1>Seu percurso</h1>
      <p>Escolha uma micromissão e pratique no seu tempo.</p>
      <StatusMessage><strong>Você está em uma demonstração.</strong></StatusMessage>
    </section>
    <LearningPath />
    <section className="container section-space" aria-labelledby="outras-formas">
      <h2 id="outras-formas">Outras formas de conhecer o conteúdo</h2>
      <p>Se preferir, consulte as páginas de apresentação das trilhas e unidades.</p>
      <AccessibleButton to={demoUnit.path} variant="secondary">Experimentar as atividades da U01</AccessibleButton>
      <div className="grid gap-6 lg:grid-cols-3 section-space">{trails.map(trail => <TrailCard key={trail.id} trail={trail} />)}</div>
    </section>
    <section id="sobre" tabIndex={-1} className="container about section-space" aria-labelledby="sobre-titulo">
      <p className="eyebrow">SOBRE O PROJETO</p><h2 id="sobre-titulo">Tecnologia que aproxima e amplia possibilidades</h2>
      <p>O Trilhas 60+ é um protótipo educacional de uma pesquisa de doutorado em Educação. A proposta prevê 12 semanas de aprendizagem, com encontros presenciais e atividades digitais mediadas.</p>
      <p>Os exemplos são fictícios. A acessibilidade e a experiência de uso ainda precisam ser avaliadas com pessoas idosas e tecnologias assistivas.</p>
      <details><summary>Sobre esta demonstração</summary><p>Versão 0.1.0-dev. M01–M10 estão disponíveis. As demais atividades estão em desenvolvimento. Não há cadastro nem salvamento do progresso.</p></details>
    </section>
  </>
}
