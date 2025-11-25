'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'
import { i18n, type Locale } from '@/i18n/config'
import { SelectRow } from './SelectRow'

type LanguageSelectProps = {
  className?: string
}

export function LanguageSelect({ className }: LanguageSelectProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Language')

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean)
    if (i18n.locales.includes(segments[0] as Locale)) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }
    const newPath = '/' + segments.join('/')
    router.push(newPath)
  }

  return (
    <SelectRow label={t('select')} className={className}>
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('select')} />
        </SelectTrigger>
        <SelectContent>
          {i18n.locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc === 'en' ? t('english') : t('german')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SelectRow>
  )
}

