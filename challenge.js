import {stepEclipse} from './eclipse-combat.js?v=24';
import {SPECIAL_STAGES} from './chronicle.js?v=24';
const TAU=Math.PI*2;
export const challengeStage=id=>SPECIAL_STAGES.find(s=>s.id===id);
const NAMES={frostmarch:['Rime hounds','Crystal moths','Icebound knights','Snow oracles','The White Hunt','Glacier Empress'],drowned:['Ink leeches','Coral skimmers','Anchor hulks','Pearl sirens','The Librarian Below','Leviathan of Ink'],clockwork:['Gear mites','Brass hornets','Pendulum knights','Clock sentries','The Broken Hour','Grand Automaton'],briarheart:['Thornlings','Rose wasps','Briar ogres','Bloom witches','The Rose Widow','Heartwood Devourer'],sunforge:['Solar scarabs','Flare hawks','Gilded titans','Sun acolytes','The Golden Judge','Crown of the Sun'],eclipse:['Voidlings','Star serpents','Eclipse knights','Night choirs','The Unnamed Star','Sovereign of Nothing']};
export const CHALLENGE_ENEMIES={};
for(const s of SPECIAL_STAGES)NAMES[s.id].forEach((name,i)=>{CHALLENGE_ENEMIES[s.id+'_'+i]={name,hp:[28,20,145,85,110,850][i],speed:[58,84,36,41,48,53][i],r:[12,11,22,15,38,42][i],damage:[16,15,28,23,45,65][i],xp:[1,1,5,3,80,100][i],minute:[0,1,3,5,Infinity,Infinity][i],behavior:'challenge',region:s.id,challenge:true,shape:i,height:[42,39,65,54,132,156][i],guardian:i>=4,ranged:i===3,armor:i===2?.18:0};});
CHALLENGE_ENEMIES.nightreaper={name:'The Last Eclipse',hp:3000000,speed:165,r:38,damage:400,xp:500,minute:Infinity,region:'eclipse',challenge:true,shape:6,height:170,guardian:true};
const mod=(x,n)=>(x%n+n)%n;
export function challengeWalls(region,x,y){if(!['drowned','clockwork','briarheart'].includes(region))return [];const blocks=[],size=640,cx=Math.floor(x/size),cy=Math.floor(y/size);for(let ix=cx-1;ix<=cx+1;ix++)for(let iy=cy-1;iy<=cy+1;iy++){const X=ix*size,Y=iy*size;if(region==='drowned')blocks.push({x:X+100,y:Y+170,w:360,h:45},{x:X+100,y:Y+425,w:360,h:45});if(region==='clockwork')for(const dx of [160,440])for(const dy of [160,440])blocks.push({x:X+dx,y:Y+dy,w:55,h:55});if(region==='briarheart')blocks.push({x:X+120,y:Y+100,w:50,h:340},{x:X+270,y:Y+390,w:300,h:50});}return blocks;}
export function challengeHazard(region,x,y,time){const phase=mod(time,24),gx=Math.floor(x/240),gy=Math.floor(y/240);if(region==='frostmarch'){const warm=Math.hypot(mod(x+280,560)-280,mod(y+280,560)-280)<95;return {active:phase>=16&&!warm,warning:phase>=13&&phase<16&&!warm,slow:.7,damage:17,label:'BLIZZARD · FIND A BRAZIER'};}
 if(region==='clockwork'){const hot=mod(gx+gy+Math.floor(time/6),2)===0&&mod(x,240)>30&&mod(x,240)<210&&mod(y,240)>30&&mod(y,240)<210,tick=mod(time,6);return {active:hot&&tick>=4.5,warning:hot&&tick>=3&&tick<4.5,damage:32,label:'CLOCK PULSE · LEAVE RED TILES'};}
 if(region==='sunforge'){const lane=n=>Math.abs(mod(n+320,640)-320),lava=(lane(x-320)<48||lane(y-320)<48)&&!(lane(x)<90||lane(y)<90);return {active:lava,warning:false,damage:32,slow:.72,label:'SOLAR CANALS · CROSS ON STONE'};}
 if(region==='eclipse'){const d=Math.hypot(mod(x+320,640)-320,mod(y+320,640)-320),hot=d>150&&d<230;return {active:hot&&phase>=15,warning:hot&&phase>=12&&phase<15,damage:45,label:'VOID WELLS · WATCH THE RINGS'};}
 return {active:false,warning:false,damage:0};}
