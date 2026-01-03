import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Connection,
  EdgeChange,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { OrganogramNode, OrganogramEdge } from '@/types/organogram';
import { supabaseEnabled, supabase, DbOrganogram } from '@/lib/supabase';

interface HistoryState {
  past: { nodes: OrganogramNode[]; edges: OrganogramEdge[] }[];
  future: { nodes: OrganogramNode[]; edges: OrganogramEdge[] }[];
}

interface OrganogramState {
  nodes: OrganogramNode[];
  edges: OrganogramEdge[];
  history: HistoryState;
  isCropMode: boolean;
  currentOrganogramId?: string;
  
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  addNode: (node: OrganogramNode) => void;
  updateNodeData: (id: string, data: Partial<OrganogramNode['data']>) => void;
  updateNode: (id: string, nodeUpdates: Partial<OrganogramNode>) => void;
  updateEdge: (id: string, edgeUpdates: Partial<OrganogramEdge>) => void;
  deleteEdge: (id: string) => void;
  duplicateNode: (id: string) => void;
  deleteNode: (id: string) => void;
  setNodes: (nodes: OrganogramNode[]) => void;
  setEdges: (edges: OrganogramEdge[]) => void;
  toggleCropMode: (isActive: boolean) => void;
  createOrganogram: (name: string) => Promise<string | null>;
  listOrganograms: () => Promise<DbOrganogram[]>;
  loadOrganogram: (id: string) => Promise<boolean>;
  deleteOrganogram: (id: string) => Promise<boolean>;
  saveOrganogram: () => Promise<boolean>;
  saveVersion: () => Promise<boolean>;
  
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
}

