'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/Button'
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
    description: "It looks like you're not connected to the internet. Don't worry, Talis works offline! You can still use all the dice rollers you've already visited.",
    helpText: "To access new pages or features, please check your internet connection and try again.",
    goHome: "Go to Home"
  },
  de: {
    title: "Du bist offline",
    description: "Es sieht so aus, als ob du nicht mit dem Internet verbunden bist. Keine Sorge, Talis funktioniert offline! Du kannst weiterhin alle Würfel-Apps verwenden, die du bereits besucht hast.",
    helpText: "Um auf neue Seiten oder Funktionen zuzugreifen, überprüfe bitte deine Internetverbindung und versuche es erneut.",
    goHome: "Zur Startseite"
  }
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
  const t = useMemo(() => translations[locale], [locale])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">
          {t.description}
        </p>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t.helpText}
          </p>
          <Button asChild>
            <Link href={`/${locale}`}>{t.goHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

