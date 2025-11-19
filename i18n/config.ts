export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'de'],
  timeZone: 'UTC',
} as const

export type Locale = (typeof i18n)['locales'][number]

