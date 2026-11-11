/* global fetch, process, Buffer, setTimeout */
import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import WebSocket from 'ws'

// Chrome isolado: --headless=new --window-size=1280,1000 --remote-debugging-port=9230.
// Usa configurações NATIVAS do Chrome; não usa CSS zoom, pinch ou deviceScaleFactor.
const out = path.resolve(`docs/AVALIACAO/evidencias/U04`)
fs.mkdirSync(out, { recursive: true })
const files = ['src/data/curriculum.ts', 'src/data/demoMissions.ts', ...fs.readdirSync('src/domain/missions').map(f => `src/domain/missions/${f}`), ...fs.readdirSync('public/brand').filter(f => f.endsWith('.png')).map(f => `public/brand/${f}`)]
const hashes = Object.fromEntries(files.map(f => [f, createHash('sha256').update(fs.readFileSync(f)).digest('hex')]))
const targets = await (await fetch('http://127.0.0.1:9230/json/list')).json()
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
const base = process.env.TRILHAS_QA_URL || 'http://127.0.0.1:5173'
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
  const result=await evaluate("axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}).then(r=>({violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,any:n.any,all:n.all,none:n.none,html:n.html,styles:n.target.map(t=>{try{const e=document.querySelector(t);if(!e)return null;const s=getComputedStyle(e),r=e.getBoundingClientRect();return {color:s.color,background:s.backgroundColor,font:s.fontSize,weight:s.fontWeight,outline:s.outline,opacity:s.opacity,rect:{top:r.top,bottom:r.bottom,left:r.left,right:r.right},ancestors:[e,...function*(x){while(x.parentElement){x=x.parentElement;yield x}}(e)].map(a=>({tag:a.tagName,color:getComputedStyle(a).color,bg:getComputedStyle(a).backgroundColor,opacity:getComputedStyle(a).opacity}))}}catch{return null}})}))}))}))")
  const layout=await metrics()
  const focus=await evaluate("(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),s=getComputedStyle(e);return {tag:e.tagName,label:e.textContent.trim().slice(0,100),outline:s.outline,top:r.top,bottom:r.bottom,left:r.left,right:r.right}})()")
  const outside=await evaluate("[...document.querySelectorAll('main button,main summary,main legend,main label,main a')].filter(e=>e.checkVisibility()).filter(e=>e.getBoundingClientRect().right>document.documentElement.clientWidth+1||e.getBoundingClientRect().left < -1).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,100),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right}))")
  const clipping=await evaluate("[...document.querySelectorAll('main button,main summary,main legend')].filter(e=>e.checkVisibility()&&e.scrollWidth>e.clientWidth+2).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,100),client:e.clientWidth,scroll:e.scrollWidth}))")
  const skip=await evaluate("(()=>{const e=document.querySelector('.skip-link'),r=e.getBoundingClientRect();return {focused:document.activeElement===e,top:r.top,bottom:r.bottom}})()")
  const statusContraste=result.violations.some(v=>v.id==='color-contrast')?'reprovado':result.incomplete.some(v=>v.id==='color-contrast')?'não verificado':'aprovado'
  const item={profile,state,layout,focus,outside,clipping,skip,result,statusContraste,status:layout.scrollWidth<=layout.clientWidth&&outside.length===0&&clipping.length===0&&(skip.focused||skip.bottom<=0)&&result.violations.length===0?'aprovado':'reprovado'}
  await screenshot(`${profile}-${state}`)
  if (result.incomplete.some(v => v.id === 'color-contrast' && v.nodes.some(n => n.target.includes('.skip-link')))) {
    await findFocus("document.activeElement.matches('.skip-link')")
    const measure = () => evaluate(`(()=>{const e=document.querySelector('.skip-link'),s=getComputedStyle(e),r=e.getBoundingClientRect();const lum=c=>c.match(/[\\d.]+/g).slice(0,3).map(Number).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);return {foreground:s.color,background:s.backgroundColor,outline:s.outline,outlineColor:s.outlineColor,focusVisible:e.matches(':focus-visible'),textRatio:ratio(s.color,s.backgroundColor),outlinePage:ratio(s.outlineColor,getComputedStyle(document.documentElement).backgroundColor),outlineWhite:ratio(s.outlineColor,'rgb(255,255,255)'),rect:{top:r.top,bottom:r.bottom,left:r.left,right:r.right}}})()`)
    const focused = await measure();assert.ok(focused.focusVisible&&focused.rect.top>=0&&focused.textRatio>=4.5&&focused.outlinePage>=3)
    await screenshot(profile+'-'+state+'-foco')
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:(focused.rect.left+focused.rect.right)/2,y:(focused.rect.top+focused.rect.bottom)/2})
    const hoverFocused=await measure();assert.ok(hoverFocused.textRatio>=4.5);await screenshot(profile+'-'+state+'-foco-hover')
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0})
    item.directedContrast={focused,hoverFocused,verdict:'aprovado para texto visível e contorno; axe original inconclusivo preservado'}
  }
  records.push(item)
  process.stdout.write(`${profile}/${state}: ${item.status}, ${layout.scrollWidth}/${layout.clientWidth}\n`)
}



