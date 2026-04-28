
-- Site settings: single-row config table
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  promo_ru TEXT NOT NULL DEFAULT '',
  promo_kg TEXT NOT NULL DEFAULT '',
  address_ru TEXT NOT NULL DEFAULT '',
  address_kg TEXT NOT NULL DEFAULT '',
  work_hours_ru TEXT NOT NULL DEFAULT '',
  work_hours_kg TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  -- models is JSON: [{name, generations: [{generationName, fuels: []}]}]
  models JSONB NOT NULL DEFAULT '[]'::jsonb,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  compatibility JSONB NOT NULL DEFAULT '[]'::jsonb, -- FuelType[]
  cars JSONB NOT NULL DEFAULT '[]'::jsonb,           -- CarCompatibility[]
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

-- Public read for all
CREATE POLICY "site_settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "categories public read"   ON public.categories   FOR SELECT USING (true);
CREATE POLICY "brands public read"       ON public.brands       FOR SELECT USING (true);
CREATE POLICY "parts public read"        ON public.parts        FOR SELECT USING (true);

-- Authenticated users can write (single-owner model: only owner has account)
CREATE POLICY "site_settings auth write"  ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "categories auth write"     ON public.categories    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "brands auth write"         ON public.brands        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "parts auth write"          ON public.parts         FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Auto-update updated_at on parts/brands/site_settings
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_parts_updated  BEFORE UPDATE ON public.parts          FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_brands_updated BEFORE UPDATE ON public.brands         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_settings_upd   BEFORE UPDATE ON public.site_settings  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed single settings row
INSERT INTO public.site_settings (id, promo_ru, promo_kg, address_ru, address_kg, work_hours_ru, work_hours_kg, phone, whatsapp)
VALUES (1,
  'Бесплатная доставка по Бишкеку при заказе от 5000 сом',
  'Бишкек боюнча 5000 сомдон жогорку буюртмага текин жеткирүү',
  'г. Бишкек, ул. Ибраимова 115',
  'Бишкек ш., Ибраимов көч. 115',
  'Пн–Сб 9:00 – 19:00',
  'Дш–Иш 9:00 – 19:00',
  '+996700123456',
  '996700123456')
ON CONFLICT (id) DO NOTHING;

-- Storage bucket for part images (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('part-images', 'part-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "part-images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'part-images');

CREATE POLICY "part-images auth upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'part-images');

CREATE POLICY "part-images auth update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'part-images');

CREATE POLICY "part-images auth delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'part-images');
