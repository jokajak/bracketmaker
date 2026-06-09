# Bracket Maker — Design Doc

## Overview

A static web app for generating printable single-elimination tournament
brackets. Choose a participant count and a title, then print a blank bracket
to fill in by hand. No server, no build step — served from the repo root on
GitHub Pages (same model as jeopardymaker).

---

## Scope

> See `REQUIREMENTS.md` for the live status checklist.

### v1 (this version)
- Single-elimination brackets for **8, 16, 32, or 64** participants.
- A **title** slot at the top (typed, prints what you enter).
- **Two-sided ("March Madness") layout**: two halves mirror each other with the
  champion in the centre.
- **Fillable entries**: every slot is a text input — type names, or leave blank
  to handwrite. Empty inputs print as plain blank lines.
- **Print-friendly** output: blank matchup lines to handwrite on, controls
  hidden, landscape `@page`.

### Later
- Save / load brackets (localStorage + JSON export, à la jeopardymaker).
- A wildcard / 16-seed play-in toggle for the 64-bracket (deferred — see
  `REQUIREMENTS.md` R10).

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
Each `.connector` draws a vertical joiner across the middle 50% of its match
(connecting the two feeder slots, which sit at 25% / 75%) plus a horizontal
stub from the centre out to the winner slot. Each writing line is a text
`<input>` whose bottom border is anchored to its band's vertical centre
(`bottom: 50%`), so the connectors meet it exactly whether it's blank or typed.

---

## Files

- `index.html` — controls (size, title, print), the printable sheet, styles,
  and a small module that wires the controls to `renderBracket`.
- `src/bracket.js` — `renderBracket(container, { size })` and the recursive
  builder.

---

## Out of scope (v1)

- Double elimination / consolation brackets
- Seeding, byes, or non-power-of-two counts
- Scores / results tracking
- Accounts or cloud sync
