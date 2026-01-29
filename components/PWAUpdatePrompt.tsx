'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function PWAUpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const t = useTranslations('PWA')

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const handleServiceWorkerUpdate = () => {
      navigator.serviceWorker
        .getRegistration()
        .then((reg) => {
          if (!reg) return

          // Check if there's a waiting service worker
          if (reg.waiting) {
            setWaitingWorker(reg.waiting)
            setUpdateAvailable(true)
          }

          // Listen for updates (RegisterServiceWorker handles periodic checks)
          const handleUpdateFound = () => {
            const newWorker = reg.installing
            if (!newWorker) return

            const handleStateChange = () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // There's a new service worker waiting
                setWaitingWorker(newWorker)
                setUpdateAvailable(true)
              }
            }

            newWorker.addEventListener('statechange', handleStateChange)
          }

          reg.addEventListener('updatefound', handleUpdateFound)
        })
        .catch((error) => {
          console.error('[PWA] Service worker registration error:', error)
        })
    }

    // Wait for service worker to be ready
    if (navigator.serviceWorker.controller) {
      handleServiceWorkerUpdate()
    } else {
      navigator.serviceWorker.ready.then(() => {
        handleServiceWorkerUpdate()
      })
    }

    // Listen for controller change (when update is activated)
    const handleControllerChange = () => {
      // Reload the page to get the new version
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      // Send message to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      setUpdateAvailable(false)
      // The page will reload automatically via controllerchange event
    }
  }

  const handleDismiss = () => {
    setUpdateAvailable(false)
  }

  if (!updateAvailable) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-4 shadow-lg border-t">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium">{t('updateAvailable')}</p>
          <p className="text-sm opacity-90">{t('updateDescription')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpdate}
            variant="secondary"
            size="sm"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            {t('updateNow')}
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            aria-label={t('dismiss')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

