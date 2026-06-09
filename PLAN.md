# Bracket Maker — Design Doc

## Overview

A static web app for generating printable single-elimination tournament
brackets. Choose a participant count and a title, then print a blank bracket
to fill in by hand. No server, no build step — served from the repo root on
GitHub Pages (same model as jeopardymaker).

---

## Scope

### v1 (this version)
- Single-elimination brackets for **8, 16, 32, or 64** participants.
- A **title** slot at the top (typed, prints what you enter).
- **Print-friendly** output: blank matchup lines to handwrite on, controls
  hidden, landscape `@page`.

### Later
- Typeable participant slots (the slot markup is already there; swap the blank
  line for an `<input>` and the print CSS keeps it clean).
- Save / load brackets (localStorage + JSON export, à la jeopardymaker).
- Optional two-sided (mirrored) layout to pack 32/64 onto a page more tightly.

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

For `N` participants there are `log2(N)` connector columns (`log2(N)+1`
columns total), `N` leaf slots and `N-1` winner slots.

### Connector lines
Each `.connector` draws a vertical joiner across the middle 50% of its match
(connecting the two feeder slots, which sit at 25% / 75%) plus a horizontal
stub from the centre out to the winner slot. Writing lines are zero-height
rules centred in their band so the connectors meet them exactly.

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
