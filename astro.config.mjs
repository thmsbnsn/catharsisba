import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

const siteUrl = process.env.VITE_SITE_URL || process.env.SITE || undefined

export default defineConfig({
  site: siteUrl,
  output: "static",
  adapter: vercel(),
  integrations: [react(), tailwind()],
  build: {
    inlineStylesheets: "auto",
  },
});
