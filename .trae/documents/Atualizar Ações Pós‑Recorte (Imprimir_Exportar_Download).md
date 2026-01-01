**Objetivo**
- Garantir que, após selecionar uma área com a ferramenta de recorte, o usuário tenha todas as ações (imprimir, exportar e baixar) disponíveis no menu contextual, sempre usando a área recortada como referência.

**Arquitetura Atual**
- Menu de ações já aparece ao soltar o mouse no componente [CropOverlay](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/components/CropOverlay.tsx).
- Funções de exportação suportam `customBounds` (área recortada) em [download.ts](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/utils/download.ts).
- Integração das ações no Editor está em [Editor.tsx](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/pages/Editor.tsx#L37-L73).

**Plano de Atualização**
1) **Menu Pós‑Recorte (UI/UX)**
- Atualizar [CropOverlay](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/components/CropOverlay.tsx) para exibir um painel de ações completo com:
  - Imprimir
  - PDF Vetorial
  - PNG (escolha de resolução: 1x, 2x, 3x, 4x; opção de fundo transparente)
  - JPEG (qualidade 80/90/100)
  - Copiar para área de transferência
- Manter os limites visuais da seleção sempre visíveis enquanto o menu estiver aberto.
- Acessibilidade: navegação por teclado (Tab, Enter, Esc), `aria-live` para feedback de sucesso/erro, foco preso no painel de ações até concluir/cancelar.

2) **Encaminhamento da Área Selecionada**
- Garantir que **todas** as ações chamem as funções de exportação com `customBounds`:
  - Imprimir: `printOrganogram(customBounds)`
  - PDF Vetorial: `downloadOrganogramVectorPdf(customBounds)`
  - PNG/JPEG: `downloadOrganogram(format, customBounds, { scale, transparent, quality })`
  - Copiar: `copyOrganogramToClipboard(customBounds, { scale, transparent })`
- Confirmar que a captura usa o contêiner raiz `.react-flow` para incluir nós e conectores.

3) **Refatoração de API de Exportação**
- Em [download.ts](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/utils/download.ts):
  - Unificar assinatura das funções para aceitar `options`:
    ```ts
    type ExportOptions = { scale?: number; transparent?: boolean; quality?: number };
    downloadOrganogram(format, customBounds?, options?);
    copyOrganogramToClipboard(customBounds?, options?);
    ```
  - Para PNG/JPEG: aplicar `scale` e `quality`; para PNG com fundo transparente, usar `backgroundColor: null`.
  - Manter PDF vetorial via `downloadOrganogramVectorPdf(customBounds)` (com fallback para baixar SVG vetorial).

4) **Integração no Editor**
- Em [Editor.tsx](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/pages/Editor.tsx):
  - Ajustar `handleCropConfirm(bounds, action)` para receber e repassar `options` (resolução/qualidade/transparência) vindas do menu.
  - Garantir feedback pós‑operação (toast/alert) e fechamento do modo recorte só após executar a ação.

5) **Validação**
- Testes manuais com diagramas grandes e curvas longas de arestas.
- Verificar que:
  - A área exportada corresponde exatamente à seleção.
  - Conectores aparecem completos em todos os formatos.
  - PNG/JPEG têm nitidez adequada nas resoluções 2x/3x/4x.
  - PDF/SVG mantêm qualidade vetorial (zoom infinito).
- Compatibilidade: confirmar que as ações funcionam com seleção ativa e são desabilitadas quando não há seleção.

**Resultado Esperado**
- Experiência pós‑recorte robusta: usuário escolhe ação e parâmetros diretamente no menu contextual, com exportações fiéis à área selecionada, alta qualidade visual e conectores preservados.