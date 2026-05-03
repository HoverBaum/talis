export const MODE_STORAGE_KEY = 'talis-mode'
export const THEME_STORAGE_KEY = 'talis-theme'
export const SYSTEM_MODE_QUERY = '(prefers-color-scheme: dark)'

export const MODES = ['system', 'light', 'dark'] as const
export const RESOLVED_MODES = ['light', 'dark'] as const
export const THEMES = [
  'default',
  'shadowrun',
  'nature',
  'spm',
  'brutalism',
] as const

export type Mode = (typeof MODES)[number]
export type ResolvedMode = (typeof RESOLVED_MODES)[number]
export type Theme = (typeof THEMES)[number]

export const DEFAULT_MODE: Mode = 'system'
export const DEFAULT_THEME: Theme = 'default'

export const isMode = (value: string | null): value is Mode => {
  return value !== null && MODES.includes(value as Mode)
}

export const isTheme = (value: string | null): value is Theme => {
  return value !== null && THEMES.includes(value as Theme)
}

export const parseMode = (value: string | null): Mode => {
  return isMode(value) ? value : DEFAULT_MODE
}

export const parseTheme = (value: string | null): Theme => {
  return isTheme(value) ? value : DEFAULT_THEME
}

export const getSystemMode = (): ResolvedMode => {
  return window.matchMedia(SYSTEM_MODE_QUERY).matches ? 'dark' : 'light'
}

export const resolveMode = (
  mode: Mode,
  systemMode: ResolvedMode
): ResolvedMode => {
  return mode === 'system' ? systemMode : mode
}

export const applyThemeAttributes = (
  theme: Theme,
  mode: ResolvedMode,
  target: HTMLElement = document.documentElement
) => {
  target.setAttribute('data-theme', theme)
  target.setAttribute('data-mode', mode)
}
