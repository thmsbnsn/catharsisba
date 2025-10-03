import { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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

function LightboxWrapper({ images, galleryId }) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    return () => lightbox.destroy();
  }, [galleryId]);

  if (!images || images.length === 0) {
    return <p className="text-white/60">No images available.</p>;
  }

  return (
    <div id={galleryId}>
      <Swiper
        spaceBetween={12}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
      >
        {images.map((img, i) => {
          // assume .webp is the main path
          const avifPath = img.path.replace(/\.webp$/i, ".avif");
          return (
            <SwiperSlide key={i}>
              <a
                href={avifPath}
                data-pswp-width={img.width}
                data-pswp-height={img.height}
              >
                <picture>
                  <source srcSet={avifPath} type="image/avif" />
                  <img
                    loading="lazy"
                    decoding="async"
                    src={img.path} // webp as fallback
                    alt={img.alt || `Gallery image ${i + 1}`}
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

export default function Gallery() {
  return (
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
  );
}
