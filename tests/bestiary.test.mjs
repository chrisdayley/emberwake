import assert from 'node:assert/strict';
import {Game} from '../engine.js';
import {freshSave,ENEMIES} from '../data.js';
import {ROSTERS,GUARDIANS,REGIONAL_ENEMIES} from '../bestiary.js';
import {guardianAttack,stepRegional,regionalDeath} from '../region-combat.js';
import {spawnOverlord} from '../expedition.js';
const checks=[];
const game=(region)=>{const s=freshSave();s.region=region;const g=new Game(s);g.rng=42;return g;};
for(const region of ['hollow','cinder']){
 const g=game(region),seen=new Set();
 for(let minute=0;minute<=30;minute++){g.time=minute*60;for(let i=0;i<150;i++){const id=g.enemyType();seen.add(id);assert.equal(ENEMIES[id].region,region);assert(ENEMIES[id].minute<=minute);}}
 assert.equal(seen.size,8);assert.equal(new Set([...ROSTERS[region],...GUARDIANS[region]].map(id=>ENEMIES[id].art)).size,12);
 for(const t of [180,360,540]){const q=game(region);q.time=t-.01;q.invuln=1e6;q.skills={};q.nextBoss=t;q.step(.02);assert.equal(q.enemies.find(e=>e.boss).type,GUARDIANS[region][t/180-1]);}
 g.time=600;assert.equal(spawnOverlord(g).type,GUARDIANS[region][3]);
 for(const minute of [1,2,3,4,6,8,10,12,14,18]){const q=game(region);q.time=minute*60-.01;q.waveMinute=minute-1;q.skills={};q.invuln=1e6;q.step(.02);assert(q.enemies.every(e=>ENEMIES[e.type].region===region));}
}
checks.push('Two disjoint eight-creature rosters, 24 unique art cells, every wave/elite/guardian/Overlord belongs to its region');
for(const region of ['ashwood','hollow','cinder']){
 const g=game(region),ids=Object.keys(ENEMIES).filter(id=>(ENEMIES[id].region||'ashwood')===region&&ENEMIES[id].ranged);
 for(let i=0;i<60;i++)g.spawn(ids[i%ids.length]);assert.equal(g.rangedCount(),5);assert.equal(g.enemies.length,60);
 g.enemies.find(e=>ENEMIES[e.type].ranged).hp=0;g.spawn(ids[0]);assert.equal(g.rangedCount(),5);
}
checks.push('Five-enemy ranged cap is shared across all regional ranged species, with melee overflow and immediate freed slots');
const signatures=[];
for(const region of ['hollow','cinder'])for(const id of GUARDIANS[region].slice(0,3)){
 const g=game(region);g.time=180;const e=g.spawn(id,false,true);e.x=-200;e.y=0;g.hazards=[];guardianAttack(g,e);
 assert(e.attackLabel);assert(g.hazards.length>=3);assert(g.hazards.every(h=>h.max>=1.6));
 signatures.push(JSON.stringify(g.hazards.map(h=>[h.x,h.y,h.r,h.max])));
 const restored=new Game(freshSave(),()=>{},g.snapshot());assert.deepEqual(restored.hazards,g.hazards);assert.equal(restored.enemies[0].attackLabel,e.attackLabel);
 // A continuous walking direction exists that escapes every detonation from rest.
 const safeDirections=Array.from({length:32},(_,i)=>i*Math.PI/16).filter(a=>g.hazards.every(h=>Math.hypot(Math.cos(a)*145*h.max-h.x,Math.sin(a)*145*h.max-h.y)>h.r+10));assert(safeDirections.length>0,`${id} must be dodgeable`);
 g.hit(e,1e9,'bolt');assert(g.pickups.some(p=>p.kind==='chest'&&p.boss));
}
assert.equal(new Set(signatures).size,6);checks.push('All six early guardians have distinct telegraphed, dodgeable attacks, saved warning state, and treasure drops');
for(const [region,id]of [['hollow','veilmask'],['cinder','magmaworm']]){const g=game(region),e=g.spawn(id);e.x=-250;e.y=0;e.attack=0;stepRegional(g,e,.05,250,0,250,e.speed);assert(e.blinkTarget);assert.equal(e.x,-250);assert(e.blinkLeft>1);for(let i=0;i<26;i++)stepRegional(g,e,.05,250,0,250,e.speed);assert(!e.blinkTarget);assert.notEqual(e.x,-250);assert(Math.hypot(e.x,e.y)>70);}
for(const [region,id]of [['hollow','glassspider'],['cinder','lavaram'],['cinder','pyrewheel']]){const g=game(region),e=g.spawn(id);e.x=-200;e.y=0;e.attack=.5;assert.equal(stepRegional(g,e,.05,200,0,200,e.speed),0);assert.equal(e.phase,1);e.attack=-.1;stepRegional(g,e,.05,0,200,200,e.speed);assert(e.x>-200);assert.equal(e.y,0,'Aim locks before dash');}
const slugs=game('cinder');for(let i=0;i<50;i++)regionalDeath(slugs,{type:'slagslug',x:0,y:0});assert.equal(slugs.hazards.length,8);assert(slugs.hazards.every(h=>h.max>=1.5));checks.push('Blink/burrow windups, locked dash directions, and bounded delayed death explosions execute correctly');
for(const region of ['hollow','cinder']){
 const old=game('ashwood');old.region=region;old.time=625;old.gold=321;old.skills={bolt:6,power:2};old.player.hp=74;
 const types=['crawler','bat','brute','shooter','bulwark'];old.enemies=types.map((type,i)=>({id:i+1,type,hp:ENEMIES[type].hp*.5,maxHp:ENEMIES[type].hp,speed:ENEMIES[type].speed,r:15,x:100+i*30,y:0,boss:false,elite:false,attack:2,phase:0}));
 const restored=new Game(freshSave(),()=>{},old.snapshot());assert.equal(restored.gold,321);assert.equal(restored.player.hp,74);assert.deepEqual(restored.skills,old.skills);assert(restored.enemies.every(e=>ENEMIES[e.type].region===region&&e.hp/e.maxHp===.5));
 const again=new Game(freshSave(),()=>{},restored.snapshot());assert.deepEqual(again.enemies,restored.enemies);
}
checks.push('Legacy regional runs migrate once, preserve health fractions, gold, character health and upgrades');
const stress=[];
for(const region of ['hollow','cinder'])for(const minute of [3,9,15,30]){const g=game(region);g.time=minute*60;g.waveMinute=minute;g.invuln=1e6;g.skills={};g.player.hp=1e6;g.nextElite=g.nextCache=g.nextHeal=1e9;g.nextBoss=1e9;g.nextWorldStrike=1e9;g.nextObjective=1e9;g.lateStarted=true;
 for(let i=0;i<1200;i++){g.step(.05,{x:Math.cos(i*.004),y:Math.sin(i*.004)});assert(g.rangedCount()<=5);assert(g.enemies.filter(e=>!e.boss).length<=g.difficulty().cap);assert(g.enemies.every(e=>Number.isFinite(e.x)&&Number.isFinite(e.y)));assert(g.hazards.filter(h=>h.regional&&!h.bossAttack).length<=8);}
 stress.push({region,minute,enemies:g.enemies.length,ranged:g.rangedCount(),hazards:g.hazards.length});
}
checks.push('Eight minute-long stress simulations retain population, ranged and regional hazard bounds with finite movement');
console.log(JSON.stringify({checks,stress},null,2));
