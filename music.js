import {SUITE_SECONDS,THEMES,suiteFor,scoreState,validMusicCheckpoint} from './score.js?v=27';
export {THEMES,scoreState,validMusicCheckpoint};
const SILENCE='data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAAAAA==';
export function musicSettings(s={}){return {enabled:typeof s.music==='boolean'?s.music:s.sound!==false,volume:typeof s.musicVolume==='number'&&Number.isFinite(s.musicVolume)?Math.max(0,Math.min(1,s.musicVolume)):.4};}
// One streamed, pre-crossfaded recording. Never decode an entire 35-minute score into phone RAM.
export class AdaptiveMusic{
 constructor(ctx,{createAudio=()=>new Audio(),now=()=>Date.now()}={}){
  this.ctx=ctx;this.now=now;this.media=createAudio();this.media.preload='metadata';this.media.loop=false;this.media.playsInline=true;this.media.setAttribute?.('playsinline','');
  this.bus=ctx.createGain();this.bus.gain.value=0;this.source=ctx.createMediaElementSource(this.media);this.source.connect(this.bus);this.bus.connect(ctx.destination);
  this.region='';this.runKey='';this.position=0;this.pendingSeek=null;this.wanted=false;this.pending=false;this.serial=0;this.error='';this.retryAt=0;this.playCalls=0;this.ended=false;
  this.media.addEventListener('loadedmetadata',()=>this.seekPending());
  this.media.addEventListener('ended',()=>{if(!this.region||this.media.duration<2000)return;this.ended=true;this.position=SUITE_SECONDS;this.wanted=false;});
  this.media.addEventListener('error',()=>{this.error='Music unavailable; tap to retry when connected.';this.retryAt=this.now()+5000;this.pending=false;});
 }
 begin(region,checkpoint=null,runSeconds=0,runKey=''){
  const theme=suiteFor(region),saved=validMusicCheckpoint(checkpoint);
  this.stop();this.serial++;this.pending=false;this.region=theme.id;this.runKey=runKey;
  this.position=saved?.region===theme.id?saved.seconds:Math.max(0,Math.min(SUITE_SECONDS,Number(runSeconds)||0));
  this.ended=this.position>=SUITE_SECONDS;this.pendingSeek=this.position;this.error='';this.retryAt=0;
  this.media.src=theme.file;this.media.load();
 }
 seekPending(){if(this.pendingSeek===null||!Number.isFinite(this.media.duration))return;try{this.media.currentTime=Math.min(this.pendingSeek,Math.max(0,this.media.duration-.03));this.pendingSeek=null;}catch{}}
 unlock(){// Called on real user gestures; retries autoplay/network failures without rewinding.
  if(this.now()-(this.lastUnlock??-Infinity)<500)return;this.lastUnlock=this.now();this.retryAt=0;if(!this.region&&!this.primed){this.primed=true;this.media.src=SILENCE;const serial=this.serial;try{Promise.resolve(this.media.play()).then(()=>{if(serial===this.serial&&!this.wanted)this.media.pause();}).catch(()=>{});}catch{}}if(this.wanted)this.play();
 }
 play(){
  if(this.pending||this.ended||!this.wanted||this.now()<this.retryAt)return;
  if(!this.media.paused)return;
  if(this.media.error){this.pendingSeek=this.position;this.media.load();}
  this.seekPending();this.pending=true;const serial=this.serial;this.playCalls++;
  try{Promise.resolve(this.media.play()).then(()=>{if(serial!==this.serial)return;this.pending=false;this.error='';this.seekPending();if(!this.wanted)this.media.pause();}).catch(()=>{if(serial!==this.serial)return;this.pending=false;this.error='Tap to enable music.';this.retryAt=this.now()+5000;});}catch{this.pending=false;this.retryAt=this.now()+5000;}
 }
 update(region,seconds,playing,settings={},hidden=false){
  if(!this.region||this.region!==suiteFor(region).id)this.begin(region,null,seconds);
  const config=musicSettings(settings);
  this.wanted=!!playing&&config.enabled&&!hidden&&this.ctx.state==='running'&&!this.ended;
  this.bus.gain.setTargetAtTime(config.volume*.8,this.ctx.currentTime,.06);
  if(this.wanted)this.play();else this.stop();
  if(this.pendingSeek===null&&Number.isFinite(this.media.currentTime))this.position=Math.min(SUITE_SECONDS,this.media.currentTime);
 }
 stop(){this.wanted=false;if(!this.media.paused)this.media.pause();if(this.pendingSeek===null&&Number.isFinite(this.media.currentTime))this.position=Math.min(SUITE_SECONDS,this.media.currentTime);}
 checkpoint(){return this.region?{version:27,region:this.region,seconds:this.ended?SUITE_SECONDS:this.pendingSeek??this.position}:null;}
 status(){return {...scoreState(this.region,this.position),playing:!this.media.paused&&!this.ended,context:this.ctx.state,format:'recorded-orchestral-suite',loop:false,readyState:this.media.readyState,recordingDuration:Number.isFinite(this.media.duration)?this.media.duration:null,buffered:this.media.buffered?.length||0,error:this.error,playCalls:this.playCalls,source:this.media.currentSrc||this.media.src,runKey:this.runKey};}
 dispose(){this.stop();this.serial++;this.media.removeAttribute?.('src');this.media.load();this.source.disconnect();this.bus.disconnect();}
}
