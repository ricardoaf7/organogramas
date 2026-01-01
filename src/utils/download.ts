import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const getNodesBounds = () => {
  const nodes = document.querySelectorAll('.react-flow__node');
  if (nodes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    const el = node as HTMLElement;
    // Parse transform directly to get accurate position in the flow coordinate system
    // React Flow applies transform: translate(x px, y px)
    const transform = el.style.transform;
    const match = transform.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
    
    let x = 0;
    let y = 0;

    if (match) {
      x = parseFloat(match[1]);
      y = parseFloat(match[2]);
    } else {
        // Fallback if style parsing fails (unlikely in React Flow)
        // We can try to use offsetLeft/Top but they are relative to parent
        // which is the viewport, so it might work.
        x = el.offsetLeft;
        y = el.offsetTop;
    }

    const width = el.offsetWidth;
    const height = el.offsetHeight;

    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + width > maxX) maxX = x + width;
    if (y + height > maxY) maxY = y + height;
  });

  // Include edges in bounds calculation
  const edgesLayer = document.querySelector('.react-flow__edges');
  if (edgesLayer) {
    try {
      // SVGGraphicsElement.getBBox() returns the bounding box in user units
      const bbox = (edgesLayer as unknown as SVGGraphicsElement).getBBox();
      
      if (bbox.x < minX) minX = bbox.x;
      if (bbox.y < minY) minY = bbox.y;
      if (bbox.x + bbox.width > maxX) maxX = bbox.x + bbox.width;
      if (bbox.y + bbox.height > maxY) maxY = bbox.y + bbox.height;
    } catch (e) {
      console.warn('Could not calculate edges bounding box', e);
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

type ExportOptions = { scale?: number; transparent?: boolean; quality?: number };

export const generateCanvas = async (
  customBounds?: { x: number; y: number; width: number; height: number },
  options?: ExportOptions
): Promise<HTMLCanvasElement | null> => {
  const scale = options?.scale ?? 3;
  const transparent = options?.transparent ?? false;

  const root = document.querySelector('.react-flow') as HTMLElement;
  if (!root) return null;

  if (customBounds) {
    const fullCanvas = await html2canvas(root, {
      scale,
      backgroundColor: transparent ? null : '#ffffff',
      useCORS: true,
      imageTimeout: 0,
      logging: false,
    });
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = Math.round(customBounds.width * scale);
    cropCanvas.height = Math.round(customBounds.height * scale);
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) return fullCanvas;
    ctx.drawImage(
      fullCanvas,
      Math.round(customBounds.x * scale),
      Math.round(customBounds.y * scale),
      Math.round(customBounds.width * scale),
      Math.round(customBounds.height * scale),
      0,
      0,
      cropCanvas.width,
      cropCanvas.height
    );
    return cropCanvas;
  }

  // Auto Mode
  const bounds = getNodesBounds();
  const padding = 100;
  const width = bounds.width + padding * 2;
  const height = bounds.height + padding * 2;

  return await html2canvas(root, {
    width: width,
    height: height,
    windowWidth: width,
    windowHeight: height,
    scale: scale,
    backgroundColor: transparent ? null : '#ffffff',
    useCORS: true,
    imageTimeout: 0,
    logging: false,
    onclone: (clonedDoc) => {
      const clonedViewport = clonedDoc.querySelector('.react-flow__viewport') as HTMLElement;
      const clonedRoot = clonedDoc.querySelector('.react-flow') as HTMLElement;
      if (clonedViewport) {
        clonedViewport.style.transform = `translate(${-bounds.x + padding}px, ${-bounds.y + padding}px) scale(1)`;
        clonedViewport.style.width = `${width}px`;
        clonedViewport.style.height = `${height}px`;
      }
      if (clonedRoot) {
        clonedRoot.style.width = `${width}px`;
        clonedRoot.style.height = `${height}px`;
      }
      const nodes = clonedDoc.querySelectorAll('.react-flow__node');
      nodes.forEach((n) => {
        (n as HTMLElement).style.borderRadius = '8px';
      });
    },
  });
};

export const downloadOrganogram = async (
  format: 'pdf' | 'png' | 'jpeg' | 'svg', 
  customBounds?: { x: number; y: number; width: number; height: number },
  options?: ExportOptions
) => {
  const canvas = await generateCanvas(customBounds, options);
  if (!canvas) return;
  processDownload(canvas, format, options);
};

export const printOrganogram = async (
  customBounds?: { x: number; y: number; width: number; height: number },
  options?: ExportOptions
) => {
  const canvas = await generateCanvas(customBounds, options);
  if (!canvas) return;

  const dataUrl = canvas.toDataURL('image/png');
  const windowContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Imprimir Organograma</title>
      </head>
      <body style="margin: 0; display: flex; justify-content: center; align-items: center;">
        <img src="${dataUrl}" style="max-width: 100%; max-height: 100vh;" onload="window.print(); window.close();" />
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(windowContent);
    printWindow.document.close();
  }
};

export const copyOrganogramToClipboard = async (
  customBounds?: { x: number; y: number; width: number; height: number },
  options?: ExportOptions
): Promise<boolean> => {
  const canvas = await generateCanvas(customBounds, options);
  if (!canvas) return false;

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        resolve(true);
      } catch (err) {
        console.error('Failed to copy:', err);
        resolve(false);
      }
    });
  });
};

