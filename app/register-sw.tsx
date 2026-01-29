'use client'

/**
 * Registers the service worker and handles update detection for the PWA.
 *
 * Purpose: enable offline caching and update signals on app load.
 * Performance: runs once at startup; avoids work when disabled.
 * Accessibility: no direct UI impact.
 * Constraints: requires browser Service Worker APIs.
 * Usage: mount once near the app root.
 */
import { useEffect } from 'react'

const UPDATE_INTERVAL_MS = 60_000

export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const logPrefix = '[PWA]'
    // Detect if we're in development mode (localhost)
    const isDevelopment =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '[::1]'

    // Check if service workers should be enabled
    const shouldEnableSW = isDevelopment
      ? process.env.NEXT_PUBLIC_ENABLE_SW_DEV === 'true'
      : true // Always enable in production

    if (!shouldEnableSW) {
      console.log(
        `${logPrefix} Service Worker disabled in development. Set NEXT_PUBLIC_ENABLE_SW_DEV=true to enable.`
      )

      // Unregister any existing service workers and clear caches
      const unregisterServiceWorkers = async () => {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations()
          for (const registration of registrations) {
            const unregistered = await registration.unregister()
            if (unregistered) {
              console.log(
                `${logPrefix} Unregistered existing service worker:`,
                registration.scope
              )
            }
          }

          // Clear all caches
          const cacheNames = await caches.keys()
          await Promise.all(
            cacheNames.map((cacheName) => {
              console.log(`${logPrefix} Clearing cache:`, cacheName)
              return caches.delete(cacheName)
            })
          )
          console.log(
            `${logPrefix} All service workers unregistered and caches cleared.`
          )
        } catch (error) {
          console.error(`${logPrefix} Error unregistering service workers:`, error)
        }
      }

      void unregisterServiceWorkers()
      return
    }

    let registration: ServiceWorkerRegistration | null = null
    let updateInterval: ReturnType<typeof window.setInterval> | null = null
    let updateFoundHandler: (() => void) | null = null

    const registerServiceWorker = async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        console.log(`${logPrefix} Service Worker registered:`, registration)

        // Check for updates every 60 seconds
        updateInterval = window.setInterval(() => {
          if (registration) {
            registration.update().catch((error) => {
              console.error(`${logPrefix} Error checking for updates:`, error)
            })
          }
        }, UPDATE_INTERVAL_MS)

        // Listen for new service worker versions
        updateFoundHandler = () => {
          const newWorker = registration?.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available - PWAUpdatePrompt will detect this
                console.log(`${logPrefix} New service worker available`)
              }
            })
          }
        }

        registration.addEventListener('updatefound', updateFoundHandler)
      } catch (error) {
        console.error(`${logPrefix} Service Worker registration failed:`, error)
      }
    }

    // Register service worker
    void registerServiceWorker()

    // Reload when new service worker takes control
    const handleControllerChange = () => {
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      handleControllerChange
    )

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        handleControllerChange
      )
      if (updateInterval) {
        window.clearInterval(updateInterval)
      }
      if (registration && updateFoundHandler) {
        registration.removeEventListener('updatefound', updateFoundHandler)
      }
    }
  }, [])

  return null
}

