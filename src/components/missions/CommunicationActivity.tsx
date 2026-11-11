import { FileText, MessageSquare, Mic } from 'lucide-react'
import { useState } from 'react'
import type { CommunicationAction, CommunicationChoice, CommunicationDefinition, CommunicationState } from '../../domain/missions/types'
import { AccessibleButton } from '../AccessibleButton'

type WithoutKind<T> = T extends { kind: string } ? Omit<T, 'kind'> : never

function PhraseChoices({ title, choices, selected, name, onSelect }: { title: string; choices: readonly CommunicationChoice[]; selected: string | null; name: string; onSelect: (id: string) => void }) {
  return <fieldset><legend>{title}</legend>{choices.map(choice => <label className="simulation-option" key={choice.id}>
    <input type="radio" name={name} value={choice.id} checked={selected === choice.id} onChange={() => onSelect(choice.id)} /><span>{choice.label}</span>
  </label>)}</fieldset>
}

function AudioAlternative({ state: s, text, onAction }: { state: CommunicationState; text: string; onAction: (action: WithoutKind<CommunicationAction>) => void }) {
  const [open, setOpen] = useState(s.format === 'audio')
  return <details className="audio-example" open={open} onToggle={e => setOpen(e.currentTarget.open)}><summary>Outra forma de preparar: áudio com transcrição</summary>
    <fieldset><legend>Formato da mensagem</legend>{(['text', 'audio'] as const).map(format => <label className="simulation-option" key={format}><input type="radio" name="format" checked={s.format === format} onChange={() => onAction({ type: 'set-format', format })} />{format === 'text' ? 'Texto' : 'Representação de áudio com transcrição'}</label>)}</fieldset>
    {s.format === 'audio' && <div className="file-preview"><Mic aria-hidden="true" /><h3>Áudio fictício de exemplo</h3><p>Representação sem reprodução sonora. Não é uma gravação sua e não há acesso ao microfone.</p><p><strong>Transcrição:</strong> {text || 'Escolha as frases para preparar o exemplo.'}</p><AccessibleButton variant="secondary" onClick={() => onAction({ type: 'review-audio' })}>Conferir transcrição</AccessibleButton><p>{s.audioReviewed ? 'Transcrição conferida para esta composição.' : 'Transcrição ainda a conferir.'}</p></div>}
  </details>
}

export function CommunicationActivity({ definition: d, state: s, onAction }: { definition: CommunicationDefinition; state: CommunicationState; onAction: (action: CommunicationAction) => void }) {
  const act = (action: WithoutKind<CommunicationAction>) => onAction({ ...action, kind: 'communication' })
  const selected = (choices: readonly CommunicationChoice[] | undefined, id: string | null) => choices?.find(c => c.id === id)?.label
  const recipient = selected(d.content.recipients, s.recipientId)
  const text = [selected(d.content.greetings, s.greetingId), selected(d.content.phrases, s.contentId), selected(d.content.closings, s.closingId)].filter(Boolean).join(' ')
  const file = d.content.files?.find(f => f.id === s.fileId)

  return <section className="communication-simulation" aria-label={d.mode === 'message' ? 'Mensagens fictícias' : 'Compartilhamento fictício'}>
    {s.step === 'prepare' ? <>
      <p className="communication-request">{d.content.request}</p>
      {d.mode === 'file' && <>
        <fieldset className="simulation-settings"><legend>Arquivos de exemplo</legend>{d.content.files?.map(f => <label className="simulation-option" key={f.id}>
          <input type="radio" name="attachment" checked={s.fileId === f.id} onChange={() => act({ type: 'select-file', id: f.id })} />
          <span><strong>{f.label}</strong><span className="file-description">{f.type} · {f.description}</span></span>
        </label>)}</fieldset>
        {file && <div className="simulation-actions"><AccessibleButton variant="secondary" onClick={() => act({ type: 'inspect-file' })}>Conferir arquivo selecionado</AccessibleButton><AccessibleButton variant="quiet" onClick={() => act({ type: 'remove-attachment' })}>{`Remover anexo: ${file.label}`}</AccessibleButton></div>}
        {file && s.inspectedFileId === file.id && <section className="file-preview" aria-label="Conteúdo do arquivo selecionado"><h3>{file.label}</h3>{file.image && <img src={file.image.src} alt={file.image.alt} width={480} height={300} />}<p>{file.body}</p></section>}
      </>}
      <div className="communication-recipient"><label htmlFor={`recipient-${d.id}`}>Destinatário</label>
        <select id={`recipient-${d.id}`} value={s.recipientId ?? ''} onChange={e => act({ type: 'select-recipient', id: e.target.value })}>
          <option value="" disabled>Escolha um destinatário fictício</option>{d.content.recipients.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        {recipient && <p>Destino escolhido: {recipient}</p>}
      </div>
      <div className="simulation-settings">
        {d.content.greetings && <PhraseChoices title="Saudação" choices={d.content.greetings} selected={s.greetingId} name="greeting" onSelect={id => act({ type: 'select-greeting', id })} />}
        <PhraseChoices title={d.mode === 'message' ? 'Confirmação de participação' : 'Recado de contexto'} choices={d.content.phrases} selected={s.contentId} name="content" onSelect={id => act({ type: 'select-content', id })} />
        {d.content.closings && <PhraseChoices title="Fechamento" choices={d.content.closings} selected={s.closingId} name="closing" onSelect={id => act({ type: 'select-closing', id })} />}
      </div>
      {d.mode === 'message' && <AudioAlternative state={s} text={text} onAction={act} />}
      <AccessibleButton onClick={() => act({ type: 'open-preview' })}>Abrir prévia</AccessibleButton>
    </> : <>
      <div className="communication-preview" aria-label={s.step === 'done' ? 'Resultado simulado' : 'Prévia da comunicação'} role="region">
        {d.mode === 'message' ? <MessageSquare aria-hidden="true" /> : <FileText aria-hidden="true" />}
        <h3>{s.step === 'done' ? 'Conversa de exemplo atualizada' : 'Prévia — nada foi enviado'}</h3>
        <p><strong>Destinatário:</strong> {recipient}</p><blockquote>{text}</blockquote>
        {s.format === 'audio' && <p>Representação de áudio fictício. O texto acima é a transcrição, sem gravação ou reprodução real.</p>}
        {file && <><h3>Anexo: {file.label}</h3>{file.image && <img src={file.image.src} alt={file.image.alt} width={480} height={300} />}<p>{file.body}</p></>}
        <p>Envio somente simulado nesta página. Nenhum aplicativo real foi acessado.</p>
      </div>
      {s.step === 'preview' && <>
        <label className="simulation-option"><input type="checkbox" checked={s.reviewed} onChange={e => act({ type: 'set-review', checked: e.target.checked })} /><span>Conferi o destinatário e o conteúdo desta prévia</span></label>
        <div className="simulation-actions"><AccessibleButton onClick={() => act({ type: 'simulate-send' })}>{d.mode === 'message' ? 'Simular envio' : 'Simular compartilhamento'}</AccessibleButton><AccessibleButton variant="secondary" onClick={() => act({ type: 'edit-draft' })}>Corrigir escolhas</AccessibleButton></div>
      </>}
    </>}
  </section>
}
