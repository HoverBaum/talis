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
 */

import * as React from 'react'
import { createPortal } from 'react-dom'

import { useIsMobile } from '@/utils/use-mobile'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const SWIPE_THRESHOLD_PX = 80
const SIDEBAR_WIDTH_MOBILE = '18rem'

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
      if (!isActive) return
      const touch = e.touches[0]
      if (touch) {
        touchStartRef.current = { x: touch.clientX, y: touch.clientY }
      }
    },
    [isActive]
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
