import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SetPageTitle } from '@/components/PageTitleProvider'

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
                    <Link 
                        href={`/${locale}/dice/shadowrun`}
                        className="transition-transform hover:scale-105 active:scale-95"
                    >
                        <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{navT('shadowrun')}</CardTitle>
                                <CardDescription>{t('shadowrunDescription')}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link 
                        href={`/${locale}/dice/d6`}
                        className="transition-transform hover:scale-105 active:scale-95"
                    >
                        <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{navT('d6')}</CardTitle>
                                <CardDescription>{t('d6Description')}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link 
                        href={`/${locale}/dice/daggerheart`}
                        className="transition-transform hover:scale-105 active:scale-95"
                    >
                        <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{navT('daggerheart')}</CardTitle>
                                <CardDescription>{t('daggerheartDescription')}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link 
                        href={`/${locale}/dice/polyhedral`}
                        className="transition-transform hover:scale-105 active:scale-95"
                    >
                        <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{navT('polyhedral')}</CardTitle>
                                <CardDescription>{t('polyhedralDescription')}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </>
    )
}

