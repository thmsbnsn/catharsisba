import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  // Use VITE_ prefix so Astro/Vite can read it
  site: import.meta.env.VITE_SITE_URL,
  output: "static",
  integrations: [react(), tailwind()],
  build: {
    inlineStylesheets: "auto",
  },
});
