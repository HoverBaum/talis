import { Locale } from 'i18n-config'
import { ShadowrunRoller } from './ShadowrunRoller'
import { getDictionary } from 'dictionaries/dictionanier'

export default async function ShadowrunRollerPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return <ShadowrunRoller dict={dict.Roller.Shadowrun} />
}
