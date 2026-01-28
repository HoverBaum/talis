'use client'

/**
 * ThemeProvider synchronizes the chosen color mode/theme across the app.
 * Reads from `localStorage` on the client only and updates `data-mode` /
 * `data-theme` attributes so global styles react without runtime class churn.
 * Exposes `systemMode` and `resolvedMode` so pickers can preview consistently
 * without setting up their own matchMedia listeners.
 * Assumes only the current `talis-mode` / `talis-theme` keys exist; legacy keys
 * are intentionally ignored.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Mode = 'system' | 'light' | 'dark'
export type Theme = 'default' | 'shadowrun' | 'nature' | 'spm'
export type ResolvedMode = 'light' | 'dark'

export const THEMES: Theme[] = ['default', 'shadowrun', 'nature', 'spm']

type ThemeProviderProps = {
  children: ReactNode
  defaultMode?: Mode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  mode: Mode
  theme: Theme
  systemMode: ResolvedMode
  resolvedMode: ResolvedMode
  setMode: (mode: Mode) => void
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  mode: 'system',
  theme: 'default',
  systemMode: 'light',
  resolvedMode: 'light',
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

  const [systemMode, setSystemMode] = useState<ResolvedMode>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateMode = () => {
      setSystemMode(mediaQuery.matches ? 'dark' : 'light')
    }

    updateMode()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMode)
      return () => mediaQuery.removeEventListener('change', updateMode)
    } else {
      mediaQuery.addListener(updateMode)
      return () => mediaQuery.removeListener(updateMode)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = window.document.documentElement

    // Remove old class-based approach
    root.classList.remove('light', 'dark')

    const resolvedMode = mode === 'system' ? systemMode : mode
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-mode', resolvedMode)
  }, [mode, theme, systemMode])

  const resolvedMode: ResolvedMode = mode === 'system' ? systemMode : mode
  const value = {
    mode,
    theme,
    systemMode,
    resolvedMode,
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

