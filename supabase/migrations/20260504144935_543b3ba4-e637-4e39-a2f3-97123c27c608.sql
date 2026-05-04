ALTER TABLE public.parts ADD COLUMN IF NOT EXISTS part_numbers jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Backfill from existing part_number where present
UPDATE public.parts
SET part_numbers = jsonb_build_array(part_number)
WHERE part_numbers = '[]'::jsonb AND coalesce(part_number, '') <> '';