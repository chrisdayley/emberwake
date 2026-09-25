import assert from 'node:assert/strict';
import {THEMES,scoreState,scoreNotes,scorePosition} from '../dist/music.js';
const results=[];
for(const region of Object.keys(THEMES)){
 const blocks=[],bars=[],events=[];let t=0;
 for(let block=0;block<32;block++)blocks.push(JSON.stringify(Array.from({length:64},(_,j)=>scoreNotes(region,0,block*64+j))));
 for(let bar=0;bar<128;bar++)bars.push(JSON.stringify(Array.from({length:16},(_,j)=>scoreNotes(region,0,bar*16+j).filter(n=>n.voice==='lead'))));
 assert(new Set(blocks).size>=28,region+' needs distinct four-bar passages');assert(new Set(bars).size>=60,region+' needs varied melody bars');
 const levels=[0,120,240,420,600,900,1200,1500].map(seconds=>{let count=0;const voices=new Set();for(let s=0;s<2048;s++){for(const n of scoreNotes(region,seconds,s)){count++;voices.add(n.voice);assert(Number.isFinite(n.midi)&&n.midi>=0&&n.midi<110);assert(n.duration>0&&n.duration<8);assert(n.gain>0&&n.gain<=.2);}}return {seconds,count,voices:[...voices]};});
 for(let j=1;j<levels.length;j++)assert(levels[j].count>levels[j-1].count||(levels[j].seconds===1500&&levels[j].count===levels[j-1].count),region+' must develop at each survival milestone');
 for(let step=0;step<2048;step++){for(const n of scoreNotes(region,1500,step)){events.push([t+(n.delay||0),1]);events.push([t+(n.delay||0)+n.duration+.02,-1]);}t+=60/scoreState(region,1500).bpm/4;}
 events.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);let concurrent=0,max=0;for(const [,delta]of events){concurrent+=delta;max=Math.max(max,concurrent);}assert(max<64,'Composition must fit voice cap without dropping music');
 assert.equal(new Set(Array.from({length:8},(_,i)=>scorePosition(i*256).section)).size,8);
 results.push({region,openingLoopSeconds:128*4*60/THEMES[region].bpm,distinctFourBarPassages:new Set(blocks).size,distinctMelodyBars:new Set(bars).size,maxConcurrentVoices:max,levels});
}
console.log(JSON.stringify(results,null,2));
