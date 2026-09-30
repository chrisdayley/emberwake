import assert from 'node:assert/strict';
import {Game} from '../engine.js';
import {freshSave,WEAPONS,PASSIVES} from '../data.js';
import {safePoint,isSafePoint} from '../world.js';
import {spawnOverlord,attackOverlord} from '../expedition.js';
const checks=[];
const g=new Game(freshSave());g.time=600;g.skills=Object.fromEntries([...WEAPONS.slice(0,6).map(w=>[w.id,8]),...PASSIVES.slice(0,6).map(w=>[w.id,3])]);g.skills.bolt=7;
for(let n=0;n<100;n++){const options=g.offers();assert.equal(options.length,3);assert.equal(new Set(options).size,3);assert(options.includes('bolt'));assert.equal(options.filter(id=>id.startsWith('ascend_')).length,2);}checks.push('One remaining standard upgrade still gives three unique late-game choices');
g.gearBonuses.haste=.8;for(let n=0;n<100;n++)assert(!g.ascensionOffers().includes('ascend_haste'));g.gearBonuses.haste=0;const offered=new Set(Array.from({length:100},()=>g.ascensionOffers()).flat());assert(offered.has('ascend_haste'));checks.push('Accelerant disappears when every owned spell has reached the cooldown floor');
for(const region of ['hollow','cinder']){
 for(let x=-1100;x<1100;x+=29)for(let y=-800;y<800;y+=37){const p=safePoint(region,x,y);assert(isSafePoint(region,p.x,p.y),`${region} unsafe ${x},${y} -> ${p.x},${p.y}`);}
 const s=freshSave();s.region=region;const q=new Game(s);q.time=100;q.nextCache=q.nextHeal=0;q.random=()=>0;q.player.x=region==='hollow'?-65:80;q.player.y=175;q.skills={};q.invuln=100;q.nextElite=q.nextBoss=1e9;q.step(.01);assert(q.pickups.length>=2);assert(q.pickups.every(p=>isSafePoint(region,p.x,p.y)));
 const e=q.spawn('brute',false,true);e.x=region==='hollow'?175:320;e.y=175;q.hit(e,1e9,'bolt');const chest=q.pickups.find(p=>p.kind==='chest');assert(chest&&isSafePoint(region,chest.x,chest.y));q.pickups.push({x:e.x,y:e.y,kind:'heal'});const saved=new Game(s,()=>{},q.snapshot());assert(saved.pickups.every(p=>isSafePoint(region,p.x,p.y)));
}checks.push('Thousands of terrain positions, new supplies, boss loot, and restored pickups resolve to safe reachable ground');
const patterns={};for(const region of ['ashwood','hollow','cinder']){const s=freshSave();s.region=region;const q=new Game(s);q.time=600;q.rng=42;q.lastDir={x:1,y:0};const e=spawnOverlord(q);e.x=-200;e.y=0;attackOverlord(q,e);patterns[region]=q.hazards.map(h=>({x:Math.round(h.x),y:Math.round(h.y),warning:h.max,r:h.r}));assert(e.attackLabel);assert(q.hazards.every(h=>h.max>=1.6&&h.kind==='eruption'));const snapshot=q.snapshot();const restored=new Game(s,()=>{},snapshot);assert.equal(restored.enemies[0].attackLabel,e.attackLabel);assert.deepEqual(restored.hazards,q.hazards);
 if(region==='ashwood'){assert(q.hazards.every(h=>h.y===0));assert(new Set(q.hazards.map(h=>h.max)).size>1);}
 if(region==='hollow'){const ring=q.hazards.filter(h=>Math.hypot(h.x,h.y)>100);assert(ring.length>=5);assert(ring.every(h=>Math.abs(Math.atan2(h.y,h.x))>.8),'East-facing escape gap should remain open');}
 if(region==='cinder')assert(new Set(q.hazards.map(h=>h.max)).size===3);
 const attacks=q.hazards.length;e.hp=e.maxHp*.4;q.hazards=[];attackOverlord(q,e);assert(q.hazards.length>attacks);assert(e.fury);
}assert.notDeepEqual(patterns.ashwood,patterns.cinder);assert.notDeepEqual(patterns.hollow,patterns.ashwood);checks.push('Three distinct, telegraphed Overlord attacks retain their warning state through save/resume and intensify when enraged');
console.log(JSON.stringify({checks,patterns},null,2));
