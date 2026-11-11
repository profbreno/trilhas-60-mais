import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import axe from 'axe-core'
import { App } from './App'
import { trails, getUnitById } from '../data/curriculum'
import { legacyCurriculumRoutes } from '../data/legacyCurriculum'
import { missionPath, unitPath, trailPath } from '../domain/curriculumPaths'
import archived from '../../docs/PEDAGOGIA/CURRICULO-ANTERIOR.json'

const renderAt = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
const cases = trails.flatMap((trail) => trail.units.flatMap((unit) => unit.missions.map((mission) => ({ trail, unit, mission }))))

describe('Migração curricular aprovada', () => {
  it.each(cases)('abre e retorna da missão $mission.id respeitando disponibilidade de execução', async ({ trail, unit, mission }) => {
    const user = userEvent.setup()
    renderAt(unitPath(trail, unit))
    await user.click(screen.getByRole('link', { name: new RegExp(`Ver a micromissão\\s*: ${mission.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }))
    expect(screen.getByRole('heading', { level: 1, name: mission.title })).toBeInTheDocument()
    expect(screen.getByText(mission.objective)).toBeInTheDocument()
    expect(screen.getByText(mission.scenario)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`${unit.id} · ${mission.id}`))).toBeInTheDocument()
    if (['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10'].includes(mission.id)) {
      expect(screen.getByRole('button', { name: ['M01', 'M02'].includes(mission.id) ? 'Começar a prática' : 'Conhecer a atividade' })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Atividade em desenvolvimento' })).not.toBeInTheDocument()
    } else {
      expect(screen.getByRole('heading', { name: 'Atividade em desenvolvimento' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Conhecer a atividade' })).not.toBeInTheDocument()
    }
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    if (['M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10'].includes(mission.id)) await user.click(screen.getByText('Localização da missão', { selector: 'summary' }))
    if (!['M01', 'M02'].includes(mission.id)) {
      const breadcrumbs = screen.getByRole('navigation', { name: 'Você está aqui' })
      expect(within(breadcrumbs).getByText(mission.title)).toHaveAttribute('aria-current', 'page')
    }
    if (['M01', 'M02'].includes(mission.id)) await user.click(screen.getByText('Outros caminhos', { selector: 'summary' }))
    await user.click(screen.getByRole('link', { name: 'Voltar à unidade' }))
    expect(screen.getByRole('heading', { level: 1, name: unit.title })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Voltar à trilha' }))
    expect(screen.getByRole('heading', { level: 1, name: trail.title })).toBeInTheDocument()
  })

  it('não resolve códigos ou missão de outra unidade como se fossem slugs válidos', () => {
    const trail = trails[0], unit = trail.units[0], foreign = trail.units[1].missions[0]
    renderAt(`${unitPath(trail, unit)}/missoes/${foreign.slug}`)
    expect(screen.getByRole('heading', { level: 1, name: 'Vamos encontrar o caminho?' })).toBeInTheDocument()
  })

  it('mantém estáveis os endereços tematicamente equivalentes das três trilhas', () => {
    expect(trails.map(trailPath)).toEqual(['/trilhas/primeiros-passos', '/trilhas/seguranca', '/trilhas/cidadania'])
  })
})

describe('Endereços anteriores sem equivalência integral comprovada', () => {
  it('cadastra exatamente as trinta URLs arquivadas, com sugestões por conteúdo válidas', () => {
    const paths = archived.trails.flatMap((trail) => trail.units.flatMap((unit) => {
      const path = `/trilhas/${trail.id}/unidades/${unit.id}`
      return [path, ...unit.missions.map((mission) => `${path}/missoes/${mission.id}`)]
    }))
    expect(legacyCurriculumRoutes.map((entry) => entry.path)).toEqual(paths)
    expect(new Set(paths).size).toBe(30)
    for (const entry of legacyCurriculumRoutes) {
      expect(entry.relatedUnitIds.length).toBeGreaterThan(0)
      for (const id of entry.relatedUnitIds) expect(getUnitById(id)).toBeDefined()
    }
  })

  it.each(legacyCurriculumRoutes)('explica $oldId e permite seguir para unidade relacionada sem redirecionar por posição', async (entry) => {
    const user = userEvent.setup()
    renderAt(entry.path)
    expect(screen.getByRole('heading', { level: 1, name: 'O currículo foi reorganizado' })).toBeInTheDocument()
    expect(screen.getByText(`Este endereço apresentava “${entry.title}” na demonstração anterior.`)).toBeInTheDocument()
    expect(screen.getByText(/Não são versões equivalentes/)).toBeInTheDocument()
    const unit = getUnitById(entry.relatedUnitIds[0])!
    const trail = trails.find((item) => item.id === unit.trailId)!
    const link = screen.getByRole('link', { name: `${unit.id} — ${unit.title}` })
    expect(link).toHaveAttribute('href', unitPath(trail, unit))
    await user.click(link)
    expect(screen.getByRole('heading', { level: 1, name: unit.title })).toBeInTheDocument()
  })

  it('relaciona busca à U03 e desinformação à U04, sem usar a posição antiga como destino', () => {
    expect(legacyCurriculumRoutes.find((entry) => entry.oldId === 'comunicacao-2')?.relatedUnitIds).toEqual(['U03'])
    expect(legacyCurriculumRoutes.find((entry) => entry.oldId === 'informacoes-1')?.relatedUnitIds).toEqual(['U04'])
    expect(legacyCurriculumRoutes.find((entry) => entry.oldId === 'privacidade-2')?.relatedUnitIds).toEqual(['U09'])
  })

  it('trata barra final em URL antiga sem confundir endereço inventado', () => {
    renderAt(`${legacyCurriculumRoutes[0].path}/`)
    expect(screen.getByRole('heading', { level: 1, name: 'O currículo foi reorganizado' })).toBeInTheDocument()
  })

  it.each([missionPath(cases[19].trail, cases[19].unit, cases[19].mission), '/trilhas/seguranca/unidades/informacoes/missoes/informacoes-1'])('inspeciona semântica básica da rota %s', async (path) => {
    document.documentElement.lang = 'pt-BR'
    renderAt(path)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const result = await axe.run(document.documentElement, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, rules: { 'color-contrast': { enabled: false }, 'target-size': { enabled: false } } })
    expect(result.violations.map((violation) => violation.id)).toEqual([])
  })
})
