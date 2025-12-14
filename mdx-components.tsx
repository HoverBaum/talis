import type { MDXComponents } from 'mdx/types'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { ClearCacheButton } from '@/components/ClearCacheButton'

const components: MDXComponents = {
  PWAInstallPrompt,
  ClearCacheButton,
}

export function useMDXComponents(): MDXComponents {
  return components
}
