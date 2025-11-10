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

async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  try {
    return await getClient().fetch<T>(query, params)
  } catch (error) {
    console.warn('[sanity] Fetch failed', {query, params, error})
    return null
  }
}

const imageBuilder = imageUrlBuilder(client)

export const urlForImage = (source: unknown) => (source ? imageBuilder.image(source) : null)

export const portableTextToHtml = (blocks: unknown) =>
  Array.isArray(blocks)
    ? toHTML(blocks, {
        components: {
          block: ({children, value}) => {
            const tag = value?.style || 'normal'
            switch (tag) {
              case 'h1':
                return `<h1>${children}</h1>`
              case 'h2':
                return `<h2>${children}</h2>`
              case 'h3':
                return `<h3>${children}</h3>`
              case 'h4':
                return `<h4>${children}</h4>`
              case 'blockquote':
                return `<blockquote>${children}</blockquote>`
              default:
                return `<p>${children}</p>`
            }
          },
          list: ({children, type}) =>
            type === 'number' ? `<ol>${children}</ol>` : `<ul>${children}</ul>`,
          listItem: ({children}) => `<li>${children}</li>`,
          marks: {
            link: ({value, children}) => {
              const href = value?.href || '#'
              const rel = href.startsWith('/') ? 'noopener' : 'noopener noreferrer'
              return `<a href="${href}" rel="${rel}" target="_blank">${children}</a>`
            },
          },
          types: {
            image: ({value}) => {
              const builder = urlForImage(value?.asset || value)
              const src = builder?.width(1400).auto('format').url()
              if (!src) return ''
              const alt = value?.alt || ''
              const caption = alt ? `<figcaption>${alt}</figcaption>` : ''
              return `<figure class="portable-image"><img src="${src}" alt="${alt}" loading="lazy" decoding="async" />${caption}</figure>`
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

const blogCategoriesQuery = groq`*[_type == "blogCategory"] | order(title asc){
  title,
  "slug": slug.current,
  color
}`

const blogPostsQuery = groq`*[_type == "blogPost"] | order(publishedAt desc){
  title,
  "slug": slug.current,
  author,
  publishedAt,
  excerpt,
  "coverImage": {
    "asset": coverImage.asset->{
      _id,
      url,
      metadata {
        dimensions {width, height},
        lqip,
        palette
      }
    },
    "crop": coverImage.crop,
    "hotspot": coverImage.hotspot,
    "alt": coalesce(coverImage.alt, "")
  },
  "category": category->{
    title,
    "slug": slug.current,
    color
  }
}`

const blogPostDetailQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  author,
  publishedAt,
  excerpt,
  body[]{
    ...,
    ...select(
      _type == "image" => {
        "asset": asset->{
          _id,
          url,
          metadata {
            dimensions {width, height},
            lqip,
            palette
          }
        },
        alt
      },
      {}
    )
  },
  "coverImage": {
    "asset": coverImage.asset->{
      _id,
      url,
      metadata {
        dimensions {width, height},
        lqip,
        palette
      }
    },
    "crop": coverImage.crop,
    "hotspot": coverImage.hotspot,
    "alt": coalesce(coverImage.alt, "")
  },
  "category": category->{
    title,
    "slug": slug.current,
    color
  },
  "extraImages": extraImages[]{
    ...,
    "asset": asset->{
      _id,
      url,
      metadata {
        dimensions {width, height},
        lqip,
        palette
      }
    },
    alt
  }
}`

const blogSlugsQuery = groq`*[_type == "blogPost" && defined(slug.current)]{
  "slug": slug.current
}`

export async function getAllArtists() {
  const data = await fetchSanity<unknown[]>(artistListQuery)
  return data ?? []
}

export async function getArtistBySlug(slug: string) {
  if (!slug) return null
  return await fetchSanity(artistDetailQuery, {slug})
}

export async function getAllArtistSlugs() {
  const data = await fetchSanity<{slug: string}[]>(artistSlugsQuery)
  return (data ?? []).map((item) => item.slug)
}

export async function getEvents() {
  const data = await fetchSanity<unknown[]>(eventsQuery)
  return data ?? []
}

export async function getGlobalSettings() {
  return await fetchSanity(globalSettingsQuery)
}

export async function getPageSettings(route: string) {
  return await fetchSanity(pageSettingsQuery, {route})
}

export async function getBlogCategories() {
  const data = await fetchSanity<unknown[]>(blogCategoriesQuery)
  return data ?? []
}

export async function getBlogPosts() {
  const data = await fetchSanity<unknown[]>(blogPostsQuery)
  return data ?? []
}

export async function getBlogPostBySlug(slug: string) {
  if (!slug) return null
  return await fetchSanity(blogPostDetailQuery, {slug})
}

export async function getAllBlogSlugs() {
  const data = await fetchSanity<{slug: string}[]>(blogSlugsQuery)
  return (data ?? []).map((item) => item.slug)
}

