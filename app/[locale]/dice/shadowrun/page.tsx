import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ShadowrunRoller } from './ShadowrunRoller'
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
    title: `${t('shadowrun')} - Talis`,
  }
}

export default async function ShadowrunPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Navigation')

  return (
    <>
      <SetPageTitle title={t('shadowrun')} />
      <ShadowrunRoller />
    </>
  )
}

