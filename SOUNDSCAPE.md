# Soundscape update — v16

Enemy AOE telegraphs, projectiles, charge lines and teleport targets use crimson red. AOE warnings have dark outlines, countdown rings and a cream exclamation mark, drawn above player spell effects. Violet Hollow active rifts are crimson too. Existing purple player spells retain their colors. Saved enemy colors are overridden only while drawing, so existing attacks need no save migration.

Each map has an original procedural Web Audio score:

| Region | Theme | Tempo, opening to 20 minutes |
|---|---|---|
| Ashwood | Embers in the Leaves: plucked woodland melody | 78–106 BPM |
| Violet Hollow | The Glass Choir: layered spectral bells | 88–116 BPM |
| Cinder Wastes | March of the Furnace: driven bass and percussion | 104–132 BPM |

Intensity follows expedition survival time. Snare, hats, extra kicks and pulses join gradually; the melody becomes denser in long runs. Intensity caps at 20 minutes for bounded endless playback. Music continues uninterrupted through upgrade, Ascension and treasure menus while combat stays paused. Manually pausing, returning to camp or backgrounding stops the score. Music resumes at the saved run's intensity after a user gesture. Settings provide an independent music toggle and volume; existing sound-off saves remain muted by default.

No downloaded music, external service, or licensed tracks. Voices are bounded and disconnected after playback; background catch-up is skipped. Audio uses its own deterministic noise generator, never the combat RNG.

Save key `emberwake-save-v1` and schema version 1 remain unchanged. Only two optional settings are added. Gold, inventory, gear, spellcraft, unlocks and active run data are preserved. Combat balance is unchanged from v15.

`node tests/soundscape.test.mjs` checks legacy settings, score progression, scheduler lifecycle, hazard drawing and save restoration. `dist/audio-qa.html` is an unlinked, stateless browser test page for real Web Audio rendering and danger-marker comparison; it never opens or changes a game save.

## Menu continuity fix — v17

The app keeps the existing audio scheduler running in `levelup` and `chest` modes, so reward menus do not reset the song. Intensity still follows survival time, which does not advance in these menus. Save data and combat behavior are unchanged. The regression test exercises the actual app audio bridge and verifies continued note scheduling and monotonic song position through repeated reward menus.
