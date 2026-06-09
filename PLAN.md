# Bracket Maker — Design Doc

## Overview

A static web app for generating printable single-elimination tournament
brackets. Choose a participant count and a title, then print a blank bracket
to fill in by hand. No server, no build step — served from the repo root on
GitHub Pages (same model as jeopardymaker).

---

## Scope

> See `REQUIREMENTS.md` for the live status checklist.

### Built
- Single-elimination brackets for **2, 4, 8, 16, 32, or 64** participants.
- A **title** slot at the top (typed, prints what you enter).
- **Two-sided ("March Madness") layout**: two halves mirror each other with the
  champion in the centre.
- **Fillable entries**: every slot is a text input — type names, or leave blank
  to handwrite. On screen each is a visible field box; print keeps only the line.
- **Per-quadrant seed numbers** in standard tournament order.
- **Save / load**: auto-save to localStorage plus JSON file export/import.
- **Print-friendly** output: blank matchup lines to handwrite on, controls
  hidden, landscape `@page`.

### Later
- A wildcard / 16-seed play-in toggle for the 64-bracket (deferred — see
  `REQUIREMENTS.md` R11).

---

## Layout approach

The bracket is built recursively in `src/bracket.js`:

```
build(rounds):
  rounds === 0  -> a leaf slot (first-round entrant)
  otherwise     -> a .match = [ .feeders | .connector | .outcol ]
                     .feeders  = build(rounds-1) ×2  (top + bottom halves)
                     .outcol   = the winner slot, vertically centred
```

Because each `.feeders` is a flex column of two equal subtrees, and each
`.outcol` centres its single slot against the full height of those subtrees,
**flexbox does all the vertical alignment** — every connector line meets the
midpoint between the two slots that feed it, at any size, with no magic-number
spacing.

### Two-sided layout
The full bracket is `[ left half | champion | right half ]`. Each half is a
sub-bracket of `N/2` entrants built with `build(log2(N) - 1)`, producing one
finalist. The right half reuses the same builder, mirrored with CSS
(`flex-direction: row-reverse` plus moving the connector's vertical joiner to
the other side), and the champion slot sits in the centre between the two
finalists. The bracket is therefore half as tall as the participant count.

### Connector lines
Each `.connector` is drawn as a single rounded shape: a `::before` box supplies
the two arms (at 25% / 75%, where the feeder slots sit) joined by a vertical bar
with rounded corners, and a `::after` is the stub from the bar's middle to the
winner slot. Every writing line is a text `<input>` whose bottom border is
anchored to its band (`bottom: 50%`); the arms and stub are nudged so all the
horizontal lines are colinear, so the bracket never shows a step or gap. The
right half reuses the same connector flipped with `transform: scaleX(-1)`.

The smallest bracket (2) has no connectors — each half is a single entrant line
that runs straight into the champion in the centre.

### Seeding
The bracket is split into up to four quadrants (`Math.min(4, size/2)` regions);
each is numbered `1..quadrantSize` in standard tournament order so the top seed
meets the lowest seed. Leaf slots in document order are top-to-bottom, left half
then right half, which maps cleanly onto the quadrants; `assignSeeds` walks them
and drops a `.seed` label on the outer edge (mirrored for the right half).

### Persistence
The state is `{ size, title, entries[], champion }`, where `entries` is every
`.line` value in document order — deterministic for a given size, so re-rendering
and re-filling round-trips losslessly. It auto-saves to `localStorage` on every
edit and can be exported/imported as a JSON file.

---

## Files

- `index.html` — controls (size, title, print, save/load), the printable sheet,
  styles, and a small module that wires the controls to `renderBracket`.
- `src/bracket.js` — `renderBracket(container, { size })` and the recursive
  builder.

---

## Out of scope (v1)

- Double elimination / consolation brackets
- Seeding, byes, or non-power-of-two counts
- Scores / results tracking
- Accounts or cloud sync
