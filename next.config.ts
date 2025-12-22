import { withPostHogConfig } from '@posthog/nextjs-config'
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'
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
  // Disable image optimization for offline functionality
  images: {
    unoptimized: true,
  },
  // PostHog rewrites
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ]
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  // Add markdown plugins here, as desired
})

let config: NextConfig = withNextIntl(withMDX(nextConfig))

// Only apply PostHog config in production (not during `next dev`)
if (process.env.NODE_ENV === 'production') {
  config = withPostHogConfig(config, {
    personalApiKey: 'phx_bfbkRalWjWTZzqQ3VHaMWNlFT8Vdwp5hkEISilOHH0LPep7', // Your personal API key from PostHog settings
    envId: '108492', // Your environment ID (project ID)
    host: 'https://eu.i.posthog.com', // Optional: Your PostHog instance URL, defaults to https://us.posthog.com
    sourcemaps: {
      // Optional
      enabled: true, // Optional: Enable sourcemaps generation and upload, defaults to true on production builds
      deleteAfterUpload: true, // Optional: Delete sourcemaps after upload, defaults to true
    },
  })
}

export default config
