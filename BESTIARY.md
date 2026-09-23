# Emberwake: regional bestiary (v11)

Violet Hollow and Cinder Wastes now have completely exclusive creatures from the opening wave onward. Ashwood keeps its forest roster. Each new region has eight regular species and four separate guardian silhouettes.

## Violet Hollow

| Creature | First minute | Behavior |
| --- | ---: | --- |
| Veil mask | 0 | Warns with a destination circle, then blinks to flank you. |
| Spirit eel | 0 | Weaves sideways while closing in. |
| Glass spider | 1 | Locks its aim before a short pounce. |
| Soul lantern | 2 | Keeps its distance and fires a slow violet soul bolt. |
| Tomb walker | 3 | Armored, heavy and resistant to knockback. |
| Phantom stag | 4 | Faster, tougher flanker with a warned blink. |
| Bell wraith | 6 | Rings three delayed danger circles around itself. |
| Rift watcher | 8 | Marks a narrow chain of ground fissures. |

Guardians: **The Glass Widow** at 3:00 (web trap with an open exit), **The Mourning Organ** at 6:00 (spaced death chords), **The Pale Monarch** at 9:00 (a staggered stampede line), and **Rift Matriarch** after 10:00 (rift cage with an escape gap).

## Cinder Wastes

| Creature | First minute | Behavior |
| --- | ---: | --- |
| Slag slug | 0 | Leaves a small explosion with a 1.5-second warning when killed. |
| Ember moth | 0 | Circles and weaves toward the player. |
| Obsidian crab | 1 | Armored sideways approach. |
| Furnace beetle | 2 | Lobs a marked mortar blast with a 1.9-second warning. |
| Lava ram | 3 | Locks direction, then charges. |
| Magma worm | 4 | Marks its emergence point before burrowing to it. |
| Pyre wheel | 6 | Fast rolling charge with a longer windup. |
| Forge guard | 8 | Heavy armor and a delayed hammer slam in front. |

Guardians: **Mount Cinder** at 3:00 (crater salvo), **The Slag Wyrm** at 6:00 (a spreading molten fissure), **The Iron Archon** at 9:00 (three staggered hammer presses), and **The Ashen Phoenix** after 10:00 (ember rain).

## Fairness and continuity

- Ranged species share a maximum of five living enemies, including ground-casting species. Overflow becomes a regional melee creature.
- Regional ordinary ground warnings are capped at eight. Slug deaths share this budget. Boss warnings have a separate allowance within a 28-warning regional ceiling.
- Blinks/burrows give 1.25 seconds of destination warning and cannot emerge within 85 units of the player's position when marked. Charges lock direction during their windup.
- Every guardian attack provides at least 1.6 seconds of warning and a dodge cue below its health bar. Guardians attack faster below half health.
- Existing regional runs convert forest creatures into the matching regional roles once, preserving their health fraction. Gold, gear, spellcraft, current character health and upgrades remain intact.
- Continuous spawn acceleration, ten-minute unlocks, Ascensions, shrine hunts, treasure rewards and the thirty-minute optional dawn milestone remain available.
- After ten minutes, regional enemies gain a gradual additional durability multiplier. No sudden spawn-rate jump is introduced.

## Validation

`node tests/bestiary.test.mjs` covers roster isolation, scheduled bosses, unique art slots, shared ranged caps, attack signatures and escape directions, blink/dash behavior, death burst bounds, save migration, and eight minute-long horde simulations.

Other regression suites: game, arsenal, gear, ranged-cap, nightfall, refinement and balance. Browser QA uses the actual app's save importer on localhost with 667 × 375 landscape viewport; no fixtures are imported into production.

Art source prompts and saved paths: `ART-PROMPTS-V11.md`.
