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

- The rotating moveset includes two predictive dart bursts, a fast straight rush, a projectile wheel with a gap, and ground pursuit marks. Dart/rush aim tracks early, then locks for 0.4 seconds; dashed red tells become solid. Changing direction, sidestepping and gap positioning require different responses. Below half health, volleys/wheels get denser and recovery falls from 1.4 to 0.9 seconds. At most 36 Eclipse projectiles can coexist.
- Contact damage starts at roughly 430 before defenses in Ashwood; regional damage scaling still applies. Red pursuit strikes deal 280, rising to 340 below half health. Movement and attack frequency also increase when enraged.
- Winter bloom and Clock needle can freeze its movement, contact hits and new casts for up to 1.6 seconds. A 0.65-second thaw prevents an effortless permanent lock; chill still slows pursuit by 45%. Previously cast red strikes and projectiles remain dangerous.
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

20 Node suites cover legacy saves, unlocks, all weapons, stage terrain, balance, audio continuity and the boss. Boss-specific tests check normal damage from all 22 weapons, no regeneration or hidden bonuses, freeze/thaw behavior, saved freeze and charge state, attack tells and locked aim, projectile caps and swept collision, predictable versus reactive movement, still-dangerous pre-cast attacks, independent damage reduction/shielding and legal six-weapon combat pilots. Pilots isolate the boss from ambient hordes and do not represent full expedition difficulty. Browser sandbox uses actual game/renderer modules without accessing localStorage.

## Spell signatures and rewarding treasure (v23)

Every spell has two signature investment tracks alongside the unchanged Potency, Fluency and Awakening tracks. Extra blades/bolts, chain jumps, piercing, impact area, beam width, poison lifetime/tick frequency, shield capacity and healing have real combat effects. Springwater and Ironbark have dedicated health/recovery tracks that activate only after acquiring the passive. Existing track IDs, levels, gold spent, equipment and suspended-run spellcraft stay intact. Signature investments apply to new expeditions. Frost/chrono duration increases also raise the Last Eclipse freeze ceiling proportionally; its thaw interval remains.

All 48 signature tracks are covered by combat-effect tests. Real save import validation roundtrips maximum investments and a suspended run. Spell refunds include both old and new spending.

Loot rarity rises much faster over survival time. At 30 minutes, ordinary gear drops are 35% Epic, 25% Legendary, 8% Mythic and 2% Godly. Bosses guarantee gear and improve rarity further by encounter class and starting health. Minimums: ordinary boss Uncommon; overlord Rare; treasure vault guardian Epic (Legendary from 250,000 starting HP); Last Eclipse Mythic. Defeated enemy reward context persists with the chest/site through saves. Odds shown in the Armory are generated from the actual loot function. Gear temper levels and duplicate compensation are unchanged.

## Boss trophy weapons (v24)

Five guaranteed victory unlocks add combat weapons to the level-up pool, not to the equipment inventory. They can roll in the same expedition after its next checkpoint if a weapon slot remains, or on later expeditions. Existing six-slot/rank-eight/evolution rules apply. All five have damage/recharge/opening mastery plus two signature upgrades. There are now 27 combat weapons and 58 signature tracks including health passives.

| Weapon | Guaranteed unlock | Behavior | Evolution pair |
|---|---|---|---|
| Thunder crown | Defeat the 20-minute overlord on any map | Multiple independent lightning impacts | Cinder heart |
| Hourglass cannon | Defeat the 25-minute overlord on any map | Heavy piercing shells apply chill and Eclipse freeze | Quickening |
| Reaper’s verdict | Defeat the Last Eclipse on any map | Crossing spectral blades through a target and its surroundings | Deadeye |
| Briar vengeance | Defeat Ashwood's Sealed vault guardian | Bramble pulses and free retaliation, limited to once per 2 seconds | Stone oath |
| Furnace comet | Defeat Cinder's Sealed vault guardian | Impact blast plus lingering burning fields | Wide horizon |

The new milestone encounters queue at 20:00 and 25:00 and wait for an existing live boss to be cleared. They appear once each per expedition; flags and living encounter identity survive saves. Merely surviving or holding an earlier boss until the threshold does not count. Existing recorded Eclipse victories receive Reaper’s verdict retroactively; earlier guardian/milestone kills cannot be inferred and require the matching new victory record. Guardian state is made ready before the defeat checkpoint so an immediate reload retains the unsealed vault.
