# Validation

## Engine tests

`node tests/game.test.mjs` checks movement, paused clocks, dash cooldown, all 16 weapons actually dealing damage, all 16 evolution pairings, loadout slot caps, save/restore including pending level-up choices, one free revive, damage/death, and continued play at 10 and 30 minutes, dawn credit on banking, rank 8 caps, chest reward conversion, and legacy evolution migration.

Three accelerated deterministic pilot expeditions exercise the progression up to 30 minutes, automatic targeting, pickups, upgrade choices, late-game enemy counts, weapon evolution, and bounded entity collection sizes. They are simulations, not human playtests. Results are printed by the test script and may change with balance adjustments.

## Browser checks

- Landscape layout visually inspected at 844×390 and 667×375.
- Pointer drag triggers movement and dash enters cooldown.
- Automatic combat produces kills, experience, and level-up choices.
- Upgrade selection changes the visible weapon rank; rerolls reduce remaining count.
- Defeat displays the retained gold and offers the one free revive.
- Revive restores 60% health. Pause freezes the run and saves it.
- Finish & keep gold banks the run and awards earned milestone gold.
- Permanent health upgrade purchased with actual earned gold; reload retains gold balance and next run starts with 110 rather than 100 health.
- Three upgrade cards, descriptions, recipe progress, and reroll control fit the smaller landscape viewport.
- WebMCP read-progress and pause tools register. Valid pause saved a running expedition; attempting pause when defeated returned the intended error.
- No game runtime errors observed in browser logs during these flows.

## Remaining limitations

No physical iPhone/Android device was attached. Real touch ergonomics, Safari standalone/offline behavior, and sustained device frame rate need device use. Saves are device-local; no cross-device sync. Run time counts active combat and excludes paused upgrade and treasure screens. Long-term fun and economy require player feedback beyond deterministic tests.

## Endless and treasure update, September 17

- 15 engine checks passed; raw results are in `work/game-test-results.json`. Three deterministic bots: two survived 30:01, one defeated at 26:38; 34–38 chests opened per run. These are simulation checks, not evidence of human difficulty or physical mobile performance.
- Scaling checked at 0, 5, 10, 20, 30 and 60 minutes. Active ordinary horde cap grows from 100 to 600; health continues rising beyond that.
- 844×390 and 667×375 browser inspection: new transparent sprites, battlefield boss, boss health bar, treasure gold/rewards, rank 7→8 choice, resumed treasure screen.
- Imported fixture reached 30:06, kept playing after dawn, died, then banked 955 gold +100 dawn bonus and milestone awards. Camp displayed 1 dawn and unlocked Violet Hollow.
- An initial stale-module startup failure during development was fixed with versioned module/style URLs and cache v4. No subsequent runtime errors appeared.
- Existing save key/schema remain unchanged; legacy evolved weapons are promoted to rank 8. Long-run saves and pending chest rewards are accepted by the importer.

- Final public release verified: all 13 deployed game files match local tested files; public browser resumes an old pending level-up save, renders detailed characters and enemies, runs combat and pauses without runtime errors.

## Balance revision 5, September 18

18 engine checks pass, including old-save XP/speed migration, no distant XP auto-pickup, and stationary versus moving damage from a ground strike. `BUILT=1 node tests/balance.test.mjs` compares 20 seeded simulations: fresh and partially upgraded idle/active runs plus all four fully upgraded/evolved heroes starting at ten minutes. Baseline and current observations are retained in `work/balance-before.json` and `work/balance-after.json`.

Before: all six active ten-minute runs survived without a revive, at levels 45–52. After: four of six reached ten minutes, at levels 26–30; one of those used a revive. Two lost at 4:25 and 5:11. Fully upgraded stationary fixtures all fell before twenty minutes, while all four moving counterparts survived through twenty minutes. These controlled bots are calibration evidence, not a substitute for player feedback.

Mobile 844×390 browser check confirmed red ground telegraph, boss rendering, save import/restore, balance-5 identifier, and no runtime errors.

## Ranged cap revision 6, September 19

`node tests/ranged-cap.test.mjs` passes: at most five living shooters anywhere in the arena, melee replacements keep wave counts, a kill immediately frees a ranged slot, offscreen shooters remain counted, older oversized saved hordes normalize without losing gold/XP/skills, and old projectile walls are cleared only when over-cap shooters are converted. Normal saves retain their projectiles. Real spawn loops checked at 3, 10, 30 and 60 minutes. All 18 engine regression checks also pass.

## Arsenal revision 7, September 19

