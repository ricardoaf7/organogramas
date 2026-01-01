Diagnóstico
- Conectores somem no recorte porque o crop usa o container errado: está capturando apenas `.react-flow__renderer` (nós), e as arestas estão em `.react-flow__edges`. Precisamos capturar o container raiz `.react-flow`, tanto no recorte quanto no auto-export. Veja [download.ts](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/utils/download.ts#L1).
- Qualidade baixa porque o pipeline atual é raster (html2canvas). Para PDF vetorial, precisamos gerar SVG puro (nós e arestas) e converter com `svg2pdf.js` para manter vetores.
- Coordenadas do CropOverlay estão corretas, mas devem ser aplicadas ao mesmo container que o overlay cobre. Hoje o overlay cobre toda a área, porém o alvo de captura não é o mesmo.

Plano de Correção
1) Incluir arestas em todos os exports
- Alterar o alvo de captura do recorte de `.react-flow__renderer` para `.react-flow` para incluir nós e arestas.
- No auto-export já ajustado para viewport, normalizar para `.react-flow` também.

2) Alta resolução em PNG/JPEG
- Adicionar controle de escala (ex.: 1x, 2x, 4x) nas opções do menu do CropOverlay.
- Usar `html2canvas` com `scale` configurável, `useCORS: true`, `imageTimeout: 0`.

3) Exportação Vetorial (SVG/PDF)
- Construir um gerador de SVG puro a partir do grafo:
  - Ler `nodes` e `edges` do store.
  - Para cada nó, desenhar `<rect rx>` (bordas arredondadas) e `<text>` (título/descrição) usando cores já definidas. Evitar `foreignObject` para garantir vetorial.
  - Para cada aresta, copiar o atributo `d` das `path` em `.react-flow__edges` e aplicar `stroke` e `marker` similares.
  - Ajustar viewBox ao bounding box calculado (incluindo padding).
- Exportar SVG diretamente (qualidade infinita ao dar zoom).
- Para PDF vetorial, usar `svg2pdf.js` com `jsPDF` para converter o SVG mantendo vetores.

4) Fluxo de Trabalho unificado no CropOverlay
- Após selecionar, exibir menu com: Imprimir, PDF (vetor), PNG (escala configurável), JPEG, Copiar.
- Para Copy, rasterizar com a escala escolhida e colocar em clipboard.
- Mostrar feedback (sucesso/erro) em cada ação.

5) Validação
- Diagramas grandes, com zoom mínimo (já ajustado em [OrganogramCanvas.tsx](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/components/OrganogramCanvas.tsx#L90-L106)).
- Recorte incluindo conectores largos (esquerda/direita) e curvas.
- Comparar PDF vetorial: zoom infinito sem pixelizar.

Arquivos a Alterar
- [download.ts](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/utils/download.ts): capturar `.react-flow`; adicionar `generateSVG()` e integração `svg2pdf.js`.
- [CropOverlay.tsx](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/components/CropOverlay.tsx): adicionar controles de escala e opções SVG/PDF.
- [Editor.tsx](file:///c:/Users/ricar/Documents/trae_projects/organograma/src/pages/Editor.tsx): integrar novas ações (PNG/JPEG com escala, SVG direto, PDF vetorial).

Dependências
- Adicionar `svg2pdf.js` para PDF vetorial.

Resultado Esperado
- PNG/JPEG em alta resolução (configurável).
- SVG com qualidade vetorial, arestas e nós completos.
- PDF vetorial que mantém qualidade ao dar zoom.
- Recorte sempre incluindo conectores; sem cortes no lado esquerdo/direito/topo/rodapé.