I will fix the export clipping issues by adjusting the bounds calculation and padding logic.

### 1. Update Download Utility
- **File**: `src/utils/download.ts`
- **Action**: Increase the padding from `50px` to `100px` to provide a safer margin around the edges, especially for labels or thick connection lines.
- **Action**: Add a fallback check for bounds. If `minX` or `minY` are negative, ensure the translation logic correctly shifts them into positive space. The current logic `translate(${-bounds.x + padding}px, ...)` handles this mathematically, but I will double-check that `bounds.x` correctly reflects the leftmost point (even if negative).
- **Action**: Improve the edge bounding box calculation. Sometimes `getBBox()` on the main edges group might not be accurate if there are nested transforms. I will ensure we are checking the bounding box in the correct coordinate space.

### 2. Verification
- **Manual Test**: Create a wide diagram extending to the left.
- **Manual Test**: Export as PNG and check the left edge.
- **Manual Test**: Export as PDF and check page fitting.