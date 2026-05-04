// Adds a "WWW.KOREA-MOBIS.KG" watermark onto an image file (client-side via canvas).
export async function addWatermark(file: File, text = 'WWW.KOREA-MOBIS.KG'): Promise<File> {
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

  // Diagonal repeating watermark across the entire image
  const minSide = Math.min(canvas.width, canvas.height);
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

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = Math.max(1, fontSize / 18);

  for (let r = -rows; r <= rows; r++) {
    for (let c = -cols; c <= cols; c++) {
      const x = c * stepX;
      const y = r * stepY;
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    }
  }
  ctx.restore();

  // Solid bottom-right label
  const labelSize = Math.max(14, Math.round(minSide * 0.028));
  ctx.font = `800 ${labelSize}px Arial, sans-serif`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  const pad = Math.round(labelSize * 0.6);
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillText(text, canvas.width - pad + 2, canvas.height - pad + 2);
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.fillText(text, canvas.width - pad, canvas.height - pad);

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', 0.92)
  );

  const newName = file.name.replace(/\.[^.]+$/, '') + '-wm.jpg';
  return new File([blob], newName, { type: 'image/jpeg' });
}
