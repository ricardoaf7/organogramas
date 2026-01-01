I will implement the flexible layout system with text wrapping and manual resizing.

### 1. Update Types
- **File**: `src/types/organogram.ts`
- **Action**: Update `OrganogramNodeData` to include optional `lineHeight` (number).

### 2. Update Store
- **File**: `src/store/useOrganogramStore.ts`
- **Action**: Add `updateNode(id: string, data: Partial<OrganogramNode>)` to allow updating root node properties (like `width`, `height`, `style`).
- **Note**: This will be used by the Property Panel to set precise dimensions.

### 3. Update Node Component
- **File**: `src/components/nodes/CustomNode.tsx`
- **Action**:
  - Import `NodeResizer` from `reactflow`.
  - Add `<NodeResizer />` inside the component (visible when `selected`).
  - Configure `NodeResizer` with `minWidth={100}`, `minHeight={50}`.
  - Update the main `div` styles:
    - `width: 100%`, `height: 100%` (to fill resized area).
    - `break-words`, `hyphens-auto` (for text wrapping).
    - Dynamic `lineHeight` from `data`.
  - Bind `onResizeEnd` to `takeSnapshot` (via a new store action or passed prop if needed, but calling `takeSnapshot` from store hook inside node is cleaner).

### 4. Update Property Panel
- **File**: `src/components/PropertyPanel.tsx`
- **Action**: Add a new "Layout" section with:
  - **Width/Height Inputs**: Number inputs that update `node.style.width` / `node.style.height`.
  - **Line Height Input**: Number input (step 0.1) that updates `data.lineHeight`.

### 5. Verification
- **Manual Test**: Resize a node using handles, check undo/redo.
- **Manual Test**: Type long text, verify wrapping and hyphenation.
- **Manual Test**: Change width/height via inputs, verify update.