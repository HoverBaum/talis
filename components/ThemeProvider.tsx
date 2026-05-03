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
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applyThemeAttributes,
  DEFAULT_MODE,
  DEFAULT_THEME,
  getSystemMode,
  MODE_STORAGE_KEY,
  parseMode,
  parseTheme,
  resolveMode,
  SYSTEM_MODE_QUERY,
  THEMES,
  THEME_STORAGE_KEY,
  type Mode,
  type ResolvedMode,
  type Theme,
} from '@/lib/theme-system'

export { THEMES, type Mode, type ResolvedMode, type Theme } from '@/lib/theme-system'

type ThemeProviderProps = {
  children: ReactNode
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
  mode: DEFAULT_MODE,
  theme: DEFAULT_THEME,
  systemMode: 'light',
  resolvedMode: 'light',
  setMode: () => null,
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState | null>(null)

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window === 'undefined') return DEFAULT_MODE
    return parseMode(localStorage.getItem(MODE_STORAGE_KEY))
  })

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME
    return parseTheme(localStorage.getItem(THEME_STORAGE_KEY))
  })

  const [systemMode, setSystemMode] = useState<ResolvedMode>(() => {
    if (typeof window === 'undefined') return 'light'
    return getSystemMode()
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_MODE_QUERY)
    const updateMode = () => {
      setSystemMode(getSystemMode())
    }

    updateMode()
    mediaQuery.addEventListener('change', updateMode)
    return () => mediaQuery.removeEventListener('change', updateMode)
  }, [])

  const resolvedMode = resolveMode(mode, systemMode)

  useEffect(() => {
    applyThemeAttributes(theme, resolvedMode)
  }, [theme, resolvedMode])

  const value = useMemo<ThemeProviderState>(
    () => ({
      mode,
      theme,
      systemMode,
      resolvedMode,
      setMode: (newMode: Mode) => {
        localStorage.setItem(MODE_STORAGE_KEY, newMode)
        setModeState(newMode)
      },
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme)
        setThemeState(newTheme)
      },
    }),
    [mode, theme, systemMode, resolvedMode]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (!context)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
