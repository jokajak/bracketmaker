# Bracket Maker — Requirements & Tracking

Living checklist of what Bracket Maker does today and what's planned. Status
keys: ✅ done · 🔜 planned (agreed, not built) · 💡 idea (needs decisions).

---

## ✅ Implemented

| # | Requirement | Notes |
|---|-------------|-------|
| R1 | Single-elimination brackets | Configurable participant count. |
| R2 | Configurable size: 8 / 16 / 32 / 64 | Dropdown selector. |
| R3 | Title slot | Typed title at the top of the sheet; prints what you enter. |
| R4 | Printable, blank brackets | Blank lines for every matchup to fill in by hand. |
| R5 | Print layout | Controls hidden; landscape `@page`; "Fit to page" recommended for large sizes. |
| R6 | Two-sided ("March Madness") layout | Left half flows right, right half mirrors it, champion in the centre. |
| R7 | Static hosting | No build step; served from the repo root on GitHub Pages. |

---

## 🔜 Planned

| # | Requirement | Notes |
|---|-------------|-------|
| R8 | Fillable entries | Let users type participant names directly into the slots instead of only handwriting. Slots stay blank-looking when empty so the same sheet still prints for handwriting. Slot markup already supports swapping the blank line for an `<input>`. |
| R9 | Save / load brackets | Persist a filled-in bracket (localStorage + JSON export/import, like jeopardymaker). Depends on R8. |

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
