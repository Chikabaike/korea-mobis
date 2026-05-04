export type FuelType = 'Бензин' | 'Дизель' | 'LPG/LPI' | 'Hybrid';

export interface CarCompatibility {
  brand: string;
  model: string;
  generation?: string; // если не указано — совместимо со всеми поколениями модели
}

export interface CarPart {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  compatibility: FuelType[];
  cars?: CarCompatibility[];
  partNumber?: string;
  partNumbers?: string[];
}

export interface GenerationData {
  generationName: string;
  fuels: FuelType[];
}

export interface ModelData {
  name: string;
  generations: GenerationData[];
}

export interface BrandData {
  name: string;
  models: ModelData[];
}

export interface FilterState {
  brand: string | null;
  model: string | null;
  generation: string | null;
  fuel: FuelType | null;
  searchQuery: string;
  view: 'catalog' | 'map';
}

export type Language = 'ru' | 'kg';