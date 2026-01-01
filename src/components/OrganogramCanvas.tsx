import React, { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useOrganogramStore from '@/store/useOrganogramStore';
import CustomNode from './nodes/CustomNode';

import { validateConnection } from '@/utils/validation';

const nodeTypes = {
  manager: CustomNode,
  coordinator: CustomNode,
  supervisor: CustomNode,
  sector: CustomNode,
};

export const OrganogramCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, duplicateNode } = useOrganogramStore();

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+D or Cmd+D for duplication
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        const selectedNode = nodes.find((n) => n.selected);
        if (selectedNode) {
          duplicateNode(selectedNode.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, duplicateNode]);

  const isValidConnection = useCallback(
    (connection: Connection) => validateConnection(connection, nodes),
    [nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');
      const color = event.dataTransfer.getData('application/reactflow-color');

      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return;
      }

      // We need to project the position to the React Flow coordinate system
      // Ideally we would use useReactFlow().project() but we are outside the provider here or need to wrap it.
      // For now, simple calculation (imperfect if zoomed)
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: any = {
        id: `node_${Date.now()}`,
        type, 
        position,
        data: { label: label, title: label, color, shape: 'rounded' },
      };

      addNode(newNode);
    },
    [addNode]
  );

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        fitView
        minZoom={0.05}
        maxZoom={2}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

// Wrap with Provider
export default function OrganogramCanvasWrapper() {
  return (
    <ReactFlowProvider>
      <OrganogramCanvas />
    </ReactFlowProvider>
  );
}
