import { describe, expect, it } from 'vitest'
import { messageMission, sharingMission } from '../../data/communicationMissions'
import { createExecution, reduceExecution } from './execution'
import type { CommunicationAction, CommunicationDefinition, ExecutionState } from './types'

type Local<T> = T extends { kind: string } ? Omit<T, 'kind'> : never
const ready = (d: CommunicationDefinition) => reduceExecution(reduceExecution(createExecution(d), { type: 'start-mission' }, d), { type: 'start-activity' }, d)
const act = (s: ExecutionState, a: Local<CommunicationAction>, d = messageMission) => reduceExecution(s, { type: 'activity', action: { ...a, kind: 'communication' } }, d)
function state(s: ExecutionState) { if (s.activity.kind !== 'communication') throw new Error('Modalidade inesperada'); return s.activity }
function prepared(d = messageMission, content = d.mode === 'message' ? 'confirmo' : 'segue-programa') {
  let s = ready(d)
  if (d.mode === 'file') { s = act(s, { type: 'select-file', id: 'programa' }, d); s = act(s, { type: 'inspect-file' }, d) }
  s = act(s, { type: 'select-recipient', id: d.rules.recipientId }, d)
  s = act(s, { type: 'select-content', id: content }, d)
  if (d.mode === 'message') { s = act(s, { type: 'select-greeting', id: 'ola' }, d); s = act(s, { type: 'select-closing', id: 'ate' }, d) }
  return s
}
const preview = (d = messageMission) => act(prepared(d), { type: 'open-preview' }, d)
function finish(s: ExecutionState, d = messageMission) { return act(act(s, { type: 'set-review', checked: true }, d), { type: 'simulate-send' }, d) }

describe('Comunicação simulada — critérios e revisão', () => {
  it.each([messageMission, sharingMission])('não conclui $id por abrir ou confirmar antes da atividade', d => {
    const s = createExecution(d)
    expect(act(s, { type: 'simulate-send' }, d)).toBe(s)
    expect(act(ready(d), { type: 'simulate-send' }, d).phase).toBe('activity')
    expect(s.events).toEqual([])
  })
  it.each(['confirmo', 'estarei'])('aceita a formulação pertinente %s sem exigir áudio', content => {
    const s = finish(act(prepared(messageMission, content), { type: 'open-preview' }))
    expect(s.phase).toBe('completed')
    expect(state(s).format).toBe('text')
    expect(state(s).criteria).toEqual(['prepared', 'reviewed', 'sent'])
  })
  it('mantém a composição ao revisar destinatário incorreto', () => {
    let s = act(prepared(), { type: 'select-recipient', id: 'jardinagem' })
    s = act(s, { type: 'open-preview' })
    expect(s.feedback?.code).toBe('recipient-purpose')
    expect(state(s).contentId).toBe('confirmo')
    expect(state(s).step).toBe('prepare')
    expect(state(s).criteria).toEqual([])
  })
  it('não aceita outro assunto nem recado sem saudação/fechamento', () => {
    const wrong = act(prepared(messageMission, 'outro-assunto'), { type: 'open-preview' })
    expect(wrong.feedback?.code).toBe('content-purpose')
    let s = ready(messageMission)
    s = act(s, { type: 'select-recipient', id: 'grupo-leitura' })
    s = act(s, { type: 'select-content', id: 'confirmo' })
    expect(act(s, { type: 'open-preview' }).feedback?.code).toBe('complete-message')
  })
  it('exige conferência da transcrição somente quando áudio é escolhido', () => {
    let s = act(prepared(), { type: 'set-format', format: 'audio' })
    expect(act(s, { type: 'open-preview' }).feedback?.code).toBe('review-audio-first')
    s = act(s, { type: 'review-audio' })
    const changed = act(s, { type: 'select-content', id: 'estarei' })
    expect(state(changed).audioReviewed).toBe(false)
    expect(finish(act(s, { type: 'open-preview' })).phase).toBe('completed')
  })
  it('permite sair do áudio e usar texto equivalente', () => {
    let s = act(prepared(), { type: 'set-format', format: 'audio' })
    s = act(s, { type: 'set-format', format: 'text' })
    expect(finish(act(s, { type: 'open-preview' })).phase).toBe('completed')
  })
  it.each([messageMission, sharingMission])('abrir prévia de $id não substitui confirmar revisão', d => {
    const s = preview(d)
    expect(state(s).criteria).toEqual(['prepared'])
    expect(act(s, { type: 'simulate-send' }, d).feedback?.code).toBe('review-first')
    expect(s.events.some(e => e.type === 'mission_completed')).toBe(false)
    expect(finish(s, d).phase).toBe('completed')
  })
  it('desmarcar revisão e corrigir escolhas invalidam o envio anterior', () => {
    let s = act(preview(), { type: 'set-review', checked: true })
    s = act(s, { type: 'set-review', checked: false })
    expect(act(s, { type: 'simulate-send' }).phase).toBe('activity')
    s = act(s, { type: 'edit-draft' })
    expect(state(s).reviewed).toBe(false)
    expect(state(s).contentId).toBe('confirmo')
    s = act(s, { type: 'select-recipient', id: 'jardinagem' })
    expect(state(act(s, { type: 'open-preview' })).step).toBe('prepare')
    expect(state(s).criteria).toEqual([])
  })
})

