'use client'

/**
 * A scrollable wheel component for selecting the number of dice to roll.
 *
 * Features:
 * - Velocity-sensitive drag scrolling via Motion's inertia physics (light swipe = small move,
 *   fast swipe = large move), with snap-to-item via modifyTarget
 * - Drag-linked visual hierarchy (scale + opacity based on distance from center)
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
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'motion/react'
import { useWindowSize } from '@/utils/use-window-size'
import { useSettingsStore } from '@/app/[locale]/pages/settings/settings-store'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Haptic tick utility. Duration is varied for velocity-based feedback.
 * Pass `enabled` to avoid store reads on each call.
 */
const vibrateTick = (enabled: boolean, duration: number = 15) => {
  if (enabled && 'vibrate' in navigator) {
    navigator.vibrate(Math.max(0, Math.min(60, Math.round(duration))))
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

// Animation constants
const SCALE_FAR = 0.7
const SCALE_CENTER = 1.15
const OPACITY_FAR = 0.3
const OPACITY_CENTER = 1
const TAP_SCALE = 0.85
const SELECT_POP_SCALE = 1.1
const SPRING_STIFFNESS = 500
const SPRING_DAMPING = 25
// Drag physics: lower power = shorter throw for the same swipe velocity
const DRAG_POWER = 0.3
const DRAG_TIME_CONSTANT = 200 // ms

type WheelItemProps = {
  number: number
  isSelected: boolean
  onChange: (value: number) => void
  yMotionValue: MotionValue<number>
  containerHeight: number
  index: number
  reduceMotion: boolean
}

/**
 * Individual wheel item with drag-linked animations.
 * Scale and opacity are driven by distance from the viewport center.
 * Uses a two-layer structure:
 * - Outer: drag-linked scale/opacity transforms
 * - Inner: tap feedback and selection "pop" animations
 */
const WheelItem = ({
  number,
  isSelected,
  onChange,
  yMotionValue,
  containerHeight,
  index,
  reduceMotion,
}: WheelItemProps) => {
  // Derive a scroll-position equivalent from y (negate: y is negative when "scrolled down")
  const scrollY = useTransform(yMotionValue, (v) => -v)

  // Track whether this item is currently centered in the viewport
  const [isCentered, setIsCentered] = useState(false)

  // Calculate the scroll position where this item would be centered
  const itemCenterScrollPosition = index * ITEM_HEIGHT

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = Math.abs(latest - itemCenterScrollPosition)
    setIsCentered(diff <= ITEM_HEIGHT * CENTER_THRESHOLD)
  })

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
    [SCALE_FAR, SCALE_CENTER, SCALE_FAR]
  )

  // Transform scroll position to opacity: items at center are fully visible, items far away fade
  const opacity = useTransform(
    scrollY,
    [
      itemCenterScrollPosition - animationRange,
      itemCenterScrollPosition,
      itemCenterScrollPosition + animationRange,
    ],
    [OPACITY_FAR, OPACITY_CENTER, OPACITY_FAR]
  )

  return (
    // Outer layer: drag-linked transforms
    <motion.div
      id={`number-${number}`}
      data-number={number}
      className="flex justify-center items-center"
      role="option"
      aria-selected={isSelected}
      style={{
        height: ITEM_HEIGHT,
        scale: reduceMotion ? 1 : scrollScale,
        opacity: reduceMotion ? 1 : opacity,
      }}
    >
      {/* Inner layer: tap feedback and selection animations */}
      <motion.div
        className={`cursor-pointer text-2xl select-none ${
          isSelected || isCentered ? 'font-bold' : ''
        }`}
        // Selection "pop" animation - bouncy spring when becoming selected
        animate={{
          scale: reduceMotion ? 1 : isSelected ? SELECT_POP_SCALE : 1,
        }}
        // Tap feedback: quick scale down
        whileTap={reduceMotion ? undefined : { scale: TAP_SCALE }}
        transition={{
          type: 'spring',
          stiffness: SPRING_STIFFNESS,
          damping: SPRING_DAMPING,
        }}
        onClick={() => {
          onChange(number)
        }}
      >
        {number}
      </motion.div>
    </motion.div>
  )
}

const MemoWheelItem = React.memo(WheelItem)

