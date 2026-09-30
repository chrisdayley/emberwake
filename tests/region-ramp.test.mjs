import assert from 'node:assert/strict';
import {Game} from '../engine.js';
import {freshSave,ENEMIES} from '../data.js';
import {spawnOverlord,attackOverlord} from '../expedition.js';
import {ensureDiscoveries,awakenSite,guardSite,guardianHealth} from '../discoveries.js';
import {regionStrike} from '../region-combat.js';
const make=(region,m=0)=>{const s=freshSave();s.region=region;s.meta={armor:2};const g=new Game(s);g.time=m*60;g.rng=42;return g;};
const close=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const checks=[],table=[];
for(const minute of [0,1,3,4,5,10,15,20,30,60]){
 const a=make('ashwood',minute),h=make('hollow',minute),c=make('cinder',minute),base=a.difficulty();
 close(base.health,(1+minute*.35+minute*minute*.018)*(1+Math.max(0,minute-10)*.18+Math.max(0,minute-10)**2*.012));
 for(const q of [h,c]){const d=q.difficulty(),s=q.regionalStrength();for(const k of ['cap','count','interval'])assert.equal(d[k],base[k]);close(d.health/base.health,s.health);close(d.speed/base.speed,s.speed);const e=q.spawn('crawler');close(e.maxHp,ENEMIES[e.type].hp*d.health*(q.region==='cinder'?1.25:1)*(minute>=10?1+Math.min(5,(minute-10)*.12):1));}
 assert(minute===0?c.difficulty().health===3.5*base.health&&h.difficulty().health===base.health:c.difficulty().health>h.difficulty().health&&h.difficulty().health>base.health);
 table.push({minute,hollow:h.regionalStrength(),cinder:c.regionalStrength()});
}
checks.push('Ashwood unchanged; both regional ramps reach actual spawned enemies and retain original population, rate and interval');
for(const region of ['hollow','cinder']){
 const q=make(region);let prev=q.difficulty();
 for(let t=1;t<=3600;t++){q.time=t;const d=q.difficulty();assert(d.health>=prev.health&&d.speed>=prev.speed);assert(d.health/prev.health<1.02,'No abrupt difficulty cliff');prev=d;}
 const early=make(region,0).regionalStrength(),later=make(region,10).regionalStrength();assert(later.health>early.health*1.6);assert(later.damage>early.damage);
 for(const m of [0,3,10,20]){const g=make(region,m);ensureDiscoveries(g);const site=g.discoveries[0];awakenSite(g,site);const e=g.enemies[0];close(e.maxHp,guardianHealth(g));e.hp*=.4;const hp=e.hp,maxHp=e.maxHp;g.player.x=site.x+700;guardSite(g,e,.05);g.enemies=[];g.time+=120;awakenSite(g,site);close(g.enemies[0].hp,hp);close(g.enemies[0].maxHp,maxHp);}
 const boss=make(region,15),e=spawnOverlord(boss);close(e.maxHp,(95000+5*18000+25*1400)*(region==='cinder'?1.25:1)*boss.regionalStrength().health);attackOverlord(boss,e);assert(boss.hazards.length);close(boss.hazards[0].damage,boss.enemyDamage(55+15*1.5));assert(boss.hazards.every(h=>h.max>=1.8));
 const saved=boss.snapshot(),restored=new Game(freshSave(),()=>{},saved);assert.deepEqual(restored.enemies,saved.enemies);assert.deepEqual(restored.hazards,saved.hazards);assert.equal(restored.player.hp,boss.player.hp);
}
checks.push('Continuous one-second ramp through 60 minutes; guardian and Overlord scaling; retreat/save retains existing boss HP without repeated boosts');
for(const region of ['ashwood','hollow','cinder'])for(const kind of ['contact','shot','eruption']){
 const g=make(region,5);g.skills={};g.invuln=0;g.player.hp=g.maxHp();g.spawnClock=1e6;g.nextElite=g.nextBoss=g.nextCache=g.nextHeal=g.nextWorldStrike=g.nextDiscoveryScan=1e6;g.waveMinute=5;
 let raw;
 if(kind==='contact'){const e=g.spawn('crawler');e.x=e.y=0;e.speed=0;raw=ENEMIES[e.type].damage+300.001/60;}
 if(kind==='shot'){g.hazards.push({kind:'shot',x:0,y:0,vx:0,vy:0,r:5,life:2});raw=18+300.001/60*.65;}
 if(kind==='eruption'){regionStrike(g,{boss:false},0,0,30,.0005,30);raw=35;}
 const strength=g.regionalStrength().damage;g.step(.001);const multiplier=kind==='eruption'?strength:g.regionalStrength().damage;close(g.maxHp()-g.player.hp,raw*multiplier-g.armor());
}
checks.push('Real contact, projectile and telegraphed ground hits use regional damage before armor without double scaling');
console.log(JSON.stringify({checks,table},null,2));
