'use client'

/**
 * ThemeSelect
 * - Theme selector for sidebar and settings
 * - variant="full": label + select dropdown
 * - variant="compact": dropdown only, no label (for condensed sidebar)
 */

import { Theme, useTheme } from './ThemeProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'
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
        <SelectItem value="default">{t('default')}</SelectItem>
        <SelectItem value="shadowrun">{t('shadowrun')}</SelectItem>
        <SelectItem value="nature">{t('nature')}</SelectItem>
        <SelectItem value="spm">{t('spm')}</SelectItem>
      </SelectContent>
    </Select>
  )

  if (variant === 'compact') {
    return <div className={className}>{selectContent}</div>
  }

  return (
    <SelectRow label={t('select')} className={className}>
      {selectContent}
    </SelectRow>
  )
}

