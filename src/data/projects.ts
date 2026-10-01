// Todo el texto de los casos de estudio es de Jack (solo con correcciones de ortografía y gramática que él aceptó).
// Lo único que no es prosa suya: los diagramas y las tablas de stack.
//
// En `body`, *palabra* se muestra en itálica. Un párrafo que empieza con "[lo escribe Jack" es un marcador:
// solo aparece en `npm run dev`, nunca en el sitio publicado.
//
// El sitio está solo en español por ahora (el inglés está oculto hasta que Jack escriba su versión).

export interface Section {
  title: string;
  body: string[];
  /** Muestra el diagrama de arquitectura al final de esta sección. */
  diagram?: boolean;
}

export interface CaseStudyContent {
  sections: Section[];
  /** Diagrama ASCII. Si ninguna sección lo pide, va en su propia sección «Arquitectura». */
  architecture?: string;
  stack: { layer: string; tech: string }[];
}

export interface Project {
  slug: string;
  wip?: boolean;
  link?: string;
  github?: string;
  /** Se muestra en lugar del enlace al código cuando el repo es privado. */
  repoNote?: string;
  title: string;
  /** Una frase para la lista de proyectos (sacada del texto de Jack). */
  summary: string;
  stack: string[];
  caseStudy?: CaseStudyContent;
}

export function projectUrl(slug: string, lang: 'es' | 'en'): string {
  return lang === 'es' ? `/proyectos/${slug}` : `/en/projects/${slug}`;
}

