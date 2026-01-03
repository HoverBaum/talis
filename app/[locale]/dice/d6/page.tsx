import { getTranslations, setRequestLocale } from 'next-intl/server'
import { D6Roller } from './D6Roller'
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
    title: `${t('d6')} - Talis`,
  }
}

export default async function D6Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Navigation')
  const roller = getRollerById('d6')

  return (
    <>
      <SetPageTitle title={t('d6')} iconName={roller?.iconName} />
      <D6Roller />
    </>
  )
}

