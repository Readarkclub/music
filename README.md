# Still Water

A suite for guitar ensemble, written for the browser. One HTML file, no dependencies,
no build step, no network calls. Every sound is synthesized at runtime with the Web
Audio API.

**[Play it](https://readarkclub.github.io/music/)** — enable GitHub Pages on this repo
(Settings → Pages → deploy from `main`, root) and the link works.

## The piece

E minor, 6/8, 122 bars, seven movements, about five minutes at the default tempo.

| Bars | Movement | What happens |
|---|---|---|
| 1–16 | Prelude | Guitar alone on a thinned three-note pattern |
| 17–32 | Theme | Cello states the melody; guitar II doubles it an octave up |
| 33–56 | Answer | Modulation to G major, a second theme in the flute |
| 57–80 | Development | Three-voice canon on the theme's head, two bars apart |
| 81–96 | Climax | Full ensemble, theme in three octaves at once |
| 97–112 | Reprise | Everything drops away but guitar and cello |
| 113–122 | Coda | Thins to harmonics at the 12th fret |

Nine parts: guitar I and II, harp, bass, cello, viola, flute, glass, pad.

## Synthesis

| Voice | Method |
|---|---|
| Guitars, harp, bass | Karplus–Strong — a noise burst circulating in a tuned delay line with a one-pole averaging filter. Excitation warmth and decay time differ per instrument. |
| Cello, viola | Two detuned sawtooths plus a sine sub through a filter that opens and closes across the note, which produces the bow-stroke swell. |
| Flute | Sine and triangle with 5.2 Hz vibrato, plus a bandpassed noise burst at each onset for the breath transient. |
| Glass, harmonics | Three stacked sines at slightly stretched partial ratios. |
| Pad | Three detuned oscillators through a filter breathing over four bars, mixed low. |
| Room | Convolution reverb against a JS-generated exponential-decay impulse. |

Every plucked pitch is pre-rendered into an `AudioBuffer` before playback starts, so the
scheduler never stutters. Timing runs off a 30 ms lookahead loop against
`AudioContext.currentTime` rather than `setTimeout`.

## Playing along

The tab for the guitar I part is in [`TAB.md`](TAB.md), and the player shows the current
bar as it goes. Click **Guitar I** in the score map to mute it and the other eight parts
become a backing track. Drop the tempo to 40 while you learn it.

## Structure of the source

The score is data, not code. `CH` holds chord shapes and derived voicings, `THEMES` holds
melodies as `[bar, eighth, midi, duration]`, and `FORM` lists the movements — chords,
picking pattern, active parts, and which melodies play where. The canon is a `delay`
field on a melody entry. Changing the piece means editing those three tables.

## Licence

MIT.
