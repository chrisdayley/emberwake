import assert from 'node:assert/strict';
import {freshSave,META} from '../data.js';
const {Game}=await import(process.env.BASELINE?'../work/baseline-engine.mjs':'../engine.js');
function run(seed,active,meta={},hero='ranger',built=false){
 const save=freshSave();save.meta=meta;save.hero=hero;let q=new Game(save);q.rng=seed;let first=0,firstDown=0,milestones={},end=built?1200:600;if(built){q.time=600;q.nextBoss=720;q.nextElite=660;q.nextCache=675;q.nextHeal=635;q.level=35;q.need=q.xpNeeded?q.xpNeeded():300;q.skills={bolt:8,orbit:8,nova:8,chain:8,power:3,reach:3,vitality:3,haste:3};q.evolved=['bolt','orbit','nova','chain'];q.player.hp=q.maxHp();}
 while(q.time<end){if(q.mode==='down'){firstDown||=q.time;if(!q.revive())break;}
 if(q.mode==='chest')q.closeChest();
 if(q.mode==='levelup'){first||=q.time;const pref=['orbit','bolt','power','reach','chain','haste','nova','vitality'];q.choose(pref.find(id=>q.choices.includes(id))||q.choices[0]);}
 let dx=0,dy=0,p=q.player;
 if(active){const loot=q.pickups.filter(x=>!x.taken&&(x.kind==='chest'||x.kind==='heal'&&p.hp<q.maxHp()*.7));const candidates=loot.length?loot:q.gems;let target=null,min=Infinity;for(const x of candidates){const d=Math.hypot(x.x-p.x,x.y-p.y);if(d<min){target=x;min=d;}}
 if(target){dx=(target.x-p.x)/(min||1);dy=(target.y-p.y)/(min||1);}else{dx=Math.cos(q.time*.1);dy=Math.sin(q.time*.1);}
 for(const e of q.enemies){const d=Math.hypot(p.x-e.x,p.y-e.y)||1;if(d<110){dx+=(p.x-e.x)/d*(110-d)/35;dy+=(p.y-e.y)/d*(110-d)/35;if(d<40)q.dash({x:dx,y:dy});}}
 for(const h of q.hazards.filter(h=>h.kind==='eruption')){const d=Math.hypot(p.x-h.x,p.y-h.y);if(d<h.r+35){dx+=(d?(p.x-h.x)/d:q.lastDir.x)*4;dy+=(d?(p.y-h.y)/d:q.lastDir.y)*4;}}
 for(const h of q.hazards.filter(h=>h.kind==='shot')){const d=Math.hypot(p.x-h.x,p.y-h.y)||1;if(d<75){dx+=(p.x-h.x)/d*(75-d)/25;dy+=(p.y-h.y)/d*(75-d)/25;}}
 }
 const n=Math.hypot(dx,dy)||1;q.step(1/60,{x:dx/n,y:dy/n});for(const minute of [1,3,5,10])if(q.time>=minute*60&&!milestones[minute])milestones[minute]={level:q.level,gold:Math.floor(q.gold)};
 }
 return {seed,active,built,hero,upgraded:Object.keys(meta).length>0,time:Math.round(q.time),firstDown:Math.round(firstDown),firstLevel:Math.round(first),level:q.level,kills:q.kills,gold:Math.floor(q.gold),milestones};
}
const profiles=[{}, {might:3,health:3,armor:2,regen:2,magnet:3,haste:2}];
const results=[];for(const meta of profiles)for(const active of [false,true])for(const seed of [42,312,812])results.push(run(seed,active,meta));
if(process.env.BUILT)for(const active of [false,true])for(const hero of ['ranger','warden','witch','sage'])results.push(run(42,active,Object.fromEntries(META.map(x=>[x.id,x.max])),hero,true));
console.log(JSON.stringify(results,null,2));
if(!process.env.BASELINE){const idle=results.filter(r=>!r.active&&!r.built),mobile=results.filter(r=>r.active&&!r.built);assert(idle.every(r=>r.firstDown>0&&r.firstDown<600),'Standing still must fail before ten minutes');assert(mobile.reduce((s,r)=>s+r.time,0)>idle.reduce((s,r)=>s+r.time,0)*1.5,'Active play should materially improve survival');if(process.env.BUILT)assert(results.filter(r=>r.built&&!r.active).every(r=>r.firstDown>600&&r.firstDown<1200),'Fully upgraded stationary builds must eventually lose');}