- 16 weapons with 16 evolutions, 12 passives, and six slots of each kind. Existing save schema and rank-eight cap preserved. Recent level-up selections receive reduced offer weight; high-rank items lose the previous owned-item bias. Chests spread upgrades across available items before repeating.
- 18 engine regression checks, eight arsenal checks, ranged-cap suite, and 12 idle/active balance simulations pass. Every weapon deals damage at rank one and evolves successfully. New enemy saves restore correctly.
- Across 200 deterministic upgrade sequences prioritizing Ember bolt, mean selections to first maxed weapon changed from 19.245 to 43.79. This excludes chest rewards and is a selection-distribution comparison, not elapsed play time.
- Actual wave loops at minutes 2/3/4 spawned 36/84/180 enemies over ten seconds with kills disabled. Minute four includes the existing surge. Population caps are 128/190/236 at those minute boundaries. Five living shooters remain the global maximum.
- New regular enemies: minute 3 ironhide, 4 reaver, 5 revenant, 6 juggernaut, 7 leech, 8 champion. Base ironhide health is 130 versus brute 65, with 20% armor; leeches regenerate. Earlier wave selection retains its previous probabilities.
- Local browser save import/resume, weapon selection, full 12-item HUD at 667×375, and new artwork/spell effects inspected. Additional landscape check at 844×390. No runtime errors observed. Fixtures were imported only on localhost. Physical phone performance remains untested.

- Published commit `505716d770e30ed8ae3de77134b4f3a5d1eb32c0`; GitHub Pages workflow `35475104092` completed successfully. All 14 public assets match the tested local files byte for byte; hashes are in `work/arsenal-release-verification.json`.
- Public browser reports `arsenal-7`, restores the prior saved expedition, and displays all 16 weapons and 12 skills. No console errors during that check.

## Armory revision 8

- Thirteen equipment checks plus all existing combat, arsenal, ranged-cap, and balance tests pass. Coverage includes all 112 variants, one additional perk per rarity, exact costs, caps, insufficient gold, independent hero choices, temper-preserving ascension, mastery effects, acquisition-rank stacking, legacy saves, frozen resumed loadouts, active thorns/life steal/shield effects, immediate loot persistence, and duplicate rewards paid once.
- Real wave loops with no kills produced 40 / 49 / 58 spawns per ten seconds at minutes 2 / 3 / 4. Previous minute-four result was 180. Minute 5 produces 67; minute 8 produces 102. Introductory enemy pairs cause small local variation. No four-minute multiplier or count discontinuity remains.
- 200,000 sampled guardian drops match the rarity tables across minute 0 / 10 / 30 / 60. Odds always sum to 100% and rare-or-better cumulative chances rise continuously. Results: `work/gear-test-results.json`.
- Local browser checks at 667×375 and 844×390: Armory previews, all 16 godly designs, rarity filtering, comparison, actual equip/temper/ascend actions, exact gold changes, spellcraft purchases, reload persistence, full five-reward treasure plus gear, gear saved before closing treasure, no repeat payout after reload, and visible godly equipment in combat. No page overflow or runtime errors observed. Fixture imports were localhost-only.
- Physical mobile hardware and long-term drop/economy enjoyment still require player feedback. No new network dependency or generated raster asset is required for equipment art.
- A combined Legendary/Godly gear plus Awakening fixture displays and grants rank-four Prism ray and rank-two Spirit lantern / Iron tempest correctly in phone upgrade cards.
- GitHub commit `5e4da5a3ab1b6c60c0d4a7f967859f2dfee926ac`, Pages workflow `35483887197`: success. All 17 public assets verified byte-for-byte against local tested files.
- Live browser reports `armory-8`, grants the starter Common Longbow, preserves the old paused run's time, skills, health, and original unequipped loadout, and renders the Armory with no runtime errors. No production fixture import was used.

## Nightfall / regions update (v9, September 20, 2026)

