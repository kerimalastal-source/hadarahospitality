export const DEFAULT_LOCALE = 'en' as const;
export const LOCALES = ['en', 'ar', 'fr', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE) as Exclude<Locale, typeof DEFAULT_LOCALE>[];

export const RTL_LOCALES: readonly Locale[] = ['ar'];
export const isRtl = (locale: Locale) => RTL_LOCALES.includes(locale);

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
  ru: 'Русский',
};

/** BCP 47 tag used in <html lang> and hreflang annotations. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en',
  ar: 'ar',
  fr: 'fr',
  ru: 'ru',
};

/**
 * Prefixes a site-root path with the locale, e.g. localizePath('ar', '/about.html') -> '/ar/about.html'.
 * The default locale (en) is never prefixed. The homepage ("/") is special-cased to
 * "/<locale>.html" to match Astro's actual `build.format: 'file'` output for a nested
 * index route (it does not get the root's special "index.html" treatment).
 */
export function localizePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === '/') return `/${locale}.html`;
  return `/${locale}${path}`;
}
