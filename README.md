# Quiet Pieces

Five quiet recordings with audio-reactive players and printable lead sheets.

**[Listen](https://readarkclub.github.io/music/)**

| | Recording | Duration | Score |
|---|---|---:|---|
| 01 | **[Sunroom Glow](sunroom.html)** | 2:28 | [PDF](assets/scores/sunroom.pdf) |
| 02 | **[Afterglow Drift](afterglow.html)** | 1:53 | [PDF](assets/scores/afterglow.pdf) |
| 03 | **[Evensong at Dusk](evensong.html)** | 3:07 | [PDF](assets/scores/evensong.pdf) |
| 04 | **[Window With Rain](blue-hour.html)** | 3:03 | [PDF](assets/scores/blue-hour.pdf) · [MusicXML](assets/scores/blue-hour.musicxml) |
| 05 | **[Still Water](still-water.html)** | 2:55 | [PDF](assets/scores/still-water.pdf) |

The [complete scorebook](assets/scores/all-five-pieces.pdf) contains all five lead sheets.

## Player

Every piece keeps its existing URL but now plays a real MP3 recording. `player.js` connects the audio element to a Web Audio analyser and redraws the canvas from the live spectrum. The shared Motion control changes the visualization between Bloom, Ripple, Trails and Still; the shared Design control switches between Nocturne and Classical.

There are no runtime dependencies or build step. Serve the repository over HTTP so browsers can load the audio and embedded PDFs:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Files

- `assets/audio/` — five MP3 recordings retrieved from the supplied Constants runs
- `assets/scores/` — the supplied individual PDFs, complete scorebook and MusicXML source
- `player.css`, `player.js` — shared player layout, controls and audio-reactive motion
- `design.css`, `design.js` — shared Nocturne/Classical design and saved preferences

## Licence

MIT. Audio and score rights remain with their respective owner.
