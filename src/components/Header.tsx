import { Search, MapPin, Clock, Phone, Languages, Wrench, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFilter } from '../context/FilterContext';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

const Header = () => {
  const { filters, setSearchQuery } = useFilter();
  const { language, setLanguage, t } = useLanguage();
  const { settings } = useStore();
  const address = language === 'ru' ? settings.addressRu : settings.addressKg;
  const workHours = language === 'ru' ? settings.workHoursRu : settings.workHoursKg;

  return (
    <header className="bg-card border-b border-border shrink-0">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-6 h-9 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin size={13} className="text-primary shrink-0" />
              <span>г.Бишкек</span>
            </div>
            <a
              href="tel:+996508304444"
              className="font-semibold text-foreground hover:text-primary transition-colors"
            >
              +996 508 304 444
            </a>
            <a
              href="#map"
              className="text-primary hover:underline font-medium"
            >
              Магазины на карте
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <Wrench size={16} className="text-secondary-foreground sm:hidden" />
              <Wrench size={18} className="text-secondary-foreground hidden sm:block" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-foreground leading-none">
                <span className="text-red-600">КОРЕЯ</span>
                <span>-M</span>
                <span className="text-red-600">O</span>
                <span>BIS</span>
              </div>
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
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a
              href={`tel:${settings.phone}`}
              className="hidden lg:flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Phone size={16} />
              <span>{settings.phone}</span>
            </a>
            <a
              href={`tel:${settings.phone}`}
              className="lg:hidden w-9 h-9 rounded-md flex items-center justify-center text-foreground hover:bg-muted"
              aria-label="Call"
            >
              <Phone size={16} />
            </a>
            <button
              onClick={() => setLanguage(language === 'ru' ? 'kg' : 'ru')}
              className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted"
            >
              <Languages size={14} />
              {language.toUpperCase()}
            </button>
            <Link
              to="/admin"
              aria-label="Админ-панель"
              title="Админ-панель"
              className="w-9 h-9 rounded-md flex items-center justify-center text-foreground hover:bg-muted hover:text-primary transition-colors"
            >
              <Settings size={18} />
            </Link>
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
        <div className="hidden md:flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-muted-foreground py-2 border-t border-border">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-primary" />
            {address}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-primary" />
            {workHours}
          </div>
          <div className="md:ml-auto text-[10px] uppercase tracking-widest font-bold text-accent">
            {t.inStock}: 12 000+ позиций
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;