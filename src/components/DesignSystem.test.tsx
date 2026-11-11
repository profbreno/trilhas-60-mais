import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AccessibleButton } from './AccessibleButton'
import { HelpButton } from './HelpButton'
import { ProgressIndicator } from './ProgressIndicator'
import { StatusMessage, AchievementBadge } from './StatusMessage'
import { EmptyState } from './EmptyState'

describe('Componentes compartilhados', () => {
  it('distingue ação de navegação e impede acionamento quando desabilitado', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<MemoryRouter><AccessibleButton onClick={onClick}>Rever</AccessibleButton><AccessibleButton disabled onClick={onClick}>Indisponível</AccessibleButton><AccessibleButton to="/trilhas/seguranca" variant="secondary">Ir à trilha</AccessibleButton></MemoryRouter>)
    expect(screen.getByRole('button', { name: 'Rever' })).toHaveAttribute('type', 'button')
    await user.click(screen.getByRole('button', { name: 'Rever' }))
    await user.click(screen.getByRole('button', { name: 'Indisponível' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('link', { name: 'Ir à trilha' })).toHaveAttribute('href', '/trilhas/seguranca')
  })

  it('abre e fecha ajuda pelo teclado mantendo o foco no controle', async () => {
    const user = userEvent.setup()
    render(<HelpButton><p>Você pode voltar à unidade.</p></HelpButton>)
    const button = screen.getByRole('button', { name: 'Ajuda nesta página' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(button.getAttribute('aria-controls')!)).not.toBeVisible()
    await user.tab()
    await user.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Você pode voltar à unidade.')).toBeVisible()
    await user.keyboard(' ')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveFocus()
  })

  it('não apresenta uma barra quando não há progresso registrado', () => {
    render(<ProgressIndicator label="Seu caminho" />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.getByText('Progresso não registrado nesta demonstração.')).toBeInTheDocument()
  })

  it('aceita contagens explícitas para integração futura e rejeita contagens inválidas', () => {
    const { rerender } = render(<ProgressIndicator label="Seu caminho" value={1} total={2} />)
    expect(screen.getByRole('progressbar', { name: 'Seu caminho' })).toHaveAttribute('value', '1')
    expect(screen.getByText('1 de 2 atividades concluídas')).toBeInTheDocument()
    rerender(<ProgressIndicator label="Seu caminho" value={3} total={2} />)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('anuncia mensagens somente quando solicitado e mantém informação textual', () => {
    const { rerender } = render(<StatusMessage title="Conteúdo de exemplo">Nada é registrado.</StatusMessage>)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    rerender(<StatusMessage tone="success" announce title="Exemplo de feedback">Você pode rever o conteúdo.</StatusMessage>)
    expect(screen.getByRole('status')).toHaveTextContent('Exemplo de feedback')
    rerender(<StatusMessage tone="error" announce title="Não foi possível abrir">Tente voltar ao início.</StatusMessage>)
    expect(screen.getByRole('alert')).toHaveTextContent('Tente voltar ao início.')
  })

  it('apresenta estado vazio e conquista simbólica com texto', () => {
    render(<><EmptyState title="Conteúdo em preparação"><p>Volte à trilha para explorar.</p></EmptyState><AchievementBadge label="Exemplo de conquista" /></>)
    expect(screen.getByRole('heading', { level: 2, name: 'Conteúdo em preparação' })).toBeInTheDocument()
    expect(screen.getByText('Exemplo de conquista')).toBeInTheDocument()
  })
})
