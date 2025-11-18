'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const t = useTranslations('PWA')

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
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
  }, [])

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

  // Don't show if already installed or no prompt available
  if (isInstalled || !installPrompt) {
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

