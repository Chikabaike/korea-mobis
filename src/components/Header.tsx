import { Search, MapPin, Clock, Phone, Languages, Wrench, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFilter } from '../context/FilterContext';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import hyundaiKiaLogo from '@/assets/hyundai-kia-logo.png';
import whatsappIcon from '@/assets/whatsapp.png';

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
          <div className="flex items-center justify-between gap-3 sm:gap-6 py-1.5 text-xs sm:text-sm">
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap">
                <a
                  href="https://yandex.com/maps/10309/bishkek/?ll=74.521744%2C42.881923&mode=poi&poi%5Bpoint%5D=74.521482%2C42.881651&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D129445298918&z=19.56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors min-w-0"
                >
                  <MapPin size={13} className="text-primary shrink-0" />
                  <span className="truncate">г.Бишкек, рынок Кудайберген Ряд 18, 33-34 контейнер</span>
                </a>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href="https://wa.me/996500160399"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    +996 500 160 399
                  </a>
                  <a
                    href="https://wa.me/996500160399"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="text-green-600 hover:text-green-500 transition-colors"
                  >
                    <MessageCircle size={14} fill="currentColor" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap">
                <a
                  href="https://yandex.com/maps/?text=%D0%B3.%D0%91%D0%B8%D1%88%D0%BA%D0%B5%D0%BA%2C%20%D1%81.%20%D0%9D%D0%BE%D0%B2%D0%BE%D0%BF%D0%B0%D0%B2%D0%BB%D0%BE%D0%B2%D0%BA%D0%B0%2C%20%D1%83%D0%BB.%20%D0%A4%D1%80%D1%83%D0%BD%D0%B7%D0%B5%20355"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors min-w-0"
                >
                  <MapPin size={13} className="text-primary shrink-0" />
                  <span className="truncate">г.Бишкек, с. Новопавловка ул. Фрунзе 355</span>
                </a>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href="https://wa.me/996508304444"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    +996 508 304 444
                  </a>
                  <a
                    href="https://wa.me/996508304444"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="text-green-600 hover:text-green-500 transition-colors"
                  >
                    <MessageCircle size={14} fill="currentColor" />
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
          <div className="flex flex-col items-center gap-1 shrink-0 min-w-0">
            <img
              src={hyundaiKiaLogo}
              alt="Hyundai Kia"
              className="h-6 sm:h-8 w-auto object-contain"
            />
            <div className="text-base sm:text-lg font-black tracking-tight text-foreground leading-none">
              <span className="text-red-600">КОРЕЯ</span>
              <span>-M</span>
              <span className="text-red-600">O</span>
              <span>BIS</span>
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

      </div>
    </header>
  );
};

export default Header;