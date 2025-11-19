'use client'

import { useTheme } from './ThemeProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'

type Theme = 'system' | 'light' | 'dark' | 'talisTheme' | 'cyberpunk' | 'shadowrun' | 'synthwave'

type ThemeSelectProps = {
  className?: string
  withLabel?: boolean
}

export function ThemeSelect({ className, withLabel = false }: ThemeSelectProps) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('Theme')

  return (
    <div className={className}>
      {withLabel && (
        <label className="text-sm font-medium mb-2 block">
          {t('select')}
        </label>
      )}
      <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">{t('system')}</SelectItem>
          <SelectItem value="light">{t('light')}</SelectItem>
          <SelectItem value="dark">{t('dark')}</SelectItem>
          <SelectItem value="talisTheme">{t('light')}</SelectItem>
          <SelectItem value="shadowrun">{t('shadowrun')}</SelectItem>
          <SelectItem value="cyberpunk">{t('cyberpunk')}</SelectItem>
          <SelectItem value="synthwave">{t('synthwave')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

