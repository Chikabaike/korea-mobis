import type { CarPart, FuelType } from '../types';

const fuelColor: Record<FuelType, string> = {
  'Бензин': 'bg-blue-100 text-blue-700',
  'Дизель': 'bg-amber-100 text-amber-700',
  'LPG/LPI': 'bg-emerald-100 text-emerald-700',
  'Hybrid': 'bg-violet-100 text-violet-700',
};

const ProductCard = ({ part, onClick }: { part: CarPart; onClick: () => void }) => {
  return (
    <article
      onClick={onClick}
      className="group bg-card rounded-2xl border border-border overflow-hidden cursor-pointer hover:border-primary transition-all duration-300"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="aspect-[4/3] bg-muted overflow-hidden relative">
        <img
          src={part.image}
          alt={part.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest bg-card/95 backdrop-blur px-2.5 py-1 rounded-full text-foreground">
          {part.category}
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3 className="font-semibold text-foreground text-xs sm:text-sm leading-tight line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem]">{part.name}</h3>
        <div className="flex flex-wrap gap-1">
          {part.compatibility.map((f) => (
            <span key={f} className={`text-[9px] font-bold px-2 py-0.5 rounded ${fuelColor[f]}`}>
              {f}
            </span>
          ))}
        </div>
        {part.cars && part.cars.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {part.cars.slice(0, 3).map((c, i) => (
              <span
                key={`${c.brand}-${c.model}-${c.generation ?? 'all'}-${i}`}
                className="font-semibold px-2 py-0.5 bg-primary/10 text-foreground border border-primary/20 text-xs font-serif text-center text-gray-950 bg-slate-50 border-slate-400 rounded-3xl"
              >
                {c.brand} {c.model}{c.generation ? ` · ${c.generation}` : ''}
              </span>
            ))}
            {part.cars.length > 3 && (
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                +{part.cars.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
          <div>
            <div className="text-base sm:text-lg font-black text-foreground leading-none">
              {part.price === -1 ? (
                'Договорная'
              ) : (
                <>
                  {part.price.toLocaleString('ru-RU')}
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium ml-1">сом</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;