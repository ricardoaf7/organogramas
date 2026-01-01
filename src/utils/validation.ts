import { Node, Connection } from 'reactflow';
import { OrganogramNodeType } from '@/types/organogram';

const HIERARCHY_LEVELS: Record<OrganogramNodeType, number> = {
  manager: 0,      // Diretoria
  coordinator: 1,  // Gerência
  supervisor: 2,   // Coordenadoria
  sector: 3,       // Setor
};

export const getHierarchyLevel = (type?: string): number => {
  if (!type || !(type in HIERARCHY_LEVELS)) return 999;
  return HIERARCHY_LEVELS[type as OrganogramNodeType];
};

export const validateConnection = (
  connection: Connection,
  nodes: Node[]
): boolean => {
  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  // Allow all connections to support multi-directional and bidirectional flows
  // This enables:
  // 1. Top-down (Manager -> Sector)
  // 2. Peer-to-peer (Manager -> Manager)
  // 3. Bottom-up (Sector -> Manager)
  // 4. Multi-directional (Left -> Right, Right -> Left)
  return true;
};
