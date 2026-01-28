/**
 * Blocking script that initializes theme attributes before React hydration.
 * This prevents the white flash during page navigation, especially in PWA mode.
 * Runs synchronously before any rendering occurs.
 */
export const themeInitScript = `
  (function() {
    try {
      const storedMode = localStorage.getItem('talis-mode') || 'system';
      const storedTheme = localStorage.getItem('talis-theme') || 'default';
      
      let resolvedMode = storedMode;
      if (storedMode === 'system') {
        resolvedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      document.documentElement.setAttribute('data-theme', storedTheme);
      document.documentElement.setAttribute('data-mode', resolvedMode);
    } catch (e) {
      // Fallback to defaults if localStorage is unavailable
      document.documentElement.setAttribute('data-theme', 'default');
      document.documentElement.setAttribute('data-mode', 'light');
    }
  })();
`
