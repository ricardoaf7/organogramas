import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import OrganogramCanvasWrapper from '@/components/OrganogramCanvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { CropOverlay, CropAction, CropOptions } from '@/components/CropOverlay';
import { OpenDialog } from '@/components/OpenDialog';
import useOrganogramStore from '@/store/useOrganogramStore';
import { downloadOrganogram, printOrganogram, copyOrganogramToClipboard, downloadOrganogramVectorPdf } from '@/utils/download';

export const Editor = () => {
  const { 
    undo, redo, history, duplicateNode, 
    nodes, edges, deleteNode, deleteEdge, 
    isCropMode, toggleCropMode 
  } = useOrganogramStore();
  const [openDialog, setOpenDialog] = useState(false);

  const selectedNode = nodes.find(n => n.selected);
  const selectedEdge = edges.find(e => e.selected);

  const handleDuplicate = () => {
    if (selectedNode) {
      duplicateNode(selectedNode.id);
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      if (confirm('Tem certeza que deseja remover este elemento?')) {
        deleteNode(selectedNode.id);
      }
    } else if (selectedEdge) {
      if (confirm('Tem certeza que deseja remover esta conexão?')) {
        deleteEdge(selectedEdge.id);
      }
    }
  };

  const handleExport = async (format: 'pdf' | 'svg' | 'png') => {
    // If crop mode is active, we don't export via this button typically,
    // but if the user clicks it, we could export the full view.
    // For now, let's assume this button does the auto-export.
    await downloadOrganogram(format);
  };
  
  const handleCropConfirm = async (
    bounds: { x: number; y: number; width: number; height: number },
    action: CropAction,
    options?: CropOptions
  ) => {
    try {
      if (action === 'print') {
        await printOrganogram(bounds, options);
      } else if (action === 'copy') {
        const success = await copyOrganogramToClipboard(bounds, options);
        if (success) {
          alert('Área copiada para a área de transferência!');
        } else {
          alert('Falha ao copiar. Tente novamente.');
        }
      } else if (action === 'pdf') {
        await downloadOrganogramVectorPdf(bounds);
      } else if (action === 'png') {
        await downloadOrganogram('png', bounds, options);
      }
    } catch (error) {
      console.error('Erro na ação de recorte:', error);
      alert('Ocorreu um erro ao processar a seleção.');
    } finally {
      toggleCropMode(false);
    }
  };

  const handleSave = () => {
    const store = useOrganogramStore.getState();
    store.takeSnapshot();
    alert('Organograma salvo localmente!');
  };

  const handleNew = async () => {
    const name = prompt('Nome do novo organograma:') || 'Organograma';
    const id = await useOrganogramStore.getState().createOrganogram(name);
    if (id) alert('Organograma criado: ' + name);
  };

  const handleOpen = async () => {
    setOpenDialog(true);
  };

  const handleOpenSelect = async (id: string) => {
    const ok = await useOrganogramStore.getState().loadOrganogram(id);
    setOpenDialog(false);
    if (!ok) alert('Falha ao abrir organograma.');
  };

  const handleSaveVersion = async () => {
    const ok = await useOrganogramStore.getState().saveVersion();
    if (ok) alert('Versão salva!');
    else alert('Falha ao salvar versão.');
  };

  return (
    <Layout
      toolbarProps={{
        onUndo: undo,
        onRedo: redo,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
        onExport: handleExport,
        onSave: handleSave,
        onNew: handleNew,
        onOpen: handleOpen,
        onSaveVersion: handleSaveVersion,
        onDuplicate: handleDuplicate,
        onDelete: handleDelete,
        onToggleCrop: () => toggleCropMode(!isCropMode),
        hasSelection: !!selectedNode || !!selectedEdge,
        isCropMode: isCropMode,
      }}
    >
      <div className="relative w-full h-full">
        <OrganogramCanvasWrapper />
        {isCropMode && (
          <CropOverlay 
            onConfirm={handleCropConfirm} 
            onCancel={() => toggleCropMode(false)} 
          />
        )}
        <OpenDialog open={openDialog} onClose={() => setOpenDialog(false)} onSelect={handleOpenSelect} />
        <PropertyPanel />
      </div>
    </Layout>
  );
};
