import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { trails } from '../data/curriculum'

const renderAt = (path = '/') => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

describe('Navegação da demonstração', () => {
  it('apresenta as três trilhas e o aviso de demonstração', () => {
    renderAt()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByText('Você está em uma demonstração.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para o conteúdo principal' })).toHaveAttribute('href', '#conteudo')
  })

  it('permite navegar por teclado até missão e retornar à unidade e à trilha', async () => {
    const user = userEvent.setup()
    renderAt()
    await user.tab()
    expect(screen.getByRole('link', { name: 'Ir para o conteúdo principal' })).toHaveFocus()
    const firstTrail = screen.getByRole('link', { name: /TRILHA 01 Primeiros/ })
    firstTrail.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { level: 2, name: trails[0].title })).toHaveFocus()
    await user.click(screen.getByRole('link', { name: /M01.*Encontrar os caminhos da tela/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'Encontrar os caminhos da tela' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Começar a prática' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'O que vamos praticar' })).toBeInTheDocument()
    expect(document.title).toContain('Encontrar os caminhos da tela')
    await user.click(screen.getByText('Outros caminhos', { selector: 'summary' }))
    await user.click(screen.getByRole('link', { name: 'Voltar à unidade' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Operação básica do celular' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Voltar à trilha' }))
    expect(screen.getByRole('heading', { level: 1, name: trails[0].title })).toBeInTheDocument()
  })

  it.each(trails.map((trail) => [trail.slug, trail.title]))('abre diretamente a trilha %s', (id, title) => {
    renderAt(`/trilhas/${id}`)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(within(screen.getByRole('main')).getByText(/Currículo aprovado/)).toBeInTheDocument()
  })

  it.each(['/inexistente', '/trilhas/invalida', '/trilhas/seguranca/unidades/errada', '/trilhas/seguranca/unidades/senhas/missoes/errada'])('trata o endereço inválido %s', (path) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: 'Vamos encontrar o caminho?' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Voltar ao início/ })).toHaveAttribute('href', '/')
  })
})
