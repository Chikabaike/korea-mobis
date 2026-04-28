export type FuelType = 'Бензин' | 'Дизель' | 'LPG/LPI' | 'Hybrid';

export interface CarPart {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  compatibility: FuelType[];
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