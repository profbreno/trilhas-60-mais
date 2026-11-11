/* global fetch, process, Buffer, setTimeout */
import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import assert from 'node:assert/strict'
import WebSocket from 'ws'

// Uso: node scripts/refinamento-ux01.mjs antes|depois. Chrome isolado em 9225.
const phase = process.argv[2]
assert.ok(['antes', 'depois'].includes(phase))
const out = path.resolve(`docs/AVALIACAO/evidencias/UX-01/${phase}`)
fs.mkdirSync(out, { recursive: true })
const targets = await (await fetch('http://127.0.0.1:9225/json/list')).json()
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
  for (let n = 0; n < 80; n++) {
    if (await evaluate(`document.activeElement?.textContent.trim() === ${JSON.stringify(text)}`)) { await key('Enter'); return }
    await key('Tab')
  }
  throw new Error(`Não alcançado por teclado: ${text}`)
}
const records = []
const axe = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const audit = async name => {
  await evaluate(axe)
  const result = await evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(r=>({violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))}))")
  const layout = await evaluate(`(() => {const visible=e=>e.getClientRects().length>0&&!e.closest('details:not([open])')||e.tagName==='SUMMARY'&&e.parentElement.getClientRects().length>0; const box=e=>{const r=e.getBoundingClientRect();return {top:r.top+scrollY,bottom:r.bottom+scrollY,height:r.height,width:r.width}}; const first=document.getElementById('no-M01');const area=document.querySelector('.mission-runner');return {width:innerWidth,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,pageHeight:document.documentElement.scrollHeight,firstMission:first?box(first):null,wordsBeforeFirst:first?document.body.innerText.split(first.textContent.trim())[0].split(/\\s+/).length:null,visibleControls:[...document.querySelectorAll('button,a,input,summary')].filter(visible).map(e=>({label:e.textContent.trim()||e.closest('label')?.textContent.trim(),...box(e.type==='radio'?e.closest('label'):e)})),missionControls:area?[...area.querySelectorAll('button,a,input,summary')].filter(visible).length:null,firstAction:area?.querySelector('.simulation-device button, .simulation-settings button[type=submit], .simulation-actions button')?box(area.querySelector('.simulation-device button, .simulation-settings button[type=submit], .simulation-actions button')):null,focus:document.activeElement.textContent.trim().slice(0,100),outline:getComputedStyle(document.activeElement).outline} })()`)
  records.push({ name, result, layout })
  assert.equal(result.violations.length, 0, `${name}: axe`)
  assert.ok(layout.scrollWidth <= layout.clientWidth, `${name}: overflow`)
  assert.ok(layout.visibleControls.every(n => n.width >= 48 && n.height >= 48), `${name}: alvos`)
  await evaluate('scrollTo(0,0)')
  const image = await cdp('Page.captureScreenshot', { format: 'png' })
  fs.writeFileSync(path.join(out, `${name}.png`), Buffer.from(image.data, 'base64'))
  const height = layout.firstMission ? layout.firstMission.bottom + 16 : layout.pageHeight
  const full = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x:0,y:0,width:layout.width,height,scale:1 } })
  fs.writeFileSync(path.join(out, `${name}-pagina.png`), Buffer.from(full.data, 'base64'))
  process.stdout.write(`${name}: axe 0, sem overflow\n`)
}
const go = async suffix => {
  await cdp('Page.navigate', { url:`http://127.0.0.1:5173${suffix}` })
  for(let n=0;n<100;n++) {if(await evaluate("Boolean(document.querySelector('main h1'))")) return; await wait()}
  throw new Error('Página não abriu')
}
const unit='/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/'
try {
  await cdp('Page.enable')
  const browser = await cdp('Browser.getVersion')
  for (const width of [320, 360, 768, 1280]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, mobile: false, deviceScaleFactor: 1 })
    await go('/')
    await audit(`percurso-${width}-inicio`)
    await go(unit+'encontrar-os-caminhos-da-tela')
    await activate('Conhecer a atividade'); await activate('Começar a prática'); await audit(`m01-${width}-pratica`)
    if(phase==='depois') {
      await activate('Opções da prática'); await activate('Interromper a prática')
      assert.equal(await evaluate("document.activeElement.textContent"),'Prática interrompida nesta página')
      await activate('Retomar a prática')
      for(const text of ['Recados do bairro','Voltar à tela inicial da simulação','Calendário','Voltar à tela inicial da simulação','Recados do bairro','Voltar à tela inicial da simulação']) await activate(text)
      assert.equal(await evaluate("document.activeElement.textContent"),'Prática concluída nesta demonstração')
    }
    await go(unit+'preparar-a-tela-para-ler-um-convite')
    await activate('Conhecer a atividade'); await activate('Começar a prática'); await activate('Quero melhorar a leitura do texto'); await audit(`m02-${width}-ajustes`)
    if(phase==='depois') {
      await activate('Outros ajustes simulados'); await audit(`m02-${width}-extras`)
      await activate('Outros ajustes simulados'); await activate('Aplicar ajustes e ler o convite'); await audit(`m02-${width}-feedback`)
      await activate('Opções da prática'); await activate('Interromper a prática'); await activate('Retomar a prática')
      await activate('Sobre esta demonstração')
      assert.equal(await evaluate("document.querySelector('progress')?.value"),1)
      await activate('Voltar ao percurso da U01')
      assert.equal(await evaluate('document.activeElement.id'),'percurso-u01')
    }
  }
  fs.writeFileSync(path.join(out, 'navegador.json'), JSON.stringify({ phase, browser, records, keyboardChecks:phase==='depois'?'Opções, interrupção/retomada M01/M02, conclusão M01, ajustes adicionais M02, feedback, objetivos e retorno com foco: Tab/Enter em quatro larguras.':'Fluxos iniciais por Tab/Enter.', measurementNotes:'wordsBeforeFirst é uma contagem experimental sem normalização de espaços; não usada na comparação. Controles expostos incluem itens fora do viewport e excluem conteúdo de details recolhido.', zoom200: 'Não verificado: viewport estreito não equivale a zoom real.' }, null, 2))
} finally { socket.close() }
