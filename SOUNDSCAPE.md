# Soundscape update — v16

Enemy AOE telegraphs, projectiles, charge lines and teleport targets use crimson red. AOE warnings have dark outlines, countdown rings and a cream exclamation mark, drawn above player spell effects. Violet Hollow active rifts are crimson too. Existing purple player spells retain their colors. Saved enemy colors are overridden only while drawing, so existing attacks need no save migration.

Each map has an original procedural Web Audio score:

| Region | Theme | Tempo, opening to 25 minutes |
|---|---|---|
| Ashwood | Embers in the Leaves: plucked woodland melody | 84–112 BPM |
| Violet Hollow | The Glass Choir: layered spectral bells | 88–116 BPM |
| Cinder Wastes | March of the Furnace: driven bass and percussion | 104–132 BPM |

The v18 score is a 128-bar suite with eight 16-bar sections, including a quieter bridge, contrasting harmonic progressions, returning themes, a chase and a finale. Opening loops last about 6:06 in Ashwood, 5:49 in Hollow and 4:55 in Cinder; faster late-run tempos shorten them. Alternate passes include small melodic variations. Each region has eight written melodic phrases, four rhythm patterns, chord inversions, call-and-response bars, percussion fills, stereo placement and sustained pads. Hollow adds delayed upper bells; Cinder uses a stronger drum groove.

Survival time develops the arrangement: at 2 minutes arpeggios and extra hats enter, at 4 syncopated bass and extra kicks, at 7 countermelodies, at 10 upper sustained chords and transition rolls, at 15 octave melody accents, and at 20 a faster pulse and denser percussion. Tempo and volume within individual voices rise gradually through 25 minutes, then stay bounded. Intensity follows combat time, so spending time in an upgrade menu does not artificially intensify the soundtrack. Sections provide musical contrast even late in a run.

Music continues uninterrupted through upgrade, Ascension and treasure menus while combat stays paused. Manually pausing, returning to camp or backgrounding stops the score. Settings provide independent music toggle and volume; existing sound-off saves stay muted by default.

No downloaded music, external service, or licensed tracks. Voices are bounded and disconnected after playback; background catch-up is skipped. Audio uses its own deterministic noise generator, never the combat RNG.

Save key `emberwake-save-v1` and schema version 1 remain unchanged. Only two optional settings are added. Gold, inventory, gear, spellcraft, unlocks and active run data are preserved. Combat balance is unchanged from v15.

`node tests/soundscape.test.mjs` checks legacy settings, score progression, scheduler lifecycle, hazard drawing and save restoration. `dist/audio-qa.html` is an unlinked, stateless browser test page for real Web Audio rendering and danger-marker comparison; it never opens or changes a game save.

## Menu continuity fix — v17

The app keeps the existing audio scheduler running in `levelup` and `chest` modes, so reward menus do not reset the song. Intensity still follows survival time, which does not advance in these menus. Save data and combat behavior are unchanged. The regression test exercises the actual app audio bridge and verifies continued note scheduling and monotonic song position through repeated reward menus.

## Composition coverage — v18

`tests/long-score.test.mjs` checks every bar in all three arrangements: 32 distinct four-bar passages per region, more than 120 distinct melody bars, progressively richer survival stages and peak voice concurrency below the 64-voice cap. The browser QA page renders each of eight sections at both opening and maximum intensity, at maximum music volume, to check real Web Audio output. Music-menu continuity and legacy-save checks remain in `tests/soundscape.test.mjs`.