export const DiceSelectWheel = ({
  max,
  current,
  onChange,
}: DiceSelectWheelProps) => {
  const diceNumberChoices = Array.from(Array(max).keys()).map((i) => i + 1)
  const [height, setHeight] = useState(0)
  const { height: windowHeight, lastHeight: lastWindowHeight } = useWindowSize()
  const wheelContainerRef = useRef<HTMLDivElement>(null)
  // Track which item is "passed" during drag for haptic feedback
  const lastScrolledItemRef = useRef<number>(current)
  const lastCenteredInThresholdRef = useRef<number>(current)

  // Motion value driving the drag position (0 = item 0 centered; negative = scrolled down)
  const y = useMotionValue(0)

  // Subscribe once to store value for select wheel vibration
  const vibrationEnabled = useSettingsStore((s) => s.vibration.selectWheel)

  // Respect prefers-reduced-motion
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

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
  useLayoutEffect(() => {
    if (height === 0 || current === 0) return
    const targetY = -(current - 1) * ITEM_HEIGHT
    animate(y, targetY, { type: 'spring', stiffness: 400, damping: 30 })
  }, [current, height, y])

  // Haptic feedback while dragging - align with motion-based centering
  useMotionValueEvent(y, 'change', (latest) => {
    if (height === 0) return

    const scrollEquivalent = -latest
    const centeredIndex = Math.round(scrollEquivalent / ITEM_HEIGHT)
    const centeredValue = Math.max(1, Math.min(max, centeredIndex + 1))
    const centerDistance = Math.abs(scrollEquivalent - centeredIndex * ITEM_HEIGHT)
    const withinCenter = centerDistance <= ITEM_HEIGHT * CENTER_THRESHOLD

    if (withinCenter && centeredValue !== lastCenteredInThresholdRef.current) {
      lastCenteredInThresholdRef.current = centeredValue
      lastScrolledItemRef.current = centeredValue
      vibrateTick(vibrationEnabled, 7)
    } else if (!withinCenter) {
      lastScrolledItemRef.current = centeredValue
    }
  })

  // Keyboard navigation temporarily disabled per request

  return (
    <>
      {/* Screen reader announcement of current selection */}
      <div className="sr-only" aria-live="polite" role="status">
        Selected: {current}
      </div>
      {/* Visual indicators showing the selected value area */}
      <div className="absolute left-0 w-full top-1/2 -translate-y-1/2 -mt-5 border-t-2 pointer-events-none z-10" />
      <div className="absolute left-0 w-full top-1/2 -translate-y-1/2 mt-5 border-t-2 pointer-events-none z-10" />
      <div
        ref={wheelContainerRef}
        id="wheelContainer"
        className="overflow-hidden relative"
        role="listbox"
        aria-label="Select number of dice"
        aria-activedescendant={`number-${current}`}
        tabIndex={-1}
        style={{ height: `${height}px` }}
      >
        {height === 0 ? (
          <div className="px-4 py-6">
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <motion.div
            drag="y"
            dragConstraints={{ top: -(max - 1) * ITEM_HEIGHT, bottom: 0 }}
            dragElastic={0.05}
            dragTransition={{
              type: 'inertia',
              power: DRAG_POWER,
              timeConstant: DRAG_TIME_CONSTANT,
              modifyTarget: (target) => {
                const index = Math.round(-target / ITEM_HEIGHT)
                const clamped = Math.max(0, Math.min(max - 1, index))
                return -clamped * ITEM_HEIGHT
              },
            }}
            style={{
              y,
              paddingTop: `${height / 2 - ITEM_HEIGHT / 2}px`,
              paddingBottom: `${height / 2 - ITEM_HEIGHT / 2}px`,
            }}
            onDragTransitionEnd={() => {
              const currentY = y.get()
              const index = Math.round(-currentY / ITEM_HEIGHT)
              const newValue = Math.max(1, Math.min(max, index + 1))
              vibrateTick(vibrationEnabled, 18)
              if (newValue !== current) onChange(newValue)
            }}
          >
            {diceNumberChoices.map((number, index) => (
              <MemoWheelItem
                key={number}
                number={number}
                index={index}
                isSelected={number === current}
                onChange={onChange}
                yMotionValue={y}
                containerHeight={height}
                reduceMotion={reduceMotion}
              />
            ))}
          </motion.div>
        )}
      </div>
    </>
  )
}
