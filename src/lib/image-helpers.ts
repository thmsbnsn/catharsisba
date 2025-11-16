import { urlForImage } from './sanity'
import type { Image } from '../types'

type SanityImageSource = {
  _ref?: string
  asset?: { _ref?: string; url?: string }
  url?: string
}

type ImageSource = Image | SanityImageSource | string

const isSanityAsset = (image: unknown): image is SanityImageSource => {
  if (!image || typeof image !== 'object') return false
  const source = image as SanityImageSource
  return Boolean(source._ref || source.asset?._ref)
}

export type ImageFormat = 'webp' | 'avif' | 'jpg'

export interface ImageOptions {
  width?: number
  height?: number
  quality?: number
  format?: ImageFormat
  fit?: 'crop' | 'fill' | 'clip' | 'max'
}

export function buildImageUrl(image: ImageSource | unknown, options: ImageOptions = {}): string | null {
  if (!image) return null
  
  if (typeof image === 'string') return image

  const imageObj = image as SanityImageSource | Image
  const fallbackUrl =
    ('url' in imageObj ? imageObj.url : undefined) ??
    ('path' in imageObj && typeof (imageObj as {path?: string}).path === 'string' ? (imageObj as {path: string}).path : undefined) ??
    ('asset' in imageObj && imageObj.asset && 'url' in imageObj.asset ? imageObj.asset.url : undefined) ??
    null

  if (!isSanityAsset(image)) {
    return fallbackUrl
  }

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
  thumbnail: (image: ImageSource | unknown) => buildImageUrl(image, {width: 400, height: 400, fit: 'crop'}),
  card: (image: ImageSource | unknown) => buildImageUrl(image, {width: 800, height: 600, fit: 'crop'}),
  hero: (image: ImageSource | unknown) => buildImageUrl(image, {width: 1920, height: 1080, fit: 'crop'}),
  full: (image: ImageSource | unknown) => buildImageUrl(image, {width: 2400, fit: 'max'}),
} as const


