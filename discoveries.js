import {safePoint} from './world.js?v=21';
import {GUARDIANS,REGIONAL_ENEMIES} from './bestiary.js?v=21';
export const DISCOVERIES={
 vault:{name:'Sealed vault',icon:'▣',color:'#ffd17e',reward:'Gold + 5 upgrades + gear'},
 altar:{name:'Spell altar',icon:'✦',color:'#cfadff',reward:'Choose an Ascension + gold'},
 spring:{name:'Life sanctuary',icon:'♥',color:'#9df1c6',reward:'Full healing + 30 max health + revive'}
};
const TAU=Math.PI*2;
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
export function siteGuardian(region,kind){const i=['vault','altar','spring'].indexOf(kind);return GUARDIANS[region]?.[i]||['brute','juggernaut','champion'][i];}
export const SITE_SPACING=2600;
export function guardianHealth(g){const m=g.time/60;return (650+250*m+45*m*m)*(8+Math.min(8,m*.4))*(1+Math.min(2,g.discoveriesCleared*.15))*g.regionalStrength().health;}
export function ensureDiscoveries(g){
 // Move only unseen, unencountered legacy sites. Earned loot and known fights stay put.
 if(g.discoveryLayoutVersion!==2){g.discoveries=g.discoveries.filter(s=>s.discovered||s.state!=='sealed'||s.guardianMaxHp);g.discoveryLayoutVersion=2;}
 const distance=s=>Math.hypot(s.x-g.player.x,s.y-g.player.y);
 const claimed=g.discoveries.filter(s=>s.state==='claimed'&&distance(s)<9000).slice(-8);
 const active=g.discoveries.filter(s=>s.state!=='claimed'&&(s.discovered||distance(s)<11000));
 g.discoveries=[...active,...claimed];
 let nearby=active.filter(s=>distance(s)<7000).length;
 while(nearby<3&&active.length<12){const id=++g.discoverySerial,kind=['vault','altar','spring'][(id-1)%3],seed=id+(g.region==='hollow'?17:g.region==='cinder'?39:0);let point=null;
  for(let attempt=0;attempt<48;attempt++){const angle=hash(seed+attempt*.17)*TAU,dist=3200+hash(seed+4+attempt*.31)*1600;const candidate=safePoint(g.region,g.player.x+Math.cos(angle)*dist,g.player.y+Math.sin(angle)*dist);
   if(distance(candidate)>=3000&&g.discoveries.every(s=>Math.hypot(candidate.x-s.x,candidate.y-s.y)>=SITE_SPACING)){point=candidate;break;}}
  // Never relax the separation rule when an area is full; explore farther instead.
  if(!point)break;
  const site={id,kind,...point,state:'sealed',discovered:false,guardianId:null};g.discoveries.push(site);active.push(site);nearby++;
 }
}
export function awakenSite(g,site){
 if(site.state!=='sealed'||g.enemies.some(e=>e.boss&&e.hp>0))return false;
 const e=g.spawn(siteGuardian(g.region,site.kind),false,true);
 e.x=site.x;e.y=site.y-55;e.siteId=site.id;e.maxHp=site.guardianMaxHp||guardianHealth(g);e.hp=site.guardianHp??e.maxHp;e.r=34;e.speed=65*g.regionalStrength().speed;e.attack=2.5;
 e.title=({ashwood:{vault:'Vaultroot Sentinel',altar:'Runestone Keeper',spring:'Heartwood Guardian'},hollow:{vault:'Widow of the Vault',altar:'Keeper of Lost Spells',spring:'The Lifebound Monarch'},cinder:{vault:'Crater Hoardkeeper',altar:'Wyrm of the Forge',spring:'The Ember Warden'}}[g.region]||{vault:'Keeper of the Sealed Vault',altar:'Keeper of Lost Arts',spring:'Guardian of the Captive'})[site.kind];
 if(REGIONAL_ENEMIES[e.type]?.challenge)e.title=REGIONAL_ENEMIES[e.type].name;
 site.guardianId=e.id;site.state='guarded';site.discovered=true;g.emit('warning',{text:e.title+' awakens · Defeat it to unseal the '+DISCOVERIES[site.kind].name.toLowerCase()});return true;
}
export function guardSite(g,e,dt){if(!e.siteId)return false;const s=g.discoveries.find(s=>s.id===e.siteId);if(!s)return false;
 if(Math.hypot(g.player.x-s.x,g.player.y-s.y)<=480)return false;
 // Retreat is allowed. No healing/reset, no chasing you across the whole map.
 s.guardianHp=e.hp;s.guardianMaxHp=e.maxHp;s.guardianId=null;s.state='sealed';e.hp=0;return true;
}
export function unlockSite(g,e){if(!e.siteId)return;const s=g.discoveries.find(s=>s.id===e.siteId);if(!s||s.state!=='guarded')return;s.state='ready';s.guardianId=null;g.emit('warning',{text:DISCOVERIES[s.kind].name+' unsealed · Return to claim '+DISCOVERIES[s.kind].reward.toLowerCase()});}
export function claimSite(g,s){if(s.state!=='ready'||g.mode!=='playing'||g.player.hp<=0)return false;
 // Mark before rewarding: save callbacks and repeated pickup frames cannot duplicate it.
 s.state='claimed';g.discoveriesCleared++;g.invuln=Math.max(g.invuln,3);
 if(s.kind==='vault'){g.openChest({kind:'chest',boss:true,rewards:5,gold:180+Math.floor(g.time/60)*18});}
 else if(s.kind==='altar'){g.gainGold(80+Math.floor(g.time/60)*8);g.objectiveChoice=true;g.discoveryChoice=true;g.offers();g.mode='levelup';g.emit('levelup');}
 else {g.upgrade('ascend_vigor');g.upgrade('ascend_vigor');g.player.hp=g.maxHp();g.revives++;g.gainGold(40);g.emit('warning',{text:'Sanctuary blessing · Fully healed · +30 max health · +1 revive (this run)'});}
 g.emit('discovery');return true;
}
export function stepDiscoveries(g){if(g.mode!=='playing'||g.player.hp<=0)return;
 if(g.time>=g.nextDiscoveryScan){ensureDiscoveries(g);g.nextDiscoveryScan=g.time+2;}
 for(const s of g.discoveries){const d=Math.hypot(g.player.x-s.x,g.player.y-s.y);if(!s.discovered&&d<380){s.discovered=true;g.emit('warning',{text:DISCOVERIES[s.kind].name+' found · '+DISCOVERIES[s.kind].reward+' · Approach to challenge'});}
  if(s.state==='sealed'&&d<135)awakenSite(g,s);
  if(s.state==='ready'&&d<48){claimSite(g,s);if(g.mode!=='playing')break;}
 }
}
