# RollerLayout

Common layout component for dice rollers.

Provides a consistent structure across all dice rollers with:
- Full-height flex container
- Responsive padding (p-2 on mobile, p-4 on desktop)
- Composable sub-components for flexible layout

See the [RollerLayout.tsx](./RollerLayout.tsx) file for the component implementation.

## Components

### RollerLayout

Root container component for dice roller layouts. Use this as the outermost wrapper for all dice roller layouts.

### RollerLayoutContent

Wrapper for the main content area (results and controls). Use this component to wrap `RollerLayoutResultArea` and optionally `RollerLayoutControlArea`.

Always uses grid. Layout adapts based on children: when `RollerLayoutControlArea` is present, a 12-column grid is used; otherwise a single-column grid (grid item stretches by default).

### RollerLayoutResultArea

Scrollable area for displaying dice roll results. Use this component to wrap the list of roll results.

**Props:**
- `id` (required): String identifier for auto-scroll hooks
- `showNewResultBottom` (optional): Boolean to control scroll direction (default: `true`)

When used in a grid layout with `RollerLayoutControlArea`, add `className="col-span-10"`.  
When used alone, add `className="pb-2"` for spacing.

### RollerLayoutControlArea

Optional control area for dice selection or other controls. Use this component to wrap control elements like dice selectors or configuration widgets.

When used in a grid layout with `RollerLayoutResultArea`, wrap both in a grid container and add `className="col-span-2"` to this component.

### RollerLayoutFooter

Footer area for action buttons and controls. Use this component to wrap the footer content (typically `RollerControls`).

Should be placed as the last child of `RollerLayout`.

## Usage Examples

### With Control Area (Grid Layout)

```tsx
<RollerLayout>
  <RollerLayoutContent>
    <RollerLayoutResultArea
      id="results"
      showNewResultBottom={true}
      className="col-span-10"
    >
      {/* Roll results */}
    </RollerLayoutResultArea>
    <RollerLayoutControlArea className="col-span-2">
      {/* Dice selector or other controls */}
    </RollerLayoutControlArea>
  </RollerLayoutContent>
  <RollerLayoutFooter>
    {/* Action buttons */}
  </RollerLayoutFooter>
</RollerLayout>
```

### Without Control Area (Single Column)

```tsx
<RollerLayout>
  <RollerLayoutContent>
    <RollerLayoutResultArea
      id="results"
      showNewResultBottom={true}
      className="pb-2"
    >
      {/* Roll results */}
    </RollerLayoutResultArea>
  </RollerLayoutContent>
  <RollerLayoutFooter>
    {/* Action buttons */}
  </RollerLayoutFooter>
</RollerLayout>
```

## Used By

- D6 Roller
- Daggerheart Roller
- Polyhedral Roller
- Shadowrun Roller
- Coin Roller

