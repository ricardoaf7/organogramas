import { describe, it, expect } from 'vitest';
import { validateConnection, getHierarchyLevel } from './validation';
import { Node } from 'reactflow';

describe('Hierarchy Validation', () => {
  const nodes: Node[] = [
    { id: '1', type: 'manager', position: { x: 0, y: 0 }, data: {} },
    { id: '2', type: 'coordinator', position: { x: 0, y: 0 }, data: {} },
    { id: '3', type: 'supervisor', position: { x: 0, y: 0 }, data: {} },
    { id: '4', type: 'sector', position: { x: 0, y: 0 }, data: {} },
    { id: '5', type: 'manager', position: { x: 0, y: 0 }, data: {} }, // Another manager
  ];

  it('should return correct hierarchy levels', () => {
    expect(getHierarchyLevel('manager')).toBe(0);
    expect(getHierarchyLevel('coordinator')).toBe(1);
    expect(getHierarchyLevel('supervisor')).toBe(2);
    expect(getHierarchyLevel('sector')).toBe(3);
    expect(getHierarchyLevel('unknown')).toBe(999);
  });

  it('should allow valid downstream connections', () => {
    // Manager -> Coordinator
    expect(validateConnection({ source: '1', target: '2', sourceHandle: null, targetHandle: null }, nodes)).toBe(true);
    // Coordinator -> Supervisor
    expect(validateConnection({ source: '2', target: '3', sourceHandle: null, targetHandle: null }, nodes)).toBe(true);
    // Supervisor -> Sector
    expect(validateConnection({ source: '3', target: '4', sourceHandle: null, targetHandle: null }, nodes)).toBe(true);
  });

  it('should allow skip-level downstream connections', () => {
    // Manager -> Supervisor
    expect(validateConnection({ source: '1', target: '3', sourceHandle: null, targetHandle: null }, nodes)).toBe(true);
    // Manager -> Sector
    expect(validateConnection({ source: '1', target: '4', sourceHandle: null, targetHandle: null }, nodes)).toBe(true);
  });

  it('should allow upstream connections (bidirectional)', () => {
    // Coordinator -> Manager
    expect(validateConnection({ source: '2', target: '1', sourceHandle: null, targetHandle: null }, nodes)).toBe(true);
    // Sector -> Manager
    expect(validateConnection({ source: '4', target: '1', sourceHandle: null, targetHandle: null }, nodes)).toBe(true);
  });

  it('should allow peer connections (same level)', () => {
    // Manager -> Manager
    expect(validateConnection({ source: '1', target: '5', sourceHandle: null, targetHandle: null }, nodes)).toBe(true);
  });

  it('should handle missing nodes gracefully', () => {
    expect(validateConnection({ source: '99', target: '1', sourceHandle: null, targetHandle: null }, nodes)).toBe(false);
  });
});
