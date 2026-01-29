/**
 * HomePage renders the localized landing page with roller cards.
 *
 * Purpose: introduce the app and provide entry points to each roller.
 * Performance: maps a small, static roller list on the server.
 * Accessibility: uses semantic headings and descriptive text.
 * Constraints: requires locale params and translation messages.
 * Usage: default route for each locale segment.
 */
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { SetPageTitle } from '@/components/PageTitleProvider'
import { HomeCard } from '@/components/HomeCard'
import { rollers } from '@/lib/rollers'
import { Settings2 } from 'lucide-react'

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

                <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-3 lg:grid-cols-4">
                    {rollers.map((roller) => (
                        <HomeCard
                            key={roller.id}
                            href={`/${locale}${roller.link}`}
                            icon={roller.icon}
                            title={navT(roller.nameKey)}
                            description={t(roller.subtitleKey)}
                        />
                    ))}
                    {/* Settings Card - Always Last */}
                    <HomeCard
                        href={`/${locale}/pages/settings`}
                        icon={Settings2}
                        title={navT('settings')}
                        description={t('settingsDescription')}
                    />
                </div>
            </div>
        </>
    )
}

