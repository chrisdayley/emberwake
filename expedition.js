import {regionalGuardian,REGIONAL_ENEMIES} from './bestiary.js?v=13';
import {safePoint,lavaAt,riftAt} from './world.js?v=13';
const TAU=Math.PI*2;
export function strike(g,x,y,r=60,damage=55,warning=1.6,color='#ff725e'){g.hazards.push({kind:'eruption',x,y,r,life:warning,max:warning,damage,color});}
export function spawnOverlord(g){const e=g.spawn(regionalGuardian(g.region,g.time,true)||'bulwark',false,true),m=Math.max(0,g.time/60-10);e.lateBoss=true;e.hp=e.maxHp=(95000+m*18000+m*m*1400)*(g.region==='cinder'?1.25:1)*g.regionalStrength().health;e.title=REGIONAL_ENEMIES[e.type]?.name||{ashwood:'Rootbound Titan',hollow:'Rift Matriarch',cinder:'Furnace Tyrant'}[g.region];e.r=40;e.speed=(52+Math.min(30,m*1.5))*g.regionalStrength().speed;e.attack=3;e.fury=false;g.nextBoss=g.time+180;g.bossSpawned=true;g.emit('warning',{text:e.title+' awakens · Watch the ground'});return e;}
export function attackOverlord(g,e){
 e.fury=e.hp<e.maxHp*.5;const p=g.player,damage=g.enemyDamage(55+g.time/60*1.5);
 if(g.region==='hollow'){
  e.attackLabel='RIFT CAGE · ESCAPE THROUGH THE GAP';const count=e.fury?10:8;
  const away=Math.atan2(p.y-e.y,p.x-e.x),exit=safePoint(g.region,p.x+Math.cos(away)*170,p.y+Math.sin(away)*170),angle=Math.atan2(exit.y-p.y,exit.x-p.x);
  strike(g,p.x,p.y,42,damage,1.8,'#e6a4ff');
  for(let i=2;i<count-1;i++){const a=angle+i*TAU/count;strike(g,p.x+Math.cos(a)*135,p.y+Math.sin(a)*135,48,damage,2.3,'#e6a4ff');}
  e.attack=e.fury?5:6.5;e.attackUntil=g.time+2.6;
 }else if(g.region==='cinder'){
  e.attackLabel='EMBER RAIN · KEEP MOVING';const count=e.fury?5:3,angle=g.random()*TAU;
  for(let i=0;i<count;i++){const a=angle+i*2.4,d=i?100+i*12:0;strike(g,p.x+Math.cos(a)*d,p.y+Math.sin(a)*d,68,damage,1.8+i*.4,'#ff9163');}
  e.attack=e.fury?5.2:6.8;e.attackUntil=g.time+1.8+(count-1)*.4+.3;
 }else{
  e.attackLabel='HUNTING ROOTS · DODGE SIDEWAYS';const count=e.fury?5:3,dir=g.lastDir;
  for(let i=0;i<count;i++)strike(g,p.x+dir.x*(i-1)*80,p.y+dir.y*(i-1)*80,48,damage,1.6+i*.22,'#ffc086');
  e.attack=e.fury?4.6:6;e.attackUntil=g.time+1.6+(count-1)*.22+.3;
 }
 g.burst(e.x,e.y,90,e.fury?'#fa7564':'#c1a0ff',.7);
}
export function stepWorld(g){const p=g.player;if(g.time>=600&&!g.lateStarted){g.lateStarted=true;g.nextBoss=Math.min(g.nextBoss,g.time);g.nextWorldStrike=g.time+10;g.emit('nightfall');}
 if(g.region==='cinder'&&lavaAt(p.x,p.y)&&g.invuln<=0)g.hurt(Math.max(10,22+g.time/120-g.armor()));
 if(g.region==='hollow'){const r=riftAt(p.x,p.y,g.time);if(r.near&&r.active&&g.invuln<=0)g.hurt(Math.max(8,18+g.time/120-g.armor()));}
 if(g.time>=g.nextWorldStrike){if(g.time>=600){strike(g,p.x,p.y,g.region==='cinder'?75:g.region==='hollow'?65:55,50+g.time/60*2,1.7);g.nextWorldStrike=g.time+7;}else g.nextWorldStrike=600;}
}
export function stepObjective(g){if(g.mode!=='playing'||g.player.hp<=0||g.time<600)return;
 if(!g.objective&&g.time>=g.nextObjective){const angle=g.random()*TAU;g.objective={nodes:Array.from({length:3},(_,i)=>{const a=angle+i*TAU/3,d=260+g.random()*100;return {...safePoint(g.region,g.player.x+Math.cos(a)*d,g.player.y+Math.sin(a)*d),taken:false};}),expires:g.time+90};g.emit('warning',{text:'Shrine hunt · Awaken 3 beacons for gold + Ascension'});}
 if(!g.objective)return;
 if(g.time>=g.objective.expires){g.objective=null;g.nextObjective=g.time+30;g.emit('warning',{text:'The shrines faded · Another hunt begins in 30 seconds'});return;}
 for(const n of g.objective.nodes)if(!n.taken&&Math.hypot(n.x-g.player.x,n.y-g.player.y)<36){n.taken=true;g.burst(n.x,n.y,65,'#b9f2dd',.8);g.emit('shrine');}
 if(g.objective.nodes.every(n=>n.taken)){g.objectivesCompleted++;const gold=150+g.objectivesCompleted*30;g.gainGold(gold);g.player.hp=Math.min(g.maxHp(),g.player.hp+20);g.objective=null;g.nextObjective=g.time+45;g.objectiveChoice=true;g.offers();g.mode='levelup';g.emit('levelup');}
}
