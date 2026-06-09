// Bracket Maker — single-elimination bracket generator.
//
// Renders a printable single-elimination bracket using a recursive flexbox
// layout. The recursion guarantees that every connector line is vertically
// centered between the two slots that feed it, for any power-of-two size,
// with no magic-number spacing.

const VALID_SIZES = [2, 4, 8, 16, 32, 64];

// Standard tournament seeding order (top-to-bottom) within one region/quadrant.
// Each pair of adjacent entries is a first-round matchup, so the top seed meets
// the lowest seed, and the seed sums stay constant each round. The 16 ordering
// matches the traditional NCAA region layout (1 at the top, 2 at the bottom).
const SEED_ORDERS = {
  2: [1, 2],
  4: [1, 4, 2, 3],
  8: [1, 8, 4, 5, 2, 7, 3, 6],
  16: [1, 16, 8, 9, 5, 12, 4, 13, 6, 11, 3, 14, 7, 10, 2, 15],
};

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

// A single name slot — a band with a writing line at its vertical centre.
// The line is a text input: type a name, or leave it blank to fill in by hand.
// Leaf/feeder slots grow to fill their band; output slots stay centred.
function slot(isOutput) {
  const s = el('div', isOutput ? 'slot out' : 'slot');
  const input = el('input', 'line');
  input.type = 'text';
  input.autocomplete = 'off';
  input.setAttribute('aria-label', isOutput ? 'Winner' : 'Participant');
  s.append(input);
  return s;
}

// Build the subtree for `rounds` rounds. Returns a node whose right edge
// outputs a single (vertically centred) winner slot.
function build(rounds) {
  if (rounds === 0) return slot(false); // first-round entrant (leaf)

  const match = el('div', 'match');

  const feeders = el('div', 'feeders');
  feeders.append(build(rounds - 1), build(rounds - 1));

  const connector = el('div', 'connector');

  const outcol = el('div', 'outcol');
  outcol.append(slot(true));

  match.append(feeders, connector, outcol);
  return match;
}

// The centre column: the two finalists (one from each half) meet here.
function championCenter() {
  const center = el('div', 'final-center');
  const box = el('div', 'champion-box');
  const label = el('div', 'champion-label');
  label.textContent = 'Champion';
  const line = el('input', 'champion-line');
  line.type = 'text';
  line.autocomplete = 'off';
  line.setAttribute('aria-label', 'Champion');
  box.append(label, line);
  center.append(box);
  return center;
}

// Number the first-round slots within each quadrant (March Madness style).
// The bracket splits into up to four quadrants (top-left, bottom-left,
// top-right, bottom-right); each is seeded 1..quadrantSize in standard order,
// so seeds repeat across quadrants the way regions do in the NCAA bracket.
function assignSeeds(bracket, size) {
  const regions = Math.min(4, size / 2); // quadrants, but never smaller than 2
  const regionSize = size / regions;
  const order = SEED_ORDERS[regionSize];
  if (!order) return;

  // Leaf slots in document order are top-to-bottom, left half then right half.
  bracket.querySelectorAll('.slot:not(.out)').forEach((leaf, i) => {
    const span = el('span', 'seed');
    span.textContent = String(order[i % regionSize]);
    leaf.classList.add('seeded');
    if (leaf.closest('.half.right')) leaf.classList.add('seed-right');
    leaf.append(span);
  });
}

// Render a two-sided ("March Madness") bracket into `container`.
// Each half is a single-elimination sub-bracket of size/2 that produces one
// finalist; the left half flows rightward, the right half mirrors it, and the
// champion sits in the centre between the two finalists.
export function renderBracket(container, { size }) {
  if (!VALID_SIZES.includes(size)) {
    throw new Error(`Unsupported bracket size: ${size}`);
  }

  const halfRounds = Math.log2(size) - 1; // rounds within one half
  container.innerHTML = '';
  container.style.setProperty('--participants', String(size));

  const bracket = el('div', 'bracket');

  const left = el('div', 'half left');
  left.append(build(halfRounds));

  const right = el('div', 'half right');
  right.append(build(halfRounds));

  bracket.append(left, championCenter(), right);
  assignSeeds(bracket, size);
  container.append(bracket);
}

export { VALID_SIZES };
