'use client'

/**
 * ThemePicker
 * - Sophisticated theme selector with visual previews
 * - Shows theme logo, name, and color palette
 * - Each theme button displays that theme's colors (not the current theme)
 * - Theme previews use the current mode (light/dark) to show how each theme looks
 * - Responsive grid layout, works down to 320px
 */

import { Theme, useTheme, type Mode } from './ThemeProvider'
import { getThemeBranding } from '@/lib/theme-config'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const themes: Theme[] = ['default', 'shadowrun', 'nature', 'spm']

// Color strip showing key theme colors using global mode
const ColorStrip = () => {
  return (
    <div className="flex gap-0.5 px-2 py-1.5 rounded bg-background">
      <div className="h-4 flex-1 rounded-sm bg-primary" title="Primary" />
      <div className="h-4 flex-1 rounded-sm bg-secondary" title="Secondary" />
      <div className="h-4 flex-1 rounded-sm bg-roll-positive" title="Success" />
      <div className="h-4 flex-1 rounded-sm bg-roll-negative" title="Glitch" />
    </div>
  )
}

type ThemePreviewCardProps = {
  theme: Theme
  isSelected: boolean
  onSelect: () => void
  label: string
}

const ThemePreviewCard = ({
  theme,
  isSelected,
  onSelect,
  label,
}: ThemePreviewCardProps) => {
  const branding = getThemeBranding(theme)
  const { mode } = useTheme()
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (mode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateMode = () => {
      setSystemMode(mediaQuery.matches ? 'dark' : 'light')
    }

    updateMode()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMode)
      return () => mediaQuery.removeEventListener('change', updateMode)
    } else {
      mediaQuery.addListener(updateMode)
      return () => mediaQuery.removeListener(updateMode)
    }
  }, [mode])

  // Determine actual mode (resolve 'system' to light/dark)
  const actualMode = mode === 'system' ? systemMode : mode

  return (
    <div data-theme={theme} data-mode={actualMode}>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'relative w-full rounded-lg border-2 p-3 text-left transition-all bg-card',
          'hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
        )}
      >
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1 z-20">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}

        {/* Theme header with logo and name */}
        <div className="flex items-center gap-2 mb-3">
          <Image
            src={branding.logo}
            alt={`${label} theme`}
            width={28}
            height={28}
            className="rounded"
          />
          <span className="font-medium">{label}</span>
        </div>

        {/* Color palette using the preview theme's mode */}
        <ColorStrip />
      </button>
    </div>
  )
}

type ThemePickerProps = {
  className?: string
}

export const ThemePicker = ({ className }: ThemePickerProps) => {
  const { theme: currentTheme, setTheme } = useTheme()
  const t = useTranslations('Theme')

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {themes.map((theme) => (
        <ThemePreviewCard
          key={theme}
          theme={theme}
          isSelected={currentTheme === theme}
          onSelect={() => setTheme(theme)}
          label={t(theme)}
        />
      ))}
    </div>
  )
}
