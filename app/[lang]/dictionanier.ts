import 'server-only'
import type { Locale } from '../../i18n-config'

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () =>
    import('../../dictionaries/en.json').then((module) => module.default),
  de: () =>
    import('../../dictionaries/de.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en()

export type DictionaryType = ReturnType<typeof getDictionary> extends Promise<
  infer T
>
  ? T
  : never