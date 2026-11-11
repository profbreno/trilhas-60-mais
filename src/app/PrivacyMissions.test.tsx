import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import axe from 'axe-core'
import { App } from './App'
import { accountProtectionMission, privacyPublicationMission } from '../data/privacyMissions'
import { getOfficialMissionPath } from '../data/demoMissions'
import { openPracticeOptions } from '../test/disclosures'
import type { PrivacyDefinition } from '../domain/missions/types'

type User = ReturnType<typeof userEvent.setup>
const click = (u: User, name: string) => u.click(screen.getByRole('button', { name }))
const renderAt = (d: PrivacyDefinition) => render(<MemoryRouter initialEntries={[getOfficialMissionPath(d)]}><App /></MemoryRouter>)
async function start(u: User) { await click(u, 'Conhecer a atividade'); await click(u, 'Começar a prática') }
async function prepare(u: User, d: PrivacyDefinition) {
  await click(u, d.mode === 'account' ? 'Consultar orientação sobre senha e código' : 'Consultar orientação sobre dados e finalidade')
  if (d.mode === 'account') {
    await click(u, 'Comparar estratégias'); await u.click(screen.getByRole('radio', { name: /^Usar frase longa e exclusiva/ }))
    for (const id of d.rules.strategyReasons) await u.click(screen.getByRole('checkbox', { name: d.content.strategyReasons.find(c => c.id === id)!.label }))
  } else {
    await u.click(screen.getByRole('radio', { name: 'Divulgar publicamente a oficina para a comunidade' }))
    for (const f of d.content.fields) { await click(u, `Entender: ${f.label}`); expect(screen.getByRole('region', { name: 'Explicação da informação' })).toHaveFocus() }
    for (const id of d.rules.privateFields) await click(u, `Retirar: ${d.content.fields.find(f => f.id === id)!.label}`)
  }
  await click(u, d.mode === 'account' ? 'Continuar para proteção adicional' : 'Continuar para escolha de público')
}
async function protect(u: User, d: PrivacyDefinition) {
  if (d.mode === 'account') {
    await click(u, 'Ativar etapa adicional simulada'); await u.click(screen.getByRole('radio', { name: 'É uma confirmação temporária adicional do acesso que iniciei' })); await click(u, 'Usar código no acesso que iniciei')
    await u.click(screen.getByRole('radio', { name: 'Recusar o envio e permanecer no acesso que iniciei' }))
    for (const id of d.rules.codeReasons) await u.click(screen.getByRole('checkbox', { name: d.content.codeReasons.find(c => c.id === id)!.label }))
  } else {
    await u.click(screen.getByRole('radio', { name: 'Público da comunidade — divulgação pública' }))
    for (const id of d.rules.publicationReasons) await u.click(screen.getByRole('checkbox', { name: d.content.publicationReasons.find(c => c.id === id)!.label }))
  }
  await click(u, 'Revisar decisões de proteção')
}
async function finish(u: User, d: PrivacyDefinition) {
  await u.click(screen.getByRole('checkbox', { name: 'Conferi a prévia e os motivos antes de confirmar.' }))
  await click(u, d.mode === 'account' ? 'Confirmar proteção simulada' : 'Confirmar compartilhamento simulado')
}
describe('U05 — acesso e divulgação fictícios', () => {
  it.each([accountProtectionMission, privacyPublicationMission])('abre $id diretamente e retorna com foco U05, sem progresso inventado', async d => {
    const u = userEvent.setup(); render(<MemoryRouter initialEntries={['/trilhas']}><App /></MemoryRouter>)
    screen.getByRole('link', { name: new RegExp(`${d.id}.*Disponível`) }).focus(); await u.keyboard('{Enter}')
    expect(screen.getByRole('heading', { level: 1, name: d.content.title })).toBeInTheDocument()
    await u.click(screen.getByRole('link', { name: 'Voltar ao percurso da U05' }))
    expect(screen.getByRole('heading', { level: 3, name: /U05/ })).toHaveFocus()
    expect(screen.getAllByText('Em desenvolvimento · Ver proposta')).toHaveLength(10)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
  it('M09 configura estratégia, distingue código e bloqueia envio, sem campo de credenciais', async () => {
    const u = userEvent.setup(); const { container } = renderAt(accountProtectionMission); await start(u)
    await click(u, 'Consultar orientação sobre senha e código'); await click(u, 'Comparar estratégias')
    await u.click(screen.getByRole('radio', { name: /^Reutilizar a senha/ })); expect(screen.getByRole('status')).toHaveTextContent('vazamento')
    await u.click(screen.getByRole('radio', { name: /^Usar frase longa e exclusiva/ }))
    for (const id of accountProtectionMission.rules.strategyReasons) await u.click(screen.getByRole('checkbox', { name: accountProtectionMission.content.strategyReasons.find(c => c.id === id)!.label }))
    await click(u, 'Continuar para proteção adicional'); await click(u, 'Ativar etapa adicional simulada')
    await u.click(screen.getByRole('radio', { name: 'É a senha permanente para reutilizar em outras contas' })); expect(screen.getByRole('status')).toHaveTextContent('confirmação adicional')
    await u.click(screen.getByRole('radio', { name: 'É uma confirmação temporária adicional do acesso que iniciei' })); await click(u, 'Usar código no acesso que iniciei')
    await click(u, 'Tentar enviar código pela conversa — simulação'); expect(screen.getByRole('status')).toHaveTextContent('nada saiu desta página')
    expect(within(screen.getByRole('region', { name: 'Pedido recebido na conversa' })).getByText(/Envio bloqueado nesta simulação/)).toBeInTheDocument()
    await click(u, 'Usar código no acesso que iniciei')
    await u.click(screen.getByRole('radio', { name: 'Recusar o envio e permanecer no acesso que iniciei' }))
    for (const id of accountProtectionMission.rules.codeReasons) await u.click(screen.getByRole('checkbox', { name: accountProtectionMission.content.codeReasons.find(c => c.id === id)!.label }))
    await click(u, 'Revisar decisões de proteção'); await click(u, 'Confirmar proteção simulada')
    expect(screen.getByRole('status')).toHaveTextContent('confirmação de revisão')
    await finish(u, accountProtectionMission); expect(screen.getByRole('heading', { name: 'Prática concluída nesta demonstração' })).toHaveFocus()
    expect(container.querySelector('input[type=password], input[type=text], textarea')).toBeNull()
  })
  it('M10 mostra remoção/recolocação na prévia e exige finalidade, dados suficientes e público', async () => {
    const u = userEvent.setup(); renderAt(privacyPublicationMission); await start(u)
    await click(u, 'Retirar: Endereço residencial')
    const preview = screen.getByRole('region', { name: 'Prévia da publicação' })
    expect(within(preview).queryByText('RESIDÊNCIA DE EXEMPLO — não é o local da oficina')).not.toBeInTheDocument()
    await click(u, 'Recolocar: Endereço residencial'); expect(preview).toHaveTextContent('RESIDÊNCIA DE EXEMPLO')
    await prepare(u, privacyPublicationMission)
    await u.click(screen.getByRole('radio', { name: 'Grupo específico de contatos' })); await click(u, 'Revisar decisões de proteção')
    expect(screen.getByRole('status')).toHaveTextContent('outro contexto')
    await protect(u, privacyPublicationMission); await finish(u, privacyPublicationMission)
    const final = screen.getByRole('region', { name: 'Prévia da publicação' })
    expect(final).toHaveTextContent('Centro Comunitário Jardim')
    expect(final).not.toHaveTextContent('CONTATO PARTICULAR SINTÉTICO')
    expect(final).not.toHaveTextContent('RESIDÊNCIA DE EXEMPLO')
    expect(final).not.toHaveTextContent('IMAGEM DE DOCUMENTO FICTÍCIO')
  }, 15000)
  it.each([accountProtectionMission, privacyPublicationMission])('$id preserva ajuda, pausa, revisão, retorno e repetição', async d => {
    const u = userEvent.setup(); renderAt(d); await start(u); await prepare(u, d)
    await click(u, 'Ajuda nesta página'); expect(screen.getByRole('button', { name: 'Ajuda nesta página' })).toHaveAttribute('aria-expanded', 'true')
    await openPracticeOptions(u); await click(u, 'Interromper a prática'); await click(u, 'Retomar a prática'); await protect(u, d)
    await u.click(screen.getByRole('checkbox', { name: 'Conferi a prévia e os motivos antes de confirmar.' }))
    await click(u, 'Corrigir decisões de proteção'); await click(u, 'Revisar decisões de proteção')
    expect(screen.getByRole('checkbox', { name: 'Conferi a prévia e os motivos antes de confirmar.' })).not.toBeChecked()
    await finish(u, d); await click(u, 'Repetir a micromissão'); await start(u)
    expect(screen.getByRole('button', { name: d.mode === 'account' ? 'Consultar orientação sobre senha e código' : 'Consultar orientação sobre dados e finalidade' })).toHaveAttribute('aria-expanded', 'false')
  }, 15000)
  it.each([accountProtectionMission, privacyPublicationMission])('$id inspeciona as fases com axe em jsdom', async d => {
    const u = userEvent.setup(); renderAt(d); document.documentElement.lang = 'pt-BR'
    const inspect = async () => {
      const r = await axe.run(document.documentElement, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, rules: { 'color-contrast': { enabled: false }, 'target-size': { enabled: false } } })
      expect(r.violations.map(v => v.id)).toEqual([])
    }
    await start(u); await inspect(); await prepare(u, d); await inspect(); await protect(u, d); await inspect(); await finish(u, d); await inspect()
  }, 20000)
})
