import assert from 'node:assert/strict';
import {Game} from '../engine.js';
import {freshSave,WEAPONS} from '../data.js';
import {SIGNATURE_TRACKS,spellTracks} from '../spellcraft.js';
import {buySpell,validProgression} from '../gear.js';
function game(id,craft={},evolved=true){const s=freshSave();s.equipment={};s.unlockedWeapons=WEAPONS.map(w=>w.id);s.spellcraft={[id]:craft};const g=new Game(s);g.rng=42;g.random=()=>.9;g.skills={[id]:id==='regen'||id==='vitality'?3:8};g.evolved=evolved?[id]:[];g.nextCache=g.nextHeal=g.nextBoss=g.nextElite=g.nextWorldStrike=g.nextObjective=g.nextDiscoveryScan=g.spawnClock=1e9;g.invuln=999;for(let i=0;i<30;i++){const e=g.spawn();e.x=35+i*8;e.y=0;e.hp=e.maxHp=1e9;e.speed=0;}return g;}
const covered=new Set();function check(id,key,measure){const t=SIGNATURE_TRACKS[id].find(t=>t.id===key),base=game(id),up=game(id,{[key]:t.max});const [a,b]=[measure(base),measure(up)];assert(b>a,`${id}/${key}: ${a} -> ${b}`);covered.add(id+':'+key);}
for(const id of ['bolt','dagger','spear','scythe','wisp','axe','solar'])check(id,'projectiles',g=>{g.fire(id);return g.bullets.length;});
for(const id of ['meteor','mine','void','torrent'])check(id,'projectiles',g=>{g.fire(id);return g.hazards.length;});
check('beam','projectiles',g=>{g.fire('beam');return g.effects.filter(e=>e.kind==='beam').length;});
// Orbit checks real damage coverage from additional blade angles (the renderer uses the same count).
check('orbit','projectiles',g=>{g.skills.orbit=1;g.evolved=[];g.enemies=[];for(let i=0;i<120;i++){const a=i*Math.PI/60,e=g.spawn();e.x=Math.cos(a)*70;e.y=Math.sin(a)*70;e.r=1;e.hp=e.maxHp=1e9;e.speed=0;}g.step(.001);return g.enemies.filter(e=>e.hp<e.maxHp).length;});
for(const id of ['bolt','dagger','spear','solar'])check(id,'pierce',g=>{g.fire(id);return g.bullets[0].pierce;});
check('chain','jumps',g=>{g.fire('chain');return g.enemies.filter(e=>e.hp<e.maxHp).length;});
for(const id of ['nova','frost','flame','chrono','aegis'])check(id,'radius',g=>{g.fire(id);return Math.max(...g.effects.map(e=>e.r||0));});
for(const id of ['meteor','mine','void','torrent','tide'])check(id,'radius',g=>{g.fire(id);return Math.max(...g.hazards.map(e=>e.r||0));});
check('blood','radius',g=>{g.enemies[29].x=240;g.fire('blood');return g.enemies.filter(e=>e.hp<e.maxHp).length;});
check('chain','radius',g=>{g.enemies=g.enemies.slice(0,2);g.enemies[1].x=270;g.fire('chain');return g.enemies.filter(e=>e.hp<e.maxHp).length;});
check('orbit','radius',g=>{g.skills.orbit=8;g.enemies=g.enemies.slice(0,1);const e=g.enemies[0];e.x=145;e.y=0;e.r=12;g.step(.001);return e.maxHp-e.hp;});
for(const id of ['scythe','axe'])check(id,'width',g=>{g.fire(id);return g.bullets[0].r;});
check('beam','width',g=>{g.fire('beam');return g.effects[0].width;});
check('flame','duration',g=>{g.fire('flame');return g.effects.find(e=>e.kind==='fire').life;});
check('venom','duration',g=>{g.fire('venom');return g.effects[0].life;});
check('wisp','duration',g=>{g.fire('wisp');return g.bullets[0].life;});
for(const id of ['frost','chrono'])check(id,'duration',g=>{const e=g.enemies[0];e.reaper=e.boss=true;g.fire(id);assert(e.freezeReadyAt>e.frozenUntil);return e.frozenUntil;});
check('aegis','shield',g=>{g.fire('aegis');return g.shield;});
for(const id of ['blood','nova'])check(id,'healing',g=>{g.player.hp=10;g.fire(id);return g.player.hp;});
check('venom','tickrate',g=>{g.fire('venom');g.cd.venom=999;for(let i=0;i<40;i++)g.step(.05);return g.damageDone.venom;});
check('tide','force',g=>{g.enemies=g.enemies.slice(0,1);g.enemies[0].x=10;g.fire('tide');g.cd.tide=999;g.step(.05);return g.enemies[0].x;});
check('regen','recovery',g=>{g.player.hp=10;g.step(.05);return g.player.hp;});
check('regen','surge',g=>{g.player.hp=10;g.step(.05);return g.player.hp;});
check('vitality','health',g=>g.maxHp());
check('vitality','healing',g=>{g.skills.vitality=2;g.player.hp=10;g.upgrade('vitality');return g.player.hp;});
assert.equal(covered.size,Object.values(SIGNATURE_TRACKS).flat().length);
// Health investment is dormant before the relevant passive is acquired.
for(const id of ['regen','vitality']){const g=game(id,Object.fromEntries(SIGNATURE_TRACKS[id].map(t=>[t.id,t.max])));g.skills={};g.player.hp=10;g.step(.05);assert.equal(g.player.hp,10);assert.equal(g.maxHp(),100);}
// Full legacy purchases keep their values and spending; new purchases validate and snapshot independently.
const s=freshSave();s.gold=1e7;s.unlockedWeapons=WEAPONS.map(w=>w.id);s.spellcraft.bolt={power:10,haste:5,opening:2};s.spellSpent=54321;const old={...s.spellcraft.bolt};let spent=0;
for(const [id,tracks] of Object.entries(SIGNATURE_TRACKS))for(const t of tracks){assert(buySpell(s,id,t.id));spent+=t.cost;assert(validProgression(s));}
assert.equal(s.spellSpent,54321+spent);for(const [k,v] of Object.entries(old))assert.equal(s.spellcraft.bolt[k],v);assert(!buySpell(s,'blood','pierce'));assert(!validProgression({spellcraft:{frost:{projectiles:1}}}));assert(!validProgression({spellcraft:{regen:{recovery:6}}}));
const g=new Game(s),snap=g.snapshot();s.spellcraft.bolt.projectiles=3;const resumed=new Game(s,()=>{},snap);assert.equal(resumed.spellcraft.bolt.projectiles,1);assert.equal(resumed.spellcraft.bolt.power,10);assert(validProgression({spellcraft:JSON.parse(JSON.stringify(snap.spellcraft))}));
console.log(JSON.stringify({signatureEffectsVerified:covered.size,legacyPurchasesPreserved:true,healthRequiresAcquisition:true,savedRunInvestmentUnchanged:true}));
