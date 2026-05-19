import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BrandData, CarPart } from '../types';

export interface SiteSettings {
  promoRu: string;
  promoKg: string;
  addressRu: string;
  addressKg: string;
  workHoursRu: string;
  workHoursKg: string;
  phone: string;
  whatsapp: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  promoRu: '', promoKg: '', addressRu: '', addressKg: '',
  workHoursRu: '', workHoursKg: '', phone: '', whatsapp: '',
};

interface DbPart {
  id: string; name: string; category: string; price: number;
  image: string; compatibility: unknown; cars: unknown;
  part_number?: string | null;
  part_numbers?: unknown;
}
interface DbBrand { id: string; name: string; models: unknown; position: number; }

const mapPart = (r: DbPart): CarPart => {
  const list = Array.isArray(r.part_numbers) ? (r.part_numbers as string[]).filter(Boolean) : [];
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    price: Number(r.price),
    image: r.image,
    compatibility: (r.compatibility as CarPart['compatibility']) ?? [],
    cars: (r.cars as CarPart['cars']) ?? [],
    partNumber: r.part_number ?? '',
    partNumbers: list,
  };
};

const mapBrand = (r: DbBrand): BrandData => ({
  name: r.name,
  models: (r.models as BrandData['models']) ?? [],
});

// Query keys
const QK = {
  parts: ['parts'] as const,
  brands: ['brands'] as const,
  categories: ['categories'] as const,
  settings: ['site_settings'] as const,
};

interface StoreCtx {
  parts: CarPart[];
  brands: BrandData[];
  categories: string[];
  settings: SiteSettings;
  loading: boolean;
  upsertPart: (p: CarPart) => Promise<void>;
  deletePart: (id: string) => Promise<void>;
  setCategoriesList: (c: string[]) => Promise<void>;
  renameCategory: (oldName: string, newName: string) => Promise<void>;
  setBrandsList: (b: BrandData[]) => Promise<void>;
  saveSettings: (s: SiteSettings) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  reload: () => Promise<void>;
}

