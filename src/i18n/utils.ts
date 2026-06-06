import { ui, defaultLang } from './ui';

export type Lang = keyof typeof ui;

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
