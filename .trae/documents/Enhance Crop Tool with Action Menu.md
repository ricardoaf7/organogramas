I will upgrade the Crop Tool to include a post-selection action menu (Print, PDF, PNG, Copy) as requested.

### 1. Update CropOverlay Component
- **File**: `src/components/CropOverlay.tsx`
- **Action**: Modify the UI to show an "Action Menu" instead of just a confirm button after selection.
  - Remove the simple Confirm/Cancel buttons.
  - Add a menu with:
    - 🖨️ Imprimir (Print)
    - 📄 Exportar PDF
    - 🖼️ Exportar PNG
    - 📋 Copiar (Clipboard)
    - ❌ Cancelar
  - **Logic**: Update the `onConfirm` prop to accept an `action` parameter (e.g., `'print' | 'pdf' | 'png' | 'copy'`).

### 2. Update Download Utility
- **File**: `src/utils/download.ts`
- **Action**:
  - Extract the capture logic into a reusable `captureArea` function that returns the `canvas`.
  - Export a `printCanvas(canvas)` function: Opens a new window with the image and triggers `window.print()`.
  - Export a `copyToClipboard(canvas)` function: Uses `canvas.toBlob()` and `navigator.clipboard.write()`.
  - Refactor `downloadOrganogram` to support these new actions.

### 3. Integrate in Editor
- **File**: `src/pages/Editor.tsx`
- **Action**: Update `handleCropConfirm` to handle the specific action chosen by the user:
  - Call the appropriate utility function based on the action (`print`, `pdf`, `png`, `copy`).
  - Show success feedback (alert/toast) for "Copy" action.

### 4. Verification
- **Manual Test**: Select area -> Click "Copy" -> Paste in another app.
- **Manual Test**: Select area -> Click "Print" -> Check print preview.
- **Manual Test**: Select area -> Click "PDF/PNG" -> Check file download.