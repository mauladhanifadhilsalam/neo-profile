/** Everything the book does once it is open in a browser. Each part looks for its own elements. */
import { root } from './frame';
import { initCover } from './cover';
import { initLamp } from './lamp';
import { initMotion } from './motion';
import { initOwl } from './owl';
import { initPlates } from './plates';
import { initRibbon } from './ribbon';

initLamp();
initRibbon();
initPlates();
initCover();
initMotion();
initOwl();

// Tells the stylesheet that whatever it has been holding back will now be revealed.
root.classList.add('motion-ready');

console.log('%cDie Gedanken sind frei.', 'font-family: Georgia, serif; font-size: 16px; font-style: italic;');
console.log(`Hail, fellow artificer. A machine-readable edition of this book waits at ${document.body.dataset.cv}`);
