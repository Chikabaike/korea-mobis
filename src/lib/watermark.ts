import { DEFAULT_WATERMARK, loadWatermarkSettings, type WatermarkSettings } from './watermarkSettings';

// Adds a watermark onto an image file (client-side via canvas).
export async function addWatermark(file: File, overrides?: Partial<WatermarkSettings>): Promise<File> {
  const settings: WatermarkSettings = { ...loadWatermarkSettings(), ...(overrides ?? {}) };
  if (!settings.enabled || !settings.text.trim()) return file;

  const text = settings.text;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  ctx.drawImage(img, 0, 0);

  const minSide = Math.min(canvas.width, canvas.height);
  const opacity = Math.max(0, Math.min(1, settings.opacity));

  if (settings.mode === 'diagonal') {
    const fontSize = Math.max(16, Math.round(minSide * 0.035));
    ctx.font = `700 ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);

    const metrics = ctx.measureText(text);
    const stepX = metrics.width + fontSize * 2;
    const stepY = fontSize * 4;
    const diag = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
    const cols = Math.ceil(diag / stepX) + 2;
    const rows = Math.ceil(diag / stepY) + 2;

    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.strokeStyle = `rgba(0,0,0,${opacity * 0.7})`;
    ctx.lineWidth = Math.max(1, fontSize / 18);

    for (let r = -rows; r <= rows; r++) {
      for (let c = -cols; c <= cols; c++) {
        ctx.strokeText(text, c * stepX, r * stepY);
        ctx.fillText(text, c * stepX, r * stepY);
      }
    }
    ctx.restore();
  }

  // Single label according to position (also drawn in diagonal mode for branding)
  const labelSize = Math.max(14, Math.round(minSide * 0.03));
  ctx.font = `800 ${labelSize}px Arial, sans-serif`;
  const pad = Math.round(labelSize * 0.7);
  const singleOpacity = settings.mode === 'single' ? opacity : Math.min(1, opacity + 0.4);

  let x = canvas.width - pad;
  let y = canvas.height - pad;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  switch (settings.position) {
    case 'bottom-right':
      x = canvas.width - pad; y = canvas.height - pad;
      ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; break;
    case 'bottom-left':
      x = pad; y = canvas.height - pad;
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; break;
    case 'top-right':
      x = canvas.width - pad; y = pad;
      ctx.textAlign = 'right'; ctx.textBaseline = 'top'; break;
    case 'top-left':
      x = pad; y = pad;
      ctx.textAlign = 'left'; ctx.textBaseline = 'top'; break;
    case 'center':
      x = canvas.width / 2; y = canvas.height / 2;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; break;
  }

  ctx.fillStyle = `rgba(0,0,0,${Math.min(1, singleOpacity * 0.7)})`;
  ctx.fillText(text, x + 2, y + 2);
  ctx.fillStyle = `rgba(255,255,255,${singleOpacity})`;
  ctx.fillText(text, x, y);

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', 0.92)
  );

  const newName = file.name.replace(/\.[^.]+$/, '') + '-wm.jpg';
  return new File([blob], newName, { type: 'image/jpeg' });
}

export { DEFAULT_WATERMARK };
