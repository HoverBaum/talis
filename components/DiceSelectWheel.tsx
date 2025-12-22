'use client'

/**
 * A scrollable wheel component for selecting the number of dice to roll.
 *
 * Features:
 * - Snap-to-center scrolling behavior with smooth spring physics
 * - Scroll-linked visual hierarchy (scale + opacity based on distance from center)
 * - Satisfying tap feedback with spring animations
 * - Selection "pop" animation when item becomes selected
 * - Responsive height adjustment based on parent container
 * - Visual indicators (border lines) showing the selected value
 *
 * Used by many rollers for dice amount selection.
 * Must be placed in a container with a defined height for proper sizing.
 *
 * Uses Motion (formerly Framer Motion) for hardware-accelerated animations.
 */
import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'motion/react'
import { useWindowSize } from '@/utils/use-window-size'
import { useSettingsStore } from '@/app/[locale]/pages/settings/settings-store'

/** Short haptic tick for selection feedback on mobile */
const vibrateTick = () => {
  // Check if select wheel vibration is enabled in settings
  const vibrationEnabled = useSettingsStore.getState().vibration.selectWheel

  if (vibrationEnabled && 'vibrate' in navigator) {
    navigator.vibrate(15)
  }
}

type DiceSelectWheelProps = {
  max: number
  current: number
  onChange: (value: number) => void
}

// Height of each wheel item in pixels (should match the visual spacing)
const ITEM_HEIGHT = 40
// Strictness for considering an item truly centered (0.xx -> within xx% of item height)
const CENTER_THRESHOLD = 0.2

type WheelItemProps = {
  number: number
  isSelected: boolean
  onClick: () => void
  containerRef: RefObject<HTMLDivElement | null>
  containerHeight: number
  index: number
}

/**
 * Individual wheel item with scroll-linked animations.
 * Scale and opacity are driven by distance from the viewport center.
 * Uses a two-layer structure:
 * - Outer: scroll-linked scale/opacity transforms
 * - Inner: tap feedback and selection "pop" animations
 */
const WheelItem = ({
  number,
  isSelected,
  onClick,
  containerRef,
  containerHeight,
  index,
}: WheelItemProps) => {
  // Track scroll position of the container
  const { scrollY } = useScroll({ container: containerRef })

  // Track whether this item is currently centered in the viewport
  const [isCentered, setIsCentered] = useState(false)
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = Math.abs(latest - itemCenterScrollPosition)
    setIsCentered(diff <= ITEM_HEIGHT * CENTER_THRESHOLD)
  })

  // Calculate the scroll position where this item would be centered
  const itemCenterScrollPosition = index * ITEM_HEIGHT

  // Range over which the animation transitions (items within this range will be partially scaled)
  const animationRange = containerHeight / 2

  // Transform scroll position to scale: items at center are larger, items far away are smaller
  const scrollScale = useTransform(
    scrollY,
    [
      itemCenterScrollPosition - animationRange,
      itemCenterScrollPosition,
      itemCenterScrollPosition + animationRange,
    ],
    [0.7, 1.15, 0.7]
  )

  // Transform scroll position to opacity: items at center are fully visible, items far away fade
  const opacity = useTransform(
    scrollY,
    [
      itemCenterScrollPosition - animationRange,
      itemCenterScrollPosition,
      itemCenterScrollPosition + animationRange,
    ],
    [0.3, 1, 0.3]
  )

  return (
    // Outer layer: scroll-linked transforms
    <motion.div
      id={`number-${number}`}
      data-number={number}
      className="snap-center flex justify-center items-center"
      style={{
        height: ITEM_HEIGHT,
        scale: scrollScale,
        opacity,
      }}
    >
      {/* Inner layer: tap feedback and selection animations */}
      <motion.div
        className={`cursor-pointer text-2xl select-none ${
          isSelected || isCentered ? 'font-bold' : ''
        }`}
        // Selection "pop" animation - bouncy spring when becoming selected
        animate={{
          scale: isSelected ? 1.1 : 1,
        }}
        // Tap feedback: quick scale down
        whileTap={{ scale: 0.85 }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 25,
        }}
        onClick={() => {
          vibrateTick()
          onClick()
        }}
      >
        {number}
      </motion.div>
    </motion.div>
  )
}

