# Organograma Builder

Aplicação web moderna para criação, edição e exportação de organogramas organizacionais. Desenvolvida com React, Vite, Tailwind CSS e React Flow.

## Funcionalidades

- **Criação Intuitiva**: Arraste e solte elementos (Diretoria, Gerência, Setor) para o canvas.
- **Edição Completa**: Personalize títulos, descrições, cores e formas através do painel de propriedades.
- **Gestão de Estado**: Desfaça e refaça ações (Undo/Redo) com facilidade.
- **Persistência**: Seus organogramas são salvos automaticamente no navegador (LocalStorage).
- **Exportação**:
  - **PDF**: Exporte em alta qualidade para impressão.
  - **PNG**: Salve como imagem.
  - **Impressão**: Modo de impressão otimizado.

## Configuração do Supabase
- Preencha o arquivo `.env.local` com:
  - `VITE_SUPABASE_URL` (Settings → Project → API → Project URL)
  - `VITE_SUPABASE_ANON_KEY` (Settings → Project → API → anon public)
- Consulte `.env.example` para o formato.
- Reinicie `npm run dev` após salvar.

### Schema do Banco
- No Supabase, abra o SQL Editor e execute [`supabase/schema.sql`](file:///c:/Users/ricar/Documents/trae_projects/organograma/supabase/schema.sql).
- Isso cria `profiles`, `organograms` e `organogram_versions` com RLS e políticas de acesso.

## Hierarquia e Regras

A aplicação implementa uma estrutura hierárquica estrita para garantir a consistência dos organogramas:

1.  **Diretoria (Nível Estratégico)**
2.  **Gerência (Nível Tático)**
3.  **Coordenadoria (Nível Intermediário)**
4.  **Setor (Nível Operacional)**

**Regras de Conexão:**
- As conexões só são permitidas de um nível superior para um nível inferior (ex: Diretoria -> Gerência).
- Conexões entre o mesmo nível ou para níveis superiores são bloqueadas automaticamente.
- É permitido "pular" níveis (ex: Diretoria -> Coordenadoria), desde que a direção seja descendente.

## Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **Estilização**: Tailwind CSS
- **Diagramas**: React Flow
- **Estado**: Zustand (com persistência e histórico)
- **Ícones**: Lucide React
- **Exportação**: html2canvas, jsPDF

## Instalação

1. Clone o repositório (se aplicável).
2. Instale as dependências:
   ```bash
   npm install
   ```

## Como Usar

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Abra o navegador no endereço indicado (geralmente `http://localhost:5173`).

### Comandos Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm run preview`: Visualiza a versão de produção localmente.
- `npm run test`: Executa os testes unitários.

## Estrutura do Projeto

- `src/components`: Componentes reutilizáveis (Sidebar, Toolbar, Nodes).
- `src/pages`: Páginas da aplicação (Editor).
- `src/store`: Gerenciamento de estado global com Zustand.
- `src/types`: Definições de tipos TypeScript.
- `src/lib`: Utilitários.

## Licença

MIT
