import {WEAPONS,PASSIVES,HEROES,byId} from './data.js';
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class Game {
 constructor(save,onEvent=()=>{},snapshot=null){
  this.meta={...save.meta};this.hero=HEROES.find(h=>h.id===save.hero)||HEROES[0];this.region=save.region;this.onEvent=onEvent;
  this.rng=(Date.now()>>>0)||7;this.time=0;this.kills=0;this.gold=0;this.level=1;this.xp=0;this.need=8;this.skills={[this.hero.weapon]:1};this.evolved=[];this.rerolls=3+(this.meta.reroll||0);this.revives=1;this.mode='playing';this.enemies=[];this.bullets=[];this.gems=[];this.effects=[];this.hazards=[];this.pickups=[];this.texts=[];this.choices=[];this.cd={};this.spawnClock=0;this.coinClock=0;this.nextElite=60;this.nextCache=75;this.nextHeal=35;this.nextId=1;this.dashCd=0;this.dashing=0;this.invuln=2;this.lastDir={x:0,y:-1};this.bossSpawned=false;this.bossDefeated=false;this.damageDone={};this.pendingLevels=0;this.evolutionCount=0;this.bankId='run-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
  this.player={x:0,y:0,hp:1};this.player.hp=this.maxHp();
  if(snapshot){Object.assign(this,snapshot);this.onEvent=onEvent;this.mode=this.choices?.length?'levelup':this.player.hp<=0?'down':'paused';this.effects=[];this.texts=[];this.hazards=this.hazards||[];}
 }
 random(){this.rng^=this.rng<<13;this.rng^=this.rng>>>17;this.rng^=this.rng<<5;return (this.rng>>>0)/4294967296;}
 rank(id){return this.skills[id]||0;}
 m(id){return this.meta[id]||0;}
 maxHp(){return 100+this.m('health')*10+this.rank('vitality')*25+(this.hero.id==='warden'?35:0);}
 damage(){return (1+this.m('might')*.05+this.rank('power')*.15)*(this.hero.id==='witch'?1.15:1);}
 area(){return 1+this.m('area')*.05+this.rank('reach')*.15;}
 haste(){return Math.max(.45,1-this.m('haste')*.03-this.rank('haste')*.1);}
 speed(){return 145*(1+this.m('speed')*.04)*(this.hero.id==='ranger'?1.1:1);}
 magnet(){return 85+this.m('magnet')*12+this.rank('magnet')*45;}
 xpBonus(){return 1+this.m('growth')*.05+this.rank('wisdom')*.2+(this.hero.id==='sage'?.2:0);}
 goldBonus(){return (1+this.m('fortune')*.08)*(this.region==='hollow'?1.25:this.region==='cinder'?1.5:1);}
 snapshot(){const o={};for(const k of Object.keys(this)){if(!['onEvent','effects','texts'].includes(k))o[k]=this[k];}return JSON.parse(JSON.stringify(o));}
 emit(type,data={}){this.onEvent(type,data);}
 gainGold(n){this.gold+=n*this.goldBonus();}
 nearest(x=this.player.x,y=this.player.y){let nearest=null,dist=Infinity;for(const e of this.enemies){if(e.hp<=0)continue;const d=(e.x-x)**2+(e.y-y)**2;if(d<dist){dist=d;nearest=e;}}return nearest;}
 hit(e,amount,weapon,knock=0){if(e.hp<=0)return;const crit=this.random()<.05+this.rank('luck')*.1;const dmg=amount*this.damage()*(crit?2:1);e.hp-=dmg;e.flash=.09;this.damageDone[weapon]=(this.damageDone[weapon]||0)+Math.min(dmg,e.hp+dmg);if(knock&&!e.boss){const d=Math.hypot(e.x-this.player.x,e.y-this.player.y)||1;e.x+=(e.x-this.player.x)/d*knock;e.y+=(e.y-this.player.y)/d*knock;}
  if(crit&&this.texts.length<20)this.texts.push({x:e.x,y:e.y-15,text:Math.round(dmg)+'!',life:.6,color:'#ffd57d'});
  if(e.hp<=0){this.kills++;this.gainGold(e.boss?70:e.elite?18:.17);this.gems.push({x:e.x,y:e.y,value:e.boss?80:e.elite?22:e.type==='brute'?4:1,kind:'xp',born:this.time});if(e.elite){this.player.hp=Math.min(this.maxHp(),this.player.hp+15);this.emit('elite');}if(e.boss){this.bossDefeated=true;this.emit('bossdown');}if(this.kills%100===0)this.emit('streak',{kills:this.kills});if(this.random()<.006)this.pickups.push({x:e.x,y:e.y,kind:'heal'});}
 }
 spawn(type='crawler',elite=false,boss=false){const a=this.random()*TAU;const dist=360+this.random()*150;const minute=this.time/60;const h={crawler:13,bat:8,brute:50,shooter:24,charger:30}[type];const baseSpeed={crawler:30,bat:62,brute:22,shooter:25,charger:38}[type];const hp=h*(1+minute*.24)*(elite?8:1)*(boss?30:1)*(this.region==='cinder'?1.25:1);const e={id:this.nextId++,type,x:this.player.x+Math.cos(a)*dist,y:this.player.y+Math.sin(a)*dist,hp,maxHp:hp,r:boss?35:elite?21:type==='brute'?17:10,speed:baseSpeed*(1+minute*.045)*(this.region==='hollow'?1.15:1),elite,boss,slow:0,flash:0,attack:1+this.random()*3,phase:0};this.enemies.push(e);return e;}
 burst(x,y,r,color,life=.4){if(this.effects.length<80)this.effects.push({kind:'ring',x,y,r,color,life,max:life});}
 aoe(x,y,r,dmg,id,knock=0){for(const e of this.enemies)if((e.x-x)**2+(e.y-y)**2<(r+e.r)**2)this.hit(e,dmg,id,knock);}
 fire(id){const rank=this.rank(id),ev=this.evolved.includes(id),p=this.player,area=this.area(),target=this.nearest();if(!target&&id!=='orbit')return;if(target&&Math.hypot(target.x-p.x,target.y-p.y)>410)return;const angle=target?Math.atan2(target.y-p.y,target.x-p.x):0;
  if(id==='bolt'||id==='dagger'){const dagger=id==='dagger';const n=ev?(dagger?8:5):(dagger?3+Math.floor(rank/2):1+Math.floor(rank/2));for(let i=0;i<n;i++){const a=angle+(i-(n-1)/2)*(dagger?.13:.15);this.bullets.push({x:p.x,y:p.y,vx:Math.cos(a)*(dagger?340:295),vy:Math.sin(a)*(dagger?340:295),life:1.9,r:dagger?4:6,damage:(dagger?16:22)*(1+(rank-1)*.28)*(ev?1.6:1),id,pierce:ev?7:1+Math.floor(rank/2),hit:[],color:dagger?'#d9e9c7':'#ffbf68'});}this.cd[id]=(dagger?1.1:.8)*this.haste()*(ev?.65:1);}
  if(id==='chain'){let t=target,seen=[],points=[{x:p.x,y:p.y}];for(let i=0;i<(ev?12:rank+2)&&t;i++){seen.push(t.id);points.push({x:t.x,y:t.y});this.hit(t,30*(1+(rank-1)*.3)*(ev?1.4:1),id);let min=210*area,next=null;for(const e of this.enemies)if(e.hp>0&&!seen.includes(e.id)){let d=Math.hypot(e.x-t.x,e.y-t.y);if(d<min){next=e;min=d;}}t=next;}this.effects.push({kind:'chain',points,color:'#a7ecff',life:.22,max:.22});this.cd[id]=(ev?1:2.2)*this.haste();}
  if(id==='nova'){const r=(105+(rank-1)*16)*(ev?1.7:1)*area;let count=this.enemies.filter(e=>Math.hypot(e.x-p.x,e.y-p.y)<r).length;this.aoe(p.x,p.y,r,38*(1+(rank-1)*.3),id,45);if(ev&&count>=3)p.hp=Math.min(this.maxHp(),p.hp+4);this.burst(p.x,p.y,r,'#d8e6aa');this.cd[id]=(ev?1.9:3)*this.haste();}
  if(id==='frost'){const r=(110+(rank-1)*13)*(ev?1.8:1)*area;for(const e of this.enemies)if(Math.hypot(e.x-p.x,e.y-p.y)<r){e.slow=ev?3.5:1.5+rank*.2;this.hit(e,16+(rank-1)*6,id);}this.burst(p.x,p.y,r,'#91e1e9',.65);this.cd[id]=(ev?2.5:4)*this.haste();}
  if(id==='flame'){const r=(150+(rank-1)*13)*area;for(const e of this.enemies){const a=Math.atan2(e.y-p.y,e.x-p.x);const diff=Math.atan2(Math.sin(a-angle),Math.cos(a-angle));if(Math.hypot(e.x-p.x,e.y-p.y)<r&&(ev||Math.abs(diff)<.7+rank*.05))this.hit(e,36+(rank-1)*12,id);}this.effects.push({kind:'flame',x:p.x,y:p.y,r,angle,full:ev,color:'#ff9765',life:.4,max:.4});if(ev)this.effects.push({kind:'fire',x:p.x,y:p.y,r:80*area,life:2,max:2,tick:0,id});this.cd[id]=(ev?1:1.4)*this.haste();}
  if(id==='meteor'){for(let i=0;i<(ev?3:1);i++){const t=i===0?target:this.enemies[Math.floor(this.random()*this.enemies.length)]||target;if(t)this.hazards.push({x:t.x,y:t.y,r:(65+(rank-1)*9)*area,life:.65,max:.65,kind:'meteor',damage:65+(rank-1)*20,id});}this.cd[id]=(ev?2.2:3.2)*this.haste();}
 }
 dash(input={x:0,y:0}){if(this.mode!=='playing'||this.dashCd>0)return false;const len=Math.hypot(input.x,input.y);if(len>.1)this.lastDir={x:input.x/len,y:input.y/len};this.dashing=.22;this.invuln=.6;this.dashCd=3.6-this.m('dash')*.3;this.emit('dash');return true;}
 offers(){let list=[...WEAPONS,...PASSIVES].filter(s=>{const weapon=WEAPONS.some(w=>w.id===s.id),max=weapon?5:3;const occupied=(weapon?WEAPONS:PASSIVES).filter(w=>this.rank(w.id)>0).length;return this.rank(s.id)<max&&(this.rank(s.id)>0||occupied<4);});let shuffled=list.map(x=>({x,key:this.random()+(this.rank(x.id)>0?.18:0)})).sort((a,b)=>b.key-a.key).map(x=>x.x.id);this.choices=shuffled.slice(0,3);if(!this.choices.length)this.choices=['healreward','goldreward'];return this.choices;}
 choose(id){if(this.mode!=='levelup'||!this.choices.includes(id))return false;if(id==='healreward')this.player.hp=Math.min(this.maxHp(),this.player.hp+40);else if(id==='goldreward')this.gainGold(20);else {this.skills[id]=(this.skills[id]||0)+1;if(id==='vitality')this.player.hp+=25;}this.choices=[];for(const w of WEAPONS){if(this.rank(w.id)>=5&&this.rank(w.pair)>=2&&!this.evolved.includes(w.id)){this.evolved.push(w.id);this.evolutionCount++;this.emit('evolve',{weapon:w});}}this.mode='playing';this.invuln=Math.max(this.invuln,1.2);this.emit('choose',{id});return true;}
 reroll(){if(this.mode!=='levelup'||this.rerolls<=0)return false;this.rerolls--;this.offers();this.emit('levelup');return true;}
 revive(){if(this.mode!=='down'||this.revives<=0)return false;this.revives--;this.player.hp=this.maxHp()*.6;this.invuln=4;for(const e of this.enemies)if(Math.hypot(e.x-this.player.x,e.y-this.player.y)<200){const a=Math.atan2(e.y-this.player.y,e.x-this.player.x);e.x=this.player.x+Math.cos(a)*240;e.y=this.player.y+Math.sin(a)*240;}this.mode='playing';this.emit('revive');return true;}
 end(victory=false){if(this.mode==='ended')return;this.mode='ended';this.emit('end',{victory});}
 step(dt,input={x:0,y:0}){if(this.mode!=='playing')return;dt=clamp(dt,0,.05);this.time+=dt;const p=this.player;
  if(this.time>=600){this.time=600;this.end(true);return;}
  this.invuln=Math.max(0,this.invuln-dt);this.dashCd=Math.max(0,this.dashCd-dt);this.dashing=Math.max(0,this.dashing-dt);
  p.hp=Math.min(this.maxHp(),p.hp+dt*(this.m('regen')*.15+this.rank('regen')*.6));
  let len=Math.hypot(input.x,input.y);if(len>.05){let n=Math.max(1,len);input={x:input.x/n,y:input.y/n};this.lastDir={x:input.x/len*n,y:input.y/len*n};}
  const vx=this.dashing>0?this.lastDir.x*640:input.x*this.speed(),vy=this.dashing>0?this.lastDir.y*640:input.y*this.speed();p.x+=vx*dt;p.y+=vy*dt;
  this.spawnClock-=dt;const minute=this.time/60;if(this.spawnClock<=0&&this.enemies.length<240){let count=2+Math.floor(minute*.7);for(let i=0;i<count;i++){let r=this.random();const type=minute>4&&r<.12?'charger':minute>2&&r<.2?'shooter':minute>1&&r<.34?'brute':r<.53?'bat':'crawler';this.spawn(type);}this.spawnClock=Math.max(.26,.85-minute*.045);}
  if(this.time>=this.nextElite){this.spawn('brute',true);this.nextElite+=60;this.emit('warning',{text:'An ancient one approaches'});}
  if(this.time>=540&&!this.bossSpawned){this.bossSpawned=true;this.spawn('brute',false,true);this.emit('warning',{text:'The Hollow King has awakened'});}
  if(this.time>=this.nextCache){const a=this.random()*TAU;this.pickups.push({x:p.x+Math.cos(a)*240,y:p.y+Math.sin(a)*240,kind:'cache'});this.nextCache+=75;this.emit('cache');}
  if(this.time>=this.nextHeal){const a=this.random()*TAU;this.pickups.push({x:p.x+Math.cos(a)*130,y:p.y+Math.sin(a)*130,kind:this.nextHeal%70===0?'magnet':'heal'});this.nextHeal+=35;}
  this.coinClock+=dt;if(this.coinClock>=5){this.gainGold(2);this.coinClock-=5;}
  for(const e of this.enemies){if(e.hp<=0)continue;e.slow=Math.max(0,e.slow-dt);e.flash=Math.max(0,e.flash-dt);e.attack-=dt;let dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1,spd=e.speed*(e.slow>0?.35:1);
   if(e.type==='shooter'&&d<270){spd=d<190?-spd:0;if(e.attack<=0){this.hazards.push({kind:'shot',x:e.x,y:e.y,vx:dx/d*105,vy:dy/d*105,r:5,life:6});e.attack=4;}}
   if(e.type==='charger'){if(e.attack<.7&&e.attack>0){spd=0;e.phase=1;e.ax=dx/d;e.ay=dy/d;}else if(e.attack<=0&&e.attack>-.55){e.phase=2;e.x+=e.ax*260*dt;e.y+=e.ay*260*dt;spd=0;}else if(e.attack<=-.55){e.attack=3.5;e.phase=0;}}
   if(e.boss&&e.attack<=0){for(let a=0;a<TAU;a+=TAU/12)this.hazards.push({kind:'shot',x:e.x,y:e.y,vx:Math.cos(a+this.time*.2)*90,vy:Math.sin(a+this.time*.2)*90,r:6,life:7});e.attack=3;this.burst(e.x,e.y,80,'#ed787e');}
   e.x+=dx/d*spd*dt;e.y+=dy/d*spd*dt;
   if(d>950&&!e.boss&&!e.elite){const a=this.random()*TAU;e.x=p.x+Math.cos(a)*600;e.y=p.y+Math.sin(a)*600;}
   if(d<e.r+11&&this.invuln<=0){const damage=Math.max(2,(e.boss?24:e.elite?18:e.type==='brute'?14:8)+minute*.7-this.m('armor')-(this.hero.id==='warden'?1:0));p.hp-=damage;this.invuln=.7;this.emit('hurt');this.burst(p.x,p.y,26,'#fa8989',.2);}
  }
  for(const id of Object.keys(this.skills)){if(!WEAPONS.some(w=>w.id===id)||id==='orbit')continue;this.cd[id]=(this.cd[id]||0)-dt;if(this.cd[id]<=0)this.fire(id);}
  if(this.rank('orbit')){const rank=this.rank('orbit'),ev=this.evolved.includes('orbit'),count=ev?7:rank+1,r=(65+rank*5)*this.area();this.cd.orbit=(this.cd.orbit||0)-dt;if(this.cd.orbit<=0){for(let i=0;i<count;i++){const a=this.time*2.1+i*TAU/count,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r;this.aoe(x,y,20,18+(rank-1)*7,'orbit',5);}this.cd.orbit=.18;}}
  for(const b of this.bullets){b.life-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;for(const e of this.enemies){if(e.hp<=0||b.hit.includes(e.id)||b.pierce<=0)continue;if((e.x-b.x)**2+(e.y-b.y)**2<(e.r+b.r+3)**2){b.hit.push(e.id);b.pierce--;this.hit(e,b.damage,b.id);}}}
  this.bullets=this.bullets.filter(b=>b.life>0&&b.pierce>0);
  for(const h of this.hazards){h.life-=dt;if(h.kind==='shot'){h.x+=h.vx*dt;h.y+=h.vy*dt;if(Math.hypot(h.x-p.x,h.y-p.y)<h.r+10&&this.invuln<=0){p.hp-=Math.max(3,12-this.m('armor'));this.invuln=.6;h.life=0;this.emit('hurt');}}else if(h.life<=0){this.aoe(h.x,h.y,h.r,h.damage,h.id,20);this.burst(h.x,h.y,h.r,'#ecb3e5',.5);}}
  this.hazards=this.hazards.filter(h=>h.life>0);
  for(const fx of this.effects){fx.life-=dt;if(fx.kind==='fire'){fx.tick-=dt;if(fx.tick<=0){this.aoe(fx.x,fx.y,fx.r,15,'flame');fx.tick=.5;}}}this.effects=this.effects.filter(f=>f.life>0);
  for(const t of this.texts){t.life-=dt;t.y-=dt*20;}this.texts=this.texts.filter(t=>t.life>0);
  this.enemies=this.enemies.filter(e=>e.hp>0);
  for(const gem of this.gems){let dx=p.x-gem.x,dy=p.y-gem.y,d=Math.hypot(dx,dy);if(d<this.magnet()||gem.pull||this.time-(gem.born??this.time)>26){gem.pull=true;gem.x+=dx/(d||1)*Math.min(d,dt*460);gem.y+=dy/(d||1)*Math.min(d,dt*460);if(d<18){this.xp+=gem.value*this.xpBonus();gem.value=0;}}}
  this.gems=this.gems.filter(g=>g.value>0);if(this.gems.length>450){let merged=this.gems.splice(0,150);let total=merged.reduce((s,g)=>s+g.value,0);this.gems.push({x:merged[75].x,y:merged[75].y,value:total,kind:'xp'});}
  for(const pick of this.pickups){if(Math.hypot(pick.x-p.x,pick.y-p.y)<30){pick.taken=true;if(pick.kind==='heal'){p.hp=Math.min(this.maxHp(),p.hp+30);this.emit('heal');}else if(pick.kind==='magnet'){this.gems.forEach(g=>g.pull=true);this.emit('magnet');}else {this.gainGold(25);this.xp+=this.need*.65;this.emit('treasure');}}}
  this.pickups=this.pickups.filter(pick=>!pick.taken).slice(-30);
  if(p.hp<=0){p.hp=0;this.mode='down';this.emit('down');return;}
  if(this.xp>=this.need){this.xp-=this.need;this.level++;this.need=Math.floor(10+this.level*3.4+this.level*this.level*.13);this.offers();this.mode='levelup';this.emit('levelup');}
 }
}
