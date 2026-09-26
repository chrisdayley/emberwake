# The Wayfinder’s Chronicle — v19

An additive campaign expansion: 6 special stages, 6 characters, 6 rank-eight spells and 21 achievements. Existing characters, original 16 spells, gear, gold, spellcraft and suspended expeditions stay owned. The save key and schema remain unchanged; optional Chronicle records capture future achievements and use available historical records where possible. Previously unrecorded boss/discovery feats must be performed again.

## Branching expeditions

| Stage | Opens after | Distinct challenge | Rescue / survive 10 minutes |
|---|---|---|---|
| Frostmarch | Defeat an Ashwood guardian | Blizzards, shelter braziers, ice beasts | Eira / Frost aegis |
| Drowned Archive | 10 minutes in Violet Hollow | Flooded shelves, reversing tidal currents, coral creatures | Neris / Coral chorus |
| Clockwork Spire | 10 minutes in Frostmarch | Alternating clock traps, brass pillars, constructs | Orrin / Clock needle |
| Briarheart Garden | Evolve two weapons in one expedition | Hedge passages, pursuing bloom strikes, thorn creatures | Rosa / Crimson bloom |
| Sunforge Citadel | 10 minutes in Cinder Wastes | Crossing lava canals, narrow bridges, solar constructs | Helion / Solar writ |
| Eclipse Throne | Defeat the Last Eclipse | Void ring traps, accelerated elite arrivals, celestial foes | Vesper / Night singularity |

Each special stage has four enemy types introduced at minutes 0, 1, 3 and 5, plus two named guardians. Claim a guarded discovery to rescue its character. Later stages scale harder without scaling against the player's current equipment. The five-ranged-enemy cap and widely separated guarded discoveries are retained. Each stage also has its own 128-bar musical arrangement.

Briar, Lyra and Sol now unlock from 50 lifetime kills, level 12, and surviving five minutes respectively. Purchased characters are grandfathered in. All new spells can be strengthened in the permanent Spellcraft forge after unlocking.

## The Last Eclipse

Arrives once at 30:00 with 3,000,000 HP, even if another boss is alive. **Every weapon deals normal damage.** There is no ward, required recipe, automatic health regeneration, secret damage multiplier or percentage-health shortcut.

- Contact damage starts at roughly 430 before defenses in Ashwood; regional damage scaling still applies. Red pursuit strikes deal 280, rising to 340 below half health. Movement and attack frequency also increase when enraged.
- Winter bloom and Clock needle can freeze its movement, contact hits and new casts for up to 1.6 seconds. A 0.65-second thaw prevents an effortless permanent lock; chill still slows pursuit by 45%. Previously cast red strikes remain dangerous.
- Stone oath adds 8% damage reduction per rank alongside its existing armor. Evolved Frost aegis adds 30% reduction and its refreshing shield. These effects work independently against all damage, with no boss-specific hit cap.
- Health, recovery, life-stealing equipment, recharge, damage and Ascensions support freely chosen builds. The Unlocks page offers strategy suggestions rather than mandatory combinations.

Existing boss saves keep current HP, position, rewards and spawn state. Freeze timers persist with the enemy. Victory still grants 3,000 expedition gold and Eclipse Throne. Banking early remains optional.

## Research and original design

Vampire Survivors uses achievements for characters/weapons and branching normal, bonus, challenge and hidden stages. Stage-specific relic objectives provide reasons to revisit locations. Specialized evolved equipment provides a progression route into otherwise overwhelming end-of-run encounters. Emberwake uses these patterns with original content, explicit recipes and immediate unlock persistence.

Sources consulted:
- https://vampire-survivors.fandom.com/wiki/Stages
- https://poncle.games/adventures-faq — official stage-specific Atlas Gate objective
- https://www.pcgamesn.com/vampire-survivors/unlock-characters
- https://www.pcgamesn.com/vampire-survivors/weapon-evolutions
- https://www.pocketgamer.com/vampire-survivors/red-death/

## Verification

16 Node suites cover legacy saves, unlocks, all weapons, stage terrain, balance, audio continuity and the boss. Boss-specific tests check normal damage from all 22 weapons, no regeneration or hidden bonuses, freeze/thaw behavior, saved freeze state, still-dangerous pre-cast attacks, independent damage reduction/shielding and legal six-weapon combat pilots. Pilots isolate the boss from ambient hordes and do not represent full expedition difficulty. Browser sandbox uses actual game/renderer modules without accessing localStorage.
