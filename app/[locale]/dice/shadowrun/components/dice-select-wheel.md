# Dice Select Wheel Component

## Overview

The Dice Select Wheel is a vertical scrolling interface that allows users to select a number by scrolling through options. It provides an iOS-style picker wheel experience.

## Visual Design

The component displays a vertical list of numbers with two horizontal lines that frame the currently selected number:

```
    ─────────────────  ← Top line (frames selected number)
         5
    ─────────────────  ← Bottom line (frames selected number)
         6
         7
```

### Key Visual Elements

1. **Horizontal Lines**: Two fixed horizontal lines positioned at the vertical center of the container
   - Top line: positioned 24px (6 Tailwind units) above center
   - Bottom line: positioned 24px (6 Tailwind units) below center
   - Both lines use `pointer-events-none` to not interfere with number selection
   - Lines are layered above content with `z-10`

2. **Numbers**: Scrollable list of numbers that move through the fixed frame
   - Numbers scroll vertically through the container
   - Selected number aligns with the center between the two lines
   - Each number is clickable for direct selection

## Behavior

### Scrolling

- Numbers scroll vertically through the fixed frame
- The container has padding equal to half its height at top and bottom
- This padding ensures the first and last numbers can reach the center position

### Selection

Two methods to select a number:

1. **Scroll Selection**: Scroll until desired number is centered between the lines
   - Component detects which number is closest to center after scrolling stops
   - Automatically snaps to that number and triggers `onChange`
   - Uses a 150ms debounce to detect scroll completion

2. **Direct Click**: Click any visible number to immediately select it
   - Triggers smooth scroll animation to center that number
   - Calls `onChange` with the selected value

### Auto-Centering

When the `current` prop changes (e.g., from external controls):

- Component automatically scrolls to center the new current number
- Uses smooth scroll animation for better UX

## Props

- `max: number` - Maximum number to display (creates range 1 to max)
- `current: number` - Currently selected number
- `onChange: (value: number) => void` - Callback fired when selection changes

## Responsive Behavior

- Component responds to window height changes
- Recalculates container height when window is resized
- Delays height calculation on downward resize to account for mobile browser UI

## Technical Implementation

### Positioning Strategy

The lines remain fixed while content scrolls:

- Lines are absolutely positioned relative to parent
- Both start at `top-1/2` (50% from top)
- Both use `-translate-y-1/2` to center them on their position
- Top line has additional `-mt-6` to move up
- Bottom line has additional `mt-6` to move down

### Scroll Container

- Uses CSS `snap-y snap-mandatory` for smooth snapping
- Each number div uses `snap-center` for alignment
- Padding ensures edge numbers can reach center:
  - `paddingTop: height / 2`
  - `paddingBottom: height / 2`

### Selection Detection

After scroll stops:

1. Calculate center position: `scrollTop + height / 2`
2. Find element with `offsetTop` closest to center
3. Read number from element's `data-number` attribute
4. Call `onChange` with that number