describe('Compartilhamento — pertinência, inspeção e minimização', () => {
  it.each(['segue-programa', 'programacao'])('aceita contexto pertinente %s com arquivo conferido', content => {
    const s = finish(act(prepared(sharingMission, content), { type: 'open-preview' }, sharingMission), sharingMission)
    expect(s.phase).toBe('completed')
    expect(s.unitId).toBe('U02')
  })
  it('impede compartilhar imagem pessoal sintética e explica o cuidado', () => {
    let s = act(prepared(sharingMission), { type: 'select-file', id: 'documento' }, sharingMission)
    expect(s.feedback?.code).toBe('private-file')
    s = act(s, { type: 'inspect-file' }, sharingMission)
    s = act(s, { type: 'open-preview' }, sharingMission)
    expect(s.feedback?.code).toBe('private-file')
    expect(state(s).step).toBe('prepare')
    expect(state(s).criteria).toEqual([])
  })
  it('não confunde cartaz público com o programa e exige inspecionar novo anexo', () => {
    let s = act(prepared(sharingMission), { type: 'select-file', id: 'cartaz' }, sharingMission)
    expect(act(s, { type: 'open-preview' }, sharingMission).feedback?.code).toBe('file-purpose')
    s = act(s, { type: 'select-file', id: 'programa' }, sharingMission)
    expect(state(s).inspectedFileId).toBeNull()
    expect(act(s, { type: 'open-preview' }, sharingMission).feedback?.code).toBe('inspect-first')
  })
  it('remover anexo preserva contexto/destinatário e não conclui', () => {
    const s = act(prepared(sharingMission), { type: 'remove-attachment' }, sharingMission)
    expect(state(s).fileId).toBeNull()
    expect(state(s).inspectedFileId).toBeNull()
    expect(state(s).recipientId).toBe('equipe-leitura')
    expect(state(s).contentId).toBe('segue-programa')
    expect(state(act(s, { type: 'open-preview' }, sharingMission)).step).toBe('prepare')
  })
  it('não abre prévia com grupo público ou recado sem contexto', () => {
    let s = act(prepared(sharingMission), { type: 'select-recipient', id: 'grupo-publico' }, sharingMission)
    expect(act(s, { type: 'open-preview' }, sharingMission).feedback?.code).toBe('recipient-purpose')
    s = act(prepared(sharingMission), { type: 'select-content', id: 'imagem' }, sharingMission)
    expect(act(s, { type: 'open-preview' }, sharingMission).feedback?.code).toBe('content-purpose')
  })
  it('rejeita IDs desconhecidos e ações de outra modalidade', () => {
    const s = ready(sharingMission)
    expect(act(s, { type: 'select-file', id: 'arquivo-do-dispositivo' }, sharingMission).activity).toBe(s.activity)
    expect(reduceExecution(s, { type: 'activity', action: { kind: 'reading', type: 'apply-settings' } }, sharingMission)).toBe(s)
  })
})

describe('Ciclo e eventos reutilizados na U02', () => {
  it.each([messageMission, sharingMission])('ajuda, pausa, retorno e repetição de $id preservam o contrato', d => {
    const before = preview(d)
    let s = reduceExecution(before, { type: 'help' }, d)
    expect(s.activity).toBe(before.activity)
    expect(s.events.at(-1)?.type).toBe('help_requested')
    s = reduceExecution(s, { type: 'interrupt' }, d)
    expect(act(s, { type: 'simulate-send' }, d)).toBe(s)
    s = reduceExecution(s, { type: 'resume' }, d)
    expect(state(s).step).toBe('preview')
    s = reduceExecution(s, { type: 'previous' }, d)
    expect(state(s).step).toBe('prepare')
    expect(state(s).criteria).toEqual([])
    s = finish(act(s, { type: 'open-preview' }, d), d)
    expect(s.events.filter(e => e.type === 'mission_completed')).toHaveLength(1)
    const old = s.events
    s = reduceExecution(s, { type: 'repeat' }, d)
    expect(s.events.slice(0, old.length)).toEqual(old)
    expect(state(s).criteria).toEqual([])
    expect(state(s).recipientId).toBeNull()
    expect(s.attempt).toBe(2)
  })
  it('editar não emite conclusão de etapa e exige nova prévia', () => {
    let s = preview()
    const count = s.events.filter(e => e.type === 'step_completed').length
    s = act(s, { type: 'edit-draft' })
    expect(s.events.filter(e => e.type === 'step_completed')).toHaveLength(count)
    expect(s.history).toEqual([])
    s = reduceExecution(s, { type: 'previous' }, messageMission)
    expect(s.phase).toBe('instructions')
  })
  it.each([messageMission, sharingMission])('eventos $id contêm códigos e tipos, não mensagens ou conteúdo', d => {
    const s = finish(preview(d), d)
    for (const e of s.events) {
      expect(e).toMatchObject({ missionId: d.id, unitId: 'U02', source: 'local-demo', definitionVersion: d.version, schemaVersion: 2 })
      expect(Object.keys(e).every(k => ['sequence', 'source', 'missionId', 'unitId', 'definitionVersion', 'schemaVersion', 'attempt', 'type', 'step', 'action', 'reason'].includes(k))).toBe(true)
    }
    const serialized = JSON.stringify(s.events)
    for (const phrase of [...d.content.phrases, ...d.content.recipients]) expect(serialized).not.toContain(phrase.label)
    expect(new Set(s.events.map(e => e.sequence)).size).toBe(s.events.length)
    expect(s.events.slice(-3).map(e => e.type)).toEqual(['action_performed', 'step_completed', 'mission_completed'])
  })
})
