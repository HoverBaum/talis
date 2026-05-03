# Dice Select Wheel Component

## Overview

`DiceSelectWheel` is the shared wheel-style number picker implemented in `components/DiceSelectWheel.tsx`.
It is currently used by the Shadowrun, D6, Daggerheart, and Polyhedral rollers.

The component provides an iOS-style vertical picker with snap behavior, motion-based visual emphasis,
and optional haptic feedback (based on settings).

## Props

- `max: number` - Maximum number to display (range is `1..max`)
- `current: number` - Currently selected number
- `onChange: (value: number) => void` - Callback fired when selection changes

## Visual Design

The wheel shows a vertically scrollable list of values with two horizontal guide lines that frame
the selected region:

```
    ─────────────────  ← Top guide line
         5
    ─────────────────  ← Bottom guide line
         6
         7
```

### Key visual elements

1. **Guide lines**
   - Fixed at vertical center with offsets (`-mt-5` / `mt-5`, about 20px from center)
   - Use `pointer-events-none` and `z-10`

2. **Animated items**
   - Values are snap-centered and rendered as selectable options
   - Scale/opacity respond to scroll position (`motion/react`)
   - Selected item gets stronger emphasis and "pop" animation

## Behavior

### Scrolling and snapping

- Uses `snap-y snap-mandatory` and `snap-center`
- Dynamic top/bottom padding keeps first and last values centerable
- Uses container height from parent layout for correct sizing

### Selection methods

1. **Scroll selection**
   - On supported browsers, uses `scrollend` to detect settle
   - Fallback uses debounced `scroll` handling (150ms)
   - Settled value triggers `onChange` when different from `current`

2. **Direct click/tap**
   - Clicking a value calls `onChange` immediately
   - Wheel then auto-centers to the selected value via controlled state updates

### Controlled auto-centering

When `current` changes externally, the component scrolls to `(current - 1) * ITEM_HEIGHT`
with smooth behavior.

## Accessibility and UX

- Exposes `role="listbox"` and child `role="option"` semantics
- Includes an `aria-live` status region announcing selected value
- Respects `prefers-reduced-motion`
- Uses haptic vibration ticks when `settings-store` enables `vibration.selectWheel`

## Implementation notes

- Item height is fixed at `40px` (`ITEM_HEIGHT`)
- Center strictness uses a `CENTER_THRESHOLD` ratio
- Motion transitions use spring constants for consistent feel
- Shows a skeleton placeholder until measured height is available
