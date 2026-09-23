# Emberwake

A landscape-first, mobile browser survival roguelite. Open-ended expeditions with ten-minute region unlocks and a 30-minute optional dawn milestone, automatic weapons, one-thumb movement, a manually triggered invulnerable dash, permanent gold upgrades, and free save backup/import.

## Play

Serve `dist/` with a static HTTP server, then open it in a modern browser. On phones, turn sideways. On iPhone, Safari → Share → Add to Home Screen provides a standalone launch. Progress is local to that browser/device, not cloud-synced. Export it in Settings before clearing browser data or changing devices.

- Drag left to move. Use the right-hand button to dash.
- Desktop: WASD/arrows move, Space dashes, Escape pauses.
- Attacks automatically target enemies. Move to collect experience shards and dodge red ground-attack circles.
- Six weapon and six passive slots. Weapon rank 8 + matching passive rank 2 + a treasure chest evolves.
- Reach 30:00 to earn a dawn, then continue into endless survival. One free revive per expedition; gold is kept after defeat or an early return.
- Early guardians arrive every three minutes. After 10:00, much tougher Overlords drop five upgrades, extra gold, and gear. Ancients arrive each minute and drop smaller chests.
- Nightfall introduces repeatable Ascension choices, three-shrine hunts, and four new durable enemy types. See [NIGHTFALL.md](NIGHTFALL.md).
- Ten minutes in Ashwood unlocks Violet Hollow; ten minutes in Hollow unlocks Cinder Wastes. Hollow has stone passages and shifting rifts; Cinder has lava channels and safe bridges.
- Save & return to camp preserves a run. Finish & keep gold ends and banks it.
- Upgrades and characters selected at camp apply to new runs; resumed runs preserve their original build.

- Armory: collect 112 weapon variants across seven rarities. Equip each character, temper bonuses, and ascend rarity using gold. Every rarity adds another equipped boost.
- Upgrade → Spellcraft: permanently improve individual spell damage, cooldown, and starting ranks.
- Guardian chests always drop gear; ancient chests have a 35–65% chance. Better rarity odds follow current-run survival time. Gear is saved immediately. Duplicate finds become banked gold.

## Content

4 characters, 3 regions, 16 weapons, 16 evolutions, 12 passive skills, 12 permanent character upgrade paths with 67 ranks, 272 spellcraft ranks, 112 collectible equipment variants, 12 milestone rewards, 11 normal enemy types plus elites and recurring bosses.

## Implementation

No runtime game framework or network game dependency. Detailed original transparent sprite atlas, native canvas renderer, fixed 60Hz simulation, bounded enemy/gem/effect collections, mobile pointer controls, Web Audio effects, service-worker asset caching, versioned local saves. Fonts have native fallbacks. The service worker supports cached assets after a successful first load; private hosting sign-in and real iOS offline behavior require device verification.

`dist/data.js` defines progression/content. `dist/engine.js` runs combat and exposes serializable snapshots. `dist/render.js` draws the battlefield. `dist/app.js` owns menus, local saves, economy, input, and lightweight WebMCP tools.

Run `node tests/game.test.mjs`, `node tests/gear.test.mjs`, `node tests/arsenal.test.mjs`, `node tests/ranged-cap.test.mjs`, and `node tests/balance.test.mjs` for combat, progression, equipment, economy, saves, drops, and wave checks. Read `GEAR.md` for the equipment system. Read `DESIGN.md` for research and `QA.md` for validation boundaries.

## Regional bestiary update

Violet Hollow and Cinder Wastes each feature eight exclusive enemy species and four unique boss designs. Hollow uses spectral flanks, pounces and rift traps; Cinder uses volcanic death bursts, charging beasts, burrowing worms and forge machinery. See [BESTIARY.md](BESTIARY.md) for behavior and guardian schedules. The five-enemy ranged cap and existing saved progression are preserved.
