
// Shared geometry for WebGL and the SVG renderer. Units are illustrative, not engineering specifications.
export const MODEL_IDS = ['robot', 'gate', 'greenhouse'];
export const MATERIALS = {
 navy: '#102b4c', blue: '#087fdf', cyan: '#39ccff', metal: '#a6bdd1',
 white: '#e9f2fa', dark: '#071322', rubber: '#15212d', glass: '#397ba4', screen: '#397ba4',
 leaf: '#4b9b75', soil: '#4f4138', road: '#29394c'
};
export function createWorkshopModel(kind = 'robot') {
 if (!MODEL_IDS.includes(kind)) kind = 'robot';
 const parts=[], groups=[];
 const group=(id,parent,position=[0,0,0],rotation=[0,0,0])=>groups.push({id,parent,position,rotation});
 const add=(shape,size,position,material='navy',parent=null,rotation=[0,0,0])=>{
   parts.push({id:'part-'+parts.length,shape,size,position,material,parent,rotation});
 };
 const box=(s,p,m,g,r)=>add('box',s,p,m,g,r);
 const cylinder=(r,h,p,m,g,rotation)=>add('cylinder',[r,h,r],p,m,g,rotation);
 const sphere=(r,p,m,g)=>add('sphere',[r,r,r],p,m,g);
 const bolt=(p,g)=>cylinder(.026,.025,p,'metal',g);
 if(kind==='robot'){
  cylinder(2.06,.18,[0,-.23,0],'navy');
  cylinder(1.97,.035,[0,-.118,0],'metal');
  for(let i=0;i<4;i++){const a=i*Math.PI/2+.6;cylinder(.16,.12,[Math.cos(a)*1.5,-.38,Math.sin(a)*1.5],'rubber')}
  box([1.05,.16,1.05],[0,-.02,0],'white');
  for(const x of [-.42,.42])for(const z of [-.42,.42])bolt([x,.075,z]);
  cylinder(.43,.36,[0,.23,0],'blue');
  cylinder(.45,.045,[0,.43,0],'cyan');
  group('turret',null,[0,.49,0]);
  cylinder(.35,.22,[0,.08,0],'metal','turret');
  for(let i=0;i<8;i++){const a=i*Math.PI/4;bolt([Math.cos(a)*.28,.20,Math.sin(a)*.28],'turret')}
  group('upper','turret',[0,.23,0],[0,0,-.48]);
  cylinder(.27,.54,[0,0,0],'navy','upper',[Math.PI/2,0,0]);
  cylinder(.18,.57,[0,0,0],'blue','upper',[Math.PI/2,0,0]);
  box([.35,1.14,.34],[0,.61,0],'white','upper');
  box([.20,.79,.035],[0,.66,.19],'blue','upper');
  for(const x of [-.21,.21])box([.055,.94,.36],[x,.60,0],'metal','upper');
  for(let i=0;i<6;i++)box([.20,.025,.028],[0,.36+i*.10,.215],'navy','upper');
  for(const x of [-.12,.12])for(const y of [.18,1.04])sphere(.028,[x,y,.19],'metal','upper');
  group('forearm','upper',[0,1.21,0],[0,0,-1.15]);
  cylinder(.245,.51,[0,0,0],'navy','forearm',[Math.PI/2,0,0]);
  cylinder(.155,.54,[0,0,0],'cyan','forearm',[Math.PI/2,0,0]);
  box([.29,.94,.29],[0,.50,0],'blue','forearm');
  box([.31,.65,.055],[0,.50,.17],'white','forearm');
  for(let i=0;i<5;i++)box([.16,.022,.025],[0,.30+i*.085,.21],'navy','forearm');
  for(const x of [-.18,.18])box([.045,.8,.30],[x,.5,0],'metal','forearm');
  group('wrist','forearm',[0,1.02,0],[0,0,.65]);
  cylinder(.16,.24,[0,.10,0],'metal','wrist');
  cylinder(.18,.06,[0,.25,0],'cyan','wrist');
  box([.51,.12,.28],[0,.34,0],'navy','wrist');
  group('fingerL','wrist',[-.19,.38,0]);
  group('fingerR','wrist',[.19,.38,0]);
  for(const g of ['fingerL','fingerR']){
   box([.08,.30,.12],[0,.14,0],'metal',g);
   box([.11,.10,.15],[g==='fingerL'?.03:-.03,.31,0],'rubber',g);
  }
  box([.49,.12,.49],[1.13,-.04,.83],'navy');
  for(let i=0;i<3;i++){box([.31,.05,.31],[1.13,.055+i*.065,.83],'blue');box([.17,.014,.17],[1.13,.087+i*.065,.83],'cyan')}
  box([.48,.12,.4],[-1.1,-.04,.70],'navy');
  box([.10,.65,.12],[-1.1,.32,.70],'metal');
  box([.54,.35,.08],[-1.1,.72,.70],'navy');
  box([.44,.25,.014],[-1.1,.72,.75],'screen');
  for(let i=0;i<4;i++)box([.06,.03+i*.035,.015],[-1.25+i*.10,.66,.765],'cyan');
  for(let i=0;i<14;i++){const a=i*.15;box([.055,.028,.10],[Math.cos(a)*1.78,-.088,Math.sin(a)*1.78],'blue')}
 }
 if(kind==='gate'){
  box([4.4,.18,2.9],[0,-.25,0],'metal');
  box([4.25,.025,1.15],[0,-.145,.4],'road');
  for(let i=0;i<7;i++)box([.28,.012,.035],[-1.8+i*.60,-.125,.4],'white');
  box([.95,.80,.86],[-1.3,.25,-.83],'navy');
  box([1.08,.10,.98],[-1.3,.70,-.83],'white');
  box([.69,.36,.025],[-1.3,.40,-.38],'glass');
  box([.025,.36,.55],[-.81,.40,-.83],'glass');
  for(let i=0;i<3;i++)box([.025,.36,.04],[-1.5+i*.2,.4,-.355],'metal');
  box([.25,1.0,.30],[0,.35,-.50],'white');
  box([.17,.30,.03],[0,.64,-.33],'navy');
  sphere(.055,[0,.64,-.30],'cyan');
  group('barrier',null,[.05,.84,-.42]);
  box([.08,.09,1.68],[0,0,.84],'white','barrier');
  for(let i=0;i<7;i++)box([.086,.096,.085],[0,0,.12+i*.23],'blue','barrier');
  cylinder(.14,.16,[0,0,0],'metal','barrier',[0,0,Math.PI/2]);
  box([.10,.83,.10],[.04,.26,1.29],'navy');
  box([.10,.72,.1],[.70,.2,-.45],'metal');
  box([.28,.23,.13],[.70,.65,-.45],'navy');
  sphere(.05,[.70,.65,-.365],'cyan');
  group('car',null,[1.25,.02,.42]);
  box([1.03,.24,.53],[0,.12,0],'blue','car');
  box([.57,.22,.47],[-.04,.35,0],'glass','car');
  box([.60,.025,.49],[-.04,.475,0],'navy','car');
  for(const x of [-.34,.34])for(const z of [-.28,.28]){
   cylinder(.13,.11,[x,.02,z],'rubber','car',[Math.PI/2,0,0]);
   cylinder(.063,.12,[x,.02,z],'metal','car',[Math.PI/2,0,0]);
  }
  for(const z of [-.16,.16])box([.025,.055,.09],[-.525,.16,z],'white','car');
  for(let i=0;i<4;i++){box([.11,.33,.11],[-.4-i*.4,.01,1.15],'white');box([.12,.06,.12],[-.4-i*.4,.19,1.15],'blue')}
 }
 if(kind==='greenhouse'){
  box([4.1,.18,2.9],[0,-.25,0],'metal');
  box([2.5,.08,1.9],[-.15,-.10,0],'white');
  for(const x of [-1.3,1])for(const z of [-.85,.85])box([.055,1.15,.055],[x,.50,z],'metal');
  for(const z of [-.85,.85]){
   box([2.35,.05,.05],[-.15,1.08,z],'metal');
   box([2.35,.05,.05],[-.15,.06,z],'metal');
   box([2.22,.79,.018],[-.15,.58,z],'glass');
  }
  box([.055,.05,1.7],[-1.3,1.08,0],'metal');
  box([.055,.05,1.7],[1,1.08,0],'metal');
  for(const x of [-1.3,-.15,1])for(const sign of [-1,1]){
   box([.055,.055,1.02],[x,1.34,sign*.43],'white',null,[sign*.48,0,0]);
  }
  box([2.4,.05,.05],[-.15,1.59,0],'white');
  for(const z of [-.44,.44]){
   box([1.94,.20,.45],[-.15,.02,z],'navy');
   box([1.80,.025,.35],[-.15,.13,z],'soil');
   for(let i=0;i<6;i++){
    const x=-.9+i*.30;
    box([.025,.20,.025],[x,.23,z],'leaf');
    sphere(.12,[x-.065,.28,z],'leaf');sphere(.105,[x+.055,.35,z],'leaf');
   }
   box([2.02,.035,.035],[-.15,.17,z+.28],'blue');
  }
  box([.12,.95,.12],[1.55,.27,.55],'white');
  box([.31,.20,.25],[1.55,.84,.55],'navy');
  sphere(.065,[1.55,.84,.70],'cyan');
  box([.65,.05,.65],[1.50,.42,-.60],'navy',null,[-.35,0,0]);
  for(let x=0;x<3;x++)for(let z=0;z<3;z++)box([.17,.025,.17],[1.29+x*.20,.46+z*.06,-.80+z*.19],'blue',null,[-.35,0,0]);
  box([.08,.50,.08],[1.50,.04,-.60],'metal');
  cylinder(.19,.40,[-1.65,.06,.75],'white');
  cylinder(.20,.035,[-1.65,.28,.75],'blue');
  group('water',null,[0,0,0]);
  for(let i=0;i<6;i++)sphere(.035,[-.90+i*.30,.55,(i%2?-.44:.44)],'cyan','water');
 }
 return {kind,parts,groups};
}
export function modelPose(kind, time=0, action=false) {
 if(kind==='robot')return {
  turret:{rotation:[0,Math.sin(time*.34)*.22,0]},
  upper:{rotation:[0,0,-.48+(action?Math.sin(time*.85)*.16:0)]},
  forearm:{rotation:[0,0,-1.15+(action?Math.sin(time*.85+.7)*.22:0)]},
  wrist:{rotation:[0,0,.65]},
  fingerL:{position:[action?-.12:-.19,.38,0]},
  fingerR:{position:[action?.12:.19,.38,0]}
 };
 if(kind==='gate')return {barrier:{rotation:[action?-1.35:0,0,0]},car:{position:[action?-1.05:1.25,.02,.42]}};
 return {water:{position:[0,action?-.14*(1+Math.sin(time*2)):0,0]}};
}
export function rotatePoint([x,y,z],[rx=0,ry=0,rz=0]=[]) {
 let a=y*Math.cos(rx)-z*Math.sin(rx),b=y*Math.sin(rx)+z*Math.cos(rx);y=a;z=b;
 a=x*Math.cos(ry)+z*Math.sin(ry);b=-x*Math.sin(ry)+z*Math.cos(ry);x=a;z=b;
 return [x*Math.cos(rz)-y*Math.sin(rz),x*Math.sin(rz)+y*Math.cos(rz),z];
}
export function worldPoint(point,part,model,pose={}) {
 let p=rotatePoint(point,part.rotation).map((v,i)=>v+part.position[i]),parent=part.parent;
 while(parent){const g=model.groups.find(g=>g.id===parent),state=pose[parent]||{};
  p=rotatePoint(p,state.rotation||g.rotation).map((v,i)=>v+(state.position||g.position)[i]);parent=g.parent;
 } return p;
}
const FACE_CACHE = new WeakMap();
function facesOf(part) {
 const [a,b,c]=part.size;
 if(part.shape==='box'){
  const v=[[-a/2,-b/2,-c/2],[a/2,-b/2,-c/2],[a/2,b/2,-c/2],[-a/2,b/2,-c/2],[-a/2,-b/2,c/2],[a/2,-b/2,c/2],[a/2,b/2,c/2],[-a/2,b/2,c/2]];
  return [[0,1,2,3],[4,7,6,5],[3,2,6,7],[0,4,5,1],[1,5,6,2],[0,3,7,4]].map(f=>f.map(i=>v[i]));
 }
 const n=part.shape==='sphere'?10:16;
 if(part.shape==='sphere'){
  const faces=[];
  for(let j=0;j<6;j++)for(let i=0;i<n;i++){const vertex=(u,v)=>{const p=u*Math.PI*2/n,t=-Math.PI/2+v*Math.PI/6;return [a*Math.cos(t)*Math.cos(p),a*Math.sin(t),a*Math.cos(t)*Math.sin(p)]};faces.push([vertex(i,j),vertex(i+1,j),vertex(i+1,j+1),vertex(i,j+1)])}
  return faces;
 }
 const top=[],bottom=[],sides=[];
 for(let i=0;i<n;i++){const t=i*Math.PI*2/n;top.push([a*Math.cos(t),b/2,a*Math.sin(t)]);bottom.push([a*Math.cos(t),-b/2,a*Math.sin(t)])}
 for(let i=0;i<n;i++)sides.push([top[i],top[(i+1)%n],bottom[(i+1)%n],bottom[i]]);
 return [top,bottom,...sides];
}
const mix=(hex,gain)=>'#'+hex.slice(1).match(/../g).map(x=>Math.min(255,Math.round(parseInt(x,16)*gain)).toString(16).padStart(2,'0')).join('');
export function renderModelSVG(model,{yaw=.68,time=0,action=false,thumbnail=false}={}) {
 const pose=modelPose(model.kind,time,action),elevation=.43,scale=thumbnail?66:83,cy=thumbnail?221:296,cx=300;
 const camera=p=>{const v=rotatePoint(p,[0,-yaw,0]);return [v[0],v[1]*Math.cos(elevation)-v[2]*Math.sin(elevation),v[1]*Math.sin(elevation)+v[2]*Math.cos(elevation)]};
 const faces=[];
 for(const part of model.parts){
 if(!FACE_CACHE.has(part))FACE_CACHE.set(part,facesOf(part));
 const center=camera(worldPoint([0,0,0],part,model,pose));
 for(const face of FACE_CACHE.get(part)){
  const ps=face.map(p=>camera(worldPoint(p,part,model,pose)));
  const u=ps[1].map((v,i)=>v-ps[0][i]),v=ps[2].map((x,i)=>x-ps[0][i]);
  const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const mid=ps.reduce((s,p)=>s.map((x,i)=>x+p[i]/ps.length),[0,0,0]);
  const orientation=n.reduce((s,x,i)=>s+x*(mid[i]-center[i]),0)<0?-1:1;
  if(n[2]*orientation<=0)continue;
  const gain=.61+Math.abs(n[2])/(Math.hypot(...n)||1)*.45;
  faces.push({z:ps.reduce((s,p)=>s+p[2],0)/ps.length,path:ps.map(p=>(cx+p[0]*scale).toFixed(2)+','+(cy-p[1]*scale).toFixed(2)).join(' '),opacity:part.material==='glass'?.26:1,fill:mix(MATERIALS[part.material],gain)});
 }
 }
 faces.sort((a,b)=>a.z-b.z);
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 '+(thumbnail?'310':'450')+'" fill="none" aria-hidden="true" direction="ltr" class="model-svg"><ellipse cx="300" cy="'+(thumbnail?241:326)+'" rx="178" ry="31" fill="#000a1a" opacity=".24"/>'+faces.map(f=>'<polygon points="'+f.path+'" fill="'+f.fill+'" stroke="'+f.fill+'" stroke-width=".35" stroke-linejoin="round" opacity="'+f.opacity+'"/>').join('')+'</svg>';
}

