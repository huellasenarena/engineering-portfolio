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
    github: 'https://github.com/JNS99',
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
    link: '#',
    github: 'https://github.com/JNS99',
    es: {
      title: 'Qué Mal Poema',
      problem: 'Publicar poesía diaria sin infraestructura costosa ni CMS pesado.',
      solution:
        'Plataforma estática generada con GitHub Actions: cada push publica un poema nuevo usando la Google Docs API.',
    },
    en: {
      title: 'Qué Mal Poema',
      problem: 'Publishing daily poetry without costly infrastructure or a heavy CMS.',
      solution:
        'Static platform generated via GitHub Actions: each push publishes a new poem using the Google Docs API.',
    },
    stack: ['GitHub Actions', 'Google Docs API', 'Python', 'HTML/CSS'],
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
