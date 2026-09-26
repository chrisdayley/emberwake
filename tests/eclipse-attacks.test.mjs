import assert from 'node:assert/strict';
import {Game} from '../engine.js';
import {freshSave} from '../data.js';
import {spawnReaper} from '../challenge.js';
function arena(kind=0,fury=false){const g=new Game(freshSave());g.rng=42;g.skills={};g.invuln=0;g.time=1800;g.lateStarted=true;g.waveMinute=30;g.nextCache=g.nextHeal=g.nextBoss=g.nextElite=g.nextWorldStrike=g.nextObjective=g.nextDiscoveryScan=g.spawnClock=1e9;spawnReaper(g);const e=g.enemies[0];e.x=-250;e.y=0;e.attack=0;e.eclipseCycle=kind;if(fury)e.hp=e.maxHp*.49;return g;}
const checks=[];
{const g=arena();g.step(0);g.step(0);assert(Number.isFinite(g.enemies[0].eclipseAction.angle));}
// Actual projectiles, not just more circular ground effects; rage increases pressure.
for(const [cycle,kind,normal,rage] of [[0,'volley',10,14],[2,'ring',13,17],[3,'ground',3,5]])for(const fury of [false,true]){
 const g=arena(cycle,fury),e=g.enemies[0];g.invuln=99;g.step(.01);assert.equal(e.eclipseAction.kind,kind);assert.equal(g.hazards.length,0);
 for(let i=0;i<165;i++){g.step(.01);if(!e.eclipseAction)break;}
 assert.equal(g.hazards.length,fury?rage:normal,`${kind} ${fury}`);assert(g.hazards.every(h=>h.eclipse&&h.damage>=145));assert.equal(e.attack,fury?.9:1.4);
 if(kind==='ring')assert(g.hazards.every(h=>Math.abs(Math.atan2(h.vy,h.vx))>.35),'wheel leaves a deliberate escape gap');
}
checks.push('two dart bursts, a gapped projectile wheel and pursuit marks; enraged patterns have more shots and shorter recovery');
// Aim tracks initially, then locks so a late direction change has a readable escape.
let g=arena(),e=g.enemies[0];g.step(.05,{x:0,y:1});const first=e.eclipseAction.angle;g.step(.05,{x:0,y:1});assert(e.eclipseAction.angle>first);
while(e.eclipseAction.timer>.35)g.step(.01,{x:0,y:1});const locked=e.eclipseAction.angle;g.step(.05,{x:0,y:-1});assert.equal(e.eclipseAction.angle,locked);assert(e.eclipseAction.locked);
checks.push('predictive aim tracks movement then locks before release; reversing cannot redirect the locked shot');
// A rush is real fast movement/contact, and a mid-charge freeze/save pauses it.
g=arena(1);e=g.enemies[0];g.invuln=99;g.step(.01);assert.equal(e.x,-250);while(e.eclipseAction.phase!=='rush')g.step(.01);assert(e.x>-250);g.chill(e,5,3);const x=e.x,t=e.eclipseAction.timer;g.step(.1);assert.equal(e.x,x);assert.equal(e.eclipseAction.timer,t);const snap=g.snapshot();g=new Game(freshSave(),()=>{},snap);g.mode='playing';e=g.enemies[0];assert.equal(e.eclipseAction.phase,'rush');assert.equal(e.eclipseAction.timer,t);g.time=e.frozenUntil;g.step(.01);assert(e.x>x);assert(e.eclipseAction.timer<t);
checks.push('charge moves quickly, freezes in place, and resumes the same attack after saving and thawing');
// Fast projectiles cannot pass through the player between frames; normal defense applies.
g=arena();e=g.enemies[0];e.attack=99;g.chill(e,5,3);g.maxHp=()=>1000;g.player.hp=1000;g.skills={guard:3};g.shield=20;g.hazards=[{kind:'shot',eclipse:true,x:-50,y:0,vx:2000,vy:0,r:7,life:2,damage:165}];const before=g.player.hp;g.step(.05);assert(Math.abs(before-g.player.hp-((165-g.armor())*.76-20))<.001);assert.equal(g.hazards.length,0);
g=arena();e=g.enemies[0];e.attack=99;g.hazards=[{kind:'shot',eclipse:true,x:0,y:0,vx:1,vy:0,r:7,life:2,damage:165}];g.invuln=.5;const hp=g.player.hp;g.step(.05);assert.equal(g.player.hp,hp);
checks.push('swept projectile collision respects armor, reduction, shields and invulnerability');
// Cap projectiles even if other overlapping encounters already filled the screen.
g=arena();g.invuln=99;g.hazards=Array.from({length:36},()=>({kind:'shot',eclipse:true,x:1000,y:1000,vx:0,vy:0,r:7,life:10,damage:165}));for(let i=0;i<170;i++)g.step(.01);assert.equal(g.hazards.length,36);
checks.push('36-projectile ceiling prevents unlimited hostile bullet accumulation');
// Compare inputs against the same real volley. Extra test HP only lets us count impacts.
function probe(reactive){const g=arena(),e=g.enemies[0];g.maxHp=()=>100000;g.player.hp=100000;let hits=0;g.onEvent=type=>{if(type==='hurt')hits++;};let direction=1,switched=false;
 for(let i=0;i<120;i++){const a=e.eclipseAction;if(reactive&&a?.kind==='volley'&&a.timer<.3&&!switched){direction=-1;switched=true;}g.step(1/60,{x:0,y:direction});}return hits;}
const predictable=probe(false),reactive=probe(true);assert(predictable>reactive,JSON.stringify({predictable,reactive}));
checks.push('predictive volley punishes constant movement; changing direction during the locked tell avoids the first hit');
console.log(JSON.stringify({checks,volleyHits:{predictable,reactive}},null,2));
