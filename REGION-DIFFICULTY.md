# Regional difficulty — v13

Violet Hollow and Cinder Wastes now build enemy strength faster to account for accumulated permanent upgrades. The opening strength is unchanged; additional pressure grows smoothly with expedition time. It depends only on the selected region, never on equipped gear or purchased upgrades.

Additional multipliers relative to each region's previous balance:

| Time | Hollow health | Cinder health | Hollow damage | Cinder damage |
| --- | --- | --- | --- | --- |
| Start | 1.00× | 1.00× | 1.00× | 1.00× |
| 3 minutes | 1.36× | 1.63× | 1.06× | 1.096× |
| 5 minutes | 1.60× | 2.05× | 1.10× | 1.16× |
| 10 minutes | 2.20× | 3.10× | 1.20× | 1.32× |

- Health gains +0.12× per minute in Hollow and +0.21× in Cinder, capping at 3.4× / 5.2× after 20 minutes. The existing endless health curve continues afterward.
- Walking speed gains +0.4% / +0.6% per minute, capped at +14% / +22%. Dash, blink, projectile speed and attack-warning durations retain their established timings.
- Damage gains +2% / +3.2% per minute, capped at +24% / +40%, before armor. Applies to contact, projectiles, regional ground attacks and Overlord attacks; terrain damage stays unchanged.
- Early bosses, Overlords and newly awakened discovery guardians receive the regional health ramp. Saved living enemies and previously encountered discovery guardians keep their current health; loading never re-multiplies it.
- Ashwood, XP awards, spawn population/rate, enemy arrival minutes, five-ranged-enemy cap, regional hazard caps and gold bonuses are unchanged.

Validation: `tests/region-ramp.test.mjs` checks actual spawning, damage delivery, minute-by-minute continuity, boss scaling, retreat and saves. Existing suites cover combat, progression, gear, regional hazards and discovery rewards. Synthetic pilots are coarse sanity checks, not physical-device playtesting.
