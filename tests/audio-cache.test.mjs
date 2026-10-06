import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const handlers={},writes=[];let fetches=0;
const scope={URL,Response,self:{location:{origin:'https://example.test'},addEventListener:(name,handler)=>handlers[name]=handler},caches:{open:async()=>({put:(request,response)=>writes.push(request.url)}),match:async()=>undefined},fetch:async()=>{fetches++;return {ok:true,type:'basic',clone(){return this;}};}};
vm.runInNewContext(fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8'),scope);
function request(path,range=false){let response;handlers.fetch({request:{method:'GET',url:'https://example.test/emberwake/'+path,headers:{has:key=>key==='range'&&range}},respondWith:p=>response=p});return response;}
assert.equal(request('audio/ashwood-suite-v27.m4a',true),undefined,'streamed ranges must reach the browser network stack');assert.equal(request('audio/ashwood-suite-v27.m4a'),undefined,'never cache entire long scores in the shell cache');assert.equal(fetches,0);
await request('audio/sfx/steps.m4a');await Promise.resolve();assert.equal(fetches,1);assert.equal(writes.length,1,'small full-file foley responses can be cached offline');assert.equal(request('audio/sfx/steps.m4a',true),undefined);
console.log('Safari byte-range streaming bypasses the app cache; small foley files retain offline caching');
