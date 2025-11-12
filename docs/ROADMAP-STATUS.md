# Catharsis Body Art · Roadmap & Status

_Last updated: 2025-11-12_

> This single source replaces `nextup.md`, `projectstatus.md`, and `roadmap.md`. It tracks where the build stands today, what’s shipping next, and how we’ll hand off smoothly.

---

## Snapshot

- Production (Vercel `catharsisba-k8epi9jyt`) carries the refreshed hero, header CTA, footer polish, booking copy, centered events layout, and Community Care feature block.
- Blog hub mirrors the landing typography with seeded categories (Tattoo, Piercing, Community, Aftercare, Studio News) and Studio color chip pickers.
- Sanity Studio (`sld92wg1`) is live with fixed project ID/CORS and brighter publish controls; artists and initial blog posts are seeded.
- Local `npm run build` succeeds; remaining lint warnings are vendor-ordering tweaks (e.g., `-webkit-backdrop-filter`) scheduled for cleanup.

---

## Recently Completed

- Retired unused Sanity workspace and reconnected Vercel static adapter/webhook.
- Updated documentation (README, blueprint/review, roadmap) to reflect the 2025 plan.
- Navigation polish: animated menu button, icon scaling, light-mode contrast, mobile panel sizing.
- Footer and events refresh: centered columns, refined social chips, “Booking” terminology, balanced card layout.
- Sanity improvements: custom color inputs for categories, brighter publishing accents, roster/blog seed data.

---

## Current Priorities

1. **Supabase Contact Pipeline**
   - Decide on PHPMailer vs Supabase Edge Functions (leaning Supabase).
   - If Supabase wins: create `contact_submissions` table, secure keys, add rate limiting + notifications (Resend/SMTP).

2. **Sanity-Driven Content**
   - Finish GROQ utilities so `artists`, `events`, `aftercare`, etc. pull live data.
   - Move hero/background art into `pageSettings` to replace local assets.
   - Add Vision previews for events/footer CTAs to improve editor feedback.

3. **QA & Performance**
   - Clear CSS lint warnings (prefixed property ordering, `mask-composite` pairings).
   - Run Lighthouse + axe + responsive sweeps (header, hero, footer, menu, gallery lightbox).
   - Smoke-test contact form, blog filters, booking links, and load states.

4. **Operations & Analytics**
   - Enable Vercel Analytics or GA4; update privacy banner copy accordingly.
   - Document Sanity + Supabase backup routines and seed production datasets.
   - Verify DNS/domain config and run final regression before launch sign-off.

---

## Launch Checklist

- [ ] Push repo alignment: confirm GitHub `main` matches Vercel, secrets mirrored in dashboard.
- [ ] Homepage QA: Community Care iframe permissions, responsive behavior, reduced-motion guards.
- [ ] Contact pipeline: form submission path tested end-to-end with throttling and notifications.
- [ ] Analytics in place with documented data retention and privacy updates.
- [ ] Regression pass: cross-browser (Chrome, Safari, Edge), device sizes, accessibility audit.
- [ ] Final build + deploy confirmation (Vercel) and optional Hostinger fallback test.

---

## Client Handoff Plan

- Produce `docs/client-guide.md` (Sanity workflows, deploys, contact handling, asset management).
- Record Loom walkthrough: Sanity Studio, Vercel dashboard, Supabase admin, GitHub flow.
- Share credential vault updates; assign roles for Vercel, Sanity, Supabase, and GitHub.
- Schedule post-launch review to look at analytics, plan next iteration, and confirm SLA.

---

## Improvement Ideas

- **Hero Experience:** Explore cinematic full-height hero once Sanity-sourced assets are wired; respect reduced-motion.
- **Content Pipeline:** After Supabase/analytics, revisit CMS-driven galleries/events for easier updates.
- **Performance:** Expand AVIF/WebP coverage, tighten srcsets, ensure progressive blur-up for hero/gallery.
- **Accessibility & Micro-Interactions:** Refine focus-visible states, keyboard flows, optional haptic cues for mobile CTAs.
- **Analytics Insights:** Track bookings, blog reads, and event clicks to guide future content.

---

### Change Log

- 2025-11-11 · Consolidated roadmap/status documentation into this file.


