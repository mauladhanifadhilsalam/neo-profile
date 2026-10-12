/** Small helpers shared by the pages: links under the site base, numerals, and reading time. */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** A site path ("/chronicle/") under the configured base ("/neo-profile/chronicle/"). */
export function href(path: string): string {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return `${BASE}/${path.replace(/^\//, '')}`;
}

const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

export function toRoman(n: number): string {
  let out = '';
  for (const [value, numeral] of ROMAN) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
}

const WORDS = [
  'no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];

export function toWords(n: number): string {
  return WORDS[n] ?? String(n);
}

/** "A reading of some four minutes", from the raw source of an entry. */
export function readingPhrase(source: string): string {
  const text = source
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[{}*_#>`]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `A reading of some ${toWords(minutes)} minute${minutes === 1 ? '' : 's'}.`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "2021-06" → "June 2021". */
export function monthYear(iso: string): string {
  const [year, month] = iso.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "2021-06" → "Jun 2021", for the compact Abridgement. */
export function shortMonthYear(iso: string): string {
  const [year, month] = iso.split('-').map(Number);
  return `${MONTHS[month - 1].slice(0, 3)} ${year}`;
}

/** Years of a span in Roman numerals: "MMXXI–MMXXIV", or "MMXXIV–" while it continues. */
export function romanYears(start: string, end: string | null): string {
  const from = Number(start.slice(0, 4));
  if (end === null) return `${toRoman(from)}–`;
  const to = Number(end.slice(0, 4));
  return from === to ? toRoman(from) : `${toRoman(from)}–${toRoman(to)}`;
}
