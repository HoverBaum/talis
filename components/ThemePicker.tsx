'use client'

/**
 * ThemePicker
 * - Sophisticated theme selector with visual previews
 * - Shows theme logo, name, and color palette
 * - Each theme button displays that theme's colors (not the current theme)
 * - Theme previews use the current mode (light/dark) to show how each theme looks
 * - Uses radiogroup semantics for accessible single selection
 * - Responsive grid layout, works down to 320px
 */

import { THEMES, type ResolvedMode, type Theme, useTheme } from './ThemeProvider'
import { getThemeBranding } from '@/lib/theme-config'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

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
  resolvedMode: ResolvedMode
}

const ThemePreviewCard = ({
  theme,
  isSelected,
  onSelect,
  label,
  resolvedMode,
}: ThemePreviewCardProps) => {
  const branding = getThemeBranding(theme)

  return (
    <div data-theme={theme} data-mode={resolvedMode} className="[color-scheme:inherit]">
      <button
        type="button"
        onClick={onSelect}
        role="radio"
        aria-checked={isSelected}
        className={cn(
          'relative w-full min-h-[88px] rounded-lg border-2 p-3 text-left text-foreground transition-all bg-card',
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
  groupLabelId?: string
}

export const ThemePicker = ({ className, groupLabelId }: ThemePickerProps) => {
  const { theme: currentTheme, setTheme, resolvedMode } = useTheme()
  const t = useTranslations('Theme')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div
        role="radiogroup"
        aria-labelledby={groupLabelId}
        className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2', className)}
      >
        {THEMES.map((theme) => (
          <div
            key={theme}
            className="relative w-full min-h-[88px] rounded-lg border-2 p-3 bg-card border-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-muted animate-pulse" />
              <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex gap-0.5 px-2 py-1.5 rounded bg-background">
              <div className="h-4 flex-1 rounded-sm bg-muted animate-pulse" />
              <div className="h-4 flex-1 rounded-sm bg-muted animate-pulse" />
              <div className="h-4 flex-1 rounded-sm bg-muted animate-pulse" />
              <div className="h-4 flex-1 rounded-sm bg-muted animate-pulse" />
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
      {THEMES.map((theme) => (
        <ThemePreviewCard
          key={theme}
          theme={theme}
          isSelected={currentTheme === theme}
          onSelect={() => setTheme(theme)}
          label={t(theme)}
          resolvedMode={resolvedMode}
        />
      ))}
    </div>
  )
}
