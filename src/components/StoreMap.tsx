import { MapPin, Phone, MessageCircle } from 'lucide-react';

const ADDRESS = 'г. Бишкек, с. Новопавловка, ул. Фрунзе 355';
const MAP_LINK =
  'https://2gis.kg/bishkek/search/г.Бишкек%2C%20с.%20Новопавловка%20ул.%20Фрунзе%20355';

const StoreMap = () => {
  return (
    <section
      aria-labelledby="store-map-title"
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 sm:p-5 border-b border-border">
        <div>
          <h2
            id="store-map-title"
            className="text-base sm:text-lg font-bold text-foreground"
          >
            Наш магазин на карте
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <MapPin size={14} className="text-primary" />
            {ADDRESS}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="tel:+996508304444"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition"
          >
            <Phone size={14} /> +996 508 304 444
          </a>
          <a
            href="https://wa.me/996508304444"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-[#25D366] text-white hover:opacity-90 transition"
          >
            <MessageCircle size={16} />
          </a>
          <a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Открыть в 2ГИС
          </a>
        </div>
      </div>
      <div className="relative w-full aspect-[16/8] bg-muted">
        <iframe
          title="Карта магазина KOREA-MOBIS"
          src="https://yandex.com/map-widget/v1/?ll=74.516%2C42.890&z=15&pt=74.516,42.890,pm2rdm&l=map"
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </section>
  );
};

export default StoreMap;
