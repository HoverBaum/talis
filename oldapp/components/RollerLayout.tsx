import { ReactNode } from 'react'

type RollerLayoutProps = {
  resultsArea: ReactNode
  controlsArea?: ReactNode
  buttonArea: ReactNode
}

/**
 * A consistent layout for all dice rollers:
 * - Results area takes remaining space and scrolls when needed
 * - Controls area (optional) for quick buttons, input, etc.
 * - Button area stays fixed at the bottom
 */
export const RollerLayout = ({
  resultsArea,
  controlsArea,
  buttonArea,
}: RollerLayoutProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Results area - takes remaining space and scrolls */}
      <div className="flex-1 min-h-0 overflow-hidden">{resultsArea}</div>

      {/* Controls area (optional) - fixed height */}
      {controlsArea && (
        <div className="flex-shrink-0 border-t-2 py-2">{controlsArea}</div>
      )}

      {/* Button area - fixed height at bottom */}
      <div className="flex-shrink-0 border-t-2 pt-4 pb-2">{buttonArea}</div>
    </div>
  )
}
