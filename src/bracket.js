// Bracket Maker — single-elimination bracket generator.
//
// Renders a printable single-elimination bracket using a recursive flexbox
// layout. The recursion guarantees that every connector line is vertically
// centered between the two slots that feed it, for any power-of-two size,
// with no magic-number spacing.

const VALID_SIZES = [8, 16, 32, 64];

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
  connector.append(el('div', 'conn-line'));

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
  container.append(bracket);
}

export { VALID_SIZES };
