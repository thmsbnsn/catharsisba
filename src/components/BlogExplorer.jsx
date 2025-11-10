import {useMemo, useState} from "react";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export default function BlogExplorer({ posts = [], categories = [] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const availableCategories = useMemo(() => {
    if (categories.length) return categories;

    const map = new Map();
    posts.forEach((post) => {
      const cat = post.category;
      if (cat?.slug && !map.has(cat.slug)) {
        map.set(cat.slug, cat);
      }
    });
    return Array.from(map.values());
  }, [categories, posts]);

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((post) => post.category?.slug === activeCategory);

  return (
    <div className="blog-explorer">
      <div className="blog-filters" role="tablist" aria-label="Blog categories">
        <button
          type="button"
          className={`blog-filter ${activeCategory === "all" ? "is-active" : ""}`}
          onClick={() => setActiveCategory("all")}
          aria-pressed={activeCategory === "all"}
        >
          <span>All</span>
        </button>
        {availableCategories.map((cat) => {
          const color = cat.color || "#CBA774";
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              className={`blog-filter ${isActive ? "is-active" : ""}`}
              style={{ "--filter-color": color }}
              onClick={() => setActiveCategory(cat.slug)}
              aria-pressed={isActive}
            >
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      <div className="blog-grid">
        {filteredPosts.length === 0 ? (
          <p className="blog-empty">No stories in this category yet. Check back soon.</p>
        ) : (
          filteredPosts.map((post) => {
            const color = post.category?.color || "#CBA774";
            const coverStyle = post.coverImageLqip
              ? { backgroundImage: `url(${post.coverImageLqip})` }
              : undefined;
            return (
              <article key={post.slug} className="blog-card" style={{ "--accent-color": color }}>
                <a
                  href={`/blog/${post.slug}/`}
                  className="blog-card__image"
                  aria-label={`Read ${post.title}`}
                  style={coverStyle}
                >
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.coverImageAlt || post.title}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <span className="blog-card__image-overlay" />
                </a>
                <div className="blog-card__content">
                  {post.category?.title && (
                    <span className="blog-card__category" style={{ "--accent-color": color }}>
                      {post.category.title}
                    </span>
                  )}
                  <h3 className="blog-card__title">
                    <a href={`/blog/${post.slug}/`}>{post.title}</a>
                  </h3>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <div className="blog-card__meta">
                    <span>{post.author}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <a className="blog-card__cta" href={`/blog/${post.slug}/`}>
                    Read Story
                  </a>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}


