import { mergeDictionary, type Dictionary, type DeepPartial } from './dictionary';
import { en } from './dictionaries/en';
import { ar } from './dictionaries/ar';
import { fr } from './dictionaries/fr';
import { ru } from './dictionaries/ru';
import type { Locale } from './locales';

export * from './locales';
export type { Dictionary, FaqItem } from './dictionary';

const PARTIALS: Record<Exclude<Locale, 'en'>, DeepPartial<Dictionary>> = { ar, fr, ru };

/** Returns the full dictionary for a locale, with any untranslated key falling back to English. */
export function getDictionary(locale: Locale): Dictionary {
  if (locale === 'en') return en;
  return mergeDictionary(en, PARTIALS[locale]);
}
