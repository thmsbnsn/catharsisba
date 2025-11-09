import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {toHTML} from '@portabletext/to-html'
import groq from 'groq'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId) {
  throw new Error('Missing PUBLIC_SANITY_PROJECT_ID environment variable')
}

const token = import.meta.env.SANITY_API_TOKEN
const useCdn = import.meta.env.PROD

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})

const previewClient = token
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
      perspective: 'previewDrafts',
    })
  : client

const getClient = () => (import.meta.env.DEV && token ? previewClient : client)

const imageBuilder = imageUrlBuilder(client)

export const urlForImage = (source: unknown) => (source ? imageBuilder.image(source) : null)

export const portableTextToHtml = (blocks: unknown) =>
  Array.isArray(blocks)
    ? toHTML(blocks, {
        components: {
          block: ({children}) => `<p>${children}</p>`,
          marks: {
            link: ({value, children}) => {
              const href = value?.href || '#'
              const rel = href.startsWith('/') ? 'noopener' : 'noopener noreferrer'
              return `<a href="${href}" rel="${rel}" target="_blank">${children}</a>`
            },
          },
        },
      })
    : ''

const artistListQuery = groq`*[_type == "artist"] | order(name asc) {
  name,
  "slug": slug.current,
  position,
  shortBio,
  socialLinks,
  "profileImage": {
    "asset": profileImage.asset->{
      _id,
      url,
      metadata {
        dimensions {width, height},
        lqip,
        palette
      }
    },
    "crop": profileImage.crop,
    "hotspot": profileImage.hotspot
  }
}`

const artistDetailQuery = groq`*[_type == "artist" && slug.current == $slug][0]{
  name,
  "slug": slug.current,
  position,
  shortBio,
  bio,
  email,
  socialLinks,
  videos,
  "profileImage": {
    "asset": profileImage.asset->{
      _id,
      url,
      metadata {
        dimensions {width, height},
        lqip,
        palette
      }
    },
    "crop": profileImage.crop,
    "hotspot": profileImage.hotspot
  },
  "gallery": gallery[]{
    ...,
    "asset": asset->{
      _id,
      url,
      metadata {
        dimensions {width, height},
        lqip,
        palette
      }
    }
  }
}`

const artistSlugsQuery = groq`*[_type == "artist" && defined(slug.current)]{ "slug": slug.current }`

const eventsQuery = groq`*[_type == "event"] | order(startDate asc){
  title,
  "slug": slug.current,
  startDate,
  endDate,
  location,
  partners,
  featured,
  ctaLabel,
  ctaUrl,
  description,
  "heroImage": {
    "asset": heroImage.asset->{
      _id,
      url,
      metadata {
        dimensions {width, height},
        lqip,
        palette
      }
    },
    "crop": heroImage.crop,
    "hotspot": heroImage.hotspot
  }
}`

const globalSettingsQuery = groq`*[_type == "globalSettings"][0]{
  contact,
  hours,
  socialLinks,
  announcement
}`

const pageSettingsQuery = groq`*[_type == "pageSettings" && route == $route][0]{
  route,
  heroTitle,
  heroSubtitle,
  backgroundOverlay,
  cta,
  "heroMedia": {
    "asset": heroMedia.asset->{
      _id,
      url,
      metadata {
        dimensions {width, height},
        lqip,
        palette
      }
    },
    "crop": heroMedia.crop,
    "hotspot": heroMedia.hotspot
  }
}`

export async function getAllArtists() {
  const data = await getClient().fetch(artistListQuery)
  return data || []
}

export async function getArtistBySlug(slug: string) {
  if (!slug) return null
  return await getClient().fetch(artistDetailQuery, {slug})
}

export async function getAllArtistSlugs() {
  const data = await getClient().fetch(artistSlugsQuery)
  return (data || []).map((item: {slug: string}) => item.slug)
}

export async function getEvents() {
  const data = await getClient().fetch(eventsQuery)
  return data || []
}

export async function getGlobalSettings() {
  return await getClient().fetch(globalSettingsQuery)
}

export async function getPageSettings(route: string) {
  return await getClient().fetch(pageSettingsQuery, {route})
}

