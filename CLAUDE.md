# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation

**Start here:** Read `docs/README.md` - it contains comprehensive developer guidelines that apply to all contributors (developers and AI assistants). The documentation explains:
- Project structure, routing, and file organization
- Tech stack and conventions
- State management, i18n, theming, PWA configuration
- React component patterns and commit message format
- When to read specific docs based on your task

The Cursor rule at `.cursor/rules/project-docs.mdc` already instructs to read `docs/README.md` first.

## Quick Start

```bash
npm i                                    # Install dependencies
npm run dev                              # Start dev server
npm run build                            # Build for production
npm run lint                             # Run ESLint
npm run format                           # Format with Prettier
npm run theme:check                      # Check theme contrast ratios
```

### PWA Development
Service workers are disabled in development by default (prevent caching). Enable with:
```bash
NEXT_PUBLIC_ENABLE_SW_DEV=true npm run dev
```

See `docs/pwa.md` for details.

## Architecture Overview

### Project Structure
- `/app/[locale]/` - All localized routes (en, de)
  - `/dice/[roller]/` - 5 dice rollers, each with own Zustand store
  - `/pages/` - Static pages (settings, about, themes, changelog)
- `/app/_offline/` - Offline fallback (outside locale segment)
- `/components/ui/` - shadcn/ui components (**DO NOT MODIFY**)
- `/docs/` - Developer documentation (**READ THIS**)
- `/i18n/` - Translation files (en.json, de.json)
- `/public/sw.js` - Service worker implementation

### Key Patterns

**State Management:** All stores use `createStoreMiddleware` from `utils/store-utils.ts` with localStorage persistence. See `docs/state-management.md`.

**Theming:** Two-dimensional system (mode + theme). Every theme MUST provide both light and dark variants with all 32 CSS variables. See `docs/theming.md`.

**i18n:** All user-facing text comes from `i18n/en.json` and `i18n/de.json`. See `docs/internationalization.md`.

**Components:** PascalCase files, named exports, arrow functions, description blocks. See `docs/react-components.md`.

**Commits:** Emoji-prefixed format (✨ features, 🐛 fixes, etc.). See `docs/commit-messages.md`.

### Provider Hierarchy
```
NextIntlClientProvider → ThemeProvider → PageTitleProvider → SidebarProvider → Content
```

Root layout includes blocking theme init script to prevent flash.

### Dice Roller Structure
Standard pattern for all rollers:
```
/app/[locale]/dice/{roller}/
├── page.tsx
├── {Roller}Roller.tsx
├── {Roller}ResultDisplay.tsx
├── {roller}-store.ts
└── config/
```

## Critical Rules

1. **Read `/docs` first** - All guidelines live there, not duplicated here
2. **Never modify `components/ui/**`** - These are shadcn/ui components
3. **All text must be i18n** - Add keys to both `i18n/en.json` and `i18n/de.json`
4. **Themes need 32 variables** - Light and dark variants required for every theme
5. **Update `/docs` when needed** - See `docs/maintenance.md` for when to update documentation

## Development Notes

- Service workers cache aggressively in production - increment version in `package.json` to invalidate
- Redux DevTools enabled in development for Zustand stores
- Use `useHasHydrated(store)` to prevent hydration mismatches with persistent stores
- Navigation structure defined in `lib/nav.ts`
- Use shadcn/ui dialogs, not browser `alert()`/`confirm()`/`prompt()`
