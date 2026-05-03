'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { i18n } from '@/i18n/config'

/**
 * Offline Page - Special Case for PWA Offline Support
 *
 * This page is served by the service worker when the app is offline and accessed outside
 * the normal routing. Because it exists outside the [locale] directory structure and needs
 * to work without the Next.js i18n infrastructure being available, translations are
 * hardcoded here rather than fetched from the i18n files.
 *
 * These translations mirror the keys in i18n/en.json and i18n/de.json under "Offline".
 */
const translations = {
  en: {
    title: "You're Offline",
    description:
      "It looks like you're not connected to the internet. Don't worry, Talis works offline! You can still use all the dice rollers you've already visited.",
    slowConnectionHint:
      "Your device is online, but the connection is currently too slow to load this page.",
    helpText:
      'To access new pages or features, please check your internet connection and try again.',
    goHome: 'Go to Home',
    retry: 'Try Again',
    retrying: 'Checking connection...',
  },
  de: {
    title: 'Du bist offline',
    description:
      'Es sieht so aus, als ob du nicht mit dem Internet verbunden bist. Keine Sorge, Talis funktioniert offline! Du kannst weiterhin alle Würfel-Apps verwenden, die du bereits besucht hast.',
    slowConnectionHint:
      'Dein Gerät ist online, aber die Verbindung ist derzeit zu langsam, um diese Seite zu laden.',
    helpText:
      'Um auf neue Seiten oder Funktionen zuzugreifen, überprüfe bitte deine Internetverbindung und versuche es erneut.',
    goHome: 'Zur Startseite',
    retry: 'Erneut versuchen',
    retrying: 'Verbindung wird geprüft...',
  },
} as const

function getInitialLocale(): 'en' | 'de' {
  if (typeof window === 'undefined') return i18n.defaultLocale as 'en' | 'de'

  // Detect locale from URL or browser settings
  const path = window.location.pathname
  const urlLocale = path.match(/^\/(en|de)/)
  if (urlLocale) {
    return urlLocale[1] as 'en' | 'de'
  } else if (navigator.language.startsWith('de')) {
    return 'de'
  }
  return i18n.defaultLocale as 'en' | 'de'
}

export default function OfflinePage() {
  const [locale] = useState<'en' | 'de'>(getInitialLocale)
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return navigator.onLine
  })
  const [isRetrying, setIsRetrying] = useState(false)
  const t = useMemo(() => translations[locale], [locale])

  const retryPage = useCallback(async () => {
    if (typeof window === 'undefined') {
      return
    }

    setIsRetrying(true)

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      controller.abort()
    }, 3500)

    try {
      const response = await fetch(`/${locale}/?retry=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          Accept: 'text/html',
        },
      })

      if (response.ok) {
        window.location.href = `/${locale}`
      }
    } catch {
      // Keep user on offline page when connection is still too slow/unavailable.
    } finally {
      window.clearTimeout(timeoutId)
      setIsRetrying(false)
    }
  }, [locale])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      void retryPage()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [retryPage])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
        <div className="space-y-2">
          {isOnline ? (
            <p className="text-sm text-muted-foreground">{t.slowConnectionHint}</p>
          ) : null}
          <p className="text-sm text-muted-foreground">{t.helpText}</p>
          <Button onClick={() => void retryPage()} disabled={isRetrying}>
            {isRetrying ? t.retrying : t.retry}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}`}>{t.goHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
