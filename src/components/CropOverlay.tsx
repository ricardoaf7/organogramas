import React, { useState, useRef, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { Check, X, Printer, FileDown, Image, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CropAction = 'print' | 'pdf' | 'png' | 'copy';
export type CropOptions = { scale?: number; transparent?: boolean; quality?: number };

interface CropOverlayProps {
  onConfirm: (bounds: { x: number; y: number; width: number; height: number }, action: CropAction, options?: CropOptions) => void;
  onCancel: () => void;
}

export const CropOverlay: React.FC<CropOverlayProps> = ({ onConfirm, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(3);
  const [transparent, setTransparent] = useState<boolean>(false);
  const [jpegQuality, setJpegQuality] = useState<number>(0.9);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPos({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calculate selection rectangle
  const x = Math.min(startPos.x, currentPos.x);
  const y = Math.min(startPos.y, currentPos.y);
  const width = Math.abs(currentPos.x - startPos.x);
  const height = Math.abs(currentPos.y - startPos.y);
  
  const hasSelection = width > 10 && height > 10;

  const handleAction = (action: CropAction) => {
    if (!hasSelection || !containerRef.current) return;
    const options: CropOptions = { scale, transparent, quality: jpegQuality };
    onConfirm({ x, y, width, height }, action, options);
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-50 cursor-crosshair select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Semi-transparent background overlay with a hole */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none">
        {hasSelection && (
          <div 
            style={{ 
              position: 'absolute',
              left: x,
              top: y,
              width: width,
              height: height,
              backgroundColor: 'transparent',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)', // The "hole" effect
              border: '2px solid white',
            }}
          />
        )}
      </div>
      
      {/* Action Menu UI */}
      {hasSelection && !isDragging && (
        <div 
          style={{ 
            position: 'absolute',
            left: Math.max(10, Math.min(x, window.innerWidth - 320)), // Keep within bounds
            top: y + height + 10,
          }}
          className="flex gap-1 pointer-events-auto bg-white p-2 rounded-lg shadow-xl border border-gray-200"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 mr-2">
            <label className="text-xs text-gray-600">Resolução</label>
            <select
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value, 10))}
              className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1"
              aria-label="Resolução de exportação"
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={4}>4x</option>
            </select>
            <label className="flex items-center gap-1 text-xs text-gray-600 ml-2">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                aria-label="Fundo transparente (PNG)"
              />
              Transparente
            </label>
            <div className="flex items-center gap-1 ml-2">
              <label className="text-xs text-gray-600">JPEG</label>
              <select
                value={jpegQuality}
                onChange={(e) => setJpegQuality(parseFloat(e.target.value))}
                className="text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1"
                aria-label="Qualidade JPEG"
              >
                <option value={0.8}>80%</option>
                <option value={0.9}>90%</option>
                <option value={1}>100%</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => handleAction('print')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Imprimir Seleção"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
          
          <div className="w-px bg-gray-300 mx-1 my-1" />

          <button
            onClick={() => handleAction('pdf')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Exportar PDF"
          >
            <FileDown size={16} />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={() => handleAction('png')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Exportar PNG"
          >
            <Image size={16} />
            <span className="hidden sm:inline">PNG</span>
          </button>

          <div className="w-px bg-gray-300 mx-1 my-1" />

          <button
            onClick={() => handleAction('copy')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Copiar para Área de Transferência"
          >
            <Copy size={16} />
            <span className="hidden sm:inline">Copiar</span>
          </button>

          <div className="w-px bg-gray-300 mx-1 my-1" />

          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Cancelar"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* Instructions */}
      {!hasSelection && !isDragging && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm pointer-events-none">
          Arraste para selecionar a área
        </div>
      )}
    </div>
  );
};
