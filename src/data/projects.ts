export interface Project {
  slug: string;
  wip?: boolean;
  link?: string;
  github?: string;
  es: { title: string; problem: string; solution: string };
  en: { title: string; problem: string; solution: string };
  stack: string[];
}

export const projects: Project[] = [
  {
    slug: 'vocab-app',
    github: 'https://github.com/huellasenarena/vocab-app',
    es: {
      title: 'Vocab App',
      problem:
        'Aprender vocabulario en varios idiomas sin una herramienta que se adapte a tu ritmo de olvido real.',
      solution:
        'App de repetición espaciada con el algoritmo SM-2 y generación de ejemplos contextuales con múltiples modelos de IA.',
    },
    en: {
      title: 'Vocab App',
      problem:
        'Learning vocabulary across multiple languages without a tool that adapts to your actual forgetting curve.',
      solution:
        'Spaced repetition app with the SM-2 algorithm and multi-model AI for contextual example generation.',
    },
    stack: ['Python', 'SM-2', 'OpenAI', 'Anthropic', 'React'],
  },
  {
    slug: 'europresse-reader',
    github: 'https://github.com/huellasenarena/europresse-reader',
    es: {
      title: 'Europresse Reader',
      problem:
        'Leer prensa europea en Europresse es lento: interfaz anticuada, sin modo offline, sin resúmenes.',
      solution:
        'Lector web con Flask y Playwright que corre en Raspberry Pi, con scraping automático y vista de lectura limpia.',
    },
    en: {
      title: 'Europresse Reader',
      problem:
        'Reading European press on Europresse is slow: outdated UI, no offline mode, no summaries.',
      solution:
        'Web reader built with Flask and Playwright, self-hosted on Raspberry Pi with automated scraping and a clean reading view.',
    },
    stack: ['Python', 'Flask', 'Playwright', 'Raspberry Pi'],
  },
  {
    slug: 'que-mal-poema',
    link: 'https://quemalpoema.com',
    github: 'https://github.com/huellasenarena/qmp',
    es: {
      title: 'Qué Mal Poema',
      problem:
        'Publicar poesía a diario es insostenible si cada entrada exige formatear, subir archivos y desplegar el sitio a mano.',
      solution:
        'Pipeline automatizado de punta a punta: escribo en el iPad, ejecuto un atajo, y el contenido viaja por Apps Script, Google Docs API, OpenAI y GitHub Actions hasta publicarse solo. +160 entradas sin interrupción.',
    },
    en: {
      title: 'Qué Mal Poema',
      problem:
        'Publishing poetry daily is unsustainable if every entry means formatting, uploading files, and deploying the site by hand.',
      solution:
        'A fully automated pipeline: I write on my iPad, run a Shortcut, and the content flows through Apps Script, Google Docs API, OpenAI, and GitHub Actions to publish itself. 160+ entries, uninterrupted.',
    },
    stack: ['Python', 'GitHub Actions', 'Google Docs API', 'OpenAI', 'Apps Script', 'Telegram Bot'],
  },
  {
    slug: 'vertex-ml',
    wip: true,
    es: {
      title: 'ML en Vertex AI',
      problem: 'Por definir.',
      solution: 'Por definir.',
    },
    en: {
      title: 'Vertex AI ML Project',
      problem: 'To be defined.',
      solution: 'To be defined.',
    },
    stack: ['Google Cloud', 'Vertex AI', 'Python'],
  },
];
