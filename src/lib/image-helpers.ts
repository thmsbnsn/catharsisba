import { urlForImage } from './sanity'

export type ImageFormat = 'webp' | 'avif' | 'jpg'

export interface ImageOptions {
  width?: number
  height?: number
  quality?: number
  format?: ImageFormat
  fit?: 'crop' | 'fill' | 'clip' | 'max'
}

export function buildImageUrl(image: unknown, options: ImageOptions = {}): string | null {
  if (!image) return null

  const fallbackUrl = (image as {url?: string}).url ?? (image as {asset?: {url?: string}}).asset?.url ?? null

  const builder = urlForImage(image)
  if (!builder) return fallbackUrl

  let result = builder

  if (options.width) {
    result = result.width(options.width)
  }
  if (options.height) {
    result = result.height(options.height)
  }
  if (options.quality) {
    result = result.quality(options.quality)
  }
  if (options.fit) {
    result = result.fit(options.fit)
  }
  if (options.format) {
    result = result.format(options.format)
  }

  return result.auto('format').url() ?? fallbackUrl
}

export const imagePresets = {
  thumbnail: (image: unknown) => buildImageUrl(image, {width: 400, height: 400, fit: 'crop'}),
  card: (image: unknown) => buildImageUrl(image, {width: 800, height: 600, fit: 'crop'}),
  hero: (image: unknown) => buildImageUrl(image, {width: 1920, height: 1080, fit: 'crop'}),
  full: (image: unknown) => buildImageUrl(image, {width: 2400, fit: 'max'}),
} as const


