export type WatermarkPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
export type WatermarkMode = 'diagonal' | 'single';

export type WatermarkSettings = {
  enabled: boolean;
  text: string;
  opacity: number; // 0..1
  position: WatermarkPosition;
  mode: WatermarkMode;
};

export const DEFAULT_WATERMARK: WatermarkSettings = {
  enabled: true,
  text: 'WWW.KOREA-MOBIS.KG',
  opacity: 0.45,
  position: 'bottom-right',
  mode: 'diagonal',
};

const KEY = 'mobis.watermark.settings';

export function loadWatermarkSettings(): WatermarkSettings {
  if (typeof window === 'undefined') return DEFAULT_WATERMARK;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_WATERMARK;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_WATERMARK, ...parsed };
  } catch {
    return DEFAULT_WATERMARK;
  }
}

export function saveWatermarkSettings(s: WatermarkSettings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
