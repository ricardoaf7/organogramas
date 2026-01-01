**Objetivo**
- Substituir o armazenamento local por banco de dados no Supabase, com autenticação, versões e compartilhamento.
- Publicar o app na Vercel com variáveis de ambiente seguras.

**Arquitetura de Dados (Supabase)**
- Tabelas:
  - profiles: user_id (uuid, PK), email, name, created_at.
  - organograms: id (uuid, PK), owner_id (uuid, FK profiles), name, created_at, updated_at, is_public (bool).
  - organogram_versions: id (uuid, PK), organogram_id (FK), nodes_json (jsonb), edges_json (jsonb), metadata_json (jsonb), created_at, created_by (uuid FK profiles).
  - shares: id (uuid, PK), organogram_id (FK), user_id (FK profiles), role (viewer|editor), created_at.
- Índices: por owner_id; por organogram_id.
- Vantagem: versões permitem histórico/rollback; jsonb evita normalização complexa e mantém performance boa.

**Row-Level Security (RLS) e Políticas**
- Ativar RLS em todas as tabelas.
- Políticas:
  - profiles: usuário só lê/edita seu próprio perfil.
  - organograms: owner e quem estiver em shares com editor podem inserir/atualizar; viewers podem selecionar.
  - organogram_versions: selecionar para quem tem acesso ao organogram; inserir para owner/editor.
  - shares: somente owner pode criar/remover.

**Autenticação**
- Fluxos suportados: email+senha e magic link.
- UI mínima: login, cadastro, esqueci a senha.
- Sincronizar profiles na primeira autenticação.

**Cliente Supabase**
- Arquivo: src/lib/supabase.ts com createClient usando envs:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- Nunca usar service role no cliente.

**Persistência no App**
- Onde integrar:
  - Salvar/Carregar no store: [useOrganogramStore.ts](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/store/useOrganogramStore.ts)
    - Adicionar ações: loadOrganogram(id), saveOrganogram(id), createOrganogram(name), listOrganograms(), createVersion(id).
    - Mapear store → jsonb (nodes, edges, metadata: zoom, viewport, tema de cor, etc.).
  - Na página Editor: [Editor.tsx](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/pages/Editor.tsx)
    - Botões “Novo”, “Abrir”, “Salvar”, “Salvar versão” (snapshot), “Compartilhar”.
    - Modal de abertura com listagem paginada do usuário; busca por nome.

**Colaboração/Realtime (Opcional Fase 2)**
- Supabase Realtime em canal por organogram_id (broadcast de mudanças do store).
- Estratégia: throttle das mudanças e merge no cliente.

**Exportações**
- Continuar gerando PNG/JPEG/SVG/PDF localmente.
- (Opcional) Upload de anexos para storage do Supabase (pastas por organogram_id) com URL pública/assinada.

**Deploy na Vercel**
- Passos:
  - Criar projeto Vercel e conectar ao repositório.
  - Configurar envs (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) no dashboard da Vercel.
  - Build: `npm run build` (Vite) já configurado.
  - Preview/Prod automáticos por branches.

**Segurança**
- RLS ativo em todas as tabelas.
- Políticas por owner/compartilhamento.
- Sem service role no frontend.
- Sanitização de entradas (names, metadata).

**Entrega por Etapas**
1. Criar schema e políticas no Supabase.
2. Adicionar cliente e envs.
3. Implementar CRUD (create/list/load/save) no store e UI básica.
4. Testar persistência, versões e compartilhamento.
5. Deploy na Vercel com envs.
6. (Opcional) Realtime e storage de anexos.

**Validação**
- Testes manuais: criar novo, salvar, abrir em outra sessão, compartilhar viewer/editor.
- Testar RLS: usuário sem acesso não vê registros.
- Verificar build e variáveis na Vercel.

Aprovar para eu começar a implementar? 