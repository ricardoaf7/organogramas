Vou adicionar uma funcionalidade específica para importar backups JSON diretamente para a sua lista de organogramas na nuvem (Supabase), sem precisar abrir e salvar manualmente.

**Plano de Implementação:**

1.  **Atualizar o Store (`src/store/useOrganogramStore.ts`)**:
    *   Criar uma nova ação `importOrganogram(name, nodes, edges)` que insere os dados diretamente no banco de dados do Supabase como um novo registro.

2.  **Atualizar a Janela de Abrir (`src/components/OpenDialog.tsx`)**:
    *   Adicionar um botão **"Importar Backup"** (ícone de Upload) nesta janela.
    *   Implementar a lógica para ler o arquivo JSON selecionado.
    *   Solicitar um nome para o organograma (sugerindo o nome do arquivo).
    *   Enviar para o Supabase e atualizar a lista automaticamente.

Dessa forma, você poderá pegar seus arquivos de backup antigos e "subir" todos para o seu projeto de uma vez, organizando-os na sua lista para acesso futuro.