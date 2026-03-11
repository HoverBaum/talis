import { notFound } from 'next/navigation'

/**
 * Catch-all route within the [locale] segment.
 *
 * Any path under /[locale]/ that doesn't match a real route lands here.
 * Calling notFound() programmatically causes Next.js to render the closest
 * not-found.tsx (app/[locale]/not-found.tsx) wrapped inside the locale layout,
 * which gives the page full access to ThemeProvider and next-intl.
 */
export default function CatchAllNotFound() {
  notFound()
}
