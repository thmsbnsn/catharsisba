import { useEffect, useId } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";

export default function ArtistGallery({ images = [] }) {
  // Stable gallery ID so multiple components can coexist
  const gid = useId().replace(/:/g, "");

  useEffect(() => {
    const galleryElement = document.getElementById(`pswp-gallery-${gid}`);
    if (!galleryElement) {
      return;
    }

    const lightbox = new PhotoSwipeLightbox({
      gallery: `#pswp-gallery-${gid}`,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.on("contentLoadError", (e) => {
      console.error(
        "[ArtistGallery] Failed to load slide content",
        e?.content?.data?.src || e?.content?.data?.element?.getAttribute("href"),
      );
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [gid]);

  if (!images || images.length === 0) {
    return <p className="text-white/60">Portfolio coming soon.</p>;
  }

  return (
    <div id={`pswp-gallery-${gid}`} className="gallery-wrapper">
      <Swiper
        modules={[Pagination]}
        spaceBetween={12}
        slidesPerView={1.1}
        breakpoints={{ 640: { slidesPerView: 2.1 }, 1024: { slidesPerView: 3.1 } }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="gallery-swiper"
      >
        {images.map((img, i) => (
          <SwiperSlide
            key={i}
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
                src={img.url}
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
  );
}
