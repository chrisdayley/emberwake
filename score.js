// Original melodies: explicit pitches, rests and held notes, never combat RNG.
// Each map has three themes: a refrain, an answering melody and a battle theme.
const song=(name,root,bpm,lead,chords,a,b,c)=>({name,root,bpm,lead,chords,melodies:[a,b,c],cutoff:5400,wave:'triangle'});
export const THEMES={
 ashwood:song('Carry the Ember',60,108,'reed',[0,8,3,10,5,8,7,7],[7,7,10,12,10,7,5,3,5,7,10,7,5,3,2,0],[15,14,12,10,12,7,10,12,14,15,14,10,7,5,7,12],[0,7,12,10,7,5,7,10,12,15,14,12,10,7,5,7]),
 hollow:song('Dance of the Glass Moon',57,116,'bell',[0,5,8,7,0,10,5,7],[12,7,10,12,15,14,12,7,8,10,12,10,7,5,3,2],[7,10,14,17,15,14,12,10,8,12,15,14,10,8,7,2],[0,3,7,12,14,12,10,7,8,7,5,3,2,7,11,14]),
 cinder:song('Hearts Against the Furnace',55,124,'brass',[0,0,8,10,5,3,8,7],[0,0,7,10,12,10,7,5,3,5,7,10,7,5,2,0],[12,15,14,12,10,12,7,10,15,17,15,14,12,10,7,11],[7,7,12,15,14,12,10,7,8,10,12,10,8,7,11,14]),
 frostmarch:song('A Lantern for Tomorrow',62,102,'flute',[0,8,3,10,5,0,8,7],[12,14,15,14,12,7,10,12,10,7,5,7,3,2,0,7],[7,10,12,15,19,17,15,14,12,10,8,7,5,7,11,12],[12,7,12,14,15,12,10,7,5,8,12,15,14,11,7,12]),
 drowned:song('Sails Beneath the Sea',57,112,'pluck',[0,10,8,3,5,0,8,7],[7,12,10,7,5,7,10,12,15,12,10,8,7,5,3,2],[12,15,19,17,15,14,12,10,8,10,12,15,14,12,11,7],[0,7,10,12,7,10,14,15,12,10,8,7,5,8,11,14]),
 clockwork:song('The Clockmaker Runs',60,130,'marimba',[0,7,8,5,3,10,8,7],[0,7,3,7,10,7,12,10,8,5,10,8,7,3,2,0],[12,14,15,19,17,15,14,12,10,14,17,15,14,11,7,2],[7,12,7,15,14,7,12,10,8,12,8,15,14,11,7,12]),
 briarheart:song('Waltz of the Wild Rose',59,110,'reed',[0,5,8,3,10,5,8,7],[7,10,12,7,15,14,12,10,8,12,10,8,7,5,3,2],[15,14,12,10,8,10,12,15,17,15,14,12,10,8,7,11],[12,10,7,12,15,12,10,7,5,8,12,8,7,11,14,12]),
 sunforge:song('Raise the Golden Banner',62,126,'brass',[0,3,8,10,5,8,7,7],[7,7,12,14,15,12,10,7,8,10,12,15,14,12,11,7],[19,17,15,14,12,15,19,17,15,14,12,10,8,7,11,12],[0,7,12,15,19,15,14,12,10,14,17,14,12,11,7,12]),
 eclipse:song('No Crown Outlasts the Dawn',50,128,'strings',[0,8,5,7,0,10,8,7],[0,7,11,12,14,12,11,7,8,12,15,14,12,10,8,7],[19,17,15,14,12,10,8,7,5,8,12,15,14,11,7,12],[12,11,7,0,7,11,14,12,15,14,12,11,8,7,11,12]),
 astral:song('Between the Falling Stars',61,118,'bell',[0,3,10,8,5,0,8,7],[12,7,14,12,10,7,5,3,7,10,15,14,12,10,7,0],[19,15,14,12,15,17,19,14,12,10,8,12,14,11,7,12],[7,12,15,14,12,7,10,14,15,19,17,15,14,12,11,7])
};
export const ACTS=['Wanderers','The pursuit','Nightfall','Against the tide','Last stand','Break the horizon'];
const FORMS=['Refrain','Answer','Refrain reprise','Open sky','Bridge','Battle dance','Refrain ascendant','Homeward cadence'];
// Four-bar phrases with intentional repeated rhythm and room to breathe.
const RHYTHMS=[[[0,0,3],[3,1,1],[4,2,4],[10,3,5]],[[0,4,6],[8,5,2],[11,6,1],[12,7,3]],[[0,8,2],[3,9,1],[4,10,3],[8,11,6]],[[0,12,3],[4,13,3],[8,14,2],[10,15,6]]];
export function scoreState(region,seconds){const theme=THEMES[region]||THEMES.ashwood,act=Math.min(5,Math.floor(Math.max(0,seconds)/300));return {theme,act,actName:ACTS[act],intensity:Math.min(1,Math.max(0,seconds)/1500),bpm:theme.bpm+[0,4,10,14,20,24][act]};}
export function scorePosition(step){const bar=Math.floor(step/16);return {bar:bar%128,section:FORMS[Math.floor(bar/16)%8],cycle:Math.floor(bar/128),loopBars:128};}
export function scoreNotes(region,seconds,step){
 const {theme,act,bpm}=scoreState(region,seconds),t={...theme,root:theme.root+(act>=4?2:0)},beat=60/bpm,s=step%16,bar=Math.floor(step/16)%128,part=Math.floor(bar/16),local=bar%16,phrase=Math.floor(local/4),notes=[];
 const add=(voice,midi,duration,gain,instrument='strings',extra={})=>notes.push({voice,midi,duration,gain,wave:instrument==='brass'?'sawtooth':'triangle',instrument,...extra});
 const battle=act>=2,quiet=part===4,melody=t.melodies[(part===1||part===3?1:part===5||battle&&[0,2,6].includes(part)?2:0)];
 // Later arrangements reharmonize the same hook, then introduce the battle theme.
 const progression=act>=3?[0,8,10,7,5,3,8,7]:t.chords,chord=progression[Math.floor(local/2)],minor=[0,5,7].includes(chord),triad=[chord,chord+(minor?3:4),chord+7];
 if(s===0&&local%2===0){for(let n=0;n<3;n++)add('pad',t.root-12+triad[n],beat*7.6,.018,'strings',{attack:.24,hold:.75,pan:(n-1)*.4});if(act>=3)add('air',t.root+chord+19,beat*6,.009,'choir',{attack:.4,hold:.7});}
 const rhythm=RHYTHMS[local%4];for(const [at,index,len]of rhythm)if(s===at){let pitch=melody[index];if(phrase===1&&index===15)pitch=7;if(phrase===3&&index===15)pitch=0;const lift=part===6?12:0;const midi=t.root+pitch+lift;add('lead',midi,beat*len/4*.94,.085,act>=4?'brass':t.lead,{hold:.55,pan:-.12});if(act>=3&&!quiet)add('harmony',midi-([0,7,12].includes(pitch%12)?5:3),beat*len/4*.86,.022,'strings',{hold:.6,pan:.25});}
 if(quiet&&s===0)add('bell',t.root+melody[(local*2)%16]+12,beat*1.8,.015,'bell',{pan:.3});
 if([0,8].includes(s)||!quiet&&[6,14].includes(s)||act>=2&&!quiet&&s===11)add('bass',t.root-24+chord+(s===6||s===14?7:0),beat*.7,.085,'bass');
 if(s%4===2||act>=1&&!quiet&&s%2===1){const ix=Math.floor(s/2)%3;add('arp',t.root+triad[ix]+(s>=8?12:0),beat*.42,.023,'pluck',{pan:.38});}
 if(act>=2&&!quiet&&[2,7,10,15].includes(s)){const j=[2,7,10,15].indexOf(s);add('counter',t.root+t.melodies[2][(local%4)*4+j]-12,beat*.65,.032,'marimba',{pan:.35});}
 if(act>=4&&!quiet&&s%2===0)add('ostinato',t.root-12+triad[(s/2)%3],beat*.24,.024,'strings',{pan:-.4});
 if(s===0||!quiet&&s===8||act>=1&&!quiet&&s===6||act>=3&&!quiet&&s===14)add('kick',36,.22,.18,'bass');
 if(!quiet&&[4,12].includes(s))add('snare',0,.18,.06,'noise');
 if(!quiet&&(s%4===2||act>=1&&s%2===0||act>=5))add('hat',0,s===14?.1:.045,.016+act*.002,'noise',{pan:.3});
 if(local%4===3&&s>=12&&s%2===0)add('tom',s===12?48:43,.25,.065,'bass',{pan:s===12?-.35:.35});
 if(local===15&&s>=12&&act>=2)add('snare',0,.1,.035+(s-12)*.007,'noise');
 if(local===0&&s===0&&bar>0)add('cymbal',0,beat*2,.035,'noise');
 return notes;
}
