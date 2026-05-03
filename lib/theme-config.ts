'use client'

import { useTheme } from '@/components/ThemeProvider'
import type { Theme } from '@/lib/theme-system'
import talisLogo from '@/public/talis-dice.png'
import spmLogo from '@/public/spm-logo.png'
import talisNatureLogo from '@/public/talis-nature.png'
import talisBrutalLogo from '@/public/talis-brutal.png'

export type ThemeBranding = {
  logo: typeof talisLogo | typeof spmLogo | typeof talisNatureLogo
  brandName: string
}

// Default Talis branding
const defaultBranding: ThemeBranding = {
  logo: talisLogo,
  brandName: 'Talis',
}

// Theme-specific branding configuration
const themeBranding: Record<Theme, ThemeBranding> = {
  default: defaultBranding,
  shadowrun: defaultBranding,
  nature: { ...defaultBranding, logo: talisNatureLogo },
  spm: {
    ...defaultBranding,
    logo: spmLogo,
    brandName: 'SPM',
  },
  brutalism: {
    ...defaultBranding,
    logo: talisBrutalLogo,
  },
}

/**
 * Get branding configuration for a specific theme.
 * Theme keys are validated by `theme-system`, so this lookup is exhaustive.
 */
export function getThemeBranding(theme: Theme): ThemeBranding {
  return themeBranding[theme]
}

/**
 * Hook to get the current theme's branding configuration.
 * Uses mounted state to prevent hydration mismatches.
 */
export function useThemeBranding(): ThemeBranding {
  const { theme } = useTheme()
  return themeBranding[theme]
}
