'use client'

/**
 * LanguagePicker
 * - Visual language selector showing available language options
 * - Displays language names with icons in card-styled buttons
 * - Uses radiogroup semantics for accessible single selection
 * - Responsive grid layout, works down to 320px
 */

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { i18n, type Locale } from '@/i18n/config'
import { Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { SelectionCard } from './SelectionCard'

type LanguagePreviewCardProps = {
  locale: Locale
  isSelected: boolean
  onSelect: () => void
  label: string
}

const LanguagePreviewCard = ({
  locale,
  isSelected,
  onSelect,
  label,
}: LanguagePreviewCardProps) => {
  return (
    <SelectionCard isSelected={isSelected} onSelect={onSelect}>
      <div className="flex items-center gap-3">
        <Languages className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </div>
    </SelectionCard>
  )
}

type LanguagePickerProps = {
  className?: string
  groupLabelId?: string
}

export const LanguagePicker = ({ className, groupLabelId }: LanguagePickerProps) => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Language')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (newLocale: Locale) => {
    const segments = pathname.split('/').filter(Boolean)
    if (i18n.locales.includes(segments[0] as Locale)) {
      segments[0] = newLocale
    } else {
      segments.unshift(newLocale)
    }
    const newPath = '/' + segments.join('/')
    router.push(newPath)
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div
        role="radiogroup"
        aria-labelledby={groupLabelId}
        className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2', className)}
      >
        {i18n.locales.map((loc) => (
          <div
            key={loc}
            className="relative w-full min-h-[64px] rounded-lg border-2 p-4 bg-card border-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-muted rounded animate-pulse" />
              <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={groupLabelId}
      className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2', className)}
    >
      {i18n.locales.map((loc) => (
        <LanguagePreviewCard
          key={loc}
          locale={loc}
          isSelected={locale === loc}
          onSelect={() => handleLanguageChange(loc)}
          label={loc === 'en' ? t('english') : t('german')}
        />
      ))}
    </div>
  )
}
