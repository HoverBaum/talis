import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'
import withPWA from '@ducanh2912/next-pwa'
import { readFileSync } from 'fs'
import { join } from 'path'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Read version from package.json
const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf8')
)

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  // Add markdown plugins here, as desired
})

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    skipWaiting: false, // Allow manual control via update prompt
    disableDevLogs: true,
    runtimeCaching: [
      {
        // Cache navigation requests (HTML pages) with NetworkFirst strategy
        // This ensures pages work offline if they've been visited before
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          networkTimeoutSeconds: 3, // Fall back to cache after 3 seconds
        },
      },
      {
        // Cache static assets (JS, CSS) with CacheFirst strategy
        urlPattern: ({ request }) =>
          request.destination === 'script' || request.destination === 'style',
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
      {
        // Cache fonts with CacheFirst strategy
        urlPattern: ({ request }) => request.destination === 'font',
        handler: 'CacheFirst',
        options: {
          cacheName: 'fonts-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
      {
        // Cache images with CacheFirst strategy
        urlPattern: ({ request }) => request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        // Cache other static assets (manifests, etc.) with StaleWhileRevalidate
        urlPattern: ({ url }) =>
          url.pathname.endsWith('.json') || url.pathname.endsWith('.webmanifest'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-resources-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
        },
      },
    ],
  },
  fallbacks: {
    document: '/_offline',
  },
})

// Wrap MDX, PWA, and Next.js config with each other
export default withNextIntl(withMDX(pwaConfig(nextConfig)))
