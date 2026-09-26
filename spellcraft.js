// Keep legacy track IDs, costs and effects intact in both accounts and saved runs.
export const SPELL_TRACKS=[{id:'power',name:'Potency',max:10,cost:80,growth:1.6,desc:'+4% damage per rank'},{id:'haste',name:'Fluency',max:5,cost:100,growth:1.7,desc:'2% faster recharge per rank'},{id:'opening',name:'Awakening',max:2,cost:450,growth:3.5,desc:'+1 rank when this spell is first acquired'}];
const track=(id,name,desc,max=5,cost=150,growth=1.65)=>({id,name,desc,max,cost,growth});
const radius=name=>track('radius',name,'+8% radius or reach per rank');
const shots=(name,max=3,amount=1)=>track('projectiles',name,`+${amount} projectile${amount>1?'s':''} per cast per rank`,max,350,2.2);
const pierce=(name,amount=2)=>track('pierce',name,`Pierce ${amount} additional enemies per rank`,4,180);
const duration=name=>track('duration',name,'+20% chill and freeze duration per rank; Eclipse freeze limit also grows');
export const SIGNATURE_TRACKS={
 bolt:[shots('Split embers'),pierce('Bodkin flame')],
 orbit:[track('projectiles','Moon choir','+1 orbiting blade per rank',3,350,2.2),radius('Lunar reach')],
 chain:[track('jumps','Storm relay','+2 lightning jumps per rank',4,250,1.8),radius('Arc bridge')],
 nova:[radius('Cathedral bell'),track('healing','Mending song','Worldsong heals +1 health per rank when its pulse hits 3 enemies')],
 frost:[radius('Snowfield'),duration('Deep winter')],
 flame:[radius('Dragon lung'),track('duration','Lasting embers','Phoenix wake leaves burning ground for +0.6 seconds per rank')],
 dagger:[shots('Knife storm',3,2),pierce('Ghost edge',1)],
 meteor:[radius('Impact crater'),shots('Meteor shower',2)],
 spear:[shots('Lance formation',2),pierce('Adamant point',3)],
 scythe:[shots('Twin harvest',2),track('width','Crescent edge','+12% scythe hit radius per rank')],
 mine:[radius('Powder keg'),track('projectiles','Trap cluster','+1 trap placed per cast per rank',2,350,2.2)],
 venom:[track('duration','Lingering toxin','Poison pools last +0.8 seconds per rank'),track('tickrate','Quick venom','Poison damage ticks 5% sooner per rank')],
 beam:[track('width','Wide spectrum','+15% beam width per rank'),track('projectiles','Prism splitter','+1 beam per cast per rank',2,350,2.2)],
 wisp:[shots('Spirit gathering'),track('duration','Restless souls','Homing spirits last +0.4 seconds per rank')],
 axe:[shots('Iron whirlwind'),track('width','Titan edge','+12% axe hit radius per rank')],
 tide:[radius('Ocean reach'),track('force','Riptide','+15% wave knockback per rank')],
 aegis:[track('shield','Deep ice','+20% shield capacity per rank'),radius('Glacial halo')],
 chrono:[duration('Stolen seconds'),radius('Time horizon')],
 torrent:[track('projectiles','Rising chorus','+1 wave per cast per rank',3,350,2.2),radius('Coral reach')],
 blood:[track('healing','Heart drinker','+20% health recovered per cast per rank'),radius('Crimson canopy')],
 solar:[shots('Solar constellation'),pierce('Sun needles')],
 void:[radius('Event horizon'),track('projectiles','Twin singularities','+1 singularity per cast per rank',2,350,2.2)],
 regen:[track('recovery','Deep spring','+20% Springwater healing per rank'),track('surge','Second spring','+0.3 health/second per rank below half health, while Springwater is acquired')],
 vitality:[track('health','Ancient bark','+5 maximum health per Ironbark rank, per upgrade'),track('healing','Living bark','Heal +5 more health when acquiring an Ironbark rank, per upgrade')]
};
export const HEALTH_SPELLS=['regen','vitality'];
export const spellTracks=id=>[...(SIGNATURE_TRACKS[id]||[]),...(HEALTH_SPELLS.includes(id)?[]:SPELL_TRACKS)];
export const craftRank=(g,id,key)=>g.spellcraft?.[id]?.[key]||0;
