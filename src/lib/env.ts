const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION

if (!projectId) {
  throw new Error('Missing required environment variable: PUBLIC_SANITY_PROJECT_ID')
}

if (!dataset) {
  throw new Error('Missing required environment variable: PUBLIC_SANITY_DATASET')
}

if (!apiVersion) {
  throw new Error('Missing required environment variable: PUBLIC_SANITY_API_VERSION')
}

const sanityToken = import.meta.env.SANITY_API_TOKEN
const publicUseCdn = import.meta.env.PUBLIC_SANITY_USE_CDN
const siteUrl = import.meta.env.VITE_SITE_URL || import.meta.env.SITE

if (!siteUrl && import.meta.env.PROD) {
  console.warn('Warning: VITE_SITE_URL is not set in production. Some features may not work correctly.')
}

export const env = {
  sanity: {
    projectId,
    dataset,
    apiVersion,
    token: sanityToken,
    useCdn: typeof publicUseCdn === 'string' ? publicUseCdn !== 'false' : import.meta.env.PROD,
  },
  site: {
    url: siteUrl || '',
  },
  runtime: {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
} as const
