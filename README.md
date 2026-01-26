# Talis

Talis is a dice rolling app for Pen & Paper tabletop roleplaying games. It supports multiple game systems and dice configurations, making it easy to roll dice for your favorite games.

**Try it out:** [talis.wallbaum.dev](https://talis.wallbaum.dev)

## Rollers

- **Shadowrun** - Shadowrun dice roller with edge, glitches, and hit counting
- **Daggerheart** - Dedicated Daggerheart dice roller
- **D6 Roller** - General purpose D6 roller for any game
- **Polyhedral** - Standard polyhedral dice (d4, d6, d8, d10, d12, d20, d100)
- **Coin Flipper** - Flip coins with customizable sides

## Features

- Works fully offline as a Progressive Web App (PWA) 📱
- Supports dark mode 🌗
- Multi-language support (English & German) 🌍
- Multiple color themes 🎨

### Install as App (PWA)

Talis is optimized for mobile use and works fully offline as a Progressive Web App. For the best experience, install it to your device - it's designed to use your entire screen.

#### Android

In Chrome, tap the three dots "..." in the top right corner and select "Add to home screen".

#### iOS

In Safari, tap the share icon (square with arrow) at the bottom of the screen and select "Add to Home Screen".

---

## Development

This is a [Next.js](https://nextjs.org) PWA with [shadcn/ui](https://ui.shadcn.com/) and Tailwind v4.

The repo is setup for development in Cursor.

### Getting Started


```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Service Workers

By default, service workers are **disabled** in development mode to prevent caching issues during testing. This means PWA features (offline support, install prompts, etc.) won't work during normal development.

To enable service workers in development for testing PWA features:

```bash
NEXT_PUBLIC_ENABLE_SW_DEV=true npm run dev
```

**Note:** Service workers are always enabled in production builds, regardless of this environment variable.

## Contributing

Talis is open source. Feel free to check out the code, open issues, or submit pull requests.

