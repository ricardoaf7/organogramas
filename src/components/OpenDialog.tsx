import { Trash2 } from 'lucide-react';
import useOrganogramStore from '@/store/useOrganogramStore';

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
  const { deleteOrganogram } = useOrganogramStore();

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

  useEffect(() => {
    fetchItems();
  }, [open]);

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir "${name}" permanentemente?`)) {
      const ok = await deleteOrganogram(id);
      if (ok) {
        fetchItems(); // Refresh list
      } else {
        alert('Erro ao excluir organograma.');
      }
    }
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-[600px] max-w-[90%]" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Abrir Organograma</h3>
          {supabaseEnabled && (
            <button
                onClick={handleImportClick}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                title="Importar backup JSON para a nuvem"
            >
                <Upload size={16} />
                Importar Backup
            </button>
          )}
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
              <li key={item.id} className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group" onClick={() => onSelect(item.id)}>
                <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-500">Atualizado: {new Date(item.updated_at).toLocaleString()}</div>
                </div>
                <button 
                    onClick={(e) => handleDelete(e, item.id, item.name)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                    title="Excluir"
                >
                    <Trash2 size={16} />
                </button>
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

