I will fix the export clipping issue by including edges in the bounds calculation.

### 1. Update Download Utility
- **File**: `src/utils/download.ts`
- **Action**: Update `getNodesBounds` function to:
  - Select the edges layer (`.react-flow__edges`).
  - Use `getBBox()` on the edges layer to get its dimensions and position.
  - Expand the `minX`, `minY`, `maxX`, `maxY` calculations to include the edges' bounding box.
  - This ensures that if a connection curves outside the area defined by the nodes, the export area will expand to include it.

### 2. Verification
- **Manual Test**: Create a diagram with curved connections that extend far to the left or top.
- **Manual Test**: Export as PNG.
- **Check**: Verify that the generated image includes all connection lines fully, without clipping.