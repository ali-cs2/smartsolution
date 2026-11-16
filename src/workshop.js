
import { createWorkshopModel, modelPose, renderModelSVG, MODEL_IDS } from './models.js';

const words={
 ar:{names:['ذراع روبوت','بوابة ذكية','زراعة متصلة'],actions:['شغّل الذراع','افتح البوابة','شغّل الري'],stop:'إعادة الحالة',pause:'إيقاف الحركة',play:'تشغيل الحركة',hint:'اسحب أفقياً للتدوير، أو استخدم مفاتيح الأسهم.',reset:'إعادة المنظور'},
 en:{names:['Robotic arm','Smart access','Connected growing'],actions:['Run the arm','Open the gate','Start irrigation'],stop:'Reset simulation',pause:'Pause motion',play:'Play motion',hint:'Drag horizontally to rotate, or use the arrow keys.',reset:'Reset view'}
};
export function mountWorkshop(root,{locale='ar',paused=false,onPaused=()=>{}}={}){
 const t=words[locale],canvas=root.querySelector('canvas'),fallback=root.querySelector('.model-fallback'),surface=root.querySelector('.model-surface');
 const motion=root.querySelector('.motion'),actionButton=root.querySelector('.model-action'),reset=root.querySelector('.model-reset'),tabs=[...root.querySelectorAll('[data-model]')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const ac=new AbortController(),on=(el,type,fn,options={})=>el.addEventListener(type,fn,{...options,signal:ac.signal});
 let model=createWorkshopModel('robot'),adapter=null,disposed=false,visible=true,raf=0,time=0,last=0,lastSVG=-1000,dirty=true,manualYaw=.68,action=false,drag=null;
 paused=paused||reduced.matches;
 function sync(){
  root.dataset.model=model.kind;root.dataset.action=String(action);root.dataset.renderer=adapter?'webgl':'svg';
  tabs.forEach(b=>b.setAttribute('aria-pressed',b.dataset.model===model.kind));
  motion.setAttribute('aria-label',paused?t.play:t.pause);motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'▷':'Ⅱ';
  actionButton.textContent=action?t.stop:t.actions[MODEL_IDS.indexOf(model.kind)];actionButton.setAttribute('aria-pressed',String(action));
  root.querySelector('.model-name').textContent=t.names[MODEL_IDS.indexOf(model.kind)];
  root.querySelector('.model-hint').textContent=t.hint;reset.setAttribute('aria-label',t.reset);
 }
 function wake(){dirty=true;if(!raf&&!disposed&&visible&&!document.hidden)raf=requestAnimationFrame(tick)}
 function tick(now){
  raf=0;if(disposed||!visible||document.hidden){last=0;return}
  const dt=last?Math.min((now-last)/1000,.05):1/30;last=now;if(!paused)time+=dt;
  const yaw=manualYaw+(!paused?Math.sin(time*.23)*.10:0);
  if(adapter){try{adapter.render(model,modelPose(model.kind,time,action),yaw,paused?1:dt);dirty=false}catch{adapter.dispose();adapter=null;root.classList.remove('webgl-ready');sync();fallback.innerHTML=renderModelSVG(model,{yaw,time,action});dirty=false}}
  else if(dirty||(!paused&&now-lastSVG>1000/(model.kind==='greenhouse'?8:12))){
   fallback.innerHTML=renderModelSVG(model,{yaw,time,action});lastSVG=now;dirty=false;
  }
  if(!paused)raf=requestAnimationFrame(tick);else last=0;
 }
 function setModel(id){
  if(!MODEL_IDS.includes(id))return;
  model=createWorkshopModel(id);time=0;action=false;sync();wake();
 }
 tabs.forEach(b=>on(b,'click',()=>setModel(b.dataset.model)));
 on(actionButton,'click',()=>{action=!action;sync();wake()});
 on(motion,'click',()=>{paused=!paused;document.body.classList.toggle('paused',paused);onPaused(paused);sync();wake()});
 on(reset,'click',()=>{manualYaw=.68;action=false;sync();wake()});
 // Horizontal drags rotate; vertical touch scrolling remains available.
 on(surface,'pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,yaw:manualYaw,id:e.pointerId};surface.setPointerCapture(e.pointerId)});
 on(surface,'pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(e.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx)+8){drag=null;return}
  manualYaw=drag.yaw+dx*.009;wake();
 });
 for(const type of ['pointerup','pointercancel','lostpointercapture'])on(surface,type,()=>{drag=null});
 on(surface,'keydown',e=>{
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();manualYaw+=e.key==='ArrowLeft'?-.16:.16;wake()}
  if(e.key==='Home'){e.preventDefault();manualYaw=.68;wake()}
 });
 const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;last=0}},{rootMargin:'80px'});io.observe(root);
 on(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0}else wake()});
 on(reduced,'change',e=>{if(e.matches){paused=true;document.body.classList.add('paused');onPaused(true);sync();wake()}});
 on(canvas,'webglcontextlost',e=>{e.preventDefault();adapter?.dispose();adapter=null;root.classList.remove('webgl-ready');sync();wake()});
 sync();wake();
 // The SVG scene is complete and interactive before the optional GPU chunk arrives.
 if(new URLSearchParams(location.search).get('renderer')!=='svg'&&!navigator.connection?.saveData){
  import('./webgl.js').then(({createWebGLWorkshop})=>{
   if(disposed)return;
   const next=createWebGLWorkshop(canvas);
   if(!next)return;
   adapter=next;root.classList.add('webgl-ready');sync();wake();
  }).catch(()=>{if(!disposed){root.dataset.renderer='svg';wake()}});
 }
 return {setModel,setPaused(value){paused=!!value;sync();wake()},dispose(){
  disposed=true;cancelAnimationFrame(raf);ac.abort();io.disconnect();adapter?.dispose();
 }};
}
