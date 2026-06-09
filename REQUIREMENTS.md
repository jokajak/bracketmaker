# Bracket Maker — Requirements & Tracking

Living checklist of what Bracket Maker does today and what's planned. Status
keys: ✅ done · 🔜 planned (agreed, not built) · 💡 idea (needs decisions).

---

## ✅ Implemented

| # | Requirement | Notes |
|---|-------------|-------|
| R1 | Single-elimination brackets | Configurable participant count. |
| R2 | Configurable size: 2 / 4 / 8 / 16 / 32 / 64 | Dropdown selector (minimum 2). |
| R3 | Title slot | Typed title at the top of the sheet; prints what you enter. |
| R4 | Printable, blank brackets | Blank lines for every matchup to fill in by hand. |
| R5 | Print layout | Controls hidden; landscape `@page`; "Fit to page" recommended for large sizes. |
| R6 | Two-sided ("March Madness") layout | Left half flows right, right half mirrors it, champion in the centre. |
| R6a | Smooth, connected connectors | Each connector is one rounded shape; arms, joiner and stub are colinear so lines never break. |
| R7 | Static hosting | No build step; served from the repo root on GitHub Pages. |
| R8 | Fillable entries | Every slot (and the champion) is a text input — type names directly, or leave blank to handwrite. On screen each shows a visible field box; printing strips the box and keeps only the writing line. |

---

## 🔜 Planned

| # | Requirement | Notes |
|---|-------------|-------|
| R9 | Save / load brackets | Persist a filled-in bracket so entries survive a refresh and can be shared (localStorage + JSON export/import, like jeopardymaker). |

---

## 💡 Ideas (need decisions before building)

### R10 — Wildcard / play-in for the 16-seed
A "battle for the 16th seed" play-in game whose winner becomes the 16-seed that
faces the 1-seed (à la the NCAA First Four).

Decisions captured so far:
- **Availability:** a toggle (checkbox), offered for the **64-bracket only**.

Still open (deferred — not building yet):
- **How many play-ins?** Options discussed: one per region (4 total),
  two (like the real First Four's two 16-seed games), or just one (the overall
  top 1-seed's opponent).
- How a play-in slot renders (an extra mini-match feeding the 16-seed line on
  the outer edge) and how it prints.

---

## Out of scope (for now)

- Double elimination / consolation brackets
- Seeding, byes, or non-power-of-two counts (beyond the R10 play-in idea)
- Score / result tracking
- Accounts or cloud sync
