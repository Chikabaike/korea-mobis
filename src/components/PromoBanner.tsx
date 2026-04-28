import { Truck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

const PromoBanner = () => {
  const { language } = useLanguage();
  const { settings } = useStore();
  const text = language === 'ru' ? settings.promoRu : settings.promoKg;
  return (
    <div
      className="text-primary-foreground text-xs sm:text-sm font-medium py-2 px-4 flex items-center justify-center gap-2"
      style={{ background: 'var(--gradient-promo)' }}
    >
      <Truck size={16} className="hidden sm:inline" />
      <span className="text-center">{text}</span>
      <Sparkles size={16} className="hidden sm:inline" />
    </div>
  );
};

export default PromoBanner;