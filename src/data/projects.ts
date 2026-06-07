export interface Metric {
  value: number;
  suffix?: string;
  label: string;
}

export interface CaseStudyContent {
  tagline: string;
  meta: string;
  metrics: Metric[];
  overview: string[];
  problem: string[];
  solutionIntro: string;
  steps: string[];
  architecture?: string;
  stack: { layer: string; tech: string }[];
  challenges: { title: string; body: string }[];
  results: string[];
  demonstrates: string;
}

export interface Project {
  slug: string;
  wip?: boolean;
  link?: string;
  github?: string;
  es: { title: string; problem: string; solution: string };
  en: { title: string; problem: string; solution: string };
  stack: string[];
  caseStudy?: { es: CaseStudyContent; en: CaseStudyContent };
}

export function projectUrl(slug: string, lang: 'es' | 'en'): string {
  return lang === 'es' ? `/proyectos/${slug}` : `/en/projects/${slug}`;
}

export const projects: Project[] = [
  {
    slug: 'vocab-app',
    link: 'https://huellasenarena.github.io/vocab-app',
    github: 'https://github.com/huellasenarena/vocab-app',
    es: {
      title: 'Vocab',
      problem:
        'Acumular listas de palabras con flashcards es fácil; usarlas en situaciones reales, no. Y mantener esas listas a mano consume la atención que debería ir a practicar.',
      solution:
        'App que entrena el uso real de las palabras, no el reconocimiento. Subrayo una palabra en el móvil, ejecuto un atajo, y entra en mi lista. La practico escribiendo frases que una IA evalúa, con SM-2 y BYOK.',
    },
    en: {
      title: 'Vocab',
      problem:
        'Building word lists with flashcards is easy; using words in real situations is not. Maintaining those lists by hand also eats the attention that should go to practice.',
      solution:
        'An app that trains real usage, not recognition. I underline a word on my phone, run a Shortcut, and it lands in my list. Then I practice by writing sentences that an AI evaluates, with SM-2 and BYOK.',
    },
    stack: ['Cloudflare Workers', 'Cloudflare D1', 'Google OAuth', 'OpenAI', 'iOS Shortcuts', 'JavaScript'],
    caseStudy: {
      es: {
        tagline: 'Práctica de vocabulario centrada en el uso real.',
        meta: 'Proyecto personal → producto · Febrero 2026 – presente',
        metrics: [
          { value: 8000, suffix: '+', label: 'palabras en biblioteca personal' },
          { value: 4, label: 'modos de práctica con IA' },
          { value: 25, label: 'llamadas de datos reescritas (Sheets→D1)' },
        ],
        overview: [
          'Vocab es una app para aprender vocabulario practicando cómo se usan las palabras, no solo reconociéndolas. Cada palabra se practica escribiendo una frase propia que una IA evalúa —corrección lingüística + veredicto—, dentro de un sistema de repetición espaciada. La empecé en febrero de 2026 para preparar el examen DELE, y la uso a diario. Después la transformé de herramienta personal en un producto multiusuario completo.',
        ],
        problem: [
          'Me preparaba para el DELE y había acumulado una lista enorme de palabras. Pero las flashcards no son la mejor forma de integrar vocabulario al uso activo: puedes ver una palabra, entender su definición y aun así no saber emplearla. Además, mantener listas a mano consume tiempo y atención —justo lo que te aleja de practicar.',
          'Quería dos cosas: eliminar la fricción de añadir palabras, y practicar el uso real en lugar del reconocimiento pasivo.',
        ],
        solutionIntro:
          'De la palabra subrayada a la práctica activa: el flujo es el corazón del proyecto.',
        steps: [
          'Subrayo una palabra en el móvil y ejecuto un atajo de iOS. No escribo nada ni indico el idioma: el servidor detecta el idioma, valida que la palabra existe y descarta duplicados y variantes (conjugaciones, plurales) con un embudo de similitud + juez LLM.',
          'La app me propone la palabra y escribo una frase. Una IA evalúa si la usé bien y analiza gramática y registro, con sugerencias. El objetivo no es reconocer la palabra: es producirla en una situación real.',
          'Cada palabra se reprograma según mi rendimiento con SM-2. Un calendario muestra qué toca revisar y cuándo. Modos de práctica: espaciada, situación (recall activo), libre e imagen (describir una foto con análisis por visión).',
          'Para convertirlo en producto: autenticación propia en el edge (email/PBKDF2 + Google OAuth sin librería, verificación JWKS RS256 con Web Crypto), base de datos multi-tenant en Cloudflare D1, y BYOK — cada usuario usa su propia clave de IA, coste cero para el servidor.',
        ],
        architecture: `  📱 iPhone (palabra subrayada)        🌐 App de una página (Safari)
        │  Shortcut → POST /add               │  login Google / email → JWT
        │  (+ token personal)                 │
        ▼                                     ▼
                 ⚙️  Cloudflare Worker (edge)
                 auth JWT · BYOK · ruta /add
                          │
          ┌───────────────┼────────────────────┐
          ▼               ▼                     ▼
  🤖 OpenAI         🤖 OpenAI / Gemini    🗄️ Cloudflare D1
  detección idioma  evaluación de frase   (SQLite edge)
  + duplicados      (clave del usuario,   datos por user_id:
  (gpt-4.1-mini)     BYOK)                palabras · progreso · etc.

  >> Subrayar una palabra y tocar un atajo: eso es todo el "trabajo".
     La práctica entrena el USO, no el reconocimiento.`,
        stack: [
          { layer: 'Frontend', tech: 'JavaScript vanilla, un solo index.html, HTML/CSS, mobile-first (Safari/PWA)' },
          { layer: 'Hosting frontend', tech: 'GitHub Pages (deploy vía GitHub Actions)' },
          { layer: 'Backend / proxy', tech: 'Cloudflare Worker (edge)' },
          { layer: 'Base de datos', tech: 'Cloudflare D1 (SQLite en el edge), multi-tenant por user_id' },
          { layer: 'Autenticación', tech: 'Email + PBKDF2 (Web Crypto) · Google OAuth (ID token, JWKS RS256) · sesiones JWT (HS256)' },
          { layer: 'IA (práctica)', tech: 'BYOK — OpenAI (GPT) y Google (Gemma/Gemini), streaming, abstracción multi-proveedor' },
          { layer: 'IA (captura)', tech: 'gpt-4.1-mini server-side: detección de idioma, validez y similitud' },
          { layer: 'Captura móvil', tech: 'iOS Shortcuts → POST /add con token personal' },
        ],
        challenges: [
          {
            title: 'Autenticación desde cero en el edge',
            body: 'PBKDF2 para contraseñas y verificación del ID token de Google por JWKS (RS256) dentro del Worker con Web Crypto, sin librerías. Vinculación de cuentas por email: un mismo email = una sola cuenta, ya entres con Google o con contraseña.',
          },
          {
            title: 'Migración Sheets → D1 sin perder el frontend de una página',
            body: 'Normalicé los datos a tablas relacionales por user_id y reescribí ~25 llamadas de acceso a datos, manteniendo la app en un único archivo.',
          },
          {
            title: 'BYOK con sincronización entre dispositivos',
            body: 'La clave viaja por cabecera en cada petición de IA y nunca se almacena del lado servidor por defecto. Opción de sincronizarla (cifrada en reposo) entre los dispositivos del usuario vía D1.',
          },
          {
            title: 'Captura sin fricción con inteligencia server-side',
            body: 'La ruta /add reproduce un embudo de validación —idioma + sentido + similitud (puntuación normalizada + juez LLM)— leyendo el vocabulario existente desde D1, y responde en el formato que el atajo de iOS ya entiende.',
          },
          {
            title: 'Evaluación de frases por IA',
            body: 'Veredicto estructurado + análisis lingüístico en streaming, con manejo de presupuestos de tokens de modelos de razonamiento y reglas anti-alucinación en los prompts.',
          },
          {
            title: 'Repetición espaciada (SM-2)',
            body: 'Reprogramación por palabra, límite diario de palabras nuevas y cambio de día según la hora local del usuario.',
          },
        ],
        results: [
          'Uso diario desde febrero de 2026 para preparar el DELE; biblioteca personal de 8000+ palabras.',
          'Práctica del uso, no del reconocimiento: escribo frases reales y recibo corrección inmediata.',
          'Fricción de captura casi nula: subrayar + un atajo, sin escribir ni indicar idioma.',
          'De herramienta a producto en pocos días: auth (Google + email), datos por usuario, BYOK y despliegue en producción, con coste de IA cero del lado servidor.',
        ],
        demonstrates:
          'Construí solo un sistema full-stack de extremo a extremo —captura móvil, frontend, autenticación, base de datos en el edge e integración de varias APIs de IA— y, sobre todo, transformé una necesidad personal real en un producto usable por otros. Nació de aprender un idioma: la tecnología está al servicio de la práctica, automatizando lo aburrido para proteger lo que importa, usar las palabras.',
      },
      en: {
        tagline: 'Vocabulary practice focused on real usage.',
        meta: 'Personal project → product · February 2026 – present',
        metrics: [
          { value: 8000, suffix: '+', label: 'words in personal library' },
          { value: 4, label: 'AI practice modes' },
          { value: 25, label: 'data calls rewritten (Sheets→D1)' },
        ],
        overview: [
          'Vocab is an app for learning vocabulary by practicing how words are used, not just recognizing them. Each word is practiced by writing your own sentence that an AI evaluates —linguistic analysis + verdict—, inside a spaced-repetition system. I started it in February 2026 to prepare for the DELE Spanish exam, and I use it daily. I then turned it from a personal tool into a full multi-user product.',
        ],
        problem: [
          'I was preparing for the DELE and had built up a huge list of words. But flashcards aren\'t the best way to move vocabulary into active use: you can see a word, understand its definition, and still not know how to use it. On top of that, maintaining lists by hand costs time and attention — exactly what pulls you away from practicing.',
          'I wanted two things: to remove the friction of adding words, and to practice real usage instead of passive recognition.',
        ],
        solutionIntro:
          'From an underlined word to active practice: the workflow is the heart of the project.',
        steps: [
          'I underline a word on my phone and run an iOS Shortcut. I type nothing and don\'t specify the language: the server detects the language, validates that the word is real, and discards duplicates and variants (conjugations, plurals) via a similarity funnel + LLM judge.',
          'The app shows me the word and I write a sentence. An AI judges whether I used it correctly and analyzes grammar and register, with suggestions. The goal isn\'t to recognize the word — it\'s to produce it in a real situation.',
          'Each word is rescheduled based on my performance with SM-2. A calendar shows what\'s due and when. Practice modes: spaced, situation (active recall), free, and image (describe a photo with vision analysis).',
          'To turn it into a product: custom auth at the edge (email/PBKDF2 + Google OAuth without a library, JWKS RS256 verification with Web Crypto), a multi-tenant database on Cloudflare D1, and BYOK — each user brings their own AI key, zero server cost.',
        ],
        architecture: `  📱 iPhone (underlined word)           🌐 Single-page app (Safari)
        │  Shortcut → POST /add               │  Google / email login → JWT
        │  (+ personal token)                 │
        ▼                                     ▼
                 ⚙️  Cloudflare Worker (edge)
                 JWT auth · BYOK · /add route
                          │
          ┌───────────────┼────────────────────┐
          ▼               ▼                     ▼
  🤖 OpenAI         🤖 OpenAI / Gemini    🗄️ Cloudflare D1
  language detect   sentence evaluation  (edge SQLite)
  + duplicates      (user's own key,     data by user_id:
  (gpt-4.1-mini)     BYOK)               words · progress · etc.

  >> Underline a word and tap a Shortcut: that's all the "work."
     Practice trains USAGE, not recognition.`,
        stack: [
          { layer: 'Frontend', tech: 'Vanilla JavaScript, a single index.html, HTML/CSS, mobile-first (Safari/PWA)' },
          { layer: 'Frontend hosting', tech: 'GitHub Pages (deployed via GitHub Actions)' },
          { layer: 'Backend / proxy', tech: 'Cloudflare Worker (edge)' },
          { layer: 'Database', tech: 'Cloudflare D1 (edge SQLite), multi-tenant by user_id' },
          { layer: 'Authentication', tech: 'Email + PBKDF2 (Web Crypto) · Google OAuth (ID token, JWKS RS256) · JWT sessions (HS256)' },
          { layer: 'AI (practice)', tech: 'BYOK — OpenAI (GPT) and Google (Gemma/Gemini), streaming, multi-provider abstraction' },
          { layer: 'AI (capture)', tech: 'gpt-4.1-mini server-side: language detection, validity, similarity' },
          { layer: 'Mobile capture', tech: 'iOS Shortcuts → POST /add with a personal token' },
        ],
        challenges: [
          {
            title: 'Auth from scratch at the edge',
            body: 'PBKDF2 password hashing and Google ID-token verification via JWKS (RS256) inside the Worker with Web Crypto, no libraries. Account linking by email: same email = one account whether you sign in with Google or password.',
          },
          {
            title: 'Sheets → D1 migration without losing the single-page frontend',
            body: 'Normalized data into relational tables keyed by user_id and rewrote ~25 data-access calls, keeping the app as one file.',
          },
          {
            title: 'BYOK with cross-device sync',
            body: 'The key travels in a header on each AI request and is never stored server-side by default. An opt-in syncs it (encrypted at rest) across the user\'s devices via D1.',
          },
          {
            title: 'Frictionless capture with server-side intelligence',
            body: 'The /add route reproduces a validation funnel — language + sense + similarity (normalized scoring + LLM judge) — reading existing vocabulary from D1, and answers in the exact format the iOS Shortcut already understands.',
          },
          {
            title: 'AI sentence evaluation',
            body: 'Structured verdict + linguistic analysis, streamed, handling reasoning-model token budgets and anti-hallucination rules in the prompts.',
          },
          {
            title: 'Spaced repetition (SM-2)',
            body: 'Per-word rescheduling, a daily new-word cap, and day boundaries based on the user\'s local time.',
          },
        ],
        results: [
          'Daily use since February 2026 to prepare for the DELE; a personal library of 8,000+ words.',
          'Practicing usage, not recognition: I write real sentences and get immediate correction.',
          'Near-zero capture friction: underline + one Shortcut, no typing, no language tagging.',
          'Tool to product in a few days: auth (Google + email), per-user data, BYOK, and production deployment — with zero server-side AI cost.',
        ],
        demonstrates:
          'I built a complete end-to-end full-stack system alone — mobile capture, frontend, authentication, an edge database, and integration of several AI APIs — and, above all, turned a real personal need into a product others can use. It grew out of learning a language: technology serves the practice, automating the boring part to protect what matters — actually using the words.',
      },
    },
  },
  {
    slug: 'news-reader',
    es: {
      title: 'Noticias Personalizadas',
      problem:
        'Tengo acceso legítimo a la prensa francesa y española, pero la fricción de autenticarme y buscar cada artículo hacía que terminara no leyendo.',
      solution:
        'Lector autoalojado que automatiza el acceso con Playwright (BnF/Europresse en francés, scraping directo con bypass de paywall en español). Pego una URL y leo el artículo limpio en menos de 15 segundos. Lo uso a diario.',
    },
    en: {
      title: 'Personalized News Reader',
      problem:
        'I have legitimate access to French and Spanish press, but the friction of authenticating and searching for each article meant I ended up not reading at all.',
      solution:
        'A self-hosted reader that automates access with Playwright (BnF/Europresse for French, direct scraping with paywall bypass for Spanish). I paste a URL and read the clean article in under 15 seconds. I use it daily.',
    },
    stack: ['Python', 'Playwright', 'Flask', 'SQLite', 'Google OAuth', 'Cloudflare Tunnel'],
    caseStudy: {
      es: {
        tagline: 'Lector de prensa bilingüe, autoalojado, sin fricción.',
        meta: 'Herramienta personal · Abril 2026 – presente',
        metrics: [
          { value: 15, suffix: 's', label: 'de la URL al modo lectura' },
          { value: 23, label: 'publicaciones soportadas' },
          { value: 8, label: 'servicios integrados' },
        ],
        overview: [
          'Noticias Personalizadas es un lector de prensa personal que construí para mí mismo. Agrega artículos de pago de la prensa francesa (vía Europresse/BnF) y española (scraping directo), los presenta en modo lectura y los guarda en una biblioteca personal evaluable. Lo uso a diario desde su primer día de funcionamiento.',
        ],
        problem: [
          'Me gusta leer la prensa seria en francés y en español. El problema no era el acceso —tengo acceso legítimo a Europresse a través de la BnF— sino la fricción. Cada artículo requería abrir Europresse, autenticarse, buscar, navegar. Ese coste de atención acumulado hacía que terminara no leyendo.',
          'La solución no era leer menos. Era eliminar por completo la fricción de acceso.',
        ],
        solutionIntro:
          'El flujo es el corazón del proyecto: de la URL al modo lectura, en segundos, en dos idiomas.',
        steps: [
          'Pego una URL (o escribo palabras clave en modo francés) en la web, o comparto el artículo desde Safari con un atajo de iOS.',
          'Playwright automatiza el acceso en headless: en francés, autenticación en la BnF y búsqueda en Europresse; en español, acceso directo con bypass del paywall (El País) usando sesión persistente.',
          'Readability limpia el contenido y el artículo aparece en modo lectura —en menos de 15 segundos— listo para evaluar con me gusta / no me gusta.',
        ],
        architecture: `  📱 iOS Shortcut        🌐 Web (Safari)
        │  POST /add         │
        └──────────┬─────────┘
                   ▼
        ⚙️ Flask (Hetzner VPS)
        Google OAuth · cola de trabajos
                   │
        ┌──────────┴──────────┐
        │ FR: palabras clave   │ ES: URL directa
        ▼                      ▼
  🎭 Playwright           🎭 Playwright
  BnF → Europresse        bypass paywall
        │                      │
        ▼                      ▼
  📝 Texto limpio         📰 Readability
        └──────────┬──────────┘
                   ▼
        🗄️ SQLite (articles.db)
        like · dislike · tiempo · scroll
                   ▼
        📖 Lector personal`,
        stack: [
          { layer: 'Automatización navegador', tech: 'Playwright + Chromium (headless)' },
          { layer: 'Extracción de contenido', tech: 'readability-lxml (ES), extracción propia (FR)' },
          { layer: 'Servidor web', tech: 'Flask + SSE (progreso en tiempo real)' },
          { layer: 'Almacenamiento', tech: 'SQLite (gestión cuidadosa de conexiones)' },
          { layer: 'Autenticación', tech: 'Google OAuth 2.0 (Authlib)' },
          { layer: 'Integración móvil', tech: 'iOS Shortcuts → POST /add con token' },
          { layer: 'Infraestructura', tech: 'Hetzner VPS (Ubuntu) + Cloudflare Tunnel + systemd' },
          { layer: 'Frontend', tech: 'HTML/CSS/JS vanilla, mobile-first (Safari iOS)' },
        ],
        challenges: [
          {
            title: 'Automatización de autenticación en cadena',
            body: 'Playwright gestiona dos flujos de auth independientes —BnF/Europresse para francés, y El País con sesión persistente en JSON para español— sin intervención manual.',
          },
          {
            title: 'Extracción robusta contra CMS hostiles',
            body: 'Algunos sitios inyectan toolbars de editor en el DOM público. Implementé un pipeline de limpieza con filtros anti-basura CMS antes de Readability, con fallback por selectores de párrafo.',
          },
          {
            title: 'Proxy de imágenes con Referer',
            body: 'Las imágenes de El País están bloqueadas por CORS/Referer. Una ruta /api/img actúa de proxy servidor añadiendo el Referer correcto, con whitelist de dominios permitidos.',
          },
          {
            title: 'Integración iOS sin fricción',
            body: 'El endpoint /add responde en menos de 200 ms para que el atajo muestre la notificación al instante. Incluye deduplicación por URL y manejo del bug de iOS que duplica la URL en el POST.',
          },
          {
            title: 'Cola de trabajos con drenaje automático',
            body: 'Cuando el scraper está ocupado, los artículos se encolan. Al terminar cada scrape, el sistema retoma automáticamente los siguientes en cola, en secuencia, sin intervención manual.',
          },
          {
            title: 'Infraestructura de producción personal',
            body: 'El servicio corre como daemon systemd en un VPS, accesible desde cualquier lugar vía Cloudflare Tunnel HTTPS, con Google OAuth como capa de autenticación.',
          },
        ],
        results: [
          'Uso diario desde el primer día — el proyecto resolvió un problema real y cambió un hábito.',
          'Dos fuentes completamente distintas unificadas en una sola interfaz bilingüe.',
          'Cero fricción de acceso: una URL compartida desde Safari → artículo en modo lectura en segundos.',
          'Base de datos personal evaluada, lista para alimentar un sistema de recomendación.',
        ],
        demonstrates:
          'Construí solo una herramienta de extremo a extremo —de la automatización de navegador a la infraestructura de producción— para resolver un problema cotidiano real. La motivación no era técnica: era recuperar el hábito de leer prensa seria, eliminando la fricción que lo impedía. El siguiente paso es el que más me interesa: usar el historial de evaluaciones para construir un recomendador que aprenda mis gustos.',
      },
      en: {
        tagline: 'A self-hosted, bilingual, friction-free press reader.',
        meta: 'Personal project · April 2026 – present',
        metrics: [
          { value: 15, suffix: 's', label: 'from URL to reader mode' },
          { value: 23, label: 'publications supported' },
          { value: 8, label: 'services integrated' },
        ],
        overview: [
          'Personalized News Reader is a personal press reader I built for myself. It aggregates paywalled articles from the French press (via Europresse/BnF) and Spanish press (direct scraping), presents them in reader mode, and saves them to a personal, rated library. I have used it every day since it first ran.',
        ],
        problem: [
          'I enjoy reading serious journalism in French and Spanish. The problem wasn’t access —I have legitimate access to Europresse through the BnF— it was friction. Every article required opening Europresse, authenticating, searching, navigating. That accumulated attention cost meant I ended up not reading at all.',
          'The answer wasn’t to read less. It was to remove the access friction entirely.',
        ],
        solutionIntro:
          'The workflow is the heart of the project: from URL to reader mode in seconds, across two languages.',
        steps: [
          'I paste a URL (or type keywords in French mode) on the web, or share the article from Safari via an iOS Shortcut.',
          'Playwright automates access headless: in French, BnF authentication and Europresse search; in Spanish, direct access with paywall bypass (El País) using a persistent session.',
          'Readability cleans the content and the article appears in reader mode —in under 15 seconds— ready to rate with like / dislike.',
        ],
        architecture: `  📱 iOS Shortcut        🌐 Web (Safari)
        │  POST /add         │
        └──────────┬─────────┘
                   ▼
        ⚙️ Flask (Hetzner VPS)
        Google OAuth · job queue
                   │
        ┌──────────┴──────────┐
        │ FR: keywords         │ ES: direct URL
        ▼                      ▼
  🎭 Playwright           🎭 Playwright
  BnF → Europresse        paywall bypass
        │                      │
        ▼                      ▼
  📝 Clean text           📰 Readability
        └──────────┬──────────┘
                   ▼
        🗄️ SQLite (articles.db)
        like · dislike · time · scroll
                   ▼
        📖 Personal reader`,
        stack: [
          { layer: 'Browser automation', tech: 'Playwright + Chromium (headless)' },
          { layer: 'Content extraction', tech: 'readability-lxml (ES), custom extraction (FR)' },
          { layer: 'Web server', tech: 'Flask + SSE (real-time progress)' },
          { layer: 'Storage', tech: 'SQLite (careful connection management)' },
          { layer: 'Authentication', tech: 'Google OAuth 2.0 (Authlib)' },
          { layer: 'Mobile integration', tech: 'iOS Shortcuts → POST /add with token' },
          { layer: 'Infrastructure', tech: 'Hetzner VPS (Ubuntu) + Cloudflare Tunnel + systemd' },
          { layer: 'Frontend', tech: 'Vanilla HTML/CSS/JS, mobile-first (Safari iOS)' },
        ],
        challenges: [
          {
            title: 'Chained authentication automation',
            body: 'Playwright manages two independent auth flows —BnF/Europresse for French, and El País with persistent JSON sessions for Spanish— with no manual intervention.',
          },
          {
            title: 'Robust extraction against hostile CMSs',
            body: 'Some sites inject an editor toolbar into the public DOM. I built a cleaning pipeline with anti-CMS garbage filters before Readability, with a paragraph-selector fallback.',
          },
          {
            title: 'Image proxy with Referer spoofing',
            body: 'El País images are blocked by CORS/Referer policy. An /api/img server-side proxy route adds the correct Referer header, with a domain whitelist.',
          },
          {
            title: 'Frictionless iOS integration',
            body: 'The /add endpoint responds in under 200 ms so the Shortcut notification appears immediately. Includes URL deduplication and a fix for the iOS bug that doubles the URL in the POST body.',
          },
          {
            title: 'Background job queue with auto-drain',
            body: 'When the scraper is busy, articles are queued. After each scrape completes, the system automatically picks up the next queued items in sequence — no manual retry needed.',
          },
          {
            title: 'Personal production infrastructure',
            body: 'The service runs as a systemd daemon on a VPS, reachable from anywhere via HTTPS Cloudflare Tunnel, with Google OAuth as the auth layer.',
          },
        ],
        results: [
          'Daily use since day one — the project solved a real problem and changed a habit.',
          'Two completely different sources unified in a single bilingual interface.',
          'Zero access friction: a URL shared from Safari → article in reader mode in seconds.',
          'A personal rated library, ready to feed a recommendation system.',
        ],
        demonstrates:
          'I built a complete end-to-end tool alone —from browser automation to production infrastructure— to solve a real everyday problem. The motivation wasn’t technical: it was recovering the habit of reading serious journalism, removing the friction that prevented it. The next step is the one that interests me most: using the rating history to build a recommender that learns my taste.',
      },
    },
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
    caseStudy: {
      es: {
        tagline: 'Publicación poética diaria, totalmente automatizada.',
        meta: 'Proyecto personal · Diciembre 2025 – presente',
        metrics: [
          { value: 160, suffix: '+', label: 'entradas publicadas' },
          { value: 6, label: 'workflows de CI/CD' },
          { value: 8, label: 'servicios integrados' },
        ],
        overview: [
          'Qué Mal Poema es una plataforma de publicación poética diaria. Cada día sale una entrada con un poema original mío, un poema citado de otro autor y un análisis en prosa. Desde diciembre de 2025 lleva más de 160 entradas publicadas sin interrupción.',
          'A primera vista es un sitio sencillo y limpio. Detrás hay un sistema de publicación completo, automatizado de principio a fin, que construí solo. El objetivo era poder concentrarme al cien por cien en escribir, y delegar por completo la publicación y la actualización del sitio a la automatización.',
        ],
        problem: [
          'Quería publicar poesía a diario para cultivar mi pasión por la escritura y mejorar mi escritura creativa y analítica. Pero la constancia diaria choca con la fricción: dar formato, subir archivos, actualizar índices, desplegar el sitio. Si cada publicación me costaba tiempo y atención, el proyecto no sobreviviría.',
          'La solución no era escribir menos, sino eliminar por completo el trabajo manual de publicación.',
        ],
        solutionIntro:
          'El flujo de trabajo que diseñé es el corazón del proyecto: del iPad al sitio publicado, sin tocar nada más.',
        steps: [
          'Escribo en iA Writer en mi iPad, en texto plano.',
          'Ejecuto un atajo (Shortcut) de iOS/iPadOS. Eso es todo lo que hago.',
          'El atajo envía el texto (POST) a una app web de Google Apps Script, que parsea el contenido y lo escribe en el tab correcto de Google Docs.',
          'Una GitHub Action extrae el contenido vía la API de Google Docs (autenticación con service account), genera los archivos de texto fuente y construye los metadatos.',
          'OpenAI genera automáticamente las etiquetas (keywords) de cada entrada.',
          'La acción hace commit, despliega el sitio estático en GitHub Pages y me notifica por Telegram que la entrada está publicada.',
        ],
        architecture: `  ✍️  iA Writer (iPad)
        │  texto plano
        ▼
  📲  iOS Shortcut  ──POST──▶  ☁️  Apps Script (doPost)
                                      │
                                      ▼
                                 📄  Google Docs
                                      │  Docs API · service account
                                      ▼
  ⚙️  GitHub Action  ──▶  🐍  Python  ──▶  🤖  OpenAI
        │              parse · validate        (keywords)
        │              SHA-256 · merge            │
        │                                         ▼
        │                                 🌐  GitHub Pages
        ▼
  🔔  Telegram: "publicado ✅"`,
        stack: [
          { layer: 'Entrada / escritura', tech: 'iA Writer, Atajos de iOS/iPadOS' },
          { layer: 'Puente de captura', tech: 'Google Apps Script (web app doPost), gestionado con clasp' },
          { layer: 'Contenido', tech: 'Google Docs API (auth service-account)' },
          { layer: 'Procesamiento', tech: 'Python (parseo, validación, fingerprints SHA-256, merge)' },
          { layer: 'IA', tech: 'OpenAI API (generación de keywords)' },
          { layer: 'CI/CD', tech: 'GitHub Actions (6 workflows)' },
          { layer: 'Notificaciones', tech: 'Telegram Bot API' },
          { layer: 'Frontend', tech: 'JavaScript vanilla, HTML, CSS (estático)' },
          { layer: 'Hosting', tech: 'GitHub Pages' },
        ],
        challenges: [
          {
            title: 'Renderizado tipográfico del poema',
            body: 'Los poemas necesitan sangrías precisas. Implementé un sistema de anclas (|) que mide la posición en píxeles con un canvas a partir de la fuente real renderizada, para alinear versos al píxel exacto, además de líneas alineadas a la derecha.',
          },
          {
            title: 'Detección de ediciones',
            body: 'Cada poema tiene un fingerprint SHA-256 sobre el texto normalizado, lo que permite detectar cuándo edito un texto en Google Docs y re-publicar solo lo que cambió.',
          },
          {
            title: 'Idempotencia y fiabilidad',
            body: 'Separé metadatos (en archivo.json) del texto de los poemas, con un flujo de pending → merge y validación previa, para que las publicaciones automáticas sean seguras y repetibles.',
          },
          {
            title: 'Gestión de secretos en CI',
            body: 'Las credenciales del service account se inyectan de forma segura en las Actions (escritas vía Python para evitar problemas de saltos de línea), sin exponer nada en el repositorio.',
          },
        ],
        results: [
          '+160 entradas publicadas de forma continua desde diciembre de 2025.',
          'Cero trabajo manual de publicación: escribir y pulsar un atajo es todo el proceso.',
          'Un sitio sencillo de cara al público que esconde un pipeline completo: integraciones de API, automatización CI/CD y orquestación entre múltiples servicios.',
        ],
        demonstrates:
          'Construí solo un sistema de extremo a extremo —desde la captura en el móvil hasta el despliegue en producción— integrando varias APIs y servicios. Pero, sobre todo, nació de un problema real y personal: usé la tecnología al servicio de una práctica creativa, automatizando lo aburrido para proteger lo que importa, escribir.',
      },
      en: {
        tagline: 'A fully automated daily poetry platform.',
        meta: 'Personal project · December 2025 – present',
        metrics: [
          { value: 160, suffix: '+', label: 'entries published' },
          { value: 6, label: 'CI/CD workflows' },
          { value: 8, label: 'services integrated' },
        ],
        overview: [
          'Qué Mal Poema is a daily poetry publishing platform. Every day it ships one entry: an original poem of mine, a cited poem by another author, and a prose analysis. It has been running since December 2025 with 160+ entries published, every single day, without interruption.',
          'It looks like a simple, clean website. Behind it is a complete publishing system, automated end to end, that I built alone. The goal was to focus 100% on writing and fully delegate publishing and site updates to automation.',
        ],
        problem: [
          'I wanted to publish poetry daily to nurture my passion for writing and sharpen my creative and analytical writing. But daily consistency runs into friction: formatting, uploading files, updating indexes, deploying the site. If every post cost me time and attention, the project wouldn’t survive.',
          'The answer wasn’t to write less — it was to remove the manual publishing work entirely.',
        ],
        solutionIntro:
          'The workflow I designed is the heart of the project: from iPad to live site, hands-off.',
        steps: [
          'I write in iA Writer on my iPad, in plain text.',
          'I run an iOS/iPadOS Shortcut. That’s the only thing I do.',
          'The Shortcut POSTs the text to a Google Apps Script web app, which parses it and writes it to the correct tab in Google Docs.',
          'A GitHub Action pulls the content via the Google Docs API (service-account auth), generates the source text files, and builds the metadata.',
          'OpenAI automatically generates keyword tags for each entry.',
          'The action commits, deploys the static site on GitHub Pages, and notifies me on Telegram that the entry is live.',
        ],
        architecture: `  ✍️  iA Writer (iPad)
        │  plain text
        ▼
  📲  iOS Shortcut  ──POST──▶  ☁️  Apps Script (doPost)
                                      │
                                      ▼
                                 📄  Google Docs
                                      │  Docs API · service account
                                      ▼
  ⚙️  GitHub Action  ──▶  🐍  Python  ──▶  🤖  OpenAI
        │              parse · validate        (keywords)
        │              SHA-256 · merge            │
        │                                         ▼
        │                                 🌐  GitHub Pages
        ▼
  🔔  Telegram: "published ✅"`,
        stack: [
          { layer: 'Authoring', tech: 'iA Writer, iOS/iPadOS Shortcuts' },
          { layer: 'Capture bridge', tech: 'Google Apps Script (web app doPost), managed with clasp' },
          { layer: 'Content', tech: 'Google Docs API (service-account auth)' },
          { layer: 'Processing', tech: 'Python (parsing, validation, SHA-256 fingerprints, merge)' },
          { layer: 'AI', tech: 'OpenAI API (keyword generation)' },
          { layer: 'CI/CD', tech: 'GitHub Actions (6 workflows)' },
          { layer: 'Notifications', tech: 'Telegram Bot API' },
          { layer: 'Frontend', tech: 'Vanilla JavaScript, HTML, CSS (static)' },
          { layer: 'Hosting', tech: 'GitHub Pages' },
        ],
        challenges: [
          {
            title: 'Poem typography rendering',
            body: 'Poems need precise indentation. I built an anchor system (|) that measures pixel positions via a canvas using the actually-rendered font, aligning verses to the exact pixel, plus right-aligned lines.',
          },
          {
            title: 'Edit detection',
            body: 'Each poem carries a SHA-256 fingerprint over normalized text, so I can detect when I edit something in Google Docs and re-publish only what changed.',
          },
          {
            title: 'Idempotency & reliability',
            body: 'I separated metadata (in archivo.json) from poem text, with a pending → merge flow and pre-validation, so automated publishing is safe and repeatable.',
          },
          {
            title: 'Secrets in CI',
            body: 'Service-account credentials are injected securely into the Actions (written via Python to avoid newline issues), never exposed in the repository.',
          },
        ],
        results: [
          '160+ entries published continuously since December 2025.',
          'Zero manual publishing work: writing and tapping a Shortcut is the whole process.',
          'A simple public-facing site hiding a full pipeline: API integrations, CI/CD automation, and orchestration across multiple services.',
        ],
        demonstrates:
          'I built a complete end-to-end system alone — from mobile capture to production deploy — integrating several APIs and services. But above all, it grew from a real, personal problem: I put technology in service of a creative practice, automating the boring parts to protect the part that matters — writing.',
      },
    },
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
