import { useMemo, useState } from 'react';
import { useFilter } from '../context/FilterContext';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';
import PartDetailsModal from './PartDetailsModal';
import type { CarPart } from '../types';
import { PackageSearch } from 'lucide-react';

type SortOption = 'popularity' | 'price' | 'relevance';

const Catalog = () => {
  const { filters } = useFilter();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<CarPart | null>(null);
  const [sort, setSort] = useState<SortOption>('popularity');

  const { parts } = useStore();

  const filtered = useMemo(() => {
    const result = parts.filter((p) => {
      if (filters.fuel && !p.compatibility.includes(filters.fuel)) return false;
      if (filters.brand && p.cars && p.cars.length > 0) {
        const matches = p.cars.some((c) => {
          if (c.brand !== filters.brand) return false;
          if (filters.model && c.model !== filters.model) return false;
          if (filters.generation && c.generation && c.generation !== filters.generation) return false;
          return true;
        });
        if (!matches) return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const hay = [p.name, p.category, p.partNumber ?? '', ...(p.partNumbers ?? [])].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...result];
    if (sort === 'price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === 'relevance') {
      sorted.reverse();
    }
    return sorted;
  }, [filters, parts, sort]);

  const title = filters.brand || filters.fuel || filters.searchQuery ? t.allParts : t.lastParts;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">{title}</h2>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-muted border border-border rounded-full text-xs font-semibold py-1.5 px-3 outline-none focus:border-primary"
            aria-label="Сортировка"
          >
            <option value="popularity">По популярности</option>
            <option value="price">По цене</option>
            <option value="relevance">По актуальности</option>
          </select>
          <span className="text-xs text-muted-foreground font-medium">
            {filtered.length} {filtered.length === 1 ? 'позиция' : 'позиций'}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <PackageSearch size={40} className="mx-auto text-muted-foreground mb-3" />
          <h3 className="font-bold text-foreground mb-1">{t.noPartsFound}</h3>
          <p className="text-sm text-muted-foreground">{t.noPartsDesc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 items-start">
          {filtered.map((p) => (
            <ProductCard key={p.id} part={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      )}

      {selected && <PartDetailsModal part={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Catalog;