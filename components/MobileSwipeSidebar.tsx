'use client'

/**
 * MobileSwipeSidebar
 *
 * Wraps content and registers swipe gestures on mobile to open or close the sidebar.
 * Use with direction="open" around the main content, direction="close" around the sidebar content.
 * Renders an overlay for direction="close-overlay" to capture swipes on the dimmed area.
 *
 * - direction="open": Swipe left-to-right opens the sidebar. Active when sidebar is closed.
 * - direction="close": Swipe right-to-left closes the sidebar. Active when sidebar is open (on sidebar panel).
 * - direction="close-overlay": Swipe right-to-left or tap closes the sidebar (on dimmed area next to sidebar).
 *
 * - Uses native touch events (no dependencies)
 * - Requires 80px horizontal distance and mostly-horizontal gesture to avoid scroll conflicts
 * - Does not call preventDefault so native scrolling continues to work
 * - Suppresses the open gesture when the touch originates within a horizontally scrollable element
 *   (e.g. roller footer controls) to avoid conflicts with horizontal scrolling
 */

import * as React from 'react'
import { createPortal } from 'react-dom'

import { useIsMobile } from '@/utils/use-mobile'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const SWIPE_THRESHOLD_PX = 80
const SIDEBAR_WIDTH_MOBILE = '18rem'

const isWithinHorizontalScroller = (target: EventTarget | null): boolean => {
  // Only proceed for HTMLElements; non-element targets cannot be scrollers.
  const doc = typeof document !== 'undefined' ? document : null
  let el = target instanceof HTMLElement ? target : null

  while (el && doc && el !== doc.body && el !== doc.documentElement) {
    // Fast-path: check inline styles first; very cheap and doesn't trigger layout.
    const inlineOverflowX = el.style.overflowX || el.style.overflow
    let overflowX = inlineOverflowX

    if (!overflowX || overflowX === 'visible') {
      // Fall back to computed style if inline style is not informative.
      overflowX = getComputedStyle(el).overflowX
    }

    if (overflowX === 'auto' || overflowX === 'scroll') {
      // Only measure widths when horizontal overflow is enabled.
      if (el.scrollWidth > el.clientWidth) {
        return true
      }
    }

    el = el.parentElement
  }
  return false
}

type MobileSwipeSidebarProps = React.ComponentProps<'div'> & {
  children?: React.ReactNode
  direction: 'open' | 'close' | 'close-overlay'
}

export const MobileSwipeSidebar = ({
  children,
  direction,
  className,
  ...props
}: MobileSwipeSidebarProps) => {
  const isMobile = useIsMobile()
  const { openMobile, setOpenMobile } = useSidebar()

  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null)

  const isOpenGesture = direction === 'open'
  const isCloseOverlay = direction === 'close-overlay'
  const isActive =
    isMobile &&
    (isOpenGesture ? !openMobile : openMobile)

  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      // Always reset touchStartRef at the beginning of a touch sequence
      touchStartRef.current = null
      if (!isActive) return
      if (isOpenGesture && isWithinHorizontalScroller(e.target)) return
      const touch = e.touches[0]
      if (touch) {
        touchStartRef.current = { x: touch.clientX, y: touch.clientY }
      }
    },
    [isActive, isOpenGesture]
  )

  const handleTouchEnd = React.useCallback(
    (e: React.TouchEvent) => {
      if (!isActive || !touchStartRef.current) return
      const touch = e.changedTouches[0]
      if (!touch) return

      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y

      if (isOpenGesture) {
        if (
          deltaX > SWIPE_THRESHOLD_PX &&
          deltaX > Math.abs(deltaY)
        ) {
          setOpenMobile(true)
        }
      } else {
        if (
          deltaX < -SWIPE_THRESHOLD_PX &&
          Math.abs(deltaX) > Math.abs(deltaY)
        ) {
          setOpenMobile(false)
          history.back()
        }
      }

      touchStartRef.current = null
    },
    [isActive, isOpenGesture, setOpenMobile]
  )

  const handleTouchCancel = React.useCallback(() => {
    touchStartRef.current = null
  }, [])

  const handleOverlayClick = React.useCallback(() => {
    setOpenMobile(false)
    history.back()
  }, [setOpenMobile])

  if (isCloseOverlay) {
    if (!isMobile || !openMobile || typeof document === 'undefined') return null

    const overlay = (
      <div
        className="fixed inset-0 z-[60] pointer-events-none md:hidden"
        aria-hidden
      >
        <div
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
          className="absolute inset-y-0 right-0 pointer-events-auto"
          style={{ left: SIDEBAR_WIDTH_MOBILE }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          onClick={handleOverlayClick}
        />
      </div>
    )

    return createPortal(overlay, document.body)
  }

  const defaultClassName = isOpenGesture
    ? 'flex flex-1 flex-col min-h-0 min-w-0'
    : 'flex h-full w-full flex-col'

  return (
    <div
      className={cn(defaultClassName, className)}
      onTouchStart={isActive ? handleTouchStart : undefined}
      onTouchEnd={isActive ? handleTouchEnd : undefined}
      onTouchCancel={isActive ? handleTouchCancel : undefined}
      {...props}
    >
      {children}
    </div>
  )
}
