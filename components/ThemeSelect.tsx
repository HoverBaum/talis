'use client'

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
}

export function ThemeSelect({ className }: ThemeSelectProps) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('Theme')

  return (
    <SelectRow label={t('select')} className={className}>
      <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">{t('default')}</SelectItem>
          <SelectItem value="shadowrun">{t('shadowrun')}</SelectItem>
          <SelectItem value="nature">{t('nature')}</SelectItem>
          <SelectItem value="spm">{t('spm')}</SelectItem>
        </SelectContent>
      </Select>
    </SelectRow>
  )
}

