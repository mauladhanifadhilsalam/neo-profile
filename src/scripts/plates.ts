/**
 * Engraved plates draw themselves when they are first scrolled to: each line is given a
 * turn in document order, as an engraver would cut them. The Tree of Knowledge also names
 * its leaves: pointing at a leaf lights its entry in the index beneath, and the reverse.
 */
import { motionOK } from './frame';

const DRAWN = 'rect, path, ellipse, circle, line, polyline, polygon';

function prepare(): void {
  if (!motionOK()) return;
  for (const plate of document.querySelectorAll<HTMLElement>('.plate')) {
    const svg = plate.querySelector('svg');
    if (!svg) continue;
    let turn = 0;
    for (const el of svg.querySelectorAll<SVGElement>(`${DRAWN}, text`)) {
      if (el.closest('defs, title')) continue;
      // A tree keeps the order set down for it at build time; other plates are cut in document order.
      if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', String(turn));
      turn++;
      // pathLength="1" lets one stylesheet rule draw a line of any length.
      if (el.matches(DRAWN) && !el.hasAttribute('stroke-dasharray')) el.setAttribute('pathLength', '1');
    }
    plate.classList.add('draws');
  }
}

function nameTheLeaves(): void {
  const caption = document.getElementById('tree-caption');
  const resting = caption?.textContent ?? '';
  const pairs = new Map<string, { leaf: SVGElement | null; entry: HTMLElement | null }>();
  for (const leaf of document.querySelectorAll<SVGElement>('[data-leaf]')) {
    pairs.set(leaf.dataset.leaf ?? '', { leaf, entry: null });
  }
  for (const entry of document.querySelectorAll<HTMLElement>('[data-leaf-entry]')) {
    const pair = pairs.get(entry.dataset.leafEntry ?? '');
    if (pair) pair.entry = entry;
  }
  if (pairs.size === 0) return;

  let lit: string | null = null;
  const light = (key: string | null): void => {
    if (key === lit) return;
    if (lit) {
      const old = pairs.get(lit);
      old?.leaf?.classList.remove('lit');
      old?.entry?.classList.remove('lit');
    }
    lit = key;
    const pair = key ? pairs.get(key) : undefined;
    pair?.leaf?.classList.add('lit');
    pair?.entry?.classList.add('lit');
    if (caption) caption.textContent = pair?.leaf?.dataset.name ?? resting;
  };

  for (const [key, { leaf, entry }] of pairs) {
    leaf?.addEventListener('pointerenter', () => light(key));
    leaf?.addEventListener('pointerleave', () => light(null));
    leaf?.addEventListener('click', () => light(key));
    entry?.addEventListener('pointerenter', () => light(key));
    entry?.addEventListener('pointerleave', () => light(null));
    entry?.addEventListener('focusin', () => light(key));
    entry?.addEventListener('focusout', () => light(null));
  }
}

export function initPlates(): void {
  prepare();
  nameTheLeaves();
}
