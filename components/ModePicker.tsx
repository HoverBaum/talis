'use client'

/**
 * ModePicker
 * - Visual mode selector showing light, dark, and system options
 * - Reuses color strip approach from ThemePicker for consistency
 * - System mode shows both light and dark strips to indicate auto-switching
 * - Responsive layout, works down to 320px
 */

import { Mode, useTheme } from './ThemeProvider'
import { useTranslations } from 'next-intl'
import { Check, Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

const modes: Mode[] = ['light', 'dark', 'system']

// Color strip showing key theme colors for a specific mode
const ColorStrip = ({ mode }: { mode: 'light' | 'dark' }) => {
  return (
    <div
      data-mode={mode}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-background"
    >
      {mode === 'light' ? (
        <Sun className="h-3 w-3 text-muted-foreground shrink-0" />
      ) : (
        <Moon className="h-3 w-3 text-muted-foreground shrink-0" />
      )}
      <div className="flex gap-0.5 flex-1">
        <div className="h-4 flex-1 rounded-sm bg-primary" title="Primary" />
        <div className="h-4 flex-1 rounded-sm bg-secondary" title="Secondary" />
        <div className="h-4 flex-1 rounded-sm bg-roll-positive" title="Success" />
        <div className="h-4 flex-1 rounded-sm bg-roll-negative" title="Glitch" />
      </div>
    </div>
  )
}

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
        'relative w-full rounded-lg border-2 p-3 text-left transition-all',
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

      {/* Mode header with icon and name */}
      <div className="flex items-center gap-2 mb-3">
        <ModeIcon className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{label}</span>
      </div>

      {/* Color preview based on mode */}
      <div className="space-y-1.5">
        {mode === 'light' && <ColorStrip mode="light" />}
        {mode === 'dark' && <ColorStrip mode="dark" />}
        {mode === 'system' && (
          <>
            <ColorStrip mode="light" />
            <ColorStrip mode="dark" />
          </>
        )}
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
