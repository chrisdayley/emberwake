# Emberwake orchestral audio (v27)

Each of the ten maps plays a continuous 2,100-second AAC suite. Suites are distinct arrangements of 43 licensed Scott Buckley recordings; some movements are shared between maps. No cue is reused within a suite, and there are no engine-generated music loops or tempo stretching. These are edited licensed recordings, not 350 minutes of newly commissioned music.

The four movements start at 0, 10, 20 and 30 minutes: overture, gathering dark, siege, final encounter. Source backends provide the stronger late orchestration; volume changes are not used as a substitute for orchestration. Four-second equal-power crossfades join excerpts; source levels are balanced, then the final recording is peak-limited and encoded at 128 kbps stereo. Cue sheets, source links and SHA-256 hashes are stored in `audio/credits.json` on the deployed site.

Playback uses one streamed media element through Web Audio. It continues during level-up and chest screens. Manual pause, backgrounding, death and camp pause it. Resuming restores the exact recorded position; older saves start at their existing survival time. Reward-screen listening adds to elapsed soundtrack time, so musical and combat clocks can diverge without a rewind. The 35-minute suite finishes naturally instead of repeating; endless combat and effects continue afterward. Music requires a network connection for uncached recordings. Sound effects are small enough to precache for offline play.

The existing `emberwake-save-v1` key, purchased upgrades and combat balance are unchanged. An optional validated `musicCheckpoint` field records only version, map and seconds. Invalid audio metadata is discarded without rejecting the player's save.

Combat foley uses Oathfire's CC0 recorded sprite banks with distinct cues for every weapon, positional impacts, terrain footsteps, equipment movement and priority cues for player damage, bosses and rewards. It rotates variants, limits casting/impact density and caps simultaneous effects at 24 voices. Higher-priority danger sounds can replace low-priority effects. A separate compressor keeps the effects bus controlled. The two existing music/effects settings retain their values.

`audio-credits.html` provides in-game attribution. `audio-qa.html` is a stateless verification page; it fingerprints but never writes the real save. It exposes opening/middle/finale playback, reward menus, pause/resume, checkpoint restore, recorded effects, source duration, audio energy and errors.

## Rebuild

`python3 scripts/build-suites.py` requires Python 3, ffmpeg, ffprobe and network access. Source pages must explicitly carry CC BY 4.0. The builder checks duration coverage before rendering, verifies that each suite is exactly 35 minutes and that no recording is repeated, validates the copied foley hashes, and writes provenance with the assets. GitHub Actions runs this reproducibly from the checked-in suite plan.

## Verification

`node --test tests/*.test.mjs`: 24 passing test files, including actual app menu bridge, save/import regression, recorded audio lifecycle, autoplay recovery, no-repeat suite plans, foley mappings, sprite bounds and voice caps. Rendering and browser verification are recorded separately in `work/v27` locally.
