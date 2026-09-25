// Original 128-bar regional suites. Composition uses no combat RNG or save state.
export const THEMES={
 ashwood:{name:'Embers in the Leaves',root:50,bpm:84,wave:'triangle',cutoff:2200,
  chords:[[0,5,2,6,3,0,4,4],[3,5,0,4,2,6,3,4],[5,3,0,2,5,6,4,4],[0,2,3,5,6,3,4,0]],
  phrases:[[7,9,11,10,9,7,6,7],[9,11,12,11,9,8,7,6],[7,8,9,11,12,11,9,7],[11,10,9,7,6,4,6,7],[12,11,9,10,11,9,8,7],[9,7,6,4,6,7,9,8],[7,9,12,14,12,11,9,11],[10,9,7,6,8,6,4,7]]},
 hollow:{name:'The Glass Choir',root:45,bpm:88,wave:'sine',cutoff:2800,
  chords:[[0,5,3,6,0,2,5,4],[3,2,5,0,6,3,1,4],[5,0,6,2,3,5,4,4],[0,3,5,2,6,5,4,0]],
  phrases:[[11,9,7,8,11,12,9,7],[14,12,11,9,10,11,8,6],[9,11,14,13,12,11,9,8],[7,6,8,9,11,9,6,4],[12,14,16,14,13,11,12,9],[11,8,9,6,7,9,11,12],[14,11,12,9,11,8,6,7],[9,8,6,4,6,8,9,7]]},
 cinder:{name:'March of the Furnace',root:48,bpm:104,wave:'triangle',cutoff:1800,
  chords:[[0,0,5,3,0,6,5,4],[5,3,6,0,3,2,4,4],[0,6,3,5,2,5,6,4],[3,5,0,2,6,3,4,0]],
  phrases:[[7,7,11,9,7,6,7,9],[7,11,12,11,9,7,6,4],[9,9,12,14,12,11,9,7],[11,9,7,6,4,6,7,9],[14,12,11,14,16,14,12,11],[12,11,9,7,9,11,12,9],[7,9,11,14,16,14,11,12],[11,9,8,6,4,6,8,7]]}
};
const SCALE=[0,2,3,5,7,8,10];
const pitch=degree=>SCALE[((degree%7)+7)%7]+12*Math.floor(degree/7);
const SECTIONS=[
 {name:'First light',harmony:0,phrase:0,lift:0,energy:.78},
 {name:'The path unfolds',harmony:1,phrase:2,lift:0,energy:.95},
 {name:'Beyond the veil',harmony:2,phrase:4,lift:2,energy:1},
 {name:'A breath in the dark',harmony:3,phrase:6,lift:-2,energy:.56},
 {name:'Return of the flame',harmony:0,phrase:1,lift:0,energy:.9},
 {name:'The chase',harmony:2,phrase:3,lift:2,energy:1.08},
 {name:'Against the night',harmony:1,phrase:5,lift:3,energy:1.15},
 {name:'Dawn remembers',harmony:3,phrase:7,lift:0,energy:.85}
];
const RHYTHMS=[[0,3,4,6,8,11,12,14],[0,2,5,6,8,10,13,14],[0,2,4,7,8,11,12,15],[0,3,6,7,9,10,12,14]];
export function musicSettings(settings={}){return {enabled:typeof settings.music==='boolean'?settings.music:settings.sound!==false,volume:Number.isFinite(settings.musicVolume)?Math.max(0,Math.min(1,settings.musicVolume)):.4};}
export function scoreState(region,seconds){const theme=THEMES[region]||THEMES.ashwood,intensity=Math.min(1,Math.max(0,seconds)/1500);return {theme,intensity,bpm:theme.bpm+Math.round(intensity*28)};}
export function scorePosition(step){const bar=Math.floor(step/16),section=SECTIONS[Math.floor(bar/16)%8];return {bar:bar%128,section:section.name,cycle:Math.floor(bar/128),loopBars:128};}
export function scoreNotes(region,seconds,step){
 const {theme:t,intensity:i,bpm}=scoreState(region,seconds),beat=60/bpm,s=step%16,bar=Math.floor(step/16),local=bar%16,sectionIndex=Math.floor(bar/16)%8,section=SECTIONS[sectionIndex],cycle=Math.floor(bar/128),degree=t.chords[section.harmony][Math.floor(local/2)],root=t.root+pitch(degree),notes=[];
 const add=(voice,midi,duration,gain,wave='triangle',extra={})=>notes.push({voice,midi,duration,gain,wave,...extra});
 const triad=[0,2,4].map(n=>t.root+pitch(degree+n));
 // Inversions and a warm sustained chord change every two bars.
 if(s===0&&local%2===0){for(let n=0;n<3;n++)add('pad',triad[n]+(n===0&&local%4===2?12:0),beat*7.7,.015+ i*.005,'triangle',{attack:.35,hold:.6,pan:(n-1)*.45});if(i>=.4)add('air',root+24,beat*6,.008,'sine',{attack:.6,hold:.4,pan:.35});}
 const bassSteps=sectionIndex===3?[0,10]:region==='cinder'?[0,4,6,8,12,14]:[0,6,8,14];
 if(bassSteps.includes(s)||(i>=.16&&s===11))add('bass',root-12+(s===6||s===14?7:0),beat*(s===0?1.1:.5),.075,'triangle');
 // Eight written phrases per region, syncopated rhythms, question/answer bars and cadences.
 const phrase=t.phrases[(Math.floor(local/2)+section.phrase)%8],rhythm=RHYTHMS[(local+sectionIndex)%4],index=rhythm.indexOf(s);
 if(index>=0&&!(sectionIndex===3&&index%3===1)&&!(local%4===3&&index>=6)){
  let d=phrase[index]+section.lift+(local%2?[-2,0,1,0,2,0,-1,0][index]:0);
  if(cycle%2&&index===5)d+=2;
  let midi=t.root+pitch(d);
  if(index===0||index===4){const tones=triad.flatMap(n=>[n,n+12,n+24]);midi=tones.reduce((a,b)=>Math.abs(b-midi)<Math.abs(a-midi)?b:a);}
  const duration=beat*(index===7||local%4===3&&index===5?1.1:region==='hollow'?.72:.42);
  add('lead',midi,duration,.058,t.wave,{pan:-.18,hold:region==='hollow'?.12:0});
  if(region==='hollow'&&index%3===0)add('bell',midi+12,beat*1.5,.009,'sine',{delay:beat*.75,pan:.45});
  if(i>=.6&&index===4)add('double',midi+12,duration,.012,'triangle',{pan:.2});
 }
 // Arpeggios answer the tune; later runs introduce a separate countermelody.
 if((i>=.08||sectionIndex===2||sectionIndex===5)&&s%2===1&&sectionIndex!==3){const arp=[0,2,4,6,4,2,7,4][Math.floor(s/2)];add('arp',t.root+pitch(degree+7+arp),beat*.3,.016+i*.008,region==='hollow'?'sine':'triangle',{pan:.35});}
 if((i>=.28||sectionIndex===6)&&[2,7,10,15].includes(s)){const n=[4,2,6,4][[2,7,10,15].indexOf(s)];add('counter',t.root+pitch(degree+7+n+(local%2?2:0)),beat*.85,.021,'triangle',{pan:.4,attack:.04,hold:.16});}
 // Regional grooves with breathing sections, four-bar fills and section transitions.
 const groove=section.energy,quiet=sectionIndex===3;
 if(s===0||(!quiet&&s===8)||(!quiet&&i>=.16&&[6,14].includes(s))||region==='cinder'&&!quiet&&s===10)add('kick',36,.23,.17*groove,'sine');
 if((!quiet||i>=.6)&&(s===4||s===12))add('snare',0,.15,.035*groove,'triangle',{pan:.08});
 if(!quiet&&(s%4===2||i>=.08&&s%2===0||i>=.8))add('hat',0,s===14?.1:.045,.012+i*.01,'triangle',{pan:s%4?-.35:.35});
 if(local%4===3&&[13,15].includes(s))add('tom',s===13?50:45,.2,.055*groove,'sine',{pan:s===13?-.3:.3});
 if(local===15&&s>=12&&i>=.4)add('snare',0,.09,.025+(s-12)*.005,'triangle',{pan:(s-13.5)*.15});
 if(local===0&&s===0&&bar>0)add('cymbal',0,beat*2,.035,'triangle',{pan:.4});
 if(i>=.8&&s%4===3&&!quiet)add('pulse',root+12,beat*.22,.019,'triangle',{pan:-.3});
 return notes;
}
const frequency=midi=>440*2**((midi-69)/12);
export class AdaptiveMusic{
 constructor(context){this.context=context;this.master=context.createGain();this.master.gain.value=0;this.filter=context.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=6000;this.compressor=context.createDynamicsCompressor();this.compressor.threshold.value=-18;this.compressor.ratio.value=5;this.master.connect(this.filter);this.filter.connect(this.compressor);this.compressor.connect(context.destination);this.voices=new Set();this.running=false;this.region=null;this.step=0;this.next=0;this.scheduled=0;this.seconds=0;this.volume=0;this.noise=context.createBuffer(1,context.sampleRate,context.sampleRate);const data=this.noise.getChannelData(0);let seed=7341;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647)*2-1;}}
 update(region,seconds,playing,settings,hidden=false){const options=musicSettings(settings);this.seconds=seconds||0;this.volume=options.volume;if(!playing||hidden||!options.enabled||options.volume===0||this.context.state!=='running'){this.stop();return;}
  const now=this.context.currentTime;if(!this.running||this.region!==region){this.stop();this.running=true;this.region=region;this.step=0;this.next=now+.035;this.master.gain.cancelScheduledValues(now);this.master.gain.setValueAtTime(0,now);}
  this.master.gain.setTargetAtTime(options.volume*.55,now,.12);
  // Do not replay a backlog after an interrupted audio device or background tab.
  if(this.next<now-.2)this.next=now+.035;
  let budget=8;while(this.next<now+.18&&budget-->0){for(const note of scoreNotes(region,seconds,this.step))this.note(note,this.next+(note.delay||0));this.step++;this.next+=60/scoreState(region,seconds).bpm/4;}
 }
 note(n,when){if(this.voices.size>=64)return;const c=this.context,gain=c.createGain(),filter=c.createBiquadFilter();let source;const noisy=['hat','snare','cymbal'].includes(n.voice);filter.type=noisy?'highpass':'lowpass';filter.frequency.value=n.voice==='hat'?6500:n.voice==='snare'?1400:n.voice==='bass'?650:THEMES[this.region]?.cutoff||1800;
  if(noisy){source=c.createBufferSource();source.buffer=this.noise;}else{source=c.createOscillator();source.type=n.wave;source.frequency.setValueAtTime(n.voice==='kick'?125:frequency(n.midi),when);if(n.voice==='kick')source.frequency.exponentialRampToValueAtTime(42,when+.17);}
  const attack=n.attack??(n.voice==='pad'?.16:.008);gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(n.gain,when+Math.min(attack,n.duration/3));if(n.hold)gain.gain.setValueAtTime(n.gain*.7,when+n.duration*n.hold);gain.gain.exponentialRampToValueAtTime(.0001,when+n.duration);source.connect(filter);filter.connect(gain);const pan=c.createStereoPanner?.();if(pan){pan.pan.value=n.pan||0;gain.connect(pan);pan.connect(this.master);}else gain.connect(this.master);
  const voice={source,gain,filter};this.voices.add(voice);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();pan?.disconnect();this.voices.delete(voice);};source.start(when);source.stop(when+n.duration+.02);this.scheduled++;
 }
 stop(){if(!this.running)return;const now=this.context.currentTime;this.master.gain.cancelScheduledValues(now);this.master.gain.setTargetAtTime(0,now,.025);for(const v of this.voices){try{v.source.stop(now+.1);}catch{}}this.running=false;}
 status(){const s=scoreState(this.region,this.seconds);return {playing:this.running,context:this.context.state,region:this.region,theme:this.region?s.theme.name:null,intensity:s.intensity,bpm:s.bpm,volume:this.volume,...scorePosition(this.step),voices:this.voices.size,scheduledNotes:this.scheduled};}
}
