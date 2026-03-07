# Talis developer guidelines

Read this file first. It lists all project guideline docs and when to use them. For each task, read the **Always apply** docs and any **Read when relevant** doc that matches your work.

## Always apply

Load these for every coding task:

| Doc | Description |
|-----|-------------|
| [docs/project-structure.md](project-structure.md) | App Router, locale segment, dice rollers, shared vs route-local code, PWA file locations |
| [docs/tech-stack.md](tech-stack.md) | Next.js, Tailwind, shadcn/ui, Zustand, next-intl, nanoid; do not modify `components/ui/**` |
| [docs/react-components.md](react-components.md) | PascalCase files, named exports, arrow functions, React imports, component description block |
| [docs/maintenance.md](maintenance.md) | When to update or add docs (e.g. when a general approach is decided) |

## Read when relevant

Load the doc that matches your task:

| When to read | Doc |
|--------------|-----|
| i18n, UI text, translations, adding strings | [docs/internationalization.md](internationalization.md) |
| Zustand, stores, persistence, roller state | [docs/state-management.md](state-management.md) |
| Commit messages, emoji prefix format | [docs/commit-messages.md](commit-messages.md) |
| Theming, CSS variables, new themes, prose/MDX styling | [docs/theming.md](theming.md) |
| PWA, offline, service worker, install prompt | [docs/pwa.md](pwa.md) |
| JSX/TSX/HTML semantics, comments on non-semantic elements | [docs/html-semantics.md](html-semantics.md) |

Use the paths above to read the corresponding file (e.g. `docs/internationalization.md`) when the topic applies.
