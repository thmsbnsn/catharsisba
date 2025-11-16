import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {toHTML} from '@portabletext/to-html'
import groq from 'groq'
import { env } from './env'
import type { Artist, BlogPost, Image, PortableTextBlock } from '../types'

const {projectId, dataset, apiVersion, token, useCdn} = env.sanity

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

const getClient = () => (env.runtime.isDev && token ? previewClient : client)

type SanityPortableImage = {
  asset?: {
    _id?: string
    _ref?: string
    url?: string
    metadata?: {
      lqip?: string
      dimensions?: {width?: number; height?: number}
      palette?: Record<string, unknown>
    }
  }
  crop?: Record<string, unknown>
  hotspot?: Record<string, unknown>
  alt?: string
}

type SanityArtist = {
  name: string
  slug: {current: string}
  position?: string
  shortBio?: string
  bio?: PortableTextBlock[]
  email?: string
  socialLinks?: Record<string, string>
  videos?: string[]
  profileImage?: SanityPortableImage
  gallery?: SanityPortableImage[]
}

type SanityBlogPost = {
  title: string
  slug: {current: string}
  author?: string
  publishedAt?: string
  excerpt?: string
  coverImage?: SanityPortableImage & {alt?: string}
  category?: {
    title?: string
    slug?: {current: string}
    color?: string
  }
  body?: PortableTextBlock[]
  extraImages?: SanityPortableImage[]
}

async function fetchSanity<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  try {
    return await getClient().fetch<T>(query, params)
  } catch (error) {
    console.error('[sanity] Fetch failed:', error instanceof Error ? error.message : 'Unknown error', {query, params})
    return null
  }
}

const imageBuilder = imageUrlBuilder(client)

export const urlForImage = (source: SanityPortableImage | unknown) => (source ? imageBuilder.image(source) : null)

const mapSanityImage = (image?: SanityPortableImage): Image | undefined => {
  const url = image?.asset?.url
  if (!url) return undefined
  return {
    url,
    width: image.asset?.metadata?.dimensions?.width,
    height: image.asset?.metadata?.dimensions?.height,
    lqip: image.asset?.metadata?.lqip,
    alt: image.alt,
  }
}

export const portableTextToHtml = (blocks: PortableTextBlock[] | undefined) =>
  Array.isArray(blocks) && blocks.length > 0
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
            type === 'number' ? `<ol>${children}</ol>` : `<ul>${children}</ul>`
          ,
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

const mapSanityArtistToCore = (artist: SanityArtist): Artist => ({
  slug: artist.slug.current,
  name: artist.name,
  position: artist.position,
  shortBio: artist.shortBio,
  bio: artist.bio,
  email: artist.email,
  socialLinks: artist.socialLinks,
  profileImage: mapSanityImage(artist.profileImage),
  gallery: artist.gallery?.map(mapSanityImage).filter(Boolean) as Image[] | undefined,
})

const mapSanityPost = (post: SanityBlogPost): BlogPost => ({
  slug: post.slug.current,
  title: post.title,
  author: post.author,
  excerpt: post.excerpt,
  publishedAt: post.publishedAt,
  body: post.body,
  coverImage: mapSanityImage(post.coverImage),
  category: post.category
    ? {
        title: post.category.title || '',
        slug: post.category.slug?.current || '',
        color: post.category.color,
      }
    : undefined,
  extraImages: post.extraImages?.map(mapSanityImage).filter(Boolean) as Image[] | undefined,
})

export async function getAllArtists() {
  const data = await fetchSanity<SanityArtist[]>(artistListQuery)
  return data ? data.map(mapSanityArtistToCore) : []
}

export async function getArtistBySlug(slug: string) {
  if (!slug) return null
  const data = await fetchSanity<SanityArtist>(artistDetailQuery, {slug})
  return data ? mapSanityArtistToCore(data) : null
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
  const data = await fetchSanity<SanityBlogPost[]>(blogPostsQuery)
  return data ? data.map(mapSanityPost) : []
}

export async function getBlogPostBySlug(slug: string) {
  if (!slug) return null
  const data = await fetchSanity<SanityBlogPost>(blogPostDetailQuery, {slug})
  return data ? mapSanityPost(data) : null
}

export async function getAllBlogSlugs() {
  const data = await fetchSanity<{slug: string}[]>(blogSlugsQuery)
  return (data ?? []).map((item) => item.slug)
}

