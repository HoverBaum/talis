import { getTranslations, setRequestLocale } from 'next-intl/server'
import { D6Roller } from './d6-roller'
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

  return (
    <>
      <SetPageTitle title={t('d6')} />
      <D6Roller />
    </>
  )
}

