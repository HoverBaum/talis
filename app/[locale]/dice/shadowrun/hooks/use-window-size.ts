'use client'

import { useEffect, useState } from 'react'

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

