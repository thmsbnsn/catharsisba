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

export const env = {
  sanity: {
    projectId,
    dataset,
    apiVersion,
    token: sanityToken,
    useCdn: typeof publicUseCdn === 'string' ? publicUseCdn !== 'false' : import.meta.env.PROD,
  },
  site: {
    url: import.meta.env.VITE_SITE_URL || '',
  },
  runtime: {
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
} as const
