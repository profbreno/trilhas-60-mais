import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { getOfficialMissionPath, navigationMission, readingMission } from '../data/demoMissions'

async function start(definition: typeof navigationMission | typeof readingMission) {
  const user = userEvent.setup()
  render(<MemoryRouter initialEntries={[getOfficialMissionPath(definition)]}><App /></MemoryRouter>)
  await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
  return user
}

describe('Refinamento UX-01 — apresentação sob demanda', () => {
  it('mantém uma navegação principal e somente a marca do cabeçalho acima do percurso', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
    expect(within(nav).getAllByRole('link').map(link => link.textContent)).toEqual(['Início', 'Trilhas', 'Conquistas'])
    expect(screen.getByRole('banner').querySelectorAll('img')).toHaveLength(1)
    expect(screen.getByRole('main').querySelectorAll('img')).toHaveLength(0)
    expect(screen.queryAllByRole('link', { name: /M\d{2}.*(Disponível|Em desenvolvimento)/ })).toHaveLength(0)
  })

  it('abre as opções e preserva foco no ciclo de interrupção por teclado', async () => {
    const user = await start(navigationMission)
    expect(screen.getByRole('button', { name: 'Interromper a prática' })).not.toBeVisible()
    const options = screen.getByText('Opções da prática', { selector: 'summary' })
    options.focus()
    // jsdom não implementa a ativação nativa de summary por Enter; verificado em Chrome.
    await user.click(options)
    expect(options.parentElement).toHaveAttribute('open')
    await user.tab()
    expect(screen.getByRole('button', { name: 'Interromper a prática' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Prática interrompida nesta página' })).toHaveFocus()
    expect(screen.getByText('Opções da prática', { selector: 'summary' }).parentElement).not.toHaveAttribute('open')
    await user.click(screen.getByRole('button', { name: 'Retomar a prática' }))
    expect(screen.getByRole('heading', { name: 'Encontre os recados' })).toHaveFocus()
  })

  it('mantém objetivos e progresso real acessíveis sob demanda, sem concluir ao abrir detalhes', async () => {
    const user = await start(navigationMission)
    expect(screen.getByText('Etapa 1 de 3')).toBeVisible()
    expect(screen.getByRole('progressbar', { hidden: true })).not.toBeVisible()
    await user.click(screen.getByText('Sobre esta demonstração', { selector: 'summary' }))
    expect(screen.getByText(navigationMission.content.objective)).toBeVisible()
    expect(screen.getByRole('progressbar', { name: 'Objetivos desta prática' })).toHaveAttribute('value', '0')
    expect(screen.getByText(/Não há envio ou salvamento de respostas/)).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Prática concluída nesta demonstração' })).not.toBeInTheDocument()
  })

  it('distingue a etapa visual dos critérios já praticados na M01', async () => {
    const user = await start(navigationMission)
    await user.click(screen.getByRole('button', { name: 'Recados do bairro' }))
    expect(screen.getByText('Etapa 2 de 3')).toBeVisible()
    await user.click(screen.getByText('Sobre esta demonstração', { selector: 'summary' }))
    expect(screen.getByText('1 de 3 objetivos praticados')).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Prática concluída nesta demonstração' })).not.toBeInTheDocument()
  })

  it('mantém texto e aplicação visíveis, brilho e volume disponíveis sob demanda na M02', async () => {
    const user = await start(readingMission)
    await user.click(screen.getByRole('button', { name: 'Quero melhorar a leitura do texto' }))
    expect(screen.getByRole('radio', { name: 'Texto ampliado' })).toBeVisible()
    expect(screen.getByRole('radio', { name: 'Volume audível' })).not.toBeVisible()
    const extra = screen.getByText('Outros ajustes simulados', { selector: 'summary' })
    extra.focus()
    await user.click(extra)
    expect(screen.getByRole('radio', { name: 'Volume audível' })).toBeVisible()
    await user.click(screen.getByRole('radio', { name: 'Brilho confortável' }))
    await user.click(extra)
    await user.click(screen.getByRole('button', { name: 'Aplicar ajustes e ler o convite' }))
    expect(screen.getByRole('status')).toHaveTextContent(/sozinhos, não resolvem o tamanho do texto/)
    expect(screen.getByRole('status')).toBeVisible()
    expect(screen.getByText('Etapa 2 de 3')).toBeVisible()
    expect(screen.queryByRole('group', { name: 'Onde será o encontro?' })).not.toBeInTheDocument()
  })
})
