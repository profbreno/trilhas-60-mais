/* global fetch, process, Buffer, setTimeout */
import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'
import assert from 'node:assert/strict'
import WebSocket from 'ws'

// Chrome isolado em 9227; Vite em 5173. Apenas investigação, sem alterar o produto.
const out=path.resolve('docs/AVALIACAO/evidencias/FECHAMENTO-U01')
fs.mkdirSync(out,{recursive:true})
const original=JSON.parse(fs.readFileSync('docs/AVALIACAO/evidencias/A11Y-U01/reinspecao/resultados.json','utf8'))
const cases=original.records.filter(r=>r.statusContraste==='não verificado')
assert.equal(cases.length,5)
const targets=await(await fetch('http://127.0.0.1:9227/json/list')).json()
const socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl)
await new Promise(resolve=>socket.once('open',resolve))
let id=0
const pending=new Map()
socket.on('message',raw=>{const m=JSON.parse(raw);if(!m.id)return;const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(new Error(JSON.stringify(m.error)));else p.resolve(m.result)})
const cdp=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))})
const evaluate=async expression=>{const r=await cdp('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value}
const pause=()=>new Promise(resolve=>setTimeout(resolve,60))
const until=async expression=>{for(let n=0;n<200;n++){if(await evaluate(expression))return;await pause()}throw new Error(`Timeout: ${expression}`)}
const go=async url=>{await cdp('Page.navigate',{url});await until(url.startsWith('chrome:')?"typeof chrome.settingsPrivate?.setDefaultZoom==='function'":"Boolean(document.querySelector('main h1'))&&getComputedStyle(document.documentElement).fontSize!=='16px'")}
const key=async name=>{await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:name,code:name,windowsVirtualKeyCode:name==='Tab'?9:13,text:name==='Enter'?'\r':undefined});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:name,code:name});await pause()}
const activate=async label=>{for(let n=0;n<120;n++){if(await evaluate(`document.activeElement.textContent.trim()===${JSON.stringify(label)}&&['A','BUTTON','SUMMARY'].includes(document.activeElement.tagName)`)){await key('Enter');return}await key('Tab')}throw new Error(`Não alcançado: ${label}`)}
const unit='http://127.0.0.1:5173/trilhas/primeiros-passos/unidades/operacao-basica-do-celular/missoes/'
const paths={m01:unit+'encontrar-os-caminhos-da-tela',m02:unit+'preparar-a-tela-para-ler-um-convite'}
const start=async()=>{await activate('Conhecer a atividade');await activate('Começar a prática')}
const shot=async name=>{const r=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,`${name}.png`),Buffer.from(r.data,'base64'))}
const channels=color=>color.match(/[\d.]+/g).map(Number)
function luminance(color){const values=channels(color).slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return values.reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0)}
function contrast(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
assert.equal(contrast('rgb(0,0,0)','rgb(255,255,255)'),21)
const measure=async selector=>evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),s=getComputedStyle(e),r=e.getBoundingClientRect();let p=e,bg;const chain=[];while(p){const ps=getComputedStyle(p);chain.push({tag:p.tagName,background:ps.backgroundColor});if(ps.backgroundColor!=='rgba(0, 0, 0, 0)'){bg=ps.backgroundColor;break}p=p.parentElement}return {selector:${JSON.stringify(selector)},text:e.textContent.trim(),foreground:s.color,ownBackground:s.backgroundColor,effectiveBackground:bg,backgroundChain:chain,opacity:s.opacity,filter:s.filter,fontSize:s.fontSize,fontWeight:s.fontWeight,outlineColor:s.outlineColor,outlineWidth:s.outlineWidth,outlineStyle:s.outlineStyle,decoration:s.textDecorationLine,transform:s.transform,rect:{top:r.top,bottom:r.bottom,left:r.left,right:r.right},focused:document.activeElement===e,focusVisible:e.matches(':focus-visible'),disabled:e.disabled===true,accent:s.accentColor}})()`)
const withRatio=m=>({...m,ratio:contrast(m.foreground,m.effectiveBackground),textStatus:contrast(m.foreground,m.effectiveBackground)>=4.5?'aprovado':'reprovado'})
const forceHover=async selector=>{const {root}=await cdp('DOM.getDocument');const {nodeId}=await cdp('DOM.querySelector',{nodeId:root.nodeId,selector});await cdp('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:['hover']});return nodeId}
const clearHover=async nodeId=>cdp('CSS.forcePseudoState',{nodeId,forcedPseudoClasses:[]})
const axeSource=fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8')
const results=[],supplementary=[]
try{
  await cdp('Page.enable');await cdp('DOM.enable');await cdp('CSS.enable')
  const browser=await cdp('Browser.getVersion')
  for(let index=0;index<cases.length;index++){
    const item=cases[index],code=`C0${index+1}`,font=item.profile==='texto-200-320'?32:16
    await cdp('Emulation.clearDeviceMetricsOverride');await go('chrome://settings/appearance')
    await evaluate(`new Promise(r=>chrome.settingsPrivate.setDefaultZoom(1,()=>chrome.settingsPrivate.setPref('webkit.webprefs.default_font_size',${font},'',r)))`)
    const mission=item.state.startsWith('m02')?'m02':'m01'
    await go(paths[mission]);await cdp('Emulation.setDeviceMetricsOverride',{width:320,height:900,deviceScaleFactor:1,mobile:false});await start()
    if(item.state==='m01-detalhes')await activate('Sobre esta demonstração')
    if(item.state==='m01-concluida')for(const label of ['Recados do bairro','Voltar à tela inicial da simulação','Calendário','Voltar à tela inicial da simulação','Recados do bairro','Voltar à tela inicial da simulação'])await activate(label)
    if(item.state==='m02-concluida'){
      await activate('Quero melhorar a leitura do texto')
      await evaluate("document.querySelector('input[value=reading]').click()") // Preparação do estado, não teste de teclado/leitor.
      await activate('Aplicar ajustes e ler o convite');await activate('Salão de leitura do Centro Comunitário')
    }
    await evaluate(axeSource)
    const audit=await evaluate("axe.run(document,{runOnly:['color-contrast']}).then(r=>({violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,reason:n.failureSummary}))}))}))")
    const hidden=withRatio(await measure('.skip-link'))
    assert.ok(hidden.rect.bottom<=0&&!hidden.focused)
    await shot(`${code}-original-oculto`)
    // Foco real por Tab até o link. Nenhum transform/estilo é removido para obter aprovação.
    for(let n=0;n<120&&!await evaluate("document.activeElement.matches('.skip-link')");n++)await key('Tab')
    const focused=withRatio(await measure('.skip-link'))
    assert.ok(focused.focused&&focused.focusVisible&&focused.rect.top>=0)
    focused.outlineWhite=contrast(focused.outlineColor,'rgb(255, 255, 255)')
    focused.outlinePage=contrast(focused.outlineColor,'rgb(247, 250, 249)')
    await shot(`${code}-foco`)
    const node=await forceHover('.skip-link'),hoverFocused=withRatio(await measure('.skip-link'));await clearHover(node)
    results.push({code,original:{profile:item.profile,state:item.state,skip:item.skip},audit,hidden:{...hidden,paintedInViewport:false,automaticStatus:'não verificável fora do viewport',ratioMeaning:'Par CSS calculável; não há texto pintado na janela neste estado.'},focused,hoverFocused,verdict:'aprovado para o contraste do texto visível; verificação automática original preservada como inconclusiva'})
    if(code==='C04')supplementary.push({name:'M01 apps desabilitados após conclusão',scope:'Estado inativo, isento dos mínimos de 1.4.3/1.4.11; proporção informativa.',...withRatio(await measure('.simulation-device button:disabled'))})
    process.stdout.write(`${code} ${item.profile}/${item.state}: foco ${focused.ratio.toFixed(3)}:1; oculto bottom ${hidden.rect.bottom}\n`)
  }
  await cdp('Emulation.clearDeviceMetricsOverride');await go('chrome://settings/appearance');await evaluate("new Promise(r=>chrome.settingsPrivate.setPref('webkit.webprefs.default_font_size',16,'',r))")
  await go(paths.m02)
  const primary='button.button--primary'
  supplementary.push({name:'Ação principal normal',...withRatio(await measure(primary))})
  const hover=await forceHover(primary);supplementary.push({name:'Ação principal hover forçado por DevTools',...withRatio(await measure(primary))});await clearHover(hover)
  await start();await activate('Quero aumentar o som')
  supplementary.push({name:'Feedback de erro M02',...withRatio(await measure('.status-message--error p'))})
  await shot('feedback-erro')
  await activate('Quero melhorar a leitura do texto');await evaluate("document.querySelector('input[value=enlarged]').click()")
  const selection=withRatio(await measure('label:has(input[value=enlarged])'))
  selection.checked=await evaluate("document.querySelector('input[value=enlarged]').checked")
  selection.nativeIndicator='Somente rótulo medido; pixels/contraste do círculo nativo não avaliados por este cálculo.'
  supplementary.push({name:'Rótulo da opção selecionada M02',...selection})
  await shot('opcao-selecionada')
  fs.writeFileSync(path.join(out,'contraste.json'),JSON.stringify({browser,results,supplementary,method:'getComputedStyle em Chrome, fundo opaco próprio/ancestral e fórmula sRGB WCAG; sem amostrar pixels antialiasados. Hover forçado via DevTools. Testes com leitor de tela não executados.'},null,2))
  assert.ok(results.every(r=>r.focused.ratio>=4.5&&r.hoverFocused.ratio>=4.5&&r.focused.outlineWhite>=3&&r.focused.outlinePage>=3))
  assert.ok(supplementary.filter(r=>!r.disabled).every(r=>r.ratio>=4.5))
}finally{
  await cdp('Emulation.clearDeviceMetricsOverride').catch(()=>{})
  await go('chrome://settings/appearance').catch(()=>{})
  await evaluate("new Promise(r=>chrome.settingsPrivate.setDefaultZoom(1,()=>chrome.settingsPrivate.setPref('webkit.webprefs.default_font_size',16,'',r)))").catch(()=>{})
  socket.close()
}
