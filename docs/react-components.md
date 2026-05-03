# React Components

These guidelines apply to all developers and AI agents contributing to **Talis**, a Next.js app for Pen-and-Paper dice rollers.

## Naming & Files

* React component files **should** use **PascalCase**:

  * `DiceRoller.tsx`, `RollResultList.tsx`

* React components themselves are **PascalCase**.
* Use **named exports** for reusable components:

  ```tsx
  // Good
  export const DiceRoller = () => { ... }
  ```

* **Next.js route files are an explicit exception** and follow framework conventions:

  * `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` typically use `export default`.

## Function Style

* Prefer arrow functions.

## Imports

* Prefer direct imports over the `React.something` pattern. Import functions and types directly from `'react'` when practical:

  ```tsx
  // Good
  import { useEffect, type ComponentProps } from 'react'
  useEffect(() => { ... })
  ComponentProps<...>
  ```

* Import hooks, utilities, and types directly by name.
* Use `type` keyword for type-only imports when appropriate.
* Namespace imports (`import * as React from 'react'`) are acceptable when they improve readability for context-heavy files.

## Component Description Block

Each React component file **must** start with a description block. This description focuses especially on **non-functional requirements** and intended usage.

* Describe:

  * The purpose of the component.
  * Performance / accessibility considerations (e.g. "rendered in a list of 100 items", "keyboard navigation required").
  * Assumptions and constraints (e.g. "expects valid dice notation string", "must be responsive down to 320px width").
  * How it is intended to be used / composed.

* This block **must be kept up to date** whenever we learn new requirements or usage constraints.
