/**
 * One animation frame for the whole book. Scroll, resize and pointer events only ask for a
 * frame; every effect then reads and writes inside it, so nothing lays the page out twice.
 */

export const root = document.documentElement;

const motionQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
/** False for readers who have asked their system for less motion. */
export const motionOK = (): boolean => motionQuery.matches;

export const clamp = (n: number, lo = 0, hi = 1): number => Math.min(hi, Math.max(lo, n));

/** Moves `from` a fraction of the way to `to`, arriving exactly once it is close enough. */
export function ease(from: number, to: number, rate: number, epsilon = 0.0005): number {
  const next = from + (to - from) * rate;
  return Math.abs(to - next) < epsilon ? to : next;
}

/** A task returns true while it still has somewhere to go, to be called again next frame. */
type Task = () => boolean | void;

const tasks: Task[] = [];
let scheduled = false;

function tick(): void {
  scheduled = false;
  let again = false;
  for (const task of tasks) if (task()) again = true;
  if (again) requestFrame();
}

export function requestFrame(): void {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(tick);
}

export function onFrame(task: Task): void {
  tasks.push(task);
  requestFrame();
}

/** The pointer, in viewport pixels; null until a mouse or pen has moved. */
export const pointer: { x: number; y: number; seen: boolean } = { x: 0, y: 0, seen: false };

window.addEventListener('scroll', requestFrame, { passive: true });
window.addEventListener('resize', requestFrame);
window.addEventListener(
  'pointermove',
  (event) => {
    if (event.pointerType === 'touch') return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.seen = true;
    requestFrame();
  },
  { passive: true },
);
