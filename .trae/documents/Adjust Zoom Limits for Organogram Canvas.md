I will adjust the zoom limits of the OrganogramCanvas to allow viewing the entire diagram.

### 1. Update OrganogramCanvas
- **File**: `src/components/OrganogramCanvas.tsx`
- **Action**: Add `minZoom` and `maxZoom` props to the `<ReactFlow>` component.
  - Set `minZoom` to a low value (e.g., `0.05` or `0.1`) to allow zooming out far enough to see large diagrams.
  - Set `maxZoom` to a reasonable high value (e.g., `2` or `4`) to allow detailed inspection.
  - Default React Flow `minZoom` is usually 0.5, which is often too restrictive for large graphs.

### 2. Verification
- **Manual Test**: Run the application and try zooming out with the mouse wheel or trackpad.
- **Check**: Verify that the zoom allows seeing the entire organogram, including when using the "Crop" tool overlay.