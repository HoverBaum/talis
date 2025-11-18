'use client'

import { useEffect } from 'react'

/**
 * Hook to automatically scroll a container when dependencies change.
 * Used by all dice rollers to scroll to show new results.
 * 
 * @param containerId - The ID of the scrollable container element
 * @param showNewResultBottom - If true, scrolls to bottom; if false, scrolls to top
 * @param deps - Dependencies array that triggers the scroll (typically [rolls, config.showNewResultBottom])
 */
export function useAutoScroll(
  containerId: string,
  showNewResultBottom: boolean,
  deps: unknown[]
) {
  useEffect(() => {
    const resultContainer = document.getElementById(containerId)
    if (resultContainer) {
      if (showNewResultBottom) {
        resultContainer.scrollTo({
          top: resultContainer.scrollHeight,
          behavior: 'smooth',
        })
      } else {
        resultContainer.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

