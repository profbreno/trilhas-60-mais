import { openPracticeOptions } from '../test/disclosures'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { trails } from '../data/curriculum'
import { getOfficialMissionPath, navigationMission, readingMission } from '../data/demoMissions'
import { missionPath } from '../domain/curriculumPaths'

const renderAt = (path = '/trilhas') => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

describe('Percurso integrado', () => {
  it('apresenta as três trilhas, dez unidades e vinte nós em uma ordem linear', () => {
    const { container } = renderAt()
    expect([...container.querySelectorAll('.path-section h2')].map(e => e.textContent)).toEqual(trails.map(t => t.title))
    expect([...container.querySelectorAll('.path-unit h3')].map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `percurso-u${String(i + 1).padStart(2, '0')}`))
    const nodes = [...container.querySelectorAll('.path-mission-link')]
    expect(nodes.map(e => e.id)).toEqual(Array.from({ length: 20 }, (_, i) => `no-M${String(i + 1).padStart(2, '0')}`))
    expect(container.querySelectorAll('.path-node svg[aria-hidden="true"]')).toHaveLength(20)
    expect(container.querySelectorAll('.path-connector[aria-hidden="true"]')).toHaveLength(20)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('preserva todos os links oficiais e comunica modalidade e disponibilidade por texto', () => {
    renderAt()
    for (const trail of trails) for (const unit of trail.units) for (const mission of unit.missions) {
      const link = screen.getByRole('link', { name: new RegExp(`${mission.id}.*${mission.title}`) })
      expect(link).toHaveAttribute('href', missionPath(trail, unit, mission))
      expect(link).toHaveTextContent(mission.mode === 'guided' ? 'A — Aprendizagem guiada' : 'B — Aplicação')
      expect(link).toHaveTextContent(['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10'].includes(mission.id) ? 'Disponível · Abrir micromissão' : 'Em desenvolvimento · Ver proposta')
      expect(link).not.toHaveAttribute('aria-disabled')
    }
    expect(screen.getAllByText('Em desenvolvimento · Ver proposta')).toHaveLength(10)
  })

  it.each([navigationMission, readingMission])('abre $id com uma única seleção, sem página intermediária', async definition => {
    const user = userEvent.setup()
    renderAt()
    const node = screen.getByRole('link', { name: new RegExp(`${definition.id}.*${definition.content.title}`) })
    node.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { level: 1, name: definition.content.title })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Começar a prática' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveFocus()
  })

  it('mantém as propostas não implementadas navegáveis e sem motor', async () => {
    const user = userEvent.setup()
    renderAt()
    await user.click(screen.getByRole('link', { name: /M11.*Em desenvolvimento/ }))
    expect(screen.getByRole('heading', { name: 'Atividade em desenvolvimento' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Começar a prática' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Voltar ao percurso' }))
    expect(screen.getByRole('heading', { level: 3, name: /U06/ })).toHaveFocus()
  })

  it('leva aos atalhos por teclado e à primeira missão disponível com foco', async () => {
    const user = userEvent.setup()
    renderAt()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Ir para o conteúdo principal' })).toHaveFocus()
    const nav = screen.getByRole('navigation', { name: 'Atalhos do percurso' })
    await user.click(within(nav).getByText('Escolher outra trilha', { selector: 'summary' }))
    await user.click(within(nav).getByRole('link', { name: /Trilha 03:/ }))
    expect(screen.getByRole('heading', { level: 2, name: trails[2].title })).toHaveFocus()
    await user.click(screen.getByRole('link', { name: 'Ir à primeira missão disponível' }))
    expect(screen.getByRole('link', { name: /M01.*Disponível/ })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: /M02.*Disponível/ })).toHaveFocus()
  })

  it.each([navigationMission, readingMission])('retorna de $id interrompida à U01 no percurso', async definition => {
    const user = userEvent.setup()
    renderAt(getOfficialMissionPath(definition))
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    await openPracticeOptions(user)
    await user.click(screen.getByRole('button', { name: 'Interromper a prática' }))
    await user.click(screen.getByRole('link', { name: 'Voltar ao percurso da U01' }))
    expect(screen.getByRole('heading', { level: 3, name: /U01/ })).toHaveFocus()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('retorna após conclusão sem atribuir conquista ou conclusão aos nós', async () => {
    const user = userEvent.setup()
    renderAt(getOfficialMissionPath(navigationMission))
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    for (const name of ['Recados do bairro', 'Voltar à tela inicial da simulação', 'Calendário', 'Voltar à tela inicial da simulação', 'Recados do bairro', 'Voltar à tela inicial da simulação']) await user.click(screen.getByRole('button', { name }))
    expect(screen.getByRole('heading', { name: 'Prática concluída nesta demonstração' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Voltar ao percurso da U01' }))
    expect(screen.getByRole('heading', { level: 3, name: /U01/ })).toHaveFocus()
    expect(screen.getByRole('link', { name: /M01.*Disponível/ })).not.toHaveTextContent('Concluída')
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('restaura região e foco ao abrir diretamente um hash de unidade', () => {
    renderAt('/trilhas#percurso-u10')
    expect(screen.getByRole('heading', { level: 3, name: /U10/ })).toHaveFocus()
  })
})
