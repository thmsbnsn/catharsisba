# Project Status — Catharsis Body Art

_Updated: 2025-11-09_

## Snapshot
- Production site (Vercel `catharsisba-k8epi9jyt`) is live with the refreshed hero, header CTA, footer polish, booking copy, and centered events layout.
- Blog hub mirrors the landing typography, seeded categories (Tattoo, Piercing, Community, Aftercare, Studio News), and the Studio now has a color picker with live chip preview.
- Sanity Studio (`sld92wg1`) was redeployed after correcting the project ID/CORS; Publish controls use the brighter gold accent.
- Navigation passes QA: menu button animation, icon scaling, light-mode contrast, and mobile panel sizing behave as expected.
- Local `npm run build` succeeds; remaining lint notices relate to vendor-prefixed ordering scheduled for cleanup.

## Recently Completed
- Retired unused Studio workspace, reset the repository, and reconnected the Vercel static adapter/webhook.
- Updated documentation (README/roadmap/next steps) to reflect the 2025 plan and new build pipeline.
- Header/footer/blog/events adjustments (CTA, menu glow, booking terminology, centered cards, social positioning).
- Added Sanity custom input for category colors and tuned Studio theme colors to improve publishing clarity.

## Upcoming Focus
### 1. Supabase Contact Pipeline
- Decide on PHPMailer vs. Supabase Edge Functions (leaning Supabase).
- If Supabase wins: create `contact_submissions` table, secure keys, wire function + rate limiting, hook up notifications (Resend/SMTP).

### 2. Sanity-Driven Content
- Finish remaining GROQ utilities and migrate Astro pages (`artists`, `events`, `aftercare`, etc.) to live Sanity data.
- Move hero/background assets into `pageSettings` to eliminate local duplicates.
- Provide Vision previews for events/footer CTAs to help editors visualize changes.

### 3. QA & Performance
- Resolve CSS lints (`-webkit-backdrop-filter` ordering, `mask-composite` pairing).
- Run Lighthouse + axe + responsive audit, including the new header/hero/footer states.
- Smoke-test contact form, blog filters, gallery lightbox, booking links, and menu interactions.

### 4. Operations & Analytics
- Enable Vercel Analytics or GA4 and adjust privacy banner copy accordingly.
- Document Supabase + Sanity backup routines; seed production with initial content.
- Verify domain/DNS configuration and run a final regression before launch sign-off.

## Client Handoff Checklist
- Produce `docs/client-guide.md` covering Sanity workflows, deploys, form handling, and asset management.
- Record Loom walkthrough of Sanity Studio, Vercel dashboard, Supabase admin, and GitHub workflow.
- Share credential vault updates and assign roles for Vercel, Sanity, Supabase, and GitHub.
- Schedule a post-launch review (analytics + roadmap) and agree on ongoing support SLA.

## Improvement Ideas
- **Hero:** explore a cinematic, edge-to-edge hero (respecting reduced-motion prefs) once assets are sourced from Sanity.
- **Content Ops:** once Supabase + analytics are in place, revisit CMS-driven gallery/artist/event modules for easier updates.
- **Performance:** expand AVIF/WebP coverage, tweak srcset breakpoints, and consider ISR/streaming after Sanity migration.
- **Accessibility & micro-interactions:** continue refining focus-visible states, keyboard flows, and optional haptic cues for mobile CTAs.


