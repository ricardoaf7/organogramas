I will implement the connection management system with selection, deletion, and configuration adjustment.

### 1. Update Types
- **File**: `src/types/organogram.ts`
- **Action**: Update `OrganogramEdge` to include custom data properties for styling (color, type, animated, label).

### 2. Update Store
- **File**: `src/store/useOrganogramStore.ts`
- **Action**:
  - Add `updateEdge: (id: string, data: Partial<Edge>) => void` action.
  - Add `deleteEdge: (id: string) => void` action.

### 3. Update Property Panel
- **File**: `src/components/PropertyPanel.tsx`
- **Action**:
  - Detect if an **Edge** is selected (in addition to Nodes).
  - If an Edge is selected, render an "Edge Settings" view instead of Node Settings.
  - **Edge Settings UI**:
    - **Actions**: "Delete Connection" button (red, with confirmation).
    - **Settings**:
      - **Type**: Dropdown (Step, Smooth Step, Straight, Bezier).
      - **Animation**: Toggle switch.
      - **Label**: Text input for connection label.
      - **Style**: Color picker for line color, Stroke width input.

### 4. Integration
- **File**: `src/components/OrganogramCanvas.tsx`
- **Action**: No major changes needed as React Flow handles selection state automatically. The `PropertyPanel` will react to `edges.find(e => e.selected)`.

### 5. Verification
- **Manual Test**: Click an edge -> Property Panel shows edge options.
- **Manual Test**: Change edge type/color -> Visual update on canvas.
- **Manual Test**: Click "Delete" -> Confirm dialog -> Edge removed.
- **Manual Test**: Undo deletion -> Edge restored.