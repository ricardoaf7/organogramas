import React from 'react';
import { Undo, Redo, Download, Printer, Save, Copy, Trash2, Crop, Plus, FolderOpen, PlusCircle, FileJson, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onExport?: (format: 'pdf' | 'svg' | 'png') => void;
  onSave?: () => void;
  onCloudSave?: () => void;
  onNew?: () => void;
  onOpen?: () => void;
  onSaveVersion?: () => void;
  onExportJson?: () => void;
  onImportJson?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onToggleCrop?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelection?: boolean;
  isCropMode?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onUndo,
  onRedo,
  onExport,
  onSave,
  onCloudSave,
  onNew,
  onOpen,
  onSaveVersion,
  onExportJson,
  onImportJson,
  onDuplicate,
  onDelete,
  onToggleCrop,
  canUndo = false,
  canRedo = false,
  hasSelection = false,
  isCropMode = false,
}) => {
  return (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 shadow-sm z-10 relative">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-800 mr-4">Organograma</h1>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <button
          onClick={onNew}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
          title="Novo Organograma"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={onOpen}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
          title="Abrir Organograma"
        >
          <FolderOpen size={18} />
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <button
          onClick={onExportJson}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
          title="Exportar Arquivo (Backup JSON)"
        >
          <FileJson size={18} />
        </button>
        <button
          onClick={onImportJson}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
          title="Importar Arquivo (Backup JSON)"
        >
          <Upload size={18} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            "p-2 rounded-md transition-colors",
            canUndo 
              ? "hover:bg-gray-100 text-gray-700" 
              : "text-gray-300 cursor-not-allowed"
          )}
          title="Desfazer"
        >
          <Undo size={18} />
        </button>
        
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            "p-2 rounded-md transition-colors",
            canRedo 
              ? "hover:bg-gray-100 text-gray-700" 
              : "text-gray-300 cursor-not-allowed"
          )}
          title="Refazer"
        >
          <Redo size={18} />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2" />

        <button
          onClick={onDuplicate}
          disabled={!hasSelection}
          className={cn(
            "p-2 rounded-md transition-colors flex items-center gap-2",
            hasSelection 
              ? "hover:bg-gray-100 text-gray-700" 
              : "text-gray-300 cursor-not-allowed"
          )}
          title="Duplicar (Ctrl+D)"
        >
          <Copy size={18} />
          <span className="text-sm font-medium hidden sm:inline">Duplicar</span>
        </button>

        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className={cn(
            "p-2 rounded-md transition-colors flex items-center gap-2",
            hasSelection 
              ? "hover:bg-red-50 text-red-600" 
              : "text-gray-300 cursor-not-allowed"
          )}
          title="Excluir (Delete)"
        >
          <Trash2 size={18} />
          <span className="text-sm font-medium hidden sm:inline">Excluir</span>
        </button>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />

        <button
          onClick={onToggleCrop}
          className={cn(
            "p-2 rounded-md transition-colors flex items-center gap-2",
            isCropMode
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
              : "text-gray-700 hover:bg-gray-100"
          )}
          title="Ferramenta de Recorte"
        >
          <Crop size={18} />
          <span className="text-sm font-medium hidden sm:inline">Recortar</span>
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2" />

        <button
          onClick={onSave}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors ml-1"
          title="Salvar Localmente"
        >
          <Save size={18} />
        </button>
        <button
          onClick={onCloudSave}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors ml-1"
          title="Salvar no Supabase"
        >
          <Save size={18} />
          <span className="text-sm ml-1 hidden sm:inline">Cloud</span>
        </button>
        <button
          onClick={onSaveVersion}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors ml-1"
          title="Salvar Versão (Snapshot)"
        >
          <PlusCircle size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onExport?.('pdf')}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all flex items-center gap-2"
          >
            <Download size={14} />
            PDF
          </button>
          <button
            onClick={() => onExport?.('svg')}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all flex items-center gap-2"
          >
            <Download size={14} />
            SVG
          </button>
        </div>
        
        <button
          onClick={() => window.print()}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
          title="Imprimir"
        >
          <Printer size={18} />
        </button>
      </div>
    </div>
  );
};
