/**
 * The title page lies under a cloth cover, and scrolling opens the book.
 *
 * The stylesheet does the binding: where there is room and the reader has not asked for less
 * motion, the volume is pinned (position: sticky) for a stretch of scrolling. This script only
 * reports how far through that stretch the reader has come, as --p from 0 (shut) to 1 (open),
 * and the stylesheet turns the boards by it. Where the volume is not pinned, the book is simply open.
 */
import { clamp, ease, motionOK, onFrame, pointer, requestFrame } from './frame';

/** The cover is fully open after this share of the pinned stretch; the rest holds the open book still. */
const OPEN_BY = 0.8;

const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function initCover(): void {
  const stage = document.querySelector<HTMLElement>('[data-cover]');
  const volume = stage?.querySelector<HTMLElement>('.volume');
  const board = stage?.querySelector<HTMLElement>('.board');
  if (!stage || !volume || !board) return;

  let bound = false;
  let stickyTop = 0;
  let stretch = 0;
  const measure = (): void => {
    const style = getComputedStyle(volume);
    bound = motionOK() && style.position === 'sticky';
    stickyTop = parseFloat(style.top) || 0;
    stretch = Math.max(1, stage.offsetHeight - volume.offsetHeight);
    requestFrame();
  };
  measure();
  new ResizeObserver(measure).observe(stage);
  window.addEventListener('resize', measure);

  /** How far to scroll, from here, for the book to lie fully open. */
  const distanceToOpen = (): number => stage.getBoundingClientRect().top - stickyTop + stretch * OPEN_BY + 2;

  // Lift the cover a little, once, if the reader arrives with the book shut.
  if (bound && stickyTop - stage.getBoundingClientRect().top <= 0) stage.classList.add('peeks');

  let shown = -1;
  let tiltX = 0;
  let tiltY = 0;
  let sheen = 0.5;
  let first = true;

  onFrame(() => {
    if (!bound) {
      if (shown !== 1) {
        shown = 1;
        stage.style.setProperty('--p', '1');
        stage.classList.add('is-open');
        stage.classList.remove('is-shut');
      }
      return;
    }

    const travelled = stickyTop - stage.getBoundingClientRect().top;
    const target = easeInOut(clamp(travelled / (stretch * OPEN_BY)));
    const next = first ? target : ease(shown, target, 0.2);
    if (next !== shown) {
      shown = next;
      stage.style.setProperty('--p', next.toFixed(4));
      stage.classList.toggle('is-open', next > 0.42);
      stage.classList.toggle('is-shut', next < 0.015);
    }

    // The shut book leans a little toward the hand, and its gilt catches the light as the hand moves.
    let leaning = false;
    if (pointer.seen) {
      const tx = (pointer.x / window.innerWidth - 0.5) * 2;
      const ty = (pointer.y / window.innerHeight - 0.5) * 2;
      const nx = ease(tiltX, tx, first ? 1 : 0.1, 0.002);
      const ny = ease(tiltY, ty, first ? 1 : 0.1, 0.002);
      const ns = ease(sheen, pointer.x / window.innerWidth, first ? 1 : 0.1, 0.002);
      if (nx !== tiltX || ny !== tiltY || ns !== sheen) {
        tiltX = nx;
        tiltY = ny;
        sheen = ns;
        stage.style.setProperty('--tilt-x', nx.toFixed(3));
        stage.style.setProperty('--tilt-y', ny.toFixed(3));
        stage.style.setProperty('--sheen', ns.toFixed(3));
      }
      leaning = nx !== tx || ny !== ty;
    }
    first = false;
    return next !== target || leaning;
  });

  // A click on the cover opens it.
  board.addEventListener('click', () => {
    if (!bound) return;
    window.scrollBy({ top: distanceToOpen(), behavior: 'smooth' });
  });

  // A reader tabbing into the title page must not land on a link hidden under the cover.
  volume.addEventListener('focusin', (event) => {
    if (!bound || shown > 0.98 || board.contains(event.target as Node)) return;
    const distance = distanceToOpen();
    if (distance > 0) window.scrollBy({ top: distance, behavior: 'auto' });
  });
}
