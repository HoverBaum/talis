'use client'

/**
 * LanguageSelect
 * - Language selector component matching the style of ThemePicker and ModePicker
 * - Uses Select component for language selection
 * - Updates the URL path to change locale
 * - Responsive layout, works down to 320px
 */

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

type LanguageSelectProps = {
  className?: string
  groupLabelId?: string
}

export function LanguageSelect({ className, groupLabelId }: LanguageSelectProps) {
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
    <div className={className}>
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full" aria-labelledby={groupLabelId}>
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
    </div>
  )
}

