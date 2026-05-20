import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MessageCircle, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { CarPart } from '../types';

interface DbPart {
  id: string; name: string; category: string; price: number;
  image: string; compatibility: unknown; cars: unknown;
  part_number?: string | null;
  part_numbers?: unknown;
}

const mapPart = (r: DbPart): CarPart => ({
  id: r.id,
  name: r.name,
  category: r.category,
  price: Number(r.price),
  image: r.image,
  compatibility: (r.compatibility as CarPart['compatibility']) ?? [],
  cars: (r.cars as CarPart['cars']) ?? [],
  partNumber: r.part_number ?? '',
  partNumbers: Array.isArray(r.part_numbers) ? (r.part_numbers as string[]).filter(Boolean) : [],
});

const SITE = 'https://korea-mobis.kg';

const PartPage = () => {
  const { id } = useParams<{ id: string }>();
  const [part, setPart] = useState<CarPart | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    supabase
      .from('parts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setPart(mapPart(data as unknown as DbPart));
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    );
  }

  if (notFound || !part) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 p-6">
        <Helmet>
          <title>Запчасть не найдена — KOREA-MOBIS</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="text-2xl font-black">Запчасть не найдена</h1>
        <Link to="/" className="text-primary underline">На главную</Link>
      </div>
    );
  }

  const url = `${SITE}/part/${part.id}`;
  const allNumbers = [
    ...(part.partNumber ? [part.partNumber] : []),
    ...(part.partNumbers ?? []),
  ].filter(Boolean);
  const uniqueNumbers = Array.from(new Set(allNumbers));
  const carsText = (part.cars ?? [])
    .map((c) => `${c.brand} ${c.model}${c.generation ? ` ${c.generation}` : ''}`)
    .join(', ');
  const numbersText = uniqueNumbers.length ? `Артикул ${uniqueNumbers.join(', ')}. ` : '';
  const compatText = part.compatibility.length ? `${part.compatibility.join(', ')}. ` : '';
  const title = `${part.name}${uniqueNumbers[0] ? ` · ${uniqueNumbers[0]}` : ''} — KOREA-MOBIS Бишкек`;
  const description = `${part.name}. ${numbersText}${carsText ? `Подходит на: ${carsText}. ` : ''}${compatText}Купить в Бишкеке, доставка по Кыргызстану.`.slice(0, 300);

  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: part.name,
    image: part.image ? [part.image] : undefined,
    description,
    category: part.category,
    sku: uniqueNumbers[0],
    mpn: uniqueNumbers[0],
    brand: { '@type': 'Brand', name: part.cars?.[0]?.brand ?? 'KOREA-MOBIS' },
  };
  if (uniqueNumbers.length > 1) {
    productLd.identifier = uniqueNumbers;
  }
  if (part.price > 0) {
    productLd.offers = {
      '@type': 'Offer',
      url,
      priceCurrency: 'KGS',
      price: part.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
    };
  } else {
    productLd.offers = {
      '@type': 'Offer',
      url,
      priceCurrency: 'KGS',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
    };
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        {part.image && <meta property="og:image" content={part.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {part.image && <meta name="twitter:image" content={part.image} />}
        {uniqueNumbers.length > 0 && (
          <meta name="keywords" content={[part.name, ...uniqueNumbers, ...(part.cars ?? []).map((c) => `${c.brand} ${c.model}`)].join(', ')} />
        )}
        <script type="application/ld+json">{JSON.stringify(productLd)}</script>
      </Helmet>

      <header className="bg-card border-b border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> На главную
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">KOREA-MOBIS</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-6">
        <article className="bg-card rounded-2xl border border-border overflow-hidden">
          <img
            src={part.image}
            alt={part.name}
            className="w-full h-64 sm:h-96 object-contain bg-muted"
          />
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                {part.category}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
                {part.name}
              </h1>
            </div>

            {uniqueNumbers.length > 0 && (
              <div className="bg-muted rounded-lg px-3 py-3 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  {uniqueNumbers.length > 1 ? 'Номера запчасти / артикулы' : 'Артикул'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {uniqueNumbers.map((n) => (
                    <span key={n} className="font-semibold text-foreground bg-card border border-border rounded px-2 py-1 break-all">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {part.compatibility.length > 0 && (
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Тип топлива
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {part.compatibility.map((f) => (
                    <span key={f} className="text-xs font-semibold bg-muted text-foreground px-3 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                      {c.brand} {c.model}{c.generation ? ` · ${c.generation}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 border-y border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <a href="tel:+996508304444" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone size={16} className="text-primary" />
                  +996 508 304 444
                </a>
                <a
                  href="https://wa.me/996508304444"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#25D366] text-white"
                >
                  <MessageCircle size={14} />
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <MapPin size={16} className="text-primary" />
                <a
                  href="https://2gis.kg/bishkek/search/г.Бишкек%2C%20с.%20Новопавловка%20ул.%20Фрунзе%20355"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  г. Бишкек, с. Новопавловка, ул. Фрунзе 355
                </a>
              </div>
            </div>

            <div>
              <div className="text-3xl font-black text-foreground leading-none">
                {part.price <= 0 ? (
                  'Договорная'
                ) : (
                  <>
                    {part.price.toLocaleString('ru-RU')}
                    <span className="text-sm text-muted-foreground font-medium ml-1">сом</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default PartPage;
