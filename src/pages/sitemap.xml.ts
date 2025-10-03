import { getCollection } from "astro:content";
import { siteConfig } from "../site.config";

export async function get() {
  const site = siteConfig.url;
  const artists = await getCollection("artists");

  const pages = [
    "",
    "artists",
    "gallery",
    "contact",
    "our-studio",
    "aftercare",
    ...artists.map((a) => `artists/${a.slug}`),
  ];

  return {
    body: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `<url><loc>${site}/${p}</loc></url>`).join("\n")}
</urlset>`,
    headers: { "Content-Type": "application/xml" },
  };
}
