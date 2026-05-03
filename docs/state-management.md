# State Management (Zustand)

These guidelines apply to all developers and AI agents contributing to **Talis**, a Next.js app for Pen-and-Paper dice rollers.

* Each roller has its **own Zustand store**, scoped and typed for that roller.
* State for each roller is **persisted** (e.g. last used settings and results if desired).
* Roller stores should use the centrally provided `createStoreMiddleware` from `utils/store-utils.ts`.
* The settings store at `app/[locale]/pages/settings/settings-store.ts` currently uses `persist`/`devtools` directly with storage key `talis-settings` (without `STORAGE_PREFIX`).
* Store files should live close to their roller, for example:

  * `app/[locale]/dice/[rollerName]/[rollerName]-store.ts` (e.g. `coin-store.ts`, `shadowrun-store.ts`)

* **Cache clearing (localStorage):** `ClearCacheButton` uses `STORAGE_PREFIX` from `utils/store-utils.ts` and clears all localStorage keys that start with that prefix (persisted roller stores created with `createStoreMiddleware` use it).
* `ClearCacheButton` intentionally does **not** clear `talis-settings`, `talis-theme`, or `talis-mode`.
* Service worker cache storage is separate from Zustand localStorage persistence.

* When adding new state:

  * Make sure it is serializable and safe to persist.
  * Document any performance / UX constraints in the component description block or store comments.
* Use `useHasHydrated(store)` from `hooks/useStoreHydration.ts` where hydration timing matters for persisted stores.
