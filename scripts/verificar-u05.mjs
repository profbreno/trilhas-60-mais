/* global fetch, process, Buffer, setTimeout */
import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import WebSocket from 'ws'

// Chrome isolado: --headless=new --window-size=1280,1000 --remote-debugging-port=9231.
// Usa configurações NATIVAS do Chrome; não usa CSS zoom, pinch ou deviceScaleFactor.
const out = path.resolve(`docs/AVALIACAO/evidencias/U05`)
fs.mkdirSync(out, { recursive: true })
const files = ['src/data/curriculum.ts', 'src/data/demoMissions.ts', ...fs.readdirSync('src/domain/missions').map(f => `src/domain/missions/${f}`), ...fs.readdirSync('public/brand').filter(f => f.endsWith('.png')).map(f => `public/brand/${f}`)]
const hashes = Object.fromEntries(files.map(f => [f, createHash('sha256').update(fs.readFileSync(f)).digest('hex')]))
const targets = await (await fetch('http://127.0.0.1:9231/json/list')).json()
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
    if(await evaluate('document.activeElement.closest(\'label\').textContent.trim().startsWith('+JSON.stringify(label)+')')){await key(' ');return}
    await key('ArrowRight')
  }
  throw new Error('Opção não alcançada: '+label)
}
async function checkbox(label){await findFocus('document.activeElement.type===\'checkbox\' && document.activeElement.closest(\'label\').textContent.trim()==='+JSON.stringify(label));await key(' ')}

