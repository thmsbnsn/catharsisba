import { useEffect } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const normalizeSelector = (selector) => {
  if (selector.startsWith('#') || selector.startsWith('.')) {
    return selector
  }
  return `#${selector}`
}

export function usePhotoSwipeGallery(galleryId) {
  useEffect(() => {
    if (!galleryId) return
    const selector = typeof galleryId === 'string' ? normalizeSelector(galleryId) : null
    const galleryElement =
      typeof galleryId === 'string'
        ? document.querySelector(selector)
        : galleryId

    if (!galleryElement) return

    const lightbox = new PhotoSwipeLightbox({
      gallery: selector ?? galleryElement,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })

    lightbox.on('contentLoadError', (e) => {
      const src = e?.content?.data?.src || 'unknown';
      console.error('[Gallery] Failed to load slide content:', src);
    })

    lightbox.init()

    return () => {
      lightbox.destroy()
    }
  }, [galleryId])
}
