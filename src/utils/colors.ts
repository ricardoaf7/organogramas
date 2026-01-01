import { OrganogramNodeType } from '@/types/organogram';

export type PaletteKey = 'blue' | 'green' | 'purple' | 'yellow' | 'gray';

export const PALETTES: Record<PaletteKey, { name: string; colors: Partial<Record<OrganogramNodeType, string>> }> = {
  blue: {
    name: 'Resíduos',
    colors: {
      manager: '#1e3a8a', // Darkest Blue
      coordinator: '#2563eb', // Blue
      supervisor: '#60a5fa', // Light Blue
      sector: '#dbeafe', // Lightest Blue
    },
  },
  green: {
    name: 'Limpeza',
    colors: {
      manager: '#14532d', // Darkest Green
      coordinator: '#16a34a', // Green
      supervisor: '#4ade80', // Light Green
      sector: '#dcfce7', // Lightest Green
    },
  },
  purple: {
    name: 'Posturas',
    colors: {
      manager: '#581c87', // Darkest Purple
      coordinator: '#9333ea', // Purple
      supervisor: '#c084fc', // Light Purple
      sector: '#f3e8ff', // Lightest Purple
    },
  },
  yellow: {
    name: 'Gestão',
    colors: {
      manager: '#713f12', // Darkest Yellow/Brown
      coordinator: '#ca8a04', // Yellow/Gold
      supervisor: '#facc15', // Light Yellow
      sector: '#fef9c3', // Lightest Yellow
    },
  },
  gray: {
    name: 'Admin',
    colors: {
      manager: '#1f2937', // Darkest Gray
      coordinator: '#4b5563', // Gray
      supervisor: '#9ca3af', // Light Gray
      sector: '#f3f4f6', // Lightest Gray
    },
  },
};

export const getContrastColor = (hexColor: string): string => {
  // Remove hash if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness (YIQ formula)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Return black or white based on brightness
  return yiq >= 128 ? '#000000' : '#ffffff';
};

export const getColorForType = (palette: PaletteKey, type: OrganogramNodeType): string => {
  return PALETTES[palette].colors[type] || '#ffffff';
};
