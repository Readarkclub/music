# Quiet Pieces

Long, slow pieces written for the browser. Each one is a single HTML file — no dependencies,
no build step, no network calls, no audio files. Every sound is synthesized at runtime with
the Web Audio API.

**[Listen](https://readarkclub.github.io/music/)** — enable GitHub Pages on this repo
(Settings → Pages → deploy from `main`, root) and the link works.

## The pieces

| | Piece | | Length | Play along |
|---|---|---|---|---|
| 01 | **[Blue Hour](blue-hour.html)** | Nocturne · D♭ major · 4/4 · 106 bars | ~7½ min | [PIANO.md](PIANO.md) |
| 02 | **[Still Water](still-water.html)** | Suite · E minor · 6/8 · 122 bars | ~5 min | [TAB.md](TAB.md) |

`index.html` is the shelf they sit on.

---

### Blue Hour

A piano nocturne with a small ensemble behind it, in thirteen sections.

| Bars | Section | What happens |
|---|---|---|
| 1–16 | Dusk | Piano alone over a pad, then vibraphone and air |
| 17–32 | Theme | Cello states the theme; the piano's right hand takes it in octaves |
| 33–48 | Window | A major arrives out of nowhere, second theme in the clarinet |
| 49–64 | Rain | The head of the theme in three-voice canon, two bars apart |
| 65–80 | Height | Full ensemble, the theme in three octaves at once |
| 81–96 | Falling light | Everything drops away but piano and cello |
| 97–106 | Coda | One chord a bar, then single notes |

Nine parts: piano left and right hands, vibraphone, clarinet, cello, viola, bass, air, pad.
The keyboard on the page lights up for every part, colour-coded, so you can watch the
texture thin out and fill back in.

### Still Water

A suite for guitar ensemble in seven movements, on four open-string shapes that let the top
two strings ring the whole way through.

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
| Piano | Ten inharmonic partials per string — `fₙ = nf√(1+Bn²)` — each with its own decay time, the upper ones dying first, plus a filtered hammer thump. Fired as two sources a few cents apart, which is where the beating comes from. |
| Guitars, harp, basses | Karplus–Strong — a noise burst circulating in a tuned delay line with a one-pole averaging filter. Excitation warmth and decay time differ per instrument. |
| Cello, viola | Two detuned sawtooths plus a sine sub through a filter that opens and closes across the note, which produces the bow-stroke swell. |
| Clarinet | A square wave — all odd harmonics, which is the whole trick — under a filter sweep, with the vibrato ramping in late. |
| Flute | Sine and triangle with 5.2 Hz vibrato, plus a bandpassed noise burst at each onset for the breath transient. |
| Vibraphone | Sines at 1 : 3.94 : 9.2, the real bar modes, through a 3.6 Hz tremolo. |
| Glass, harmonics | Three stacked sines at slightly stretched partial ratios. |
| Pad | Three detuned oscillators through a filter breathing over four bars, mixed low. |
| Air | Noise through two slow bandpasses tuned off the bass note. Not a note — the room deciding to breathe. |
| Room | Convolution reverb against a JS-generated exponential-decay impulse. |

Every plucked and struck pitch is pre-rendered into an `AudioBuffer` before playback starts,
in chunks so the page keeps drawing while it happens, so the scheduler never stutters.
Timing runs off a 30 ms lookahead loop against `AudioContext.currentTime` rather than
`setTimeout`.

## Look and motion

Every page carries two switches, top left. Both choices are saved and follow you between
pages; a small script in `<head>` reads them before first paint, so nothing flashes.

**Look** swaps one block of CSS custom properties. Nothing else in the stylesheet changes —
every colour, face and rule already reads from a token.

| | |
|---|---|
| **Nocturne** | The default. Dark ground, the piece played in an unlit room. |
| **Classical** | An editorial paper ground built on the Classical design system: Cormorant Garamond over Lora where they're installed, justified copy, hairline rules, colour applied as stroke rather than fill. The keyboard becomes a real one — white keys, black keys. |

**Motion** decides what a note does once it has sounded. The key still lights in every mode;
this only governs the mark it leaves behind.

| | |
|---|---|
| **Bloom** | A glow lifting off the key. In Classical it draws as a ring, since that system strokes rather than fills. |
| **Ripple** | A ring opening out from the key — or from the fret, in *Still Water*. |
| **Trails** | Every part, not just the piano, leaves a mark that drifts up out of the keys, so the strip above the keyboard becomes a slow piano roll of the last few seconds. In *Still Water* the mark travels off down the string toward the bridge instead. |
| **Still** | Keys light, nothing moves. |

Marks come from a fixed recycled pool of elements and animate in CSS, so the count stays
flat however dense the music gets. With `prefers-reduced-motion: reduce` and no saved
choice, motion starts on **Still**.

## Playing along

Click any part name in the score map to mute it and the rest becomes a backing track.
Mute **Piano R** in *Blue Hour* or **Guitar I** in *Still Water* and the part you'd play is
the one that's missing. Both have a written arrangement — [`PIANO.md`](PIANO.md) and
[`TAB.md`](TAB.md) — and both players show the current bar as it goes. Drop the tempo while
you learn it.

## Structure of a player

The score is data, not code. Near the top of each file:

- `CH` — chord shapes, and the voicings derived from them
- `THEMES` — melodies as `[bar, eighth, midi, duration]`
- `FORM` — the sections: chords, pattern, which parts are active, which melodies play where

The canon is a `delay` field on a melody entry. Changing a piece means editing those three
tables; nothing below them needs to know.

## Adding a piece

1. Copy the closest existing player to `your-piece.html`.
2. Rewrite `CH`, `THEMES`, `FORM`, and the `PATTERNS` table.
3. Add one entry to the `PIECES` array in `index.html`.

New instruments are the only reason to touch anything further down: add a bus to `BUSDEF`,
a synthesis function, and a `case` in `fire()`.

## Licence

MIT.
