'use client'

/**
 * Common layout component for dice rollers.
 * 
 * Provides a consistent structure across all dice rollers with:
 * - Full-height flex container
 * - Responsive padding (p-2 on mobile, p-4 on desktop)
 * - Composable sub-components for flexible layout
 * 
 * For detailed documentation and usage examples, see [RollerLayout.md](./RollerLayout.md).
 * 
 * Used by D6, Daggerheart, and Shadowrun rollers.
 */
import * as React from 'react'
import { cn } from '@/lib/utils'

type RollerLayoutResultAreaProps = {
  id: string
  showNewResultBottom?: boolean
} & React.ComponentProps<'div'>

/**
 * Scrollable area for displaying dice roll results.
 * 
 * Use this component to wrap the list of roll results. It provides:
 * - Vertical scrolling with hidden scrollbar
 * - Configurable scroll direction (new results at top or bottom)
 * - Required `id` prop for auto-scroll hooks
 * 
 * When used in a grid layout with RollerLayoutControlArea, add `className = "col-span-10"`.
 * When used alone, add `className = "h-0 pb-2"` for proper spacing.
 */
export const RollerLayoutResultArea = ({
  id,
  showNewResultBottom = true,
  className,
  ...props
}: RollerLayoutResultAreaProps) => {
  return (
    <div
      data-slot="roller-layout-result-area"
      id={id}
      className={cn(
        'flex-grow min-h-0 overflow-y-auto scrollbar-none pr-2 flex',
        showNewResultBottom ? 'flex-col-reverse' : 'flex-col',
        className
      )}
      {...props}
    />
  )
}

/**
 * Optional control area for dice selection or other controls.
 * 
 * Use this component to wrap control elements like dice selectors or configuration
 * widgets. It provides relative positioning for absolute-positioned children.
 * 
 * When used in a grid layout with RollerLayoutResultArea, wrap both in a grid
 * container and add `className = "col-span-2"` to this component.
 */
export const RollerLayoutControlArea = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="roller-layout-control-area"
      className={cn('relative', className)}
      {...props}
    />
  )
}

/**
 * Footer area for action buttons and controls.
 * 
 * Use this component to wrap the footer content (typically RollerControls).
 * It provides:
 * - Fixed height (flex-none) so it doesn't grow
 * - Top border for visual separation
 * - Proper padding
 * 
 * Should be placed as the last child of RollerLayout.
 */
export const RollerLayoutFooter = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="roller-layout-footer"
      className={cn('flex-none border-t-2 pt-2', className)}
      {...props}
    />
  )
}

/**
 * Wrapper for the main content area (results and controls).
 * 
 * Use this component to wrap RollerLayoutResultArea and optionally
 * RollerLayoutControlArea. It provides the flex-grow container that takes
 * up available space between the layout padding and footer.
 * 
 * Place this as the first child of RollerLayout, before RollerLayoutFooter.
 */
export const RollerLayoutContent = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="roller-layout-content"
      className={cn('flex-grow flex flex-col h-0', className)}
      {...props}
    />
  )
}

/**
 * Root container component for dice roller layouts.
 * 
 * Use this as the outermost wrapper for all dice roller layouts. It provides:
 * - Full-height flex container
 * - Responsive padding (p-2 on mobile, p-4 on desktop)
 * - Consistent structure across all rollers
 * 
 * Compose with RollerLayoutContent and RollerLayoutFooter as children.
 */
export const RollerLayout = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="roller-layout"
      className={cn('h-full min-h-0 flex flex-col', className)}
      {...props}
    >
      <div className="flex-grow basis-0 min-h-0 p-2 md:p-4">
        <div className="h-full min-h-0 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

