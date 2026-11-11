import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { navigationMission, readingMission, getOfficialMissionPath } from '../data/demoMissions'

const renderAt = (route = '/') => render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)

describe('Redesign da experiência do participante', () => {
  it('mantém a home curta e chega à tarefa da M01 com duas ações', async () => {
    const user = userEvent.setup()
    renderAt()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.queryByRole('link', { name: /M20/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Continuar aprendendo' }))
    expect(screen.getByRole('button', { name: 'Começar a prática' })).toBeVisible()
    expect(screen.queryByRole('navigation', { name: 'Você está aqui' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    expect(screen.getByRole('heading', { name: 'Encontre os recados' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Recados do bairro' })).toBeVisible()
  })

  it('navega pelas três abas, atualiza foco, título e seleção sem inventar conquistas', async () => {
    const user = userEvent.setup()
    renderAt()
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
    expect(within(nav).getAllByRole('link')).toHaveLength(3)
    expect(within(nav).getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page')
    for (const name of ['Trilhas', 'Conquistas', 'Início']) {
      const link = within(nav).getByRole('link', { name })
      link.focus()
      await user.keyboard('{Enter}')
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(screen.getByRole('main')).toHaveFocus()
      expect(document.title).toContain(screen.getByRole('heading', { level: 1 }).textContent)
      if (name === 'Trilhas') expect(screen.getAllByRole('link', { name: /M\d{2}.*(Disponível|Em desenvolvimento)/ })).toHaveLength(20)
      if (name === 'Conquistas') {
        expect(screen.getByText(/não há histórico de conquistas salvo/)).toBeVisible()
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      }
    }
  })

  it.each([navigationMission, readingMission])('reúne instruções em uma entrada de $id, sem concluir por consultá-las', async definition => {
    const user = userEvent.setup()
    renderAt(getOfficialMissionPath(definition))
    const instructions = screen.getByText('Como participar', { selector: 'summary' })
    await user.click(instructions)
    expect(screen.getByText(definition.content.introduction)).toBeVisible()
    for (const text of definition.content.instructions) expect(screen.getByText(text)).toBeVisible()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Prática concluída nesta demonstração' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    expect(screen.getByText('0 de 3 objetivos praticados')).toBeInTheDocument()
  })

  it.each([navigationMission, readingMission])('descarta a execução de $id ao trocar de aba e preserva os critérios', async definition => {
    const user = userEvent.setup()
    renderAt(getOfficialMissionPath(definition))
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    await user.click(screen.getByRole('button', { name: definition.id === 'M01' ? 'Recados do bairro' : 'Quero melhorar a leitura do texto' }))
    expect(screen.getByText('1 de 3 objetivos praticados')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Conquistas' }))
    expect(screen.queryByText('Caminho praticado')).not.toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Trilhas' }))
    await user.click(screen.getByRole('link', { name: new RegExp(`${definition.id}.*Disponível`) }))
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    expect(screen.getByText('0 de 3 objetivos praticados')).toBeInTheDocument()
  })
})
