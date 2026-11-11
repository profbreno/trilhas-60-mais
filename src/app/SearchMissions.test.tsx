import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import axe from 'axe-core'
import { App } from './App'
import { queryMission, communityMission } from '../data/searchMissions'
import { getOfficialMissionPath } from '../data/demoMissions'
import { openPracticeOptions } from '../test/disclosures'
import type { SearchDefinition } from '../domain/missions/types'

type User = ReturnType<typeof userEvent.setup>
const click = (user: User, name: string | RegExp) => user.click(screen.getByRole('button', { name }))
const renderMission = (d: SearchDefinition) => render(<MemoryRouter initialEntries={[getOfficialMissionPath(d)]}><App /></MemoryRouter>)
async function start(user: User) { await click(user, 'Conhecer a atividade'); await click(user, 'Começar a prática') }
async function query(user: User, d: SearchDefinition) {
  for (const id of d.rules.requiredTerms) await click(user, `Adicionar ${d.content.terms.find(t => t.id === id)!.label}`)
  await click(user, 'Pesquisar na simulação')
}
async function select(user: User, d: SearchDefinition) {
  const current = d.content.results.find(r => r.id === 'current')!
  if (d.mode === 'contextual') {
    for (const id of ['old', 'partial']) await click(user, `Abrir detalhes: ${d.content.results.find(r => r.id === id)!.title}`)
  }
  await click(user, `Abrir detalhes: ${current.title}`)
  expect(screen.getByRole('region', { name: 'Detalhes do resultado' })).toHaveFocus()
  if (d.mode === 'contextual') {
    await click(user, 'Consultar origem'); await click(user, 'Consultar atualidade'); await click(user, 'Comparar resultados abertos')
  }
  await click(user, 'Escolher este resultado'); await click(user, 'Organizar resultado escolhido')
}
async function save(user: User, d: SearchDefinition) {
  if (d.mode === 'contextual') for (const name of ['Dia do lembrete', 'Local do lembrete', 'Fonte do lembrete']) await user.selectOptions(screen.getByRole('combobox', { name }), 'correct')
  await click(user, 'Guardar na coleção temporária')
  expect(screen.getByRole('region', { name: 'Coleção temporária' })).toHaveFocus()
}
describe('U03 no percurso e nas rotas oficiais', () => {
  it.each([queryMission, communityMission])('abre $id por teclado e retorna à U03 sem progresso fictício', async d => {
    const user = userEvent.setup(); render(<MemoryRouter><App /></MemoryRouter>)
    screen.getByRole('link', { name: new RegExp(`${d.id}.*Disponível`) }).focus(); await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { level: 1, name: d.content.title })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Voltar ao percurso da U03' }))
    expect(screen.getByRole('heading', { level: 3, name: /U03/ })).toHaveFocus()
    expect(screen.getAllByText('Em desenvolvimento · Ver proposta')).toHaveLength(10)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
  it('M05 permite consulta genérica, refinamento e explica resultado antigo', async () => {
    const user = userEvent.setup(); renderMission(queryMission); await start(user)
    await click(user, 'Adicionar biblioteca'); await click(user, 'Pesquisar na simulação')
    expect(screen.getByRole('status')).toHaveTextContent('Refinar busca')
    expect(screen.queryByRole('button', { name: 'Abrir detalhes: Biblioteca Jardim — horário de agosto' })).not.toBeInTheDocument()
    await click(user, 'Refinar busca'); await click(user, 'Adicionar horário'); await click(user, 'Adicionar bairro Jardim'); await click(user, 'Pesquisar na simulação')
    await click(user, 'Abrir detalhes: Horário da Biblioteca Jardim — edição antiga'); await click(user, 'Escolher este resultado')
    expect(screen.getByRole('status')).toHaveTextContent('edição anterior')
    await select(user, queryMission); await save(user, queryMission)
    expect(screen.queryByRole('heading', { name: 'Prática concluída nesta demonstração' })).not.toBeInTheDocument()
    await click(user, 'Reabrir resultado guardado')
    expect(screen.getByRole('region', { name: 'Resultado recuperado' })).toHaveTextContent('das 8h às 18h')
  })
  it('M06 exige comparação, origem, atualidade e lembrete coerente antes de recuperar', async () => {
    const user = userEvent.setup(); renderMission(communityMission); await start(user); await query(user, communityMission)
    await click(user, 'Comparar resultados abertos'); expect(screen.getByRole('status')).toHaveTextContent('três resultados')
    await click(user, 'Abrir detalhes: Jardinagem no Centro Comunitário Jardim'); await click(user, 'Escolher este resultado'); await click(user, 'Organizar resultado escolhido')
    expect(screen.getByRole('status')).toHaveTextContent(/Origem e Atualidade/i)
    await select(user, communityMission); await click(user, 'Guardar na coleção temporária')
    expect(screen.getByRole('status')).toHaveTextContent('dia, local e fonte')
    await save(user, communityMission); await click(user, 'Reabrir resultado guardado')
    expect(screen.getByRole('heading', { name: 'Prática concluída nesta demonstração' })).toHaveFocus()
    const recovered = screen.getByRole('region', { name: 'Resultado recuperado' })
    expect(within(recovered).getByText('Fonte')).toBeInTheDocument()
    expect(recovered).toHaveTextContent('21 de agosto de 2032')
  })
  it.each([queryMission, communityMission])('$id permite ajuda, pausa, revisão e repetição sem penalização', async d => {
    const user = userEvent.setup(); renderMission(d); await start(user); await query(user, d)
    await click(user, 'Ajuda nesta página'); expect(screen.getByRole('button', { name: 'Ajuda nesta página' })).toHaveAttribute('aria-expanded', 'true')
    await openPracticeOptions(user); await click(user, 'Interromper a prática'); await click(user, 'Retomar a prática')
    expect(screen.getByRole('heading', { name: /Resultados da simulação/ })).toBeInTheDocument()
    await select(user, d); await click(user, 'Rever escolha e organização'); expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    await select(user, d); await save(user, d); await click(user, 'Reabrir resultado guardado')
    await click(user, 'Repetir a micromissão'); await start(user)
    expect(screen.getByText('Nenhuma palavra escolhida', { exact: false })).toBeInTheDocument()
  }, 15000)
  it.each([queryMission, communityMission])('$id inspeciona fases de pesquisa com axe em jsdom', async d => {
    const user = userEvent.setup(); renderMission(d); document.documentElement.lang = 'pt-BR'
    const inspect = async () => {
      const r = await axe.run(document.documentElement, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, rules: { 'color-contrast': { enabled: false }, 'target-size': { enabled: false } } })
      expect(r.violations.map(v => v.id)).toEqual([])
    }
    await start(user); await inspect(); await query(user, d); await inspect(); await select(user, d); await inspect(); await save(user, d); await click(user, 'Reabrir resultado guardado'); await inspect()
  }, 20000)
})
