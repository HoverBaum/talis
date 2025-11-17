import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Home' })

    return {
        title: 'Talis - Dice Rolling',
        description: t('description'),
    }
}

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const t = await getTranslations('Home')
    const navT = await getTranslations('Navigation')

    return (
        <div className="flex flex-col gap-4 p-4 md:p-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground">{t('description')}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{navT('shadowrun')}</CardTitle>
                        <CardDescription>Shadowrun dice roller</CardDescription>
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
                        <CardDescription>General purpose D6 roller</CardDescription>
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
                        <CardDescription>Daggerheart dice roller</CardDescription>
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
    )
}

