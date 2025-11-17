import { i18n } from './i18n/config'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function getLocale(request: NextRequest): string {
  // Check if there's a locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Extract locale from pathname
    const segments = pathname.split('/').filter(Boolean)
    return segments[0] || i18n.defaultLocale
  }

  // Try to get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Simple locale detection - check if German is preferred
    if (acceptLanguage.includes('de')) {
      return 'de'
    }
  }

  // Check referer for locale
  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      const refererPath = refererUrl.pathname
      const refererLocale = i18n.locales.find((locale) =>
        refererPath.startsWith(`/${locale}`)
      )
      if (refererLocale) {
        return refererLocale
      }
    } catch {
      // Ignore invalid referer URLs
    }
  }

  return i18n.defaultLocale
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const locale = getLocale(request)

  // Check if pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If no locale in pathname, redirect to add locale
  if (!pathnameHasLocale) {
    const newUrl = new URL(request.url)
    newUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(newUrl)
  }

  // If locale is in pathname, continue
  return NextResponse.next()
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|en)/:path*']
}

