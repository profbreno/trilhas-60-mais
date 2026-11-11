import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { getOfficialMissionPath, readingMission } from '../data/demoMissions'

describe('Revisão intermediária da U01 — feedback e teclado', () => {
  it('mantém foco e região de feedback ao pedir revisão de um ajuste inadequado', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={[getOfficialMissionPath(readingMission)]}><App /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    const feedback = screen.getByRole('status')
    const sound = screen.getByRole('button', { name: 'Quero aumentar o som' })
    sound.focus()
    await user.keyboard('{Enter}')
    expect(sound).toHaveFocus()
    expect(screen.getByRole('status')).toBe(feedback)
    expect(feedback).toHaveTextContent(/volume.*não muda o tamanho do texto/)
    expect(screen.getByText('0 de 3 objetivos praticados')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Quero melhorar a leitura do texto' }))
    const apply = screen.getByRole('button', { name: 'Aplicar ajustes e ler o convite' })
    apply.focus()
    await user.keyboard('{Enter}')
    expect(apply).toHaveFocus()
    expect(screen.getByRole('status')).toBe(feedback)
    expect(feedback).toHaveTextContent(/sozinhos, não resolvem o tamanho do texto/)
    expect(screen.queryByRole('group', { name: 'Onde será o encontro?' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Prática concluída nesta demonstração' })).not.toBeInTheDocument()
  })

  it('permite mudar o rádio por setas, preserva seu foco e exige reaplicar após desfazer', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={[getOfficialMissionPath(readingMission)]}><App /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    await user.click(screen.getByRole('button', { name: 'Quero melhorar a leitura do texto' }))
    screen.getByRole('radio', { name: 'Padrão' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Texto ampliado' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Texto ampliado' })).toBeChecked()
    expect(screen.getByRole('region', { name: 'Convite fictício' })).toHaveClass('invitation-preview--enlarged')
    await user.click(screen.getByRole('button', { name: 'Aplicar ajustes e ler o convite' }))
    await user.click(screen.getByRole('button', { name: 'Desfazer ajustes da prévia' }))
    expect(screen.getByRole('heading', { name: 'Experimente uma apresentação' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Padrão' })).toBeChecked()
    expect(screen.getByText('1 de 3 objetivos praticados')).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Onde será o encontro?' })).not.toBeInTheDocument()
  })
})