export function createServiceModel(index){
 if(index===1)return createWorkshopModel('gate');
 if(index===2||index===5)return createWorkshopModel('robot');
 if(index===3)return createWorkshopModel('greenhouse');
 const parts=[],add=(size,position,material='navy',rotation=[0,0,0])=>parts.push({id:'console-'+parts.length,shape:'box',size,position,material,rotation,parent:null});
 add([3.8,.14,2.3],[0,-.15,0],'metal');
 add([1.45,.06,.70],[0,-.035,-.25],'navy');
 add([.16,.55,.18],[0,.25,-.44],'metal');
 add([1.65,1.08,.13],[0,1.00,-.42],'navy');
 add([1.48,.91,.018],[0,1.00,-.342],'screen');
 add([1.43,.12,.023],[0,1.35,-.324],'blue');
 for(let i=0;i<3;i++)add([.37,.22,.025],[-.49+i*.49,1.10,-.322],'white');
 for(let i=0;i<5;i++)add([.08,.13+i*.03,.025],[-.52+i*.25,.74,-.322],'cyan');
 add([1.60,.08,.54],[0,-.01,.65],'navy');
 for(let row=0;row<3;row++)for(let col=0;col<10;col++)add([.11,.035,.09],[-.66+col*.146,.05,.49+row*.15],'metal');
 add([.64,1.24,.85],[-1.24,.50,-.22],'navy');
 for(let i=0;i<5;i++){
  add([.54,.16,.025],[-1.24,.09+i*.23,.22],'white');
  add([.055,.04,.03],[-1.45,.1+i*.23,.243],'cyan');
  for(let j=0;j<4;j++)add([.045,.065,.028],[-1.27+j*.07,.1+i*.23,.244],'navy');
 }
 add([.43,.80,.11],[1.20,.40,.25],'navy');
 add([.36,.64,.025],[1.20,.42,.32],'screen');
 add([.28,.14,.025],[1.20,.53,.34],'blue');
 add([.28,.03,.025],[1.20,.32,.34],'white');
 return {kind:'console',groups:[],parts};
}
