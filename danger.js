// Hostile colors are chosen here, never from old region-specific saved colors.
export const DANGER_RED='#ff354d';
export function drawDanger(c,hazards,now){c.save();c.globalAlpha=1;for(const h of hazards){if(h.kind==='shot'){c.fillStyle=DANGER_RED;c.beginPath();c.arc(h.x,h.y,h.r+2,0,Math.PI*2);c.fill();c.fillStyle='#fff1ec';c.beginPath();c.arc(h.x,h.y,h.r/2,0,Math.PI*2);c.fill();}else if(h.kind==='eruption'){
 c.beginPath();c.arc(h.x,h.y,h.r,0,Math.PI*2);c.fillStyle=DANGER_RED;c.globalAlpha=.17+Math.sin(now*10)*.035;c.fill();c.globalAlpha=1;c.strokeStyle='#23070e';c.lineWidth=6;c.stroke();c.strokeStyle=DANGER_RED;c.lineWidth=3;c.stroke();
 c.beginPath();c.arc(h.x,h.y,h.r*Math.max(0,Math.min(1,1-h.life/h.max)),0,Math.PI*2);c.lineWidth=2;c.stroke();c.fillStyle='#fff0ed';c.strokeStyle='#650a1c';c.lineWidth=4;c.font='bold 20px sans-serif';c.textAlign='center';c.strokeText('!',h.x,h.y+7);c.fillText('!',h.x,h.y+7);
 }}c.restore();}
