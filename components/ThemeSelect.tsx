'use client'

/**
 * ThemeSelect
 * - Theme selector for sidebar and settings
 * - variant="full": label + select dropdown
 * - variant="compact": dropdown only, no label (for condensed sidebar)
 * - Options are derived from `THEMES` in `ThemeProvider` to avoid implicit coupling.
 */

import { THEMES, type Theme, useTheme } from './ThemeProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { SelectRow } from './SelectRow'

type ThemeSelectProps = {
  className?: string
  variant?: 'full' | 'compact'
}

export function ThemeSelect({ className, variant = 'full' }: ThemeSelectProps) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('Theme')

  const selectContent = (
    <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
      <SelectTrigger className={variant === 'compact' ? 'w-full' : 'w-full'}>
        <SelectValue placeholder={t('select')} />
      </SelectTrigger>
      <SelectContent>
        {THEMES.map((themeKey) => (
          <SelectItem key={themeKey} value={themeKey}>
            {t(themeKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  if (variant === 'compact') {
    return (
      <div className={cn('min-w-0 w-full', className)}>{selectContent}</div>
    )
  }

  return (
    <SelectRow label={t('select')} className={className}>
      {selectContent}
    </SelectRow>
  )
}

