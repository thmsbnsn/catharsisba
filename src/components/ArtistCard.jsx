import { motion, useReducedMotion } from "framer-motion";

export default function ArtistCard({ artist, variant = "compact" }) {
  const firstName = artist.name.split(" ")[0];
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      whileHover={reduceMotion ? {} : { scale: 1.03 }}
      whileTap={reduceMotion ? {} : { scale: 0.98 }}
      className={`h-full flex flex-col
        rounded-2xl border border-white/20 shadow-lg
        bg-white/10 backdrop-blur-xl transition-all duration-300
        ${variant === "compact" ? "p-4" : "p-8"}
      `}
    >
      {artist.hero && (
        <img
          className={`rounded-xl object-cover mb-4 shadow-md ${
            variant === "compact" ? "aspect-square" : "aspect-[4/3]"
          }`}
          src={artist.hero.path}
          alt={`${artist.name} — ${artist.styles.join(", ")}`}
          width={artist.hero.width}
          height={artist.hero.height}
          loading="lazy"
          decoding="async"
        />
      )}

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2
            className={`font-serif text-red-900 drop-shadow-md ${
              variant === "compact" ? "text-2xl" : "text-4xl"
            }`}
          >
            {artist.name}
          </h2>
          <p className="text-black/80 dark:text-white/80">
            {artist.bio || artist.styles.join(" • ")}
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex gap-2">
            {variant === "compact" && (
              <a
                className="rounded-xl border border-white/30 px-3 py-1
                  bg-white/20 backdrop-blur-md hover:bg-white/30
                  transition-colors shadow-sm"
                href={`/artists/${artist.slug}/`}
              >
                View Profile
              </a>
            )}
            <a
              className="btn-cta rounded-xl px-3 py-1 shadow-md
                bg-gradient-to-r from-red-600/80 to-red-800/80
                text-white hover:from-red-600 hover:to-red-700"
              href={`/contact?artist=${encodeURIComponent(artist.name)}`}
            >
              Book {firstName}
            </a>
          </div>

          {variant === "full" && (
            <>
              {artist.email && (
                <a
                  href={`mailto:${artist.email}`}
                  className="block underline text-sm hover:text-red-700"
                >
                  Email {firstName} ↗
                </a>
              )}
              {artist.instagram && (
                <a
                  href={artist.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block underline text-sm hover:text-red-700"
                >
                  Instagram ↗
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}
