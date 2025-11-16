import { Locale } from 'i18n-config'
import { DaggerheartRoller } from './DaggerheartRoller'
import { getDictionary } from 'dictionaries/dictionanier'

export default async function DaggerheartPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return <DaggerheartRoller dict={dict.Roller.Daggerheart} />
}
