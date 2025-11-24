'use client'

import { useMemo, useEffect, useState } from 'react'
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
const themeBranding: Record<Exclude<Theme, 'system'>, ThemeBranding> = {
  light: defaultBranding,
  dark: defaultBranding,
  shadowrun: defaultBranding,
  nature: defaultBranding,
  'spm-dark': {
    logo: spmLogo,
    brandName: 'SPM',
  },
}

/**
 * Get branding configuration for a specific theme.
 * Falls back to default Talis branding if theme not found.
 */
export function getThemeBranding(theme: Theme): ThemeBranding {
  if (theme === 'system') {
    // For 'system' theme, resolve to actual theme based on OS preference
    if (typeof window !== 'undefined') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      return themeBranding[systemTheme] ?? defaultBranding
    }
    // Server-side fallback to light theme
    return themeBranding.light ?? defaultBranding
  }

  return themeBranding[theme] ?? defaultBranding
}

/**
 * Hook to get the current theme's branding configuration.
 * Automatically handles 'system' theme resolution and responds to OS preference changes.
 * Uses mounted state to prevent hydration mismatches.
 */
export function useThemeBranding(): ThemeBranding {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  // Only access window after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const resolvedTheme = mediaQuery.matches ? 'dark' : 'light'
      setSystemTheme(resolvedTheme)

      const handleChange = () => {
        setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
      }

      // Use addEventListener for better browser support
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => {
          mediaQuery.removeEventListener('change', handleChange)
        }
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
        return () => {
          mediaQuery.removeListener(handleChange)
        }
      }
    }
  }, [theme])

  return useMemo(() => {
    // On server and initial client render, return default to prevent hydration mismatch
    if (!mounted) {
      return defaultBranding
    }

    if (theme === 'system') {
      return themeBranding[systemTheme] ?? defaultBranding
    }

    return themeBranding[theme] ?? defaultBranding
  }, [theme, systemTheme, mounted])
}

