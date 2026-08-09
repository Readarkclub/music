# Quiet Pieces

Long, slow pieces written for the browser. A piece is one HTML file plus two small shared
ones — no dependencies, no build step, no network calls, no audio files. Every sound is
synthesized at runtime with the Web Audio API.

**[Listen](https://readarkclub.github.io/music/)** — enable GitHub Pages on this repo
(Settings → Pages → deploy from `main`, root) and the link works.

## The pieces

| | Piece | | Length | Play along |
|---|---|---|---|---|
| 01 | **[Evensong](evensong.html)** | Ensemble · D major · 3/4 · 106 bars | ~5½ min | [VIOLIN.md](VIOLIN.md) |
| 02 | **[Blue Hour](blue-hour.html)** | Nocturne · D♭ major · 4/4 · 106 bars | ~7½ min | [PIANO.md](PIANO.md) |
| 03 | **[Still Water](still-water.html)** | Suite · E minor · 6/8 · 122 bars | ~5 min | [TAB.md](TAB.md) |

`index.html` is the shelf they sit on.

---

### Evensong

A violin tune over a small ensemble, in three.

| Bars | Section | What happens |
|---|---|---|
| 1–16 | Dusk falling | Harp and pad alone, then cello and celesta |
| 17–32 | Song | The violin states the tune; violin II takes it in octaves |
| 33–48 | Meadow | F major arrives out of nowhere; the cello answers two octaves down |
| 49–64 | Turning | The head of the tune in canon, three voices deep, two bars apart |
| 65–80 | Full | The ensemble together, the tune in three octaves |
| 81–96 | Going | Everything drops away but violin, harp and cello |
| 97–106 | Rest | One chord a bar, then the open D alone |

Nine parts: violin I and II, viola, cello, bass, harp, celesta, horn, pad. The page draws
the violin's fingerboard rather than a keyboard — no frets, so the mark is simply where
the finger stops the string, with the I, III and V positions marked behind it.

Two rules keep the ensemble out of the tune's way, and both are in the score code rather
than in the notes: the harp is voiced below the violin's floor, because its top notes
otherwise state the root or third exactly where the tune leans on the ninth or seventh;
and any held inner voice that would land a semitone from the tune moves to the nearest
chord tone that doesn't. The result has no sustained-voice semitone collisions at all.

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
| Violins, viola, cello | Two detuned sawtooths plus a sine sub through a filter that opens across the stroke. In *Evensong* the vibrato ramps in after the note has started, the way a player actually does it, and a bandpassed breath of bow noise sits at the contact point. |
| Clarinet | A square wave — all odd harmonics, which is the whole trick — under a filter sweep, with the vibrato ramping in late. |
| Flute | Sine and triangle with 5.2 Hz vibrato, plus a bandpassed noise burst at each onset for the breath transient. |
| Vibraphone | Sines at 1 : 3.94 : 9.2, the real bar modes, through a 3.6 Hz tremolo. |
| Celesta | Sines at 1 : 4.1 : 10.2, struck and short. |
| Horn | Almost all fundamental and octave under a filter sweep, with a slow lip onto the note. |
| Glass, harmonics | Three stacked sines at slightly stretched partial ratios. |
| Pad | Three detuned oscillators through a filter breathing over four bars, mixed low. |
| Air | Noise through two slow bandpasses tuned off the bass note. Not a note — the room deciding to breathe. |
| Room | Convolution reverb against a JS-generated exponential-decay impulse. |

Every plucked and struck pitch is pre-rendered into an `AudioBuffer` before playback starts,
in chunks so the page keeps drawing while it happens, so the scheduler never stutters.
Timing runs off a 30 ms lookahead loop against `AudioContext.currentTime` rather than
`setTimeout`.

## Design and motion

Every page opens with a **Design** chooser at the top — two named options, each carrying a
swatch of the ground it will give you — and a quieter **Motion** switch beside it. Both
choices are saved and follow you between pages; `design.js` reads them before first paint,
so nothing flashes.

**This is one system, shared by every piece.** It lives in two files:

| File | What it holds |
|---|---|
| `design.css` | Both design palettes, the typography tokens, the switch chrome, and the four motion effects |
| `design.js` | Restoring the saved choice before paint, building the switches, and the mark pool |

A piece links them and supplies only what is genuinely its own: a pigment per part in each
design, and the geometry its marks should move through. Nothing about the designs or the
effects is copied into a piece, so they cannot drift apart — and a piece added later gets
all of it without doing anything.

### The two designs

**Design** swaps one block of CSS custom properties. Nothing else in any stylesheet changes —
every colour, face and rule already reads from a token.

| | |
|---|---|
| **Nocturne** | The default. Dark ground, the piece played in an unlit room. |
| **Classical** | An editorial paper ground built on the Classical design system: Cormorant Garamond over Lora where they're installed, justified copy, hairline rules, colour applied as stroke rather than fill, and the system's own low-chroma part pigments so the score reads as tinted ink rather than a chart legend. |

### The four motion effects

**Motion** decides what a note does once it has sounded. The note still lights in every mode;
this only governs the mark it leaves behind, and each piece points it at its own instrument.

| | On a keyboard | On a fingerboard |
|---|---|---|
| **Bloom** | A glow lifting off the key | The string glowing where it was struck |
| **Ripple** | A ring opening out from the key | A ring opening out from the fret |
| **Trails** | Every part leaves a mark drifting up out of the keys, so the strip above the keyboard becomes a slow piano roll of the last few seconds | The mark travels off down the string toward the bridge |
| **Still** | Keys light, nothing moves | Strings light, nothing moves |

In Classical, Bloom and Ripple draw as rings rather than glows, because that system strokes
rather than fills.

Marks come from a fixed recycled pool and animate in CSS, so the element count stays flat
however dense the music gets. With `prefers-reduced-motion: reduce` and no saved choice,
motion starts on **Still**.

## Playing along

Click any part name in the score map to mute it and the rest becomes a backing track.
Mute **Violin I**, **Piano R** or **Guitar I** and the part you'd play is the one that's
missing. Each has a written edition — [`VIOLIN.md`](VIOLIN.md), [`PIANO.md`](PIANO.md) and
[`TAB.md`](TAB.md) — and every player shows the current bar as it goes. Drop the tempo while
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

Both designs and all four motion effects come along on their own, provided the copy keeps
these four things:

```html
<link rel="stylesheet" href="design.css">   <!-- before your own <style> -->
<script src="design.js"></script>           <!-- in <head>, not deferred -->
```
```html
<div class="prefs" data-quiet-switch="design motion"></div>
```

- **Declare a pigment per part in both designs.** A `:root` block for Nocturne and a
  `:root[data-style="classical"]` block for Classical, using the same token names your
  score map reads. Keep the Classical ones low chroma.
- **Ask for a mark when a note sounds**, from wherever on your instrument it happened:

  ```js
  Quiet.mark(hostElement, {x:'43%', y:'50%', colour:'#B0803A', faint:false});
  ```

  The host needs `position:relative` and a `data-qm-pool` size. `faint:true` marks the
  quieter parts — only Trails draws those. Retune `--qm-bloom-*`, `--qm-ripple-*` and
  `--qm-trail-*` on `:root` so the effects suit your instrument; `design.css` documents
  each one.
- **Call `Quiet.onChange(fn)`** if you cache any colour in JavaScript, since the pigments
  differ per design.

One trap worth knowing, because it cost a release: `--kc`, a mark's colour, is set on the
mark element. Any rule that uses it must name it directly. Routed through a `:root`
property, `var(--kc)` resolves against `:root`, where it does not exist, and the whole
declaration computes to nothing — the mark renders as a transparent box.

## Licence

MIT.
