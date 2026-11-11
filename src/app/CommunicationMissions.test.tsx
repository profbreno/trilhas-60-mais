import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import axe from 'axe-core'
import { App } from './App'
import { messageMission, sharingMission } from '../data/communicationMissions'
import { getOfficialMissionPath } from '../data/demoMissions'
import { openPracticeOptions } from '../test/disclosures'

type User = ReturnType<typeof userEvent.setup>
const renderMission = (file = false) => render(<MemoryRouter initialEntries={[getOfficialMissionPath(file ? sharingMission : messageMission)]}><App /></MemoryRouter>)
async function start(user: User) {
  await user.click(screen.getByRole('button', { name: 'Conhecer a atividade' }))
  await user.click(screen.getByRole('button', { name: 'Começar a prática' }))
}
async function message(user: User) {
  await user.selectOptions(screen.getByRole('combobox', { name: 'Destinatário' }), 'grupo-leitura')
  for (const name of ['Olá, grupo!', 'Confirmo minha participação no encontro de leitura.', 'Até o encontro!']) await user.click(screen.getByRole('radio', { name }))
}
async function file(user: User) {
  await user.click(screen.getByRole('radio', { name: /^Programa da oficina de leitura/ }))
  await user.click(screen.getByRole('button', { name: 'Conferir arquivo selecionado' }))
  await user.selectOptions(screen.getByRole('combobox', { name: 'Destinatário' }), 'equipe-leitura')
  await user.click(screen.getByRole('radio', { name: 'Segue o programa da oficina de leitura.' }))
}
const review = (user: User) => user.click(screen.getByRole('checkbox', { name: 'Conferi o destinatário e o conteúdo desta prévia' }))
const complete = () => screen.getByRole('heading', { name: 'Prática concluída nesta demonstração' })

describe('U02 nas rotas oficiais', () => {
  it.each([messageMission, sharingMission])('abre $id diretamente do percurso e volta com foco na U02', async d => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/trilhas']}><App /></MemoryRouter>)
    const node = screen.getByRole('link', { name: new RegExp(`${d.id}.*Disponível`) })
    expect(node).toHaveAttribute('href', getOfficialMissionPath(d))
    node.focus(); await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { level: 1, name: d.content.title })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Voltar ao percurso da U02' }))
    expect(screen.getByRole('heading', { level: 3, name: /U02/ })).toHaveFocus()
    expect(screen.getAllByText('Em desenvolvimento · Ver proposta')).toHaveLength(10)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})

