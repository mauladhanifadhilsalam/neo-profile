/**
 * The lamp: Daylight or Lamplight, remembered per reader. Where the browser can do it,
 * the new light spreads out from the candle itself, and draws back into it when snuffed.
 */
import { motionOK, root } from './frame';

const LAMP_KEY = 'nftbe-lamp';

export function initLamp(): void {
  const lamp = document.getElementById('lamp');
  const label = document.getElementById('lamp-label');
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const isDark = (): boolean => {
    const theme = root.getAttribute('data-theme');
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return media.matches;
  };
  const sync = (): void => {
    const dark = isDark();
    lamp?.setAttribute('aria-pressed', String(dark));
    if (label) label.textContent = dark ? 'Snuff the lamp' : 'Light the lamp';
  };
  const set = (theme: 'dark' | 'light'): void => {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(LAMP_KEY, theme);
    } catch {}
    sync();
  };

  lamp?.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    if (!motionOK() || typeof document.startViewTransition !== 'function') {
      set(next);
      return;
    }

    // The flame sits at the left of the button; the light is measured from there to the far corner.
    const box = lamp.getBoundingClientRect();
    const x = box.left + 15;
    const y = box.top + box.height * 0.3;
    const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const small = `circle(0px at ${x}px ${y}px)`;
    const large = `circle(${reach}px at ${x}px ${y}px)`;

    root.classList.add('lamp-turning');
    root.dataset.lampTo = next;
    const transition = document.startViewTransition(() => set(next));
    transition.ready
      .then(() => {
        // Lighting: the lamplit page grows out of the flame. Snuffing: it shrinks back into it.
        root.animate(
          { clipPath: next === 'dark' ? [small, large] : [large, small] },
          {
            duration: 850,
            easing: 'cubic-bezier(.4, 0, .2, 1)',
            fill: 'both',
            pseudoElement: next === 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
          },
        );
      })
      .catch(() => {});
    transition.finished.finally(() => {
      root.classList.remove('lamp-turning');
      delete root.dataset.lampTo;
    });
  });

  media.addEventListener('change', sync);
  sync();
}
