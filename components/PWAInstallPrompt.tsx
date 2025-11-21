'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Download, CheckCircle2 } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type PWAInstallPromptProps = {
  /**
   * When true, shows an installed hint when the app is already installed.
   * When false or undefined, renders nothing when installed (default).
   */
  showInstalledHint?: boolean
}

/**
 * PWAInstallPrompt Component
 * 
 * Displays an install button when the Progressive Web App can be installed.
 * 
 * Purpose:
 * - Detects when the PWA meets installation criteria (via beforeinstallprompt event)
 * - Provides a user-friendly install button in the UI
 * - Handles the installation flow and user choice
 * - Optionally shows an installed hint when the app is already installed
 * 
 * Behavior:
 * - Listens for the `beforeinstallprompt` event to detect installability
 * - Checks if app is already installed via `display-mode: standalone` media query
 * - Shows install button when installable and not already installed
 * - Shows installed hint when app is already installed and `showInstalledHint` is true
 * - Renders nothing when installed by default (unless `showInstalledHint` is true)
 * - Periodically checks installation status
 * - Cleans up event listeners on unmount
 * 
 * Usage:
 * - Place in the sidebar or navigation area
 * - Automatically shows/hides based on installation state
 * - Uses translations from the 'PWA' namespace for button text
 * - Pass `showInstalledHint={true}` to display a hint when installed
 * 
 * Constraints:
 * - Must be a client component (uses browser APIs)
 * - Only works in browsers that support PWA installation
 * - Requires proper PWA manifest and service worker setup
 */
export function PWAInstallPrompt({ showInstalledHint = false }: PWAInstallPromptProps = {}) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia('(display-mode: standalone)').matches
  })
  const t = useTranslations('PWA')

  useEffect(() => {
    if (typeof window === 'undefined' || isInstalled) {
      return
    }

    // Check if app was installed via beforeinstallprompt
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        setInstallPrompt(null)
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', checkInstalled)

    // Check periodically if installed
    const interval = setInterval(checkInstalled, 1000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', checkInstalled)
      clearInterval(interval)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!installPrompt) {
      return
    }

    try {
      await installPrompt.prompt()
      const choiceResult = await installPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true)
        setInstallPrompt(null)
      }
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  // Show installed hint if app is already installed and showInstalledHint is true
  if (isInstalled) {
    if (showInstalledHint) {
      return (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>{t('appInstalled')}</AlertTitle>
        </Alert>
      )
    }
    return null
  }

  // Don't show if no prompt available
  if (!installPrompt) {
    return null
  }

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="w-full justify-start gap-2"
    >
      <Download className="h-4 w-4" />
      {t('installApp')}
    </Button>
  )
}