const buildSVG = (customBounds?: { x: number; y: number; width: number; height: number }) => {
  const padding = 100;
  const bounds = customBounds ? { x: customBounds.x, y: customBounds.y, width: customBounds.width, height: customBounds.height } : getNodesBounds();
  const width = bounds.width + (customBounds ? 0 : padding * 2);
  const height = bounds.height + (customBounds ? 0 : padding * 2);
  const offsetX = (customBounds ? bounds.x : bounds.x - padding);
  const offsetY = (customBounds ? bounds.y : bounds.y - padding);

  const edgesSvg = document.querySelector('.react-flow__edges') as SVGSVGElement;
  const edgePaths = edgesSvg ? Array.from(edgesSvg.querySelectorAll('path')) : [];

  const nodes = Array.from(document.querySelectorAll('.react-flow__node')) as HTMLElement[];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<defs>`;
  if (edgesSvg) {
    const defs = edgesSvg.querySelector('defs');
    if (defs) svg += defs.innerHTML;
  }
  svg += `</defs>`;
  svg += `<g transform="translate(${-(offsetX)}, ${-(offsetY)})">`;

  // Add edges first so nodes render above
  edgePaths.forEach((p) => {
    const d = p.getAttribute('d') || '';
    const stroke = p.getAttribute('stroke') || '#8aa0af';
    const strokeWidth = p.getAttribute('stroke-width') || '2';
    const markerEnd = p.getAttribute('marker-end') || '';
    svg += `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" ${markerEnd ? `marker-end="${markerEnd}"` : ''} />`;
  });

  nodes.forEach((el) => {
    const transform = el.style.transform;
    const match = transform.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
    const x = match ? parseFloat(match[1]) : el.offsetLeft;
    const y = match ? parseFloat(match[2]) : el.offsetTop;
    const w = el.offsetWidth;
    const h = el.offsetHeight;

    const style = getComputedStyle(el);
    const bg = style.backgroundColor || '#ffffff';
    const radius = parseFloat(style.borderTopLeftRadius || '8');
    const color = style.color || '#000000';

    // Node background
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="${bg}" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>`;

    // Text extraction: title (first bold div) and description (next)
    const titleEl = el.querySelector('.font-bold') as HTMLElement | null;
    const descEl = el.querySelector('.text-xs') as HTMLElement | null;
    const paddingText = 12;
    const lineGap = 16;
    const title = titleEl?.innerText || '';
    const desc = descEl?.innerText || '';

    if (title) {
      svg += `<text x="${x + paddingText}" y="${y + paddingText + 10}" font-size="12" font-weight="700" fill="${color}">${escapeXml(title)}</text>`;
    }
    if (desc) {
      svg += `<text x="${x + paddingText}" y="${y + paddingText + 10 + lineGap}" font-size="10" fill="${color}" opacity="0.9">${escapeXml(desc)}</text>`;
    }
  });

  svg += `</g></svg>`;
  return svg;
};

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const downloadOrganogramVectorPdf = async (
  customBounds?: { x: number; y: number; width: number; height: number }
) => {
  const svgString = buildSVG(customBounds);
  const svg2pdf = await ensureSvg2Pdf();
  if (svg2pdf) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgEl = doc.documentElement as unknown as SVGSVGElement;
    const width = parseFloat(svgEl.getAttribute('width') || '1000');
    const height = parseFloat(svgEl.getAttribute('height') || '1000');
    const pdf = new jsPDF({ orientation: width > height ? 'l' : 'p', unit: 'px', format: [width, height] });
    svg2pdf(svgEl, pdf, { x: 0, y: 0, width, height });
    pdf.save('organograma.pdf');
    return;
  }
  // Fallback: download SVG diretamente (vetorial)
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'organograma.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('PDF vetorial requer svg2pdf.js. Baixei o SVG vetorial como alternativa.');
};

const processDownload = (canvas: HTMLCanvasElement, format: 'pdf' | 'png' | 'jpeg' | 'svg', options?: ExportOptions) => {
  // 4. Download based on format
  const downloadLink = (href: string, name: string) => {
    const link = document.createElement('a');
    link.href = href;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (format === 'pdf') {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'l' : 'p', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('organograma.pdf');
  } else if (format === 'jpeg') {
    downloadLink(canvas.toDataURL('image/jpeg', options?.quality ?? 0.9), 'organograma.jpg');
  } else {
    // Default to PNG (also for SVG request fallback)
    if (format === 'svg') {
        alert('Exportação nativa SVG não suportada. Baixando como PNG de alta qualidade.');
    }
    downloadLink(canvas.toDataURL('image/png'), 'organograma.png');
  }
};

const ensureSvg2Pdf = async (): Promise<any | null> => {
  const existing: any = (window as any).svg2pdf || null;
  if (existing) return existing;
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/svg2pdf.js@2.2.3/dist/svg2pdf.min.js';
    script.async = true;
    script.onload = () => {
      const lib: any = (window as any).svg2pdf || null;
      resolve(lib);
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
};
