/// <reference types="vite/client" />

// Add any custom environment variables here. Vite exposes variables prefixed
// with VITE_ to client code. If you reference non-VITE vars in client code
// (not recommended), you can add them here to satisfy TypeScript.

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  // For backward-compat or staged setups where SITE_URL might be used in node
  // contexts, you can optionally declare it. Prefer VITE_ prefixed names.
  readonly SITE_URL?: string;
  // add more custom env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
