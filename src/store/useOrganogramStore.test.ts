import { describe, it, expect, beforeEach } from 'vitest';
import useOrganogramStore from './useOrganogramStore';

describe('useOrganogramStore', () => {
  beforeEach(() => {
    useOrganogramStore.setState({
      nodes: [],
      edges: [],
      history: { past: [], future: [] },
    });
  });

  it('should add a node', () => {
    const node = {
      id: '1',
      type: 'manager',
      position: { x: 0, y: 0 },
      data: { title: 'Test', color: '#000', shape: 'rounded' },
    } as any;

    useOrganogramStore.getState().addNode(node);
    expect(useOrganogramStore.getState().nodes).toHaveLength(1);
    expect(useOrganogramStore.getState().nodes[0]).toEqual(node);
  });

  it('should update node data', () => {
    const node = {
      id: '1',
      type: 'manager',
      position: { x: 0, y: 0 },
      data: { title: 'Test', color: '#000', shape: 'rounded' },
    } as any;

    useOrganogramStore.getState().addNode(node);
    useOrganogramStore.getState().updateNodeData('1', { title: 'Updated' });

    expect(useOrganogramStore.getState().nodes[0].data.title).toBe('Updated');
  });

  it('should handle undo', () => {
    const node1 = {
        id: '1',
        type: 'manager',
        position: { x: 0, y: 0 },
        data: { title: 'Test', color: '#000', shape: 'rounded' },
      } as any;

    useOrganogramStore.getState().addNode(node1);
    // addNode takes snapshot automatically in implementation?
    // Let's check implementation. yes: get().takeSnapshot(); set(...)
    
    expect(useOrganogramStore.getState().history.past).toHaveLength(1); // Initial state was empty

    useOrganogramStore.getState().undo();
    expect(useOrganogramStore.getState().nodes).toHaveLength(0);
  });
});
