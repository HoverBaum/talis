import { Locale } from 'i18n-config'
import { D6Roller } from './D6Roller'
import { getDictionary } from 'dictionaries/dictionanier'

export default async function D6RollerPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return <D6Roller dict={dict.Roller.Shadowrun} />
}