const fields=['Título da oficina','Local público do encontro','Dia e horário','Telefone particular','Endereço residencial','Documento pessoal sintético','Canal público da organização']
async function prepareAccount(){
  await activate('Consultar orientação sobre senha e código');await activate('Comparar estratégias');await radio('strategy','Usar frase longa e exclusiva desta conta fictícia')
  for(const c of ['O comprimento aumenta a resistência da estratégia.','Ser exclusiva reduz o risco de um vazamento afetar outras contas.'])await checkbox(c)
}
async function protectAccount(){
  await activate('Ativar etapa adicional simulada');await radio('code-role','É uma confirmação temporária adicional do acesso que iniciei');await activate('Usar código no acesso que iniciei')
  await radio('refusal','Recusar o envio e permanecer no acesso que iniciei')
  for(const c of ['O código confirma uma etapa do acesso iniciado por mim.','O interlocutor não precisa receber esse segredo.'])await checkbox(c)
}
async function editInvitation(){
  await activate('Consultar orientação sobre dados e finalidade');await radio('purpose','Divulgar publicamente a oficina para a comunidade')
  for(const label of [...fields].reverse()){await activate('Entender: '+label);await until("document.activeElement.id==='privacy-field-detail'")}
  for(const label of ['Telefone particular','Endereço residencial','Documento pessoal sintético'])await activate('Retirar: '+label)
  await activate('Recolocar: Endereço residencial');assert.ok(await evaluate("document.querySelector('#publication-preview').textContent.includes('RESIDÊNCIA DE EXEMPLO')"));await activate('Retirar: Endereço residencial')
  await activate('Conferir prévia atualizada');assert.equal(await evaluate('document.activeElement.id'),'publication-preview')
}
const acknowledgement='Conferi a prévia e os motivos antes de confirmar.'
try{
  await cdp('Page.enable');const browser=await cdp('Browser.getVersion')
  for(const config of [{id:'360',zoom:1,width:360},{id:'1280',zoom:1,width:1280},{id:'zoom200',zoom:2},{id:'zoom400',zoom:4},{id:'320',zoom:1,width:320}].filter(c=>!process.argv[2]||c.id===process.argv[2])){
    try{
      zooms.push({profile:config.id,...await configure(config.zoom,16,config.width)})
      await go(base);await findFocus("document.activeElement.id==='no-M09'");await key('Enter');await until("document.querySelector('main h1')?.textContent==='Cuidar da senha e do código de acesso'");await start();await prepareAccount()
      await radio('strategy','Reutilizar a senha de outro serviço');assert.ok(await evaluate("document.querySelector('[role=status]').textContent.includes('vazamento')"));await audit(config.id,'m09-estrategias')
      await radio('strategy','Usar frase longa e exclusiva desta conta fictícia');await activate('Continuar para proteção adicional');await protectAccount();await activate('Tentar enviar código pela conversa — simulação');assert.ok(await evaluate("document.querySelector('[role=status]').textContent.includes('nada saiu desta página')"));await audit(config.id,'m09-envio-bloqueado')
      await activate('Usar código no acesso que iniciei');await audit(config.id,'m09-acesso-protegido')
      await activate('Ajuda nesta página');await activate('Opções da prática');await activate('Interromper a prática');await activate('Retomar a prática')
      await activate('Revisar decisões de proteção');await activate('Confirmar proteção simulada');assert.ok(await evaluate("document.querySelector('[role=status]').textContent.includes('confirmação de revisão')"));await audit(config.id,'m09-revisao')
      await checkbox(acknowledgement);await activate('Corrigir decisões de proteção');await activate('Revisar decisões de proteção');assert.equal(await evaluate("document.querySelector('.privacy-choice input[type=checkbox]').checked"),false)
      await checkbox(acknowledgement);await activate('Confirmar proteção simulada');assert.equal(await evaluate('document.activeElement.textContent'),'Prática concluída nesta demonstração');await audit(config.id,'m09-conclusao')
      await activate('Voltar ao percurso da U05');assert.equal(await evaluate('document.activeElement.id'),'percurso-u05')
      await findFocus("document.activeElement.id==='no-M10'");await key('Enter');await until("document.querySelector('main h1')?.textContent==='Escolher o que pode ser compartilhado'");await start();await audit(config.id,'m10-rascunho')
      await editInvitation();await audit(config.id,'m10-editado');await activate('Continuar para escolha de público');await radio('audience','Grupo específico de contatos');await activate('Revisar decisões de proteção');assert.ok(await evaluate("document.querySelector('[role=status]').textContent.includes('outro contexto')"));await audit(config.id,'m10-publico')
      await radio('audience','Público da comunidade — divulgação pública');for(const c of ['O público deve corresponder à divulgação comunitária solicitada.','Retirei dados privados desnecessários e mantive as informações da oficina.'])await checkbox(c)
      await activate('Revisar decisões de proteção');await audit(config.id,'m10-revisao');await checkbox(acknowledgement);await activate('Confirmar compartilhamento simulado');assert.equal(await evaluate('document.activeElement.textContent'),'Prática concluída nesta demonstração');await audit(config.id,'m10-conclusao')
      assert.ok(await evaluate("!document.querySelector('#publication-preview').textContent.includes('RESIDÊNCIA DE EXEMPLO')"));await activate('Repetir a micromissão');await start();assert.ok(await evaluate("document.querySelector('#publication-preview').textContent.includes('RESIDÊNCIA DE EXEMPLO')"));await activate('Voltar ao percurso da U05');assert.equal(await evaluate('document.activeElement.id'),'percurso-u05')
      journeys.push({profile:config.id,status:'aprovado',description:'Tab/Enter/Espaço/setas: M09 comparação, reuso, etapa adicional, código no acesso, envio bloqueado, recusa e revisão; M10 inspeção, retirar/recolocar, prévia, público, justificativa, confirmação, repetição e retorno U05.'})
    }catch(e){errors.push({profile:config.id,message:e.message,context:await evaluate("({url:location.href,heading:document.querySelector('.mission-runner h2')?.textContent,active:document.activeElement.outerHTML})")});await screenshot(config.id+'-falha');process.stdout.write('FALHA '+config.id+': '+e.message+'\n')}
    fs.writeFileSync(path.join(out,process.argv[2]?'resultados-'+process.argv[2]+'.json':'resultados.json'),JSON.stringify({browser,zooms,records,journeys,errors,protectedFiles:hashes},null,2))
  }
  if(errors.length||records.some(r=>r.status==='reprovado'))process.exitCode=1
}finally{await configure(1,16,1280).catch(()=>{});socket.close()}
