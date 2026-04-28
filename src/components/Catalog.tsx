import { useMemo, useState } from 'react';
import { PARTS } from '../data/mockData';
import { useFilter } from '../context/FilterContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';
import PartDetailsModal from './PartDetailsModal';
import type { CarPart } from '../types';
import { PackageSearch } from 'lucide-react';

const Catalog = () => {
  const { filters } = useFilter();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<CarPart | null>(null);

  const filtered = useMemo(() => {
    return PARTS.filter((p) => {
      if (filters.fuel && !p.compatibility.includes(filters.fuel)) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  const title = filters.brand || filters.fuel || filters.searchQuery ? t.allParts : t.lastParts;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section
        className="rounded-3xl p-6 sm:p-10 text-primary-foreground relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)', boxShadow: 'var(--shadow-elevated)' }}
      >
        <div className="relative max-w-2xl space-y-3">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">MOBIS · Hyundai / Kia</div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            Подбор запчастей<br />за 2 минуты
          </h1>
          <p className="text-sm sm:text-base opacity-80 max-w-md">
            Фильтруйте каталог по марке, модели, поколению и типу двигателя — получите идеальную совместимость.
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute right-20 -top-10 w-40 h-40 rounded-full bg-accent/30 blur-3xl" />
      </section>

      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground font-medium">
          {filtered.length} {filtered.length === 1 ? 'позиция' : 'позиций'}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <PackageSearch size={40} className="mx-auto text-muted-foreground mb-3" />
          <h3 className="font-bold text-foreground mb-1">{t.noPartsFound}</h3>
          <p className="text-sm text-muted-foreground">{t.noPartsDesc}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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