'use client'

/**
 * SelectRow
 *  - Provides consistent horizontal layout for label + select controls.
 *  - Keeps label muted and left-aligned while reserving fixed spacing between label and control.
 *  - Used in sidebar and settings pages.
 *  - Responsive down to 320px: row collapses only when parent enforces stacking.
 */

import type { ReactNode } from 'react'
import { Label } from './ui/label'

type SelectRowProps = {
  label: string
  children: ReactNode
  className?: string
  controlClassName?: string
}

export function SelectRow({
  label,
  children,
  className,
  controlClassName = 'w-32',
}: SelectRowProps) {
  return (
    <div className={`flex items-center justify-between gap-2 ${className || ''}`}>
      <Label className="text-muted-foreground">{label}</Label>
      <div className={controlClassName}>{children}</div>
    </div>
  )
}

