'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { SetPageTitle } from '@/components/PageTitleProvider'
import { Button } from '@/components/ui/button'
import BrokenDiceImage from './broken-dice.png'

export default function NotFoundPage() {
  const t = useTranslations('NotFound')
  const locale = useLocale()

  return (
    <>
      <SetPageTitle title={t('pageTitle')} />
      <div className="flex min-h-full w-full max-w-full flex-col items-center justify-center overflow-x-hidden p-4 text-center">
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <Image
            src={BrokenDiceImage}
            width={250}
            height={250}
            alt="Broken Dice"
            className="h-auto w-52 max-w-full rounded-2xl sm:w-60"
          />
          <h1 className="mx-auto w-full max-w-[16ch] text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mx-auto w-full max-w-[34ch] text-muted-foreground text-pretty">
            {t('description')}
          </p>
          <Button asChild>
            <Link href={`/${locale}`}>{t('goHome')}</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
