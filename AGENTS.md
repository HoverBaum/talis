# Talis – Coding Guidelines

These guidelines apply to all developers and AI agents contributing to **Talis**, a Next.js app for Pen-and-Paper dice rollers.

## 1. Tech Stack

* **Framework:** Next.js (App Router with `app/`)
* **Styling:** Tailwind CSS v4
* **UI Library:** shadcn/ui
* **State Management:** Zustand (with persistence per roller)
* **Content:** MDX for docs/guides/changelogs under `pages/`

> When generating code (by hand or via AI), always assume this stack and follow the conventions below.

---

## 2. Project Structure & Routing

### 2.1 App Router (`app/`)

We follow the **App Router** approach:

* Each folder in `app/` represents a route.
* If a folder exists purely for organization and **must not** become a route, its name **must start with `_`**.

  * Example: `app/(marketing)/_components/`

Note: Organizational folders in routes **should** be avoided as long, as feasable.

### 2.2 Dice Rollers

* All dice rollers live under:
  `app/dice/[rollerName]/`
* Each roller:

  * Has its **own Zustand slice**, which is **persisted**.
  * Has a **config page** to configure it.

### 2.3 Shared vs Route-Local Code

* **Route-local components/hooks**
  Components and hooks used **only by one route** live directly in that route’s folder (or its `_`-prefixed subfolders).

  * Example: `app/dice/dnd/ResultList.tsx`

* **Shared components**
  Components reused across multiple routes live in:
  `components/`

* **Shared hooks**
  Hooks reused across multiple routes live in:
  `hooks/`

---

## 3. React Components

### 3.1 Naming & Files

* React component files **must** use **PascalCase**:

  * `DiceRoller.tsx`, `RollResultList.tsx`

* React components themselves are **PascalCase**.
* Use **named exports** for components:

  ```tsx
  // Good
  export const DiceRoller = () => { ... }
  ```

### 3.2 Function Style

* Prefer arrow functions.

### 3.3 Component Description Block

Each React component file **must** start with a description block. This description focuses especially on **non-functional requirements** and intended usage.

* Describe:

  * The purpose of the component.
  * Performance / accessibility considerations (e.g. “rendered in a list of 100 items”, “keyboard navigation required”).
  * Assumptions and constraints (e.g. “expects valid dice notation string”, “must be responsive down to 320px width”).
  * How it is intended to be used / composed.

* This block **must be kept up to date** whenever we learn new requirements or usage constraints.

---

## 4. HTML Semantics & Comments

We want clear structure and future-proof semantics:

* Non-semantic HTML tags (`div`, `span`, etc.) that represent a **meaningful UI concept** should have a **short comment** describing their semantic role.

  * Example: a visually styled divider:

    ```tsx
    {/* Horizontal divider between result list and controls */}
    <div className="my-4 h-px w-full bg-border" />
    ```

* This does **not** apply to trivial, purely layouting containers:

  * Example:

    ```tsx
    <div className="flex gap-4">
      {/* no extra comment needed here */}
      ...
    </div>
    ```

* When possible, prefer semantic elements over `div`s:

  * `button`, `nav`, `header`, `section`, `main`, `aside`, `footer`, etc.

---

## 5. State Management (Zustand)

* Each roller has its **own Zustand store slice**, scoped and typed for that roller.
* State for each roller is **persisted** (e.g. last used settings and results if desired).
* Store files should live close to their roller, for example:

  * `app/dice/[rollerName]/store.ts`

* When adding new state:

  * Make sure it is serializable and safe to persist.
  * Document any performance / UX constraints in the component description block or store comments.

---

## 6. Theming & Color Schemes

Talis supports multiple color schemes:

* **System theme:**

  * Respects the user’s OS setting (light/dark).
  * Automatically switches between light and dark.

* **Additional custom color schemes:**

  * Users may select other themes beyond default light/dark.

Implementation notes:

* Use Tailwind v4 utilities and appropriate theme tokens.
* Theming logic should be centralized (e.g. in layout or a theme provider), not per-component.
* Components should:

  * Avoid hard-coded colors.
  * Use theme-aware classes and shadcn/ui tokens.

---

## 7. Internationalization (i18n)

* The app is **fully translated** in **German** and **English**.
* All user-facing strings **must be obtained from the i18n layer** (e.g. translation files or hooks), not hard-coded.
* When adding new text:

  * Provide both `en` and `de` translations.
  * Use clear, context-rich keys (`diceRoller.rollButton.label`, not `roll`).
