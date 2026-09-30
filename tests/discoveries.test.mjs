import assert from 'node:assert/strict';
import {Game} from '../engine.js';
import {freshSave,ENEMIES} from '../data.js';
import {ensureDiscoveries,stepDiscoveries,awakenSite,guardSite,claimSite} from '../discoveries.js';
import {isSafePoint} from '../world.js';
const checks=[];
const make=region=>{const s=freshSave();s.region=region;const g=new Game(s);g.rng=42;return g;};
for(const region of ['ashwood','hollow','cinder']){
 const g=make(region);ensureDiscoveries(g);assert.equal(g.discoveries.length,3);assert.equal(new Set(g.discoveries.map(s=>s.kind)).size,3);assert(g.discoveries.every(s=>isSafePoint(region,s.x,s.y)&&Math.hypot(s.x,s.y)>=3000));const positions=JSON.stringify(g.discoveries);ensureDiscoveries(g);assert.equal(JSON.stringify(g.discoveries),positions);assert.equal(g.enemies.length,0);
 const q=make(region);ensureDiscoveries(q);assert.deepEqual(q.discoveries,g.discoveries);
 for(let n=0;n<200;n++){g.player.x=n*1600;g.player.y=n*300;ensureDiscoveries(g);assert(g.discoveries.length<=20);assert(g.discoveries.every(s=>isSafePoint(region,s.x,s.y)));}
}
checks.push('Safe, stable, repeatable site locations in all three regions; bounded map size during endless exploration');
for(const region of ['ashwood','hollow','cinder'])for(const kind of ['vault','altar','spring']){
 const g=make(region);ensureDiscoveries(g);const s=g.discoveries.find(s=>s.kind===kind);g.player.x=s.x-250;g.player.y=s.y;stepDiscoveries(g);assert(s.discovered);assert.equal(s.state,'sealed');assert.equal(g.enemies.length,0);assert(!claimSite(g,s));
 g.player.x=s.x;stepDiscoveries(g);assert.equal(s.state,'guarded');const e=g.enemies.find(e=>e.siteId===s.id);assert(e?.boss);if(region!=='ashwood')assert.equal(ENEMIES[e.type].region,region);assert(!claimSite(g,s));
 const gold=g.gold,cleared=g.discoveriesCleared;g.hit(e,1e9,'bolt');assert.equal(s.state,'ready');assert(!g.pickups.some(p=>p.kind==='chest'),'Site guardians must not duplicate their vault with a normal boss chest');
 const re=new Game(freshSave(),()=>{},g.snapshot());assert.equal(re.discoveries.find(x=>x.id===s.id).state,'ready');re.mode='playing';const rs=re.discoveries.find(x=>x.id===s.id);const hp=re.maxHp(),revives=re.revives;assert(claimSite(re,rs));assert.equal(re.discoveriesCleared,cleared+1);assert(re.gold>gold);
 if(kind==='vault'){assert.equal(re.mode,'chest');assert.equal(re.chestReward.rewards.length,5);assert(re.chestReward.gear);assert.equal(re.pendingGear.length,1);}
 if(kind==='altar'){assert.equal(re.mode,'levelup');assert(re.discoveryChoice);assert.equal(re.choices.length,3);assert(re.choices.every(id=>id.startsWith('ascend_')));const r=new Game(freshSave(),()=>{},re.snapshot());assert.equal(r.mode,'levelup');assert(r.discoveryChoice);r.choose(r.choices[0]);assert(!r.discoveryChoice);}
 if(kind==='spring'){assert.equal(re.maxHp(),hp+30);assert.equal(re.player.hp,re.maxHp());assert.equal(re.revives,revives+1);}
 const earned=re.gold;assert(!claimSite(re,rs));assert.equal(re.gold,earned);const restore=new Game(freshSave(),()=>{},re.snapshot());restore.mode='playing';assert(!claimSite(restore,restore.discoveries.find(x=>x.id===s.id)));assert.equal(restore.gold,earned);
}
checks.push('Nine regional reward paths require their guardian kill, unlock once, persist before collection, and cannot duplicate gold/gear/upgrades');
for(const region of ['ashwood','hollow','cinder']){
 const g=make(region);ensureDiscoveries(g);const site=g.discoveries[0];g.player.x=site.x;g.player.y=site.y;awakenSite(g,site);const e=g.enemies[0];e.hp*=.4;const hp=e.hp,max=e.maxHp;g.player.x+=600;assert(guardSite(g,e,.05));assert.equal(site.state,'sealed');assert.equal(site.guardianHp,hp);assert.equal(g.kills,0);assert.equal(g.gold,0);g.enemies=g.enemies.filter(e=>e.hp>0);
 const r=new Game(freshSave(),()=>{},g.snapshot());r.mode='playing';r.player.x=site.x;r.player.y=site.y;stepDiscoveries(r);const returned=r.enemies.find(e=>e.siteId===site.id);assert.equal(returned.hp,hp);assert.equal(returned.maxHp,max);
 const second=r.discoveries.find(s=>s.id!==site.id);assert(!awakenSite(r,second));r.time=179.99;r.nextBoss=180;r.skills={};r.invuln=10000;r.step(.02);assert.equal(r.enemies.filter(e=>e.boss&&e.hp>0).length,1);assert(r.nextBoss>180);
}
checks.push('Retreat parks guardian health without kill rewards; returning restores it, and timed bosses cannot pile onto an active site fight');
const old=make('hollow');old.gold=230;const snap=old.snapshot();for(const k of ['discoveries','discoverySerial','discoveriesCleared','nextDiscoveryScan','discoveryChoice'])delete snap[k];const restored=new Game(freshSave(),()=>{},snap);assert.equal(restored.gold,230);assert.deepEqual(restored.discoveries,[]);restored.mode='playing';stepDiscoveries(restored);assert.equal(restored.discoveries.length,3);checks.push('Pre-update saves retain progress and gain discoveries naturally');
const pause=make('ashwood');ensureDiscoveries(pause);pause.mode='paused';pause.player={...pause.player,x:pause.discoveries[0].x,y:pause.discoveries[0].y};stepDiscoveries(pause);assert.equal(pause.enemies.length,0);checks.push('Paused expeditions never awaken guardians or claim rewards');
console.log(JSON.stringify({checks},null,2));
