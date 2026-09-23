// Original adaptive score. Audio state never enters the game's RNG or save snapshot.
export const THEMES={
 ashwood:{name:'Embers in the Leaves',root:50,bpm:78,wave:'triangle',cutoff:1800,chords:[0,5,3,7],melody:[12,7,10,14,12,7,5,10,12,15,14,10,7,10,5,7]},
 hollow:{name:'The Glass Choir',root:45,bpm:88,wave:'sine',cutoff:2400,chords:[0,8,5,7],melody:[19,12,15,14,19,22,20,15,17,12,15,19,14,10,12,7]},
 cinder:{name:'March of the Furnace',root:48,bpm:104,wave:'sawtooth',cutoff:1100,chords:[0,0,8,7],melody:[0,7,12,7,3,7,15,12,8,15,20,15,7,14,19,10]}
};
export function musicSettings(settings={}){return {enabled:typeof settings.music==='boolean'?settings.music:settings.sound!==false,volume:Number.isFinite(settings.musicVolume)?Math.max(0,Math.min(1,settings.musicVolume)):.4};}
export function scoreState(region,seconds){const theme=THEMES[region]||THEMES.ashwood,intensity=Math.min(1,Math.max(0,seconds)/1200);return {theme,intensity,bpm:theme.bpm+Math.round(intensity*28)};}
export function scoreNotes(region,seconds,step){
 const {theme:t,intensity:i,bpm}=scoreState(region,seconds),beat=60/bpm,s=step%16,bar=Math.floor(step/16),chord=t.root+t.chords[bar%4],notes=[];
 const add=(voice,midi,duration,gain,wave='triangle')=>notes.push({voice,midi,duration,gain,wave});
 if(s===0){for(const interval of [0,7,15])add('pad',chord+interval,beat*3.8,.018,'sine');}
 if(s%4===0)add('bass',chord-12+(s===12?7:0),beat*.72,.075,'triangle');
 if(s%2===0||i>.65){const index=(bar%2)*8+Math.floor(s/2),note=t.root+t.melody[index%16];add('lead',note+(region==='cinder'?12:0),beat*(region==='hollow'?.85:.42),region==='cinder'?.033:.058,t.wave);if(region==='hollow')add('bell',note+12,beat*1.1,.013,'sine');}
 if(s===0||s===8||(i>.35&&s===10)||(i>.7&&s===14))add('kick',36,.22,.19,'sine');
 if(i>.12&&(s===4||s===12))add('snare',0,.13,.045);
 if(i>.25&&s%2===0||i>.75)add('hat',0,.055,.018+i*.012);
 if(i>.5&&s%4===2)add('pulse',chord+7,beat*.23,.027,'triangle');
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
  let budget=8;while(this.next<now+.18&&budget-->0){for(const note of scoreNotes(region,seconds,this.step))this.note(note,this.next);this.step++;this.next+=60/scoreState(region,seconds).bpm/4;}
 }
 note(n,when){if(this.voices.size>=64)return;const c=this.context,gain=c.createGain(),filter=c.createBiquadFilter();let source;filter.type=n.voice==='hat'||n.voice==='snare'?'highpass':'lowpass';filter.frequency.value=n.voice==='hat'?6500:n.voice==='snare'?1400:n.voice==='bass'?650:THEMES[this.region]?.cutoff||1800;
  if(n.voice==='hat'||n.voice==='snare'){source=c.createBufferSource();source.buffer=this.noise;}else{source=c.createOscillator();source.type=n.wave;source.frequency.setValueAtTime(n.voice==='kick'?125:frequency(n.midi),when);if(n.voice==='kick')source.frequency.exponentialRampToValueAtTime(42,when+.17);}
  const attack=n.voice==='pad'?.16:.008;gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(n.gain,when+Math.min(attack,n.duration/3));gain.gain.exponentialRampToValueAtTime(.0001,when+n.duration);source.connect(filter);filter.connect(gain);gain.connect(this.master);
  const voice={source,gain,filter};this.voices.add(voice);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();this.voices.delete(voice);};source.start(when);source.stop(when+n.duration+.02);this.scheduled++;
 }
 stop(){if(!this.running)return;const now=this.context.currentTime;this.master.gain.cancelScheduledValues(now);this.master.gain.setTargetAtTime(0,now,.025);for(const v of this.voices){try{v.source.stop(now+.1);}catch{}}this.running=false;}
 status(){const s=scoreState(this.region,this.seconds);return {playing:this.running,context:this.context.state,region:this.region,theme:this.region?s.theme.name:null,intensity:s.intensity,bpm:s.bpm,volume:this.volume,voices:this.voices.size,scheduledNotes:this.scheduled};}
}
