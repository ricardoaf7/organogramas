import React from 'react';
import { cn } from '@/lib/utils';
import { User, Briefcase, Building2, Users } from 'lucide-react';

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string, color: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.setData('application/reactflow-color', color);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Elementos</h2>
        <p className="text-sm text-gray-500">Arraste para adicionar</p>
      </div>
      
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hierarquia</h3>
          
          <div
            className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab hover:shadow-md transition-all"
            onDragStart={(event) => onDragStart(event, 'manager', 'Diretoria', '#bfdbfe')}
            draggable
          >
            <div className="p-2 bg-blue-500 rounded-md text-white">
              <User size={16} />
            </div>
            <div>
              <span className="text-sm font-medium text-blue-900 block">Diretoria</span>
              <span className="text-xs text-blue-700">Nível Estratégico</span>
            </div>
          </div>

          <div
            className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg cursor-grab hover:shadow-md transition-all"
            onDragStart={(event) => onDragStart(event, 'coordinator', 'Gerência', '#bbf7d0')}
            draggable
          >
            <div className="p-2 bg-green-500 rounded-md text-white">
              <Briefcase size={16} />
            </div>
            <div>
              <span className="text-sm font-medium text-green-900 block">Gerência</span>
              <span className="text-xs text-green-700">Nível Tático</span>
            </div>
          </div>

          <div
            className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg cursor-grab hover:shadow-md transition-all"
            onDragStart={(event) => onDragStart(event, 'supervisor', 'Coordenadoria', '#fed7aa')}
            draggable
          >
            <div className="p-2 bg-orange-500 rounded-md text-white">
              <Users size={16} />
            </div>
            <div>
              <span className="text-sm font-medium text-orange-900 block">Coordenadoria</span>
              <span className="text-xs text-orange-700">Nível Intermediário</span>
            </div>
          </div>

          <div
            className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg cursor-grab hover:shadow-md transition-all"
            onDragStart={(event) => onDragStart(event, 'sector', 'Setor', '#e9d5ff')}
            draggable
          >
            <div className="p-2 bg-purple-500 rounded-md text-white">
              <Building2 size={16} />
            </div>
            <div>
              <span className="text-sm font-medium text-purple-900 block">Setor</span>
              <span className="text-xs text-purple-700">Nível Operacional</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Organograma Builder v1.0
        </div>
      </div>
    </aside>
  );
};
