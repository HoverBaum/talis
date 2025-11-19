'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker and handles update detection.
 * This component should be mounted once at the app root level.
 * Update notifications are handled by PWAUpdatePrompt component.
 */
export function RegisterServiceWorker() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return
        }

        // Check if we should register the service worker
        // In Next.js, NODE_ENV is replaced at build time
        const isDevelopment = process.env.NODE_ENV === 'development'
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

        // Register in production, or in development when:
        // 1. Explicitly enabled via NEXT_PUBLIC_ENABLE_SW=true, OR
        // 2. Running on localhost (for testing with https)
        const shouldRegister = !isDevelopment || process.env.NEXT_PUBLIC_ENABLE_SW === 'true' || isLocalhost

        if (!shouldRegister) {
            console.log('[PWA] Service Worker registration skipped in development mode')
            console.log('[PWA] Set NEXT_PUBLIC_ENABLE_SW=true to enable in development')
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

