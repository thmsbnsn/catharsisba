import { useId, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { usePhotoSwipeGallery } from "../hooks/usePhotoSwipeGallery.js";
import { imagePresets } from "../lib/image-helpers";

/**
 * @typedef {import("../types").Image} Image
 * @typedef {{ url: string; width?: number; height?: number; alt?: string; lqip?: string }} GalleryImage
 */

/**
 * @param {{ images?: GalleryImage[] }} props
 */
export default function ArtistGallery({ images = [] }) {
  const gid = useId().replace(/:/g, "");
  const galleryId = `pswp-gallery-${gid}`;

  usePhotoSwipeGallery(`#${galleryId}`);

  const items = useMemo(
    () =>
      images
        .filter((img) => Boolean(img?.url))
        .map((img) => ({
          ...img,
          displayUrl: imagePresets.card(img) || img.url,
        })),
    [images],
  );

  if (!items.length) {
    return <p className="text-white/60">Portfolio coming soon.</p>;
  }

  return (
    <ErrorBoundary>
      <div id={galleryId} className="gallery-wrapper">
        <Swiper
          modules={[Pagination]}
          spaceBetween={12}
          slidesPerView={1.1}
          breakpoints={{ 640: { slidesPerView: 2.1 }, 1024: { slidesPerView: 3.1 } }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="gallery-swiper"
        >
          {items.map((img, i) => (
            <SwiperSlide
              key={img.url}
              className="gallery-slide"
              style={{ "--slide-delay": `${i * 0.08}s` }}
            >
              <a
                href={img.url}
                data-pswp-width={img.width || 1600}
                data-pswp-height={img.height || 1067}
                className="block group"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={img.displayUrl}
                  alt={img.alt || `Artwork ${i + 1}`}
                  className="aspect-[4/3] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 gallery-image"
                  width={img.width}
                  height={img.height}
                  style={
                    img.lqip
                      ? {
                          backgroundImage: `url(${img.lqip})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </ErrorBoundary>
  );
}
