'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useThemeBranding } from '@/lib/theme-config'
import { SetPageTitle } from '@/components/PageTitleProvider'
import { Button } from '@/components/ui/button'
import BrokenDiceImage from './broken-dice.png'

export default function NotFoundPage() {
  const t = useTranslations('NotFound')
  const locale = useLocale()
  const branding = useThemeBranding()

  return (
    <>
      <SetPageTitle title={t('title')} />
      <div className="flex flex-col items-center justify-center min-h-full p-4 text-center">
        <div className="flex flex-col items-center gap-6 max-w-md">
          <Image
            src={BrokenDiceImage}
            width={250}
            height={250}
            alt="Broken Dice"
            className="rounded-2xl"
          />
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
          <Button asChild>
            <Link href={`/${locale}`}>{t('goHome')}</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