describe('M03 — compor, revisar e simular', () => {
  it('explica destinatário/assunto inadequados e exige revisão explícita antes de enviar', async () => {
    const user = userEvent.setup(); renderMission(); await start(user)
    await message(user)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Destinatário' }), 'jardinagem')
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' }))
    expect(screen.getByRole('status')).toHaveTextContent(/Escolha Grupo de leitura/)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Destinatário' }), 'grupo-leitura')
    await user.click(screen.getByRole('radio', { name: 'Gostaria de saber sobre a oficina de jardinagem.' }))
    expect(screen.getByRole('status')).toHaveTextContent(/outro assunto/)
    await user.click(screen.getByRole('radio', { name: 'Estarei no encontro do grupo de leitura.' }))
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' }))
    expect(screen.getByRole('heading', { name: 'Confira antes de simular o envio' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Simular envio' }))
    expect(screen.getByRole('status')).toHaveTextContent(/Primeiro confira/)
    await review(user); await user.click(screen.getByRole('button', { name: 'Simular envio' }))
    expect(complete()).toHaveFocus()
    expect(screen.getByRole('region', { name: 'Resultado simulado' })).toHaveTextContent(/Estarei no encontro/)
  })
  it('oferece áudio representado com transcrição e invalida conferência após editar a mensagem', async () => {
    const user = userEvent.setup(); const { container } = renderMission(); await start(user); await message(user)
    await user.click(screen.getByText('Outra forma de preparar: áudio com transcrição', { selector: 'summary' }))
    await user.click(screen.getByRole('radio', { name: 'Representação de áudio com transcrição' }))
    expect(screen.getByText(/Não é uma gravação sua/)).toBeVisible()
    expect(screen.getByText(/Transcrição:/).parentElement).toHaveTextContent(/Confirmo minha participação/)
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' }))
    expect(screen.getByRole('status')).toHaveTextContent(/Confira a transcrição/)
    await user.click(screen.getByRole('button', { name: 'Conferir transcrição' }))
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' })); await review(user)
    await user.click(screen.getByRole('button', { name: 'Corrigir escolhas' }))
    expect(screen.getByRole('heading', { name: 'Prepare a confirmação para o grupo' })).toHaveFocus()
    expect(screen.getByText('Outra forma de preparar: áudio com transcrição', { selector: 'summary' }).parentElement).toHaveAttribute('open')
    await user.click(screen.getByRole('radio', { name: 'Estarei no encontro do grupo de leitura.' }))
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' }))
    expect(screen.getByRole('status')).toHaveTextContent(/Confira a transcrição/)
    await user.click(screen.getByRole('button', { name: 'Conferir transcrição' }))
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' }))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    await review(user); await user.click(screen.getByRole('button', { name: 'Simular envio' }))
    expect(complete()).toBeInTheDocument()
    expect(container.querySelector('audio,video,input[type=file],textarea,input[type=text]')).toBeNull()
  })
  it('mudar de áudio para texto mantém o rádio focado em conteúdo visível', async () => {
    const user = userEvent.setup(); renderMission(); await start(user)
    const summary = screen.getByText('Outra forma de preparar: áudio com transcrição', { selector: 'summary' })
    await user.click(summary)
    await user.click(screen.getByRole('radio', { name: 'Representação de áudio com transcrição' }))
    const text = screen.getByRole('radio', { name: 'Texto' })
    await user.click(text)
    expect(text).toHaveFocus()
    expect(text).toBeVisible()
    expect(summary.parentElement).toHaveAttribute('open')
    expect(screen.queryByRole('heading', { name: 'Áudio fictício de exemplo' })).not.toBeInTheDocument()
  })
})

describe('M04 — arquivos internos, contexto e cuidado', () => {
  it('permite conferir/remover imagem sintética indevida, sem usar galeria ou arquivos reais', async () => {
    const user = userEvent.setup(); const { container } = renderMission(true); await start(user)
    await user.click(screen.getByRole('radio', { name: /^Documento pessoal sintético/ }))
    expect(screen.getByRole('status')).toHaveTextContent(/informação pessoal fictícia desnecessária/)
    await user.click(screen.getByRole('button', { name: 'Conferir arquivo selecionado' }))
    const preview = screen.getByRole('region', { name: 'Conteúdo do arquivo selecionado' })
    expect(within(preview).getByRole('img')).toHaveAttribute('alt', expect.stringContaining('documento inventado'))
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' }))
    expect(screen.getByRole('status')).toHaveTextContent(/Não a compartilhe/)
    await user.click(screen.getByRole('button', { name: /^Remover anexo:/ }))
    expect(screen.queryByRole('region', { name: 'Conteúdo do arquivo selecionado' })).not.toBeInTheDocument()
    expect(container.querySelector('input[type=file]')).toBeNull()
  })
  it('exige conteúdo conferido, pessoa indicada, contexto e nova revisão ao corrigir', async () => {
    const user = userEvent.setup(); renderMission(true); await start(user)
    await user.click(screen.getByRole('radio', { name: /^Programa da oficina de leitura/ }))
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' }))
    expect(screen.getByRole('status')).toHaveTextContent(/Conferir arquivo selecionado/)
    await file(user)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Destinatário' }), 'grupo-publico')
    expect(screen.getByRole('status')).toHaveTextContent(/não de um grupo público/)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Destinatário' }), 'equipe-leitura')
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' })); await review(user)
    await user.click(screen.getByRole('button', { name: 'Corrigir escolhas' }))
    expect(screen.getByRole('radio', { name: 'Segue o programa da oficina de leitura.' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' }))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    await review(user); await user.click(screen.getByRole('button', { name: 'Simular compartilhamento' }))
    expect(complete()).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent(/Compartilhamento apenas simulado/)
  })
})

describe('Ciclo e acessibilidade das novas missões', () => {
  it.each([false, true])('preserva ajuda, pausa, repetição e descarte da execução, arquivo=%s', async isFile => {
    const user = userEvent.setup(); renderMission(isFile); await start(user)
    if (isFile) await file(user); else await message(user)
    await user.click(screen.getByRole('button', { name: 'Ajuda nesta página' }))
    expect(screen.getByRole('button', { name: 'Ajuda nesta página' })).toHaveAttribute('aria-expanded', 'true')
    await openPracticeOptions(user); await user.click(screen.getByRole('button', { name: 'Interromper a prática' }))
    await user.click(screen.getByRole('button', { name: 'Retomar a prática' }))
    expect(screen.getByRole('combobox', { name: 'Destinatário' })).toHaveValue(isFile ? 'equipe-leitura' : 'grupo-leitura')
    await user.click(screen.getByRole('button', { name: 'Abrir prévia' })); await review(user)
    await user.click(screen.getByRole('button', { name: isFile ? 'Simular compartilhamento' : 'Simular envio' }))
    await user.click(screen.getByRole('button', { name: 'Repetir a micromissão' })); await start(user)
    expect(screen.getByRole('combobox', { name: 'Destinatário' })).toHaveValue('')
    await user.click(screen.getByRole('link', { name: 'Voltar ao percurso da U02' }))
    await user.click(screen.getByRole('link', { name: new RegExp(`${isFile ? 'M04' : 'M03'}.*Disponível`) }))
    expect(screen.getByRole('heading', { name: 'O que vamos praticar' })).toBeInTheDocument()
  })
  it.each([false, true])('inspeciona fases e controles da comunicação com axe em jsdom, arquivo=%s', async isFile => {
    const user = userEvent.setup(); renderMission(isFile); document.documentElement.lang = 'pt-BR'
    const inspect = async () => {
      const r = await axe.run(document.documentElement, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, rules: { 'color-contrast': { enabled: false }, 'target-size': { enabled: false } } })
      expect(r.violations.map(v => v.id)).toEqual([])
    }
    await inspect(); await start(user)
    if (isFile) await file(user); else await message(user)
    await inspect(); await user.click(screen.getByRole('button', { name: 'Abrir prévia' })); await inspect()
    await review(user); await user.click(screen.getByRole('button', { name: isFile ? 'Simular compartilhamento' : 'Simular envio' })); await inspect()
  }, 20000)
})
