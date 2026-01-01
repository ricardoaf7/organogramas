import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { cn } from '@/lib/utils';
import { OrganogramNodeData } from '@/types/organogram';
import useOrganogramStore from '@/store/useOrganogramStore';
import { getContrastColor } from '@/utils/colors';

const CustomNode = ({ id, data, selected }: NodeProps<OrganogramNodeData>) => {
  const { title, description, color, shape = 'rounded', lineHeight } = data;
  const { takeSnapshot } = useOrganogramStore();

  const textColor = getContrastColor(color);

  const shapeStyles = {
    rectangle: 'rounded-none',
    rounded: 'rounded-lg',
    circle: 'rounded-full aspect-square flex items-center justify-center text-center p-6',
  };

  return (
    <>
      <NodeResizer 
        isVisible={selected} 
        minWidth={100} 
        minHeight={50}
        onResizeEnd={() => takeSnapshot()}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-2 border-blue-400 rounded"
      />
      <div
        className={cn(
          "shadow-md border-2 min-w-[180px] h-full w-full transition-all duration-200 overflow-hidden",
          shapeStyles[shape],
          selected ? "border-black shadow-lg ring-2 ring-black/10" : "border-transparent",
          "relative group flex flex-col justify-center"
        )}
        style={{ 
          backgroundColor: color,
          lineHeight: lineHeight ? `${lineHeight}` : '1.5',
          color: textColor,
          borderColor: selected ? 'black' : 'rgba(0,0,0,0.1)' // Ensure border visibility on light backgrounds
        }}
      >
        {/* Top Handles */}
        <Handle type="target" position={Position.Top} id="target-top" className="w-3 h-3 !bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity !left-1/3" />
        <Handle type="source" position={Position.Top} id="source-top" className="w-3 h-3 !bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity !left-2/3" />

        {/* Right Handles */}
        <Handle type="target" position={Position.Right} id="target-right" className="w-3 h-3 !bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity !top-1/3" />
        <Handle type="source" position={Position.Right} id="source-right" className="w-3 h-3 !bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity !top-2/3" />
        
        <div className="p-3 break-words hyphens-auto w-full">
          <div className="font-bold text-sm" style={{ color: textColor }}>{title}</div>
          {description && (
            <div className="text-xs mt-1 opacity-90" style={{ color: textColor }}>{description}</div>
          )}
        </div>

        {/* Bottom Handles */}
        <Handle type="source" position={Position.Bottom} id="source-bottom" className="w-3 h-3 !bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity !left-1/3" />
        <Handle type="target" position={Position.Bottom} id="target-bottom" className="w-3 h-3 !bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity !left-2/3" />

        {/* Left Handles */}
        <Handle type="target" position={Position.Left} id="target-left" className="w-3 h-3 !bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity !top-1/3" />
        <Handle type="source" position={Position.Left} id="source-left" className="w-3 h-3 !bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity !top-2/3" />
      </div>
    </>
  );
};

export default memo(CustomNode);
