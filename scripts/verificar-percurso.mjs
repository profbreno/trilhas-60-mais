/* global fetch, process, Buffer, setTimeout */
import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import assert from 'node:assert/strict'
import WebSocket from 'ws'

// Vite local em 5173; Chrome com perfil isolado e depuração em 9224.
const out = path.resolve('docs/AVALIACAO/evidencias/PERCURSO')
fs.mkdirSync(out, { recursive: true })
const targets = await (await fetch('http://127.0.0.1:9224/json/list')).json()
const socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(resolve => socket.once('open', resolve))
let id = 0
const pending = new Map()
socket.on('message', raw => {
  const msg = JSON.parse(raw)
  if (!msg.id) return
  const task = pending.get(msg.id)
  pending.delete(msg.id)
  if (msg.error) task.reject(new Error(JSON.stringify(msg.error)))
  else task.resolve(msg.result)
})
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const key = ++id
  pending.set(key, { resolve, reject })
  socket.send(JSON.stringify({ id: key, method, params }))
})
const evaluate = async expression => {
  const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  return result.result.value
}
const wait = () => new Promise(resolve => setTimeout(resolve, 100))
const key = async (key, code = key) => {
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code, text: key === 'Enter' ? '\r' : undefined, windowsVirtualKeyCode: key === 'Enter' ? 13 : 9 })
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code })
  await wait()
}
const activate = async text => {
  if (['Interromper a prática', 'Reiniciar a micromissão'].includes(text) && await evaluate("Boolean(document.querySelector('.mission-options:not([open])'))")) await activate('Opções da prática')
  for (let n = 0; n < 80; n++) {
    if (await evaluate(`document.activeElement?.textContent.trim() === ${JSON.stringify(text)}`)) { await key('Enter'); return }
    await key('Tab')
  }
  throw new Error(`Não alcançado por teclado: ${text}`)
}
const nodeActivate = async id => {
  for (let n = 0; n < 80; n++) {
    if (await evaluate(`document.activeElement?.id === ${JSON.stringify(id)}`)) { await key('Enter'); return }
    await key('Tab')
  }
  throw new Error(`Nó não alcançado: ${id}`)
}
const records = []
const axe = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const audit = async name => {
  await evaluate(axe)
  const result = await evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(r=>({violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))}))")
  const layout = await evaluate("({width:innerWidth,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,focus:document.activeElement.id,outline:getComputedStyle(document.activeElement).outline,nodes:[...document.querySelectorAll('.path-mission-link')].map(e=>{let r=e.getBoundingClientRect();return {id:e.id,width:r.width,height:r.height,href:e.getAttribute('href')}})})")
  records.push({ name, result, layout })
  assert.equal(result.violations.length, 0, `${name}: axe`)
  assert.ok(layout.scrollWidth <= layout.clientWidth, `${name}: overflow`)
  assert.ok(layout.nodes.every(n => n.width >= 48 && n.height >= 48), `${name}: alvos`)
  const image = await cdp('Page.captureScreenshot', { format: 'png' })
  fs.writeFileSync(path.join(out, `${name}.png`), Buffer.from(image.data, 'base64'))
  process.stdout.write(`${name}: axe 0, sem overflow\n`)
}
try {
  await cdp('Page.enable')
  const browser = await cdp('Browser.getVersion')
  for (const width of [320, 360, 768, 1280]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, mobile: false, deviceScaleFactor: 1 })
    await cdp('Page.navigate', { url: 'http://127.0.0.1:5173/' })
    for (let n = 0; n < 100 && !await evaluate("Boolean(document.getElementById('no-M20'))"); n++) await wait()
    await audit(`percurso-${width}-inicio`)
    await activate('Ir à primeira missão disponível')
    assert.equal(await evaluate('document.activeElement.id'), 'no-M01')
    await audit(`percurso-${width}-u01`)
    await key('Tab')
    assert.equal(await evaluate('document.activeElement.id'), 'no-M02')
    await key('Enter')
    await activate('Conhecer a atividade'); await activate('Começar a prática')
    await activate('Interromper a prática'); await activate('Voltar ao percurso da U01')
    assert.equal(await evaluate('document.activeElement.id'), 'percurso-u01')
    await nodeActivate('no-M01'); await activate('Conhecer a atividade'); await activate('Começar a prática')
    for (const text of ['Recados do bairro', 'Voltar à tela inicial da simulação', 'Calendário', 'Voltar à tela inicial da simulação', 'Recados do bairro', 'Voltar à tela inicial da simulação']) await activate(text)
    await activate('Voltar ao percurso da U01')
    assert.equal(await evaluate('document.activeElement.id'), 'percurso-u01')
    await nodeActivate('no-M11')
    assert.equal(await evaluate("Boolean([...document.querySelectorAll('h2')].find(e=>e.textContent==='Atividade em desenvolvimento'))"), true)
    await activate('Voltar ao percurso')
    assert.equal(await evaluate('document.activeElement.id'), 'percurso-u06')
  }
  fs.writeFileSync(path.join(out, 'navegador.json'), JSON.stringify({ browser, records, keyboard: 'M02 pausa e retorno, M01 conclusão e retorno, M11 proposta e retorno, em quatro larguras. Tab e Enter reais via CDP.', zoom200: 'Não verificado: inspeção em viewport estreito não equivale a zoom real.' }, null, 2))
} finally { socket.close() }
