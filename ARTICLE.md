# Quiet Pieces: five recordings, five scores, and an animation that listens

**[music.readark.club](https://music.readark.club/)** is a small listening site: five quiet
instrumental recordings, each with a printable lead sheet, and a player whose visualization
is drawn from the music actually playing rather than from a loop running beside it.

It was built in [Claude Code](https://claude.com/claude-code), scored and recorded through
the [Constants](https://www.constants.io/) connector, and its animations were re-edited with
Codex. This is a walk through what each of those did.

---

## What's on the shelf

| | Recording | Duration | Score |
|---|---|---:|---|
| 01 | **Sunroom Glow** | 2:28 | PDF · 2 pages |
| 02 | **Afterglow Drift** | 1:53 | PDF |
| 03 | **Evensong at Dusk** | 3:07 | PDF |
| 04 | **Window With Rain** | 3:03 | PDF · MusicXML |
| 05 | **Still Water** | 2:55 | PDF |

Thirteen minutes and twenty-five seconds end to end. The home page will play all five back
to back and loop, so you can open it and stop thinking about it — which is the point.

---

## Constants did the music and the notation

The five tracks were generated with the **Constants AI music generator**, each from a prompt
describing the mood rather than the notes: warm keys gathering in a room full of late light;
a lo-fi loop for the end of the day; a violin at dusk. What comes back is a finished stereo
recording, and each piece page links to the exact Constants run that produced it, so the
provenance is visible rather than asserted.

Just as usefully, the same pass produced the **notation**. Every piece ships a lead sheet as
PDF, preserving the harmonic form and the lead line, and one piece also ships its
**MusicXML** source — which means you can open it in MuseScore, Sibelius or Dorico and edit
it as notation, not as a picture of notation. All five lead sheets are collected in a
ten-page scorebook.

That combination is the interesting part. Generated audio on its own gives you something to
listen to. Generated audio *plus* an editable score gives you something to play, and the site
is built around that: every page pairs the recording with the sheet music, embedded so you
can read along while it runs.

### How the connector works

Constants is an MCP server, so Claude discovers its tools at runtime instead of having them
wired in ahead of time. The shape of a job is:

```
constants_search_tools   →   constants_execute_tool { tool_name, arguments }   →   constants_check_run
```

You describe what you want, Claude searches the tool library, and the matching tool arrives
with its input schema already filled in. Music generation is asynchronous, so execution
returns a run ID you poll until the audio is ready — which is why the run URLs make good
permanent references.

---

## Codex did the animations

Each piece page used to carry its own synthesis engine — around a thousand lines apiece. With
real recordings in place, all of that came out and was replaced by one shared player of about
a hundred lines. `player.js` connects the `<audio>` element to a Web Audio `AnalyserNode` and
redraws a canvas from the live spectrum every frame.

The **Motion** control changes what that spectrum becomes:

| | |
|---|---|
| **Bloom** | Energy lifting off the centre line |
| **Ripple** | Rings opening outward, driven by low-band energy |
| **Trails** | Recent frames persist, so the last few seconds stay visible as a fading wake |
| **Still** | A single flat line — no motion at all |

A separate **Design** control switches between **Nocturne** (dark) and **Classical**
(editorial paper). Both choices are saved and follow you between pages, and `design.js` reads
them before first paint so nothing flashes on load.

Two details worth stealing. The canvas scales by `devicePixelRatio` so the line stays crisp
on retina displays without over-rendering beyond 2×. And before you press play — when there
is no analyser and therefore no spectrum — the visualizer runs a slow synthetic idle wave, so
the page is alive when you arrive rather than a dead rectangle.

The home page adds a queue player on top: continuous play across all five tracks, automatic
looping, previous/next, a scrub bar, and `MediaSession` metadata so the track title shows up
properly in OS media controls and on a phone's lock screen.

---

## Still no build step

For all the change underneath, the constraint held: **no framework, no bundler, no runtime
dependency.** The site is HTML, CSS and a few hundred lines of plain JavaScript, plus the
audio and the PDFs. Nothing is compiled and nothing is fetched from a CDN.

The only requirement is that it be served over HTTP rather than opened from the filesystem,
so the browser will load the audio and the embedded PDFs:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`.

---

## Installing the Constants connector

The official instructions, including the one-click option for Claude Desktop and Claude Code:

### **https://www.constants.io/install?client=claude#claude**

Follow that page for the authoritative steps. The CLI form is:

```sh
claude mcp add constants https://www.constants.io/api/mcp --transport sse
```

The server then needs authorizing before its tools become available — Claude walks you
through the OAuth flow in an interactive session, or you can manage it from your claude.ai
connector settings.

One piece of hard-won troubleshooting: **authorization and network reachability are separate
problems, and they can look identical.** If your environment restricts outbound traffic, the
client may report *"Needs authentication"* when the real cause is a refused connection — the
health check never reached the server to discover that it wanted credentials. Before chasing
an auth issue, check whether the host is reachable at all. This matters most if you are
running Claude Code in a sandboxed or remote environment, where a connector that reaches
Constants server-side and a locally-added SSE server dialing out from your container are not
the same thing and do not fail the same way.

---

## The shape of the workflow

What made this work was letting each tool do the part it is actually good at.

**Constants** made the music and the notation — the part that is genuinely generative, where
you want a finished stereo master and an editable score rather than something you assemble by
hand. **Codex** rewrote the animation layer, a well-scoped refactor: delete a thousand lines
of synthesis per page, replace with one shared audio-reactive player. **Claude Code** built
and maintains the site around them, and knows the whole repository well enough to keep the
design system, the routing and the copy consistent while everything underneath changed.

The five pages kept their original URLs through all of it. From the outside the site simply
got better; underneath, almost every line changed.

---

## Try it

- **Listen:** [music.readark.club](https://music.readark.club/)
- **Source:** [github.com/readarkclub/music](https://github.com/readarkclub/music)
- **Constants:** [constants.io/install?client=claude#claude](https://www.constants.io/install?client=claude#claude)
- **Claude Code:** [claude.com/claude-code](https://claude.com/claude-code)

Open a piece, press play, and stop paying attention to it. That is what it is for.

---

*MIT licensed. Audio and score rights remain with their respective owner.*
