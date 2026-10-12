/**
 * The single source of truth for the facts of the book.
 *
 * Everything here comes from the author's LinkedIn export (source/Profile.pdf, the
 * latest) and the earlier CV (source/Fadhil-Mauladhani-CV-EN-Back-End.pdf). The site,
 * /cv.json and the Abridgement PDF are all generated from this file, so edit facts
 * here and nowhere else. The phone number and postal code are deliberately left out.
 */

export interface Reference {
  /** Short label as it appears in an index, e.g. "Ch. II" or "Note I". */
  label: string;
  /** Site path without the base, e.g. "/chronicle/ii-schoolmasters-ledgers/". */
  path: string;
}

export interface Position {
  role: string;
  organisation: string;
  /** The legal house behind the product, where it differs from the product name. */
  keptBy?: string;
  place: string;
  /** ISO year-month, e.g. "2021-06". */
  start: string;
  /** ISO year-month, or null while the position is held. */
  end: string | null;
  highlights: string[];
  chapter: string;
}

export interface Instrument {
  name: string;
  refs: Reference[];
}

export interface Branch {
  key: 'memory' | 'reason' | 'imagination' | 'mechanical-arts';
  title: string;
  gloss: string;
  instruments: Instrument[];
}

export interface Honour {
  year: number;
  title: string;
  conferredBy?: string;
  detail?: string;
}

export interface Certificate {
  year?: number;
  title: string;
  issuer?: string;
}

export const chapters = {
  i: '/chronicle/i-first-commit/',
  ii: '/chronicle/ii-schoolmasters-ledgers/',
  iii: '/chronicle/iii-commissions/',
  iv: '/chronicle/iv-machines-taught-to-see/',
  v: '/chronicle/v-express-to-nest/',
  vi: '/chronicle/vi-present-volume/',
} as const;

export const notes = {
  patience: '/notes/of-patience/',
  legacy: '/notes/of-legacy/',
} as const;

const ch = (n: keyof typeof chapters): Reference => ({ label: `Ch. ${n.toUpperCase()}`, path: chapters[n] });
const noteI: Reference = { label: 'Note I', path: notes.patience };
const noteIII: Reference = { label: 'Note III', path: notes.legacy };

