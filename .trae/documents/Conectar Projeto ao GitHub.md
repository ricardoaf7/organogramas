**Objetivo**
- Conectar este projeto local ao repositório GitHub `https://github.com/ricardoaf7/organogramas.git` e preparar para deploy na Vercel.

**Pré‑requisitos**
- Git instalado e configurado (usuario/email).
- Acesso ao GitHub com permissão de push para o repositório indicado.

**Passo a Passo (sem executar ainda)**
1) Inicializar Git no projeto
- Na pasta do projeto: `c:\Users\ricar\Documents\trae_projects\organograma`
- Comandos:
  - `git init`
  - `git config user.name "Seu Nome"`
  - `git config user.email "seu.email@empresa.com"`
  - Verificar `.gitignore` já existente (mantém `node_modules`, `dist`, etc.).

2) Criar commit inicial
- `git add .`
- `git commit -m "chore: projeto inicial do Organograma Builder"`
- `git branch -M main`

3) Adicionar remoto e fazer push
- `git remote add origin https://github.com/ricardoaf7/organogramas.git`
- `git push -u origin main`
- Se o repositório tiver histórico e for necessário sobrepor: usamos `git push -u origin main --force-with-lease` (apenas se você confirmar que quer substituir o histórico remoto).

4) Autenticação do GitHub
- Ao fazer o primeiro push, o Git pedirá login.
- Siga o prompt do navegador ou use Personal Access Token (PAT) com escopo `repo`.

5) Integração com Vercel (após o push)
- Entrar na Vercel e clicar em "New Project" → importar `ricardoaf7/organogramas`.
- Definir build: Vite (padrão `npm run build`), output `dist`.
- Variáveis de ambiente:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Deploy: Preview por PRs e Production na branch `main`.

6) Validação
- Abrir a URL da Vercel, verificar editor, criação/abertura/salvamento.
- Confirmar que o app funciona sem localStorage (se envs Supabase estiverem configuradas).

Se aprovar, eu executo os comandos acima e conecto o repositório agora.