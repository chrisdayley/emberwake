import {WEAPONS,HEROES} from './data.js?v=11';
export const TIERS=[
 {name:'Common',color:'#bcc8c6',prefix:'Wayfarer'},
 {name:'Uncommon',color:'#8cdb9b',prefix:'Verdant'},
 {name:'Rare',color:'#79bdff',prefix:'Runebound'},
 {name:'Epic',color:'#c79bff',prefix:'Astral'},
 {name:'Legendary',color:'#ffc870',prefix:'Dawnforged'},
 {name:'Mythic',color:'#ff879d',prefix:'Eclipse'},
 {name:'Godly',color:'#fff1b7',prefix:'Empyrean'}
];
export const FAMILIES=[
 ['bolt','bow','Longbow','damage',.08,'health',18,'crit',.04,'ward',14],
 ['orbit','sword','Moonblade','armor',1,'health',20,'area',.08,'thorns',18],
 ['chain','staff','Storm staff','haste',.04,'speed',.04,'crit',.05,'critDamage',.4],
 ['nova','hammer','Hollow maul','health',25,'armor',1,'knock',.25,'ward',18],
 ['frost','scepter','Frost scepter','area',.08,'regen',.18,'armor',1,'ward',14],
 ['flame','sword','Dragon sabre','damage',.08,'health',18,'crit',.05,'leech',.006],
 ['dagger','daggers','Ghost daggers','crit',.05,'speed',.04,'damage',.1,'critDamage',.5],
 ['meteor','orb','Star orb','area',.08,'health',20,'haste',.05,'ward',14],
 ['spear','spear','Dawn spear','damage',.08,'armor',1,'knock',.3,'critDamage',.4],
 ['scythe','scythe','Reaping scythe','crit',.05,'regen',.18,'damage',.1,'leech',.006],
 ['mine','crossbow','Cinder crossbow','haste',.04,'armor',1,'area',.1,'thorns',18],
 ['venom','sickle','Thorn sickle','regen',.25,'health',20,'area',.1,'leech',.006],
 ['beam','wand','Prism wand','damage',.08,'speed',.04,'haste',.05,'critDamage',.4],
 ['wisp','lantern','Spirit lantern','regen',.25,'armor',1,'magnet',30,'ward',18],
 ['axe','axe','Iron greataxe','damage',.08,'health',22,'knock',.3,'thorns',22],
 ['tide','trident','Tidal trident','speed',.05,'regen',.18,'area',.1,'ward',16]
].map(([id,shape,name,primary,value,second,secondValue,fourth,fourthValue,sixth,sixthValue])=>({id,shape,name,primary,value,second,secondValue,fourth,fourthValue,sixth,sixthValue,color:WEAPONS.find(w=>w.id===id).color}));
export function gearItem(id,level=0){if(typeof id!=='string')return null;const [familyId,raw]=id.split(':'),family=FAMILIES.find(f=>f.id===familyId),tier=Number(raw);if(!family||!/^\d$/.test(raw)||tier<0||tier>6||id!==`${familyId}:${tier}`)return null;return {id,family:familyId,tier,level:Math.max(0,Math.min(10,Math.floor(level))),color:TIERS[tier].color,name:`${TIERS[tier].prefix} ${family.name}`};}
export const gearStats=item=>{if(!item)return {};const f=FAMILIES.find(f=>f.id===item.family),scale=1+item.tier*.18+item.level*.08,stats={[f.primary]:f.value*scale};if(item.tier>=1)stats[f.second]=(stats[f.second]||0)+f.secondValue*scale;if(item.tier>=2)stats.startSpell=f.id;if(item.tier>=3)stats[f.fourth]=(stats[f.fourth]||0)+f.fourthValue*scale;if(item.tier>=4)stats.spellRanks=1;if(item.tier>=5)stats[f.sixth]=f.sixthValue*scale;if(item.tier>=6)stats.revive=1;return stats;};
const pct=n=>`${Math.round(n*100)}%`,number=n=>Number(n.toFixed(2));
export function statLabel(key,value){return ({damage:()=>`+${pct(value)} all damage`,health:()=>`+${Math.round(value)} maximum health`,armor:()=>`${number(value)} less damage per hit`,regen:()=>`Heal ${number(value)} health / second`,haste:()=>`${pct(value)} faster spell recharge`,speed:()=>`+${pct(value)} movement speed`,area:()=>`+${pct(value)} spell area`,crit:()=>`+${pct(value)} critical chance`,knock:()=>`+${pct(value)} knockback`,magnet:()=>`+${Math.round(value)} shard pickup radius`,critDamage:()=>`Critical hits deal +${pct(value)} base damage`,ward:()=>`${Math.round(value)} shield, recharges every 20s`,thorns:()=>`Reflect ${Math.round(value)} base damage on contact`,leech:()=>`Heal for ${number(value*100)}% of damage dealt`,spellRanks:()=>'+1 rank to every spell when acquired (max 8)',startSpell:()=>`Start with ${WEAPONS.find(w=>w.id===value).name} (+1 rank if already your starter)`,revive:()=>'+1 free revive each expedition'})[key]?.()||key;}
export function gearPerks(item,includeLocked=false){const f=FAMILIES.find(f=>f.id===item.family),scale=1+item.tier*.18+item.level*.08;return [[f.primary,f.value*scale],[f.second,f.secondValue*scale],['startSpell',f.id],[f.fourth,f.fourthValue*scale],['spellRanks',1],[f.sixth,f.sixthValue*scale],['revive',1]].map(([key,value],tier)=>{if(tier>item.tier&&typeof value==='number'&&!['spellRanks','revive'].includes(key))value*= (1+tier*.18+item.level*.08)/scale;return {key,value,tier,locked:tier>item.tier,text:statLabel(key,value)};}).filter(p=>includeLocked||!p.locked);}
export function ensureProgression(save){save.inventory??={'bolt:0':{level:0}};save.equipment??={ranger:'bolt:0'};save.spellcraft??={};save.spellSpent??=0;return save;}
export function equippedItem(save,hero=save.hero){const id=save.equipment?.[hero];return save.inventory?.[id]?gearItem(id,save.inventory[id].level):null;}
export const temperCost=item=>Math.round(65*(item.tier+1)*Math.pow(1.48,item.level));
export const ascendCost=item=>[300,850,2400,6500,18000,55000][item.tier]||0;
export const commonCost=150;
export function buyCommon(save,family){ensureProgression(save);const item=gearItem(family+':0');if(!item||save.inventory[item.id]||save.gold<commonCost)return false;save.gold-=commonCost;save.inventory[item.id]={level:0};return true;}
export function equipGear(save,id,hero=save.hero){ensureProgression(save);if(!save.heroes.includes(hero)||id!==null&&!save.inventory[id])return false;if(id===null)delete save.equipment[hero];else save.equipment[hero]=id;return true;}
export function temperGear(save,id){const record=save.inventory?.[id],item=record&&gearItem(id,record.level);if(!item||item.level>=10||save.gold<temperCost(item))return false;save.gold-=temperCost(item);record.level++;return true;}
export function ascendGear(save,id){const record=save.inventory?.[id],item=record&&gearItem(id,record.level);if(!item||item.tier===6||save.gold<ascendCost(item))return false;const next=item.family+':'+(item.tier+1);if(save.inventory[next])return false;save.gold-=ascendCost(item);save.inventory[next]={level:item.level};delete save.inventory[id];for(const hero of Object.keys(save.equipment))if(save.equipment[hero]===id)save.equipment[hero]=next;return next;}
export const SPELL_TRACKS=[{id:'power',name:'Potency',max:10,cost:80,growth:1.6,desc:'+4% damage per rank'},{id:'haste',name:'Fluency',max:5,cost:100,growth:1.7,desc:'2% faster recharge per rank'},{id:'opening',name:'Awakening',max:2,cost:450,growth:3.5,desc:'+1 rank when this spell is first acquired'}];
export const spellCost=(track,n)=>Math.round(track.cost*Math.pow(track.growth,n));
export function buySpell(save,id,trackId){ensureProgression(save);const t=SPELL_TRACKS.find(t=>t.id===trackId);if(!t||!WEAPONS.some(w=>w.id===id))return false;const n=save.spellcraft[id]?.[t.id]||0,cost=spellCost(t,n);if(n>=t.max||save.gold<cost)return false;save.gold-=cost;save.spellSpent+=cost;save.spellcraft[id]??={};save.spellcraft[id][t.id]=n+1;return true;}
const ODDS=[{m:0,w:[78,18,3.6,.38,.019,.001,0]},{m:5,w:[60,28,10,1.8,.18,.019,.001]},{m:10,w:[44,32,18,5,.9,.095,.005]},{m:20,w:[27,31,27,12,2.5,.45,.05]},{m:30,w:[18,27,30,18,5.8,1.05,.15]},{m:60,w:[8,18,31,27,12,3.4,.6]}];
export function rarityOdds(seconds){const m=Math.max(0,Math.min(60,seconds/60)),hi=ODDS.findIndex(o=>o.m>=m);if(hi<=0)return [...ODDS[0].w];const a=ODDS[hi-1],b=ODDS[hi],t=(m-a.m)/(b.m-a.m);return a.w.map((v,i)=>v+(b.w[i]-v)*t);}
export const gearChance=(seconds,boss=false)=>boss?1:Math.min(.65,.35+Math.max(0,seconds)/6000);
export function rollGear(seconds,boss,random){if(random()>=gearChance(seconds,boss))return null;const odds=rarityOdds(seconds);let roll=random()*100,tier=6;for(let i=0;i<odds.length;i++){roll-=odds[i];if(roll<0){tier=i;break;}}const family=FAMILIES[Math.min(FAMILIES.length-1,Math.floor(random()*FAMILIES.length))];return {id:`${family.id}:${tier}`,level:0};}
export function claimPendingGear(save,game){ensureProgression(save);for(const drop of game.pendingGear||[]){const item=gearItem(drop.id,0);if(!item)continue;const duplicate=!!save.inventory[item.id],gold=duplicate?[30,60,120,280,700,1800,5000][item.tier]:0;if(duplicate)save.gold+=gold;else save.inventory[item.id]={level:0};if(game.chestReward?.gear?.id===drop.id)Object.assign(game.chestReward.gear,{duplicate,gold});}game.pendingGear=[];}
export function validProgression(s){const obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v),int=(v,max)=>Number.isInteger(v)&&v>=0&&v<=max;if(s.inventory!==undefined&&(!obj(s.inventory)||Object.entries(s.inventory).some(([id,v])=>!gearItem(id)||!obj(v)||!int(v.level,10))))return false;if(s.equipment!==undefined&&(!obj(s.equipment)||Object.entries(s.equipment).some(([h,id])=>!HEROES.some(a=>a.id===h)||!s.inventory?.[id])))return false;if(s.spellcraft!==undefined&&(!obj(s.spellcraft)||Object.entries(s.spellcraft).some(([id,v])=>!WEAPONS.some(w=>w.id===id)||!obj(v)||Object.entries(v).some(([key,n])=>!SPELL_TRACKS.some(t=>t.id===key&&int(n,t.max))))))return false;return s.spellSpent===undefined||int(s.spellSpent,1e9);}
