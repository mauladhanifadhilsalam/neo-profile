/**
 * The owl of Minerva watches the reader. Its pupils turn toward the pointer; the blinking
 * is left to the stylesheet. On a touch screen it simply keeps looking straight ahead.
 */
import { ease, motionOK, onFrame, pointer } from './frame';

/** How far a pupil may travel inside its eye, in the drawing's own units. */
const REACH = 2.4;
/** The owl's brow in the 240-unit drawing, from which its gaze is measured. */
const BROW = { x: 122, y: 95 };

export function initOwl(): void {
  const owls = [...document.querySelectorAll<SVGSVGElement>('svg[data-owl]')].map((svg) => ({ svg, x: 0, y: 0 }));
  if (owls.length === 0 || !motionOK()) return;

  onFrame(() => {
    if (!pointer.seen) return;
    let moving = false;
    for (const owl of owls) {
      const box = owl.svg.getBoundingClientRect();
      if (box.width === 0 || box.bottom < 0 || box.top > window.innerHeight) continue;
      const scale = box.width / 240;
      const dx = pointer.x - (box.left + BROW.x * scale);
      const dy = pointer.y - (box.top + BROW.y * scale);
      // Near the owl the gaze shortens, so it never looks cross-eyed at a pointer on its beak.
      const distance = Math.hypot(dx, dy);
      const pull = Math.min(1, distance / (box.width * 0.6)) * REACH;
      const tx = distance > 0 ? (dx / distance) * pull : 0;
      const ty = distance > 0 ? (dy / distance) * pull : 0;
      const nx = ease(owl.x, tx, 0.2, 0.01);
      const ny = ease(owl.y, ty, 0.2, 0.01);
      if (nx !== owl.x || ny !== owl.y) {
        owl.x = nx;
        owl.y = ny;
        owl.svg.style.setProperty('--gaze-x', nx.toFixed(2));
        owl.svg.style.setProperty('--gaze-y', ny.toFixed(2));
      }
      if (nx !== tx || ny !== ty) moving = true;
    }
    return moving;
  });
}
