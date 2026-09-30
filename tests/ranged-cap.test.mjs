import assert from 'node:assert/strict';
import {Game} from '../engine.js';
import {freshSave} from '../data.js';
const game=new Game(freshSave());
for(let i=0;i<40;i++)game.spawn('shooter');
assert.equal(game.enemies.filter(e=>e.type==='shooter').length,5);
assert.equal(game.enemies.length,40,'Overflow keeps wave size by spawning melee enemies');
assert.equal(game.enemies.filter(e=>e.type==='crawler').length,35);
game.enemies.find(e=>e.type==='shooter').hp=0;
assert.equal(game.spawn('shooter').type,'shooter','A defeated shooter frees a slot immediately');
assert.equal(game.spawn('shooter').type,'crawler');
// Offscreen shooters still count: moving the camera must not build another firing squad.
for(const e of game.enemies){e.x=2000;e.y=2000;}
assert.equal(game.spawn('shooter').type,'crawler');
// Old saves can contain far more than five shooters and an existing projectile wall.
const old=new Game(freshSave());const sample=old.spawn('shooter');
old.enemies=Array.from({length:22},(_,i)=>({...sample,id:i+1,x:i*20,hp:sample.maxHp*.5}));
old.nextId=23;old.gold=321;old.xp=9;old.skills={bolt:6,power:2};
old.hazards=[{kind:'shot',x:10,y:10,life:4},{kind:'eruption',x:30,y:40,life:1},{kind:'meteor',x:50,y:60,life:.5}];
const restored=new Game(freshSave(),()=>{},old.snapshot());
assert.equal(restored.rangedCount(),5);assert.equal(restored.enemies.length,22);
assert.equal(restored.enemies[5].hp/restored.enemies[5].maxHp,.5);
assert.equal(restored.gold,321);assert.equal(restored.xp,9);assert.deepEqual(restored.skills,old.skills);
assert.deepEqual(restored.hazards.map(h=>h.kind),['eruption','meteor']);
const ordinary=new Game(freshSave());ordinary.spawn('shooter');ordinary.hazards=[{kind:'shot',x:1,y:1,life:3}];
assert.equal(new Game(freshSave(),()=>{},ordinary.snapshot()).hazards.length,1,'Normal saved combat preserves its projectiles');
// Drive real waves at early, late and endless timestamps, with shooters unable to die.
for(const minute of [3,10,30,60]){const wave=new Game(freshSave());wave.rng=400+minute;wave.time=minute*60;wave.skills={};wave.invuln=9999;wave.nextElite=wave.nextBoss=wave.nextCache=wave.nextHeal=1e9;wave.player.hp=1e6;
 for(let i=0;i<1200;i++){wave.step(.05);assert(wave.rangedCount()<=5,`Cap exceeded at ${minute} minutes`);}
 assert.equal(wave.rangedCount(),5);
}
console.log('PASS: spawn cap, melee replacement, freed slots, offscreen cap, old-save cleanup, preserved progress and real waves at 3/10/30/60 minutes.');
