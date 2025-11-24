'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'system' | 'light' | 'dark' | 'shadowrun' | 'synthwave' | 'nature'

// Extract all theme values except 'system' (which is not a CSS class)
type ThemeClass = Exclude<Theme, 'system'>

// Helper to create a const array from the Theme type
// This ensures all theme classes (except 'system') are included
const themeClasses: ThemeClass[] = ['light', 'dark', 'shadowrun', 'synthwave', 'nature'] as const

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'talis-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof window !== 'undefined' && (localStorage.getItem(storageKey) as Theme)) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(...themeClasses)

    const updateTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        root.classList.add(systemTheme)
        root.removeAttribute('data-theme')
      } else if (theme === 'light' || theme === 'dark') {
        root.classList.add(theme)
        root.removeAttribute('data-theme')
      } else {
        root.setAttribute('data-theme', theme)
      }
    }

    updateTheme()

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        root.classList.remove('light', 'dark')
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        root.classList.add(systemTheme)
        root.removeAttribute('data-theme')
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

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

