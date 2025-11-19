'use client'

/**
 * A scrollable wheel component for selecting the number of dice to roll.
 * 
 * Features:
 * - Snap-to-center scrolling behavior
 * - Responsive height adjustment based on parent container
 * - Visual indicators (border lines) showing the selected value
 * - Click-to-select functionality
 * 
 * Used by D6 and Shadowrun rollers for dice amount selection.
 * Must be placed in a container with a defined height for proper sizing.
 */
import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from '@/utils/use-window-size'

type DiceSelectWheelProps = {
  max: number
  current: number
  onChange: (value: number) => void
}

export function DiceSelectWheel({
  max,
  current,
  onChange,
}: DiceSelectWheelProps) {
  const diceNumberChoices = Array.from(Array(max).keys()).map((i) => i + 1)
  const [height, setHeight] = useState(0)
  const { height: windowHeight, lastHeight: lastWindowHeight } = useWindowSize()
  const wheelContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const wheelContainer = wheelContainerRef.current
    if (!wheelContainer) return

    const updateHeight = () => {
      const newHeight = wheelContainer.parentElement?.clientHeight || 0
      setHeight(newHeight)
    }

    if (windowHeight < lastWindowHeight) {
      const timer = setTimeout(updateHeight, 0)
      return () => clearTimeout(timer)
    }

    updateHeight()
  }, [windowHeight, lastWindowHeight])

  useEffect(() => {
    if (height === 0 || current === 0) return

    const wheelContainer = wheelContainerRef.current
    const currentElement = document.getElementById(`number-${current}`)

    if (wheelContainer && currentElement) {
      const currentElementPosition = currentElement.offsetTop
      const newScrollPosition = currentElementPosition - height / 2
      wheelContainer.scrollTo({ top: newScrollPosition, behavior: 'smooth' })
    }
  }, [current, height])

  useEffect(() => {
    if (height === 0) return

    const wheelContainer = wheelContainerRef.current
    if (!wheelContainer) return

    const findCurrentEvent = () => {
      const elements =
        wheelContainer.querySelectorAll<HTMLDivElement>('[data-number]')
      const center = wheelContainer.scrollTop + height / 2
      let closestElement: HTMLDivElement | null = null
      let closestDistance = Number.MAX_SAFE_INTEGER

      for (const element of elements) {
        const distance = Math.abs(center - element.offsetTop)
        if (distance < closestDistance) {
          closestElement = element
          closestDistance = distance
        }
      }

      if (closestElement) {
        const number = Number(closestElement.dataset.number)
        onChange(number)
      }
    }

    const handleScroll = () => {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(findCurrentEvent, 150)
    }

    wheelContainer.addEventListener('scroll', handleScroll)
    return () => {
      wheelContainer.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeoutRef.current)
    }
  }, [height, onChange])

  return (
    <>
      {/* Visual indicators showing the selected value area */}
      <div className="absolute left-0 w-full top-1/2 -translate-y-1/2 -mt-6 border-t pointer-events-none z-10"></div>
      <div className="absolute left-0 w-full top-1/2 -translate-y-1/2 mt-6 border-t pointer-events-none z-10"></div>
      <div
        ref={wheelContainerRef}
        id="wheelContainer"
        className="overflow-y-scroll scrollbar-none relative snap-y snap-mandatory"
        style={{
          height: `${height}px`,
          paddingTop: `${height / 2}px`,
          paddingBottom: `${height / 2}px`,
        }}
      >
        {diceNumberChoices.map((number) => (
          <div
            key={number}
            id={`number-${number}`}
            data-number={number}
            className={`snap-center my-4 grow flex justify-center items-center cursor-pointer text-2xl ${number === current ? 'font-bold' : ''
              }`}
            onClick={() => onChange(number)}
          >
            {number}
          </div>
        ))}
      </div>
    </>
  )
}

