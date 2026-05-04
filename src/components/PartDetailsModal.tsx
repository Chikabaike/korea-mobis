import { X, ShieldCheck, Truck, MapPin, Phone } from 'lucide-react';
import type { CarPart } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useEffect } from 'react';

const PartDetailsModal = ({ part, onClose }: { part: CarPart; onClose: () => void }) => {
  const { t, language } = useLanguage();
  const { settings } = useStore();
  const address = language === 'kg' ? settings.addressKg : settings.addressRu;
  const mapUrl = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : '';
  const waNumber = (settings.whatsapp || settings.phone || '').replace(/[^\d]/g, '');
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : '';

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 max-h-[90vh] flex flex-col"
      >
        <div className="relative shrink-0">
          <img src={part.image} alt={part.name} className="w-full h-48 sm:h-72 lg:h-80 object-contain bg-muted" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/95 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-widest bg-card/95 backdrop-blur px-3 py-1.5 rounded-full text-foreground">
            {part.category}
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">
              {t.art}: AP-{part.id.slice(0, 5).toUpperCase()}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">{part.name}</h2>
          </div>

          {part.partNumber && (
            <div className="bg-muted rounded-lg px-3 py-2 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Артикул
              </div>
              <span className="font-semibold text-foreground bg-card border border-border rounded px-2 py-0.5 break-all inline-block">
                {part.partNumber}
              </span>
            </div>
          )}

          {part.partNumbers && part.partNumbers.length > 0 && (
            <div className="bg-muted rounded-lg px-3 py-2 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {part.partNumbers.length > 1 ? 'Номера запчасти' : 'Номер запчасти'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {part.partNumbers.map((n) => (
                  <span key={n} className="font-semibold text-foreground bg-card border border-border rounded px-2 py-0.5 break-all">{n}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{t.compatibility}</div>
            <div className="flex flex-wrap gap-1.5">
              {part.compatibility.map((f) => (
                <span key={f} className="text-xs font-semibold bg-muted text-foreground px-3 py-1 rounded-full">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {part.cars && part.cars.length > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Подходит на авто
              </div>
              <div className="flex flex-wrap gap-1.5">
                {part.cars.map((c, i) => (
                  <span
                    key={`${c.brand}-${c.model}-${c.generation ?? 'all'}-${i}`}
                    className="text-xs font-semibold bg-primary/10 text-foreground px-3 py-1 rounded-full border border-primary/20"
                  >
                    {c.brand} {c.model}
                    {c.generation ? ` · ${c.generation}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 py-3 border-y border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={16} className="text-primary" />
              Гарантия 12 мес
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck size={16} className="text-primary" />
              Доставка по КР
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-foreground leading-none">
              {part.price === -1 ? (
                'Договорная'
              ) : (
                <>
                  {part.price.toLocaleString('ru-RU')}
                  <span className="text-sm sm:text-base text-muted-foreground font-medium ml-1">сом</span>
                </>
              )}
            </div>
          </div>

          {(address || settings.phone || settings.whatsapp) && (
            <div className="space-y-2 pt-2 border-t border-border">
              {address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{address}</span>
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                    >
                      на карте
                    </a>
                  )}
                </div>
              )}
              {(settings.phone || settings.whatsapp) && (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {[settings.phone, settings.whatsapp].filter((p, i, arr) => p && arr.indexOf(p) === i).map((num) => {
                    const digits = num.replace(/[^\d]/g, '');
                    return (
                      <a
                        key={num}
                        href={`https://wa.me/${digits}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                      >
                        <Phone size={16} className="text-primary" />
                        <span className="font-semibold">{num}</span>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]" aria-label="WhatsApp">
                          <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartDetailsModal;