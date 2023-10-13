import { Locale } from 'i18n-config'
import { MultiD6Roller } from './MultiD6Roller'
import { getDictionary } from 'dictionaries/dictionanier'

export default async function MultiD6RollerPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return <MultiD6Roller dict={dict.Roller.Shadowrun} />
}
