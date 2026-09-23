import {REGIONAL_ENEMIES} from './bestiary.js?v=13';
import {safePoint} from './world.js?v=13';
const TAU=Math.PI*2;
// Shared cap covers delayed ground attacks as well as death bursts, not only bullets.
export function regionStrike(g,e,x,y,r=45,warning=1.6,damage=24){
 if(!e.boss&&g.hazards.filter(h=>h.regional&&!h.bossAttack).length>=8)return false;
 if(g.hazards.filter(h=>h.regional).length>=28)return false;
 g.hazards.push({kind:'eruption',x,y,r,life:warning,max:warning,damage:g.enemyDamage(damage+g.time/60),color:g.region==='hollow'?'#cdadff':'#ffb05e',regional:true,bossAttack:!!e.boss});return true;
}
export function regionalDeath(g,e){if(e.type==='slagslug')regionStrike(g,e,e.x,e.y,30,1.5,17);}
function cue(g,e,label,duration=2.8){e.attackLabel=label;e.attackUntil=g.time+duration;}
function dash(g,e,dt,dx,dy,d,speed,windup=.9){
 if(e.attack<=windup&&e.attack>0){if(e.phase!==1){e.ax=dx/d;e.ay=dy/d;}e.phase=1;return 0;}
 if(e.attack<=0&&e.attack>-.6){e.phase=2;e.x+=(e.ax||0)*speed*dt;e.y+=(e.ay||0)*speed*dt;return 0;}
 if(e.attack<=-.6){e.attack=4.5;e.phase=0;}return null;
}
function blink(g,e,dt,burrow=false){
 if(e.attack<=0&&!e.blinkTarget){const a=g.random()*TAU,d=burrow?110:155;const target=safePoint(g.region,g.player.x+Math.cos(a)*d,g.player.y+Math.sin(a)*d);if(Math.hypot(target.x-g.player.x,target.y-g.player.y)<85){e.attack=1;return null;}e.blinkTarget=target;e.blinkLeft=1.25;}
 if(e.blinkTarget){e.blinkLeft-=dt;if(e.blinkLeft<=0){const from={x:e.x,y:e.y};Object.assign(e,e.blinkTarget);e.blinkTarget=null;e.attack=6+g.random()*3;g.burst(from.x,from.y,24,burrow?'#ffb05e':'#cdadff');g.burst(e.x,e.y,32,burrow?'#ffb05e':'#cdadff');}return 0;}return null;
}
export function guardianAttack(g,e){
 const b=REGIONAL_ENEMIES[e.type]?.behavior,p=g.player,damage=30+g.time/120,a=Math.atan2(p.y-e.y,p.x-e.x),sx=-Math.sin(a),sy=Math.cos(a);e.fury=e.hp<e.maxHp*.5;
 const hit=(x,y,r=45,t=1.7)=>regionStrike(g,e,x,y,r,t,damage);
 if(b==='widow'){cue(g,e,'WEB TRAP · EXIT THE OPEN SIDE');for(let i=1;i<=3;i++){const ang=a+i*TAU/4;hit(p.x+Math.cos(ang)*100,p.y+Math.sin(ang)*100,40,1.8);}hit(p.x,p.y,32,2.3);}
 if(b==='organ'){cue(g,e,'DEATH CHORD · STEP BETWEEN THE NOTES');for(let i=-2;i<=2;i++)hit(p.x+sx*i*105,p.y+sy*i*105,34,1.6+Math.abs(i)*.25);}
 if(b==='monarch'){cue(g,e,'SPECTRAL STAMPEDE · DODGE SIDEWAYS');for(let i=-2;i<=2;i++)hit(p.x+Math.cos(a)*i*80,p.y+Math.sin(a)*i*80,38,1.65+(i+2)*.17);}
 if(b==='volcano'){cue(g,e,'CRATER SALVO · LEAVE THE CIRCLES');for(let i=0;i<4;i++){const ang=a+i*TAU/4;hit(p.x+Math.cos(ang)*95,p.y+Math.sin(ang)*95,48,1.8+i*.3);}}
 if(b==='wyrm'){cue(g,e,'MOLTEN FISSURE · CROSS THE LINE');for(let i=-2;i<=2;i++)hit(p.x+sx*i*75,p.y+sy*i*75,34,1.8+(i+2)*.18);}
 if(b==='archon'){cue(g,e,'HAMMER PRESS · KEEP MOVING',3.5);hit(p.x-sx*110,p.y-sy*110,68,1.8);hit(p.x+sx*110,p.y+sy*110,68,2.3);hit(p.x,p.y,58,2.9);}
 e.attack=e.fury?4.8:6.4;
}
// Returns movement speed override; base movement and terrain collision stay centralized.
export function stepRegional(g,e,dt,dx,dy,d,spd){
 const spec=REGIONAL_ENEMIES[e.type];if(!spec)return spd;
 if(e.boss){if(!e.lateBoss&&e.attack<=0)guardianAttack(g,e);return spd;}
 const b=spec.behavior,p=g.player;
 if(b==='blink'||b==='burrow'){const speed=blink(g,e,dt,b==='burrow');if(speed!==null)return speed;}
 if(b==='pounce'||b==='ram'||b==='roll'){const s=dash(g,e,dt,dx,dy,d,b==='pounce'?225:b==='ram'?285:315,b==='roll'?1.1:.9);if(s!==null)return s;}
 if(b==='weave'||b==='orbit'||b==='crab'){const side=b==='crab'?.7:Math.sin(g.time*(b==='orbit'?2:3)+e.id)*1.1;e.x-=dy/d*spd*side*dt;e.y+=dx/d*spd*side*dt;}
 if(b==='soulshot'&&d<620){if(e.attack<=0){if(g.hazards.filter(h=>h.kind==='shot').length<15)g.hazards.push({kind:'shot',x:e.x,y:e.y,vx:dx/d*145,vy:dy/d*145,r:6,life:4,color:'#bea1ff'});e.attack=3.6;}return d<300?-spd*.5:d<430?0:spd;}
 if(['mortar','bell','rift','hammer'].includes(b)&&e.attack<=0&&d<580){
  if(b==='mortar')regionStrike(g,e,p.x,p.y,42,1.9,24);
  if(b==='bell'){for(let i=0;i<3;i++){const a=Math.atan2(dy,dx)+i*TAU/3;regionStrike(g,e,e.x+Math.cos(a)*95,e.y+Math.sin(a)*95,38,1.7,28);}}
  if(b==='rift'){for(let i=-1;i<=1;i++)regionStrike(g,e,p.x+dx/d*i*85,p.y+dy/d*i*85,32,1.8+i*.2,30);}
  if(b==='hammer')regionStrike(g,e,e.x+dx/d*100,e.y+dy/d*100,62,1.9,34);
  e.attack=b==='rift'?8:6.5;
 }
 return spd;
}
