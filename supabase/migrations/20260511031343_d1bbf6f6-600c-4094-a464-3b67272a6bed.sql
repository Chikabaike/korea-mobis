
CREATE TABLE public.site_visits (
  id integer PRIMARY KEY DEFAULT 1,
  count bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_visits_singleton CHECK (id = 1)
);

INSERT INTO public.site_visits (id, count) VALUES (1, 0) ON CONFLICT DO NOTHING;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_visits public read" ON public.site_visits FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.increment_site_visits()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count bigint;
BEGIN
  UPDATE public.site_visits
    SET count = count + 1, updated_at = now()
    WHERE id = 1
    RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_site_visits() TO anon, authenticated;
