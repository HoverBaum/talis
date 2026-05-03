'use client'

/**
 * ModeSelect
 * - Mode (light/dark/system) selector for sidebar and settings
 * - variant="full": label + select dropdown
 * - variant="iconOnly": compact icon-only trigger for condensed sidebar layout
 */

import { MODES, isMode, type Mode } from '@/lib/theme-system'
import { useTheme } from './ThemeProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'
import { SelectRow } from './SelectRow'
import { Moon, Sun, SunMoonIcon } from 'lucide-react'

type ModeSelectProps = {
  className?: string
  variant?: 'full' | 'iconOnly'
}

const ModeIcon = ({ mode }: { mode: Mode }) => {
  if (mode === 'light') return <Sun className="size-4" />
  if (mode === 'dark') return <Moon className="size-4" />
  return <SunMoonIcon className="size-4" />
}

export function ModeSelect({ className, variant = 'full' }: ModeSelectProps) {
  const { mode, setMode } = useTheme()
  const t = useTranslations('Theme.mode')

  const selectContent = (
    <Select value={mode} onValueChange={(value) => isMode(value) && setMode(value)}>
      <SelectTrigger
        className={
          variant === 'iconOnly'
            ? 'size-9 w-9 justify-center p-0 [&>svg:last-of-type]:hidden'
            : 'w-full'
        }
        aria-label={t('select')}
      >
        {variant === 'iconOnly' ? (
          <>
            <span className="sr-only">
              <SelectValue placeholder={t('select')} />
            </span>
            <ModeIcon mode={mode} />
          </>
        ) : (
          <SelectValue placeholder={t('select')} />
        )}
      </SelectTrigger>
      <SelectContent>
        {MODES.map((modeValue) => (
          <SelectItem key={modeValue} value={modeValue}>
            {t(modeValue)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  if (variant === 'iconOnly') {
    return <div className={className}>{selectContent}</div>
  }

  return (
    <SelectRow label={t('select')} className={className}>
      {selectContent}
    </SelectRow>
  )
}
