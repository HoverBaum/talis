import { getRequestConfig } from 'next-intl/server'
import { i18n } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !i18n.locales.includes(locale as any)) {
    locale = i18n.defaultLocale
  }

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default,
    timeZone: i18n.timeZone,
  }
})

