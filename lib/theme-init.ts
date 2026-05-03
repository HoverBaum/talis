/**
 * Blocking script that initializes theme attributes before React hydration.
 * This prevents the white flash during page navigation, especially in PWA mode.
 * Runs synchronously before any rendering occurs.
 */
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  MODES,
  MODE_STORAGE_KEY,
  SYSTEM_MODE_QUERY,
  THEMES,
  THEME_STORAGE_KEY,
} from './theme-system'

export const themeInitScript = `
  (function() {
    try {
      const modes = ${JSON.stringify(MODES)};
      const themes = ${JSON.stringify(THEMES)};
      const rawMode = localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)});
      const rawTheme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
      const storedMode = modes.includes(rawMode) ? rawMode : ${JSON.stringify(DEFAULT_MODE)};
      const storedTheme = themes.includes(rawTheme) ? rawTheme : ${JSON.stringify(DEFAULT_THEME)};
      
      let resolvedMode = storedMode;
      if (storedMode === ${JSON.stringify(DEFAULT_MODE)}) {
        resolvedMode = window.matchMedia(${JSON.stringify(SYSTEM_MODE_QUERY)}).matches ? 'dark' : 'light';
      }
      
      document.documentElement.setAttribute('data-theme', storedTheme);
      document.documentElement.setAttribute('data-mode', resolvedMode);
    } catch (e) {
      // Fallback to defaults if localStorage is unavailable
      document.documentElement.setAttribute('data-theme', ${JSON.stringify(DEFAULT_THEME)});
      document.documentElement.setAttribute('data-mode', 'light');
    }
  })();
`
