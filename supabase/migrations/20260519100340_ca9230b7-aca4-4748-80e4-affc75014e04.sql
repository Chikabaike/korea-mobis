-- Drop the broad public SELECT on storage.objects that allowed anonymous listing.
-- Public file URLs continue to work because public buckets serve files through the storage CDN
-- independently of storage.objects SELECT policies.
DROP POLICY IF EXISTS "part-images public read" ON storage.objects;