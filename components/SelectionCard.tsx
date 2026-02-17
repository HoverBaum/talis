'use client'

/**
 * SelectionCard
 * - Shared card-style radio button used by pickers (theme, mode, language, etc.)
 * - Encapsulates selection styling, focus ring, and checkmark indicator
 * - Uses button with `role="radio"` semantics for accessible single selection groups
 * - Layout is responsive and works down to 320px; content is provided via children
 * - Callers can adjust size via `sizeClass` while keeping consistent visual treatment
 */

import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type SelectionCardProps = {
  isSelected: boolean
  onSelect: () => void
  children: ReactNode
  className?: string
  /**
   * Utility classes to control height/padding (e.g. `min-h-[64px] p-4`).
   * Defaults to a medium card size suitable for most pickers.
   */
  sizeClass?: string
}

export const SelectionCard = ({
  isSelected,
  onSelect,
  children,
  className,
  sizeClass = 'min-h-[64px] p-4',
}: SelectionCardProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="radio"
      aria-checked={isSelected}
      className={cn(
        'relative w-full rounded-lg border-2 text-left text-foreground transition-all bg-card',
        'hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected ? 'border-primary border-2 ring-2 ring-primary/20' : 'border-border',
        sizeClass,
        className,
      )}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}

      {children}
    </button>
  )
}

