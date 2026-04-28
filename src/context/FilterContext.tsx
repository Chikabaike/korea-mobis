import { createContext, useContext, useState, ReactNode } from 'react';
import type { FilterState, FuelType } from '../types';

interface FilterContextValue {
  filters: FilterState;
  setBrand: (b: string | null) => void;
  setModel: (m: string | null) => void;
  setGeneration: (g: string | null) => void;
  setFuel: (f: FuelType | null) => void;
  setSearchQuery: (q: string) => void;
  setView: (v: 'catalog' | 'map') => void;
  reset: () => void;
}

const initial: FilterState = {
  brand: null,
  model: null,
  generation: null,
  fuel: null,
  searchQuery: '',
  view: 'catalog',
};

const FilterContext = createContext<FilterContextValue | null>(null);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(initial);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setBrand: (brand) => setFilters((f) => ({ ...f, brand, model: null, generation: null, fuel: null })),
        setModel: (model) => setFilters((f) => ({ ...f, model, generation: null, fuel: null })),
        setGeneration: (generation) => setFilters((f) => ({ ...f, generation, fuel: null })),
        setFuel: (fuel) => setFilters((f) => ({ ...f, fuel })),
        setSearchQuery: (searchQuery) => setFilters((f) => ({ ...f, searchQuery })),
        setView: (view) => setFilters((f) => ({ ...f, view })),
        reset: () => setFilters(initial),
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilter must be used within FilterProvider');
  return ctx;
};