const useOrganogramStore = create<OrganogramState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      history: { past: [], future: [] },
      isCropMode: false,
      currentOrganogramId: undefined,

      takeSnapshot: () => {
        const { nodes, edges, history } = get();
        // Limit history size to 50
        const newPast = [...history.past, { nodes, edges }].slice(-50);
        set({
          history: {
            past: newPast,
            future: [],
          },
        });
      },

      undo: () => {
        set((state) => {
          const { past, future } = state.history;
          if (past.length === 0) return state;

          const previous = past[past.length - 1];
          const newPast = past.slice(0, past.length - 1);

          return {
            nodes: previous.nodes,
            edges: previous.edges,
            history: {
              past: newPast,
              future: [{ nodes: state.nodes, edges: state.edges }, ...future],
            },
          };
        });
      },

      redo: () => {
        set((state) => {
          const { past, future } = state.history;
          if (future.length === 0) return state;

          const next = future[0];
          const newFuture = future.slice(1);

          return {
            nodes: next.nodes,
            edges: next.edges,
            history: {
              past: [...past, { nodes: state.nodes, edges: state.edges }],
              future: newFuture,
            },
          };
        });
      },

      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes) as OrganogramNode[],
        });
      },

      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection: Connection) => {
        get().takeSnapshot();
        set({
          edges: addEdge(connection, get().edges),
        });
      },

      addNode: (node: OrganogramNode) => {
        get().takeSnapshot();
        set({
          nodes: [...get().nodes, node],
        });
      },

      updateNodeData: (id: string, data: Partial<OrganogramNode['data']>) => {
        get().takeSnapshot();
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              };
            }
            return node;
          }),
        });
      },

      updateNode: (id: string, nodeUpdates: Partial<OrganogramNode>) => {
        get().takeSnapshot();
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return { ...node, ...nodeUpdates };
            }
            return node;
          }),
        });
      },

      updateEdge: (id: string, edgeUpdates: Partial<OrganogramEdge>) => {
        get().takeSnapshot();
        set({
          edges: get().edges.map((edge) => {
            if (edge.id === id) {
              return { ...edge, ...edgeUpdates };
            }
            return edge;
          }),
        });
      },

      deleteEdge: (id: string) => {
        get().takeSnapshot();
        set({
          edges: get().edges.filter((edge) => edge.id !== id),
        });
      },

      duplicateNode: (id: string) => {
        get().takeSnapshot();
        const nodeToDuplicate = get().nodes.find((n) => n.id === id);
        
        if (!nodeToDuplicate) return;

        const newNode: OrganogramNode = {
          ...nodeToDuplicate,
          id: `node_${Date.now()}`,
          position: {
            x: nodeToDuplicate.position.x + 20,
            y: nodeToDuplicate.position.y + 20,
          },
          selected: true, // Select the new node
          data: {
            ...nodeToDuplicate.data,
            title: `${nodeToDuplicate.data.title} (Cópia)`,
          },
        };

        set({
          nodes: [
            ...get().nodes.map(n => ({ ...n, selected: false })), // Deselect others
            newNode
          ],
        });
      },

      deleteNode: (id: string) => {
        get().takeSnapshot();
        set({
          nodes: get().nodes.filter((node) => node.id !== id),
          edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
        });
      },

      setNodes: (nodes: OrganogramNode[]) => set({ nodes }),
      setEdges: (edges: OrganogramEdge[]) => set({ edges }),
      toggleCropMode: (isActive: boolean) => set({ isCropMode: isActive }),

      createOrganogram: async (name: string) => {
        if (!supabaseEnabled || !supabase) {
          set({ currentOrganogramId: 'local' });
          return 'local';
        }
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return null;
        const payload = {
          owner_id: user.id,
          name,
          data_json: { nodes: [], edges: [], metadata: {} },
          is_public: false,
        };
        const { data, error } = await supabase.from('organograms').insert(payload).select().single();
        if (error) {
          console.error('Create Organogram Error:', error);
          return null;
        }
        set({ currentOrganogramId: data.id, nodes: [], edges: [] });
        return data.id as string;
      },

      importOrganogram: async (name: string, nodes: OrganogramNode[], edges: OrganogramEdge[]) => {
        if (!supabaseEnabled || !supabase) return false;
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return false;

        const payload = {
          owner_id: user.id,
          name,
          data_json: { nodes, edges, metadata: {} },
          is_public: false,
        };
        
        const { error } = await supabase.from('organograms').insert(payload);
        
        if (error) {
          console.error('Import Organogram Error:', error);
          return false;
        }
        return true;
      },

      listOrganograms: async () => {
        if (!supabaseEnabled || !supabase) return [];
        const user = (await supabase.auth.getUser()).data.user;
        const { data, error } = await supabase
          .from('organograms')
          .select('*')
          .or(`owner_id.eq.${user?.id},is_public.eq.true`)
          .order('updated_at', { ascending: false });
          
        if (error) console.error('List Organograms Error:', error);
        return (data || []) as DbOrganogram[];
      },

      loadOrganogram: async (id: string) => {
        if (!supabaseEnabled || !supabase) return false;
        const { data, error } = await supabase
          .from('organograms')
          .select('data_json')
          .eq('id', id)
          .single();
        if (error || !data?.data_json) {
            console.error('Load Organogram Error:', error);
            return false;
        }
        const payload = data.data_json;
        set({ nodes: payload.nodes as OrganogramNode[], edges: payload.edges as OrganogramEdge[], currentOrganogramId: id });
        return true;
      },

      saveOrganogram: async () => {
        const { nodes, edges, currentOrganogramId } = get();
        
        // If no cloud ID is set, create a new one automatically or prompt user
        if (!supabaseEnabled || !supabase) return false;
        
        if (!currentOrganogramId || currentOrganogramId === 'local') {
            // Create new if trying to save cloud for first time
            const name = prompt('Nome para salvar no Supabase:') || 'Meu Organograma';
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) return false;

            const payload = {
                owner_id: user.id,
                name,
                data_json: { nodes, edges, metadata: {} },
                is_public: false,
            };
            const { data, error } = await supabase.from('organograms').insert(payload).select().single();
            if (error) {
                console.error('Save New Error:', error);
                return false;
            }
            set({ currentOrganogramId: data.id });
            return true;
        }

        const { error } = await supabase
          .from('organograms')
          .update({ 
            data_json: { nodes, edges, metadata: {} },
            updated_at: new Date().toISOString()
           })
          .eq('id', currentOrganogramId);
        
        if (error) console.error('Update Error:', error);
        return !error;
      },

      deleteOrganogram: async (id: string) => {
        if (!supabaseEnabled || !supabase) return false;
        const { error } = await supabase
          .from('organograms')
          .delete()
          .eq('id', id);
        if (error) {
          console.error('Delete Organogram Error:', error);
          return false;
        }
        // If we deleted the current one, reset the current ID but keep data locally
        if (get().currentOrganogramId === id) {
          set({ currentOrganogramId: undefined });
        }
        return true;
      },
      
      saveVersion: async () => {
        const { nodes, edges, currentOrganogramId } = get();
        if (!supabaseEnabled || !supabase || !currentOrganogramId || currentOrganogramId === 'local') return false;
        const user = (await supabase.auth.getUser()).data.user;
        const { error } = await supabase
          .from('organogram_versions')
          .insert({
            organogram_id: currentOrganogramId,
            data_json: { nodes, edges, metadata: {} },
            created_by: user?.id,
          });
        return !error;
      },
    }),
    {
      name: 'organogram-storage',
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges }), // Don't persist history to avoid storage limit
    }
  )
);

export default useOrganogramStore;
