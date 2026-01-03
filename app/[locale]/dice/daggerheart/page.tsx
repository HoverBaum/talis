import { getTranslations, setRequestLocale } from 'next-intl/server'
import { DaggerheartRoller } from './DaggerheartRoller'
import { SetPageTitle } from '@/components/PageTitleProvider'
import { getRollerById } from '@/lib/rollers'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Navigation')

  return {
    title: `${t('daggerheart')} - Talis`,
  }
}

export default async function DaggerheartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Navigation')
  const roller = getRollerById('daggerheart')

  return (
    <>
      <SetPageTitle title={t('daggerheart')} iconName={roller?.iconName} />
      <DaggerheartRoller />
    </>
  )
}

