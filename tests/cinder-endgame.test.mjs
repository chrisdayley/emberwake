import assert from 'node:assert/strict';
import {Game} from '../engine.js';
import {freshSave,ENEMIES,META,WEAPONS} from '../data.js';
import {spawnOverlord} from '../expedition.js';
import {ensureDiscoveries,awakenSite} from '../discoveries.js';
import {lavaAt} from '../world.js';
const close=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const make=()=>{const s=freshSave();s.region='cinder';return new Game(s);};
const checks=[];
for(const m of [0,1,3,5,10,20,30,60]){
 const g=make();g.time=m*60;const h=Math.min(30,m),v14=1+h*.75+h*h*.04,d=g.difficulty();close(g.regionalStrength().health/v14,3.5);close(g.regionalStrength().damage/(1+Math.min(1,m*.09)),1.2);
 const e=g.spawn('crawler');const v14Hp=ENEMIES[e.type].hp*(d.health/3.5)*1.25*(m>=10?1+Math.min(5,(m-10)*.12):1);close(e.maxHp/v14Hp,3.5);
 g.enemies=[];ensureDiscoveries(g);awakenSite(g,g.discoveries[0]);close(g.enemies[0].maxHp/((650+250*m+45*m*m)*(8+Math.min(8,m*.4))*v14),3.5);
 if(m>=10){g.enemies=[];const boss=spawnOverlord(g),n=m-10;close(boss.maxHp/((95000+n*18000+n*n*1400)*1.25*v14),3.5);}
}
checks.push('3.5x v14 health reaches regular enemies, site guardians and Overlords from the opening through 60 minutes; attacks get 20% more damage');
const damaged=make();const e=damaged.spawn('crawler');e.hp*=.4;const saved=damaged.snapshot(),restored=new Game(freshSave(),()=>{},saved);assert.deepEqual(restored.enemies,saved.enemies);checks.push('Saved existing enemies are not re-multiplied or healed');
function pilot(profile,seed){
 const s=freshSave();s.region='cinder';
 if(profile!=='starter')s.meta={might:5,health:5,armor:4,regen:3,magnet:3,haste:3,speed:3};
 if(profile==='equipped'){s.inventory={'flame:5':{level:8}};s.equipment={ranger:'flame:5'};s.spellcraft=Object.fromEntries(WEAPONS.map(w=>[w.id,{power:8,haste:4,opening:2}]));}
 const g=new Game(s);g.rng=seed;let firstDown=0;
 while(g.time<180){
  if(g.mode==='down'){firstDown||=g.time;if(!g.revive())break;}
  if(g.mode==='chest')g.closeChest();
  if(g.mode==='levelup')g.choose(['flame','orbit','bolt','power','chain','haste','vitality'].find(id=>g.choices.includes(id))||g.choices[0]);
  const p=g.player;let dx=Math.cos(g.time*.07),dy=Math.sin(g.time*.07),nearest=null,dist=Infinity;
  for(const t of [...g.gems,...g.pickups.filter(t=>!t.taken)]){const d=Math.hypot(t.x-p.x,t.y-p.y);if(d<dist&&!lavaAt(t.x,t.y)){nearest=t;dist=d;}}
  if(nearest){dx=(nearest.x-p.x)/(dist||1);dy=(nearest.y-p.y)/(dist||1);}
  for(const enemy of g.enemies){const d=Math.hypot(p.x-enemy.x,p.y-enemy.y)||1;if(d<110){dx+=(p.x-enemy.x)/d*(110-d)/30;dy+=(p.y-enemy.y)/d*(110-d)/30;if(d<40)g.dash({x:dx,y:dy});}}
  for(const hazard of g.hazards){const d=Math.hypot(p.x-hazard.x,p.y-hazard.y)||1;if(d<(hazard.r||20)+45){dx+=(p.x-hazard.x)/d*4;dy+=(p.y-hazard.y)/d*4;}}
  let len=Math.hypot(dx,dy)||1;dx/=len;dy/=len;
  // Avoid walking onto lava; this pilot only samples paths on open terrain.
  if(lavaAt(p.x+dx*65,p.y+dy*65)){dx=p.x>0?-1:1;dy=0;}
  g.step(1/30,{x:dx,y:dy});
 }
 return {profile,seed,time:Math.round(g.time),firstDown:Math.round(firstDown),kills:g.kills,level:g.level,openingSkills:profile==='equipped'?'bolt 4 + flame 4':'bolt 1'};
}
const pilots=[];for(const profile of ['starter','traits','equipped'])for(const seed of [42,312,812])pilots.push(pilot(profile,seed));
const sum=(profile,key)=>pilots.filter(p=>p.profile===profile).reduce((n,p)=>n+p[key],0);
assert(sum('equipped','kills')>sum('starter','kills')*4,'Permanent progression must materially improve damage output');assert(pilots.filter(p=>p.profile==='starter').every(p=>p.firstDown>0&&p.time<180),'Starter builds should fail the opening window');assert(pilots.filter(p=>p.profile==='equipped').every(p=>p.time===180&&p.firstDown===0),'Upgraded equipment and spellcraft should handle the opening window without a revive');
checks.push('Nine fixed-seed pilots compare starter, permanent-traits-only, and tempered Mythic plus spellcraft builds');
console.log(JSON.stringify({checks,pilots},null,2));
