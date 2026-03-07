# State Management (Zustand)

These guidelines apply to all developers and AI agents contributing to **Talis**, a Next.js app for Pen-and-Paper dice rollers.

* Each roller has its **own Zustand store slice**, scoped and typed for that roller.
* State for each roller is **persisted** (e.g. last used settings and results if desired).
* Stores must use the centrally provided `createStoreMiddleware` from `utils/store-utils.ts`.
* Store files should live close to their roller, for example:

  * `app/[locale]/dice/[rollerName]/[rollerName]-store.ts` (e.g. `coin-store.ts`, `shadowrun-store.ts`)

* **Cache clearing:** Operations like ClearCacheButton use `STORAGE_PREFIX` from `utils/store-utils.ts` and clear all localStorage keys that start with that prefix (all persisted roller stores use it).

* When adding new state:

  * Make sure it is serializable and safe to persist.
  * Document any performance / UX constraints in the component description block or store comments.
