import { useEffect, useState } from 'react'

export const useWindowsSize = () => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    lastWidth: 0,
    lastHeight: 0,
  })

  useEffect(() => {
    const updateSize = () => {
      setSize((size) => ({
        width: window.innerWidth,
        height: window.innerHeight,
        lastWidth: size.width,
        lastHeight: size.height,
      }))
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [setSize])
  return size
}
