Passo a passo para concluir a integração:

## 1) Configurar Variáveis de Ambiente
- Local: crie `.env.local` na raiz com:
  - `VITE_SUPABASE_URL=<url_do_projeto>`
  - `VITE_SUPABASE_ANON_KEY=<anon_key>`
- Vercel: Project → Settings → Environment Variables → adicione as mesmas chaves para Production/Preview.

## 2) Aplicar o Schema
- No dashboard do Supabase → SQL Editor → cole o conteúdo de [schema.sql](file:///c:/Users/ricar/Documents/trae_projects/organograma/supabase/schema.sql) → Executar.
- Isso cria: `profiles`, `organograms`, `organogram_versions`, índices e políticas RLS.

## 3) Configurar Auth
- Settings → Authentication:
  - Ativar Email/Password e Magic Link.
  - (Opcional) Exigir confirmação de email.
  - Definir `SITE_URL` (sua URL local ou da Vercel) e Redirect URLs.

## 4) Habilitar Login no App
- Implementar telas simples de Login/Cadastro (email+senha e magic link).
- Após login, garantir que exista perfil em `profiles` (upsert com user id/email).
- Bloquear operações de Supabase quando não houver usuário, usando fallback local.

## 5) Conectar Fluxos do Editor
- Botões já prontos: "Novo", "Abrir", "Salvar Versão".
- Validar que:
  - `Novo` cria registro em `organograms` para o usuário logado.
  - `Abrir` lista organogramas do usuário (ou públicos) e carrega `nodes/edges`.
  - `Salvar Versão` insere snapshot em `organogram_versions`.

## 6) Validação
- Testar local: reinicie `npm run dev` após criar `.env.local`.
- Criar/abrir/salvar com usuário logado.
- RLS: tente acessar com outro usuário; não deve ver dados do primeiro.

Se aprovar, eu implemento o Login/Cadastro e o upsert de perfil, e deixo o fluxo todo operacional.