// Continuous, mastered orchestral suites. The recordings and edits are credited in audio-credits.html.
export const SUITE_SECONDS=35*60;
export const THEMES=Object.freeze(Object.fromEntries(['ashwood','hollow','cinder','frostmarch','drowned','clockwork','briarheart','sunforge','eclipse','astral'].map(id=>[id,{id,file:`./audio/${id}-suite-v27.m4a`,duration:SUITE_SECONDS}])));
export function suiteFor(region){return THEMES[region]||THEMES.ashwood;}
export function scoreState(region,seconds=0){const t=Math.max(0,Math.min(SUITE_SECONDS,Number(seconds)||0));return {region:suiteFor(region).id,seconds:t,duration:SUITE_SECONDS,phase:t<600?'Overture':t<1200?'The gathering dark':t<1800?'The siege':t<SUITE_SECONDS?'The last eclipse':'Suite complete',intensity:Math.min(1,t/1800)};}
export function validMusicCheckpoint(value){return value&&value.version===27&&Object.hasOwn(THEMES,value.region)&&Number.isFinite(value.seconds)&&value.seconds>=0&&value.seconds<=SUITE_SECONDS?{version:27,region:value.region,seconds:value.seconds}:null;}
