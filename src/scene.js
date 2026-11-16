import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
export function createScene(canvas,initialPaused){
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'})}catch{return{dispose(){},setPaused(){}}}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,50);camera.position.set(0,0,9.5);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 const group=new THREE.Group();scene.add(group);const geometry=new THREE.TorusKnotGeometry(1.28,.37,190,28,2,3),material=new THREE.MeshPhysicalMaterial({color:0x007add,metalness:.84,roughness:.2,clearcoat:1,clearcoatRoughness:.1});const knot=new THREE.Mesh(geometry,material);knot.rotation.set(.3,-.2,.25);group.add(knot);
 const ringGeometry=new THREE.TorusGeometry(2.35,.012,8,180),ringMaterial=new THREE.MeshBasicMaterial({color:0x65c3ef,transparent:true,opacity:.65});const ring=new THREE.Mesh(ringGeometry,ringMaterial);ring.rotation.set(1.13,.25,-.4);group.add(ring);
 const orbGeometry=new THREE.SphereGeometry(.19,28,28),orbMaterial=new THREE.MeshPhysicalMaterial({color:0x00b7ff,metalness:.6,roughness:.15,clearcoat:1}),orb=new THREE.Mesh(orbGeometry,orbMaterial);scene.add(orb);const light=new THREE.DirectionalLight(0xd2f5ff,5);light.position.set(-3,5,4);scene.add(light);const fill=new THREE.DirectionalLight(0x0066ff,3);fill.position.set(3,-3,3);scene.add(fill);
 let paused=initialPaused,visible=true,raf,last=0,elapsed=0,px=0,py=0;const parent=canvas.parentElement;
 const resize=new ResizeObserver(()=>{const w=parent.clientWidth,h=parent.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()});resize.observe(parent);
 const intersection=new IntersectionObserver(([e])=>{visible=e.isIntersecting});intersection.observe(canvas);
 const move=e=>{const r=parent.getBoundingClientRect();px=((e.clientX-r.left)/r.width-.5)*.7;py=((e.clientY-r.top)/r.height-.5)*.5};const leave=()=>{px=py=0};parent.addEventListener('pointermove',move);parent.addEventListener('pointerleave',leave);
 function animate(time){raf=requestAnimationFrame(animate);const dt=Math.min((time-last)/1000,.04);last=time;if(!visible||document.hidden)return;if(!paused)elapsed+=dt;group.rotation.y=elapsed*.12+px;group.rotation.x=py;group.position.y=Math.sin(elapsed*.65)*.08;orb.position.set(Math.cos(elapsed*.45)*2.35,Math.sin(elapsed*.45)*.85,Math.sin(elapsed*.45)*1.5);renderer.render(scene,camera)}raf=requestAnimationFrame(animate);canvas.classList.add('ready');parent.classList.add('webgl-ready');
 return{setPaused(value){paused=value},dispose(){cancelAnimationFrame(raf);resize.disconnect();intersection.disconnect();parent.removeEventListener('pointermove',move);parent.removeEventListener('pointerleave',leave);[geometry,material,ringGeometry,ringMaterial,orbGeometry,orbMaterial,env].forEach(x=>x.dispose());renderer.dispose()}};
}
