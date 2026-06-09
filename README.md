# Bracket Maker

Generate printable single-elimination tournament brackets. Pick a size
(2, 4, 8, 16, 32, or 64 participants), add a title, and either type entries in
or print a blank bracket to fill in by hand. No server, no build step, no
accounts.

## Use it

**https://jokajak.github.io/bracketmaker/**

## How to run locally

Because the page loads ES modules, open it through a tiny static server rather
than via `file://`:

```sh
cd bracketmaker
python3 -m http.server 8000
# then visit http://localhost:8000/
```

(Opening `index.html` directly with `file://` will load the page but the
bracket won't render, due to browser module-loading rules.)

## How to use

1. Choose the number of **Participants** (2 / 4 / 8 / 16 / 32 / 64).
2. Type a **title** for the bracket (optional).
3. Type names into the slots, or leave them blank to fill in by hand.
4. Click **Print bracket**. In the print dialog choose **Landscape** and
   "Fit to page" for the larger sizes.

The bracket is two-sided (March Madness style) with the champion in the centre.
Empty slots print as plain blank lines, so you can either type entries in
advance or print a blank sheet and write players in by hand.

## Roadmap

- [x] Configurable single-elimination brackets (2/4/8/16/32/64)
- [x] Title slot
- [x] Print-friendly layout
- [x] Two-sided (March Madness) layout
- [x] Type participant names directly into the slots
- [ ] Save / load brackets

## Implementation

A single `index.html` (markup + styles) plus `src/bracket.js`, which builds the
bracket with a recursive flexbox layout so the connector lines stay aligned at
any size. See `PLAN.md` for the design notes.
