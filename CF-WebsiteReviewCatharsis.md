# Catharsis Body Art Website Build Review

---

## Project Snapshot
- **Client:** Catharsis Body Art (Brownsburg, IN)
- **Platform / Stack:** Astro 4 static site with React islands, Tailwind CSS utility classes, TypeScript support, Swiper.js, PhotoSwipe, and PHPMailer
- **Deployment / Hosting:** Vercel static hosting wired to GitHub `main` (PowerShell/Hostinger scripts retained as legacy fallback)
- **Status:** Active development — repository reset, Community Care campaign staged, Vercel automation pending final push

---

## Table of Contents
1. [Page-by-Page Breakdown](#page-by-page-breakdown)
2. [Complete Build Structure](#complete-build-structure)
3. [Features & Technologies](#features--technologies)
4. [Sanity CMS Client Guide](#sanity-cms-client-guide)
5. [Why This Beats Drag-and-Drop Builders](#why-this-beats-drag-and-drop-builders)
6. [Technical Advantages](#technical-advantages)
7. [Long-Term Value](#long-term-value)

---

## Page-by-Page Breakdown

> Summary of each live route, its intent, and notable functionality or integrations.

### 1. **Homepage** (`/`)
- **Purpose:** Introduce Catharsis Body Art, drive appointments, and surface navigation to featured services.
- **Key Sections:** Hero CTA, navigation tiles with SVG/emoji icons, `Meet the Artists` showcase with gold-glow portraits, Community Care support spotlight (Facebook Reel embed), testimonials slider, FAQs teaser, location/contact strip.

### 2. **Artists Landing** (`/artists/`)
- **Purpose:** Central hub for the studio’s artist roster.
- **Highlights:** Uses `ArtistCard` React component variations, mobile-first layout, quick links to individual profiles.

### 3. **Artist Detail Pages** (`/artists/[slug]/`)
- **Purpose:** Deep dive on each artist (Austin Stirling, Chris Summers) with biography, specialties, and galleries.
- **Highlights:** Dynamic Astro route fed by content collections, responsive Swiper galleries backed by PhotoSwipe lightbox, Facebook Reel embed for Austin, mobile spacing refinements.

### 4. **Our Studio** (`/our-studio/`)
- **Purpose:** Showcase studio environment, reviews, and atmosphere.
- **Highlights:** Parallax hero using `background5.webp` with softened gradient edges, site-wide background swap to `background1.webp`, real Facebook reviews, interior/exterior imagery grid, merch spotlight.

### 5. **Contact** (`/contact/`)
- **Purpose:** Capture appointment inquiries and provide key contact methods.
- **Highlights:** Clickable/tappable form inputs, PHPMailer-backed form submission endpoint, consistent background (`background1.webp`), contact cards with icons and map link.

### 6. **Events** (`/events/`)
- **Purpose:** Surface upcoming events and community partnerships.
- **Highlights:** Rebuilt calendar logic with URL-driven month/year navigation, Prev/Next/Today controls, highlighted current day, partner logo grid (AFSP, The Willow Center, Panoony’s Pizza & Wings).

### 7. **Gallery** (`/gallery/`)
- **Purpose:** Curate tattoo and piercing imagery across artists.
- **Highlights:** Swiper carousel per collection, PhotoSwipe v5 lightbox initialized via React island, WebP/AVIF `<picture>` sources for performance, hover animations.

### 8. **Aftercare** (`/aftercare/`)
- **Purpose:** Provide detailed post-service care instructions for tattoos and piercings.
- **Highlights:** Collapsible sections, iconography, contact CTA for follow-up questions.

### 9. **FAQ** (`/faq/`)
- **Purpose:** Address common client questions.
- **Highlights:** Accordion layout, inline anchors to policies and contact, consistent styling with base typography.

### 10. **Policies** (`/privacy/`, `/terms/`, `/cookies/`)
- **Purpose:** Document legal requirements and data use policies.
- **Highlights:** Static content sections in matching layout, clear headings, accessibility-friendly contrast.

### 11. **Accessibility Statement** (`/accessibility/`)
- **Purpose:** Outline site accessibility commitment and contact pathway for accommodations.
- **Highlights:** Structured checklist, direct contact info, links back to key resources.

### 12. **Artists Landing Variant** (`/artistslanding/`)
- **Purpose:** Alternate promotional landing page for artist recruitment/spotlight.
- **Highlights:** Custom hero, CTA blocks, shares components with homepage for consistency.

### 13. **Utility Routes** (`/sitemap.xml`, API scripts)
- **Purpose:** Support SEO and form processing.
- **Highlights:** `sitemap.xml.ts` generates static sitemap; `/api/lead.php` relays contact submissions via PHPMailer.

---

## Complete Build Structure

> Repository layout and core assets for the Astro build.

```
project-root/
├── api/                      # PHPMailer lead handling (PHP)
├── public/                   # Static assets (icons, fonts, images, video)
├── src/
│   ├── components/           # React & Astro UI components (9 files)
│   ├── content/              # Astro content collections (artist bios)
│   ├── image-manifests/      # JSON manifests powering galleries
│   ├── layouts/              # Global layout wrappers
│   ├── lib/                  # Shared helpers / TS utilities
│   ├── pages/                # Astro routes (13 primary pages + sitemap)
│   └── styles/               # Base CSS and design tokens
├── scripts/                  # Archived PowerShell deployment utilities for Hostinger
├── dist/                     # Generated static build output (Vercel handles builds automatically)
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind setup
├── package.json / lock       # Project scripts & dependencies
└── README.md, DEPLOY*.md     # Developer notes & deployment guides
```

**Total Files:** ~200+ (includes ~140 optimized WebP/AVIF images and icon SVGs)

**Core Source Files:** 13 Astro pages, 9 components, 1 base layout, 5 image manifest JSON files, TypeScript site config

**Components:** `BaseLayout`, `OffCanvasNav`, `Gallery`, `ArtistGallery`, `ArtistCard`, `Footer`, `Icon` (deprecated), `LeadForm`, utility components

**Pages:** `index`, `artists`, `artists/[slug]`, `our-studio`, `contact`, `events`, `gallery`, `aftercare`, `faq`, `accessibility`, `cookies`, `privacy`, `terms`, `artistslanding`, plus `sitemap.xml.ts`

---

## Features & Technologies

> Key technical decisions, integrations, and their value to the client.

### **Framework & Runtime**
- Astro 4 static site generation for speed-first delivery and zero client JS on non-interactive sections
- React islands for components needing state (galleries, off-canvas navigation)

### **Styling**
- Tailwind CSS utility classes blended with a custom `base.css` design system
- Responsive layouts via CSS Grid/Flexbox with mobile-first media queries
- Gold glow, parallax, and gradient overlays for premium brand aesthetic

### **Content Management**
- Astro Content Collections (`src/content/artists`) for structured artist bios and metadata
- Image manifests in JSON drive gallery sources, simplifying updates when new media is added

### **Forms & Validation**
- Contact form posts to `api/lead.php`, relayed through PHPMailer with server-side validation
- Front-end UX improvements: larger tap targets, pointer-event fixes, input focus states

### **Performance**
- Optimized WebP/AVIF assets via `<picture>` fallbacks
- Static HTML output reduces TTFB, while partial hydration keeps JS bundles lean
- Parallax/background images controlled to preserve readability and layout stability

### **Interactive Components**
- Swiper.js carousels for artist galleries and testimonials with touch support
- PhotoSwipe v5 integration for lightbox experiences with custom logging/debug hooks
- Facebook Reel embed for Austin’s artist page

### **Developer Experience**
- TypeScript-enabled configs, Astro ESLint defaults, and `npm` scripts (`dev`, `build`, `astro check`)
- PowerShell deployment scripts tailored for Windows + Hostinger workflow

### **Security & Compliance**
- Mostly static footprint minimizes attack surface; PHP lead handler scoped to email relay
- Dedicated policy pages (privacy, terms, cookies) and HTTPS-only asset references

### **Accessibility (A11y)**
- Semantic headings, focusable navigation, alt text on galleries, consistent color contrast for key text
- Accessibility statement page with accommodation contact info

### **Additional Integrations**
- Social embeds (Facebook), SVG/emoji icon system, Google Maps linkouts, community partner logos

### **Deployment Features**
- Repeatable `npm run build` locally, with Vercel deploying directly from GitHub `main`
- PowerShell FTP scripts retained for manual Hostinger uploads if a fallback is required

---

## Sanity CMS Client Guide

> The project does not use Sanity; content is managed directly within the Astro codebase.

### Accessing Sanity Studio
- **Hosted Studio:** Not applicable — no external CMS instance.
- **Local Studio:** Not applicable; update Markdown/JSON content within `src/content`.

### Content Types
- **Artists:** Markdown entries in `src/content/artists` (bio, social links, specialties)
- **Galleries:** JSON manifests in `src/image-manifests` mapped by component logic
- **Site Settings:** Global configuration in `src/site.config.ts` and layout props
- *(No additional CMS collections — add via Astro Content Collections if needed)*

### Publishing Workflow
1. Update content files (Markdown/JSON/astro components) in the repository.
2. Run `npm install` (first time) and `npm run build` to validate output.
3. Deploy the refreshed `dist/` folder to Hostinger via FTP or deployment script.

### Media Management
- Store approved media under `public/images/...` with matching WebP/AVIF pairs.
- Update corresponding manifest entry (width, height, alt) to surface new assets.
- Large video assets live under `public/videos/`; ensure hosting bandwidth limits are respected.

### Rebuild & Deployment Steps
1. `npm install` (once per environment) and `npm run dev` for local preview.
2. `npm run build` (or `cmd /c "npm run build"` on Windows with execution-policy bypass) for production artifacts.
3. Upload `dist/` contents using Hostinger FTP/SFTP per `scripts/deploy-*.ps1` instructions.

---

## Why This Beats Drag-and-Drop Builders

> Include a side-by-side comparison table and narrative points highlighting performance, cost, flexibility, ownership, security, scalability, etc.

| Feature | This Website | Typical Drag-and-Drop Builder |
|---------|--------------|--------------------------------|
| Performance | Pre-rendered Astro pages, optimized WebP/AVIF assets, minimal JS | Heavy client-side bundles, slower TTFB, limited image tooling |
| SEO | Custom meta, sitemap, structured artist pages, fast load | Generic templates, limited control over structured data |
| Costs | One-time build + low-cost Hostinger static hosting | Recurring platform fees, add-ons for forms/galleries |
| Customization | Full control over layouts, effects, and integrations | Design constrained to template blocks |
| Ownership | Source-controlled assets, portable build output | Vendor lock-in, limited access to raw files |
| Security | Mostly static surface area plus audited PHP mailer | Larger attack surface, shared multi-tenant scripts |
| Integrations | Swiper, PhotoSwipe, custom calendar, Facebook embeds | Limited third-party support without premium tiers |

---

## Technical Advantages

> Elaborate on the differentiators mentioned above. Break into numbered subsections (Performance, SEO, Cost, Flexibility, Ownership, Developer Experience, Security, Scalability, Branding, etc.).

### 1. Performance (Speed)
- Astro renders pages to static HTML, so the site consistently delivers sub-second first paint even on mobile networks.
- Image manifests enforce optimized dimensions, while `<picture>` sources fall back gracefully when AVIF is unsupported.

### 2. SEO (Search Engine Optimization)
- Clean URL structure (`/artists/name/`), dedicated policy pages, and autogenerated sitemap help search engines crawl the entire footprint.
- Fast page speeds and responsive hero text maintain high Core Web Vitals scores, supporting local SEO goals.

### 3. Cost Over Time
- Hosting on existing Hostinger plan keeps recurring costs minimal compared to SaaS builder subscriptions.
- Open-source stack avoids licensing fees; new features require only development time.

### 4. Flexibility & Control
- Every section is editable in code, enabling bespoke layouts (parallax hero, glowing frames) that match the brand.
- React islands allow selective interactivity without sacrificing static rendering benefits.

### 5. Ownership & Data
- All assets (images, fonts, PHP mailer) live within the repository, guaranteeing portability and compliance with backup policies.
- Contact submissions flow directly to Catharsis via PHPMailer, bypassing third-party form aggregators.

### 6. Developer Experience
- Astro’s file-based routing and Tailwind utilities keep authoring predictable.
- Deployment scripts (`scripts/deploy-hostinger-*.ps1`) streamline repetitive upload steps on Windows.

### 7. Security
- Minimal dynamic code — only the lead form handler — limits exposure; PHP library dependencies (PHPMailer) are vendor maintained.
- HTTPS asset references and controlled embeds mitigate mixed-content or script injection risks.

### 8. Scalability
- Adding new artists or galleries is as simple as introducing new markdown/manifest entries, with no database migrations required.
- Astro’s adapter-agnostic output can later move to CDNs or edge hosts without rewrites.

### 9. Brand Control
- Custom backgrounds, typography, and motion effects keep the visual identity distinct from template-based competitors.
- Lightbox, calendar, and embed integrations ensure future campaigns can be promoted without platform constraints.

---

## Long-Term Value

> Ongoing tasks and growth opportunities for the Catharsis digital experience.

- **Maintenance Checklist:** Quarterly dependency review (`npm outdated`), verify PHPMailer credentials, refresh partner logos, smoke-test forms/lightbox/calendar after updates.
- **Future Enhancements:** Finalize calendar UX, expand studio gallery once new photos arrive, consider booking integration or embeddable consultation scheduler.
- **Analytics & Reporting:** Add privacy-compliant analytics (e.g., Plausible or GA4) to track event interest and artist page engagement.
- **Recommended Integrations:** Schema markup for events, Google Business profile sync, optional newsletter signup tied to existing contact flow.
- **Support & Training:** Provide quickstart guide for editing content files, plus short Loom walkthrough for running `npm run build` and uploading to Hostinger.

---

## Sign-Off / Next Steps
- **Launch Readiness:** Core site experience is production-ready; currently validating calendar navigation refinements.
- **Remaining Tasks:** Confirm calendar Prev/Next/Today behavior across browsers, gather additional studio imagery, optional analytics integration.
- **Approvals Needed:** Client sign-off on homepage artist layout, Our Studio revamp, and events calendar behavior.
- **Target Launch Date:** TBD — dependent on final QA and asset approvals.

---

*Prepared by:* GPT-5 Codex
*Date:* November 7, 2025


