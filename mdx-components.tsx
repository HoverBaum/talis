import type { MDXComponents } from 'mdx/types'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'

const components: MDXComponents = {
  PWAInstallPrompt,
}

export function useMDXComponents(): MDXComponents {
  return components
}
