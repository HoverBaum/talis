'use client'

/**
 * ThemeProvider synchronizes the chosen color mode/theme across the app.
 * Reads from `localStorage` on the client only and updates `data-mode` /
 * `data-theme` attributes so global styles react without runtime class churn.
 * Assumes only the current `talis-mode` / `talis-theme` keys exist; legacy keys
 * are intentionally ignored.
 */
import { createContext, useContext, useEffect, useState } from 'react'

export type Mode = 'system' | 'light' | 'dark'
export type Theme = 'default' | 'shadowrun' | 'nature' | 'spm'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultMode?: Mode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  mode: Mode
  theme: Theme
  setMode: (mode: Mode) => void
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  mode: 'system',
  theme: 'default',
  setMode: () => null,
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultMode = 'system',
  defaultTheme = 'default',
  ...props
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window === 'undefined') return defaultMode

    const storedMode = localStorage.getItem('talis-mode') as Mode | null
    return storedMode || defaultMode
  })

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme

    const storedTheme = localStorage.getItem('talis-theme') as Theme | null
    return storedTheme || defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement

    // Remove old class-based approach
    root.classList.remove('light', 'dark')

    const updateTheme = () => {
      // Determine actual mode (resolve 'system' to light/dark)
      let actualMode: 'light' | 'dark'
      if (mode === 'system') {
        actualMode = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      } else {
        actualMode = mode
      }

      // Apply data attributes
      root.setAttribute('data-theme', theme)
      root.setAttribute('data-mode', actualMode)
    }

    updateTheme()

    // Listen for system preference changes when mode is 'system'
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        const actualMode = mediaQuery.matches ? 'dark' : 'light'
        root.setAttribute('data-mode', actualMode)
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
  }, [mode, theme])

  const value = {
    mode,
    theme,
    setMode: (newMode: Mode) => {
      localStorage.setItem('talis-mode', newMode)
      setModeState(newMode)
    },
    setTheme: (newTheme: Theme) => {
      localStorage.setItem('talis-theme', newTheme)
      setThemeState(newTheme)
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

