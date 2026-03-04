'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

export function IosBackButton() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('Navigation')

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(`/${locale}`)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-foreground"
      onClick={handleBack}
      aria-label={t('back')}
    >
      <ChevronLeft className="size-6" />
    </Button>
  )
}
