'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker and handles update detection.
 * This component should be mounted once at the app root level.
 * Update notifications are handled by PWAUpdatePrompt component.
 * 
 * In development (localhost), service workers are only enabled if
 * NEXT_PUBLIC_ENABLE_SW_DEV environment variable is set to 'true'.
 * In production, service workers are always enabled.
 */
export function RegisterServiceWorker() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return
        }

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
            console.log('[PWA] Service Worker disabled in development. Set NEXT_PUBLIC_ENABLE_SW_DEV=true to enable.')

            // Unregister any existing service workers and clear caches
            const unregisterServiceWorkers = async () => {
                try {
                    const registrations = await navigator.serviceWorker.getRegistrations()
                    for (const registration of registrations) {
                        const unregistered = await registration.unregister()
                        if (unregistered) {
                            console.log('[PWA] Unregistered existing service worker:', registration.scope)
                        }
                    }

                    // Clear all caches
                    const cacheNames = await caches.keys()
                    await Promise.all(
                        cacheNames.map((cacheName) => {
                            console.log('[PWA] Clearing cache:', cacheName)
                            return caches.delete(cacheName)
                        })
                    )
                    console.log('[PWA] All service workers unregistered and caches cleared.')
                } catch (error) {
                    console.error('[PWA] Error unregistering service workers:', error)
                }
            }

            unregisterServiceWorkers()
            return
        }

        let registration: ServiceWorkerRegistration | null = null

        const registerServiceWorker = async () => {
            try {
                registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                })

                console.log('[PWA] Service Worker registered:', registration)

                // Check for updates every 60 seconds
                setInterval(() => {
                    if (registration) {
                        registration.update().catch((error) => {
                            console.error('[PWA] Error checking for updates:', error)
                        })
                    }
                }, 60000)

                // Listen for new service worker versions
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration?.installing
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available - PWAUpdatePrompt will detect this
                                console.log('[PWA] New service worker available')
                            }
                        })
                    }
                })
            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error)
            }
        }

        // Register service worker
        registerServiceWorker()

        // Reload when new service worker takes control
        const handleControllerChange = () => {
            window.location.reload()
        }

        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

        return () => {
            navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
        }
    }, [])

    return null
}

