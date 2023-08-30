import { Locale } from 'i18n-config'
import { TranslationProvider } from './TranslationContext'
import { DictionaryType, getDictionary } from './dictionanier'

export const ServerTranslationContext = async ({
  lang,
  children,
}: {
  lang: Locale
  children: React.ReactNode
}) => {
  const dictionary: DictionaryType = await getDictionary(lang)
  return (
    <TranslationProvider dictionary={dictionary}>
      {children}
    </TranslationProvider>
  )
}
