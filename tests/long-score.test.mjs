import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {AdaptiveMusic,musicSettings,validMusicCheckpoint,THEMES,scoreState} from '../music.js';
import {context,Media} from './audio-mocks.mjs';
import {Game} from '../engine.js';import {freshSave} from '../data.js';
const plan=JSON.parse(readFileSync(new URL('../scripts/suite-plan.json',import.meta.url)));
assert.equal(Object.keys(THEMES).length,10);assert.equal(new Set(Object.values(THEMES).map(t=>t.file)).size,10);
for(const [region,parts] of Object.entries(plan.suites)){const cues=parts.flat();assert.equal(new Set(cues).size,cues.length,region+' never reuses a recording');assert.equal(THEMES[region].duration,2100);assert.equal(scoreState(region,1800).intensity,1);assert.equal(scoreState(region,2100).phase,'Suite complete');}
assert.equal(new Set(Object.values(plan.suites).map(p=>JSON.stringify(p))).size,10);
assert.deepEqual(musicSettings({sound:false}),{enabled:false,volume:.4});assert.deepEqual(musicSettings({sound:false,music:true,musicVolume:.7}),{enabled:true,volume:.7});assert.equal(musicSettings({musicVolume:NaN}).volume,.4);
let now=0;const ctx=context(),media=new Media(),music=new AdaptiveMusic(ctx,{createAudio:()=>media,now:()=>now});
music.begin('hollow',null,600,'test');music.update('hollow',600,true,{music:true});await Promise.resolve();assert.equal(media.currentTime,600);assert.equal(media.plays,1);assert.equal(media.loop,false);
media.currentTime=700;music.update('hollow',610,true,{music:true});assert.equal(media.currentTime,700,'menus must not resync backward to combat clock');assert.equal(media.plays,1);
const save=freshSave(),game=new Game(save);game.region='hollow';game.time=610;
const bridge=vm.createContext({music,foley:null,game,save,document:{hidden:false,querySelector:()=>null}});const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');vm.runInContext(app.split('\n').find(x=>x.startsWith('function updateMusic()')),bridge);
for(const mode of ['levelup','chest','playing']){game.mode=mode;media.currentTime+=2;vm.runInContext('updateMusic()',bridge);assert(!media.paused);assert.equal(media.plays,1);}
assert.equal(game.time,610);assert.equal(music.checkpoint().seconds,706);
for(const mode of ['paused','down','ended']){game.mode=mode;vm.runInContext('updateMusic()',bridge);assert(media.paused);}
game.mode='playing';vm.runInContext('updateMusic()',bridge);await Promise.resolve();assert.equal(media.currentTime,706);assert.equal(media.plays,2);
bridge.document.hidden=true;vm.runInContext('updateMusic()',bridge);assert(media.paused);bridge.document.hidden=false;vm.runInContext('updateMusic()',bridge);await Promise.resolve();assert(!media.paused);
music.update('hollow',610,true,{music:false});assert(media.paused);music.update('hollow',610,true,{music:true});await Promise.resolve();assert.equal(media.currentTime,706);
const checkpoint=music.checkpoint();const restored=new AdaptiveMusic(context(),{createAudio:()=>new Media()});restored.begin('hollow',checkpoint,610,'test');assert.equal(restored.media.currentTime,706);
media.currentTime=2100;media.listeners.ended();music.update('hollow',2200,true,{music:true});assert.equal(music.status().playing,false);assert.equal(music.checkpoint().seconds,2100);const plays=media.plays;music.update('hollow',2300,true,{music:true});assert.equal(media.plays,plays,'never loop after suite ends');
music.begin('ashwood',null,0,'new');music.update('ashwood',0,true,{music:true});await Promise.resolve();assert.equal(media.currentTime,0);assert.equal(music.status().region,'ashwood');
for(const value of [null,{version:26,region:'hollow',seconds:2},{version:27,region:'bad',seconds:3},{version:27,region:'hollow',seconds:-2},{version:27,region:'hollow',seconds:Infinity}])assert.equal(validMusicCheckpoint(value),null);
const failure=new Media();failure.reject=true;const retry=new AdaptiveMusic(context(),{createAudio:()=>failure,now:()=>now});retry.update('hollow',120,true,{music:true});await Promise.resolve();await Promise.resolve();for(let i=0;i<100;i++)retry.update('hollow',120,true,{music:true});assert.equal(failure.plays,1,'autoplay rejection does not flood promises');failure.reject=false;retry.unlock();await Promise.resolve();assert.equal(failure.currentTime,120);assert.equal(failure.plays,2);
console.log('35-minute suites: ten maps, no repeated cues, menu continuity, resume, pause, mute, autoplay retry and natural ending passed');