export function challengeSafe(region,x,y){return !challengeHazard(region,x,y,20).active&&!challengeHazard(region,x,y,4.6).active;}
function strike(g,x,y,r,damage,warning=1.8){if(g.hazards.filter(h=>h.kind==='eruption').length>=28)return;g.hazards.push({kind:'eruption',x,y,r,life:warning,max:warning,damage,color:'#ff354d'});}
export function stepChallengeWorld(g,dt){const spec=challengeStage(g.region);if(!spec)return;const p=g.player,h=challengeHazard(g.region,p.x,p.y,g.time);if(h.active&&g.invuln<=0)g.hurt(Math.max(6,h.damage+g.time/150-g.armor()));
 if(g.region==='drowned'){const t=mod(g.time,20);if(t>12&&!g.dashing)p.x+=Math.sin(g.time/20*Math.PI)*65*dt;}
 if(g.region==='briarheart'&&g.time>=g.nextChallengeStrike){strike(g,p.x,p.y,70,g.enemyDamage(26),2.2);g.nextChallengeStrike=g.time+9;}
 if(g.region==='eclipse'&&g.time>=g.nextChallengeStrike){g.spawn('eclipse_2',true);g.nextChallengeStrike=g.time+35;}
}
export function stepChallengeEnemy(g,e,dt,dx,dy,d,spd){if(e.reaper)return stepEclipse(g,e,dt);const spec=CHALLENGE_ENEMIES[e.type];if(!spec)return spd;const p=g.player,i=spec.shape;
 if(e.boss&&e.attack<=0){const damage=g.enemyDamage(38+g.time/90),a=Math.atan2(dy,dx),style=SPECIAL_STAGES.findIndex(s=>s.id===g.region);e.attackLabel=['ICE SPEARS · DODGE THE CROSS','TIDAL SHELVES · SLIP THROUGH','PENDULUM · STEP ASIDE','HUNTING PETALS · KEEP MOVING','SUNFALL · LEAVE THE LIGHT','VOID CROWN · FIND THE GAP'][style]||'WATCH THE GROUND';e.attackUntil=g.time+3;
  if(style===0||style===2)for(let j=-2;j<=2;j++)strike(g,p.x+Math.cos(a+Math.PI/2)*j*85,p.y+Math.sin(a+Math.PI/2)*j*85,32,damage,1.8+Math.abs(j)*.2);
  else if(style===1||style===4)for(let j=0;j<4;j++)strike(g,p.x+g.lastDir.x*j*80,p.y+g.lastDir.y*j*80,48,damage,1.6+j*.4);
  else for(let j=1;j<6;j++){const angle=a+j*TAU/7;strike(g,p.x+Math.cos(angle)*130,p.y+Math.sin(angle)*130,42,damage,2.2);}
  e.attack=e.hp<e.maxHp*.5?4.8:6.4;return spd;
 }
 if(i===1){e.x+=-dy/d*spd*Math.sin(g.time*2+e.id)*dt;e.y+=dx/d*spd*Math.sin(g.time*2+e.id)*dt;}
 if(i===2&&e.attack<1&&e.attack>0){if(e.phase!==1){e.ax=dx/d;e.ay=dy/d;}e.phase=1;return 0;}if(i===2&&e.attack<=0){if(e.attack>-.5){e.x+=(e.ax||0)*250*dt;e.y+=(e.ay||0)*250*dt;return 0;}e.attack=5;e.phase=0;}
 if(i===3&&e.attack<=0&&d<560){strike(g,p.x,p.y,38,g.enemyDamage(23),1.9);e.attack=6;return d<220?-spd*.35:0;}
 return spd;
}
export function spawnReaper(g){if(g.reaperSpawned)return;g.reaperSpawned=true;const e=g.spawn('nightreaper',false,true);e.reaper=true;e.title='The Last Eclipse';e.hp=e.maxHp=3000000;e.speed=165;e.r=38;e.attack=2;g.emit('warning',{text:'THE LAST ECLIPSE · 3 MILLION HEALTH · Freeze, defend and keep moving'});}
export function fireLostWeapon(g,id){const rank=g.rank(id),ev=g.evolved.includes(id),p=g.player,target=g.nearest(),area=g.spellArea(id);if(!['aegis','chrono','torrent','blood','solar','void'].includes(id))return false;
 if(id==='aegis'){const shield=(8+rank*3)*(ev?2:1)*(1+g.craft(id,'shield')*.2);g.shield=Math.max(g.shield,shield);g.aoe(p.x,p.y,(95+rank*8)*area,24+rank*10,id,22);g.burst(p.x,p.y,(95+rank*8)*area,'#b8eeff',.5);g.cd[id]=5*g.haste(id);}
 if(id==='chrono'){const r=(140+rank*15)*(ev?1.4:1)*area;g.aoe(p.x,p.y,r,32+rank*12,id);for(const e of g.enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<r)g.chill(e,ev?5:2,ev?3:.6+rank*.13,1+g.craft(id,'duration')*.2);g.burst(p.x,p.y,r,'#ffe1a0',.6);g.cd[id]=(ev?2.5:4)*g.haste(id);}
 if(id==='torrent'){for(let j=0;j<(ev?6:3)+g.craft(id,'projectiles');j++){const a=g.time+j*TAU/((ev?6:3)+g.craft(id,'projectiles'));g.hazards.push({kind:'wave',x:p.x+Math.cos(a)*45,y:p.y+Math.sin(a)*45,r:(140+rank*13)*area,damage:28+rank*10,life:1.3,max:1.3,id,hit:[]});}g.cd[id]=3*g.haste(id);}
 if(id==='blood'){if(target){const r=(ev?170:55+rank*6)*area;g.aoe(target.x,target.y,r,42+rank*16,id);p.hp=Math.min(g.maxHp(),p.hp+(ev?5:1+rank*.2)*(1+g.craft(id,'healing')*.2));g.effects.push({kind:'chain',points:[p,{x:target.x,y:target.y}],color:'#f3a7d4',life:.35,max:.35});}g.cd[id]=2*g.haste(id);}
 if(id==='solar'){if(target){const a=Math.atan2(target.y-p.y,target.x-p.x),count=(ev?9:4+Math.floor(rank/3))+g.craft(id,'projectiles');for(let j=0;j<count;j++)g.bullets.push({x:p.x,y:p.y,vx:Math.cos(a+(j-(count-1)/2)*.13)*370,vy:Math.sin(a+(j-(count-1)/2)*.13)*370,r:6,life:2,damage:38+rank*15,id,pierce:(ev?18:7)+g.craft(id,'pierce')*2,hit:[],color:'#ffe499'});}g.cd[id]=2*g.haste(id);}
 if(id==='void'){if(target)for(let j=0;j<(ev?3:1)+g.craft(id,'projectiles');j++){const x=target.x+Math.cos(j*TAU/3)*j*70,y=target.y+Math.sin(j*TAU/3)*j*70,r=(90+rank*12)*area;for(const e of g.enemies)if(!e.boss&&Math.hypot(e.x-x,e.y-y)<r){e.x+=(x-e.x)*.4;e.y+=(y-e.y)*.4;}g.hazards.push({kind:'meteor',x,y,r,damage:80+rank*35,life:1,max:1,id});}g.cd[id]=4*g.haste(id);}
 return true;
}
