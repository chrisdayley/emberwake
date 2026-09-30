import assert from 'node:assert/strict';
import {Game} from '../engine.js';
import {freshSave} from '../data.js';
import {ensureDiscoveries,awakenSite,guardSite,SITE_SPACING} from '../discoveries.js';
import {guardianAttack} from '../region-combat.js';
const make=(region,m=0)=>{const s=freshSave();s.region=region;const g=new Game(s);g.time=m*60;return g;};
const checks=[];
for(const region of ['ashwood','hollow','cinder']){
 const g=make(region);ensureDiscoveries(g);assert.equal(g.discoveries.length,3);assert(g.discoveries.every(s=>Math.hypot(s.x,s.y)>=3000));
 for(let n=0;n<160;n++){
  ensureDiscoveries(g);assert(g.discoveries.length<=20);assert(g.discoveries.filter(s=>s.state!=='claimed').length<=12);
  for(let i=0;i<g.discoveries.length;i++)for(let j=i+1;j<g.discoveries.length;j++)assert(Math.hypot(g.discoveries[i].x-g.discoveries[j].x,g.discoveries[i].y-g.discoveries[j].y)>=SITE_SPACING);
  const s=g.discoveries.find(s=>s.state!=='claimed');assert(s);g.player.x=s.x;g.player.y=s.y;s.state='claimed';s.discovered=true;
  ensureDiscoveries(g);assert(g.discoveries.includes(s),'Just-cleared site remains a spacing reservation');assert(g.discoveries.filter(t=>t.state!=='claimed').every(t=>Math.hypot(t.x-s.x,t.y-s.y)>=SITE_SPACING));
 }
}
checks.push('480 discovery clear/explore cycles enforce 2600-unit spacing including cleared ground, with bounded saved state');
for(const region of ['hollow','cinder'])for(const m of [3,5,10,20]){
 const g=make(region,m),oldHealth=1+Math.min(region==='hollow'?2.4:4.2,m*(region==='hollow'?.12:.21));
 assert(g.regionalStrength().health/oldHealth>= (m===3?1.8:2.3));
 ensureDiscoveries(g);const site=g.discoveries[0];awakenSite(g,site);const e=g.enemies[0];const oldGuardian=(650+250*m+45*m*m)*oldHealth;assert(e.maxHp/oldGuardian>=15,'Guardian must be dramatically tougher than v13');
 if(m===5)assert(e.maxHp>=100000);
 e.x=g.player.x-200;e.y=g.player.y;e.hp=e.maxHp*.4;guardianAttack(g,e);assert.equal(e.attack,3.6);assert(g.hazards.every(h=>h.max>=1.6));assert(g.hazards[0].damage>(30+m*.5+m)*g.regionalStrength().damage*1.24);
}
checks.push('Later-region health is substantially above v13; five-minute site bosses exceed 100k HP and have faster attacks with unchanged warnings');
const legacy=make('hollow');ensureDiscoveries(legacy);const snap=legacy.snapshot();delete snap.discoveryLayoutVersion;const [known,unseen,reward]=snap.discoveries;known.x=400;known.y=0;known.discovered=true;unseen.x=500;unseen.y=0;reward.x=600;reward.y=0;reward.state='ready';reward.discovered=true;
const re=new Game(freshSave(),()=>{},snap);ensureDiscoveries(re);assert(re.discoveries.some(s=>s.id===known.id&&s.x===400));assert(re.discoveries.some(s=>s.id===reward.id&&s.state==='ready'));assert(!re.discoveries.some(s=>s.id===unseen.id));const once=re.snapshot();const again=new Game(freshSave(),()=>{},once);ensureDiscoveries(again);assert.deepEqual(again.discoveries,re.discoveries);
checks.push('Legacy unseen sites are replaced once while known locations and earned rewards stay intact');
const g=make('cinder',5);ensureDiscoveries(g);const s=g.discoveries[0];awakenSite(g,s);g.enemies[0].hp*=.3;const hp=g.enemies[0].hp,maxHp=g.enemies[0].maxHp;g.player.x=s.x+700;g.player.y=s.y;guardSite(g,g.enemies[0],.05);g.enemies=[];g.time=900;const saved=new Game(freshSave(),()=>{},g.snapshot());awakenSite(saved,saved.discoveries[0]);assert.equal(saved.enemies[0].hp,hp);assert.equal(saved.enemies[0].maxHp,maxHp);
checks.push('Retreat and save never heal or re-scale a previously encountered guardian');
console.log(JSON.stringify({checks},null,2));