export const DiceSelectWheel = ({
  max,
  current,
  onChange,
}: DiceSelectWheelProps) => {
  const diceNumberChoices = Array.from(Array(max).keys()).map((i) => i + 1)
  const [height, setHeight] = useState(0)
  const { height: windowHeight, lastHeight: lastWindowHeight } = useWindowSize()
  const wheelContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  // Track which item is "passed" during scroll for haptic feedback
  const lastScrolledItemRef = useRef<number>(current)

  // Update container height when window resizes
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

  // Scroll to current selection when it changes externally
  useEffect(() => {
    if (height === 0 || current === 0) return

    const wheelContainer = wheelContainerRef.current
    if (!wheelContainer) return

    // Calculate target scroll position to center the current item
    const targetScrollPosition = (current - 1) * ITEM_HEIGHT
    wheelContainer.scrollTo({ top: targetScrollPosition, behavior: 'smooth' })
  }, [current, height])

  // Haptic feedback while scrolling - vibrate when passing each number
  useEffect(() => {
    if (height === 0) return

    const wheelContainer = wheelContainerRef.current
    if (!wheelContainer) return

    const handleScrollFeedback = () => {
      const scrollTop = wheelContainer.scrollTop
      const centeredIndex = Math.round(scrollTop / ITEM_HEIGHT)
      const centeredValue = Math.max(1, Math.min(max, centeredIndex + 1))

      // Vibrate when we cross to a new number
      if (centeredValue !== lastScrolledItemRef.current) {
        lastScrolledItemRef.current = centeredValue
        vibrateTick()
      }
    }

    wheelContainer.addEventListener('scroll', handleScrollFeedback)
    return () => {
      wheelContainer.removeEventListener('scroll', handleScrollFeedback)
    }
  }, [height, max])

  // Detect which item is centered after scrolling truly stops
  useEffect(() => {
    if (height === 0) return

    const wheelContainer = wheelContainerRef.current
    if (!wheelContainer) return

    const findCurrentElement = () => {
      const scrollTop = wheelContainer.scrollTop
      // Find which item index is closest to center
      const centeredIndex = Math.round(scrollTop / ITEM_HEIGHT)
      const newValue = Math.max(1, Math.min(max, centeredIndex + 1))

      if (newValue !== current) {
        onChange(newValue)
      }
    }

    // Use scrollend event for accurate detection of when scrolling truly stops
    // (including momentum scrolling on trackpads)
    const supportsScrollEnd = 'onscrollend' in window

    if (supportsScrollEnd) {
      // Modern browsers: use scrollend for precise detection
      wheelContainer.addEventListener('scrollend', findCurrentElement)
      return () => {
        wheelContainer.removeEventListener('scrollend', findCurrentElement)
      }
    } else {
      // Fallback for older browsers: use debounced scroll with longer timeout
      const handleScroll = () => {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = setTimeout(findCurrentElement, 150)
      }

      wheelContainer.addEventListener('scroll', handleScroll)
      return () => {
        wheelContainer.removeEventListener('scroll', handleScroll)
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [height, onChange, current, max])

  return (
    <>
      {/* Visual indicators showing the selected value area */}
      <div className="absolute left-0 w-full top-1/2 -translate-y-1/2 -mt-5 border-t-2 pointer-events-none z-10" />
      <div className="absolute left-0 w-full top-1/2 -translate-y-1/2 mt-5 border-t-2 pointer-events-none z-10" />
      <div
        ref={wheelContainerRef}
        id="wheelContainer"
        className="overflow-y-scroll scrollbar-none relative snap-y snap-mandatory"
        style={{
          height: `${height}px`,
          paddingTop: `${height / 2 - ITEM_HEIGHT / 2}px`,
          paddingBottom: `${height / 2 - ITEM_HEIGHT / 2}px`,
        }}
      >
        {diceNumberChoices.map((number, index) => (
          <WheelItem
            key={number}
            number={number}
            index={index}
            isSelected={number === current}
            onClick={() => onChange(number)}
            containerRef={wheelContainerRef}
            containerHeight={height}
          />
        ))}
      </div>
    </>
  )
}
