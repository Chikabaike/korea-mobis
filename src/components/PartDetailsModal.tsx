import { X, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import type { CarPart } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useEffect } from 'react';

const PartDetailsModal = ({ part, onClose }: { part: CarPart; onClose: () => void }) => {
  const { t } = useLanguage();
  const { settings } = useStore();

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
          <img src={part.image} alt={part.name} className="w-full h-48 sm:h-72 lg:h-80 object-cover" />
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

          {(part.partNumber || part.vin) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {part.partNumber && (
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Номер запчасти</div>
                  <div className="font-semibold text-foreground break-all">{part.partNumber}</div>
                </div>
              )}
              {part.vin && (
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">VIN-код</div>
                  <div className="font-semibold text-foreground break-all">{part.vin}</div>
                </div>
              )}
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-foreground leading-none">
                {part.price.toLocaleString('ru-RU')}
                <span className="text-sm sm:text-base text-muted-foreground font-medium ml-1">сом</span>
              </div>
            </div>
            <a
              href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Интересует: ${part.name} (AP-${part.id})`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto sm:flex-1 sm:max-w-xs flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 sm:py-3.5 px-5 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <MessageCircle size={16} />
              {t.contactWhatsapp}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetailsModal;