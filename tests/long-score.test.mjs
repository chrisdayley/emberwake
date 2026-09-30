import assert from 'node:assert/strict';
import {THEMES,scoreState,scoreNotes,scorePosition} from '../music.js';
const signatures=new Set(),reports=[];
for(const region of Object.keys(THEMES)){
 const melody=(seconds,start=0)=>Array.from({length:64},(_,i)=>scoreNotes(region,seconds,start+i).filter(n=>n.voice==='lead').map(n=>[n.midi,n.duration]));
 // Catchiness now deliberately uses recurring hooks; random-looking bar diversity was the old failure.
 assert.deepEqual(melody(0,0),melody(0,512),'refrain returns intact');
 assert.notDeepEqual(melody(0,0),melody(0,256),'answer is a distinct melody');
 assert.notDeepEqual(melody(0,0),melody(600,0),'nightfall has a new battle refrain, not just added volume');
 signatures.add(JSON.stringify(melody(0)));
 const acts=[];for(const seconds of [0,300,600,900,1200,1500]){let t=0;const events=[],signature=[];for(let step=0;step<2048;step++){const notes=scoreNotes(region,seconds,step);signature.push(notes);for(const n of notes){assert(Number.isFinite(n.midi)&&n.midi>=0&&n.midi<110);assert(n.duration>0&&n.duration<8);assert(n.gain>0&&n.gain<=.2);events.push([t+(n.delay||0),1],[t+(n.delay||0)+n.duration+.02,-1]);}t+=60/scoreState(region,seconds).bpm/4;}events.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);let live=0,peak=0;for(const [,d]of events){live+=d;peak=Math.max(peak,live);}assert(peak<64,'score fits mobile voice budget');acts.push(JSON.stringify(signature));}
 assert.equal(new Set(acts).size,6);assert.equal(new Set(Array.from({length:8},(_,i)=>scorePosition(i*256).section)).size,8);reports.push({region,loopSeconds:128*240/THEMES[region].bpm,arrangements:6});
}assert.equal(signatures.size,Object.keys(THEMES).length);console.log(JSON.stringify(reports));
