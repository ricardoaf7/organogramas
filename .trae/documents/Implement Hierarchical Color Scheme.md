I will implement the hierarchical color scheme with tonal palettes and a legend.

### 1. Create Color System Utility
- **File**: `src/utils/colors.ts`
- **Action**: Define hierarchical palettes for different departments (Blue, Green, Purple, Yellow, Gray).
  - Structure:
    ```typescript
    export const PALETTES = {
      blue: { name: 'Resíduos', colors: { coordinator: '#1e3a8a', supervisor: '#3b82f6', sector: '#dbeafe' } }, // Dark Blue, Blue, Light Blue
      green: { name: 'Limpeza', colors: { coordinator: '#14532d', supervisor: '#22c55e', sector: '#dcfce7' } }, // Dark Green, Green, Light Green
      // ... Purple, Yellow, Gray
    }
    ```
- **Action**: Implement `getContrastColor(hex)` helper to return 'white' or 'black' based on brightness for accessibility.

### 2. Update Node Component
- **File**: `src/components/nodes/CustomNode.tsx`
- **Action**:
  - Use `getContrastColor(data.color)` to dynamically set text color.
  - Apply this color to Title and Description.

### 3. Update Property Panel
- **File**: `src/components/PropertyPanel.tsx`
- **Action**:
  - Add "Esquema de Cores" section.
  - Render buttons for each Palette (Blue, Green, etc.).
  - On click, update the node's `color` based on its `type` (e.g., if node is `sector` and Blue palette is clicked, apply `#dbeafe`).

### 4. Create Legend Component
- **File**: `src/components/Legend.tsx`
- **Action**: Create a floating component showing:
  - Gradient bars or blocks representing the hierarchy (Dark = Gerência, Medium = Coord, Light = Setor).
  - Explanatory text.

### 5. Integration
- **File**: `src/components/OrganogramCanvas.tsx`
- **Action**: Add `<Legend />` to the canvas layout (e.g., bottom-left absolute position).

### 6. Verification
- **Manual Test**: Select a Sector node -> Click "Blue Palette" -> Color changes to Light Blue -> Text is readable.
- **Manual Test**: Select a Manager node -> Click "Blue Palette" -> Color changes to Dark Blue -> Text becomes White.
- **Manual Test**: Check Legend visibility.