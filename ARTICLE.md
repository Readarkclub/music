# Quiet Pieces: building a generative music site in Claude Code

**[music.readark.club](https://music.readark.club/)** is a shelf of five long, slow pieces
written for the browser. Open one and it plays — not a stream, not an MP3, but a piece of
music being assembled in front of you a note at a time. There are no audio files anywhere
in the repository. There is no build step, no framework, no dependency, and after the page
loads there is no network call. Every sound is made from arithmetic by the Web Audio API.

The whole thing was written in [Claude Code](https://claude.com/claude-code), and this is
an account of what that was actually like — including the parts that broke.

---

## What is on the shelf

| | Piece | | Length | Play along |
|---|---|---|---|---|
| 01 | **Sunroom** | Ambient pop · E major · 4/4 · 104 bars | ~7 min | `KEYS.md` |
| 02 | **Afterglow** | Lo-fi · C minor · 4/4 · 96 bars | ~5 min | `RHODES.md` |
| 03 | **Evensong** | Ensemble · D major · 3/4 · 106 bars | ~5½ min | `VIOLIN.md` |
| 04 | **Blue Hour** | Nocturne · D♭ major · 4/4 · 106 bars | ~7½ min | `PIANO.md` |
| 05 | **Still Water** | Suite · E minor · 6/8 · 122 bars | ~5 min | `TAB.md` |

Each is one HTML file plus two small shared ones. A piece carries its own score as data —
chords, themes, a form, a set of patterns — and the page reads that score and schedules it
against the audio clock with a 30 ms lookahead.

## The instruments are equations

Nothing here is sampled. Each instrument is a physical or spectral model small enough to
fit in a paragraph:

- **Piano** — ten inharmonic partials per string, `fₙ = nf√(1+Bn²)`, each with its own
  decay so the upper ones die first, plus a filtered hammer thump. Fired as two sources a
  few cents apart, which is where the beating comes from.
- **Guitars, harp, plucked basses** — Karplus–Strong: a noise burst circulating in a tuned
  delay line through a one-pole averaging filter.
- **Strings** — two detuned sawtooths and a sine sub through a filter that opens across the
  stroke, with vibrato ramping in *after* the note starts, the way a player actually does it.
- **Rhodes** — FM, one sine bending another at the same frequency, the modulation index
  collapsing in 0.16 s against a note lasting seconds. That collapse from bark to bell is
  the entire sound.
- **Voice** — a 48-harmonic glottal wave through four bandpass formants at female vowel
  positions, opening from a closed hum into the vowel on every note.
- **Room** — convolution reverb against an impulse response generated in JavaScript.

## Two designs and four motions

Every page opens with a **Design** chooser and a quieter **Motion** switch. Both choices
are saved and follow you between pages, and `design.js` reads them before first paint so
nothing flashes.

**Nocturne** is the default — dark ground, the piece played in an unlit room. **Classical**
is an editorial paper ground: Cormorant Garamond over Lora, justified copy, hairline rules,
and colour applied as stroke rather than fill. Switching swaps exactly one block of CSS
custom properties; every colour, face and rule in the stylesheet already reads from a token,
so nothing else changes.

**Motion** governs what a note leaves behind once it has sounded — **Bloom**, **Ripple**,
**Trails**, or **Still**. Marks come from a fixed recycled pool and animate in CSS, so the
element count stays flat however dense the music gets. With `prefers-reduced-motion: reduce`
and no saved choice, motion starts on Still.

## The sheet music

Click any part name in the score map and it mutes; the rest becomes a backing track. That is
what the five play-along documents are for — `TAB.md` for guitar, `PIANO.md`, `VIOLIN.md`,
`RHODES.md`, `KEYS.md` — each written as prose for a human rather than as notation, with the
chord shapes, where the notes fall in the bar, and what to do when you only have four bars of
attention left.

---

## Where Constants comes in

[Constants](https://www.constants.io/) is an MCP connector that gives Claude Code a large
library of executable tools — image, audio, video, file, web, API — discoverable at runtime
rather than wired in ahead of time. In this project it was used for its **AI music
generator**: feeding each of the five pieces back through it as a prompt to hear what a
fully-produced arrangement of the same material would sound like.

That produced five alternate tracks — *Sunroom Glow*, *Afterglow Drift*, *Evensong at Dusk*,
*Still Water*, and *Window With Rain* — each with its own generated album art.

The workflow is worth describing because it is the interesting part of MCP: you do not
install a music tool. You ask, Claude searches the tool library, and the matching tool
arrives with its input schema already filled in. Generation is asynchronous, so a run
returns an ID you poll:

```
constants_search_tools  →  constants_execute_tool { tool_name, arguments }  →  constants_check_run
```

**An honest note on the current state.** The site you hear today is the synthesis described
above — the Constants tracks are not yet integrated. Two things stood in the way. The runs
were still rendering hours after they were started, and the audio is hosted on a domain that
the sandbox this project was built in blocks at the egress proxy, so the files could not be
downloaded into the repository. The playback engine for them is written, tested and committed
(`recording.js`), waiting on the audio.

That engine is itself a nice illustration of the difference between the two approaches. A
synthesised player knows when every note happens, because it scheduled them. A recording
knows nothing — it is one stream with the parts already mixed together and no score attached.
So the animation has to be *listened* for: the spectrum is split into seven bands, each band
tracks its own adaptive floor, and an onset is called where a band rises above it. Scored
against a test track with known note times, it finds 31 of 31 events with no misses and no
false positives.

---

## Installing the Constants connector

Official instructions, including the one-click option for Claude Desktop and Claude Code:

**https://www.constants.io/install?client=claude#claude**

Follow that page for the authoritative steps. The CLI form used in this project was:

```bash
claude mcp add constants https://www.constants.io/api/mcp --transport sse
```

The server then needs authorizing before its tools can be used — Claude will prompt you
through the OAuth flow in an interactive session, or you can manage it from your claude.ai
connector settings. Two things worth knowing, both learned the hard way here:

- Authorization and network reachability are separate problems. If your environment blocks
  outbound traffic to `constants.io`, the client may report "Needs authentication" when the
  real cause is a refused connection — the health check never reached the server to discover
  it needed credentials. Check your proxy or egress logs before chasing an auth issue.
- If you are running Claude Code in a sandboxed or remote environment, a connector reaching
  Constants server-side and a locally-added SSE server dialing out from your container are
  not equivalent, and they fail in different ways.

---

## What building this way is actually like

Three things stood out.

**You cannot hear anything, so you measure instead.** Every claim about the audio in this
project came from a headless Chromium harness: per-section output levels, semitone collisions
between parts sounding at once, pixel "ink" per motion mode, vocal spectra. That caught four
bugs that would have been genuinely hard to hear — an animation that computed to
`background-image: none`, a single bad array index that produced `NaN` and silenced an entire
mix, chord voicings drifting up into the melody register, and formant filters applied to a
sine wave, which does nothing at all because a sine has one harmonic and there is nothing
there to shape.

**The measurements are only as good as the signal you test against.** While tuning the onset
detector, an early test track was built from overlapping decaying tones. They beat against
each other, producing real amplitude fluctuations, and the detector was correctly finding
them — the tuning was chasing an artefact of the test file. Rebuilding the track with
non-overlapping events made the numbers meaningful.

**Sharing one system beats copying it five times.** The designs and motion effects started
inside a single piece and were pulled out into `design.css` and `design.js`. A piece now
supplies only what is genuinely its own — a pigment per part, and the geometry its marks move
through. Nothing about the designs is copied into a piece, so they cannot drift apart, and a
piece added later gets all of it for free.

---

## Try it

- **Listen:** [music.readark.club](https://music.readark.club/)
- **Source:** [github.com/readarkclub/music](https://github.com/readarkclub/music)
- **Constants connector:** [constants.io/install?client=claude#claude](https://www.constants.io/install?client=claude#claude)
- **Claude Code:** [claude.com/claude-code](https://claude.com/claude-code)

Open a piece, leave it running, and stop paying attention to it. That is what it is for.
