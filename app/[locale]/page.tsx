import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SetPageTitle } from '@/components/PageTitleProvider'
import { rollers } from '@/lib/rollers'

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
                    {rollers.map((roller) => {
                        const Icon = roller.icon
                        return (
                            <Link 
                                key={roller.id}
                                href={`/${locale}${roller.link}`}
                                className="transition-transform hover:scale-105 active:scale-95"
                            >
                                <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-5 h-5" />
                                            <CardTitle>{navT(roller.id as any)}</CardTitle>
                                        </div>
                                        <CardDescription>{t(`${roller.id}Description` as any)}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

