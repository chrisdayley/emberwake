// Deterministic terrain shared by combat, objectives, and drawing.
export const cell=(v,size)=>Math.floor((v+size/2)/size);
const wallCache=new Map();
export function obstacles(region,x,y){if(region!=='hollow')return [];const blocks=[];const cx=cell(x,560),cy=cell(y,560),key=cx+','+cy;if(wallCache.has(key))return wallCache.get(key);for(let i=cx-1;i<=cx+1;i++)for(let j=cy-1;j<=cy+1;j++){const ox=i*560,oy=j*560;for(const sign of [-1,1]){blocks.push({x:ox+sign*175-48,y:oy-175-20,w:96,h:40});blocks.push({x:ox+sign*175-48,y:oy+175-20,w:96,h:40});blocks.push({x:ox+sign*235-20,y:oy-54,w:40,h:108});}}if(wallCache.size>=64)wallCache.delete(wallCache.keys().next().value);wallCache.set(key,blocks);return blocks;}
export function resolveTerrain(region,p,r=11){for(const b of obstacles(region,p.x,p.y)){if(p.x<b.x-r||p.x>b.x+b.w+r||p.y<b.y-r||p.y>b.y+b.h+r)continue;const nx=Math.max(b.x,Math.min(b.x+b.w,p.x)),ny=Math.max(b.y,Math.min(b.y+b.h,p.y)),dx=p.x-nx,dy=p.y-ny,d=Math.hypot(dx,dy);if(d>=r)continue;if(d>0){p.x+=dx/d*(r-d);p.y+=dy/d*(r-d);}else{const sides=[{n:p.x-b.x+r,x:b.x-r,y:p.y},{n:b.x+b.w-p.x+r,x:b.x+b.w+r,y:p.y},{n:p.y-b.y+r,x:p.x,y:b.y-r},{n:b.y+b.h-p.y+r,x:p.x,y:b.y+b.h+r}].sort((a,b)=>a.n-b.n);p.x=sides[0].x;p.y=sides[0].y;}}return p;}
export function lavaAt(x,y){const lane=x-cell(x-320,640)*640-320,bridge=y-cell(y,520)*520;return Math.abs(lane)<52&&Math.abs(bridge)>68;}
export function riftAt(x,y,time){const cx=cell(x-280,560)*560+280,cy=cell(y-280,560)*560+280,phase=((time+cell(cx,560)*3+cell(cy,560)*5)%24+24)%24;return {x:cx,y:cy,r:92,near:Math.hypot(x-cx,y-cy)<92,warning:phase>=14&&phase<17,active:phase>=17,phase};}
export function isSafePoint(region,x,y,r=32){
 if(region==='cinder'&&lavaAt(x,y))return false;
 if(region==='hollow'){
  const rift=riftAt(x,y,0);if(Math.hypot(x-rift.x,y-rift.y)<rift.r+r)return false;
  for(const b of obstacles(region,x,y)){const dx=x-Math.max(b.x,Math.min(b.x+b.w,x)),dy=y-Math.max(b.y,Math.min(b.y+b.h,y));if(Math.hypot(dx,dy)<r-.001)return false;}
 }
 return true;
}
export function safePoint(region,x,y){
 if(isSafePoint(region,x,y))return {x,y};
 const p=resolveTerrain(region,{x,y},32);
 if(region==='cinder'&&lavaAt(p.x,p.y))p.x+=p.x-(cell(p.x-320,640)*640+320)>=0?90:-90;
 if(region==='hollow'){const r=riftAt(p.x,p.y,0);if(Math.hypot(p.x-r.x,p.y-r.y)<r.r+32)p.x=r.x+125;}
 resolveTerrain(region,p,32);if(isSafePoint(region,p.x,p.y))return p;
 // Narrow passages can be smaller than the desired pickup clearance. Search
 // nearby open ground instead of repeatedly pushing between adjacent walls.
 for(let radius=40;radius<=320;radius+=40)for(let i=0;i<16;i++){const a=i*Math.PI/8,q={x:x+Math.cos(a)*radius,y:y+Math.sin(a)*radius};if(isSafePoint(region,q.x,q.y))return q;}
 return p;
}
export function ensureRegions(save){save.regionBest??={};save.unlockedRegions??=['ashwood'];const unlocked=new Set(save.unlockedRegions);unlocked.add('ashwood');if(save.stats.bestTime>=600||save.stats.wins>=1||save.region==='hollow'||save.region==='cinder')unlocked.add('hollow');if(save.stats.wins>=3||save.region==='cinder')unlocked.add('cinder');for(const h of save.history||[])if(h.region)save.regionBest[h.region]=Math.max(save.regionBest[h.region]||0,h.time);if(save.run)save.regionBest[save.run.region]=Math.max(save.regionBest[save.run.region]||0,save.run.time);if((save.regionBest.ashwood||0)>=600)unlocked.add('hollow');if((save.regionBest.hollow||0)>=600)unlocked.add('cinder');save.unlockedRegions=[...unlocked];return save;}
export function recordRegion(save,game){ensureRegions(save);const before=new Set(save.unlockedRegions);save.regionBest[game.region]=Math.max(save.regionBest[game.region]||0,game.time);if(game.time>=600){const next=game.region==='ashwood'?'hollow':game.region==='hollow'?'cinder':null;if(next&&!before.has(next))save.unlockedRegions.push(next);}return save.unlockedRegions.filter(id=>!before.has(id));}
export const regionUnlocked=(save,id)=>save.unlockedRegions?.includes(id)||id==='ashwood';