- All engine, arsenal, ranged-cap, equipment, balance, and new Nightfall system suites pass. New tests cover 200 successive Ascensions, caps, all three Overlords surviving evolved opening bursts, enrage telegraphs, five-upgrade/gear drops, exact 10:00 unlocks, legacy migration, shrine save/resume and exactly-once rewards, expiry, ground-strike avoidance, solid walls, lava/bridge safety, and timed rifts. Results: `work/nightfall-*-results.json`.
- Twenty deterministic idle/active balance simulations passed. For four heroes with fully purchased character traits and four evolved spells starting at 10:00, stationary fixtures first fell around 10:08; moving fixtures first fell between 13:43 and 15:04. These are intentionally identical controlled builds and simple bots, not a claim about human survival time. The six-weapon browser fixture survived long enough to defeat and loot an Overlord.
- The 3–4 minute spawn curve is unchanged from v8. The ten-minute health and spawn curves are continuous; new durable enemy types enter their weighted pool gradually. Five living shooters remains the global limit.
- Browser QA in Chrome at explicit **667×375** and **844×390** landscape viewports: camp controls fit below the navigation; Ascension cards and five-reward treasure dialog fit; forest, Hollow stone walls/rifts, and Cinder lava/bridges are visibly distinct; shrine arrows and objective timer remain clear of thumb controls. Console logs were empty of warnings/errors.
- Imported local-only 10:55 legacy record: 1,234 gold preserved, Hollow unlocked, Cinder stayed locked. An exact 09:59.99 fixture crossed 10:00, displayed the Hollow-unlocked notice, completed its last shrine, and presented three bonus Ascensions. The new region remained unlocked after reload. Production saves were not replaced by fixtures.
- Simulated 500-enemy frame sampling before terrain-cache optimization: Ashwood 0.22ms, Hollow 1.57ms, Cinder 0.06ms per simulation step on the development host. These exclude rendering and are not phone performance claims. Hollow geometry now reuses bounded cached tile groups and rejects distant rectangles before collision math.
- No physical phone attached. Actual iOS/Android sustained performance and touch ergonomics still require device play. Existing automatic pause, save backup, equipment ownership, gold banking, rank-eight spells, and unlimited expedition duration are retained.
- Publication verified: commit `62435757e3467af0cb23ff10ce66072d03c9cc1a`, successful Pages workflow `35547150705`, all 20 live assets byte-identical to the tested build. Production camp shows ten-minute region gates and module/style v9, with no console warnings/errors.

## Nightfall refinements (v10, September 21, 2026)

- All seven suites pass: game (18 checks plus three pilot simulations), arsenal (8 checks), gear (13 checks), ranged-cap, Nightfall (7 checks), refinements (4 grouped checks), and 20 idle/active balance simulations. Evidence in `work/refinement-*-tests.txt`, `work/refinement-tests.json`, and `work/refinement-nightfall-tests.json`.
- New regression coverage: 100 rolls with one normal upgrade remaining return three unique choices; Accelerant excluded only when all owned spells are at the cooldown floor; over 6,000 deterministic Hollow/Cinder points resolve safely; new supplies, guardian loot, and restored pickups use safe positions. All three boss attacks have distinct spatial/timing patterns and preserved telegraphs across save/resume; enraged versions add attacks, and Hollow's escape gap remains clear.
- Explicit 667×375 browser checks show root-line, rift-cage, and staggered ember-rain warnings with readable dodge cues below boss health. Pause menu expands to show six current stats and individual Ascension ranks; scrollable details preserve the main controls. Keyboard Tab reaches the new summary, and browser console warnings/errors are absent. Local fixture imports only; no production save replacement.
- Regular spawn counts, enemy health curves, rank-eight spell caps, ten-minute region unlocks, and the five-shooter limit remain unchanged. Physical phone performance has not been measured.
- Final public verification: workflow `35618768778` succeeded for commit `ee0c6bf11f3a69612a9b9617d6a84f64acc19c0a`. All 20 assets are byte-identical. WebMCP confirms `nightfall-10` and exact saved-run/account preservation across the live refresh; console warnings/errors are absent.

### v11 regional bestiary

- Verified all 24 new transparent sprite cells in the source atlases; inspected Hollow and Cinder encounters at 667 × 375 through the real renderer.
- Both phone encounters display exclusive enemies, a distinct guardian, visible ground warnings, and a readable attack cue. No browser console errors.
- Save fixtures imported only into localhost. Regression and regional stress-test outputs are in `work/bestiary-*`.

### v12 guarded discoveries

- Five discovery test groups pass: bounded safe map sites, all nine region/reward combinations, exact-once rewards, retreat/persistence, legacy saves and paused behavior.
- Existing game/arsenal/gear/ranged/nightfall/refinement/bestiary suites and twenty balance simulations pass. Horde assertions count normal enemies separately from the optional boss slot.
- Browser QA at 667 × 375: sleeping Ashwood vault and Cinder sanctuary, visible guardian/reward labels, compass moved clear of weapon loadout, five-upgrade vault loot with permanent gear, and a Hollow altar's three-choice Ascension panel preserved through reload.
- No local browser console errors. Fixtures remain localhost-only.

## v13 — regional strength ramp

- `tests/region-ramp.test.mjs`: actual spawned HP, unchanged Ashwood/density, smooth second-by-second scaling through 60 minutes, regional boss/Overlord/guardian HP, saved and retreated health, and real contact/projectile/ground damage after armor all pass.
- All game, arsenal, gear, ranged-cap, discovery, bestiary, refinement, Nightfall and balance suites pass; includes eight regional horde stress simulations and twenty Ashwood balance simulations.
- Twelve additional upgraded-character regional pilots and six Cinder baseline pilots completed. The basic pilot struggles with lava navigation in both baseline and revised Cinder; it is not evidence of human completion difficulty. No physical-phone performance claim.
- Browser camp label inspected at 667 × 375. Existing save verification and release evidence recorded separately after publishing.
