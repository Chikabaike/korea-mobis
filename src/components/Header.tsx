import { Search, MapPin, Clock, Phone, Wrench, Sun, Moon } from 'lucide-react';
import { useFilter } from '../context/FilterContext';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import hyundaiKiaLogo from '@/assets/hyundai-kia-logo.png';
import whatsappIcon from '@/assets/whatsapp.png';
import instagramIcon from '@/assets/instagram.png';

const Header = () => {
  const { filters, setSearchQuery } = useFilter();
  const { t, language, setLanguage } = useLanguage();
  const { settings } = useStore();
  const { theme, toggleTheme } = useTheme();
  const address = settings.addressRu;
  const workHours = settings.workHoursRu;

  const handleLogoClick = () => {
    window.location.href = '/';
  };


  return (
    <header className="bg-card border-b border-border shrink-0">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-6 py-1.5 text-xs font-mono sm:text-lg">
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3 min-w-0 sm:flex-wrap sm:text-base">
                <a
                  href="https://yandex.com/maps/?text=%D0%B3.%D0%91%D0%B8%D1%88%D0%BA%D0%B5%D0%BA%2C%20%D1%81.%20%D0%9D%D0%BE%D0%B2%D0%BE%D0%BF%D0%B0%D0%B2%D0%BB%D0%BE%D0%B2%D0%BA%D0%B0%2C%20%D1%83%D0%BB.%20%D0%A4%D1%80%D1%83%D0%BD%D0%B7%D0%B5%20355"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors min-w-0"
                >
                  <MapPin size={13} className="text-primary shrink-0" />
                  <span className="truncate">г.Бишкек, с. Новопавловка ул. Фрунзе 355</span>
                </a>
                <div className="flex items-center gap-2 shrink-0 ml-1">
                  <a
                    href="tel:+996508304444"
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    +996 508 304 444
                  </a>
                  <a
                    href="https://wa.me/996508304444"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="shrink-0 hover:opacity-80 transition-opacity"
                  >
                    <img src={whatsappIcon} alt="WhatsApp contact" className="w-5 h-5 object-cover rounded-[22%]" />
                  </a>
                  <a
                    href="https://www.instagram.com/koreamobis_4444/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="shrink-0 hover:opacity-80 transition-opacity"
                  >
                    <img src={instagramIcon} alt="Instagram profile" className="w-5 h-5 object-cover rounded-[22%]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="Логотип"
            className="flex flex-col items-center gap-1 shrink-0 min-w-0 select-none cursor-pointer focus:outline-none"
          >
            <img
              src={hyundaiKiaLogo}
              alt="Hyundai Kia Mobis"
              className="h-12 sm:h-16 w-auto object-contain pointer-events-none"
              draggable={false}
            />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="w-full bg-muted border-2 border-primary/60 focus:border-primary focus:bg-card outline-none rounded-full text-sm py-2.5 pl-11 pr-4 transition-all shadow-[0_0_12px_hsl(var(--primary)/0.6),inset_0_0_6px_hsl(var(--primary)/0.25)] focus:shadow-[0_0_22px_hsl(var(--primary)/0.9),inset_0_0_10px_hsl(var(--primary)/0.4)] animate-pulse-glow"
            />
          </div>

          {/* Right meta */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('ru')}
                className={`px-2 py-1 rounded-full transition-colors ${language === 'ru' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="Русский"
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => setLanguage('kg')}
                className={`px-2 py-1 rounded-full transition-colors ${language === 'kg' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="Кыргызча"
              >
                KG
              </button>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              className="p-2 rounded-full border border-border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a
              href={`tel:${settings.phone}`}
              className="hidden lg:flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full bg-muted border-2 border-primary/60 focus:border-primary focus:bg-card outline-none rounded-full text-sm py-2.5 pl-11 pr-4 shadow-[0_0_12px_hsl(var(--primary)/0.6),inset_0_0_6px_hsl(var(--primary)/0.25)] focus:shadow-[0_0_22px_hsl(var(--primary)/0.9),inset_0_0_10px_hsl(var(--primary)/0.4)] animate-pulse-glow"
          />
        </div>

      </div>
    </header>
  );
};

export default Header;