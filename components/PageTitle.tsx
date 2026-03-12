'use client'

/**
 * PageTitle Component
 *
 * Displays the current page name in the navigation bar header.
 *
 * Purpose:
 * - Provides visual context of the current page/roller to users
 * - Reads title from PageTitleContext set by individual pages
 * - Enables decentralized title management
 *
 * Usage:
 * - Placed in the header component (providers-wrapper.tsx)
 * - Automatically displays title set by pages using SetPageTitle component
 * - Pages are responsible for setting their own titles
 *
 * Constraints:
 * - Must be a client component (uses React context)
 * - Requires PageTitleProvider to be in the component tree
 * - Pages must use SetPageTitle component to set their title
 * - Header title must remain single-line with ellipsis for long localized text
 *
 * Performance:
 * - Lightweight component with minimal re-renders
 * - Only re-renders when title changes
 */
import Image from 'next/image'
import { usePageTitle } from './PageTitleProvider'
import { useThemeBranding } from '@/lib/theme-config'
import { getRollerById } from '@/lib/rollers'
import Link from 'next/link'

export const PageTitle = () => {
  const { title, rollerId } = usePageTitle()
  const branding = useThemeBranding()

  if (!title) {
    return null
  }

  const roller = rollerId ? getRollerById(rollerId) : null
  const Icon = roller?.icon

  return (
    <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden font-semibold">
      <Link href="/" className="flex shrink-0 items-center gap-2">
        <Image
          src={branding.logo}
          width={32}
          height={32}
          alt={`${branding.brandName} Logo`}
          className="size-8 inline-block"
        />

        <span className="shrink-0">{branding.brandName}</span>
      </Link>
      <span className="shrink-0"> - </span>
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span className="min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
        {title}
      </span>
    </span>
  )
}
