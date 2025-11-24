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

type ThemeSelectProps = {
  className?: string
}

export function ThemeSelect({ className }: ThemeSelectProps) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('Theme')

  return (
    <div className={className}>

      <label className="text-sm font-medium mb-2 block">
        {t('select')}
      </label>

      <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">{t('system')}</SelectItem>
          <SelectItem value="light">{t('light')}</SelectItem>
          <SelectItem value="dark">{t('dark')}</SelectItem>
          <SelectItem value="shadowrun">{t('shadowrun')}</SelectItem>
          <SelectItem value="synthwave">{t('synthwave')}</SelectItem>
          <SelectItem value="nature">{t('nature')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

