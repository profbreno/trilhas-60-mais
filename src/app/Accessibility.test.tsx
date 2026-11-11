import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { trails } from '../data/curriculum'

const routes = ['/', '/trilhas', '/conquistas', '/trilhas/primeiros-passos', '/trilhas/primeiros-passos/unidades/operacao-basica-do-celular', '/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/encontrar-os-caminhos-da-tela', '/pagina-invalida']

describe('Inspeção automatizada parcial com axe-core em jsdom', () => {
  it.each(routes)('inspeciona semântica e nomes acessíveis em %s', async (route) => {
    document.documentElement.lang = 'pt-BR'
    render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo')
    const results = await axe.run(document.documentElement, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      // jsdom não calcula layout, cores ou áreas reais de toque.
      rules: { 'color-contrast': { enabled: false }, 'target-size': { enabled: false } },
    })
    expect(results.violations.map(({ id, nodes }) => ({ id, elements: nodes.map((node) => node.target) }))).toEqual([])
  })
})

describe('Apresentação de todo o currículo', () => {
  it.each(trails)('mantém a ordem das unidades de $id', (trail) => {
    render(<MemoryRouter initialEntries={[`/trilhas/${trail.slug}`]}><App /></MemoryRouter>)
    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual(trail.units.map((unit) => unit.title))
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it.each(trails.flatMap((trail) => trail.units.map((unit) => ({ trail, unit }))))('apresenta as duas micromissões de $unit.id', ({ trail, unit }) => {
    render(<MemoryRouter initialEntries={[`/trilhas/${trail.slug}/unidades/${unit.slug}`]}><App /></MemoryRouter>)
    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual(unit.missions.map((mission) => mission.title))
    const breadcrumbs = screen.getByRole('navigation', { name: 'Você está aqui' })
    expect(within(breadcrumbs).getByText(unit.title)).toHaveAttribute('aria-current', 'page')
    expect(within(breadcrumbs).getByRole('link', { name: trail.title })).toBeInTheDocument()
  })
})
