# Internationalization (i18n)

These guidelines apply to all developers and AI agents contributing to **Talis**, a Next.js app for Pen-and-Paper dice rollers.

* The app uses **next-intl** with locale segment `[locale]` and message files **`i18n/en.json`** and **`i18n/de.json`**.
* The app supports **German** and **English**.
* User-facing strings should be obtained from the i18n layer whenever possible, not hard-coded:
  * **Client components:** `useTranslations('Namespace')` from `next-intl`
  * **Server components:** `getTranslations('Namespace')` from `next-intl/server`
* When adding new text:

  * Add keys under the appropriate namespace in both `i18n/en.json` and `i18n/de.json`.
  * Provide both `en` and `de` translations.
  * Use clear, context-rich keys (e.g. `Theme.mode.light`, not `light`).

**Exception:** The offline page (`app/_offline/page.tsx`) uses in-component strings that mirror the same keys as the "Offline" namespace. This route lives outside `app/[locale]/`, so it does not use the locale layout and `NextIntlClientProvider`.

**Current implementation note:** `app/[locale]/pages/about/page.tsx` still contains hard-coded page title strings (`About` / `Über`) and metadata title (`About - Talis`). Prefer moving these to i18n when touching that page.
