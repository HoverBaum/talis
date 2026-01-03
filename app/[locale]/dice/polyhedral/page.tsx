import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PolyhedralRoller } from './PolyhedralRoller'
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
    title: `${t('polyhedral')} - Talis`,
  }
}

export default async function PolyhedralPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Navigation')
  const roller = getRollerById('polyhedral')

  return (
    <>
      <SetPageTitle title={t('polyhedral')} icon={roller?.icon} />
      <PolyhedralRoller />
    </>
  )
}

