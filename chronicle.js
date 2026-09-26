import {RELIC_WEAPONS,WEAPON_FEATS} from './relic-weapons.js?v=24';
// Achievement progression is additive: already-owned characters, spells and maps stay owned.
export const SPECIAL_STAGES=[
 {id:'frostmarch',name:'Frostmarch',color:'#9de8f4',floor:'#142d39',tag:'Blizzards · Shelter at braziers',desc:'Icebound avenues, hunting crystal beasts and blizzards. Stay near a brazier when the snow closes in.',requirement:'Defeat a guardian in Ashwood',music:'ashwood',strength:1.5,hero:'winter',weapon:'aegis'},
 {id:'drowned',name:'Drowned Archive',color:'#6cddd1',floor:'#102f34',tag:'Flooded corridors · Surging currents',desc:'A drowned library of coral sentinels. Tides sweep east and west through long corridors.',requirement:'Survive 10 minutes in Violet Hollow',music:'hollow',strength:2.2,hero:'diver',weapon:'torrent'},
 {id:'clockwork',name:'Clockwork Spire',color:'#e5ce85',floor:'#302b20',tag:'Clock traps · Alternating danger tiles',desc:'Brass corridors inhabited by constructs. Watch red clock tiles and move before each pulse.',requirement:'Survive 10 minutes in Frostmarch',music:'cinder',strength:2.8,hero:'horologist',weapon:'chrono'},
 {id:'briarheart',name:'Briarheart Garden',color:'#e4a5c2',floor:'#2e1c2b',tag:'Thorn hedges · Hunting blooms',desc:'A maze of rose hedges and predatory flowers. Bloom traps pursue you with delayed strikes.',requirement:'Evolve two weapons in one expedition',music:'hollow',strength:2.5,hero:'thornwitch',weapon:'blood'},
 {id:'sunforge',name:'Sunforge Citadel',color:'#ffce80',floor:'#352720',tag:'Crossing lava canals · Solar eruptions',desc:'Solar constructs guard crossing lava canals. Safe stone squares connect a lattice of narrow bridges.',requirement:'Survive 10 minutes in Cinder Wastes',music:'cinder',strength:4,hero:'sunwarden',weapon:'solar'},
 {id:'eclipse',name:'Eclipse Throne',color:'#d2b4fc',floor:'#171326',tag:'Endgame · Void wells · Accelerated elite waves',desc:'Defeat the Last Eclipse to open its throne. Void wells, living constellations and relentless elites test your strongest equipment.',requirement:'Defeat the Last Eclipse at 30:00',music:'hollow',strength:6,hero:'eclipseborn',weapon:'void'}
];
export const EXTRA_WEAPONS=[
 {id:'aegis',name:'Frost aegis',icon:'⬡',color:'#b8eeff',desc:'A protective frost pulse grants a small shield and strikes nearby enemies.',base:'24 damage · shield every 5s',upgrade:'More shielding, damage and range.',evo:'Everglass mantle',pair:'guard',evoDesc:'A larger shield, powerful frost pulse and 30% damage reduction. Stacks with Stone oath.',unlock:'Survive 10 minutes in Frostmarch'},
 {id:'torrent',name:'Coral chorus',icon:'≋',color:'#8fefdf',desc:'Three spiralling currents sweep outward and push enemies away.',base:'28 damage · 3 waves every 3s',upgrade:'Wider, stronger currents.',evo:'Leviathan hymn',pair:'reach',evoDesc:'Six sweeping currents scour the battlefield.',unlock:'Survive 10 minutes in Drowned Archive'},
 {id:'chrono',name:'Clock needle',icon:'◷',color:'#ffe1a0',desc:'A clock pulse damages and slows nearby enemies.',base:'32 damage · slows for 2s',upgrade:'Stronger, wider time pulses.',evo:'Thirteenth hour',pair:'haste',evoDesc:'A great time pulse that briefly freezes the Last Eclipse and slows its pursuit.',unlock:'Survive 10 minutes in Clockwork Spire'},
 {id:'blood',name:'Crimson bloom',icon:'❀',color:'#f3a7d4',desc:'A siphoning bloom strikes your nearest enemy and restores a little health.',base:'42 damage · heals 1 every 2s',upgrade:'More damage, healing and targets.',evo:'Heart of midnight',pair:'regen',evoDesc:'A wide siphon that restores 5 health per cast. Faster casts support sustained healing.',unlock:'Survive 10 minutes in Briarheart Garden'},
 {id:'solar',name:'Solar writ',icon:'☀',color:'#ffe499',desc:'Four radiant bolts fan toward the horde with deep piercing.',base:'38 damage · 4 bolts every 2s',upgrade:'More piercing, damage and rays.',evo:'Judgment dawn',pair:'power',evoDesc:'Nine deeply piercing rays. Combine freely with damage, critical and recharge upgrades.',unlock:'Survive 10 minutes in Sunforge Citadel'},
 {id:'void',name:'Night singularity',icon:'◉',color:'#c9b5ff',desc:'A collapsing well draws distant enemies together before detonating.',base:'80 damage · every 4s',upgrade:'A larger pull and stronger implosion.',evo:'Event horizon',pair:'wisdom',evoDesc:'Three void collapses devour clustered enemies.',unlock:'Survive 10 minutes in Eclipse Throne'}
];
EXTRA_WEAPONS.push(...RELIC_WEAPONS);
export const EXTRA_HEROES=[
 {id:'winter',name:'Eira',title:'The winter knight',weapon:'frost',color:'#a1e5f4',bonus:'+45 health · +2 armor · Winter bloom',health:45,armor:2},
 {id:'diver',name:'Neris',title:'The tidekeeper',weapon:'tide',color:'#87ddcd',bonus:'+25 pickup radius · +12% area · Undertow',magnet:25,area:.12},
 {id:'horologist',name:'Orrin',title:'The clockmaker',weapon:'chain',color:'#e5ca86',bonus:'10% faster recharge · Storm thread',haste:.1},
 {id:'thornwitch',name:'Rosa',title:'The thornbound',weapon:'venom',color:'#e7a7c8',bonus:'+0.8 healing / second · +10% damage · Witch’s venom',regen:.8,damage:.1},
 {id:'sunwarden',name:'Helion',title:'The sunwarden',weapon:'spear',color:'#ffcb7e',bonus:'+20% damage · +20 health · Dawn lance',damage:.2,health:20},
 {id:'eclipseborn',name:'Vesper',title:'The eclipse heir',weapon:'scythe',color:'#c5a5ff',bonus:'+15% damage · +15% speed · +1 revive · Reaping crescent',damage:.15,speed:.15,revive:1}
].map(h=>({...h,cost:0,desc:'Rescued from a sealed sanctuary beyond the wilds.'}));
const stage=id=>SPECIAL_STAGES.find(s=>s.id===id);
const rec=(s,id)=>s.chronicle.records[id]||{};
const any=(s,key)=>Math.max(0,...Object.values(s.chronicle.records).map(r=>r[key]||0));
export const UNLOCKS=[
 {id:'hero_warden',name:'An oath earned',desc:'Defeat 50 enemies across your expeditions',kind:'hero',reward:'warden',label:'Briar',target:50,value:s=>Math.max(s.stats.kills,any(s,'kills'))},
 {id:'hero_witch',name:'Stormcalling',desc:'Reach level 12 in one expedition',kind:'hero',reward:'witch',label:'Lyra',target:12,value:s=>Math.max(s.stats.bestLevel,any(s,'level'))},
 {id:'hero_sage',name:'Carry the light',desc:'Survive 5 minutes in one expedition',kind:'hero',reward:'sage',label:'Sol',target:300,value:s=>Math.max(s.stats.bestTime,any(s,'time'))},
 {id:'map_frost',name:'Beyond the treeline',desc:stage('frostmarch').requirement,kind:'stage',reward:'frostmarch',label:'Frostmarch',target:1,value:s=>rec(s,'ashwood').bosses||0},
 {id:'map_drowned',name:'The drowned door',desc:stage('drowned').requirement,kind:'stage',reward:'drowned',label:'Drowned Archive',target:600,value:s=>s.regionBest.hollow||0},
 {id:'map_clock',name:'The frozen key',desc:stage('clockwork').requirement,kind:'stage',reward:'clockwork',label:'Clockwork Spire',target:600,value:s=>s.regionBest.frostmarch||0},
 {id:'map_briar',name:'Forbidden growth',desc:stage('briarheart').requirement,kind:'stage',reward:'briarheart',label:'Briarheart Garden',target:2,value:s=>any(s,'evolutions')},
 {id:'map_sun',name:'A furnace beyond',desc:stage('sunforge').requirement,kind:'stage',reward:'sunforge',label:'Sunforge Citadel',target:600,value:s=>s.regionBest.cinder||0},
 {id:'map_eclipse',name:'Death is not the end',desc:stage('eclipse').requirement,kind:'stage',reward:'eclipse',label:'Eclipse Throne',target:1,value:s=>any(s,'reaper')},
 ...RELIC_WEAPONS.map(w=>({id:'weapon_'+w.id,name:'Boss trophy · '+w.name,desc:w.unlock,kind:'weapon',reward:w.id,label:w.name,target:1,value:s=>any(s,w.feat)})),
 ...SPECIAL_STAGES.flatMap(s=>[
  {id:'hero_'+s.hero,name:s.name+' · The captive',desc:'Claim a guarded discovery in '+s.name,kind:'hero',reward:s.hero,label:EXTRA_HEROES.find(h=>h.id===s.hero).name,target:1,value:save=>rec(save,s.id).sites||0},
  {id:'weapon_'+s.weapon,name:s.name+' · The lost art',desc:'Survive 10 minutes in '+s.name,kind:'weapon',reward:s.weapon,label:EXTRA_WEAPONS.find(w=>w.id===s.weapon).name,target:600,value:save=>save.regionBest[s.id]||0}
 ])
];
export function ensureChronicle(s){s.chronicle??={version:1,earned:[],records:{}};s.unlockedWeapons??=[];s.regionBest??={};s.unlockedRegions??=['ashwood'];
 // Preserve imported/current ownership, including spells in an old suspended run.
 for(const id of Object.keys(s.run?.skills||{}))if(EXTRA_WEAPONS.some(w=>w.id===id)&&!s.unlockedWeapons.includes(id))s.unlockedWeapons.push(id);
 return s;
}
export const weaponUnlocked=(s,id)=>!EXTRA_WEAPONS.some(w=>w.id===id)||!!s.unlockedWeapons?.includes(id);
export const heroRequirement=id=>UNLOCKS.find(u=>u.kind==='hero'&&u.reward===id)?.desc||'Available';
export const regionRequirement=id=>stage(id)?.requirement||(id==='hollow'?'Survive 10 minutes in Ashwood':id==='cinder'?'Survive 10 minutes in Violet Hollow':'Available');
export function recordChronicle(s,g=null){ensureChronicle(s);if(g){const r=s.chronicle.records[g.region]??={};for(const [key,value]of Object.entries({time:g.time,kills:g.kills,level:g.level,bosses:g.bossesKilled,sites:g.discoveriesCleared,evolutions:g.evolutionCount,reaper:g.reaperDefeated?1:0,...g.weaponFeats}))r[key]=Math.max(r[key]||0,value||0);s.regionBest[g.region]=Math.max(s.regionBest[g.region]||0,g.time);}
 const awarded=[];for(const u of UNLOCKS){const list=u.kind==='hero'?s.heroes:u.kind==='weapon'?s.unlockedWeapons:s.unlockedRegions;if(u.value(s)>=u.target||list.includes(u.reward)){if(!list.includes(u.reward))list.push(u.reward);if(!s.chronicle.earned.includes(u.id)){s.chronicle.earned.push(u.id);awarded.push(u);}}}return awarded;
}
export function validChronicle(s){const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);if(s.unlockedWeapons!==undefined&&(!Array.isArray(s.unlockedWeapons)||s.unlockedWeapons.length>EXTRA_WEAPONS.length||s.unlockedWeapons.some(id=>!EXTRA_WEAPONS.some(w=>w.id===id))))return false;if(s.chronicle!==undefined){const c=s.chronicle;if(!obj(c)||c.version!==1||!Array.isArray(c.earned)||c.earned.length>UNLOCKS.length||c.earned.some(id=>!UNLOCKS.some(u=>u.id===id))||!obj(c.records)||Object.entries(c.records).some(([id,r])=>!['ashwood','hollow','cinder',...SPECIAL_STAGES.map(s=>s.id)].includes(id)||!obj(r)||Object.entries(r).some(([k,v])=>!['time','kills','level','bosses','sites','evolutions','reaper',...WEAPON_FEATS].includes(k)||!Number.isFinite(v)||v<0||v>1e9)))return false;}return true;}
export const ECLIPSE_RECIPES=[['Control the fight','Winter bloom or Clock needle + Quickening','Chill slows its pursuit; these spells also briefly freeze its movement, contact damage and new attacks. Evolving them strengthens control. It gets a short thaw between freezes.'],['Weather the blows','Stone oath + Everglass mantle + Ironbark','Stone oath gives 8% damage reduction per rank. Everglass mantle adds 30% and a refreshing shield. More health, armor and healing help you survive mistakes.'],['Win the damage race','Your strongest damage spells + recovery','Stack damage, criticals, recharge and Ascensions. Springwater, Crimson bloom or life-stealing gear help sustain you. These are suggestions: every weapon can hurt it and any sufficiently strong build can win.']];
