# Catharsis Body Art · Project Blueprint & Review

_Last updated: 2025-11-12_

> This consolidated brief replaces `CBA.Agent.md`, `CF-WebsiteReviewCatharsis.md`, and `BLUEPRINT-v3.md`. It captures the purpose of the build, the tech stack, page-by-page intent, and the working practices that keep the site healthy.

---

## 1. Project Overview

- **Client:** Catharsis Body Art (Brownsburg, Indiana)
- **Goal:** Deliver a modern, calming, high-conversion marketing site that showcases artistry, safety, and community outreach, while being easy for the studio to maintain.
- **Hosting:** Vercel (primary) with Hostinger scripts retained as fallback.
- **CMS:** Sanity (artists, blog, global settings roadmap).
- **Back-office:** Supabase (planned) for contact pipeline, analytics integrations pending.

### Value Pillars
- Experience that calms and empowers.
- Artistry rooted in craftsmanship.
- Safety without compromise.
- Transparent partnership from booking to touch-up.
- Community connection and advocacy.

---

## 2. Tech Stack & Tooling

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Astro 4 | Static-first with React islands. |
| UI | Tailwind + custom `base.css` | Luxe design system, CSS variables for glow effects. |
| Interactivity | React (Gallery, OffCanvasNav, LeadForm) | Swiper + PhotoSwipe for galleries. |
| CMS | Sanity | `getAllArtists`, `getBlogPosts`, portable text helpers; fallback to Astro content collection. |
| Forms | PHPMailer (current) → Supabase Edge Functions (planned) | API under `api/lead.php`. |
| Deployment | Vercel CI/CD | Push to `main` triggers builds. Hostinger scripts in `/scripts/` for emergencies. |
| Tooling | Prettier, ESLint, npm scripts | PowerShell deployment utilities, WinSCP integration. |

---

## 3. Site Structure & Key Routes

| Route | Purpose | Highlights |
| --- | --- | --- |
| `/` | Primary landing | Cinematic hero, metrics, Meet the Artists grid, Community Care spotlight, gallery teaser, merch CTA, contact band. |
| `/artists/` | Artist roster | `ArtistCard` grid powered by Sanity/all fallback. |
| `/artists/[slug]/` | Artist profiles | Bio, portfolio, social links, contact CTA, Austin video embed. |
| `/events/` | Studio events & partnerships | Card layout, booking CTAs. |
| `/aftercare/` | Post-session care guide | Step-by-step instructions, FAQ. |
| `/faq/`, `/contact/`, `/our-studio/`, `/blog/` | Supporting content & conversion touchpoints | Blog uses seeded categories + future Sanity body. |

Additional assets live in `public/` (fonts, icons, imagery, reels) and `_blog/` (legacy drafts).

---

## 4. Repository Layout

```
├── api/
│   └── lead.php            # PHPMailer relay (Supabase migration pending)
├── public/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   └── videos/
├── src/
│   ├── components/         # React & Astro UI (ArtistGallery, Gallery, Nav, etc.)
│   ├── content/            # Astro collections (artists fallback)
│   ├── image-manifests/    # JSON manifests for galleries
│   ├── layouts/            # BaseLayout shell
│   ├── lib/                # Sanity helpers, image utils
│   ├── pages/              # Astro routes
│   └── styles/             # Tailwind reset + custom design language
├── scripts/                # Hostinger deploy scripts (WinSCP/PowerShell)
├── docs/ (planned)         # Consolidated documentation
└── package.json, astro.config.mjs, tsconfig.json, etc.
```

---

## 5. Page-by-Page Highlights

### Homepage (`/`)
- Hero with CTA (“Call Us” + “Browse Artists”), video/performance ready.
- Metrics list, Catharsis definition aside, scroll cue.
- Meet the Artists cards with LQIP blur and scene-specific copy.
- Community Care campaign block featuring Facebook embed.
- Gallery teaser (Swiper/PhotoSwipe) and merch CTA.
- Booking banner plus aftercare/contact teaser cards.

### Artists Landing & Detail Pages
- Landing grid uses `ArtistCard` with fallback avatars for missing portraits.
- Detail pages fetch from Sanity; fall back to Astro content if the CMS fails.
- Lightbox galleries, social links, booking CTAs per artist.

### Blog & Content
- Blog hub styled to match hero; categories filter with color chips.
- Portable Text pipeline outputs headings, lists, images with LQIP figure wrapper.
- Sanity slug fallback ensures static build resilience.

---

## 6. Current Status & Progress (High-Level)

- Frontend polish is largely complete; the site reflects the brand pillars and design system.
- Sanity integration is partially live (artists blog), with more routes queued.
- Supabase migration remains the biggest outstanding feature.
- Documentation consolidated (README, ROADMAP-STATUS.md, this blueprint).

For task-level detail, see `ROADMAP-STATUS.md`.

---

## 7. Productivity & Workflow Notes

- Use `npm run dev` for local work; `.env.development` supplies API keys.
- Production builds via `npm run build` (or `astro build --mode staging` for Hostinger).
- Vercel handles primary deployments; keep Hostinger scripts updated as fallback.
- Use `ROADMAP-STATUS.md` for current priorities and handoff steps.
- Secrets belong in `.env.*` locally and Vercel dashboard in production.

---

## 8. Suggested Improvements

- **Supabase Integration:** Implement contact submission pipeline with rate limiting.
- **Sanity Expansion:** Move events/aftercare/CTA content into CMS; add Vision previews.
- **Performance:** Extend AVIF/WebP usage, refine srcsets, clear remaining CSS lint warnings.
- **Accessibility:** Continue auditing focus states, reduced motion preferences, and mobile gestures.
- **Analytics:** Enable Vercel Analytics or GA4 and define KPIs (bookings, gallery opens, blog reads).

---

### Change Log

- 2025-11-12 · Created consolidated blueprint from legacy docs.


