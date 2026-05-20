// Runs before `vite dev` and `vite build`; writes public/sitemap.xml with one entry per part.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://korea-mobis.kg";
const SUPABASE_URL = "https://ygfhhltzhmyfxewaddnr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZmhobHR6aG15Znhld2FkZG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDUwMTcsImV4cCI6MjA5Mjk4MTAxN30.Ql4h1RMCPXfm0recQxGeTynzhAfc7F9Q2u-CTvIm91g";

type Entry = { loc: string; lastmod?: string; changefreq?: string; priority?: string };

async function main() {
  const entries: Entry[] = [
    { loc: `${BASE_URL}/`, changefreq: "daily", priority: "1.0" },
  ];

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from("parts")
      .select("id, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    for (const p of data ?? []) {
      entries.push({
        loc: `${BASE_URL}/part/${p.id}`,
        lastmod: p.updated_at ? new Date(p.updated_at).toISOString() : undefined,
        changefreq: "weekly",
        priority: "0.8",
      });
    }
  } catch (e) {
    console.warn("sitemap: failed to fetch parts, writing minimal sitemap:", (e as Error).message);
  }

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries.map((e) =>
      [
        `  <url>`,
        `    <loc>${e.loc}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
        e.priority ? `    <priority>${e.priority}</priority>` : null,
        `  </url>`,
      ].filter(Boolean).join("\n"),
    ),
    `</urlset>`,
  ].join("\n");

  writeFileSync(resolve("public/sitemap.xml"), xml);
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main();
