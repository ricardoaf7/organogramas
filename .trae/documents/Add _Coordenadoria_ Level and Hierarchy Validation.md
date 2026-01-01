I will implement the new "Coordenadoria" level and strict hierarchy validation.

### 1. Update Type Definitions
- **File**: `src/types/organogram.ts`
- **Action**: Update `OrganogramNodeType` to include `'supervisor'` (representing Coordenadoria).

### 2. Implement Validation Logic
- **File**: `src/utils/validation.ts` (Create new)
- **Action**: Create a `validateConnection` function that enforces the hierarchy:
  1.  **Diretoria** (Level 0)
  2.  **Gerência** (Level 1)
  3.  **Coordenadoria** (Level 2) - *New*
  4.  **Setor** (Level 3)
- **Rule**: Connections are only allowed from a higher level (lower index) to a lower level (higher index).

### 3. Update Sidebar (UI)
- **File**: `src/components/Sidebar.tsx`
- **Action**: Add the "Coordenadoria" drag-and-drop item.
  - **Color**: Orange (`#fed7aa`) to distinguish from others.
  - **Icon**: `Users` from Lucide React.
  - **Position**: Between "Gerência" and "Setor".

### 4. Update Canvas & Integration
- **File**: `src/components/OrganogramCanvas.tsx`
- **Action**:
  - Register the new `supervisor` type in `nodeTypes`.
  - Integrate the `isValidConnection` prop in React Flow using the new validation logic.

### 5. Testing
- **File**: `src/utils/validation.test.ts` (Create new)
- **Action**: Add unit tests to verify:
  - Valid connections (e.g., Gerência -> Coordenadoria).
  - Invalid connections (e.g., Setor -> Coordenadoria).
  - Cyclical prevention (handled by React Flow, but hierarchy logic reinforces it).

### 6. Documentation
- **File**: `README.md`
- **Action**: Update documentation to explain the new hierarchy levels and connection rules.
