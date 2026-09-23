# Regional difficulty — v14

Violet Hollow and Cinder Wastes now have a substantially steeper enemy strength curve. It depends only on region and elapsed expedition time, so permanent upgrades still give their full benefit.

Compared with v13 enemy health in the same region:

| Time | Hollow health increase | Cinder health increase |
| --- | --- | --- |
| Start | unchanged | unchanged |
| 3 minutes | 1.86× | 2.21× |
| 5 minutes | 2.34× | 2.80× |
| 10 minutes | 3.41× | 4.03× |

The regional health multiplier on the common time curve is `1 + 0.45m + 0.02m²` in Hollow and `1 + 0.75m + 0.04m²` in Cinder, with regional m capped at 30. The underlying endless health curve continues afterward. Existing regional species stats and Cinder's 1.25× base health still apply.

- Walking speed gains +1.2% / +1.8% per minute, capped at +25% / +35%.
- Damage gains +6% / +9% per minute, capped at +65% / +100%, before armor. Applies to contact, projectiles, regional ground attacks and Overlords; terrain damage stays unchanged.
- Early bosses and Overlords use the stronger regional health curve. Discovery guardians additionally gain 8–16× base health, +25% contact/ground attack damage, faster pursuit, and shorter attack cooldowns. Telegraph durations remain intact.
- Existing living enemies and previously encountered discovery guardians retain their saved health. New spawns and newly awakened guardians use the revised health pools. Loading or retreat never heals a fight or repeatedly multiplies health.
- Ashwood ordinary enemies, XP awards, horde spawn count/rate, arrival minutes, five-ranged-enemy cap, regional hazard caps and gold bonuses are unchanged.

Validation: `tests/region-ramp.test.mjs`, `tests/wilds.test.mjs` and existing regression suites check actual spawned HP, delivered damage, continuity, horde bounds, save compatibility and encounters.
