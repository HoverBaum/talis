import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SetPageTitle } from '@/components/PageTitleProvider'
import { HomeCard } from '@/components/HomeCard'
import { VersionInfo } from '@/components/VersionInfo'
import { rollerNavItems, pageNavItems } from '@/lib/nav'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const navT = await getTranslations('Navigation')

  return {
    title: `${navT('home')} - Talis`,
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Home')
  const navT = await getTranslations('Navigation')

  return (
    <>
      <SetPageTitle title={navT('home')} />
      <div className="flex flex-col gap-4 p-4 md:p-8 max-w-140 lg:max-w-3xl xl:max-w-5xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
        </div>

        <div className="@container flex flex-col gap-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{navT('rollers')}</h2>
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @3xl:grid-cols-4 gap-4">
              {rollerNavItems.map((roller) => {
                return (
                  <HomeCard
                    key={roller.id}
                    href={`/${locale}${roller.link}`}
                    icon={roller.icon}
                    title={navT(roller.nameKey)}
                    description={t(roller.subtitleKey)}
                  />
                )
              })}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{navT('pages')}</h2>
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @3xl:grid-cols-4 gap-4">
              {pageNavItems.map((page) => {
                return (
                  <HomeCard
                    key={page.id}
                    href={`/${locale}${page.link}`}
                    icon={page.icon}
                    title={navT(page.nameKey)}
                    description={t(page.subtitleKey)}
                  />
                )
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 sm:hidden flex justify-center">
          <VersionInfo />
        </div>
      </div>
    </>
  )
}
