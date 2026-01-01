I will implement a robust export system that automatically detects the organogram boundaries and exports it without cropping.

### 1. Create Export Utility
- **File**: `src/utils/download.ts`
- **Action**: Implement `downloadOrganogram` function.
  - **Logic**:
    1. Select the `.react-flow__viewport` and all `.react-flow__node` elements.
    2. Calculate the bounding box (minX, minY, maxX, maxY) by iterating over all nodes and reading their current `transform` (position) and `offsetWidth`/`offsetHeight`.
    3. Define a padding (e.g., 50px).
    4. Use `html2canvas` with the following configuration:
       - `width`: `(maxX - minX) + padding * 2`
       - `height`: `(maxY - minY) + padding * 2`
       - `onclone`: A callback that:
         - Finds the `.react-flow__viewport` in the cloned document.
         - Resets its transform to `translate(${-minX + padding}px, ${-minY + padding}px) scale(1)`.
         - This effectively shifts the whole graph so the top-left node is at `(padding, padding)` and resets any zoom.
    5. Handle formats:
       - **PNG/JPEG**: Download the canvas data URL.
       - **PDF**: Use `jspdf` to place the image (scaled to fit A4 or custom size if needed, usually landscape).

### 2. Update Editor
- **File**: `src/pages/Editor.tsx`
- **Action**: Replace the current `handleExport` logic with a call to `downloadOrganogram`.

### 3. Verification
- **Manual Test**: Pan the graph so nodes are partially off-screen.
- **Manual Test**: Zoom in/out.
- **Manual Test**: Export as PNG and PDF.
- **Check**: The result should show the entire graph centered with padding, regardless of the screen view.