# Quiet Pieces

Long, slow pieces written for the browser. A piece is one HTML file plus two small shared
ones — no dependencies, no build step, no network calls, no audio files. Every sound is
synthesized at runtime with the Web Audio API.

**[Listen](https://readarkclub.github.io/music/)** — enable GitHub Pages on this repo
(Settings → Pages → deploy from `main`, root) and the link works.

## The pieces

| | Piece | | Length | Play along |
|---|---|---|---|---|
| 01 | **[Sunroom](sunroom.html)** | Ambient pop · E major · 4/4 · 104 bars | ~7 min | [KEYS.md](KEYS.md) |
| 02 | **[Afterglow](afterglow.html)** | Lo-fi · C minor · 4/4 · 96 bars | ~5 min | [RHODES.md](RHODES.md) |
| 03 | **[Evensong](evensong.html)** | Ensemble · D major · 3/4 · 106 bars | ~5½ min | [VIOLIN.md](VIOLIN.md) |
| 04 | **[Blue Hour](blue-hour.html)** | Nocturne · D♭ major · 4/4 · 106 bars | ~7½ min | [PIANO.md](PIANO.md) |
| 05 | **[Still Water](still-water.html)** | Suite · E minor · 6/8 · 122 bars | ~5 min | [TAB.md](TAB.md) |

`index.html` is the shelf they sit on.

---

### Sunroom

Four chords that only ever console, and thirteen sections that add one thing at a time
and then take it all away again.

| Bars | Section | What happens |
|---|---|---|
| 1–16 | Waking | Pad and air alone, then the piano |
| 17–32 | Sunlight | Guitar, bass and soft percussion — and a voice humming, four long notes a section |
| 33–48 | Memory | She takes the tune; a pluck synth behind it |
| 49–64 | Wider | G and D arrive — ♭III and ♭VII, borrowed from the parallel minor |
| 65–80 | Harmony | The fullest it gets, which is still quiet |
| 81–104 | Letting in / Still | Everything leaves in the order it arrived |

Nine parts: voice, piano, guitar, pluck, bell, perc, bass, pad, air. The page draws a
**field** rather than an instrument — time across, pitch up — so the bar reads as a
constellation and you watch it fill and empty.

The voice is the piece's one real synthesis problem, and the first attempt at it was
simply wrong: formants over a sine, which does nothing, because a sine has one harmonic
and there is nothing there to shape. What is there now is source and tract, the way a
person is:

- **the source** is a 48-harmonic glottal wave rolling off at 1/n^1.28 — a pulse train,
  not a sine;
- **the tract** is four bandpass resonances at the frequencies a woman's mouth puts
  them, sliding from one vowel toward another across the note;
- **every note starts closed**, at the hum position — F1 280 Hz, F2 damped — and opens
  into the vowel over about 140 ms. That one gesture is most of what separates a singer
  from a pad;
- **phrases begin with an intake**, audible, unpitched, half a second before the note.

Aspiration goes through the same four formants, so the breath is coloured by the same
mouth. **Breath** — a fifth control — trades the two sources against each other, from a
full voice at the bottom of the range to a whisper at the top.

Measured at a low pitch, where the harmonics sample the envelope densely enough to see
it, the vowels land where they were aimed:

| vowel | measured F1 / F2 / F3 | target |
|---|---|---|
| u | 370 / 988 / 2716 Hz | 370 / 950 / 2670 |
| o | 370–494 / 864 / 2840 Hz | 450 / 800 / 2830 |
| a | 864 / 1235 / 2840 Hz | 850 / 1220 / 2810 |

Everything chordal is voiced below the tune and everything glittering above it, so she
never has to compete: there are no semitone collisions with the tune anywhere, and she
sits 2–6 dB under the mix peak in every section she sings in.

### Afterglow

A four-chord loop, swung, that never resolves anywhere it hasn't already been.

| Bars | Section | What happens |
|---|---|---|
| 1–16 | Sundown | Rhodes and pad over vinyl, no beat |
| 17–32 | Groove | The kit comes in; bass follows the kick |
| 33–48 | Drift | A wordless voice on a dotted-eighth echo, guitar shadowing it |
| 49–64 | Faraway | Bridge — the drums drop out for eight bars, then return |
| 65–80 | Amber | The fullest it gets, which is not very |
| 81–96 | Letting go | The kit leaves, then everything but the Rhodes |

Nine parts: Rhodes, voice, guitar, bass, kick, rim, hat, pad, vinyl. The page draws a
sixteen-step grid rather than an instrument, because that is what this music is made on —
you can see the kick land on the "a" of two, and the hats' ghost notes between the eighths.

Three things make it sit right rather than sounding like a demo. The off-sixteenths are
played 17% late, which is the swing. Every part but the kit ducks about 2.5 dB under each
kick and recovers over a quarter of a second, which is the pump. And the Rhodes is voiced
in one fixed hand position with a ceiling of E4 — deriving it from each chord's own bass
instead sends B♭9sus ten semitones above Cm and lands its top note inside the tune.

**Wear** is a fifth control, unique to this piece: crackle level and tape drift together,
from a clean signal to a well-loved record.

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
| Singing voice | A 48-harmonic glottal wave through four bandpass formants at female vowel positions, morphing m → o → a across the note; aspiration noise runs through the same four filters. Vibrato of 38 cents ramps in after the note settles, at a rate that differs slightly every time. |
| Rhodes | FM: one sine bending another at the same frequency, with the modulation index dying away in 0.16 s against a note that lasts seconds. That collapse from bark to bell is the whole sound. |
| Kit | Kick is a sine swept 118→44 Hz with a lowpassed beater on top; rim is a bandpassed noise burst with a 336 Hz tick under it; hats are highpassed noise, 28 ms for the ghosts. |
| Voice | A sawtooth through three bandpass formants at 360 / 810 / 2600 Hz, on a dotted-eighth feedback delay. |
| Vinyl | A crackle buffer of sparse decaying pops plus highpassed hiss, both looping; the same control detunes every plucked and struck buffer for wow and flutter. |
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

| | On a keyboard | On a string, a step, or a field |
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
Mute **Voice**, **Rhodes**, **Violin I**, **Piano R** or **Guitar I** and the part you'd
play is the one that's missing. Each has a written edition — [`KEYS.md`](KEYS.md),
[`RHODES.md`](RHODES.md), [`VIOLIN.md`](VIOLIN.md), [`PIANO.md`](PIANO.md) and
[`TAB.md`](TAB.md) — and every player shows the current bar as it goes. Drop the tempo
while you learn it.

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
