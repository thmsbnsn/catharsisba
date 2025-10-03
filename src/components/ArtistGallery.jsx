import { useEffect, useId } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function ArtistGallery({ images = [] }) {
  // Stable gallery ID so multiple components can coexist
  const gid = useId().replace(/:/g, "");

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#pswp-gallery-${gid}`,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    return () => lightbox.destroy();
  }, [gid]);

  if (!images || images.length === 0) {
    return <p className="text-white/60">Portfolio coming soon.</p>;
  }

  return (
    <div id={`pswp-gallery-${gid}`}>
      <Swiper
        spaceBetween={12}
        slidesPerView={1.1}
        breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}
      >
        {images.map((img, i) => {
          // assume .webp is the main file path
          const avifPath = img.path.replace(/\.webp$/i, ".avif");

          return (
            <SwiperSlide key={i}>
              <a
                href={avifPath}
                data-pswp-width={img.width || 1600}
                data-pswp-height={img.height || 1067}
              >
                <picture>
                  <source srcSet={avifPath} type="image/avif" />
                  <img
                    loading="lazy"
                    decoding="async"
                    src={img.path} // webp fallback
                    alt={img.alt || `Artwork ${i + 1}`}
                    className="aspect-[4/3] object-cover rounded-md"
                    width={img.width}
                    height={img.height}
                  />
                </picture>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