async function radio(group,label){
  await findFocus('document.activeElement.type===\'radio\' && document.activeElement.name==='+JSON.stringify(group))
  for(let n=0;n<8;n++){
    if(await evaluate('document.activeElement.closest(\'label\').textContent.trim()==='+JSON.stringify(label))){await key(' ');return}
    await key('ArrowRight')
  }
  throw new Error('Opção não alcançada: '+label)
}
async function checkbox(label){await findFocus('document.activeElement.type===\'checkbox\' && document.activeElement.closest(\'label\').textContent.trim()==='+JSON.stringify(label));await key(' ')}
const clues={M07:['Autoria e origem do recorte','Data completa e contexto original','Referência independente do bairro'],M08:['Mensagem do contato conhecido','Página que repete o aviso','Comunicado da organização']}
async function openClue(label){await activate(label);await until("document.activeElement.id==='information-detail'")}
async function investigate(id){for(const c of [...clues[id]].reverse())await openClue(c);await activate('Comparar evidências')}
async function justify(id){
  await radio('verdict','Ainda não verificada')
  for(const label of id==='M07'?['A autoria identificada pertence ao aviso arquivado, não a um novo comunicado.','A data integral é de 2031, anterior à conversa de 2032.','A referência independente não confirma o fechamento na data da conversa.']:['A página repete a mensagem; não é confirmação independente.','A organização ainda não confirmou a data.'])await checkbox(label)
  if(id==='M08'){
    await radio('conduct','Buscar confirmação adicional, sem encaminhar agora')
    await radio('response','Agradeço o aviso. Ainda falta confirmação da data; prefiro aguardar.')
    await radio('next-step','Consultar a organização por um canal conhecido e independente do encaminhamento.')
  }
}
const acknowledgement='Conferi a interpretação, os motivos e a decisão desta revisão.'
try{
  await cdp('Page.enable');const browser=await cdp('Browser.getVersion')
  for(const config of [{id:'360',zoom:1,width:360},{id:'1280',zoom:1,width:1280},{id:'zoom200',zoom:2},{id:'zoom400',zoom:4},{id:'320',zoom:1,width:320}].filter(c=>!process.argv[2]||c.id===process.argv[2])){
    try{
      zooms.push({profile:config.id,...await configure(config.zoom,16,config.width)})
      await go(base);await findFocus("document.activeElement.id==='no-M07'");await key('Enter');await until("document.querySelector('main h1')?.textContent==='Investigar de onde veio a notícia'");await start()
      await activate('Comparar evidências');assert.ok(await evaluate("document.querySelector('[role=status]').textContent.includes('todas as pistas')"));await audit(config.id,'m07-inicio')
      await openClue(clues.M07[1]);await audit(config.id,'m07-data-contexto');await investigate('M07')
      await activate('Consultar comparação das fontes');await audit(config.id,'m07-comparacao')
      await justify('M07');await radio('verdict','Contradita pelas evidências');await activate('Revisar interpretação e decisão');assert.ok(await evaluate("document.querySelector('[role=status]').textContent.includes('não prova falsidade')"));await audit(config.id,'m07-incerteza')
      await radio('verdict','Ainda não verificada');await activate('Revisar interpretação e decisão');await activate('Concluir investigação');assert.ok(await evaluate("document.querySelector('[role=status]').textContent.includes('confirmação de revisão')"));await audit(config.id,'m07-revisao')
      await checkbox(acknowledgement);await activate('Corrigir interpretação e decisão');await activate('Revisar interpretação e decisão');assert.equal(await evaluate("document.querySelector('.information-choice input[type=checkbox]').checked"),false)
      await checkbox(acknowledgement);await activate('Concluir investigação');assert.equal(await evaluate('document.activeElement.textContent'),'Prática concluída nesta demonstração');await audit(config.id,'m07-conclusao')
      await activate('Voltar ao percurso da U04');assert.equal(await evaluate('document.activeElement.id'),'percurso-u04')
      await findFocus("document.activeElement.id==='no-M08'");await key('Enter');await until("document.querySelector('main h1')?.textContent==='Decidir antes de compartilhar'");await start();await investigate('M08');await justify('M08')
      await radio('conduct','Compartilhar como fato com o grupo');assert.ok(await evaluate("document.querySelector('[role=status]').textContent.includes('Não divulgue como fato')"));await audit(config.id,'m08-conduta-inadequada')
      await radio('conduct','Não compartilhar enquanto faltar confirmação');await activate('Ajuda nesta página');await activate('Opções da prática');await activate('Interromper a prática');await activate('Retomar a prática');assert.ok(await evaluate("document.querySelector('input[name=conduct]:checked').value==='hold'"))
      await activate('Consultar comparação das fontes');await audit(config.id,'m08-comparacao')
      await activate('Revisar interpretação e decisão');await audit(config.id,'m08-revisao');await checkbox(acknowledgement);await activate('Confirmar decisão simulada');assert.equal(await evaluate('document.activeElement.textContent'),'Prática concluída nesta demonstração');await audit(config.id,'m08-conclusao')
      await activate('Repetir a micromissão');await start();assert.ok(await evaluate("document.querySelector('.information-simulation').textContent.includes('Pistas consultadas: 0 de 3')"));await activate('Voltar ao percurso da U04');assert.equal(await evaluate('document.activeElement.id'),'percurso-u04')
      journeys.push({profile:config.id,status:'aprovado',description:'Tab/Enter/Espaço/setas: M07 três pistas, comparação, incerteza/falsidade, revisão obrigatória e edição; M08 conduta indevida, resposta, ajuda/pausa/retomada, revisão, conclusão, repetição e retorno U04.'})
    }catch(e){errors.push({profile:config.id,message:e.message,context:await evaluate("({url:location.href,heading:document.querySelector('.mission-runner h2')?.textContent,active:document.activeElement.outerHTML})")});await screenshot(config.id+'-falha');process.stdout.write('FALHA '+config.id+': '+e.message+'\n')}
    fs.writeFileSync(path.join(out,process.argv[2]?'resultados-'+process.argv[2]+'.json':'resultados.json'),JSON.stringify({browser,zooms,records,journeys,errors,protectedFiles:hashes},null,2))
  }
  if(errors.length||records.some(r=>r.status==='reprovado'))process.exitCode=1
}finally{await configure(1,16,1280).catch(()=>{});socket.close()}
