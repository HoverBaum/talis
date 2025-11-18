'use client'

/**
 * Common layout component for dice rollers.
 * 
 * Provides a consistent structure across all dice rollers with:
 * - Full-height flex container
 * - Grid layout for results (10 columns) and optional controls (2 columns)
 * - Scrollable results area with configurable scroll direction
 * - Footer area for action buttons
 * 
 * Used by D6, Daggerheart, and Shadowrun rollers.
 * Responsive padding (p-2 on mobile, p-4 on desktop).
 */
import { ReactNode } from 'react'

type RollerLayoutProps = {
  resultContainerId: string
  showNewResultBottom?: boolean
  resultArea: ReactNode
  controlArea?: ReactNode
  footer: ReactNode
}

export function RollerLayout({
  resultContainerId,
  showNewResultBottom = true,
  resultArea,
  controlArea,
  footer,
}: RollerLayoutProps) {
  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex-grow basis-0 p-2 md:p-4">
        <div className="h-full flex flex-col">
          {controlArea ? (
            <div className="flex-grow grid grid-cols-12 h-0 pb-4">
              <div
                id={resultContainerId}
                className={`overflow-y-auto col-span-10 scrollbar-none pr-2 flex ${
                  showNewResultBottom ? 'flex-col-reverse' : 'flex-col'
                }`}
              >
                {resultArea}
              </div>
              <div className="col-span-2 relative">{controlArea}</div>
            </div>
          ) : (
            <div
              id={resultContainerId}
              className={`flex-grow overflow-y-auto scrollbar-none pr-2 flex ${
                showNewResultBottom ? 'flex-col-reverse' : 'flex-col'
              } h-0 pb-4`}
            >
              {resultArea}
            </div>
          )}
          <div className="flex-none border-t-2 pt-4">{footer}</div>
        </div>
      </div>
    </div>
  )
}

