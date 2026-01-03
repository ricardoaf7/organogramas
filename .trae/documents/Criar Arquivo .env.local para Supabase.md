Vou criar os arquivos de ambiente e deixar tudo pronto para você só colar as chaves.

## O que vou criar
- `.env.local` na raiz do projeto com as variáveis:
  - `VITE_SUPABASE_URL=`
  - `VITE_SUPABASE_ANON_KEY=`
- `.env.example` com os mesmos nomes, para referência.
- Atualizar o README com instruções rápidas de onde pegar essas chaves no Supabase (Settings → Project → API).

## Como você preenche
1. Copie o valor de "Project URL" e cole em `VITE_SUPABASE_URL`.
2. Copie o valor de "anon public" e cole em `VITE_SUPABASE_ANON_KEY`.
3. Salve o arquivo `.env.local`.
4. Reinicie `npm run dev`.

## Validação
- Se as variáveis estiverem corretas, o app redireciona para Login e você consegue "Novo", "Abrir" e "Salvar Cloud".
- Se não estiver configurado, uma mensagem avisa que o Supabase não está ativo.

Posso criar os arquivos agora e deixar os placeholders prontos?