import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CoinRoller } from './CoinRoller'
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
    title: `${t('coin')} - Talis`,
  }
}

export default async function CoinPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Navigation')

  return (
    <>
      <SetPageTitle title={t('coin')} rollerId="coin" />
      <CoinRoller />
    </>
  )
}
