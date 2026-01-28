'use client'

/**
 * ModePicker
 * - Visual mode selector showing light, dark, and system options
 * - Displays mode icons and labels with visual highlighting
 * - System mode shows both light and dark icons to indicate auto-switching
 * - Responsive layout, works down to 320px
 */

import { Mode, useTheme } from './ThemeProvider'
import { useTranslations } from 'next-intl'
import { Check, Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

const modes: Mode[] = ['light', 'dark', 'system']

type ModePreviewCardProps = {
  mode: Mode
  isSelected: boolean
  onSelect: () => void
  label: string
}

const ModePreviewCard = ({
  mode,
  isSelected,
  onSelect,
  label,
}: ModePreviewCardProps) => {
  const ModeIcon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative w-full rounded-lg border-2 p-4 text-left transition-all',
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

      {/* Mode display with icon and name */}
      <div className="flex items-center gap-3">
        {mode === 'system' ? (
          <div className="flex items-center gap-1.5">
            <Sun className="h-5 w-5 text-muted-foreground" />
            <Moon className="h-5 w-5 text-muted-foreground" />
          </div>
        ) : (
          <ModeIcon className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="font-medium">{label}</span>
      </div>
    </button>
  )
}

type ModePickerProps = {
  className?: string
}

export const ModePicker = ({ className }: ModePickerProps) => {
  const { mode: currentMode, setMode } = useTheme()
  const t = useTranslations('Theme.mode')

  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {modes.map((mode) => (
        <ModePreviewCard
          key={mode}
          mode={mode}
          isSelected={currentMode === mode}
          onSelect={() => setMode(mode)}
          label={t(mode)}
        />
      ))}
    </div>
  )
}
