const TAU=Math.PI*2;
export const UNIONS=[
 {id:'stormwheel',name:'Tempest cathedral',parts:['chain','orbit'],icon:'✺',color:'#a6e6ff',desc:'A rotating cage of lightning sweeps through enemies. Each spoke also arcs into nearby foes.'},
 {id:'winterstar',name:'Zero-hour constellation',parts:['frost','meteor'],icon:'❆',color:'#b5f9ff',desc:'Freeze a wide field, then shatter marked enemies with a constellation of ice impacts.'},
 {id:'phoenix',name:'Phoenix covenant',parts:['flame','wisp'],icon:'♨',color:'#ffd27d',desc:'Summon homing phoenixes that dive into enemies and detonate into lingering fire.'},
 {id:'prismstorm',name:'Thousandfold aurora',parts:['beam','dagger'],icon:'✧',color:'#d2c6ff',desc:'A rotating six-point prism continuously cuts lanes through the horde.'},
 {id:'maelstrom',name:'Garden of the deep',parts:['venom','tide'],icon:'◉',color:'#a3ecc2',desc:'A roaming whirlpool draws enemies inward and poisons them repeatedly before bursting.'},
 {id:'soulharvest',name:'Choir of the reaper',parts:['blood','scythe'],icon:'☽',color:'#efb9f3',desc:'Returning spectral crescents harvest a wide circle, then return health on their inward pass.'}
];
export const unionFor=(g,id)=>UNIONS.find(u=>g.unions?.includes(u.id)&&u.parts.includes(id));
export function readyUnion(g){return UNIONS.find(u=>!g.unions.includes(u.id)&&u.parts.every(id=>g.rank(id)>=8&&!unionFor(g,id)));}
export function mergeUnion(g,u){if(!u||readyUnion(g)?.id!==u.id)return false;g.unions.push(u.id);g.unionSeen.push(u.id);delete g.skills[u.parts[1]];g.evolved=g.evolved.filter(id=>!u.parts.includes(id));g.cd[u.parts[0]]=0;g.bullets=g.bullets.filter(b=>!u.parts.includes(b.id));g.effects=g.effects.filter(e=>!u.parts.includes(e.id));g.hazards=g.hazards.filter(e=>!u.parts.includes(e.id));g.evolutionCount++;return {id:u.parts[0],rank:8,evolved:true,union:u.id};}
function power(g,u){return 1+(g.craft(u.parts[0],'power')+g.craft(u.parts[1],'power'))*.02;}
function damage(g,u,e,n){g.hit(e,n*power(g,u),u.parts[0]);}
export function stepUnions(g,dt){
 for(const u of UNIONS.filter(u=>g.unions.includes(u.id))){const key=u.parts[0];g.cd[key]=(g.cd[key]||0)-dt;if(g.cd[key]>0)continue;const p=g.player,t=g.nearest();if(!t){g.cd[key]=.15;continue;}const area=(g.spellArea(u.parts[0])+g.spellArea(u.parts[1]))/2;
  const base={union:u.id,id:key,x:p.x,y:p.y,age:0,tick:0,angle:Math.atan2(t.y-p.y,t.x-p.x),r:230*area,life:3};
  if(u.id==='stormwheel'||u.id==='prismstorm'){g.fusionEntities.push({...base,life:4,r:(u.id==='stormwheel'?245:440)*area});g.cd[key]=4;}
  if(u.id==='winterstar'){for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-p.x,e.y-p.y)<380*area){g.chill(e,4,2.2,1+g.craft('frost','duration')*.2);if(!e.boss)e.frozenUntil=g.time+1.2*(1+g.craft('frost','duration')*.2);damage(g,u,e,140);}for(const e of g.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y)).slice(0,8+g.craft('meteor','projectiles')))g.fusionEntities.push({...base,x:e.x,y:e.y,life:.9,r:95*area});g.cd[key]=3.8*g.haste(key);}
  if(u.id==='phoenix'){for(let j=0;j<5+g.craft('wisp','projectiles');j++)g.fusionEntities.push({...base,angle:base.angle+(j-2)*.4,life:3.2+g.craft('wisp','duration')*.4,r:105*area});g.cd[key]=2.7*g.haste(key);}
  if(u.id==='maelstrom'){g.fusionEntities.push({...base,x:t.x,y:t.y,life:5+g.craft('venom','duration')*.8,r:210*area});g.cd[key]=5*g.haste(key);}
  if(u.id==='soulharvest'){g.fusionEntities.push({...base,life:2.4,r:320*area,healed:false});g.cd[key]=2.8*g.haste(key);}
 }
 for(const f of g.fusionEntities){const u=UNIONS.find(u=>u.id===f.union);f.life-=dt;f.age+=dt;f.tick-=dt;const p=g.player;
  if(['stormwheel','prismstorm','soulharvest'].includes(f.union)){f.x=p.x;f.y=p.y;f.angle+=dt*(f.union==='stormwheel'?1.8:1.1);}
  if(f.union==='phoenix'){const t=g.nearest(f.x,f.y);if(t){const a=Math.atan2(t.y-f.y,t.x-f.x),delta=Math.atan2(Math.sin(a-f.angle),Math.cos(a-f.angle));f.angle+=delta*Math.min(1,dt*5);}f.x+=Math.cos(f.angle)*260*dt;f.y+=Math.sin(f.angle)*260*dt;if(t&&Math.hypot(t.x-f.x,t.y-f.y)<t.r+15)f.life=0;}
  if(f.union==='maelstrom'){f.angle+=dt*3;const t=g.nearest(f.x,f.y);if(t){const d=Math.hypot(t.x-f.x,t.y-f.y)||1;f.x+=(t.x-f.x)/d*28*dt;f.y+=(t.y-f.y)/d*28*dt;}for(const e of g.enemies){const d=Math.hypot(e.x-f.x,e.y-f.y)||1;if(e.hp>0&&!e.boss&&d<f.r*1.4){e.x+=(f.x-e.x)/d*(100+g.craft('tide','force')*15)*dt;e.y+=(f.y-e.y)/d*(100+g.craft('tide','force')*15)*dt;}}}
  if(f.tick<=0){f.tick=.22*(g.haste(u.parts[0])+g.haste(u.parts[1]))/2*(f.union==='maelstrom'?1-g.craft('venom','tickrate')*.05:1);let hits=0;for(const e of g.enemies){if(e.hp<=0)continue;const dx=e.x-f.x,dy=e.y-f.y,d=Math.hypot(dx,dy);let touch=false,n=0;
    if(f.union==='stormwheel'||f.union==='prismstorm'){const spokes=f.union==='stormwheel'?4+g.craft('orbit','projectiles'):6+g.craft('beam','projectiles')+g.craft('dagger','projectiles')*2;for(let j=0;j<spokes;j++){const a=f.angle+j*TAU/spokes,along=dx*Math.cos(a)+dy*Math.sin(a),across=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));if(along>=0&&along<f.r+(f.union==='prismstorm'?g.craft('dagger','pierce')*30:0)&&across<e.r+16*(1+(f.union==='prismstorm'?g.craft('beam','width')*.15:0))){touch=true;break;}}n=f.union==='stormwheel'?100:125;}
    if(f.union==='maelstrom'){touch=d<f.r;n=115;}
    if(f.union==='soulharvest'){const r=f.r*Math.sin(Math.min(1,f.age/2.4)*Math.PI);touch=Math.abs(d-r)<e.r+34*(1+g.craft('scythe','width')*.12);n=240*(1+g.craft('scythe','projectiles')*.2);}
    if(touch){damage(g,u,e,n);hits++;if(f.union==='stormwheel'){const others=g.enemies.filter(o=>o.hp>0&&o.id!==e.id&&Math.hypot(o.x-e.x,o.y-e.y)<120*(1+g.craft('chain','radius')*.08)).slice(0,1+g.craft('chain','jumps'));for(const other of others){damage(g,u,other,70);g.effects.push({kind:'chain',points:[{x:e.x,y:e.y},{x:other.x,y:other.y}],color:u.color,life:.18,max:.18});}}}
   }if(f.union==='soulharvest'&&f.age>1.2&&!f.healed&&hits){p.hp=Math.min(g.maxHp(),p.hp+8*(1+g.craft('blood','healing')*.2));f.healed=true;}
  }
  if(f.life<=0&&['phoenix','winterstar','maelstrom'].includes(f.union)){for(const e of g.enemies)if(e.hp>0&&Math.hypot(e.x-f.x,e.y-f.y)<f.r+e.r)damage(g,u,e,f.union==='winterstar'?750:500);g.burst(f.x,f.y,f.r,u.color,.6);if(f.union==='phoenix')g.effects.push({kind:'fire',x:f.x,y:f.y,r:f.r,life:2.2+g.craft('flame','duration')*.6,max:2.2+g.craft('flame','duration')*.6,tick:0,damage:75,id:f.id,color:u.color});}
 }
 g.fusionEntities=g.fusionEntities.filter(f=>f.life>0).slice(-64);
}
export function drawUnions(c,g,fx){c.save();c.globalAlpha=fx;for(const f of g.fusionEntities||[]){const u=UNIONS.find(u=>u.id===f.union);c.save();c.translate(f.x,f.y);c.strokeStyle=u.color;c.fillStyle=u.color;c.lineWidth=3;
 if(['stormwheel','prismstorm'].includes(f.union)){const n=f.union==='stormwheel'?4+g.craft('orbit','projectiles'):6+g.craft('beam','projectiles')+g.craft('dagger','projectiles')*2;c.rotate(f.angle);for(let j=0;j<n;j++){c.rotate(TAU/n);c.globalAlpha=fx*.16;c.lineWidth=24;c.beginPath();c.moveTo(0,0);c.lineTo(f.r,0);c.stroke();c.globalAlpha=fx;c.lineWidth=3;c.stroke();c.beginPath();c.moveTo(f.r-15,-9);c.lineTo(f.r+9,0);c.lineTo(f.r-15,9);c.stroke();}c.beginPath();c.arc(0,0,38,0,TAU);c.stroke();}
 if(f.union==='winterstar'){c.globalAlpha=fx*.6;c.beginPath();c.arc(0,0,f.r,0,TAU);c.stroke();c.translate(0,-f.life*160);for(let j=0;j<6;j++){c.rotate(TAU/6);c.beginPath();c.moveTo(0,0);c.lineTo(0,-28);c.lineTo(-8,-19);c.moveTo(0,-28);c.lineTo(8,-19);c.stroke();}}
 if(f.union==='phoenix'){c.rotate(f.angle);c.beginPath();c.moveTo(20,0);c.lineTo(-10,-22-Math.sin(f.age*16)*8);c.lineTo(-3,-4);c.lineTo(-25,0);c.lineTo(-3,4);c.lineTo(-10,22+Math.sin(f.age*16)*8);c.closePath();c.fill();}
 if(f.union==='maelstrom'){for(let j=0;j<5;j++){c.globalAlpha=fx*(.2+j*.12);c.beginPath();c.arc(0,0,f.r*(j+1)/5,f.angle+j,f.angle+j+Math.PI*1.6);c.stroke();}}
 if(f.union==='soulharvest'){const r=f.r*Math.sin(Math.min(1,f.age/2.4)*Math.PI);for(let j=0;j<8;j++){const a=f.angle+j*TAU/8;c.save();c.translate(Math.cos(a)*r,Math.sin(a)*r);c.rotate(a);c.lineWidth=7;c.beginPath();c.arc(0,0,25,-1.5,1.5);c.stroke();c.restore();}}
 c.restore();}c.restore();}
export function validUnionRun(r){const ids=UNIONS.map(u=>u.id),known=x=>typeof x==='string'&&ids.includes(x);if(r.unions!==undefined&&(!Array.isArray(r.unions)||r.unions.length>6||new Set(r.unions).size!==r.unions.length||!r.unions.every(known)))return false;if(r.unionSeen!==undefined&&(!Array.isArray(r.unionSeen)||r.unionSeen.length>6||!r.unionSeen.every(known)))return false;for(const id of r.unions||[]){const u=UNIONS.find(u=>u.id===id);if(r.skills[u.parts[0]]!==8||r.skills[u.parts[1]])return false;}if(r.fusionEntities!==undefined&&(!Array.isArray(r.fusionEntities)||r.fusionEntities.length>64||r.fusionEntities.some(f=>!f||!known(f.union)||!r.unions?.includes(f.union)||!['x','y','age','tick','angle','r','life'].every(k=>Number.isFinite(f[k]))||f.r<=0||f.life>10)))return false;if(r.chestReward?.rewards?.some(v=>v.union&&(!known(v.union)||UNIONS.find(u=>u.id===v.union).parts[0]!==v.id)))return false;return true;}
