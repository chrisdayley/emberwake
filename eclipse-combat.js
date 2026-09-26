// A rotating moveset demands different responses; all threats retain red tells.
const TAU=Math.PI*2;
const labels={volley:'SOUL DARTS · CHANGE DIRECTION',charge:'REAPING RUSH · DODGE SIDEWAYS',ring:'SHADOW WHEEL · THREAD THE GAP',ground:'PURSUIT · LEAVE THE MARKS'};
function aim(g,e,kind){const speed=kind==='charge'?610:340,lead=Math.min(1.4,.4+Math.hypot(g.player.x-e.x,g.player.y-e.y)/speed);return Math.atan2(g.player.y+(e.targetVy||0)*lead-e.y,g.player.x+(e.targetVx||0)*lead-e.x);}
function shot(g,e,a,speed,damage){if(g.hazards.filter(h=>h.eclipse&&h.kind==='shot'&&h.life>0).length>=36)return;g.hazards.push({kind:'shot',eclipse:true,x:e.x,y:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:7,life:3.2,damage});}
export function stepEclipse(g,e,dt){const fury=e.hp<e.maxHp*.5,p=g.player;
 // Estimate actual movement, so stopping or reversing defeats its predictive aim.
 if(e.targetX!==undefined&&dt>0){e.targetVx=Math.max(-g.speed(),Math.min(g.speed(),(p.x-e.targetX)/dt));e.targetVy=Math.max(-g.speed(),Math.min(g.speed(),(p.y-e.targetY)/dt));}e.targetX=p.x;e.targetY=p.y;
 let a=e.eclipseAction;
 if(!a&&e.attack<=0){const kind=['volley','charge','ring','ground'][(e.eclipseCycle||0)%4];e.eclipseCycle=(e.eclipseCycle||0)+1;const angle=aim(g,e,kind);a=e.eclipseAction={kind,phase:'tell',timer:kind==='charge'?1:.85,angle,burst:0};}
 if(a){e.attackLabel=labels[a.kind];e.attackUntil=g.time+2;
  // Track early in the tell, then visibly lock for 0.4 seconds before release.
  if(a.phase==='tell'&&a.timer>.4&&(a.kind==='charge'||a.kind==='volley'))a.angle=aim(g,e,a.kind);
  a.locked=a.timer<=.4;a.timer-=dt;
  if(a.phase==='tell'&&a.timer<=0){
   if(a.kind==='charge'){a.phase='rush';a.timer=.58;}
   else if(a.kind==='volley'){const count=fury?7:5;for(let j=0;j<count;j++)shot(g,e,a.angle+(j-(count-1)/2)*.14,fury?390:340,fury?210:165);a.burst++;if(a.burst<2){a.angle=aim(g,e,'volley');a.timer=.75;}else finish(e,fury);}
   else if(a.kind==='ring'){const count=fury?20:16;for(let j=2;j<count-1;j++)shot(g,e,a.angle+j*TAU/count,fury?235:205,fury?190:145);finish(e,fury);}
   else {for(let j=0;j<(fury?5:3);j++)if(g.hazards.filter(h=>h.kind==='eruption').length<28)g.hazards.push({kind:'eruption',eclipse:true,x:p.x+g.lastDir.x*j*95,y:p.y+g.lastDir.y*j*95,r:52,life:1.25+j*.2,max:1.25+j*.2,damage:fury?340:280});finish(e,fury);}
  }
  if(a.phase==='rush'){const speed=(fury?700:610)*(e.slow>0?.7:1);e.x+=Math.cos(a.angle)*speed*dt;e.y+=Math.sin(a.angle)*speed*dt;if(a.timer<=0)finish(e,fury);return 0;}
  return 0; // Movement stays readable during windup; the aim locks before firing.
 }
 e.attackLabel=e.slow>0?'CHILLED · KEEP DEALING DAMAGE':fury?'ENRAGED · WATCH ITS NEXT MOVE':'RELENTLESS · KEEP YOUR DASH READY';e.attackUntil=g.time+2;return(fury?195:165)*(e.slow>0?.55:1);
}
function finish(e,fury){e.eclipseAction=null;e.attack=fury?.9:1.4;}
export function drawEclipseTell(c,e){const a=e.eclipseAction;if(!a||a.kind==='ground')return;c.save();c.translate(e.x,e.y);c.rotate(a.angle);c.strokeStyle='#ff354d';c.fillStyle='#ff354d22';c.lineWidth=a.locked?4:2;c.setLineDash(a.locked?[]:[10,7]);
 if(a.kind==='charge'){const length=(e.hp<e.maxHp*.5?700:610)*.58*(e.slow>0?.7:1);c.fillRect(0,-44,length,88);c.strokeRect(0,-44,length,88);c.beginPath();c.moveTo(length-25,-16);c.lineTo(length,0);c.lineTo(length-25,16);c.stroke();}
 else if(a.kind==='volley'){for(const angle of [-.28,0,.28]){c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(angle)*330,Math.sin(angle)*330);c.stroke();}c.beginPath();c.arc(0,0,40,0,TAU);c.stroke();}
 else{const count=e.hp<e.maxHp*.5?20:16;c.beginPath();c.arc(0,0,75,TAU*2/count,TAU*(count-2)/count);c.stroke();}c.restore();}
