import {FAMILIES,TIERS} from './gear.js?v=14';
// The same silhouettes power inventory art, character previews, and held weapons.
export function drawGear(c,item,x,y,size=70,angle=-.25,time=0){if(!item)return;const f=FAMILIES.find(f=>f.id===item.family),tier=item.tier,color=TIERS[tier].color;c.save();c.translate(x,y);c.rotate(angle);c.scale(size/90,size/90);c.lineJoin='round';c.lineCap='round';const metal=c.createLinearGradient(-16,0,16,0);metal.addColorStop(0,'#526976');metal.addColorStop(.43,tier>=3?'#fcf0dd':'#e0e7dc');metal.addColorStop(.6,color);metal.addColorStop(1,'#496675');c.strokeStyle='#111e27';c.lineWidth=3;c.fillStyle=metal;
 const line=(x1,y1,x2,y2,color,width)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
 const poly=points=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();c.stroke();};
 if(tier>=3){c.shadowColor=color;c.shadowBlur=7+tier*2;}line(0,34,0,-27,'#17262b',9);line(0,34,0,-27,tier>=4?'#9f8146':'#705948',5);
 c.strokeStyle='#182c36';c.lineWidth=2.5;c.fillStyle=metal;
 switch(f.shape){
 case 'bow': c.beginPath();c.moveTo(0,-38);c.bezierCurveTo(34,-26,34,21,0,36);c.lineTo(5,24);c.bezierCurveTo(21,8,21,-10,5,-26);c.closePath();c.fill();c.stroke();line(0,-37,0,36,color,1);line(-10,0,33,0,'#e0c89f',2);c.fillStyle=metal;poly([[33,0],[25,-4],[25,4]]);break;
 case 'sword': if(f.id==='flame'){poly([[-5,14],[-5,-23],[3,-39],[17,-45],[9,-29],[7,4],[0,17]]);line(6,-26,2,8,'#ef9663',1.5);}else poly([[-6,12],[-7,-28],[0,-43],[7,-28],[6,12],[0,17]]);line(-14,13,14,13,color,5);line(0,-29,0,10,'#fbf5d4',1.5);break;
 case 'daggers': for(const sign of [-1,1]){c.save();c.translate(sign*12,0);c.rotate(sign*.18);poly([[-4,15],[-5,-22],[0,-38],[5,-22],[4,15]]);line(-9,15,9,15,color,3);line(0,15,0,32,'#9d7b56',5);c.restore();}break;
 case 'spear':case 'trident':poly([[-9,-20],[0,-44],[9,-20],[0,-26]]);if(f.shape==='trident'){line(-16,-39,-13,-13,color,4);line(16,-39,13,-13,color,4);line(-13,-13,13,-13,color,4);}break;
 case 'axe':poly([[-4,-30],[-20,-40],[-29,-17],[-10,-14],[-3,-20],[3,-20],[10,-14],[29,-17],[20,-40],[4,-30]]);break;
 case 'hammer':poly([[-27,-36],[24,-36],[29,-28],[25,-12],[-27,-12],[-31,-22]]);line(-18,-32,-18,-17,color,3);line(17,-32,17,-17,color,3);break;
 case 'scythe':case 'sickle':c.beginPath();c.moveTo(-4,-30);c.bezierCurveTo(12,-48,42,-28,35,0);c.bezierCurveTo(29,-21,14,-28,0,-19);c.closePath();c.fill();c.stroke();if(f.shape==='sickle')line(0,4,0,30,'#c2a775',8);break;
 case 'crossbow':poly([[-29,-14],[-18,-25],[0,-17],[18,-25],[29,-14],[0,-5]]);line(-28,-14,28,-14,color,1);line(0,6,0,-40,'#e3deb7',3);break;
 case 'lantern':line(-13,-34,13,-34,color,3);line(-13,-34,-16,-5,color,3);line(13,-34,16,-5,color,3);poly([[-16,-5],[16,-5],[10,3],[-10,3]]);c.fillStyle=f.color;c.beginPath();c.ellipse(0,-18,8,13,0,0,Math.PI*2);c.fill();break;
 case 'orb':c.fillStyle=metal;c.beginPath();c.arc(0,-21,21,0,Math.PI*2);c.fill();c.stroke();c.fillStyle=f.color;c.beginPath();c.arc(0,-21,14,0,Math.PI*2);c.fill();line(-15,-9,15,-33,'#ffffffa0',2);break;
 case 'staff':case 'scepter':case 'wand':poly([[0,-43],[-13,-24],[0,-10],[13,-24]]);c.fillStyle=f.color;poly([[0,-37],[-7,-24],[0,-16],[7,-24]]);if(f.shape==='staff'){line(-15,-19,-20,-34,color,4);line(15,-19,20,-34,color,4);}if(f.shape==='scepter'){line(-16,-14,16,-14,color,5);}break;
 }
 c.shadowBlur=0;for(let i=0;i<Math.floor(item.level/3);i++)line(-4,18+i*3,4,18+i*3,'#ffe3a4',1);line(-5,25,5,25,tier>=1?color:'#b7a078',2);line(-5,31,5,31,tier>=1?color:'#b7a078',2);
 if(tier>=1){c.fillStyle=color;c.beginPath();c.arc(0,15,3.5,0,Math.PI*2);c.fill();}
 if(tier>=2){c.strokeStyle=color;c.lineWidth=1.5;for(let i=0;i<tier-1;i++){const y=-8-i*5;c.beginPath();c.moveTo(-2,y-2);c.lineTo(2,y);c.lineTo(-2,y+2);c.stroke();}}
 if(tier>=4){c.fillStyle=color;poly([[-4,8],[-18,0],[-14,13],[-5,16]]);poly([[4,8],[18,0],[14,13],[5,16]]);}
 if(tier>=5){c.strokeStyle=color;c.globalAlpha=.65;c.lineWidth=1;for(let i=0;i<tier-3;i++){const a=time*.8+i*Math.PI*2/(tier-3),px=Math.cos(a)*25,py=-18+Math.sin(a)*25;c.beginPath();c.moveTo(px,py-3);c.lineTo(px+3,py);c.lineTo(px,py+3);c.lineTo(px-3,py);c.closePath();c.stroke();}c.globalAlpha=1;}
 if(tier===6){c.strokeStyle=color;c.lineWidth=1;c.globalAlpha=.5;c.beginPath();c.ellipse(0,-22,28,33,0,0,Math.PI*2);c.stroke();c.globalAlpha=1;}
 c.restore();}
const icons=new Map();
export function gearIcon(item){if(!item)return '';const key=item.id+':'+item.level;if(icons.has(key))return icons.get(key);const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d');drawGear(c,item,64,67,111,.35,1);const url=canvas.toDataURL();icons.set(key,url);return url;}
