/* global fetch, process, Buffer, setTimeout */
import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import WebSocket from 'ws'

// Chrome isolado: --headless=new --window-size=1280,1000 --remote-debugging-port=9228.
// Usa configurações NATIVAS do Chrome; não usa CSS zoom, pinch ou deviceScaleFactor.
const out = path.resolve(`docs/AVALIACAO/evidencias/U02`)
fs.mkdirSync(out, { recursive: true })
const files = ['src/data/curriculum.ts', 'src/data/demoMissions.ts', ...fs.readdirSync('src/domain/missions').map(f => `src/domain/missions/${f}`), ...fs.readdirSync('public/brand').filter(f => f.endsWith('.png')).map(f => `public/brand/${f}`)]
const hashes = Object.fromEntries(files.map(f => [f, createHash('sha256').update(fs.readFileSync(f)).digest('hex')]))
const targets = await (await fetch('http://127.0.0.1:9228/json/list')).json()
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
const zooms = []
const records = []
const journeys = []
const errors = []
const key = async (name, modifiers = 0) => {
  const vk = { Enter:13, Tab:9, ' ':32, ArrowRight:39, ArrowLeft:37, ArrowDown:40, ArrowUp:38, Escape:27 }
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

// U02-FLOW: o cliente CDP compartilhado deste utilitário será composto abaixo.
async function recipient(value) {
  await findFocus("document.activeElement.tagName==='SELECT'")
  await key('ArrowDown')
  for(let i=0;i<5;i++) {if(await evaluate(`document.activeElement.value===${JSON.stringify(value)}`)){await key('Enter');return}await key('ArrowDown')}
  throw new Error(`Destinatário não selecionado: ${value}`)
}
async function composeMessage() {
  await recipient('grupo-leitura')
  await radio('greeting','Olá, grupo!');await radio('content','Confirmo minha participação no encontro de leitura.');await radio('closing','Até o encontro!')
}
async function acknowledge() {
  await findFocus("document.activeElement.type==='checkbox'")
  await key(' ')
  assert.ok(await evaluate('document.activeElement.checked'))
}
try {
  await cdp('Page.enable');await cdp('Emulation.clearDeviceMetricsOverride')
  const browser=await cdp('Browser.getVersion')
  for(const config of [{id:'360',zoom:1,width:360},{id:'1280',zoom:1,width:1280},{id:'zoom200',zoom:2},{id:'zoom400',zoom:4},{id:'320',zoom:1,width:320}].filter(c=>!process.argv[2]||c.id===process.argv[2])) {
    try {
      zooms.push({profile:config.id,...await configure(config.zoom,16,config.width)})
      await go(base);await activate('Ir à primeira missão disponível')
      await findFocus("document.activeElement.id==='no-M03'");await key('Enter');await until("document.querySelector('main h1')?.textContent==='Preparar uma mensagem para o grupo'");await start();await composeMessage()
      await audit(config.id,'m03-preparacao')
      await activate('Outra forma de preparar: áudio com transcrição')
      await radio('format','Representação de áudio com transcrição')
      await activate('Conferir transcrição');await audit(config.id,'m03-audio')
      await activate('Abrir prévia');await activate('Simular envio')
      assert.ok(await evaluate("document.querySelector('[role=status]').textContent.includes('Primeiro confira')"))
      await audit(config.id,'m03-previa')
      await activate('Corrigir escolhas')
      assert.ok(await evaluate("document.querySelector('.audio-example').open"))
      await radio('content','Estarei no encontro do grupo de leitura.')
      await activate('Conferir transcrição');await activate('Abrir prévia');await acknowledge();await activate('Simular envio')
      assert.equal(await evaluate('document.activeElement.textContent'),'Prática concluída nesta demonstração')
      await audit(config.id,'m03-conclusao')
      await activate('Voltar ao percurso da U02');assert.equal(await evaluate('document.activeElement.id'),'percurso-u02')
      await findFocus("document.activeElement.id==='no-M04'");await key('Enter');await until("document.querySelector('main h1')?.textContent==='Compartilhar o arquivo certo com a pessoa certa'");await start();await until("Boolean(document.querySelector('input[name=attachment]'))")
      await radio('attachment','Documento pessoal sintéticoImagem de exemplo · Exemplo com informação pessoal inventada, desnecessária para o pedido. Sem validade.')
      await activate('Conferir arquivo selecionado');await activate('Abrir prévia');await audit(config.id,'m04-anexo-indevido')
      await activate('Remover anexo: Documento pessoal sintético')
      await radio('attachment','Programa da oficina de leituraTexto de exemplo · Programação solicitada pela pessoa da equipe.')
      await activate('Conferir arquivo selecionado');await recipient('equipe-leitura')
      await radio('content','Segue o programa da oficina de leitura.');await audit(config.id,'m04-preparacao')
      await activate('Abrir prévia');await audit(config.id,'m04-previa')
      await acknowledge();await activate('Simular compartilhamento')
      assert.equal(await evaluate('document.activeElement.textContent'),'Prática concluída nesta demonstração')
      await audit(config.id,'m04-conclusao')
      await activate('Repetir a micromissão');await start()
      assert.equal(await evaluate("document.querySelector('select').value"),'')
      await activate('Voltar ao percurso da U02');assert.equal(await evaluate('document.activeElement.id'),'percurso-u02')
      journeys.push({profile:config.id,status:'aprovado',description:'M03 áudio/transcrição, prévia, envio prematuro bloqueado, edição e nova revisão; M04 anexo indevido, remoção, conferência, destinatário/contexto, compartilhamento, repetição e retorno U02. Tab/Enter/Espaço/setas.'})
    }catch(e){errors.push({profile:config.id,message:e.message,context:await evaluate("({url:location.href,heading:document.querySelector('.mission-runner h2')?.textContent,active:document.activeElement.outerHTML,controls:[...document.querySelectorAll('input,button')].map(e=>({name:e.name,text:e.textContent}))})")});await screenshot(`${config.id}-falha`);process.stdout.write(`FALHA ${config.id}: ${e.message}\n`)}
    fs.writeFileSync(path.join(out,process.argv[2]?`resultados-${process.argv[2]}.json`:'resultados.json'),JSON.stringify({browser,zooms,records,journeys,errors,protectedFiles:hashes},null,2))
  }
  if(errors.length||records.some(r=>r.status==='reprovado'))process.exitCode=1
}finally {await configure(1,16,1280).catch(()=>{});socket.close()}
