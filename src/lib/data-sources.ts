import { getCollection, type CollectionEntry } from 'astro:content'
import { getAllArtists, getArtistBySlug, getBlogPosts } from './sanity'
import type { Artist, Image, BlogPost } from '../types'

type ArtistCollectionEntry = CollectionEntry<'artists'>

type NormalizedArtist = Artist & {
  slug: string
  videos?: string[]
  gallery: Image[]
  profileImage?: Image
}

type BlogHighlight = Pick<BlogPost, 'slug' | 'title' | 'excerpt' | 'author' | 'publishedAt' | 'coverImage' | 'category'> & {
  coverImageLqip?: string
  formattedDate?: string
}

type ImageManifestItem = {
  src: string
  width?: number
  height?: number
  w?: number
  h?: number
  alt?: string
  folder?: string
}

const manifestCache = new Map<string, Promise<ImageManifestItem[]>>()

async function loadManifest(slug: string): Promise<ImageManifestItem[]> {
  if (!manifestCache.has(slug)) {
    manifestCache.set(
      slug,
      import(`../image-manifests/${slug}.json`).then((mod) => mod.default).catch(() => [])
    )
  }
  return manifestCache.get(slug) as Promise<ImageManifestItem[]>
}

const mapContentImage = (image: ImageManifestItem | {src: string; width?: number; height?: number; w?: number; h?: number; alt?: string}): Image => ({
  url: image.src,
  width: image.width ?? ('w' in image ? image.w : undefined),
  height: image.height ?? ('h' in image ? image.h : undefined),
  alt: image.alt,
})

async function fallbackArtists(): Promise<NormalizedArtist[]> {
  const entries = await getCollection('artists')
  const result: NormalizedArtist[] = []

  for (const entry of entries) {
    const manifest = await loadManifest(entry.slug)
    const profile =
      manifest.find((img) => img.folder?.includes('profile-images')) || manifest[0] || null

    const artistImages = (entry.data.images || []).map(mapContentImage)

    result.push({
      slug: entry.slug,
      name: entry.data.name,
      position: entry.data.styles?.[0] ?? 'Artist',
      shortBio: entry.data.bio,
      bio: entry.data.bio,
      styles: entry.data.styles ?? [],
      email: entry.data.email,
      socialLinks: entry.data.instagram ? {instagram: entry.data.instagram} : undefined,
      profileImage: profile ? mapContentImage(profile) : entry.data.hero ? {url: entry.data.hero} : undefined,
      gallery: [...artistImages, ...manifest.filter((img) => img.folder?.includes('tattoo') || img.folder?.includes('piercing')).map(mapContentImage)],
    })
  }

  return result
}

const ensureGallery = (gallery?: Image[]) => gallery?.filter((img): img is Image => Boolean(img?.url)) ?? []

export async function getArtists(): Promise<NormalizedArtist[]> {
  const sanityArtists = await getAllArtists()
  if (sanityArtists.length) {
    return sanityArtists.map((artist) => ({
      ...artist,
      gallery: ensureGallery(artist.gallery),
    }))
  }
  return fallbackArtists()
}

export async function getArtist(slug: string): Promise<NormalizedArtist | null> {
  if (!slug) return null
  const sanityArtist = await getArtistBySlug(slug)
  if (sanityArtist) {
    return {
      ...sanityArtist,
      gallery: ensureGallery(sanityArtist.gallery),
    }
  }
  const artists = await fallbackArtists()
  return artists.find((artist) => artist.slug === slug) ?? null
}

export async function getBlogHighlights(limit = 3): Promise<BlogHighlight[]> {
  const posts = await getBlogPosts()
  return posts.slice(0, limit).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    publishedAt: post.publishedAt,
    coverImage: post.coverImage,
    coverImageLqip: post.coverImage?.lqip,
    category: post.category,
    formattedDate: post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : undefined,
  }))
}

export type { NormalizedArtist, BlogHighlight }
