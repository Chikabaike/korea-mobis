import { useMemo, useState } from 'react';
import { useFilter } from '../context/FilterContext';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';
import PartDetailsModal from './PartDetailsModal';
import type { CarPart } from '../types';
import { PackageSearch } from 'lucide-react';

const Catalog = () => {
  const { filters } = useFilter();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<CarPart | null>(null);

  const { parts } = useStore();

  const filtered = useMemo(() => {
    return parts.filter((p) => {
      if (filters.fuel && !p.compatibility.includes(filters.fuel)) return false;
      // Фильтр по авто: если у запчасти не указаны cars — считаем универсальной.
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
        if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filters, parts]);

  const title = filters.brand || filters.fuel || filters.searchQuery ? t.allParts : t.lastParts;

  return (
    <div className="space-y-6">
      {/* Hero slider */}
      <section
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] lg:aspect-[28/9]"
        style={{ boxShadow: 'var(--shadow-elevated)' }}
      >
        {/* Slide 1: KOREA-MOBIS photo */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${slide === 0 ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={heroKoreaMobis}
            alt="KOREA-MOBIS.KG — оригинальные запчасти из Кореи"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slide 2: original gradient hero */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 text-primary-foreground ${slide === 1 ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'var(--gradient-hero)' }}
        >
          <div className="relative h-full p-5 sm:p-8 lg:p-10 flex flex-col justify-center max-w-2xl space-y-2 sm:space-y-3">
            <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-70">MOBIS · Hyundai / Kia</div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Подбор запчастей<br />за 2 минуты
            </h2>
            <p className="text-xs sm:text-sm lg:text-base opacity-80 max-w-md">
              Фильтруйте каталог по марке, модели, поколению и типу двигателя — получите идеальную совместимость.
            </p>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
          <div className="absolute right-20 -top-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-accent/30 blur-3xl pointer-events-none" />
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Слайд ${i + 1}`}
              className={`h-2 rounded-full transition-all ${slide === i ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
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
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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