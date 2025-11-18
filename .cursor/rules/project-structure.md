# Project Structure & Routing

These guidelines apply to all developers and AI agents contributing to **Talis**, a Next.js app for Pen-and-Paper dice rollers.

## App Router (`app/`)

We follow the **App Router** approach:

* Each folder in `app/` represents a route.
* If a folder exists purely for organization and **must not** become a route, its name **must start with `_`**.

  * Example: `app/(marketing)/_components/`

Note: Organizational folders in routes **should** be avoided as long, as feasable.

## Dice Rollers

* All dice rollers live under:
  `app/dice/[rollerName]/`
* Each roller:

  * Has its **own Zustand slice**, which is **persisted**.
  * Has a **config page** to configure it.

## Shared vs Route-Local Code

* **Route-local components/hooks**
  Components, stores and hooks used **only by one route** live directly in that route's folder (or its `_`-prefixed subfolders).

  * Example: `app/dice/dnd/ResultList.tsx`

* **Shared components**
  Components reused across multiple routes live in:
  `components/`

* **Shared hooks**
  Hooks reused across multiple routes live in:
  `hooks/`

