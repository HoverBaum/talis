'use client'

export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent || ''
  const maxTouchPoints = navigator.maxTouchPoints || 0

  const isIOSByUA = /iPad|iPhone|iPod/.test(userAgent)
  const isIPadOSDesktopUA = /Macintosh/.test(userAgent) && maxTouchPoints > 1

  return isIOSByUA || isIPadOSDesktopUA
}
