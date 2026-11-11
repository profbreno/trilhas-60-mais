/* global process, Buffer, setTimeout, fetch */
// Revisão local: Chrome isolado com --remote-debugging-port=9223 e Vite em 5173.
// Usa ws já presente no lockfile, sem instalar dependências de produção.
import fs from 'node:fs'
import path from 'node:path'
import WebSocket from 'ws'
import assert from 'node:assert/strict'
import { URL } from 'node:url'
const out = path.resolve('docs/AVALIACAO/evidencias/U01')
const base = 'http://127.0.0.1:5173'
const unit = '/trilhas/primeiros-passos/unidades/operacao-basica-do-celular'
const routes = { M01: `${unit}/missoes/encontrar-os-caminhos-da-tela`, M02: `${unit}/missoes/preparar-a-tela-para-ler-um-convite` }
const delay = () => new Promise(resolve => setTimeout(resolve, 100))
async function main() {
  fs.mkdirSync(out, { recursive: true })
  const targets = await (await fetch('http://127.0.0.1:9223/json/list')).json()
  const socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl)
  await new Promise(resolve => socket.once('open', resolve))
  let id = 0
  const pending = new Map()
  const requests = new Set()
  socket.on('message', raw => {
    const msg = JSON.parse(raw)
    if (msg.method === 'Network.requestWillBeSent') requests.add(msg.params.request.url)
    if (msg.id) {
      const task = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) task.reject(new Error(JSON.stringify(msg.error)))
      else task.resolve(msg.result)
    }
  })
  const cdp = (method, params = {}) => new Promise((resolve, reject) => {
    const key = ++id
    pending.set(key, { resolve, reject })
    socket.send(JSON.stringify({ id: key, method, params }))
  })
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
    return result.result.value
  }
  const waitFor = async expression => {
    for (let n = 0; n < 100; n++) { if (await evaluate(expression)) return; await delay() }
    throw new Error(`Timeout: ${expression}`)
  }
  const go = async mission => {
    await cdp('Page.navigate', { url: base + routes[mission] })
    await waitFor("document.querySelector('.mission-runner h2')?.textContent === 'O que vamos praticar'")
  }
  const key = async (name, code = name, modifiers = 0) => {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code, modifiers, text: name === 'Enter' ? '\r' : name === ' ' ? ' ' : undefined, windowsVirtualKeyCode: name === 'Tab' ? 9 : name === 'Enter' ? 13 : name === ' ' ? 32 : name === 'ArrowRight' ? 39 : undefined })
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code, modifiers })
    await delay()
  }
  // Tab real desde o foco atual. Não usa .focus() ou .click() para executar ações.
  const activate = async text => {
    if (['Interromper a prática', 'Reiniciar a micromissão'].includes(text) && await evaluate("Boolean(document.querySelector('.mission-options:not([open])'))")) await activate('Opções da prática')
    for (let n = 0; n < 80; n++) {
      const found = await evaluate(`(() => { const a = document.activeElement; return a && (a.tagName === 'BUTTON' || a.tagName === 'A') && a.textContent.trim() === ${JSON.stringify(text)} })()`)
      if (found) { await key('Enter'); return }
      await key('Tab')
    }
    throw new Error(`Controle não alcançado por Tab: ${text}`)
  }
  const select = async label => {
    for (let n = 0; n < 80; n++) {
      if (await evaluate(`document.activeElement?.tagName === 'INPUT' && document.activeElement.closest('label')?.textContent.trim() === ${JSON.stringify(label)}`)) { await key(' ', 'Space'); return }
      // Radios não selecionados são alcançados por setas dentro do grupo.
      if (await evaluate("document.activeElement?.type === 'radio' && document.activeElement.name === 'presentation'")) {
        await key('ArrowRight')
      } else await key('Tab')
    }
    throw new Error(`Radio não alcançado: ${label}`)
  }
  const begin = async () => { await activate('Conhecer a atividade'); await activate('Começar a prática') }
  const records = []
  const axeSource = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
  const audit = async (name, screenshot = true) => {
    await evaluate(axeSource)
    const accessibility = await evaluate("axe.run(document, {runOnly: {type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(r => ({violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})), incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})), passes:r.passes.length}))")
    const layout = await evaluate(`(() => { const a = document.activeElement, s = a && getComputedStyle(a); return { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, focused: a?.textContent.trim().slice(0,100), focusOutline: s?.outline, h1:document.querySelectorAll('h1').length, heading:document.querySelector('.mission-runner h2')?.textContent, storage:{local:localStorage.length,session:sessionStorage.length,cookies:document.cookie}, controls:[...document.querySelectorAll('button,a,input')].filter(e=>e.getClientRects().length).map(e=>{const r=(e.type==='radio'?e.closest('label'):e).getBoundingClientRect();return {name:e.type==='radio'?e.closest('label').textContent.trim():e.textContent.trim(),width:r.width,height:r.height,disabled:e.disabled===true}}) } })()`)
    records.push({ name, accessibility, layout })
    if (screenshot) {
      // Evita artefato de captura full-page de elementos fixed fora do viewport.
      const scroll = await evaluate('({x:scrollX,y:scrollY})')
      await evaluate('scrollTo(0,0)')
      const { cssContentSize } = await cdp('Page.getLayoutMetrics')
      const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: layout.width, height: cssContentSize.height, scale: 1 } })
      fs.writeFileSync(path.join(out, `${name}.png`), Buffer.from(shot.data, 'base64'))
      await evaluate(`scrollTo(${scroll.x},${scroll.y})`)
    }
    process.stdout.write(`${name}: ${accessibility.violations.length} violações axe, largura ${layout.scrollWidth}/${layout.clientWidth}\n`)
    assert.equal(accessibility.violations.length, 0, `${name}: axe`)
    assert.ok(layout.scrollWidth <= layout.clientWidth, `${name}: rolagem horizontal`)
    assert.ok(layout.controls.every(c => c.disabled || (c.width >= 48 && c.height >= 48)), `${name}: alvo menor que 48 px (radios medidos pelo rótulo clicável)`)
  }
  try {
    await cdp('Page.enable'); await cdp('Runtime.enable'); await cdp('Network.enable')
    const browser = await cdp('Browser.getVersion')
    for (const width of [360, 768, 1280]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
      await go('M01'); await begin(); await audit(`m01-${width}-inicio`)
      await activate('Calendário'); await audit(`m01-${width}-erro`, false)
      await activate('Ajuda nesta página'); await activate('Interromper a prática'); await audit(`m01-${width}-pausa`, false)
      await activate('Retomar a prática'); await activate('Voltar à tela inicial da simulação')
      await activate('Recados do bairro'); await activate('Voltar à tela inicial da simulação'); await activate('Calendário')
      await audit(`m01-${width}-recuperacao`)
      await activate('Voltar à tela inicial da simulação'); await activate('Recados do bairro'); await activate('Voltar à tela inicial da simulação')
      assert.equal(await evaluate("document.querySelector('.mission-runner h2').textContent"), 'Prática concluída nesta demonstração')
      await audit(`m01-${width}-conclusao`, false)
      await activate('Repetir a micromissão'); assert.equal(await evaluate("document.querySelector('.mission-runner h2').textContent"), 'O que vamos praticar')
      await go('M02'); await begin(); await activate('Quero aumentar o som'); await audit(`m02-${width}-erro`, false)
      await activate('Quero melhorar a leitura do texto'); await activate('Aplicar ajustes e ler o convite'); await audit(`m02-${width}-ajustes`)
      await select('Texto ampliado'); await activate('Aplicar ajustes e ler o convite')
      await activate('Coreto da Praça das Flores'); await audit(`m02-${width}-local-incorreto`, false)
      await activate('Desfazer ajustes da prévia'); await select('Modo de leitura'); await activate('Aplicar ajustes e ler o convite')
      await audit(`m02-${width}-leitura`)
      await activate('Salão de leitura do Centro Comunitário')
      assert.equal(await evaluate("document.querySelector('.mission-runner h2').textContent"), 'Prática concluída nesta demonstração')
      await audit(`m02-${width}-conclusao`, false)
      await activate('Desfazer ajustes da prévia'); await activate('Repetir a micromissão')
    }
    // Tentativa de zoom por atalho; somente declarar zoom real se a métrica mudar.
    await cdp('Emulation.clearDeviceMetricsOverride')
    await go('M02'); await begin()
    const beforeZoom = await evaluate('({width:innerWidth,ratio:devicePixelRatio,scale:visualViewport.scale})')
    for (let n = 0; n < 5; n++) await key('+', 'Equal', 2)
    const afterZoom = await evaluate('({width:innerWidth,ratio:devicePixelRatio,scale:visualViewport.scale})')
    // Reflow estreito é verificado separadamente; não equivale a zoom do navegador.
    await cdp('Emulation.setDeviceMetricsOverride', { width: 320, height: 900, deviceScaleFactor: 1, mobile: false })
    await go('M02'); await begin(); await activate('Quero melhorar a leitura do texto')
    await audit('m02-320-reflow')
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }, { name: 'prefers-reduced-motion', value: 'reduce' }] })
    await audit('m02-320-cores-forcadas', false)
    await cdp('Emulation.setEmulatedMedia', { features: [] })
    fs.writeFileSync(path.join(out, 'navegador.json'), JSON.stringify({ browser, zoomShortcut: { beforeZoom, afterZoom, verified: false, note: 'Atalho headless não comprova zoom real a 200%; seguir roteiro manual.' }, records, requests: [...requests] }, null, 2))
  } finally {
    // Evidências parciais são preservadas mesmo se uma asserção falhar.
    fs.writeFileSync(path.join(out, 'estados.json'), JSON.stringify(records, null, 2))
    socket.close()
  }
}
main().catch(error => { process.stderr.write(`${error.stack}\n`); process.exitCode = 1 })
