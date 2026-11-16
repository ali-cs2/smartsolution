
import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorkshopModel,createServiceModel,renderModelSVG,modelPose,MODEL_IDS,MATERIALS} from '../src/models.js';
for(const id of MODEL_IDS){
 test(id+' has valid geometry and acyclic mounted groups',()=>{
  const m=createWorkshopModel(id),seen=new Set();assert.ok(m.parts.length>=40);
  for(const g of m.groups){if(g.parent)assert.ok(seen.has(g.parent));seen.add(g.id)}
  for(const p of m.parts){assert.ok(p.size.every(n=>Number.isFinite(n)&&n>0));assert.ok(p.position.every(Number.isFinite));assert.ok(p.rotation.every(Number.isFinite));assert.ok(MATERIALS[p.material]);if(p.parent)assert.ok(seen.has(p.parent))}
 });
 test(id+' renders finite geometry through interaction and rotation',()=>{
  const m=createWorkshopModel(id);
  for(const yaw of [-1.4,.68,2.2])for(const action of [false,true]){
   const svg=renderModelSVG(m,{yaw,time:2,action});assert.ok(svg.startsWith('<svg'));assert.ok(svg.includes('<polygon'));assert.ok(!/NaN|Infinity|undefined/.test(svg));
  }
  assert.notEqual(renderModelSVG(m,{action:false,time:2}),renderModelSVG(m,{action:true,time:2}));
 });
}
test('every service has a physical illustration',()=>{
 for(let i=0;i<7;i++){const m=createServiceModel(i);assert.ok(m.parts.length>=40);assert.ok(!/NaN|Infinity|undefined/.test(renderModelSVG(m,{thumbnail:true})))}
});
test('gate action raises the barrier and moves the vehicle',()=>{
 const closed=modelPose('gate',0,false),open=modelPose('gate',0,true);
 assert.equal(closed.barrier.rotation[0],0);assert.ok(open.barrier.rotation[0]<-1);assert.ok(open.car.position[0]<closed.car.position[0]);
});
