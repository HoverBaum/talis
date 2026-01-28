'use client'

/**
 * ModePicker
 * - Visual mode selector showing light, dark, and system options
 * - Displays mode icons and labels with visual highlighting
 * - Each mode button displays that mode's appearance (not the current mode)
 * - System mode shows both light and dark icons and displays based on system preference
 * - Uses radiogroup semantics for accessible single selection
 * - Responsive layout, works down to 320px
 */

import { type Mode, type ResolvedMode, useTheme } from './ThemeProvider'
import { useTranslations } from 'next-intl'
import { Check, Sun, Moon, SunMoonIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const modes: Mode[] = ['light', 'dark', 'system']

type ModePreviewCardProps = {
  mode: Mode
  isSelected: boolean
  onSelect: () => void
  label: string
  systemMode: ResolvedMode
}

const ModePreviewCard = ({
  mode,
  isSelected,
  onSelect,
  label,
  systemMode,
}: ModePreviewCardProps) => {
  const { theme } = useTheme()
  const ModeIcon = mode === 'light' ? Sun : mode === 'dark' ? Moon : SunMoonIcon

  // Determine actual mode for preview (resolve 'system' to light/dark)
  const previewMode = mode === 'system' ? systemMode : mode

  return (
    <div data-theme={theme} data-mode={previewMode} className="[color-scheme:inherit]">
      <button
        type="button"
        onClick={onSelect}
        role="radio"
        aria-checked={isSelected}
        className={cn(
          'relative w-full min-h-[64px] rounded-lg border-2 p-4 text-left text-foreground transition-all bg-card',
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
          <ModeIcon className="h-5 w-5" />
          <span className="font-medium">{label}</span>
        </div>
      </button>
    </div>
  )
}

type ModePickerProps = {
  className?: string
  groupLabelId?: string
}

export const ModePicker = ({ className, groupLabelId }: ModePickerProps) => {
  const { mode: currentMode, setMode, systemMode } = useTheme()
  const t = useTranslations('Theme.mode')

  return (
    <div
      role="radiogroup"
      aria-labelledby={groupLabelId}
      className={cn('grid grid-cols-1 gap-3 sm:grid-cols-3', className)}
    >
      {modes.map((mode) => (
        <ModePreviewCard
          key={mode}
          mode={mode}
          isSelected={currentMode === mode}
          onSelect={() => setMode(mode)}
          label={t(mode)}
          systemMode={systemMode}
        />
      ))}
    </div>
  )
}
