import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import axe from 'axe-core'
import { App } from './App'

const officialPaths: Record<string, string> = {
  m01: '/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/encontrar-os-caminhos-da-tela',
  m02: '/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/preparar-a-tela-para-ler-um-convite',
}
const m01Link = /Ver a micromissão\s*: Encontrar os caminhos da tela/
const m02Link = /Ver a micromissão\s*: Preparar a tela para ler um convite/

const renderMission = (id: string) => render(<MemoryRouter initialEntries={[officialPaths[id] ?? `/desenvolvimento/u01/${id}`]}><App /></MemoryRouter>)
const start = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Conhecer a atividade' }))
  await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
}
const finishNavigation = async (user: ReturnType<typeof userEvent.setup>) => {
  for (const name of ['Recados do bairro', 'Voltar à tela inicial da simulação', 'Calendário', 'Voltar à tela inicial da simulação', 'Recados do bairro', 'Voltar à tela inicial da simulação']) {
    await user.click(screen.getByRole('button', { name }))
  }
}
const applyReading = async (user: ReturnType<typeof userEvent.setup>, mode = 'Texto ampliado') => {
  await user.click(screen.getByRole('button', { name: 'Quero melhorar a leitura do texto' }))
  await user.click(screen.getByRole('radio', { name: mode }))
  await user.click(screen.getByRole('button', { name: 'Aplicar ajustes e ler o convite' }))
}
const completion = () => screen.getByRole('heading', { level: 2, name: 'Prática concluída nesta demonstração' })

