# Utility Scripts

Only one script remains in this directory:

- `gen-image-manifests.mjs` – Generates the JSON manifests used by the gallery components. Run with `npm run build:manifests` (or `node src/scripts/gen-image-manifests.mjs`) whenever you add new artist imagery.

All legacy Hostinger/FTP deployment scripts have been removed; Vercel handles deploys automatically when you push to `main`.
