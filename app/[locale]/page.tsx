import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SetPageTitle } from '@/components/PageTitleProvider'
import { HomeCard } from '@/components/HomeCard'
import { rollerNavItems, pageNavItems } from '@/lib/nav'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Home')
  const navT = await getTranslations('Navigation')

  return {
    title: `${navT('home')} - Talis`,
    description: t('description'),
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
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        <div className="@container flex flex-col gap-8 mt-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{navT('rollers')}</h2>
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 gap-4">
              {rollerNavItems.map((roller) => {
                const nameKeyPart = roller.nameKey.split('.')[1]
                const subtitleKeyPart = roller.subtitleKey.split('.')[1]
                return (
                  <HomeCard
                    key={roller.id}
                    href={`/${locale}${roller.link}`}
                    icon={roller.icon}
                    title={navT(nameKeyPart as any)}
                    description={t(subtitleKeyPart as any)}
                  />
                )
              })}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{navT('pages')}</h2>
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 gap-4">
              {pageNavItems.map((page) => {
                const nameKeyPart = page.nameKey.split('.')[1]
                const subtitleKeyPart = page.subtitleKey.split('.')[1]
                return (
                  <HomeCard
                    key={page.id}
                    href={`/${locale}${page.link}`}
                    icon={page.icon}
                    title={navT(nameKeyPart as any)}
                    description={t(subtitleKeyPart as any)}
                  />
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
