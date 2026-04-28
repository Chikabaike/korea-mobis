import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { BrandData, CarPart } from '../types';
import { BRANDS as DEFAULT_BRANDS, PARTS as DEFAULT_PARTS, CATEGORIES as DEFAULT_CATEGORIES } from '../data/mockData';

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
  promoRu: 'Бесплатная доставка по Бишкеку при заказе от 5000 сом',
  promoKg: 'Бишкек боюнча 5000 сомдон жогорку буюртмага текин жеткирүү',
  addressRu: 'г. Бишкек, ул. Ибраимова 115',
  addressKg: 'Бишкек ш., Ибраимов көч. 115',
  workHoursRu: 'Пн–Сб 9:00 – 19:00',
  workHoursKg: 'Дш–Иш 9:00 – 19:00',
  phone: '+996700123456',
  whatsapp: '996700123456',
};

const KEYS = {
  parts: 'mobis.parts',
  brands: 'mobis.brands',
  categories: 'mobis.categories',
  settings: 'mobis.settings',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface StoreCtx {
  parts: CarPart[];
  brands: BrandData[];
  categories: string[];
  settings: SiteSettings;
  setParts: (p: CarPart[]) => void;
  setBrands: (b: BrandData[]) => void;
  setCategories: (c: string[]) => void;
  setSettings: (s: SiteSettings) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreCtx | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [parts, setPartsState] = useState<CarPart[]>(() => load(KEYS.parts, DEFAULT_PARTS));
  const [brands, setBrandsState] = useState<BrandData[]>(() => load(KEYS.brands, DEFAULT_BRANDS));
  const [categories, setCategoriesState] = useState<string[]>(() => load(KEYS.categories, DEFAULT_CATEGORIES));
  const [settings, setSettingsState] = useState<SiteSettings>(() => load(KEYS.settings, DEFAULT_SETTINGS));

  useEffect(() => { localStorage.setItem(KEYS.parts, JSON.stringify(parts)); }, [parts]);
  useEffect(() => { localStorage.setItem(KEYS.brands, JSON.stringify(brands)); }, [brands]);
  useEffect(() => { localStorage.setItem(KEYS.categories, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(KEYS.settings, JSON.stringify(settings)); }, [settings]);

  const resetAll = () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    setPartsState(DEFAULT_PARTS);
    setBrandsState(DEFAULT_BRANDS);
    setCategoriesState(DEFAULT_CATEGORIES);
    setSettingsState(DEFAULT_SETTINGS);
  };

  return (
    <StoreContext.Provider
      value={{
        parts,
        brands,
        categories,
        settings,
        setParts: setPartsState,
        setBrands: setBrandsState,
        setCategories: setCategoriesState,
        setSettings: setSettingsState,
        resetAll,
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

export const ADMIN_PASSWORD_KEY = 'mobis.admin.auth';
export const ADMIN_PASSWORD = 'admin123';