# PWA & Offline Support

These guidelines apply to all developers and AI agents contributing to **Talis**, a Next.js app for Pen-and-Paper dice rollers.

Talis is a **fully offline-capable Progressive Web App (PWA)**:

* **Service Worker:** Manually implemented service worker (`public/sw.js`)
* **Offline Functionality:** All dice rollers and features work without internet connection
* **Install Prompt:** Users can install the app via the sidebar install button (and optional install prompt usage in MDX)
* **Update Notifications:** Automatic detection and user notification when new versions are available
* **Version Display:** Current app version shown in sidebar footer
* **Offline Fallback:** Custom offline page at `app/_offline/page.tsx` for uncached routes

## Development vs Production

* **Development (`npm run dev`):** PWA features are **disabled by default** to prevent caching issues during development
  * Service workers only register if `NEXT_PUBLIC_ENABLE_SW_DEV=true` is set
  * When disabled, any existing service workers are automatically unregistered and caches are cleared
  * To enable service workers in dev for testing: `NEXT_PUBLIC_ENABLE_SW_DEV=true npm run dev`
* **Production (`npm run build && npm start`):** PWA features are **always enabled** - service worker registers automatically regardless of environment variables
* **Testing:**
  * For quick PWA testing in dev, use `NEXT_PUBLIC_ENABLE_SW_DEV=true npm run dev`
  * For full production testing, use `npm run build && npm start`

## PWA Configuration

* **Service Worker:** Manual implementation in `public/sw.js`
  * Network-first strategy for HTML/API routes
  * Cache-first strategy for static assets (CSS, JS, images, fonts)
  * Offline fallback for HTML requests uses cached `/_offline` when both network and route cache miss
* **Service Worker Registration:** `RegisterServiceWorker` in `app/register-sw.tsx` registers the service worker on app load
  * Development mode is detected by hostname (`localhost`, `127.0.0.1`, `[::1]`)
  * In dev: Only registers if `NEXT_PUBLIC_ENABLE_SW_DEV=true` is set
  * In production: Always registers regardless of environment variables
  * When disabled in dev: Automatically unregisters existing service workers and clears all caches
  * Polls `registration.update()` every 60 seconds
* **Update Detection:** `components/PWAUpdatePrompt.tsx` detects and notifies users of available updates
  * Uses `SKIP_WAITING` message to activate waiting workers
  * Service worker takeover triggers `controllerchange` reload logic
* **Manifest file:** `public/manifest.json`
* **Icons:** `public/icons/` (192x192 and 512x512 required)
* **Next.js Config:** `images.unoptimized: true` required for offline image support

## Cache name and app version

* `public/sw.js` uses a static `CACHE_NAME` string.
* Cache invalidation is **manual**: update `CACHE_NAME` when shipping versions that should invalidate old cached assets.
* App version UI uses `NEXT_PUBLIC_APP_VERSION` from `package.json` (`next.config.ts`), which is separate from the SW cache name.

## Environment Variables

* **`NEXT_PUBLIC_ENABLE_SW_DEV`:** Controls service worker registration in development mode
  * Set to `'true'` to enable service workers during local development
  * Only affects development hosts (`localhost`, `127.0.0.1`, `[::1]`) - production always enables service workers
  * When not set or set to any other value, service workers are disabled in dev
  * Example: `NEXT_PUBLIC_ENABLE_SW_DEV=true npm run dev`

## Service worker messages

`public/sw.js` currently handles:

* `SKIP_WAITING` - activates a waiting worker immediately
* `CLEAR_CACHE` - deletes all Cache Storage entries

`PWAUpdatePrompt` sends `SKIP_WAITING` when the user accepts an update. `CLEAR_CACHE` is implemented in the worker but is not currently triggered by app UI components.
