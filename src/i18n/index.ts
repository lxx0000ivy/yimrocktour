import zh from './zh.json';
import en from './en.json';

export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh';

const dictionaries = { zh, en } as const;

export type TranslationKey = keyof typeof zh & keyof typeof en;

export function t(locale: Locale, key: TranslationKey): string {
  return dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
}

/** Extract the locale from a URL pathname; defaults to `zh`. */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  return seg === 'en' ? 'en' : 'zh';
}

/** Build a locale-prefixed URL. Default locale (zh) has no prefix. */
export function localizePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean === '/' ? '/' : clean;
  return clean === '/' ? '/en' : `/en${clean}`;
}

/** Given a current pathname, produce the matching path in the other locale. */
export function switchLocalePath(currentPath: string, target: Locale): string {
  const stripped = currentPath.replace(/^\/en(?=\/|$)/, '') || '/';
  return localizePath(target, stripped);
}

export function localeHtmlLang(locale: Locale): string {
  return locale === 'zh' ? 'zh-CN' : 'en';
}
