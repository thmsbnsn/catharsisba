import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { usePhotoSwipeGallery } from "../hooks/usePhotoSwipeGallery.js";
import { imagePresets } from "../lib/image-helpers";

/**
 * @typedef {{ path: string; folder: string; width?: number; height?: number; alt?: string }} ManifestImage
 * @typedef {{ slug: string; title: string; color?: string }} Category
 * @typedef {{ path: string; width?: number; height?: number; alt?: string }} GalleryImage
 */

// Import artist manifests
import chrisImages from "../image-manifests/chris-summers.json";
import austinImages from "../image-manifests/austin-stirling.json";


// Only piercings + tattoo folders
const piercingImages = chrisImages.filter((img) =>
  img.folder.includes("piercing-images")
);
const tattooImages = austinImages.filter((img) =>
  img.folder.includes("tattoo-images")
);

/**
 * @param {{ images: GalleryImage[]; galleryId: string }} props
 */
function LightboxWrapper({ images, galleryId }) {
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  usePhotoSwipeGallery(`.${galleryId}-root`);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!images || images.length === 0) {
    if (import.meta.env.DEV) {
      console.log("No images available for gallery:", galleryId);
    }
    return <p className="text-white/60">No images available.</p>;
  }

  if (import.meta.env.DEV) {
    console.log(
      `Gallery ${galleryId} has ${images.length} images:`,
      images.slice(0, 3),
    );
  }

  const hydratedImages = images
    .filter((img) => img?.path)
    .map((img) => {
      const cardUrl = imagePresets.card(img);
      return {
        ...img,
        url: cardUrl ?? img.path,
      };
    });

  return (
    <div className={`${galleryId}-root relative`}>
      {/* Swipe Hint Overlay */}
      {showSwipeHint && (
        <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm rounded-full px-3 py-2 text-white text-sm font-medium animate-pulse">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span className="hidden sm:inline">Swipe to see more</span>
            <span className="sm:hidden">Swipe</span>
          </div>
        </div>
      )}

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={12}
        slidesPerView={1.2}
        navigation={{
          nextEl: `.${galleryId}-next`,
          prevEl: `.${galleryId}-prev`,
        }}
        pagination={{
          el: `.${galleryId}-pagination`,
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2.2,
            navigation: {
              enabled: true,
            },
          },
          1024: {
            slidesPerView: 3.2,
            navigation: {
              enabled: true,
            },
          },
        }}
        className="gallery-swiper"
      >
        {hydratedImages.map((img, i) => (
          <SwiperSlide
            key={img.path}
            className="gallery-slide"
            style={{ "--slide-delay": `${i * 0.08}s` }}
          >
            <a
              href={img.path}
              data-pswp-src={img.path}
              data-pswp-width={img.width || 1600}
              data-pswp-height={img.height || 1200}
              className="block group"
            >
              <picture>
                <img
                  loading="lazy"
                  decoding="async"
                  src={img.url}
                  alt={img.alt || `Gallery image ${i + 1}`}
                  className="aspect-[4/3] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 gallery-image"
                  width={img.width}
                  height={img.height}
                />
              </picture>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows (Desktop) */}
      <button
        className={`${galleryId}-prev gallery-nav-btn gallery-nav-prev`}
        aria-label="Previous images"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className={`${galleryId}-next gallery-nav-btn gallery-nav-next`}
        aria-label="Next images"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className={`${galleryId}-pagination gallery-pagination`}></div>
    </div>
  );
}

export default function Gallery() {
  return (
    <ErrorBoundary>
      <div className="space-y-12">
        {/* Tattoo Work */}
        <section>
          <h2 className="font-serif text-2xl mb-4">Tattoo Work</h2>
          <LightboxWrapper images={tattooImages} galleryId="tattoo-gallery" />
        </section>

        {/* Piercings */}
        <section>
          <h2 className="font-serif text-2xl mb-4">Piercings</h2>
          <LightboxWrapper images={piercingImages} galleryId="piercing-gallery" />
        </section>
      </div>
    </ErrorBoundary>
  );
}
