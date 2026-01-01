I will remove the Legend component from the interface.

### 1. Update OrganogramCanvas
- **File**: `src/components/OrganogramCanvas.tsx`
- **Action**:
  - Remove the import `import { Legend } from './Legend';`.
  - Remove the `<Legend />` component from the JSX inside `<ReactFlow>`.

### 2. Delete Component File (Optional but recommended)
- **File**: `src/components/Legend.tsx`
- **Action**: Delete the file since it's no longer used.

### 3. Verification
- **Manual Test**: Run the app and verify the bottom-left legend box is gone.