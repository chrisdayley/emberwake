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

Arrives once at 30:00 with 3,000,000 HP, even if another boss is alive. Ordinary builds cannot damage its ward. Three covenants break the ward, add a bounded percentage-health strike and protect against single lethal hits:

- Hourglass covenant: evolved Clock needle + evolved Frost aegis.
- Solar judgment: evolved Solar writ + evolved Prism ray + Stone oath rank 3.
- Midnight pact: evolved Crimson bloom + evolved Reaping crescent + Springwater rank 3.

Each evolution requires weapon rank 8, its documented rank-2 passive partner, and a treasure chest. Recipes remain visible before unlocking spells. The boss uses red pursuit strikes, increased attacks and speed under half health. Victory grants 3,000 expedition gold and Eclipse Throne. Running past 30 minutes or banking early remains optional.

## Research and original design

Vampire Survivors uses achievements for characters/weapons and branching normal, bonus, challenge and hidden stages. Stage-specific relic objectives provide reasons to revisit locations. Specialized evolved equipment provides a progression route into otherwise overwhelming end-of-run encounters. Emberwake uses these patterns with original content, explicit recipes and immediate unlock persistence.

Sources consulted:
- https://vampire-survivors.fandom.com/wiki/Stages
- https://poncle.games/adventures-faq — official stage-specific Atlas Gate objective
- https://www.pcgamesn.com/vampire-survivors/unlock-characters
- https://www.pcgamesn.com/vampire-survivors/weapon-evolutions
- https://www.pocketgamer.com/vampire-survivors/red-death/

## Verification

15 Node suites cover legacy-save migration/import, locked pools/forge purchases, six stage reward paths, terrain clearance, ranged caps, all 22 spells at rank one and evolved, existing region balance, soundtrack/menu continuity, and boss spawn/persistence. Three controlled moving-combat pilots defeat the boss with legal late-game loadouts in approximately 172, 41 and 60 seconds; these isolate the boss from ambient hordes and do not represent full expedition difficulty. Browser sandbox uses actual game/renderer modules without accessing localStorage.
