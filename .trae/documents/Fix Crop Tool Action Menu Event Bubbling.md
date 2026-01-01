I will fix the event bubbling issue in the Crop Tool.

### 1. Update CropOverlay Component
- **File**: `src/components/CropOverlay.tsx`
- **Action**: Stop event propagation on the action menu container.
  - Add `onMouseDown={(e) => e.stopPropagation()}` to the `div` containing the buttons (lines 88-95).
  - This prevents the click on the menu from bubbling up to the main overlay container, which triggers the `handleMouseDown` that resets the selection.

### 2. Verification
- **Manual Test**: Select an area -> Click any action button -> Verify the action triggers instead of resetting the selection.