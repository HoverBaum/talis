import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

                <div className="grid gap-4 md:grid-cols-3 mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{navT('shadowrun')}</CardTitle>
                            <CardDescription>{t('shadowrunDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href={`/${locale}/dice/shadowrun`}>{navT('shadowrun')}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{navT('d6')}</CardTitle>
                            <CardDescription>{t('d6Description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href={`/${locale}/dice/d6`}>{navT('d6')}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{navT('daggerheart')}</CardTitle>
                            <CardDescription>{t('daggerheartDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href={`/${locale}/dice/daggerheart`}>
                                    {navT('daggerheart')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

