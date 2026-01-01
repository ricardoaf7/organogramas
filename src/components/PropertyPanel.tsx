import React, { useMemo } from 'react';
import useOrganogramStore from '@/store/useOrganogramStore';
import { X, Trash2 } from 'lucide-react';
import { MarkerType } from 'reactflow';
import { PALETTES, PaletteKey, getColorForType } from '@/utils/colors';

export const PropertyPanel = () => {
  const { nodes, edges, updateNodeData, updateNode, updateEdge, deleteEdge, deleteNode } = useOrganogramStore();

  const selectedNode = useMemo(() => 
    nodes.find((node) => node.selected), 
    [nodes]
  );

  const selectedEdge = useMemo(() => 
    edges.find((edge) => edge.selected), 
    [edges]
  );

  if (!selectedNode && !selectedEdge) {
    return null;
  }

  // --- EDGE SETTINGS ---
  if (selectedEdge) {
    const handleEdgeChange = (field: string, value: any) => {
      updateEdge(selectedEdge.id, { [field]: value });
    };

    const handleStyleChange = (field: string, value: any) => {
      updateEdge(selectedEdge.id, {
        style: {
          ...selectedEdge.style,
          [field]: value
        }
      });
    };

    const handleDeleteEdge = () => {
      if (confirm('Tem certeza que deseja remover esta conexão?')) {
        deleteEdge(selectedEdge.id);
      }
    };

    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col shadow-lg absolute right-0 top-0 z-20">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="font-semibold text-gray-800">Conexão</h2>
          <button 
            onClick={handleDeleteEdge}
            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
            title="Deletar conexão"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rótulo</label>
            <input
              type="text"
              value={selectedEdge.label as string || ''}
              onChange={(e) => handleEdgeChange('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ex: Subordinado a"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo de Linha</label>
            <select
              value={selectedEdge.type || 'default'}
              onChange={(e) => handleEdgeChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="default">Bezier (Curva)</option>
              <option value="straight">Reta</option>
              <option value="step">Step (Degraus)</option>
              <option value="smoothstep">Smooth Step (Suave)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Animação</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edge-animated"
                checked={selectedEdge.animated || false}
                onChange={(e) => handleEdgeChange('animated', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="edge-animated" className="text-sm text-gray-600">Animar fluxo</label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Estilo</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Cor</label>
                <input 
                  type="color" 
                  value={selectedEdge.style?.stroke || '#b1b1b7'}
                  onChange={(e) => handleStyleChange('stroke', e.target.value)}
                  className="h-8 w-full cursor-pointer rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Espessura</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={selectedEdge.style?.strokeWidth || 1}
                  onChange={(e) => handleStyleChange('strokeWidth', parseInt(e.target.value))}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- NODE SETTINGS ---
  const { title, description, color, shape, lineHeight } = selectedNode.data;
  const width = selectedNode.style?.width || selectedNode.width;
  const height = selectedNode.style?.height || selectedNode.height;

  const handleChange = (field: string, value: string | number) => {
    updateNodeData(selectedNode.id, { [field]: value });
  };

  const handleStyleChange = (field: 'width' | 'height', value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateNode(selectedNode.id, {
        style: {
          ...selectedNode.style,
          [field]: numValue
        }
      });
    }
  };

  const handleDeleteNode = () => {
    if (confirm('Tem certeza que deseja remover este elemento?')) {
      deleteNode(selectedNode.id);
    }
  };

  const handlePaletteSelect = (paletteKey: PaletteKey) => {
    if (!selectedNode) return;
    const newColor = getColorForType(paletteKey, selectedNode.type || 'sector');
    updateNodeData(selectedNode.id, { color: newColor });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col shadow-lg absolute right-0 top-0 z-20">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="font-semibold text-gray-800">Propriedades</h2>
        <button 
          onClick={handleDeleteNode}
          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
          title="Deletar elemento"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Esquema de Cores</label>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(PALETTES) as PaletteKey[]).map((key) => (
              <button
                key={key}
                onClick={() => handlePaletteSelect(key)}
                className="w-full aspect-square rounded-md border border-gray-300 shadow-sm hover:scale-105 transition-transform flex items-center justify-center text-[10px] font-bold text-white/90 uppercase overflow-hidden"
                style={{ backgroundColor: PALETTES[key].colors.coordinator }}
                title={`Aplicar paleta ${PALETTES[key].name}`}
              >
                {PALETTES[key].name.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Diretoria"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Descrição / Subtítulo</label>
          <input
            type="text"
            value={description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Nível Estratégico"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cor de Fundo</label>
          <div className="flex gap-2 flex-wrap">
            {['#bfdbfe', '#bbf7d0', '#e9d5ff', '#fecaca', '#fde68a', '#e5e7eb', '#ffffff'].map((c) => (
              <button
                key={c}
                className={`w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${color === c ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => handleChange('color', c)}
                title={c}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
             <input 
                type="color" 
                value={color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="h-8 w-full cursor-pointer"
             />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Dimensões (px)</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Largura</label>
              <input
                type="number"
                value={typeof width === 'number' ? width : ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Auto"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Altura</label>
              <input
                type="number"
                value={typeof height === 'number' ? height : ''}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Auto"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Espaçamento de Texto</label>
          <div className="flex items-center gap-2">
             <input
               type="range"
               min="1"
               max="2.5"
               step="0.1"
               value={lineHeight || 1.5}
               onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
               className="flex-1"
             />
             <span className="text-xs text-gray-500 w-8 text-right">
               {lineHeight || 1.5}x
             </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Formato</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleChange('shape', 'rectangle')}
              className={`p-2 border rounded-md text-xs hover:bg-gray-50 ${shape === 'rectangle' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'}`}
            >
              Retângulo
            </button>
            <button
              onClick={() => handleChange('shape', 'rounded')}
              className={`p-2 border rounded-md text-xs hover:bg-gray-50 ${shape === 'rounded' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'}`}
            >
              Arredondado
            </button>
            <button
              onClick={() => handleChange('shape', 'circle')}
              className={`p-2 border rounded-md text-xs hover:bg-gray-50 ${shape === 'circle' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'}`}
            >
              Círculo
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        Selecione um elemento para editar
      </div>
    </div>
  );
};