const StoreContext = createContext<StoreCtx | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const qc = useQueryClient();

  const partsQ = useQuery({
    queryKey: QK.parts,
    queryFn: async () => {
      const { data, error } = await supabase.from('parts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => mapPart(r as unknown as DbPart));
    },
  });

  const brandsQ = useQuery({
    queryKey: QK.brands,
    queryFn: async () => {
      const { data, error } = await supabase.from('brands').select('*').order('position', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => mapBrand(r as unknown as DbBrand));
    },
  });

  const categoriesQ = useQuery({
    queryKey: QK.categories,
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('position', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r) => r.name as string);
    },
  });

  const settingsQ = useQuery({
    queryKey: QK.settings,
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
      if (error) throw error;
      if (!data) return DEFAULT_SETTINGS;
      return {
        promoRu: data.promo_ru, promoKg: data.promo_kg,
        addressRu: data.address_ru, addressKg: data.address_kg,
        workHoursRu: data.work_hours_ru, workHoursKg: data.work_hours_kg,
        phone: data.phone, whatsapp: data.whatsapp,
      } as SiteSettings;
    },
  });

  const parts = partsQ.data ?? [];
  const brands = brandsQ.data ?? [];
  const categories = categoriesQ.data ?? [];
  const settings = settingsQ.data ?? DEFAULT_SETTINGS;
  const loading =
    partsQ.isLoading || brandsQ.isLoading || categoriesQ.isLoading || settingsQ.isLoading;

  const reload = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: QK.parts }),
      qc.invalidateQueries({ queryKey: QK.brands }),
      qc.invalidateQueries({ queryKey: QK.categories }),
      qc.invalidateQueries({ queryKey: QK.settings }),
    ]);
  };

  // Realtime sync — invalidate the relevant query
  useEffect(() => {
    const channel = supabase
      .channel('store-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parts' }, () => qc.invalidateQueries({ queryKey: QK.parts }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, () => qc.invalidateQueries({ queryKey: QK.brands }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => qc.invalidateQueries({ queryKey: QK.categories }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => qc.invalidateQueries({ queryKey: QK.settings }))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const upsertPart = async (p: CarPart) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id);
    const numbers = (p.partNumbers ?? []).map((s) => s.trim()).filter(Boolean);
    const payload: any = {
      name: p.name, category: p.category, price: p.price, image: p.image,
      compatibility: p.compatibility,
      cars: p.cars ?? [],
      part_number: (p.partNumber ?? '').trim(),
      part_numbers: numbers,
    };
    if (isUuid) {
      const { error } = await supabase.from('parts').update(payload).eq('id', p.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('parts').insert(payload);
      if (error) throw error;
    }
    await qc.invalidateQueries({ queryKey: QK.parts });
  };

  const deletePart = async (id: string) => {
    const { error } = await supabase.from('parts').delete().eq('id', id);
    if (error) throw error;
    await qc.invalidateQueries({ queryKey: QK.parts });
  };

  const setCategoriesList = async (next: string[]) => {
    const current = new Set(categories);
    const desired = new Set(next);
    const toDelete = [...current].filter((c) => !desired.has(c));
    const toInsert = next.filter((c) => !current.has(c));
    if (toDelete.length) {
      await supabase.from('categories').delete().in('name', toDelete);
    }
    if (toInsert.length) {
      await supabase.from('categories').insert(
        toInsert.map((name, i) => ({ name, position: current.size + i + 1 }))
      );
    }
    await qc.invalidateQueries({ queryKey: QK.categories });
  };

  const renameCategory = async (oldName: string, newName: string) => {
    const v = newName.trim();
    if (!v || v === oldName) return;
    if (categories.includes(v)) throw new Error('Категория с таким именем уже существует');
    const { error: cErr } = await supabase.from('categories').update({ name: v }).eq('name', oldName);
    if (cErr) throw cErr;
    const { error: pErr } = await supabase.from('parts').update({ category: v }).eq('category', oldName);
    if (pErr) throw pErr;
    await Promise.all([
      qc.invalidateQueries({ queryKey: QK.categories }),
      qc.invalidateQueries({ queryKey: QK.parts }),
    ]);
  };

  const setBrandsList = async (next: BrandData[]) => {
    const currentNames = new Set(brands.map((b) => b.name));
    const desiredNames = new Set(next.map((b) => b.name));
    const toDelete = [...currentNames].filter((n) => !desiredNames.has(n));
    if (toDelete.length) {
      await supabase.from('brands').delete().in('name', toDelete);
    }
    for (let i = 0; i < next.length; i++) {
      const b = next[i];
      await supabase
        .from('brands')
        .upsert(
          [{ name: b.name, models: b.models as any, position: i + 1 }],
          { onConflict: 'name' }
        );
    }
    await qc.invalidateQueries({ queryKey: QK.brands });
  };

  const saveSettings = async (s: SiteSettings) => {
    const { error } = await supabase.from('site_settings').update({
      promo_ru: s.promoRu, promo_kg: s.promoKg,
      address_ru: s.addressRu, address_kg: s.addressKg,
      work_hours_ru: s.workHoursRu, work_hours_kg: s.workHoursKg,
      phone: s.phone, whatsapp: s.whatsapp,
    }).eq('id', 1);
    if (error) throw error;
    await qc.invalidateQueries({ queryKey: QK.settings });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    if (!ALLOWED_MIME.includes(file.type) || !ALLOWED_EXT.includes(ext)) {
      throw new Error('Разрешены только изображения (JPEG, PNG, WebP, GIF)');
    }
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('part-images').upload(path, file, {
      cacheControl: '3600', upsert: false, contentType: file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from('part-images').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <StoreContext.Provider
      value={{
        parts, brands, categories, settings, loading,
        upsertPart, deletePart, setCategoriesList, renameCategory, setBrandsList,
        saveSettings, uploadImage, reload,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