export const profile = {
  name: 'Fadhil Mauladhani',
  fullName: 'Muhamad Fadhil Mauladhani',
  /** The plain line for search engines and recruiters. */
  plainTitle: 'Back-end engineer',
  tagline: 'a fellow socii malorum and cognitariat, tech-savvy literary romanticist',
  location: 'Bogor, West Java, Indonesia',
  email: 'fadhilmauladhani@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/fadhil-mauladhani-501743192',
  },
  motto: {
    de: ['Die Gedanken sind frei, wer kann sie erraten?', 'Sie fliegen vorbei wie nächtliche Schatten …'],
    en: 'Thoughts are free; who can guess them? They fly past like shadows in the night …',
    source: 'German folk song',
  },
  summary:
    'Back-end engineer from Bogor, Indonesia, shipping production code since January 2021. ' +
    'Three years on the back end of Kejar.id, a school-management platform (Laravel, PostgreSQL, ' +
    'event-driven queues, load testing); contract work in e-learning, payments and computer vision; ' +
    'and, since 2024, a Sharia-compliant travel-insurance platform at PT AMA Salam Indonesia, ' +
    'refactored from Express.js to NestJS on the way to microservices. Professional working English (TOEIC 985).',

  experience: [
    {
      role: 'Full Stack Developer',
      organisation: 'PT AMA Salam Indonesia',
      place: 'Bogor, West Java',
      start: '2024-10',
      end: null,
      highlights: [],
      chapter: chapters.vi,
    },
    {
      role: 'Software Engineer',
      organisation: 'PT AMA Salam Indonesia',
      place: 'Bogor, West Java',
      start: '2024-07',
      end: '2024-10',
      highlights: [
        'Refactored an existing codebase from Express.js to NestJS, and helped migrate the architecture to microservices.',
        'Built back-end systems for a Sharia-compliant travel-insurance platform with NestJS, for scalability and performance.',
      ],
      chapter: chapters.v,
    },
    {
      role: 'Software Engineer',
      organisation: 'Daraya Software Solutions',
      place: 'Indonesia',
      start: '2024-06',
      end: '2024-07',
      highlights: [
        'Mangosteen ripeness classification with TensorFlow and YOLOv8.',
        'Face skin-disease classification with TensorFlow and a pre-trained EfficientNetB3 model.',
        'Face recognition for a smart-lock device, with detection notices through the Telegram API (OpenCV).',
      ],
      chapter: chapters.iv,
    },
    {
      role: 'Software Engineer',
      organisation: 'ByteLogic Inovation',
      place: 'Indonesia',
      start: '2023-12',
      end: '2024-06',
      highlights: [
        'Fitness Trainer Academy e-learning platform (Laravel): turned PDF e-book content into a web view with input forms and review notes.',
        'Main developer of an All-Access coupon subscription (Laravel), integrated with the Flip payment-gateway API.',
      ],
      chapter: chapters.iii,
    },
    {
      role: 'Back End Developer',
      organisation: 'Kejar.id',
      keptBy: 'CV IDS Rumah Pendidikan Indonesia',
      place: 'Bogor, West Java',
      start: '2021-06',
      end: '2024-06',
      highlights: [
        'Maintained and developed the back end of a school-management system with Laravel and PostgreSQL.',
        'Researched and built coordinate-based attendance, Firebase notifications, a report-book with chart-based analytics, and event-driven queue jobs for heavy work such as the school ledger report.',
        'Reviewed, refactored and optimised code, and kept best practice in the GitLab pipeline.',
        'Load-tested the service with Locust and monitored it with New Relic.',
        'Worked with front-end, UI/UX and product in an Agile cycle; wrote documentation for code, research and features in English (Notion).',
      ],
      chapter: chapters.ii,
    },
    {
      role: 'Intern Web Developer',
      organisation: 'Kejar.id',
      keptBy: 'CV IDS Rumah Pendidikan Indonesia',
      place: 'Bogor, West Java',
      start: '2021-01',
      end: '2021-06',
      highlights: [
        'Helped design and implement a web-based educational platform for schools, students and educators.',
        'Built responsive, mobile-friendly web designs; learned PHP, JavaScript and Laravel.',
      ],
      chapter: chapters.i,
    },
  ] satisfies Position[],

  education: [
    {
      institution: 'Institut Teknologi dan Bisnis Swadharma',
      course: 'Computer Software Engineering (Bachelor)',
      start: '2022-09',
      end: '2026-09',
    },
    {
      institution: 'SMK Wikrama Bogor',
      course: 'Computer Software Engineering',
      start: '2019-01',
      end: '2022-06',
    },
  ],

  knowledge: [
    {
      key: 'memory',
      title: 'Memory',
      gloss: 'that which is kept',
      instruments: [
        { name: 'PostgreSQL', refs: [ch('ii'), noteI] },
        { name: 'MySQL', refs: [] },
        { name: 'MongoDB', refs: [] },
        { name: 'Firebase Cloud Messaging', refs: [ch('ii')] },
      ],
    },
    {
      key: 'reason',
      title: 'Reason',
      gloss: 'that which is reckoned',
      instruments: [
        { name: 'PHP', refs: [ch('i'), ch('ii')] },
        { name: 'Laravel', refs: [ch('i'), ch('ii'), ch('iii'), noteI] },
        { name: 'CodeIgniter', refs: [] },
        { name: 'Node.js', refs: [ch('v'), noteIII] },
        { name: 'Express.js', refs: [ch('v'), noteIII] },
        { name: 'NestJS', refs: [ch('v'), noteIII] },
        { name: 'Microservices', refs: [ch('v'), noteIII] },
        { name: 'Event-driven queue jobs', refs: [ch('ii'), noteI] },
        { name: 'Payment-gateway integration (Flip)', refs: [ch('iii')] },
        { name: 'Python', refs: [ch('iv'), noteI] },
        { name: 'TensorFlow', refs: [ch('iv')] },
        { name: 'YOLOv8', refs: [ch('iv')] },
        { name: 'EfficientNetB3', refs: [ch('iv')] },
        { name: 'OpenCV', refs: [ch('iv')] },
        { name: 'Telegram Bot API', refs: [ch('iv')] },
        { name: 'Multi-agent systems', refs: [ch('vi')] },
      ],
    },
    {
      key: 'imagination',
      title: 'Imagination',
      gloss: 'that which is made to be seen',
      instruments: [
        { name: 'JavaScript', refs: [ch('i')] },
        { name: 'Responsive web design', refs: [ch('i')] },
        { name: 'Chart-based analytics', refs: [ch('ii')] },
        { name: 'jQuery', refs: [] },
        { name: 'Bootstrap', refs: [] },
        { name: 'Android development', refs: [ch('vi')] },
        { name: 'iOS development', refs: [ch('vi')] },
      ],
    },
    {
      key: 'mechanical-arts',
      title: 'The Mechanical Arts',
      gloss: 'the tools of the workshop',
      instruments: [
        { name: 'Git & GitLab CI/CD', refs: [ch('ii')] },
        { name: 'Code review', refs: [ch('ii')] },
        { name: 'Locust (load testing)', refs: [ch('ii'), noteI] },
        { name: 'New Relic (monitoring)', refs: [ch('ii'), noteI] },
        { name: 'Docker', refs: [] },
        { name: 'Google Analytics', refs: [] },
        { name: 'Linux: Ubuntu, WSL, Kali', refs: [] },
        { name: 'Agile delivery', refs: [ch('ii')] },
        { name: 'Documentation in English (Notion)', refs: [ch('ii')] },
        { name: 'Trello', refs: [] },
        { name: 'AI-assisted engineering', refs: [] },
      ],
    },
  ] satisfies Branch[],

  honours: [
    {
      year: 2021,
      title: 'Top 10 National Best TOEIC Score Achiever',
      conferredBy: 'Kemendikbudristek (Ministry of Education, Culture, Research and Technology)',
      detail: 'A score of 985 in the government English-competency programme.',
    },
    {
      year: 2021,
      title: 'Finalist, ITechno Cup',
      conferredBy: 'Politeknik Negeri Jakarta',
      detail: 'International event “Millenials 2.0 for Industrial 4.0”, Web Design (Junior), with the web app Lawancov.id.',
    },
    {
      year: 2021,
      title: 'Finalist, IT Venture PINGFEST: Battle of Technology',
      conferredBy: 'Universitas Sebelas Maret',
      detail: 'Discrete mathematics, algorithms and programming, networks and software engineering.',
    },
    {
      year: 2021,
      title: 'Participant, Sayembara Kompetensi Siswa SMK Indonesia',
      detail: 'Category: Smart School.',
    },
    {
      year: 2020,
      title: 'Top 3 TOEIC Score Achiever',
      conferredBy: 'SMK Wikrama Bogor',
    },
  ] satisfies Honour[],

  certificates: [
    { year: 2022, title: 'Junior Web Programmer', issuer: 'BNSP' },
    { year: 2022, title: 'Direct English Live, Level 6' },
    { year: 2021, title: 'Test of English for International Communication (985)', issuer: 'ITC' },
    { year: 2021, title: 'Certified Git Associate', issuer: 'GitLab' },
    { year: 2020, title: 'JavaScript Algorithms and Data Structures', issuer: 'freeCodeCamp' },
    { year: 2020, title: 'APIs and Microservices', issuer: 'freeCodeCamp' },
    { title: 'Cybersecurity Fundamentals' },
    { title: 'Cyber Threat Management' },
    { title: 'HTML Fundamentals' },
  ] satisfies Certificate[],

  languages: [
    { name: 'English', level: 'Professional working proficiency (TOEIC 985)' },
    { name: 'Indonesian', level: 'Native' },
    { name: 'Sundanese', level: 'Native' },
  ],
};

export type Profile = typeof profile;
