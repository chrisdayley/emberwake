# Guarded discoveries — v12

Every region now contains optional places worth exploring, starting immediately rather than only after ten minutes. Follow the question-mark compass to nearby unexplored sites. When you get close, the landmark reveals its reward and sleeping guardian. Approach within 135 world units to challenge it.

- **Sealed vault:** defeat its guardian, then return to the vault for gold, five treasure upgrades and a guaranteed permanent gear drop. Existing treasure evolution rules apply.
- **Spell altar:** defeat its guardian for gold and a choice of three Ascensions. Available before ten minutes; no weapon or skill slots used. The chosen bonus lasts for the expedition.
- **Life sanctuary:** defeat its guardian for full healing, +30 maximum health, an additional revive and a small gold reward. Health and revive bonuses last for the expedition.

The guardians match each region's exclusive roster. They scale with elapsed time and completed discoveries. A site never rewards you before its guardian is defeated. A site guardian replaces its normal chest with that site's reward, avoiding duplicate treasure.

These fights are optional. Moving more than 480 units from the site lets you retreat: the guardian sleeps again, retaining its remaining health. Return to resume the fight. Only one boss encounter can begin at once, so a timed guardian cannot arrive on top of an active site fight. After retreating, the ordinary boss schedule can continue.

Sites remain in fixed positions after discovery, and cleared sites stay unlocked until claimed. Locations, guardian damage, pending altar choices and collected rewards persist with the run. New sites appear as you explore or clear existing ones. Completed sites are removed from the active map; distant unseen locations are recycled to bound the save size. Up to twelve discovered/unclaimed sites are retained.

Landmarks use the existing game's chest, rune and regional guardian art, with separate vault seals, altar rings, sanctuary pools, light posts and reward labels drawn directly in canvas. Compass guidance is placed above the weapon loadout on landscape phones.

Validation: `tests/discoveries.test.mjs` checks location safety and bounds, all nine region/reward combinations, boss gating, retreat health, legacy saves, paused behavior, persistence and reward duplication. Existing combat, arsenal, gear, nightfall, regional bestiary, ranged-cap and balance suites remain in use. Local browser QA covers phone-sized site art, reward collection and resumed upgrade choice; fixtures never enter production.
