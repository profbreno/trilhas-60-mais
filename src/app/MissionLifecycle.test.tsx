import { openPracticeOptions } from '../test/disclosures'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import axe from 'axe-core'
import { App } from './App'

const unit = '/trilhas/primeiros-passos/unidades/operacao-basica-do-celular'
const m01 = `${unit}/missoes/encontrar-os-caminhos-da-tela`
const m02 = `${unit}/missoes/preparar-a-tela-para-ler-um-convite`
function LocationProbe() { return <output data-testid="location">{useLocation().pathname}</output> }
const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /><LocationProbe /></MemoryRouter>)
const start = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
}

describe('Execução oficial, sem URLs pedagógicas paralelas', () => {
  it.each([['/desenvolvimento/u01', unit], ['/desenvolvimento/u01/m01', m01], ['/desenvolvimento/u01/m02', m02]])('redireciona %s para a única rota oficial correspondente', async (oldPath, currentPath) => {
    renderAt(oldPath)
    expect(await screen.findByTestId('location')).toHaveTextContent(currentPath)
    expect(screen.getByTestId('location').textContent).toBe(currentPath)
    expect(screen.queryByRole('link', { name: /Experimentar M0[12]/ })).not.toBeInTheDocument()
  })

  it('entra diretamente em M02 sem precisar concluir M01 e mantém os dezoito conteúdos sem execução', () => {
    renderAt(m02)
    expect(screen.getByRole('button', { name: 'Começar a prática' })).toBeInTheDocument()
    expect(screen.queryByText(/Conclua M01/)).not.toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('não oferece acessos paralelos de desenvolvimento na página inicial', () => {
    const { container } = renderAt('/')
    expect(container.querySelector('a[href^="/desenvolvimento"]')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continuar aprendendo' })).toHaveAttribute('href', m01)
  })
})

describe('Controles de ciclo de vida acessíveis', () => {
  it('retorna à etapa anterior da M01, refaz o critério e reinicia sem carregar progresso', async () => {
    const user = userEvent.setup()
    renderAt(m01)
    await start(user)
    await user.click(screen.getByRole('button', { name: 'Recados do bairro' }))
    expect(screen.getByText('1 de 3 objetivos praticados')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Voltar à etapa anterior' }))
    expect(screen.getByRole('heading', { name: 'Encontre os recados' })).toHaveFocus()
    expect(screen.getByText('0 de 3 objetivos praticados')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Recados do bairro' }))
    await openPracticeOptions(user)
    await user.click(screen.getByRole('button', { name: 'Reiniciar a micromissão' }))
    expect(screen.getByRole('heading', { name: 'O que vamos praticar' })).toHaveFocus()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    await start(user)
    expect(screen.getByText('0 de 3 objetivos praticados')).toBeInTheDocument()
  })

  it('interrompe e retoma M02 no mesmo ponto, mantém ajustes e ajuda, sem concluir ao retomar', async () => {
    const user = userEvent.setup()
    renderAt(m02)
    await start(user)
    await user.click(screen.getByRole('button', { name: 'Quero melhorar a leitura do texto' }))
    await user.click(screen.getByRole('radio', { name: 'Modo de leitura' }))
    await user.click(screen.getByRole('button', { name: 'Aplicar ajustes e ler o convite' }))
    expect(screen.getByText('2 de 3 objetivos praticados')).toBeInTheDocument()
    await openPracticeOptions(user)
    await user.click(screen.getByRole('button', { name: 'Interromper a prática' }))
    expect(screen.getByRole('heading', { name: 'Prática interrompida nesta página' })).toHaveFocus()
    expect(screen.queryByRole('region', { name: 'Convite fictício' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ajuda nesta página' }))
    expect(screen.getByText(/O volume não aumenta as letras/)).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Retomar a prática' }))
    expect(screen.getByRole('heading', { name: 'Encontre o local do encontro' })).toHaveFocus()
    expect(screen.getByRole('region', { name: 'Convite fictício' })).toHaveClass('invitation-preview--reading')
    expect(screen.getByText('2 de 3 objetivos praticados')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Prática concluída nesta demonstração' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Salão de leitura do Centro Comunitário' }))
    expect(screen.getByRole('heading', { name: 'Prática concluída nesta demonstração' })).toHaveFocus()
  })

  it('volta às instruções/apresentação e não conclui por navegar entre telas', async () => {
    const user = userEvent.setup()
    renderAt(m01)
    await start(user)
    for (let repeat = 0; repeat < 2; repeat++) {
      await user.click(screen.getByRole('button', { name: 'Voltar à etapa anterior' }))
      expect(screen.getByRole('heading', { name: 'O que vamos praticar' })).toHaveFocus()
      await start(user)
    }
    expect(screen.getByText('0 de 3 objetivos praticados')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Repetir a micromissão' })).not.toBeInTheDocument()
  })

  it('permite interromper por teclado e sair, descartando o estado ao retornar', async () => {
    const user = userEvent.setup()
    renderAt(m01)
    await start(user)
    await openPracticeOptions(user)
    const interrupt = screen.getByRole('button', { name: 'Interromper a prática' })
    interrupt.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Prática interrompida nesta página' })).toHaveFocus()
    await user.click(screen.getByText('Outros caminhos', { selector: 'summary' }))
    await user.click(screen.getByRole('link', { name: 'Voltar à unidade' }))
    await user.click(screen.getByRole('link', { name: /Ver a micromissão\s*: Encontrar os caminhos da tela/ }))
    expect(screen.getByRole('heading', { name: 'O que vamos praticar' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retomar a prática' })).not.toBeInTheDocument()
  })

  it('inspeciona a semântica da interrupção com ajuda aberta e da retomada', async () => {
    const user = userEvent.setup()
    document.documentElement.lang = 'pt-BR'
    renderAt(m02)
    await start(user)
    await openPracticeOptions(user)
    await user.click(screen.getByRole('button', { name: 'Interromper a prática' }))
    await user.click(screen.getByRole('button', { name: 'Ajuda nesta página' }))
    const inspect = async () => {
      const result = await axe.run(document.documentElement, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, rules: { 'color-contrast': { enabled: false }, 'target-size': { enabled: false } } })
      expect(result.violations.map((violation) => violation.id)).toEqual([])
    }
    await inspect()
    await user.click(screen.getByRole('button', { name: 'Retomar a prática' }))
    await inspect()
  })
})
