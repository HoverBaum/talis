# Tech Stack

These guidelines apply to all developers and AI agents contributing to **Talis**, a Next.js app for Pen-and-Paper dice rollers.

## Tech Stack

* **Framework:** Next.js (App Router with `app/`)
* **Styling:** Tailwind CSS v4
* **UI Library:** shadcn/ui
* **State Management:** Zustand (roller stores use shared middleware + persistence; settings store is persisted separately)
* **Content:** MDX is used for changelog pages and locale-specific about content (`about.en.mdx`, `about.de.mdx`) under `app/[locale]/pages/`
* **PWA:** Manual service worker (`public/sw.js`) and registration via `RegisterServiceWorker` from `app/register-sw.tsx`; see [docs/pwa.md](pwa.md) for details
* **i18n:** next-intl (locale segment `[locale]`, messages in `i18n/en.json`, `i18n/de.json`)
* **ID Generation:** nanoid - Use `nanoid()` directly for all dynamically generated unique identifiers (e.g., roll result IDs, custom coin IDs, quick button IDs)
* **Analytics/Telemetry:** PostHog config is applied in production builds via `@posthog/nextjs-config` in `next.config.ts`

## shadcn/ui Components

* **NEVER modify files in `components/ui/**`** - These are shadcn/ui components and should remain unchanged.
* If customization is needed, create wrapper components or use composition patterns instead of modifying the base components.
* **ALWAYS use shadcn/ui components** - Never use browser UI components like `confirm()`, `alert()`, `prompt()`, etc. Use shadcn/ui Dialog, Alert, or other appropriate components instead.

> When generating code (by hand or via AI), always assume this stack and follow the conventions in the other rule files.
