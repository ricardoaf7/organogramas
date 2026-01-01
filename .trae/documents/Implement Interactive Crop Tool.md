I will implement an interactive crop tool for precise export control.

### 1. Update Store
- **File**: `src/store/useOrganogramStore.ts`
- **Action**: Add `isCropMode` state and `toggleCropMode` action.

### 2. Create Crop Overlay Component
- **File**: `src/components/CropOverlay.tsx`
- **Action**: Implement a component that:
  - Renders an overlay on top of the canvas.
  - Allows dragging to define a selection rectangle.
  - Shows the dimensions of the selected area.
  - Provides "Confirm" and "Cancel" buttons.
  - **Logic**: Uses local state for mouse coordinates and calculates the rectangle style.

### 3. Update Toolbar
- **File**: `src/components/Toolbar.tsx`
- **Action**: Add a "Crop/Recortar" button (Icon: `Crop`).

### 4. Update Export Logic
- **File**: `src/utils/download.ts`
- **Action**: Update `downloadOrganogram` to accept `customBounds` (x, y, width, height).
  - If provided, use these bounds instead of calculating them automatically.
  - Ensure the `onclone` transform logic uses these custom bounds to shift the viewport correctly.

### 5. Integration
- **File**: `src/pages/Editor.tsx`
- **Action**:
  - Render `<CropOverlay />` when `isCropMode` is true.
  - Pass the selection bounds from `CropOverlay` to `downloadOrganogram`.

### 6. Verification
- **Manual Test**: Click "Recortar" -> Drag to select area -> Click Confirm -> Check downloaded image matches selection exactly.