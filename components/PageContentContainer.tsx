/**
 * PageContentContainer
 *
 * Shared responsive-width wrapper used on the home page and all routes under
 * /pages. Provides consistent horizontal padding and a three-step max-width
 * ramp (base → lg → xl) so content never stretches uncomfortably wide on
 * large viewports.
 *
 * Pass additional layout classes (e.g. "flex flex-col gap-4") via `className`
 * to layer page-specific arrangements on top of the shared width contract.
 */
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export const PageContentContainer = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'p-4 md:p-8 max-w-140 lg:max-w-3xl xl:max-w-5xl mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
