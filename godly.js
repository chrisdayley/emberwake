// Godly powers belong to equipment, so they survive weapon unions and loadout changes.
export const GODLY={
 bolt:{name:'Heavenpiercer',desc:'Hits unleash a 650-range piercing star arrow for 600 base damage. Once every 5s.'},
 orbit:{name:'Lunar riposte',desc:'Halve an incoming hit and retaliate in a 240-radius circle for 600 base damage. Once every 8s.'},
 chain:{name:'Storm sovereign',desc:'Every sixth hit calls lightning into up to 8 nearby enemies for 350 base damage each. At least 4s between storms.'},
 nova:{name:'Worldbreaker',desc:'When hit, gain a shield equal to 40% of maximum health and slam a 260-radius area for 700 base damage. Once every 12s.'},
 frost:{name:'Absolute winter',desc:'Every 10s, freeze nearby enemies for 4s and deal 350 base damage. Boss freezes last 1.6s and respect thaw protection.'},
 flame:{name:'Dragonwake',desc:'Hits ignite three overlapping dragonfire pools for 4s, dealing 180 base damage every 0.5s. Once every 8s.'},
 dagger:{name:'Ghoststep',desc:'Dashing grants 3s of guaranteed critical hits and instantly halves the dash recharge. Once every 8s.'},
 meteor:{name:'Astral bombardment',desc:'Hits call three orbital impacts, each dealing 650 base damage in a 120-radius blast. Once every 8s.'},
 spear:{name:'Sovereign slayer',desc:'All attacks deal 80% more damage to bosses and treasure guardians.'},
 scythe:{name:'Final harvest',desc:'Hits execute ordinary enemies below 25% health. Deal 60% more damage to bosses below half health.'},
 mine:{name:'Siege runner',desc:'Dashing lays five holy mines ahead of you, each dealing 500 base damage in a 100-radius blast. Once every 6s.'},
 venom:{name:'Thousand-year blight',desc:'Hits infect up to 16 enemies for 4s. Poison stacks 5 times, dealing 90 base damage per stack each second.'},
 beam:{name:'Prismatic overload',desc:'Every twelfth hit grants 4s of double damage from all attacks. At least 10s between overloads.'},
 wisp:{name:'Spirit court',desc:'Three permanent spirits each fire a homing soul bolt for 240 base damage every 2s. Uses no spell slot.'},
 axe:{name:'Endless conquest',desc:'Every twelfth kill grants 5s of 70% more damage. At least 8s between frenzies.'},
 tide:{name:'Ocean dominion',desc:'Dashing releases a 420-radius tidal wave for 600 base damage and clears nearby hostile projectiles. Once every 8s.'}
};
export const godlyPower=g=>g.gear?.tier===6?g.gear.family:null;
export const godlyState=()=>({readyAt:0,activeUntil:0,hits:0,kills:0,poisons:[],fires:[]});
const potency=g=>1+(g.gear?.level||0)*.08;
const ready=(g,seconds)=>{if(g.time<g.divine.readyAt)return false;g.divine.readyAt=g.time+seconds;return true;};
const close=(g,r=650)=>g.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-g.player.x,e.y-g.player.y)<r).sort((a,b)=>Math.hypot(a.x-g.player.x,a.y-g.player.y)-Math.hypot(b.x-g.player.x,b.y-g.player.y));
const strike=(g,e,n)=>g.hit(e,n*potency(g),'godly');
const pulse=(g,r,n,color)=>{g.aoe(g.player.x,g.player.y,r,n*potency(g),'godly',45);g.burst(g.player.x,g.player.y,r,color,.65);};
function light(g,x,y,color){g.burst(x,y,38,color,.5);}
export function godlyCrit(g){return godlyPower(g)==='dagger'&&g.time<g.divine.activeUntil;}
export function godlyMultiplier(g,e){const id=godlyPower(g);if(id==='spear'&&e.boss)return 1.8;if(id==='scythe'&&e.boss&&e.hp<=e.maxHp*.5)return 1.6;if(g.time<g.divine.activeUntil)return id==='beam'?2:id==='axe'?1.7:1;return 1;}
export function godlyGuard(g,amount){const id=godlyPower(g);if(id==='orbit'&&ready(g,8)){pulse(g,240,600,'#d1c7ff');return amount*.5;}if(id==='nova'&&ready(g,12)){g.shield=Math.max(g.shield,g.maxHp()*.4);pulse(g,260,700,'#fff0b3');}return amount;}
export function godlyDash(g){const id=godlyPower(g),p=g.player;
 if(id==='dagger'&&ready(g,8)){g.divine.activeUntil=g.time+3;g.dashCd*=.5;light(g,p.x,p.y,'#d6ffe7');}
 if(id==='mine'&&ready(g,6)){for(let j=0;j<5;j++)g.hazards.push({kind:'mine',id:'godly',x:p.x+g.lastDir.x*j*58,y:p.y+g.lastDir.y*j*58,r:100,trigger:65,arm:.5,life:8,damage:500*potency(g)});}
 if(id==='tide'&&ready(g,8)){g.hazards=g.hazards.filter(h=>h.kind!=='shot'||Math.hypot(h.x-p.x,h.y-p.y)>420);g.hazards.push({kind:'wave',id:'godly',x:p.x,y:p.y,r:420,life:1,max:1,damage:600*potency(g),hit:[]});g.burst(p.x,p.y,420,'#8ce6f0',1);}
}
export function godlyHit(g,e,killed){const id=godlyPower(g),s=g.divine,p=g.player;if(!id)return;
 // Effects call hit with the reserved godly source; engine never re-enters this hook.
 if(id==='bolt'&&ready(g,5)){const a=Math.atan2(e.y-p.y,e.x-p.x);for(const t of close(g,700)){const dx=t.x-p.x,dy=t.y-p.y,along=dx*Math.cos(a)+dy*Math.sin(a);if(along>=0&&along<650&&Math.abs(-dx*Math.sin(a)+dy*Math.cos(a))<t.r+28)strike(g,t,600);}if(g.effects.length<80)g.effects.push({kind:'beam',x:p.x,y:p.y,angle:a,r:650,width:28,color:'#fff2bd',life:.5,max:.5});}
 if(id==='chain'){s.hits=Math.min(6,s.hits+1);if(s.hits>=6&&ready(g,4)){s.hits=0;const targets=close(g).slice(0,8);for(const t of targets)strike(g,t,350);if(g.effects.length<80)g.effects.push({kind:'chain',points:[{x:p.x,y:p.y},...targets.map(t=>({x:t.x,y:t.y}))],color:'#aeebff',life:.5,max:.5});}}
 if(id==='flame'&&ready(g,8)){s.fires=[-65,0,65].map(dx=>({x:e.x+dx,y:e.y,r:95,until:g.time+4,next:g.time}));}
 if(id==='meteor'&&ready(g,8)){for(let j=0;j<3;j++)g.hazards.push({kind:'meteor',id:'godly',x:e.x+(j-1)*70,y:e.y,r:120,life:.65+j*.3,max:.65+j*.3,damage:650*potency(g)});}
 if(id==='venom'&&!killed){let mark=s.poisons.find(m=>m.enemyId===e.id);if(!mark){mark={enemyId:e.id,stacks:0,until:g.time+4,next:g.time+1};s.poisons.push(mark);s.poisons=s.poisons.slice(-16);}mark.stacks=Math.min(5,mark.stacks+1);mark.until=g.time+4;light(g,e.x,e.y,'#a5efac');}
 if(id==='beam'){s.hits=Math.min(12,s.hits+1);if(s.hits>=12&&ready(g,10)){s.hits=0;s.activeUntil=g.time+4;g.burst(p.x,p.y,150,'#b9f8ff',.6);}}
}
export function godlyKill(g){if(godlyPower(g)!=='axe')return;const s=g.divine;s.kills=Math.min(12,s.kills+1);if(s.kills>=12&&ready(g,8)){s.kills=0;s.activeUntil=g.time+5;g.burst(g.player.x,g.player.y,180,'#ffcf86',.65);}}
export function stepGodly(g){const id=godlyPower(g),s=g.divine;if(!id)return;
 if(id==='frost'&&close(g,320).length&&ready(g,10)){for(const e of close(g,320)){g.chill(e,4,2.91);if(!e.reaper&&g.time>=(e.freezeReadyAt||0)){e.frozenUntil=g.time+(e.boss?1.6:4);e.freezeReadyAt=e.frozenUntil+.65;}strike(g,e,350);}g.burst(g.player.x,g.player.y,320,'#c3faff',.8);}
 if(id==='wisp'&&close(g).length&&ready(g,2)){const targets=close(g).slice(0,3);for(let j=0;j<3;j++){const a=g.time+j*Math.PI*2/3,x=g.player.x+Math.cos(a)*55,y=g.player.y+Math.sin(a)*55,t=targets[j%targets.length],angle=Math.atan2(t.y-y,t.x-x);g.bullets.push({x,y,vx:Math.cos(angle)*260,vy:Math.sin(angle)*260,life:3,r:7,damage:240*potency(g),id:'godly',spirit:true,pierce:2,hit:[],color:'#c5ffee'});}}
 for(const f of s.fires)if(g.time<=f.until&&g.time>=f.next){f.next=g.time+.5;g.aoe(f.x,f.y,f.r,180*potency(g),'godly');}s.fires=s.fires.filter(f=>g.time<f.until);
 for(const m of s.poisons){const e=g.enemies.find(e=>e.id===m.enemyId&&e.hp>0);if(e&&g.time<=m.until&&g.time>=m.next){m.next=g.time+1;strike(g,e,90*m.stacks);}}s.poisons=s.poisons.filter(m=>g.time<m.until&&g.enemies.some(e=>e.id===m.enemyId&&e.hp>0));
}
export function validGodly(r){const s=r.divine;if(s===undefined)return true;const n=v=>Number.isFinite(v)&&v>=0&&v<=1e9;return !!s&&['readyAt','activeUntil','hits','kills'].every(k=>n(s[k]))&&s.hits<=12&&s.kills<=12&&Array.isArray(s.poisons)&&s.poisons.length<=16&&s.poisons.every(m=>m&&Number.isSafeInteger(m.enemyId)&&m.enemyId>0&&Number.isInteger(m.stacks)&&m.stacks>=1&&m.stacks<=5&&n(m.until)&&n(m.next))&&Array.isArray(s.fires)&&s.fires.length<=3&&s.fires.every(f=>f&&Number.isFinite(f.x)&&Number.isFinite(f.y)&&n(f.r)&&f.r<=95&&n(f.until)&&n(f.next));}
export function drawGodly(c,g,fx){const id=godlyPower(g);if(!id)return;c.save();c.globalAlpha=fx;c.strokeStyle='#fff0ba';c.lineWidth=2;
 if(id==='wisp'){for(let j=0;j<3;j++){const a=g.time+j*Math.PI*2/3,x=g.player.x+Math.cos(a)*55,y=g.player.y+Math.sin(a)*55;c.fillStyle='#c5ffee';c.beginPath();c.moveTo(x,y-11);c.quadraticCurveTo(x+15,y+4,x+5,y+11);c.lineTo(x,y+7);c.lineTo(x-5,y+11);c.quadraticCurveTo(x-15,y+4,x,y-11);c.fill();}}
 if(g.time<g.divine.activeUntil){c.save();c.translate(g.player.x,g.player.y);c.rotate(g.time);c.strokeStyle=id==='axe'?'#ffcf86':id==='dagger'?'#d6ffe7':'#b9f8ff';for(let j=0;j<6;j++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(25,-8);c.lineTo(42,0);c.lineTo(25,8);c.stroke();}c.restore();}
 for(const f of g.divine.fires){c.fillStyle='#ffd085';c.strokeStyle='#ffdc94';c.globalAlpha=fx*.22;c.beginPath();c.arc(f.x,f.y,f.r,0,Math.PI*2);c.fill();c.globalAlpha=fx*.7;c.stroke();for(let j=0;j<5;j++){const a=j*Math.PI*2/5+g.time;c.beginPath();c.moveTo(f.x+Math.cos(a)*f.r*.5,f.y+Math.sin(a)*f.r*.5);c.lineTo(f.x+Math.cos(a+.15)*f.r*.85,f.y+Math.sin(a+.15)*f.r*.85);c.stroke();}}
 c.restore();}
