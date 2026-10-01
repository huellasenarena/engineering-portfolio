import { ui, defaultLang } from './ui';

export type Lang = keyof typeof ui;

// El inglés está oculto hasta que Jack escriba su versión: sin enlace ES / EN, sin hreflang y sin páginas /en/.
export const showEnglish = false;

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first in ui) return first as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return (ui[lang] as Record<string, string>)[key] ?? (ui[defaultLang] as Record<string, string>)[key];
  };
}

export function getAlternateUrl(url: URL, lang: Lang): string {
  const [, first, ...rest] = url.pathname.split('/');
  const isLangPrefix = first in ui;
  const path = isLangPrefix ? rest.join('/') : [first, ...rest].join('/');
  return lang === defaultLang ? `/${path}` : `/${lang}/${path}`;
}

export type Page = 'home' | 'projects' | 'about' | 'contact';

// Las rutas cambian de nombre según el idioma (proyectos ↔ projects), por eso no basta con getAlternateUrl.
const pagePaths: Record<Lang, Record<Page, string>> = {
  es: { home: '/', projects: '/proyectos', about: '/sobre-mi', contact: '/contacto' },
  en: { home: '/en/', projects: '/en/projects', about: '/en/about', contact: '/en/contact' },
};

export function pageUrl(page: Page, lang: Lang): string {
  return pagePaths[lang][page];
}
