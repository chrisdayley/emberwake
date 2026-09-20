# Armory and spellcraft

A character equips one persistent weapon. The collection is shared, while each character remembers a separate choice. Gear bonuses apply while equipped, beginning with the next expedition. Resumed runs keep their captured equipment, temper level, and spellcraft. Existing accounts receive a free Common Longbow; gold, traits, milestones, and saved runs remain intact.

16 weapon families each have all seven rarities: Common, Uncommon, Rare, Epic, Legendary, Mythic, Godly. The 112 variants cover bows, blades, staves, mauls, scepters, daggers, orbs, spears, scythes, crossbows, sickles, wands, lanterns, axes, and tridents. Family-specific perks support damage, criticals, defense, healing, speed, crowd control, or spellcasting builds.

| Tier | New equipped boost |
|---|---|
| Common | Family signature: damage, health, armor, healing, haste, crit, area, or movement |
| Uncommon | A complementary defensive or utility bonus |
| Rare | Start with that family’s spell; gain a rank if it is already the character’s starter |
| Epic | Another family-specific boost such as critical chance, knockback, pickup radius, damage, area, or recharge |
| Legendary | Every acquired spell starts one rank higher, including starting spells; maximum rank remains 8 |
| Mythic | Life steal, periodic shielding, reflected contact damage, or critical damage |
| Godly | One additional free revive per expedition |

Each tier retains all earlier boosts. Numeric bonuses scale with rarity and temper level. Stat scale is `1 + 0.18 × tierIndex + 0.08 × temperLevel`. Shields refill every 20 active-combat seconds. Life steal uses actual damage dealt, excluding excess overkill. Reflected damage is triggered by contact hits; it does not reflect ranged hazards.

## Gold uses

- Forge any missing Common family for 150 gold.
- Temper owned gear ten times. Cost: `round(65 × (tierIndex + 1) × 1.48^currentTemper)`.
- Ascend to the next rarity for 300 / 850 / 2,400 / 6,500 / 18,000 / 55,000 gold. Temper level is retained. Every character using that item follows its upgrade. Ascension is unavailable if the next variant is already owned, preventing accidental overwrite.
- Each of 16 spells has Potency (10 ranks, +4% damage per rank), Fluency (5 ranks, 2% shorter cooldown per rank), and Awakening (2 ranks, +1 initial spell rank per rank). These are permanent account upgrades applied to new runs. Awakening and Legendary gear stack, capped at spell rank 8.
- Potency costs start at 80 gold and multiply by 1.6 per rank; Fluency starts at 100 and multiplies by 1.7; Awakening costs 450 then 1,575. Spellcraft can be fully refunded independently of character traits. Equipment purchases remain in the collection.

## Treasure odds

Guardian chests always contain one gear drop. Ancient chests start at a 35% gear chance, rising linearly to 65% after 30 minutes. Gear is additional to existing chest gold, upgrades, and evolutions. Every family is equally likely within its rarity. Gold, Fortune, and region bonuses do not alter rarity odds.

Percentages below are conditional on a gear drop. They use the current run’s active survival time, interpolate continuously between rows, and cap at the 60-minute row. Earlier chests use the time when opened.

| Minutes | Common | Uncommon | Rare | Epic | Legendary | Mythic | Godly |
|---|---:|---:|---:|---:|---:|---:|---:|
| 0 | 78 | 18 | 3.6 | 0.38 | 0.019 | 0.001 | 0 |
| 5 | 60 | 28 | 10 | 1.8 | 0.18 | 0.019 | 0.001 |
| 10 | 44 | 32 | 18 | 5 | 0.9 | 0.095 | 0.005 |
| 20 | 27 | 31 | 27 | 12 | 2.5 | 0.45 | 0.05 |
| 30 | 18 | 27 | 30 | 18 | 5.8 | 1.05 | 0.15 |
| 60 | 8 | 18 | 31 | 27 | 12 | 3.4 | 0.6 |

Duplicates pay 30 / 60 / 120 / 280 / 700 / 1,800 / 5,000 banked gold by rarity. A chest's gear reward is granted to the collection and saved together with the run snapshot. Reloading a chest does not grant it again.

## Visual system

Inventory illustrations, character previews, and in-combat held weapons use the same native canvas drawing system in `gear-art.js`. Each family has a recognizable silhouette. Rarity adds colored fittings, gems, runes, glow, ornamental wings, orbiting sparks, then a godly halo. Tempering adds grip detailing. The Armory includes all-rarity previews, owned/all collection views, rarity filtering, comparisons with the equipped weapon, and a live character preview.

## Spawn pacing

The abrupt bonuses at minutes three/four and the periodic 1.4× surge were removed. Wave size now carries fractional spawn credit between ticks and grows continuously. Enemy cap also grows gradually. New enemy types keep their arrival times and ease into the random spawn mix over their first minute. The global five-shooter cap remains.
