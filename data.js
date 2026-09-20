export const WEAPONS = [
 {id:'bolt',name:'Ember bolt',icon:'↗',color:'#ffc477',desc:'Seeks the nearest enemy. Reliable, piercing firepower.',base:'22 damage · fires every 0.8s',upgrade:'More damage, more bolts, deeper piercing.',evo:'Sunpiercer',pair:'power',evoDesc:'Seven blazing sunbolts pierce the horde.'},
 {id:'orbit',name:'Moon blades',icon:'✧',color:'#b6a7ff',desc:'Blades circle you and cut through nearby enemies.',base:'18 damage · 2 orbiting blades',upgrade:'Another blade and a wider, stronger orbit.',evo:'Lunar covenant',pair:'reach',evoDesc:'Twelve blades carve a circle of protection.'},
 {id:'chain',name:'Storm thread',icon:'ϟ',color:'#8bdaf5',desc:'Lightning leaps between enemies. Loves a crowd.',base:'30 damage · chains to 3 targets',upgrade:'More damage and another lightning jump.',evo:'Skybreaker',pair:'haste',evoDesc:'Rapid lightning leaps across sixteen targets.'},
 {id:'nova',name:'Hollow bell',icon:'◎',color:'#d9eaba',desc:'A shockwave pushes back everything around you.',base:'38 damage · 105 radius · every 3s',upgrade:'A wider, more powerful shockwave.',evo:'Worldsong',pair:'vitality',evoDesc:'Huge shockwaves heal you when they find a crowd.'},
 {id:'frost',name:'Winter bloom',icon:'❄',color:'#a2e9e8',desc:'Chills a ring of enemies to give you breathing room.',base:'16 damage · slows enemies by 65%',upgrade:'More damage, reach, and freeze duration.',evo:'Stillwinter',pair:'magnet',evoDesc:'A sweeping blizzard slows the entire near field.'},
 {id:'flame',name:'Dragon breath',icon:'♨',color:'#ff9676',desc:'Burns a wide cone toward the nearest enemy.',base:'36 damage · 150 reach · every 1.4s',upgrade:'A longer, wider, hotter flame.',evo:'Phoenix wake',pair:'regen',evoDesc:'An inferno in every direction, with burning ground.'},
 {id:'dagger',name:'Ghost knives',icon:'⋗',color:'#c9e5ce',desc:'A quick fan of blades shreds a path through the swarm.',base:'16 damage · 3 knives · every 1.1s',upgrade:'More knives, damage, and piercing.',evo:'Thousand cuts',pair:'luck',evoDesc:'An eleven-blade fan that tears through entire packs.'},
 {id:'meteor',name:'Falling star',icon:'✦',color:'#edb1de',desc:'Calls a meteor onto a distant enemy cluster.',base:'65 damage · 65 blast radius · every 3.2s',upgrade:'Larger blasts that hit harder, more often.',evo:'Starfall',pair:'wisdom',evoDesc:'Three enormous meteors rain on the battlefield.'},
 {id:'spear',name:'Dawn lance',icon:'➶',color:'#ffe2a3',desc:'A heavy spear punches through a long line of enemies.',base:'42 damage · 6 pierces · every 1.8s',upgrade:'Stronger spears with deeper piercing.',evo:'Daybreak',pair:'precision',evoDesc:'Three radiant lances tear through entire columns.'},
 {id:'scythe',name:'Reaping crescent',icon:'☽',color:'#cbb3f4',desc:'A scythe flies out and returns, striking on both passes.',base:'28 damage · returning blade · every 2s',upgrade:'More damage and a second scythe at rank 5.',evo:'Reaper’s orbit',pair:'agility',evoDesc:'Three returning scythes cut a wide path.'},
 {id:'mine',name:'Cinder traps',icon:'✹',color:'#ffa778',desc:'Leave armed explosives for the horde chasing you.',base:'60 damage · proximity blast · every 2.5s',upgrade:'Stronger blasts and a wider trigger zone.',evo:'Wildfire trail',pair:'force',evoDesc:'Scatter three explosive traps with enormous blasts.'},
 {id:'venom',name:'Witch’s venom',icon:'♧',color:'#ade477',desc:'Poison pools linger beneath your enemies.',base:'12 damage / tick · lasts 4s · every 3s',upgrade:'Stronger poison in larger pools.',evo:'Blighted garden',pair:'regen',evoDesc:'Two vast poison gardens linger and slow enemies.'},
 {id:'beam',name:'Prism ray',icon:'⟡',color:'#93eeef',desc:'A focused beam cuts through everything in its path.',base:'46 damage · 440 reach · every 2.4s',upgrade:'A wider, more powerful beam.',evo:'Aurora',pair:'haste',evoDesc:'Three radiant beams sweep through the horde.'},
 {id:'wisp',name:'Spirit lantern',icon:'♨',color:'#b3f5df',desc:'Summon spirits that chase down nearby enemies.',base:'20 damage · 2 homing spirits · every 2.2s',upgrade:'More spirits with more damage.',evo:'Soul procession',pair:'wisdom',evoDesc:'Seven tireless spirits hunt through the crowd.'},
 {id:'axe',name:'Iron tempest',icon:'⚒',color:'#dfc7a8',desc:'Heavy spinning axes carve through nearby packs.',base:'36 damage · 2 axes · every 2s',upgrade:'Stronger axes, with another at ranks 4 and 7.',evo:'Titan’s fury',pair:'guard',evoDesc:'Six colossal axes cut a broad swath.'},
 {id:'tide',name:'Undertow',icon:'≋',color:'#83c9ff',desc:'An expanding wave pushes enemies back as it travels.',base:'32 damage · 190 reach · every 3.4s',upgrade:'Stronger waves travel farther and push harder.',evo:'The great flood',pair:'reach',evoDesc:'A vast, fast-recharging wave drives the horde back.'}
];
export const PASSIVES=[
 {id:'power',name:'Cinder heart',icon:'♥',color:'#ffb97c',desc:'+15% damage per rank.',max:3},
 {id:'haste',name:'Quickening',icon:'»',color:'#9bdcda',desc:'Attacks recharge 10% faster per rank.',max:3},
 {id:'reach',name:'Wide horizon',icon:'◌',color:'#beabf1',desc:'+15% weapon area per rank.',max:3},
 {id:'vitality',name:'Ironbark',icon:'⬡',color:'#b9d895',desc:'+25 max health per rank. Heals 25 now.',max:3},
 {id:'magnet',name:'Lodestone',icon:'◇',color:'#8bcbe5',desc:'+45 pickup radius per rank.',max:3},
 {id:'regen',name:'Springwater',icon:'≈',color:'#92dabc',desc:'Recover 0.6 health each second per rank.',max:3},
 {id:'luck',name:'Fortune',icon:'✤',color:'#ffd078',desc:'+10% critical chance per rank. Criticals deal double damage.',max:3},
 {id:'wisdom',name:'Old knowledge',icon:'▥',color:'#e3b5db',desc:'+20% experience per rank.',max:3},
 {id:'precision',name:'Deadeye',icon:'⌖',color:'#ffe2a3',desc:'Critical hits deal +35% base damage per rank.',max:3},
 {id:'force',name:'Heavy hands',icon:'✊',color:'#ffa778',desc:'+30% knockback and +4% damage per rank.',max:3},
 {id:'guard',name:'Stone oath',icon:'◈',color:'#dfc7a8',desc:'Reduce damage taken by 1 per rank.',max:3},
 {id:'agility',name:'Windstep',icon:'»',color:'#b3e7f0',desc:'+4% movement speed; dash recharges 0.12s faster per rank.',max:3}
];
export const HEROES=[
 {id:'ranger',name:'Ash',title:'The wayfinder',weapon:'bolt',color:'#f5b76a',desc:'A steady shot. A second chance.',bonus:'+10% movement speed · Ember bolt',cost:0},
 {id:'warden',name:'Briar',title:'The oathkeeper',weapon:'orbit',color:'#b7d99e',desc:'Stand your ground. Make it theirs to lose.',bonus:'+35 health · +1 armor · Moon blades',cost:180},
 {id:'witch',name:'Lyra',title:'The stormweaver',weapon:'chain',color:'#b5b4f4',desc:'One spark is all she needs.',bonus:'+15% damage · Storm thread',cost:260},
 {id:'sage',name:'Sol',title:'The last sun',weapon:'nova',color:'#f6d894',desc:'A little light goes a long way.',bonus:'+20% experience · Hollow bell',cost:340}
];
export const META=[
 {id:'might',name:'Kindled might',icon:'ϟ',desc:'+5% damage per rank',max:8,cost:40},
 {id:'health',name:'Deep roots',icon:'♥',desc:'+10 starting health per rank',max:8,cost:35},
 {id:'armor',name:'Barkskin',icon:'⬡',desc:'Reduce each hit by 1 per rank',max:5,cost:65},
 {id:'speed',name:'Trailblazer',icon:'»',desc:'+4% movement speed per rank',max:5,cost:45},
 {id:'magnet',name:'Gatherer',icon:'◇',desc:'+12 pickup radius per rank',max:6,cost:30},
 {id:'growth',name:'Memory keeper',icon:'▥',desc:'+5% experience per rank',max:6,cost:45},
 {id:'regen',name:'Living ember',icon:'≈',desc:'Recover 0.15 health / second per rank',max:5,cost:70},
 {id:'haste',name:'Fast hands',icon:'✧',desc:'Attacks recharge 3% faster per rank',max:5,cost:65},
 {id:'fortune',name:'Gold finder',icon:'✤',desc:'+8% gold earned per rank',max:6,cost:40},
 {id:'area',name:'Far reach',icon:'◌',desc:'+5% weapon area per rank',max:5,cost:50},
 {id:'dash',name:'Second wind',icon:'↗',desc:'Dash recharges 0.3s sooner per rank',max:5,cost:50},
 {id:'reroll',name:'New paths',icon:'⟳',desc:'+1 free upgrade reroll each run',max:3,cost:95}
];
export const REGIONS=[
 {id:'ashwood',name:'The Ashwood',desc:'Fireflies, old roots, and things that should stay asleep.',tag:'A good place to begin',color:'#94d1b4',need:0},
 {id:'hollow',name:'Violet Hollow',desc:'Faster hunters. More gold. The stars are watching.',tag:'+15% enemy speed · +25% gold',color:'#c0a6ee',need:1},
 {id:'cinder',name:'Cinder Wastes',desc:'Harder-hitting hordes under a broken, burning sky.',tag:'+25% enemy health · +50% gold',color:'#edb28e',need:3}
];
export const MILESTONES=[
 {id:'firstblood',name:'First sparks',desc:'Defeat 50 enemies in total',stat:'kills',target:50,reward:35},
 {id:'hundred',name:'Finding your feet',desc:'Defeat 300 enemies in total',stat:'kills',target:300,reward:75},
 {id:'thousand',name:'Force of nature',desc:'Defeat 1,000 enemies in total',stat:'kills',target:1000,reward:150},
 {id:'fivek',name:'The wild remembers',desc:'Defeat 5,000 enemies in total',stat:'kills',target:5000,reward:300},
 {id:'survive',name:'Hold the line',desc:'Survive 3 minutes in one run',stat:'bestTime',target:180,reward:50},
 {id:'eight',name:'Into the dark',desc:'Survive 8 minutes in one run',stat:'bestTime',target:480,reward:100},
 {id:'dawn',name:'A new dawn',desc:'Reach the 30-minute dawn milestone',stat:'wins',target:1,reward:150},
 {id:'veteran',name:'Dawnkeeper',desc:'Reach dawn in 5 expeditions',stat:'wins',target:5,reward:300},
 {id:'evolve',name:'Something extraordinary',desc:'Evolve a weapon',stat:'evolutions',target:1,reward:100},
 {id:'evolvemore',name:'Beyond the ordinary',desc:'Evolve 10 weapons in total',stat:'evolutions',target:10,reward:250},
 {id:'loyal',name:'Back to the fire',desc:'Play 5 expeditions',stat:'runs',target:5,reward:100},
 {id:'level',name:'Fully awake',desc:'Reach level 20 in a run',stat:'bestLevel',target:20,reward:100}
];
export const byId=id=>[...WEAPONS,...PASSIVES].find(x=>x.id===id);
export const costOf=(u,rank)=>Math.round(u.cost*Math.pow(1.43,rank));
export function freshSave(){return {version:1,gold:0,spent:0,inventory:{'bolt:0':{level:0}},equipment:{ranger:'bolt:0'},spellcraft:{},spellSpent:0,meta:{},heroes:['ranger'],hero:'ranger',region:'ashwood',stats:{kills:0,runs:0,wins:0,bestTime:0,bestLevel:0,evolutions:0},claimed:[],settings:{sound:true,fx:0.6,shake:false,joystick:'floating'},history:[],run:null};}

