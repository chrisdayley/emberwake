import {CHALLENGE_ENEMIES} from './challenge.js?v=20';
import {SPECIAL_STAGES} from './chronicle.js?v=20';
// Every region owns its roster, guardian schedule, silhouettes and combat roles.
const creature=(name,hp,speed,r,damage,xp,minute,behavior,extra={})=>({name,hp,speed,r,damage,xp,minute,behavior,...extra});
const hollow={
 veilmask:creature('Veil masks',19,50,10,12,1,0,'blink'),
 spiriteel:creature('Spirit eels',13,86,10,12,1,0,'weave'),
 glassspider:creature('Glass spiders',68,43,16,20,4,1,'pounce'),
 soullantern:creature('Soul lanterns',40,38,12,14,2,2,'soulshot',{ranged:true}),
 tombwalker:creature('Tomb walkers',145,33,21,25,5,3,'march',{armor:.28,knock:.2}),
 phantomstag:creature('Phantom stags',105,70,16,24,4,4,'blink'),
 bellwraith:creature('Bell wraiths',290,35,20,30,6,6,'bell',{ranged:true}),
 riftwatcher:creature('Rift watchers',320,46,20,32,7,8,'rift',{ranged:true}),
 widowqueen:creature('The Glass Widow',80,43,35,34,80,Infinity,'widow',{guardian:true}),
 holloworgan:creature('The Mourning Organ',110,31,38,34,80,Infinity,'organ',{guardian:true}),
 antlerking:creature('The Pale Monarch',150,55,36,34,80,Infinity,'monarch',{guardian:true}),
 riftmatriarch:creature('Rift Matriarch',850,52,40,65,80,Infinity,'overlord',{guardian:true})
};
const cinder={
 slagslug:creature('Slag slugs',21,43,12,13,1,0,'slag'),
 embermoth:creature('Ember moths',12,88,11,12,1,0,'orbit'),
 obsidiancrab:creature('Obsidian crabs',80,33,18,22,4,1,'crab',{armor:.25,knock:.3}),
 furnacebeetle:creature('Furnace beetles',45,37,13,15,2,2,'mortar',{ranged:true}),
 lavaram:creature('Lava rams',150,43,20,26,5,3,'ram',{knock:.3}),
 magmaworm:creature('Magma worms',130,48,16,25,4,4,'burrow'),
 pyrewheel:creature('Pyre wheels',275,63,19,31,6,6,'roll',{knock:.2}),
 forgeguard:creature('Forge guards',420,29,24,36,8,8,'hammer',{ranged:true,armor:.18,knock:0}),
 cratertortoise:creature('Mount Cinder',90,28,40,36,80,Infinity,'volcano',{guardian:true}),
 slagwyrm:creature('The Slag Wyrm',120,44,38,36,80,Infinity,'wyrm',{guardian:true}),
 ironarchon:creature('The Iron Archon',170,32,40,38,80,Infinity,'archon',{guardian:true}),
 ashenphoenix:creature('The Ashen Phoenix',850,52,40,65,80,Infinity,'overlord',{guardian:true})
};
export const REGIONAL_ENEMIES=Object.fromEntries(Object.entries({hollow,cinder}).flatMap(([region,rows])=>Object.entries(rows).map(([id,s],index)=>[id,{...s,region,art:index,height:[40,40,49,46,66,60,67,65,122,130,136,155][index]}])));
Object.assign(REGIONAL_ENEMIES,CHALLENGE_ENEMIES);
export const ROSTERS=Object.fromEntries(['hollow','cinder',...SPECIAL_STAGES.map(s=>s.id)].map(region=>[region,Object.keys(REGIONAL_ENEMIES).filter(id=>REGIONAL_ENEMIES[id].region===region&&!REGIONAL_ENEMIES[id].guardian)]));
export const GUARDIANS={hollow:['widowqueen','holloworgan','antlerking','riftmatriarch'],cinder:['cratertortoise','slagwyrm','ironarchon','ashenphoenix']};
for(const s of SPECIAL_STAGES)GUARDIANS[s.id]=[s.id+'_4',s.id+'_5',s.id+'_4',s.id+'_5'];
export const regionalGuardian=(region,time,late=false)=>GUARDIANS[region]?.[late?3:Math.max(0,Math.min(2,Math.floor(time/180)-1))];
const legacy=['crawler','bat','brute','shooter','ironhide','charger','reaver','revenant','juggernaut','leech','champion','bulwark','stalker','siege','harbinger'];
export function regionalType(region,type,boss=false,time=0,late=false){
 if(!ROSTERS[region])return type;
 if(boss)return REGIONAL_ENEMIES[type]?.guardian?type:regionalGuardian(region,time,late);
 if(REGIONAL_ENEMIES[type]?.region===region)return type;
 const slots=[0,1,2,3,4,5,5,5,6,5,7,4,5,7,7];
 return ROSTERS[region][Math.min(ROSTERS[region].length-1,slots[Math.max(0,legacy.indexOf(type))])];
}
export function regionalPool(region,minute){return (ROSTERS[region]||[]).filter(id=>REGIONAL_ENEMIES[id].minute<=minute).map((id,i)=>[id,(REGIONAL_ENEMIES[id].ranged?.7:i>=4?3:2)*Math.min(1,.2+Math.max(0,minute-REGIONAL_ENEMIES[id].minute)*.8)]);}
