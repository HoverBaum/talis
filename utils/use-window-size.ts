'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to track window size and last height for responsive layout calculations.
 * Used by DiceSelectWheel to adjust its height when the window resizes.
 * 
 * Returns:
 * - width: Current window width
 * - height: Current window height
 * - lastHeight: Previous height value (useful for detecting height decreases)
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
    lastHeight: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize((prev) => ({
        width: window.innerWidth,
        height: window.innerHeight,
        lastHeight: prev.height,
      }))
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

