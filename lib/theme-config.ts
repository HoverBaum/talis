'use client'

import { useMemo } from 'react'
import type { Theme } from '@/components/ThemeProvider'
import { useTheme } from '@/components/ThemeProvider'
import talisLogo from '@/public/talis-dice.png'
import spmLogo from '@/public/spm-logo.png'

export type ThemeBranding = {
  logo: typeof talisLogo | typeof spmLogo
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
  nature: defaultBranding,
  spm: {
    logo: spmLogo,
    brandName: 'SPM',
  },
}

/**
 * Get branding configuration for a specific theme.
 * Falls back to default Talis branding if theme not found.
 */
export function getThemeBranding(theme: Theme): ThemeBranding {
  return themeBranding[theme] ?? defaultBranding
}

/**
 * Hook to get the current theme's branding configuration.
 * Uses mounted state to prevent hydration mismatches.
 */
export function useThemeBranding(): ThemeBranding {
  const { theme } = useTheme()

  return useMemo(() => {
    return themeBranding[theme] ?? defaultBranding
  }, [theme])
}

