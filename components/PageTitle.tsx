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
 * - Returns only the page name (no "Talis" prefix) for navbar display
 * 
 * Performance:
 * - Lightweight component with minimal re-renders
 * - Only re-renders when title changes
 */
import Image from 'next/image'
import { usePageTitle } from './PageTitleProvider'
import { useThemeBranding } from '@/lib/theme-config'

export const PageTitle = () => {
  const { title } = usePageTitle()
  const branding = useThemeBranding()

  if (!title) {
    return null
  }

  return (
    <span className="font-semibold flex items-center gap-2">
      <Image
        src={branding.logo}
        width={32}
        height={32}
        alt={`${branding.brandName} Logo`}
        className="size-8 inline-block"
      />
      <span>{branding.brandName} - </span>
      {title}
    </span>
  )
}

