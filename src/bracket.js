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
// Leaf/feeder slots grow to fill their band; output slots stay centred.
function slot(isOutput) {
  const s = el('div', isOutput ? 'slot out' : 'slot');
  s.append(el('div', 'line'));
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

// Render a bracket of `size` participants into `container`.
export function renderBracket(container, { size }) {
  if (!VALID_SIZES.includes(size)) {
    throw new Error(`Unsupported bracket size: ${size}`);
  }

  const rounds = Math.log2(size); // number of connector columns
  container.innerHTML = '';
  container.style.setProperty('--participants', String(size));

  const bracket = build(rounds);
  bracket.classList.add('bracket');

  // Label the final winner slot as the champion.
  const championOut = bracket.querySelector(':scope > .outcol > .slot.out');
  if (championOut) {
    const caption = el('div', 'champion-label');
    caption.textContent = 'Champion';
    championOut.prepend(caption);
  }

  container.append(bracket);
}

export { VALID_SIZES };
