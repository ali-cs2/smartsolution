
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MATERIALS } from './models.js';

export function createWebGLWorkshop(canvas){
 let renderer;
 try{
  const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});
  if(!context)return null;
  renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:true});
 }catch{return null}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,50);
 const stage=new THREE.Group();scene.add(stage);
 const low=matchMedia('(max-width: 760px)').matches||navigator.hardwareConcurrency<=4;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,low?1.25:1.5));
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
 const environment=pmrem.fromScene(room,.05);scene.environment=environment.texture;pmrem.dispose();room.dispose();
 scene.add(new THREE.HemisphereLight(0xd6efff,0x0a1730,2.5));
 const key=new THREE.DirectionalLight(0xe5f4ff,4);key.position.set(-3,6,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0x008fff,3);rim.position.set(3,2,-3);scene.add(rim);
 const materials={};
 for(const [id,color] of Object.entries(MATERIALS)){
  materials[id]=new THREE.MeshStandardMaterial({color,metalness:id==='metal'?.72:.25,roughness:id==='rubber'?.9:.32,
   emissive:id==='cyan'?new THREE.Color(color):0,emissiveIntensity:id==='cyan'?.35:0,transparent:id==='glass',opacity:id==='glass'?.26:1,depthWrite:id!=='glass'});
 }
 const geometries=new Map(),groups=new Map();let current=null;
 function geometry(part){
  const k=part.shape+part.size.join(',');if(geometries.has(k))return geometries.get(k);
  const [a,b,c]=part.size;let g;
  if(part.shape==='box')g=new THREE.BoxGeometry(a,b,c);
  if(part.shape==='cylinder')g=new THREE.CylinderGeometry(a,a,b,low?16:28);
  if(part.shape==='sphere')g=new THREE.SphereGeometry(a,low?12:20,low?8:14);
  geometries.set(k,g);return g;
 }
 function clear(){
  stage.clear();groups.clear();geometries.forEach(g=>g.dispose());geometries.clear();
 }
 function load(model){
  clear();current=model;
  for(const d of model.groups){const g=new THREE.Group();g.position.fromArray(d.position);g.rotation.set(...d.rotation);(d.parent?groups.get(d.parent):stage).add(g);groups.set(d.id,g)}
  for(const p of model.parts){const m=new THREE.Mesh(geometry(p),materials[p.material]);m.position.fromArray(p.position);m.rotation.set(...p.rotation);(p.parent?groups.get(p.parent):stage).add(m)}
 }
 function size(){
  const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
  renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
 }
 const resize=new ResizeObserver(size);resize.observe(canvas);size();
 return {render(model,pose,yaw,dt){
  if(current!==model)load(model);
  for(const [id,state] of Object.entries(pose)){
   const g=groups.get(id);if(!g)continue;const a=1-Math.exp(-dt*9);
   if(state.rotation){g.rotation.x=THREE.MathUtils.lerp(g.rotation.x,state.rotation[0],a);g.rotation.y=THREE.MathUtils.lerp(g.rotation.y,state.rotation[1],a);g.rotation.z=THREE.MathUtils.lerp(g.rotation.z,state.rotation[2],a)}
   if(state.position){g.position.x=THREE.MathUtils.lerp(g.position.x,state.position[0],a);g.position.y=THREE.MathUtils.lerp(g.position.y,state.position[1],a);g.position.z=THREE.MathUtils.lerp(g.position.z,state.position[2],a)}
  }
  // Framing covers every subject at phone and landscape aspect ratios.
  const distance=model.kind==='robot'?8.0:8.6,factor=Math.max(1,.94/camera.aspect);
  camera.position.set(Math.sin(yaw)*distance*factor,3.9*factor,Math.cos(yaw)*distance*factor);
  camera.lookAt(0,model.kind==='robot'?.92:.50,0);renderer.render(scene,camera);
 },dispose(){resize.disconnect();clear();Object.values(materials).forEach(m=>m.dispose());environment.dispose();renderer.dispose()}};
}
