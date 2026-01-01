I will implement the missing delete button functionality for Nodes.

### 1. Update Store
- **File**: `src/store/useOrganogramStore.ts`
- **Action**: Add `deleteNode: (id: string) => void` action.
  - **Logic**:
    1. Take snapshot for undo/redo.
    2. Filter out the node with the given ID from `nodes`.
    3. Filter out any edges connected to this node from `edges`.
    4. Update state.

### 2. Update Toolbar (Global Delete)
- **File**: `src/components/Toolbar.tsx`
- **Action**:
  - Add `onDelete?: () => void` prop.
  - Add a "Delete" button (Icon: `Trash2`).
  - Render it only when `hasSelection` is true.
  - Use red color (`text-red-600`) to indicate destructive action.

### 3. Update Property Panel (Contextual Delete)
- **File**: `src/components/PropertyPanel.tsx`
- **Action**:
  - In the **Node Settings** section (where `selectedNode` is true), add a delete button in the header (similar to the Edge section).
  - Use the same styling as the Edge delete button for consistency.
  - Bind it to a `handleDeleteNode` function with confirmation.

### 4. Integration
- **File**: `src/pages/Editor.tsx`
- **Action**:
  - Pass `onDelete` to the Toolbar.
  - Logic: Check if selection is Node or Edge. If Node -> `deleteNode`. If Edge -> `deleteEdge`.

### 5. Verification
- **Manual Test**: Select Node -> Click Toolbar Delete -> Confirm -> Node removed.
- **Manual Test**: Select Node -> Click Property Panel Delete -> Confirm -> Node removed.
- **Manual Test**: Select Edge -> Click Toolbar Delete -> Confirm -> Edge removed.
- **Manual Test**: Verify Undo restores deleted items.