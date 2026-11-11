import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import axe from 'axe-core'
import { App } from './App'
import { investigationMission, responsibleSharingMission } from '../data/informationMissions'
import { getOfficialMissionPath } from '../data/demoMissions'
import { openPracticeOptions } from '../test/disclosures'
import type { InformationDefinition } from '../domain/missions/types'

type User = ReturnType<typeof userEvent.setup>
const click = (u: User, name: string) => u.click(screen.getByRole('button', { name }))
const renderAt = (d: InformationDefinition) => render(<MemoryRouter initialEntries={[getOfficialMissionPath(d)]}><App /></MemoryRouter>)
async function start(u: User) { await click(u, 'Conhecer a atividade'); await click(u, 'Começar a prática') }
async function investigate(u: User, d: InformationDefinition) {
  for (const e of [...d.content.evidence].reverse()) {
    await click(u, e.title)
    expect(screen.getByRole('region', { name: 'Evidência consultada' })).toHaveFocus()
  }
  await click(u, d.content.evidence[0].title) // Reabrir a mesma pista também deve mover foco.
  expect(screen.getByRole('region', { name: 'Evidência consultada' })).toHaveFocus()
  await click(u, 'Comparar evidências')
}
async function justify(u: User, d: InformationDefinition) {
  await u.click(screen.getByRole('radio', { name: 'Ainda não verificada' }))
  for (const id of d.rules.requiredReasons) await u.click(screen.getByRole('checkbox', { name: d.content.reasons.find(c => c.id === id)!.label }))
  if (d.mode === 'sharing') for (const name of [d.content.conduct[1].label, d.content.responses[0].label, d.content.nextSteps[0].label]) await u.click(screen.getByRole('radio', { name }))
}
async function finish(u: User, d: InformationDefinition) {
  await u.click(screen.getByRole('checkbox', { name: 'Conferi a interpretação, os motivos e a decisão desta revisão.' }))
  await click(u, d.mode === 'sharing' ? 'Confirmar decisão simulada' : 'Concluir investigação')
}
describe('U04 — investigação e decisão nas rotas oficiais', () => {
  it.each([investigationMission, responsibleSharingMission])('abre $id pelo percurso e retorna com foco U04', async d => {
    const u = userEvent.setup(); render(<MemoryRouter initialEntries={['/trilhas']}><App /></MemoryRouter>)
    screen.getByRole('link', { name: new RegExp(`${d.id}.*Disponível`) }).focus(); await u.keyboard('{Enter}')
    expect(screen.getByRole('heading', { level: 1, name: d.content.title })).toBeInTheDocument()
    await u.click(screen.getByRole('link', { name: 'Voltar ao percurso da U04' }))
    expect(screen.getByRole('heading', { level: 3, name: /U04/ })).toHaveFocus()
    expect(screen.getAllByText('Em desenvolvimento · Ver proposta')).toHaveLength(10)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
  it('M07 exige pistas, síntese justificada e revisão, distinguindo incerteza de falsidade', async () => {
    const u = userEvent.setup(); renderAt(investigationMission); await start(u)
    await click(u, 'Comparar evidências'); expect(screen.getByRole('status')).toHaveTextContent('todas as pistas')
    await investigate(u, investigationMission); await justify(u, investigationMission)
    await u.click(screen.getByRole('radio', { name: 'Contradita pelas evidências' })); await click(u, 'Revisar interpretação e decisão')
    expect(screen.getByRole('status')).toHaveTextContent('não prova falsidade')
    await u.click(screen.getByRole('radio', { name: 'Ainda não verificada' })); await click(u, 'Revisar interpretação e decisão'); await click(u, 'Concluir investigação')
    expect(screen.getByRole('status')).toHaveTextContent('confirmação de revisão')
    await finish(u, investigationMission)
    expect(screen.getByRole('region', { name: 'Resultado da investigação' })).toHaveTextContent('Aviso antigo, não confirma fechamento atual')
  })
  it('M08 explica tentativa de compartilhar, resposta hostil e falta de confirmação independente', async () => {
    const u = userEvent.setup(); renderAt(responsibleSharingMission); await start(u); await investigate(u, responsibleSharingMission); await justify(u, responsibleSharingMission)
    await u.click(screen.getByRole('radio', { name: 'Compartilhar como fato com o grupo' }))
    expect(screen.getByRole('status')).toHaveTextContent('Não divulgue como fato')
    await click(u, 'Revisar interpretação e decisão'); expect(screen.queryByRole('region', { name: 'Revisão da investigação' })).not.toBeInTheDocument()
    await u.click(screen.getByRole('radio', { name: 'Não compartilhar enquanto faltar confirmação' }))
    await u.click(screen.getByRole('radio', { name: responsibleSharingMission.content.responses[2].label }))
    expect(screen.getByRole('status')).toHaveTextContent('sem acusar')
    await u.click(screen.getByRole('radio', { name: responsibleSharingMission.content.responses[1].label }))
    await click(u, 'Revisar interpretação e decisão'); await finish(u, responsibleSharingMission)
    expect(screen.getByRole('region', { name: 'Resultado da investigação' })).toHaveTextContent('não confirmou a data')
  })
  it.each([investigationMission, responsibleSharingMission])('$id preserva ajuda, pausa, retorno, edição e repetição sem penalização', async d => {
    const u = userEvent.setup(); renderAt(d); await start(u); await investigate(u, d); await justify(u, d)
    await click(u, 'Ajuda nesta página'); expect(screen.getByRole('button', { name: 'Ajuda nesta página' })).toHaveAttribute('aria-expanded', 'true')
    await openPracticeOptions(u); await click(u, 'Interromper a prática'); await click(u, 'Retomar a prática')
    expect(screen.getByRole('radio', { name: 'Ainda não verificada' })).toBeChecked()
    await click(u, 'Revisar interpretação e decisão')
    await u.click(screen.getByRole('checkbox', { name: 'Conferi a interpretação, os motivos e a decisão desta revisão.' }))
    await click(u, 'Corrigir interpretação e decisão'); await click(u, 'Revisar interpretação e decisão')
    expect(screen.getByRole('checkbox', { name: 'Conferi a interpretação, os motivos e a decisão desta revisão.' })).not.toBeChecked()
    await click(u, 'Rever evidências'); await investigate(u, d); await click(u, 'Revisar interpretação e decisão'); await finish(u, d)
    expect(screen.getByRole('heading', { name: 'Prática concluída nesta demonstração' })).toHaveFocus()
    await click(u, 'Repetir a micromissão'); await start(u)
    expect(screen.getByText(/Pistas consultadas: 0 de 3/)).toBeInTheDocument()
  }, 15000)
  it.each([investigationMission, responsibleSharingMission])('$id inspeciona fases com axe em jsdom, sem alegar teste de leitor', async d => {
    const u = userEvent.setup(); renderAt(d); document.documentElement.lang = 'pt-BR'
    const inspect = async () => {
      const r = await axe.run(document.documentElement, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, rules: { 'color-contrast': { enabled: false }, 'target-size': { enabled: false } } })
      expect(r.violations.map(v => v.id)).toEqual([])
    }
    await start(u); await inspect(); await investigate(u, d); await justify(u, d); await inspect(); await click(u, 'Revisar interpretação e decisão'); await inspect(); await finish(u, d); await inspect()
  }, 20000)
})