export const projects: Project[] = [
  {
    slug: 'vocab-app',
    link: 'https://byov.net',
    github: 'https://github.com/huellasenarena/vocab-app',
    title: 'Vocab',
    summary:
      'Mi objetivo fue crear una aplicación sin fricción y útil que me permitiera añadir fácilmente palabras y aprender a utilizarlas de manera lúdica.',
    stack: ['Cloudflare Workers', 'Cloudflare D1', 'Google OAuth', 'OpenAI', 'Gemini', 'iOS Shortcuts', 'JavaScript'],
    caseStudy: {
      sections: [
        {
          title: 'Motivación',
          body: [
            'Durante la universidad empecé a apasionarme por los idiomas, y un aspecto importante de ellos es aprender el vocabulario. Hay métodos para memorizar palabras que ciertamente utilizan la tecnología: utilizar tarjetas didácticas virtuales, crear listas en Excel o, en la época de LLMs, probar nuevas palabras en una conversación.',
            'Pero esas soluciones tienen fricción: tienes que añadir tarjetas didácticas una por una, crear listas a mano o iniciar nuevas conversaciones en un chatbot con instrucciones especiales.',
            'Y si la fricción no basta, hay problemas de motivación: no es tan interesante ver una palabra o su definición y incluso con un chatbot es aburrido escribir frases sobre un tema al azar.',
            'Mi objetivo fue crear una aplicación sin fricción y útil que me permitiera añadir fácilmente palabras y aprender a utilizarlas de manera lúdica.',
          ],
        },
        {
          title: 'Lo que hice',
          diagram: true,
          body: [
            'El proceso es: subrayar una palabra en mi celular, ejecutar un shortcut (mi celular tiene un botón especial para shortcuts) para añadir la palabra a una base de datos, luego, al abrir la aplicación, recibir un pequeño quiz donde hay que elegir en qué situación la palabra cabe.',
            'El shortcut, llamando a la API desde un Cloudflare Worker, puede detectar cualquier idioma y, además, meter la palabra en un grupo para que, en la aplicación, se puedan estudiar palabras que pertenecen a un grupo. La simplicidad —subrayar una palabra y tocar un botón— hace única esta aplicación; ¡diría que el proceso de añadir palabras es mejor que todas las otras aplicaciones!',
            'Este quiz es generado por un LLM y, al utilizar ciertas APIs de LLMs, puedo crear este contenido gratis. Utilizo LLMs no solamente para crear los quizzes, sino también en el shortcut, donde los utilizo para verificar que una palabra sí existe; si no, añadiría palabras sin sentido.',
            '[lo escribe Jack: ¿«gratis» con BYOK? Si cada usuario pone su clave, ¿quién paga? (¿el plan gratuito de Gemini?)]',
            'Dado que estoy usando APIs y bases de datos, fue muy importante hacer segura la aplicación, entonces elegí utilizar la OAuth API de Google y hacer las llamadas a las APIs a través de un Cloudflare Worker.',
            'Buscando ofrecer esta aplicación a todo el mundo, tuve otro problema: no puedo utilizar mi propia llave de API; si no, cualquiera podría usarla y me costaría mucho. Por ende, decidí crear esta aplicación “Bring Your Own Key” (y el título del proyecto, “Bring Your Own Vocab”, hace referencia a eso); ya el público general puede crear una cuenta, o utilizar su Gmail, añadir su llave de OpenAI o Google y ¡estar listo para practicar!',
            'Acá tengo un diagrama:',
          ],
        },
        {
          title: 'Lo que aprendí',
          body: [
            'Al principio la aplicación me daba una lista de palabras y mi tarea era utilizarlas en un texto corto que sería examinado por un LLM, que puede ser útil, pero no me daban muchas ganas de abrir la aplicación y escribir textos sin saber realmente si tenían sentido... no solo tenía que escribir —que toma mucho tiempo—, sino también tenía que leer los comentarios de la IA... tras tres meses solo “dominaba” (o sea, había empleado correctamente una palabra en 4 ocasiones) 52 palabras... no era tan efectivo como quería.',
            'Cambié de estrategia: en lugar de escribir textos desde el principio, hay que seleccionar la situación en la que una palabra se puede decir. Así puedo aprender *cuándo* emplear una palabra y recibo comentarios de manera inmediata. Solo tras ver esta palabra en situaciones diversas y muchas veces, tengo que escribir mi propia frase.',
            'Otra reflexión es que la fricción nos impide aprender. Hay mucha gente que empieza un proyecto —hablar otro idioma o adquirir una competencia cualquiera— que tiene el interés, pero este interés choca con todas las limitaciones (escribir tarjetas didácticas, por ejemplo). En este proyecto, y en mis otros proyectos, tengo el objetivo de minimizar a más no poder la fricción para que el tiempo se utilice para aprender, no para mantener.',
            '[lo escribe Jack: el resultado — qué pasó después del cambio de estrategia (¿la usas ahora? ¿desde cuándo? ¿cuántas palabras?)]',
          ],
        },
      ],
      architecture: `  iPhone / Kindle (palabra subrayada)     App de una página (byov.net)
        │  POST /add + token personal          │  login Google / email → JWT
        └──────────────────┬───────────────────┘
                           ▼
                  Cloudflare Worker (edge)
                  auth JWT · BYOK · ruta /add
                           │
        ┌──────────────────┼──────────────────────┐
        ▼                  ▼                      ▼
   OpenAI             OpenAI / Gemini        Cloudflare D1
   gpt-5.6-luna       clave del usuario      (SQLite edge)
   idioma, validez,   quiz, texto con        datos por user_id:
   duplicados, grupo  huecos, corrección     palabras, progreso,
                                             grupos, sesión en curso`,
      stack: [
        { layer: 'Frontend', tech: 'JavaScript vanilla, un solo index.html, mobile-first (Safari/PWA)' },
        { layer: 'Hosting', tech: 'GitHub Pages (GitHub Actions), dominio byov.net' },
        { layer: 'Backend', tech: 'Cloudflare Worker (edge)' },
        { layer: 'Base de datos', tech: 'Cloudflare D1 (SQLite en el edge), multiusuario por user_id' },
        { layer: 'Autenticación', tech: 'Email + PBKDF2 · Google OAuth (JWKS RS256) · JWT (HS256)' },
        { layer: 'IA (práctica)', tech: 'BYOK: OpenAI y Google (Gemini, Gemma), streaming' },
        { layer: 'IA (captura)', tech: 'gpt-5.6-luna en el servidor: idioma, validez, similitud, grupo' },
        { layer: 'Captura', tech: 'iOS Shortcut → POST /add · importación desde Kindle (Python)' },
      ],
    },
  },
  {
    slug: 'news-reader',
    link: 'https://pi.moncorpsesttropgrandtropmaladefuck.uk/?lang=es',
    repoNote: 'Por razones de seguridad, este repo solo está disponible a pedido.',
    title: 'Lectora de periodismo',
    summary:
      'Queriendo leer periodismo de diferentes países de una manera sencilla, creé mi propia lectora de periodismo.',
    stack: ['Python', 'Playwright', 'Flask', 'SQLite', 'Raspberry Pi', 'Cloudflare Tunnel'],
    caseStudy: {
      sections: [
        {
          title: 'La motivación',
          body: [
            'El periodismo es una buena fuente para un lenguaje rico: palabras menos comunes y expresivas; conectores lógicos; temas diversos. Pero leer más de, digamos, tres periódicos tiene su propia fricción: hay que abrir cada periódico y encontrar el contenido interesante.',
            'Queriendo leer periodismo de diferentes países de una manera sencilla, creé mi propia lectora de periodismo. Dos veces al día, mi proyecto recupera los artículos de publicaciones que sigo, me envía una notificación, y puedo abrir una sola página donde encuentro los artículos. Si estoy en el sitio y veo un artículo que despierte mi interés, tengo también un marcador (bookmarklet) que puedo ejecutar para añadir el artículo a mi lectora.',
          ],
        },
        {
          title: 'Cómo lo hice',
          body: [
            'Para unos sitios, basta con un webscraper sencillo, pero para otros, necesito un software que ejecuta comandos de computadora (Playwright, en este caso) para acceder al contenido. Fue particularmente desafiante con la prensa francesa, que se esconde en Europresse, un sitio donde hay que buscar artículos uno por uno. (Me interesa subrayar que o pago por el contenido o es gratis... todo eso es legítimo.)',
            'Sin el deseo de pagar ninguna suscripción o servidor, empleé mi Raspberry Pi para ahorrar costos y tener más control. El Pi está conectado a un túnel para que desde cualquier lugar pueda ir a mi dominio, conectarme a mi Pi y leer mi periodismo.',
          ],
        },
        {
          title: 'Lo que aprendí',
          body: [
            'Las redes sociales funcionan porque los usuarios pueden elegir qué fuentes les gustan y luego las redes compilan esos contenidos; la alternativa es tener una lista de personas que nos interesan y buscar a mano todas. La eficacia de este sitio es la misma: al tener una lista de las publicaciones que me interesan y recuperar esos contenidos a diario y sin mí, tengo acceso más fácil al contenido que me importa.',
            'Al utilizar una Raspberry Pi con un túnel de Cloudflare, yo tengo más control, pero como consecuencia es más esfuerzo mantener. Para hacer esta aplicación fiable, me di cuenta de que era mejor recibir alertas cuando el Pi se cae o el túnel no conecta... tengo dos servicios —UptimeRobot y healthchecks.io— para que yo reciba notificaciones cuando algo falla.',
            'Gracias a esta aplicación, leo escritos que antes no leía porque era demasiado molesto ir cada día al sitio. Con esta aplicación, ahorro tiempo (no tengo que abrir las páginas de las publicaciones); ahorro espacio en mi navegador (no tengo pestañas de cada artículo que quiero leer); estoy más informado (puedo leer y comparar diversas fuentes); descubro nuevo contenido (leo escritos que antes no veía).',
          ],
        },
      ],
      architecture: `  iOS Shortcut / marcador     Colector RSS (cada 2 h)
  (desde cualquier sitio)     → titulares del día, notificación 2 veces al día
        │ POST /add                   │
        └──────────────┬──────────────┘
                       ▼
          Flask en Raspberry Pi (Cloudflare Tunnel)
          Google OAuth · búsqueda en segundo plano
                       │
     ┌─────────────────┼─────────────────────┐
     │ FR              │ ES                  │ EL
     ▼                 ▼                     ▼
  Playwright        Playwright           API REST WordPress
  BnF → Europresse  acceso directo       (sin navegador)
     │                 │                     │
     └─────────────────┼─────────────────────┘
                       ▼
          SQLite (articles.db) → lectora
          por leer · historial · sin conexión`,
      stack: [
        { layer: 'Automatización de navegador', tech: 'Playwright + Chromium (headless)' },
        { layer: 'Extracción de contenido', tech: 'readability-lxml, API REST WordPress, extracción propia (Europresse)' },
        { layer: 'Titulares', tech: 'RSS + portada de cada periódico, cada 2 h (timer systemd)' },
        { layer: 'Servidor web', tech: 'Flask + jobs en segundo plano + SSE' },
        { layer: 'Almacenamiento', tech: 'SQLite' },
        { layer: 'Autenticación', tech: 'Google OAuth 2.0 (Authlib)' },
        { layer: 'Captura', tech: 'iOS Shortcuts y bookmarklet → POST /add con token' },
        { layer: 'Sin conexión', tech: 'Service Worker + IndexedDB' },
        { layer: 'Infraestructura', tech: 'Raspberry Pi 4 + Cloudflare Tunnel + systemd' },
        { layer: 'Vigilancia', tech: 'UptimeRobot + healthchecks.io' },
        { layer: 'Frontend', tech: 'HTML/CSS/JS vanilla, mobile-first' },
      ],
    },
  },
  {
    slug: 'que-mal-poema',
    link: 'https://quemalpoema.com',
    github: 'https://github.com/huellasenarena/qmp',
    title: 'Qué Mal Poema',
    summary:
      'Yo quería hacerlo lo más fácil posible: en mi computadora escribo algo y con un botón en mi editor puedo publicar todo.',
    stack: ['Python', 'GitHub Actions', 'Google Docs API', 'OpenAI', 'Apps Script', 'Telegram Bot'],
    caseStudy: {
      sections: [
        {
          title: 'Motivación',
          body: [
            'Aprender un idioma requiere leer, claro está, pero también escribir: hay que tener la capacidad de formular y comunicar una idea. Con este fin, quería crear un blog donde escribo mis propios textos —poemas y pensamientos sobre otros escritos—. Pero el problema es que ¡es un trabajo mantener un blog! Hay que pasar minutos para publicar algo, no hay mucho control, tal vez hay que pagar... no.',
            'Yo quería hacerlo lo más fácil posible: en mi computadora escribo algo y con un botón en mi editor puedo publicar todo. No hay que abrir una página o verificar a mano... todo se hace sin fricción.',
          ],
        },
        {
          title: 'Lo que hice',
          body: [
            'Crear la página fue bastante sencillo... lo interesante es el proceso de escribir y publicar. Utilizo Google Docs y Apps Script como base de datos y verificador. Tras escribir en mi computadora, ejecuto un shortcut que envía los escritos a un Apps Script que los añade al Google Docs. Cada día una Action de GitHub lee el Google Docs con su API para ver si hay escritos no publicados. Si hay, los publica... voilà.',
          ],
        },
        {
          title: 'Lo que aprendí',
          body: [
            'La tecnología, espero, nos ahorra el tiempo para que tengamos más tiempo para hacer lo que nos gusta. Mantener un sitio; hacer muchos clics para ir a ciertas páginas y copiar y pegar cierto contenido; organizar muchas aplicaciones... todo eso nos hace asociar una actividad con un fastidio. Con este sitio, para publicar solo bastan 3 clics (clic derecho, compartir, ejecutar el shortcut) y 2 segundos.',
            'Al principio me di cuenta de que cuanto más fácil es publicar, más me divierto al escribir. Ya tengo más de 160 publicaciones en este blog... no lo haría si tuviera que escribir con una plantilla de blog de WordPress o Squarespace.',
            'Hay también lecciones sobre la utilización de la IA para estudiar idiomas. Primero, a mi juicio la IA es una herramienta muy poderosa, pero es importante decir cuándo se utiliza... no solo para la audiencia, sino también para que nosotros como pensadores podamos tener nuestras propias voces. Segundo, aprendí que al discutir con una IA sí puedo considerar nuevas perspectivas o interpretaciones, pero puede ser frustrante; funciona mejor cuando tengo un interés en un texto y solo uso la IA para ir más allá con mi argumento.',
          ],
        },
      ],
      architecture: `      iA Writer (iPad, iPhone o computadora)
        │  texto plano
        ▼
      iOS Shortcut  ──POST──▶      Apps Script (doPost)
                                      │
                                      ▼
                                     Google Docs
                                      │  Docs API · service account
                                      ▼
      GitHub Action  ──▶      Python  ──▶      OpenAI
      (cada día)       parse · validate        (keywords)
        │              SHA-256 · merge            │
        │                                         ▼
        │                                     GitHub Pages
        ▼
      Telegram: "publicado"`,
      stack: [
        { layer: 'Entrada / escritura', tech: 'iA Writer, Atajos de iOS/iPadOS' },
        { layer: 'Puente de captura', tech: 'Google Apps Script (web app doPost), gestionado con clasp' },
        { layer: 'Contenido', tech: 'Google Docs API (auth service-account)' },
        { layer: 'Procesamiento', tech: 'Python (parseo, validación, fingerprints SHA-256, merge)' },
        { layer: 'IA', tech: 'OpenAI API (generación de keywords)' },
        { layer: 'CI/CD', tech: 'GitHub Actions (6 workflows)' },
        { layer: 'Notificaciones', tech: 'Telegram Bot API' },
        { layer: 'Frontend', tech: 'JavaScript vanilla, HTML, CSS (estático), PDF.js' },
        { layer: 'Hosting', tech: 'GitHub Pages' },
      ],
    },
  },
  {
    slug: 'a-mi-me-strofa',
    link: 'https://www.quemalpoema.com/site/mestrofa.html',
    github: 'https://github.com/huellasenarena/a-mi-mestrofa',
    title: 'A mí me strofa',
    summary:
      'Con el crecimiento de la inteligencia artificial, me estaba preguntando si los gustos literarios se pueden reducir a un sencillo modelo o si los gustos son íntimos al punto que una IA no puede predecir nada.',
    stack: ['Python', 'scikit-learn', 'Vertex AI', 'Gemini', 'Cloud Run', 'BigQuery'],
    caseStudy: {
      sections: [
        {
          title: 'Motivación',
          body: [
            'Con el crecimiento de la inteligencia artificial, me estaba preguntando si los gustos literarios se pueden reducir a un sencillo modelo o si los gustos son íntimos al punto que una IA no puede predecir nada.',
            'Este proyecto también sirvió como una clase en cloud ML con Google.',
          ],
        },
        {
          title: 'Lo que hice',
          body: [
            'Al utilizar las funcionalidades de ML en Google, creé embeddings de unos 187 poemas a los que di una nota de 1, 2 o 3. Luego entrené 3 modelos: hay un modelo sin ninguna indicación de mis preferencias, uno con una colección mínima (40) de mis notas, y uno de regresión logística con todos los poemas.',
            'El tercer modelo, un modelo más sencillo que un LLM, rinde significativamente mejor: 0,410 frente a 0,340 del LLM.',
            '[lo escribe Jack: el puente hacia las «dos explicaciones» — aunque gana, el modelo sigue lejos de acertar (en accuracy empata con contestar siempre «no me gusta»). Además: 0,410 es con 40 poemas de entrenamiento, no con todos; es F1-macro; solo la regresión logística se entrenó (los otros dos son Gemini con y sin notas en el prompt)]',
            'Hay dos explicaciones: 1. que, con más datos (solo tiene cerca de 200 notas mías), el modelo sería mucho mejor; 2. que los gustos humanos son complicados: dependen de más de un texto. Dependen de lo que estamos experimentando; si queremos explorar algo nuevo o quedarnos con lo mismo; si estamos cansados y no queremos algo tan largo; si conocemos algo sobre el autor...',
            'Me interesa más esa segunda explicación porque muestra que pase lo que pase, nuestro juicio como seres humanos siempre nos servirá.',
          ],
        },
      ],
      architecture: `   Qué Mal Poema (blog diario)                 Cloud Scheduler (cada 10 min)
   poema citado + mi nota                             │
                 │ HTTPS, solo lectura                │
                 └──────────────────┬─────────────────┘
                                    ▼
                  Cloud Run · FastAPI (escala a cero)
                  clasificador cargado en memoria
                                    │
                 ┌──────────────────┴──────────────────┐
                 ▼                                     ▼
       gemini-embedding-001                    Gemini genérico
       → regresión logística                   (el rival)
                 └──────────────────┬──────────────────┘
                                    ▼
                  BigQuery · predicciones congeladas
                  (una por día, antes de conocer mi nota)
                                    │
               ┌────────────────────┴────────────────────┐
               ▼                                         ▼
     Página del blog                         corpus → compuerta
     mi nota · mi modelo · Gemini            campeón–challenger
                                                         │
                                                         ▼
                                           Cloud Storage → nuevo campeón`,
      stack: [
        { layer: 'Embeddings', tech: 'Vertex AI · gemini-embedding-001 (256 dimensiones)' },
        { layer: 'Rival', tech: 'Vertex AI · Gemini (genérico y con mis notas en el prompt)' },
        { layer: 'Modelo', tech: 'scikit-learn · regresión logística, LOO-CV' },
        { layer: 'Servidor', tech: 'FastAPI en Cloud Run, escala a cero' },
        { layer: 'Almacenamiento', tech: 'BigQuery (predicciones congeladas), Cloud Storage (modelo)' },
        { layer: 'Orquestación', tech: 'Cloud Scheduler (cada 10 min)' },
      ],
    },
  },
];
