import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ShadowrunRoller } from './ShadowrunRoller'
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
  const roller = getRollerById('shadowrun')

  return (
    <>
      <SetPageTitle title={t('shadowrun')} iconName={roller?.iconName} />
      <ShadowrunRoller />
    </>
  )
}

