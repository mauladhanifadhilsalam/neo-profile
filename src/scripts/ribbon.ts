/** The ribbon: remember the last chapter or Note opened, and offer it on the title page. */

const RIBBON_KEY = 'nftbe-ribbon';

export function initRibbon(): void {
  const title = document.body.dataset.ribbon;
  if (title) {
    try {
      localStorage.setItem(RIBBON_KEY, JSON.stringify({ path: location.pathname, title }));
    } catch {}
  }

  const resume = document.getElementById('resume');
  const link = document.getElementById('resume-link');
  if (!resume || !link) return;
  try {
    const saved = JSON.parse(localStorage.getItem(RIBBON_KEY) ?? 'null');
    const valid =
      saved &&
      typeof saved.path === 'string' &&
      typeof saved.title === 'string' &&
      saved.path.startsWith('/') &&
      !saved.path.startsWith('//') &&
      saved.path !== location.pathname;
    if (valid) {
      link.setAttribute('href', saved.path);
      link.textContent = saved.title;
      resume.hidden = false;
    }
  } catch {}
}
