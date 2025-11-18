import { getTranslations, setRequestLocale } from 'next-intl/server'
import { DaggerheartRoller } from './daggerheart-roller'
import { SetPageTitle } from '@/components/PageTitleProvider'

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

  return (
    <>
      <SetPageTitle title={t('daggerheart')} />
      <DaggerheartRoller />
    </>
  )
}

