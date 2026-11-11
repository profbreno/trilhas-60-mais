/* global fetch, process, Buffer, setTimeout */
import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import WebSocket from 'ws'

// Chrome isolado: --headless=new --window-size=1280,1000 --remote-debugging-port=9226.
// Usa configurações NATIVAS do Chrome; não usa CSS zoom, pinch ou deviceScaleFactor.
const phase = process.argv[2] ?? 'inicial'
assert.ok(['inicial', 'reinspecao'].includes(phase))
const out = path.resolve(`docs/AVALIACAO/evidencias/A11Y-U01/${phase}`)
fs.mkdirSync(out, { recursive: true })
const files = ['src/data/curriculum.ts', 'src/data/demoMissions.ts', ...fs.readdirSync('src/domain/missions').map(f => `src/domain/missions/${f}`), ...fs.readdirSync('public/brand').filter(f => f.endsWith('.png')).map(f => `public/brand/${f}`)]
const hashes = Object.fromEntries(files.map(f => [f, createHash('sha256').update(fs.readFileSync(f)).digest('hex')]))
const targets = await (await fetch('http://127.0.0.1:9226/json/list')).json()
const socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl)
await new Promise(resolve => socket.once('open', resolve))
let sequence = 0
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
  const id = ++sequence
  pending.set(id, { resolve, reject })
  socket.send(JSON.stringify({ id, method, params }))
})
const evaluate = async expression => {
  const r = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails))
  return r.result.value
}
const pause = () => new Promise(resolve => setTimeout(resolve, 50))
const until = async expression => {
  for (let n = 0; n < 240; n++) { if (await evaluate(expression)) return; await pause() }
  throw new Error(`Timeout: ${expression}`)
}
const go = async url => {
  await cdp('Page.navigate', { url })
  await until(url.startsWith('chrome:') ? "typeof chrome.settingsPrivate?.setDefaultZoom === 'function'" : "Boolean(document.querySelector('main h1')) && getComputedStyle(document.documentElement).fontSize !== '16px'")
}
const base = 'http://127.0.0.1:5173'
const unit = '/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/'
const routes = { m01: unit + 'encontrar-os-caminhos-da-tela', m02: unit + 'preparar-a-tela-para-ler-um-convite' }
const zooms = []
const records = []
const journeys = []
const errors = []
const key = async (name, modifiers = 0) => {
  const vk = { Enter:13, Tab:9, ' ':32, ArrowRight:39, ArrowLeft:37, Escape:27 }
  await cdp('Input.dispatchKeyEvent', { type:'keyDown', key:name, code:name===' '?'Space':name, modifiers, windowsVirtualKeyCode:vk[name], text:name==='Enter'?'\r':name===' '?' ':undefined })
  await cdp('Input.dispatchKeyEvent', { type:'keyUp', key:name, code:name===' '?'Space':name, modifiers, windowsVirtualKeyCode:vk[name] })
  await pause()
}
const findFocus = async expression => {
  for (let n=0;n<130;n++) { if(await evaluate(expression)) return; await key('Tab') }
  throw new Error(`Controle não alcançado: ${expression}`)
}
const activate = async (label, how='Enter') => {
  await findFocus(`document.activeElement?.textContent.trim() === ${JSON.stringify(label)} && ['A','BUTTON','SUMMARY'].includes(document.activeElement.tagName)`)
  await key(how)
}
const radio = async (group, label) => {
  await findFocus(`document.activeElement?.tagName === 'INPUT' && document.activeElement.name === ${JSON.stringify(group)}`)
  for(let n=0;n<4;n++) {
    if(await evaluate(`document.activeElement.closest('label').textContent.trim() === ${JSON.stringify(label)}`)) { await key(' '); return }
    await key('ArrowRight')
  }
  throw new Error(`Rádio não alcançado: ${label}`)
}
const start = async () => { await activate('Conhecer a atividade'); await activate('Começar a prática') }
const screenshot = async name => {
  const r=await cdp('Page.captureScreenshot',{format:'png'})
  fs.writeFileSync(path.join(out,`${name}.png`), Buffer.from(r.data,'base64'))
}
const metrics = () => evaluate("({innerWidth,innerHeight,outerWidth,outerHeight,dpr:devicePixelRatio,scale:visualViewport.scale,root:getComputedStyle(document.documentElement).fontSize,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth})")
const configure = async (zoom, font, width) => {
  await cdp('Emulation.clearDeviceMetricsOverride')
  await go('chrome://settings/appearance')
  const setting = await evaluate(`new Promise(resolve=>chrome.settingsPrivate.setDefaultZoom(${zoom},success=>chrome.settingsPrivate.setPref('webkit.webprefs.default_font_size',${font},'',fontSuccess=>chrome.settingsPrivate.getDefaultZoom(value=>resolve({success,fontSuccess,value})))))`)
  assert.ok(setting.success && setting.fontSuccess)
  assert.ok(Math.abs(setting.value-zoom)<0.000001)
  await screenshot(`chrome-${zoom*100}-fonte-${font}`)
  await go(base)
  if(width) {
    for(let n=0;n<2;n++) {
      const m=await metrics()
      const w=await cdp('Browser.getWindowForTarget')
      await cdp('Browser.setWindowBounds',{windowId:w.windowId,bounds:{width:w.bounds.width+width-m.innerWidth,height:w.bounds.height+900-m.innerHeight}})
      await pause()
    }
    if(width<512) {
      // Chrome/Windows limita a janela nativa a 512 CSS px. Redimensionamento
      // emulado é registrado separadamente de janela nativa e de zoom real.
      setting.nativeResize=await metrics()
      setting.viewportEmulation={width,height:900}
      await cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false})
    }
  }
  return { setting, page:await metrics() }
}
const axe = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8')
const audit = async (profile,state) => {
  await evaluate(axe)
  const result=await evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(r=>({violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))}))")
  const layout=await metrics()
  const focus=await evaluate("(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),s=getComputedStyle(e);return {tag:e.tagName,label:e.textContent.trim().slice(0,100),outline:s.outline,top:r.top,bottom:r.bottom,left:r.left,right:r.right}})()")
  const outside=await evaluate("[...document.querySelectorAll('main button,main summary,main legend,main label,main a')].filter(e=>e.checkVisibility()).filter(e=>e.getBoundingClientRect().right>document.documentElement.clientWidth+1||e.getBoundingClientRect().left < -1).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,100),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right}))")
  const clipping=await evaluate("[...document.querySelectorAll('main button,main summary,main legend')].filter(e=>e.checkVisibility()&&e.scrollWidth>e.clientWidth+2).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,100),client:e.clientWidth,scroll:e.scrollWidth}))")
  const skip=await evaluate("(()=>{const e=document.querySelector('.skip-link'),r=e.getBoundingClientRect();return {focused:document.activeElement===e,top:r.top,bottom:r.bottom}})()")
  const statusContraste=result.violations.some(v=>v.id==='color-contrast')?'reprovado':result.incomplete.some(v=>v.id==='color-contrast')?'não verificado':'aprovado'
  const item={profile,state,layout,focus,outside,clipping,skip,result,statusContraste,status:layout.scrollWidth<=layout.clientWidth&&outside.length===0&&clipping.length===0&&(skip.focused||skip.bottom<=0)&&result.violations.length===0?'aprovado':'reprovado'}
  records.push(item)
  await screenshot(`${profile}-${state}`)
  process.stdout.write(`${profile}/${state}: ${item.status}, ${layout.scrollWidth}/${layout.clientWidth}\n`)
}
async function fullKeyboard(profile) {
  await go(base)
  await key('Tab')
  assert.ok(await evaluate("document.activeElement.matches('.skip-link')"))
  assert.ok(await evaluate("document.activeElement.getBoundingClientRect().top>=0"))
  await screenshot(`${profile}-skip-foco`)
  await key('Enter')
  assert.equal(await evaluate('document.activeElement.id'),'conteudo')
  await activate('Ir à primeira missão disponível')
  for(let n=1;n<=20;n++) { assert.equal(await evaluate('document.activeElement.id'),`no-M${String(n).padStart(2,'0')}`); await key('Tab') }
  await key('Tab',8)
  assert.equal(await evaluate('document.activeElement.id'),'no-M20')
  await go(base)
  await activate('Ir à primeira missão disponível'); await key('Enter'); await start()
  await activate('Ajuda nesta página',' ')
  assert.equal(await evaluate("document.activeElement.getAttribute('aria-expanded')"),'true')
  await key('Escape') // Não há contrato de Escape para disclosure; não é modal.
  await activate('Ajuda nesta página',' ')
  assert.equal(await evaluate("document.activeElement.getAttribute('aria-expanded')"),'false')
  await activate('Opções da prática',' '); await activate('Reiniciar a micromissão')
  assert.equal(await evaluate("document.activeElement.textContent"),'O que vamos praticar')
  await start(); await activate('Voltar à etapa anterior'); await activate('Começar a prática')
  await activate('Calendário'); await activate('Voltar à tela inicial da simulação')
  await activate('Recados do bairro'); await activate('Voltar à tela inicial da simulação'); await activate('Calendário')
  await activate('Opções da prática'); await activate('Interromper a prática'); await activate('Retomar a prática')
  for(const label of ['Voltar à tela inicial da simulação','Recados do bairro','Voltar à tela inicial da simulação']) await activate(label)
  assert.equal(await evaluate('document.activeElement.textContent'),'Prática concluída nesta demonstração')
  await audit(profile,'m01-concluida')
  await activate('Repetir a micromissão'); await activate('Voltar ao percurso da U01')
  assert.equal(await evaluate('document.activeElement.id'),'percurso-u01')
  await findFocus("document.activeElement.id === 'no-M02'"); await key('Enter'); await start()
  await activate('Quero aumentar o som'); await activate('Quero melhorar a leitura do texto')
  await activate('Outros ajustes simulados',' ')
  await radio('brightness','Brilho confortável'); await radio('volume','Volume audível')
  await activate('Aplicar ajustes e ler o convite')
  await audit(profile,'m02-feedback-inadequado')
  await radio('presentation','Texto ampliado'); await activate('Aplicar ajustes e ler o convite')
  await activate('Desfazer ajustes da prévia')
  await radio('presentation','Modo de leitura'); await activate('Aplicar ajustes e ler o convite')
  await activate('Coreto da Praça das Flores'); await activate('Ajuda nesta página')
  await activate('Salão de leitura do Centro Comunitário')
  assert.equal(await evaluate('document.activeElement.textContent'),'Prática concluída nesta demonstração')
  await audit(profile,'m02-concluida')
  await activate('Desfazer ajustes da prévia'); await activate('Repetir a micromissão'); await activate('Voltar ao percurso da U01')
  assert.equal(await evaluate('document.activeElement.id'),'percurso-u01')
  journeys.push({profile,status:'aprovado',details:'Vinte nós, Tab/Shift+Tab, Enter/Espaço, ajuda, opções, reinício, retorno de etapa, pausa/retomada M01, conclusão/repetição M01/M02, rádios por setas, desfazer M02 e retorno ao percurso.'})
}
try {
  await cdp('Page.enable')
  await cdp('Emulation.clearDeviceMetricsOverride')
  const browser=await cdp('Browser.getVersion')
  const configs=[{id:'base-1280',zoom:1,font:16,width:1280},{id:'zoom-real-200',zoom:2,font:16,full:true},{id:'zoom-real-400',zoom:4,font:16,full:true},{id:'viewport-320',zoom:1,font:16,width:320,full:true},{id:'texto-200-1280',zoom:1,font:32,width:1280},{id:'texto-200-320',zoom:1,font:32,width:320,full:true}]
  for(const config of configs) {
    try {
      const setting=await configure(config.zoom,config.font,config.width)
      zooms.push({profile:config.id,...setting})
      assert.ok(Math.abs(setting.page.dpr-config.zoom)<0.000001)
      await audit(config.id,'percurso')
      await go(base+routes.m01); await start(); await audit(config.id,'m01-inicio')
      await activate('Sobre esta demonstração'); await audit(config.id,'m01-detalhes')
      await go(base+routes.m02); await start(); await activate('Quero melhorar a leitura do texto'); await audit(config.id,'m02-ajustes')
      await activate('Outros ajustes simulados'); await audit(config.id,'m02-extras')
      if(config.full) await fullKeyboard(config.id)
    } catch(error) { errors.push({profile:config.id,message:error.message}); process.stdout.write(`${config.id}: FALHA ${error.message}\n`) }
    fs.writeFileSync(path.join(out,'resultados.json'),JSON.stringify({browser,zooms,records,journeys,errors,protectedFiles:hashes},null,2))
  }
  // Regressões de renderização: overflow do documento/rodapé, legenda e summary.
  if(errors.length || records.some(r=>r.status==='reprovado')) process.exitCode=1
} finally {
  await configure(1,16,1280).catch(()=>{})
  socket.close()
}
