/**
 * The book's quiet machinery: things that are revealed as they are scrolled to, things that
 * follow the scroll, figures that count up, and the lamplight that follows the hand.
 */
import { clamp, ease, motionOK, onFrame, pointer, root } from './frame';

/** The spine wraps onto two lines on a phone, so its height is measured, not assumed. */
function trackSpine(): void {
  const spine = document.querySelector<HTMLElement>('.spine');
  if (!spine) return;
  const set = () => root.style.setProperty('--spine-h', `${spine.offsetHeight}px`);
  set();
  new ResizeObserver(set).observe(spine);
}

/**
 * A rubric hairline under the spine: how far through this leaf the reader has come.
 * The number is published on the hairline itself, not on the root: a custom property set on
 * the root would have every element on the page restyled each time it changed.
 */
function trackReading(): void {
  const bar = document.querySelector<HTMLElement>('.spine-read');
  if (!bar) return;
  let shown = -1;
  onFrame(() => {
    const room = root.scrollHeight - window.innerHeight;
    const read = room > 0 ? clamp(window.scrollY / room) : 0;
    if (Math.abs(read - shown) > 0.001) {
      shown = read;
      bar.style.setProperty('--read', read.toFixed(4));
    }
  });
}

/** Elements marked data-reveal are held back by the stylesheet until they come into view. */
function revealOnScroll(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], .plate, .sidenote');
  if (!motionOK() || !('IntersectionObserver' in window)) {
    for (const el of targets) el.classList.add('is-in');
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );
  for (const el of targets) observer.observe(el);
}

/** data-thread: --p runs 0 → 1 as the element passes a line two thirds of the way down the window. */
function threadOnScroll(): void {
  const threads = [...document.querySelectorAll<HTMLElement>('[data-thread]')].map((el) => ({ el, shown: 0, first: true }));
  if (threads.length === 0) return;
  if (!motionOK()) {
    for (const { el } of threads) el.style.setProperty('--p', '1');
    return;
  }
  onFrame(() => {
    let moving = false;
    const line = window.innerHeight * 0.66;
    for (const thread of threads) {
      const rect = thread.el.getBoundingClientRect();
      const target = clamp((line - rect.top) / Math.max(1, rect.height));
      const next = thread.first ? target : ease(thread.shown, target, 0.16);
      thread.first = false;
      if (next !== thread.shown) {
        thread.shown = next;
        thread.el.style.setProperty('--p', next.toFixed(4));
      }
      if (next !== target) moving = true;
    }
    return moving;
  });
}

/** data-count: a figure that counts up to its printed value the first time it is seen. */
function countUp(): void {
  const figures = document.querySelectorAll<HTMLElement>('[data-count]');
  if (figures.length === 0 || !motionOK() || !('IntersectionObserver' in window)) return;
  const run = (el: HTMLElement) => {
    const end = Number(el.dataset.count);
    if (!Number.isFinite(end)) return;
    const started = performance.now();
    const duration = 1100 + Math.min(900, end);
    const step = (now: number) => {
      const t = clamp((now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = String(Math.round(end * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        run(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.6 },
  );
  for (const el of figures) observer.observe(el);
}

/** By lamplight, a pool of candle-light follows the pointer across the page, a little behind it. */
function lamplight(): void {
  const light = document.querySelector<HTMLElement>('.lamplight');
  if (!light || !motionOK()) return;
  let x = window.innerWidth / 2;
  let y = window.innerHeight * 0.3;
  onFrame(() => {
    // By daylight the stylesheet does not draw the light at all, and there is nothing to move.
    if (!pointer.seen || light.getClientRects().length === 0) return;
    const nx = ease(x, pointer.x, 0.14, 0.3);
    const ny = ease(y, pointer.y, 0.14, 0.3);
    if (nx === x && ny === y) return;
    x = nx;
    y = ny;
    light.style.setProperty('--mx', `${x.toFixed(1)}px`);
    light.style.setProperty('--my', `${y.toFixed(1)}px`);
    return x !== pointer.x || y !== pointer.y;
  });
}

export function initMotion(): void {
  trackSpine();
  trackReading();
  revealOnScroll();
  threadOnScroll();
  countUp();
  lamplight();
}
