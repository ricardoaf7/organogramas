I will implement the multi-directional connection system.

### 1. Update Validation Logic
- **File**: `src/utils/validation.ts`
- **Action**: Relax the strict hierarchy validation to allow:
  - **Peer Connections**: Allow connections between nodes of the same level (e.g., Coordinator -> Coordinator).
  - **Upward Connections**: Allow connections from lower to higher levels (e.g., Sector -> Coordinator) to support the "bidirectional" requirement.
  - **Logic**: Change validation to always return `true` (or remove the level check entirely), relying on visual cues instead of strict blocking. I will add a `cycleDetection` check instead to prevent infinite loops if needed, but for now, total flexibility is the goal.

### 2. Update Node Handles
- **File**: `src/components/nodes/CustomNode.tsx`
- **Action**: Add 8 handles in total (Source + Target for each of the 4 sides).
  - **Top**: Existing Target + New Source
  - **Bottom**: Existing Source + New Target
  - **Left**: New Source + New Target
  - **Right**: New Source + New Target
- **Implementation**:
  - Use absolute positioning to stack or place them side-by-side on each border.
  - Assign unique `id` to each handle (e.g., `source-top`, `target-top`) to allow specific targeting.

### 3. Update Styles
- **File**: `src/components/nodes/CustomNode.tsx` (or CSS)
- **Action**: Adjust Handle styles to ensure they are accessible but not cluttered.
  - Handles will remain hidden until hover.
  - Source handles might have a different visual (e.g., filled dot) vs Target (hollow dot) if visible, but standard React Flow handles are usually uniform. I will keep them consistent.

### 4. Verification
- **Manual Test**: Connect Top -> Bottom (Standard).
- **Manual Test**: Connect Right -> Left (Peer/Side connection).
- **Manual Test**: Connect Bottom -> Top (Upward connection).
- **Manual Test**: Verify multiple connections on a single node.