import { Search, MapPin, Clock, Phone, Languages, Wrench } from 'lucide-react';
import { useFilter } from '../context/FilterContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { filters, setSearchQuery } = useFilter();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-card border-b border-border shrink-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <Wrench size={18} className="text-secondary-foreground" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-foreground leading-none">MOBIS</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Auto Parts</div>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-muted border border-transparent focus:border-primary focus:bg-card outline-none rounded-full text-sm py-2.5 pl-11 pr-4 transition-all"
            />
          </div>

          {/* Right meta */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+996700123456"
              className="hidden lg:flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Phone size={16} />
              <span>+996 700 123 456</span>
            </a>
            <button
              onClick={() => setLanguage(language === 'ru' ? 'kg' : 'ru')}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md hover:bg-muted"
            >
              <Languages size={14} />
              {language.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-muted border border-transparent focus:border-primary focus:bg-card outline-none rounded-full text-sm py-2.5 pl-11 pr-4"
          />
        </div>

        {/* Info bar */}
        <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground py-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-primary" />
            {t.address}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-primary" />
            {t.workHours}
          </div>
          <div className="ml-auto text-[10px] uppercase tracking-widest font-bold text-accent">
            {t.inStock}: 12 000+ позиций
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;