export const WEAPON_SLOTS=6, PASSIVE_SLOTS=6;
export const ENEMIES={
 crawler:{name:'Bramble crawlers',hp:17,speed:52,r:10,damage:12,xp:1,minute:0},
 bat:{name:'Dusk bats',hp:11,speed:95,r:10,damage:12,xp:1,minute:0},
 brute:{name:'Root brutes',hp:65,speed:38,r:17,damage:20,xp:4,minute:1},
 shooter:{name:'Spore archers',hp:34,speed:42,r:10,damage:12,xp:1,minute:2},
 ironhide:{name:'Ironhide beetles',hp:130,speed:39,r:18,damage:23,xp:4,minute:3,armor:.2,knock:.35},
 charger:{name:'Horned chargers',hp:42,speed:65,r:10,damage:16,xp:2,minute:4},
 reaver:{name:'Blood reavers',hp:90,speed:82,r:13,damage:22,xp:3,minute:4},
 revenant:{name:'Veil revenants',hp:115,speed:57,r:14,damage:24,xp:4,minute:5},
 juggernaut:{name:'Stone juggernauts',hp:280,speed:29,r:23,damage:32,xp:6,minute:6,knock:.15},
 leech:{name:'Thorn leeches',hp:150,speed:61,r:15,damage:25,xp:4,minute:7},
 champion:{name:'Hollow champions',hp:210,speed:55,r:18,damage:28,xp:5,minute:8,armor:.12,knock:.4}
};
