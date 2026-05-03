# Project Structure & Routing

These guidelines apply to all developers and AI agents contributing to **Talis**, a Next.js app for Pen-and-Paper dice rollers.

## App Router (`app/`)

We follow the **App Router** approach:

* Each folder in `app/` represents a route.
* If a folder exists purely for organization and **must not** become a route, its name **must start with `_`**.

  * Example: `app/(marketing)/_components/`

Note: Organizational folders in routes **should** be avoided as long as feasible.

## Locale Segment

* All app routes (except root redirect and offline) live under `app/[locale]/`.
* Root `app/page.tsx` redirects to `/{defaultLocale}`.

## Dice Rollers

* All dice rollers live under:
  `app/[locale]/dice/[rollerName]/`
  (e.g. `app/[locale]/dice/coin/`, `app/[locale]/dice/shadowrun/`)
* Current rollers are defined in `lib/rollers.ts`: `shadowrun`, `d6`, `daggerheart`, `polyhedral`, `coin`.
* Each roller:

  * Has its **own persisted Zustand store** (store file: `[rollerName]-store.ts`, e.g. `coin-store.ts`, `shadowrun-store.ts`).
  * Has a **config page** to configure it.

## Static pages (`app/[locale]/pages/`)

* App pages live under `app/[locale]/pages/` (currently `about`, `changelog`, `settings`, and `themes`).
* `themes` exists as a dedicated showcase route (`/pages/themes`) but is currently not part of `lib/nav.ts` sidebar navigation.

## Shared vs Route-Local Code

* **Route-local components/hooks**
  Components, stores and hooks used **only by one route** live directly in that route's folder (or its `_`-prefixed subfolders).

  * Example: `app/[locale]/dice/coin/CoinRoller.tsx` or `app/[locale]/dice/shadowrun/ShadowrunRoller.tsx`

* **Shared components**
  Components reused across multiple routes live in:
  `components/`

* **Shared hooks**
  Hooks reused across multiple routes live in:
  `hooks/`

## PWA Files

* **Offline fallback page:** `app/_offline/page.tsx` - Shown when user is offline and page isn't cached. Lives outside `[locale]` so the service worker can serve it without Next.js i18n.
* **PWA components:**
  * `app/register-sw.tsx` (`RegisterServiceWorker`) - Registers service worker and checks for updates
  * `components/PWAUpdatePrompt.tsx` - Detects and notifies about available service worker updates
  * `components/PWAInstallPrompt.tsx` - Shows install button when app is installable (used in sidebar and available in MDX content)
* **PWA assets:**
  * `public/manifest.json` - Web app manifest
  * `public/icons/` - PWA icons (192x192, 512x512)
* **Service worker:** Manual implementation in `public/sw.js`
