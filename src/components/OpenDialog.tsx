import React, { useEffect, useState } from 'react';
import { supabaseEnabled, supabase, DbOrganogram } from '@/lib/supabase';

interface OpenDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const OpenDialog: React.FC<OpenDialogProps> = ({ open, onClose, onSelect }) => {
  const [items, setItems] = useState<DbOrganogram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      if (!open) return;
      if (!supabaseEnabled || !supabase) {
        setItems([]);
        return;
      }
      setLoading(true);
      setError(null);
      const user = (await supabase.auth.getUser()).data.user;
      const { data, error } = await supabase
        .from('organograms')
        .select('*')
        .or(`owner_id.eq.${user?.id},is_public.eq.true`)
        .order('updated_at', { ascending: false });
      if (error) setError(error.message);
      setItems((data || []) as DbOrganogram[]);
      setLoading(false);
    };
    fetchItems();
  }, [open]);

  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-[600px] max-w-[90%]" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Abrir Organograma</h3>
        </div>
        <div className="p-4">
          {!supabaseEnabled && (
            <div className="text-sm text-red-600 mb-3">
              Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para listar seus organogramas.
            </div>
          )}
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3"
            placeholder="Buscar por nome…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <div className="text-sm text-gray-600">Carregando…</div>}
          {error && <div className="text-sm text-red-600">Erro: {error}</div>}
          <ul className="max-h-64 overflow-auto divide-y divide-gray-200">
            {filtered.map((item) => (
              <li key={item.id} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(item.id)}>
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-xs text-gray-500">Atualizado: {new Date(item.updated_at).toLocaleString()}</div>
              </li>
            ))}
            {filtered.length === 0 && !loading && (
              <li className="p-3 text-sm text-gray-600">Nenhum organograma encontrado.</li>
            )}
          </ul>
        </div>
        <div className="p-3 border-t border-gray-200 flex justify-end">
          <button className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

