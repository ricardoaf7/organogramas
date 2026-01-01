import { Node, Edge } from 'reactflow';

export type OrganogramNodeType = 'manager' | 'coordinator' | 'supervisor' | 'sector';

export interface OrganogramNodeData {
  title: string;
  description?: string;
  color: string;
  shape: 'rectangle' | 'rounded' | 'circle';
  label?: string; // Required by React Flow sometimes, but we use custom nodes
  lineHeight?: number;
}

export type OrganogramNode = Node<OrganogramNodeData, OrganogramNodeType>;

export type OrganogramEdge = Edge<{
  label?: string;
  stroke?: string;
  strokeWidth?: number;
}>;

export interface OrganogramData {
  nodes: OrganogramNode[];
  edges: OrganogramEdge[];
}

export interface OrganogramMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
