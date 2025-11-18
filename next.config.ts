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
  },
  fallbacks: {
    document: '/_offline',
  },
})

// Wrap MDX, PWA, and Next.js config with each other
export default withNextIntl(withMDX(pwaConfig(nextConfig)))
