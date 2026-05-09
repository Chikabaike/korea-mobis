import { useMemo, useState } from 'react';
import { useFilter } from '../context/FilterContext';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';
import PartDetailsModal from './PartDetailsModal';
import type { CarPart } from '../types';
import { PackageSearch, X, Filter as FilterIcon } from 'lucide-react';

const LatestPartsSection = ({ onClose }: { onClose: () => void }) => {
  const { filters } = useFilter();
  const { parts, categories } = useStore();
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selected, setSelected] = useState<CarPart | null>(null);

  const carFiltered = useMemo(() => {
    return parts
      .filter((p) => {
        if (filters.fuel && !p.compatibility.includes(filters.fuel)) return false;
        if (filters.brand && p.cars && p.cars.length > 0) {
          const ok = p.cars.some((c) => {
            if (c.brand !== filters.brand) return false;
            if (filters.model && c.model !== filters.model) return false;
            if (filters.generation && c.generation && c.generation !== filters.generation) return false;
            return true;
          });
          if (!ok) return false;
        }
        return true;
      });
  }, [parts, filters]);

  const visible = useMemo(() => {
    if (selectedCats.length === 0) return carFiltered;
    return carFiltered.filter((p) => selectedCats.includes(p.category));
  }, [carFiltered, selectedCats]);

  // counts per category (within current car selection)
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    carFiltered.forEach((p) => { m[p.category] = (m[p.category] ?? 0) + 1; });
    return m;
  }, [carFiltered]);

  const toggleCat = (c: string) => {
    setSelectedCats((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const carLabel = [filters.brand, filters.model, filters.generation, filters.fuel]
    .filter(Boolean)
    .join(' · ');

  return (
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-border bg-muted/40">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Последние поступления
          </div>
          <h2 className="text-sm sm:text-base font-black text-foreground truncate">
            {carLabel || 'Все авто'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2 hover:border-foreground transition-colors shrink-0"
        >
          <X size={14} />
          Закрыть
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
        {/* Sidebar categories */}
        <aside className="border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-5 bg-background/40">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-1.5">
            <FilterIcon size={12} />
            Категории
          </h3>
          {categories.length === 0 ? (
            <p className="text-xs text-muted-foreground">Нет категорий</p>
          ) : (
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSelectedCats([])}
                  className={[
                    'w-full flex items-center justify-between gap-2 text-left text-xs font-bold px-3 py-2 rounded-lg border transition-all',
                    selectedCats.length === 0
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-foreground hover:border-primary',
                  ].join(' ')}
                >
                  <span>Все</span>
                  <span className="text-[10px] opacity-70">{carFiltered.length}</span>
                </button>
              </li>
              {categories.map((c) => {
                const active = selectedCats.includes(c);
                const n = counts[c] ?? 0;
                return (
                  <li key={c}>
                    <button
                      onClick={() => toggleCat(c)}
                      disabled={n === 0}
                      className={[
                        'w-full flex items-center justify-between gap-2 text-left text-xs font-bold px-3 py-2 rounded-lg border transition-all',
                        active
                          ? 'bg-primary text-primary-foreground border-primary'
                          : n === 0
                          ? 'bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed'
                          : 'bg-card border-border text-foreground hover:border-primary',
                      ].join(' ')}
                    >
                      <span className="truncate">{c}</span>
                      <span className="text-[10px] opacity-70 shrink-0">{n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* Parts grid */}
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">
              Свежие детали
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              {visible.length} {visible.length === 1 ? 'позиция' : 'позиций'}
            </span>
          </div>

          {visible.length === 0 ? (
            <div className="text-center py-16 bg-background/40 rounded-xl border border-dashed border-border">
              <PackageSearch size={36} className="mx-auto text-muted-foreground mb-3" />
              <h4 className="font-bold text-foreground mb-1">Ничего не найдено</h4>
              <p className="text-sm text-muted-foreground">
                Попробуйте выбрать другие категории
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {visible.map((p) => (
                <ProductCard key={p.id} part={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && <PartDetailsModal part={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};

export default LatestPartsSection;
