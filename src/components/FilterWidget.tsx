import { ChevronDown, RotateCcw, Fuel } from 'lucide-react';
import { useFilter } from '../context/FilterContext';
import { useLanguage } from '../context/LanguageContext';
import { BRANDS } from '../data/mockData';
import type { FuelType } from '../types';

const FUEL_OPTIONS: FuelType[] = ['Бензин', 'Дизель', 'LPG/LPI', 'Hybrid'];

const Select = ({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  value: string | null;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}) => (
  <div className="relative">
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full appearance-none bg-muted border border-border rounded-lg px-4 py-3 pr-10 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
  </div>
);

const FilterWidget = ({ onSelection }: { onSelection?: () => void } = {}) => {
  const { filters, setBrand, setModel, setGeneration, setFuel, reset } = useFilter();
  const { t } = useLanguage();

  const brand = BRANDS.find((b) => b.name === filters.brand);
  const model = brand?.models.find((m) => m.name === filters.model);
  const generation = model?.generations.find((g) => g.generationName === filters.generation);
  const availableFuels = generation?.fuels ?? FUEL_OPTIONS;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">{t.filters}</h3>

        <div className="space-y-3">
          <Select
            value={filters.brand}
            onChange={(v) => setBrand(v || null)}
            options={BRANDS.map((b) => b.name)}
            placeholder={t.selectBrand}
          />
          <Select
            value={filters.model}
            onChange={(v) => {
              setModel(v || null);
            }}
            options={brand?.models.map((m) => m.name) ?? []}
            placeholder={t.selectModel}
            disabled={!brand}
          />
          <Select
            value={filters.generation}
            onChange={(v) => {
              setGeneration(v || null);
            }}
            options={model?.generations.map((g) => g.generationName) ?? []}
            placeholder={t.selectGeneration}
            disabled={!model}
          />
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-1.5">
          <Fuel size={12} />
          {t.engineType}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {FUEL_OPTIONS.map((f) => {
            const enabled = availableFuels.includes(f);
            const active = filters.fuel === f;
            return (
              <button
                key={f}
                disabled={!enabled}
                onClick={() => {
                  setFuel(active ? null : f);
                  onSelection?.();
                }}
                className={[
                  'text-xs font-bold py-2.5 rounded-lg border transition-all',
                  active
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : enabled
                    ? 'bg-card border-border text-foreground hover:border-primary'
                    : 'bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed',
                ].join(' ')}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={reset}
        className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground py-3 border border-dashed border-border rounded-lg hover:border-foreground transition-colors"
      >
        <RotateCcw size={14} />
        {t.resetFilters}
      </button>
    </div>
  );
};

export default FilterWidget;