describe('Missões nas rotas oficiais', () => {
  it('permite encontrar a unidade pelo início e apresenta apenas M01 e M02', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><App /></MemoryRouter>)
    await user.click(screen.getByRole('link', { name: 'Experimentar as atividades da U01' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Operação básica do celular' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: m01Link })).toHaveAttribute('href', officialPaths.m01)
    expect(screen.getByRole('link', { name: m02Link })).toHaveAttribute('href', officialPaths.m02)
    expect(screen.queryByRole('link', { name: /Preparar uma mensagem para o grupo/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText(/Na atividade presencial complementar, Wi-Fi/)).toBeInTheDocument()
  })

  it.each(['m03', 'inexistente'])('trata a missão não implementada %s sem tentar migrar o currículo', (id) => {
    renderMission(id)
    expect(screen.getByRole('heading', { level: 1, name: 'Vamos encontrar o caminho?' })).toBeInTheDocument()
  })

  it('explica a atualização da página antiga sem acionar o motor', () => {
    render(<MemoryRouter initialEntries={['/trilhas/primeiros-passos/unidades/conhecendo-o-celular/missoes/conhecendo-o-celular-1']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'O currículo foi reorganizado' })).toBeInTheDocument()
    expect(screen.getByText(/Reconhecer os botões e a tela/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'U01 — Operação básica do celular' })).toHaveAttribute('href', '/trilhas/primeiros-passos/unidades/operacao-basica-do-celular')
    expect(screen.queryByRole('button', { name: 'Começar a prática' })).not.toBeInTheDocument()
  })
})

describe('Fluxo funcional M01', () => {
  it('apresenta objetivo/instruções, aceita teclado e permite recuperar erro antes de concluir', async () => {
    const user = userEvent.setup()
    renderMission('m01')
    expect(screen.getByRole('heading', { level: 2, name: 'O que vamos praticar' })).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    await start(user)
    expect(screen.getByRole('heading', { name: 'Encontre os recados' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Recados do bairro' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByText('1 de 3 objetivos praticados')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Voltar à tela inicial da simulação' }))
    // Abrir Recados quando o ensaio pede Calendário não perde o objetivo já praticado.
    await user.click(screen.getByRole('button', { name: 'Recados do bairro' }))
    expect(screen.getByRole('status')).toHaveTextContent(/neste ensaio vamos visitar o Calendário/)
    expect(screen.getByText('1 de 3 objetivos praticados')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Voltar à tela inicial da simulação' }))
    await user.click(screen.getByRole('button', { name: 'Calendário' }))
    await user.click(screen.getByRole('button', { name: 'Voltar à tela inicial da simulação' }))
    await user.click(screen.getByRole('button', { name: 'Recados do bairro' }))
    expect(screen.getByText('2 de 3 objetivos praticados')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Voltar à tela inicial da simulação' }))
    expect(completion()).toHaveFocus()
    await user.click(screen.getByText('Sobre esta demonstração', { selector: 'summary' }))
    expect(screen.getByRole('progressbar', { name: 'Objetivos desta prática' })).toHaveAttribute('value', '3')
    expect(screen.getByText('Caminho praticado')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Repetir a micromissão' }))
    expect(screen.getByRole('heading', { name: 'O que vamos praticar' })).toHaveFocus()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('oferece ajuda na apresentação, nas instruções e durante a recuperação', async () => {
    const user = userEvent.setup()
    renderMission('m01')
    const help = () => screen.getByRole('button', { name: 'Ajuda nesta página' })
    await user.click(help())
    expect(screen.getByText(/Não é necessário usar controles físicos/)).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Conhecer a atividade' }))
    expect(help()).toHaveAttribute('aria-expanded', 'false')
    await user.click(help())
    expect(screen.getByText(/Não é necessário usar controles físicos/)).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    await user.click(screen.getByRole('button', { name: 'Calendário' }))
    expect(screen.getByRole('heading', { name: 'Encontre os recados' })).toHaveFocus()
    await user.click(help())
    expect(screen.getByText(/Se entrar no Calendário, volte/)).toBeVisible()
    expect(screen.getByText('0 de 3 objetivos praticados')).toBeInTheDocument()
  })

  it('ao sair e voltar começa outra execução, sem persistir a conclusão', async () => {
    const user = userEvent.setup()
    renderMission('m01')
    await start(user)
    await finishNavigation(user)
    expect(completion()).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Voltar à unidade' }))
    await user.click(screen.getByRole('link', { name: m01Link }))
    expect(screen.getByRole('heading', { name: 'O que vamos praticar' })).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Voltar à unidade' }))
    await user.click(screen.getByRole('link', { name: m02Link }))
    expect(screen.getByRole('heading', { level: 1, name: 'Preparar a tela para ler um convite' })).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})

describe('Fluxo funcional M02', () => {
  it('permite experimentar brilho/volume, explica dificuldade, preserva instruções e aceita leitura ajustada', async () => {
    const user = userEvent.setup()
    renderMission('m02')
    await start(user)
    await user.click(screen.getByRole('button', { name: 'Quero aumentar o som' }))
    expect(screen.getByRole('status')).toHaveTextContent(/não muda o tamanho do texto/)
    await user.click(screen.getByRole('button', { name: 'Quero melhorar a leitura do texto' }))
    await user.click(screen.getByText('Outros ajustes simulados', { selector: 'summary' }))
    await user.click(screen.getByRole('radio', { name: 'Brilho confortável' }))
    await user.click(screen.getByRole('radio', { name: 'Volume audível' }))
    await user.click(screen.getByRole('button', { name: 'Aplicar ajustes e ler o convite' }))
    expect(screen.getByRole('status')).toHaveTextContent(/sozinhos, não resolvem o tamanho/)
    expect(screen.queryByRole('button', { name: 'Salão de leitura do Centro Comunitário' })).not.toBeInTheDocument()
    const heading = screen.getByRole('heading', { name: 'Experimente uma apresentação' })
    const preview = screen.getByRole('region', { name: 'Convite fictício' })
    expect(preview).not.toContainElement(heading)
    await user.click(screen.getByRole('radio', { name: 'Texto ampliado' }))
    expect(preview).toHaveClass('invitation-preview--enlarged')
    await user.click(screen.getByRole('button', { name: 'Aplicar ajustes e ler o convite' }))
    await user.click(screen.getByRole('button', { name: 'Coreto da Praça das Flores' }))
    expect(screen.getByRole('status')).toHaveTextContent(/não corresponde ao convite/)
    expect(screen.getByText('2 de 3 objetivos praticados')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Salão de leitura do Centro Comunitário' }))
    expect(completion()).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Desfazer ajustes da prévia' }))
    expect(completion()).toBeInTheDocument()
    expect(screen.getByText('3 de 3 objetivos praticados')).toBeInTheDocument()
    expect(preview).toHaveClass('invitation-preview--standard')
  })

  it('oferece modo de leitura equivalente e desfazer antes da informação', async () => {
    const user = userEvent.setup()
    renderMission('m02')
    await start(user)
    await applyReading(user, 'Modo de leitura')
    await user.click(screen.getByRole('button', { name: 'Desfazer ajustes da prévia' }))
    expect(screen.getByText('1 de 3 objetivos praticados')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Modo de leitura' }))
    await user.click(screen.getByRole('button', { name: 'Aplicar ajustes e ler o convite' }))
    await user.click(screen.getByRole('button', { name: 'Salão de leitura do Centro Comunitário' }))
    expect(completion()).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Repetir a micromissão' }))
    await start(user)
    expect(screen.getByText('0 de 3 objetivos praticados')).toBeInTheDocument()
  })

  it('permite operar a apresentação pelo teclado nativo dos grupos de rádio', async () => {
    const user = userEvent.setup()
    renderMission('m02')
    await start(user)
    await user.click(screen.getByRole('button', { name: 'Quero melhorar a leitura do texto' }))
    const standard = screen.getByRole('radio', { name: 'Padrão' })
    standard.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Texto ampliado' })).toBeChecked()
    expect(within(screen.getByRole('group', { name: 'Apresentação do texto' })).getAllByRole('radio')).toHaveLength(3)
  })
})

describe('Inspeção automatizada parcial das atividades', () => {
  it.each(['m01', 'm02'])('inspeciona apresentação, instruções, prática e conclusão de %s', async (id) => {
    const user = userEvent.setup()
    document.documentElement.lang = 'pt-BR'
    renderMission(id)
    const inspect = async () => {
      const results = await axe.run(document.documentElement, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
        rules: { 'color-contrast': { enabled: false }, 'target-size': { enabled: false } },
      })
      expect(results.violations.map(({ id: rule }) => rule)).toEqual([])
    }
    await inspect()
    await user.click(screen.getByRole('button', { name: 'Conhecer a atividade' }))
    await inspect()
    await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
    if (id === 'm01') await finishNavigation(user)
    else {
      await user.click(screen.getByRole('button', { name: 'Quero melhorar a leitura do texto' }))
      await user.click(screen.getByRole('button', { name: 'Ajuda nesta página' }))
      await inspect()
      await user.click(screen.getByRole('radio', { name: 'Texto ampliado' }))
      await user.click(screen.getByRole('button', { name: 'Aplicar ajustes e ler o convite' }))
      await user.click(screen.getByRole('button', { name: 'Salão de leitura do Centro Comunitário' }))
    }
    expect(completion()).toBeInTheDocument()
    await inspect()
  }, 20000)
})
