import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
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
}
interface DbBrand { id: string; name: string; models: unknown; position: number; }

const mapPart = (r: DbPart): CarPart => ({
  id: r.id,
  name: r.name,
  category: r.category,
  price: Number(r.price),
  image: r.image,
  compatibility: (r.compatibility as CarPart['compatibility']) ?? [],
  cars: (r.cars as CarPart['cars']) ?? [],
});

const mapBrand = (r: DbBrand): BrandData => ({
  name: r.name,
  models: (r.models as BrandData['models']) ?? [],
});

interface StoreCtx {
  parts: CarPart[];
  brands: BrandData[];
  categories: string[];
  settings: SiteSettings;
  loading: boolean;
  // mutations
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
  const [parts, setParts] = useState<CarPart[]>([]);
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [pRes, bRes, cRes, sRes] = await Promise.all([
      supabase.from('parts').select('*').order('created_at', { ascending: false }),
      supabase.from('brands').select('*').order('position', { ascending: true }),
      supabase.from('categories').select('*').order('position', { ascending: true }),
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    ]);
    if (pRes.data) setParts(pRes.data.map((r) => mapPart(r as unknown as DbPart)));
    if (bRes.data) setBrands(bRes.data.map((r) => mapBrand(r as unknown as DbBrand)));
    if (cRes.data) setCategories(cRes.data.map((r) => r.name as string));
    if (sRes.data) {
      const s = sRes.data;
      setSettings({
        promoRu: s.promo_ru, promoKg: s.promo_kg,
        addressRu: s.address_ru, addressKg: s.address_kg,
        workHoursRu: s.work_hours_ru, workHoursKg: s.work_hours_kg,
        phone: s.phone, whatsapp: s.whatsapp,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // Realtime sync — any admin edit appears for everyone instantly
  useEffect(() => {
    const channel = supabase
      .channel('store-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parts' }, () => reload())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, () => reload())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => reload())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => reload())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [reload]);

  const upsertPart = async (p: CarPart) => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.id);
    const payload: any = {
      name: p.name, category: p.category, price: p.price, image: p.image,
      compatibility: p.compatibility,
      cars: p.cars ?? [],
    };
    if (isUuid) {
      const { error } = await supabase.from('parts').update(payload).eq('id', p.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('parts').insert(payload);
      if (error) throw error;
    }
    await reload();
  };

  const deletePart = async (id: string) => {
    const { error } = await supabase.from('parts').delete().eq('id', id);
    if (error) throw error;
    await reload();
  };

  const setCategoriesList = async (next: string[]) => {
    // Replace strategy: delete removed, insert new
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
    await reload();
  };

  const renameCategory = async (oldName: string, newName: string) => {
    const v = newName.trim();
    if (!v || v === oldName) return;
    if (categories.includes(v)) throw new Error('Категория с таким именем уже существует');
    const { error: cErr } = await supabase.from('categories').update({ name: v }).eq('name', oldName);
    if (cErr) throw cErr;
    // Update referencing parts
    const { error: pErr } = await supabase.from('parts').update({ category: v }).eq('category', oldName);
    if (pErr) throw pErr;
    await reload();
  };

  const setBrandsList = async (next: BrandData[]) => {
    const currentNames = new Set(brands.map((b) => b.name));
    const desiredNames = new Set(next.map((b) => b.name));
    const toDelete = [...currentNames].filter((n) => !desiredNames.has(n));
    if (toDelete.length) {
      await supabase.from('brands').delete().in('name', toDelete);
    }
    // Upsert each desired brand (update models JSON or insert new)
    for (let i = 0; i < next.length; i++) {
      const b = next[i];
      await supabase
        .from('brands')
        .upsert(
          [{ name: b.name, models: b.models as any, position: i + 1 }],
          { onConflict: 'name' }
        );
    }
    await reload();
  };

  const saveSettings = async (s: SiteSettings) => {
    const { error } = await supabase.from('site_settings').update({
      promo_ru: s.promoRu, promo_kg: s.promoKg,
      address_ru: s.addressRu, address_kg: s.addressKg,
      work_hours_ru: s.workHoursRu, work_hours_kg: s.workHoursKg,
      phone: s.phone, whatsapp: s.whatsapp,
    }).eq('id', 1);
    if (error) throw error;
    await reload();
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop() || 'jpg';
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
