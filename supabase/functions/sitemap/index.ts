// Dynamic sitemap.xml with one URL per part for Google indexing.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://korea-mobis.kg";

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const { data, error } = await supabase
      .from("parts")
      .select("id, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw error;

    const urls = [
      `<url><loc>${SITE}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      ...(data ?? []).map((p) => {
        const lastmod = p.updated_at ? new Date(p.updated_at).toISOString() : "";
        return `<url><loc>${SITE}/part/${p.id}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>weekly</changefreq><priority>0.8</priority></url>`;
      }),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

    return new Response(xml, {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": "public, max-age=3600",
        "access-control-allow-origin": "*",
      },
    });
  } catch (e) {
    return new Response(`error: ${(e as Error).message}`, { status: 500 });
  }
});
