# Launch Roadmap & Handoff Prep

## Current status
- Vercel deployment is live and serving the redesigned site.
- Visual refresh is complete across primary and secondary pages.
- Footer, navigation, and CTAs are aligned with the new luxe aesthetic.
- Documentation still references the old migration plan and needs pruning.

## Remaining launch tasks
1. **Supabase integration**
   - Create `contact_submissions` table and configure service/anon keys.
   - Replace PHPMailer endpoint with Supabase function & rate-limiting.
   - Pipe notifications to Resend/SMTP and add simple monitoring.
2. **Sanity wiring**
   - Finalize `event`, `review`, `pageSettings`, `globalSettings` schemas.
   - Build GROQ utilities and switch Astro pages (`artists`, `events`, etc.) to Sanity data.
   - Migrate hero/background assets into `pageSettings` and remove local duplicates.
3. **QA & performance**
   - Run responsive audit (mobile/tablet/desktop) and Lighthouse/axe checks.
   - Verify build via `npm run build` and resolve lingering lint warnings (backdrop-filter ordering).
   - Add end-to-end smoke test (nav, forms, gallery lightbox).
4. **Operational readiness**
   - Configure Supabase + Sanity backups and seed production content.
   - Enable analytics (Vercel Analytics or GA4) + privacy banner.
   - Validate domain & DNS records, then run final regression prior to launch sign-off.

## Client handoff checklist
- Produce `docs/client-guide.md` outlining Sanity workflows, deploys, and aftercare procedures.
- Capture a Loom walkthrough of Sanity Studio, Vercel dashboard, and Supabase admin.
- Provide credentials/roles for Vercel, Sanity, Supabase, and GitHub.
- Schedule training session and agree on post-launch support SLA.

## Improvement ideas & discussions
- **Hero redesign**: Explore stretching `index.astro` hero image edge-to-edge (full viewport height) with repositioned headings/CTAs for a cinematic first impression—pair with scroll cue and subtle motion.
- **Supabase + analytics**: Track contact conversions, page views, and event interest for data-backed decisions.
- **Content ops**: Introduce Sanity-driven blog/merch/event modules once schemas are stable.
- **Performance polish**: Tighten image optimization (AVIF/WebP, srcset) and consider incremental static regeneration when Sanity is wired.
- **Accessibility & micro-interactions**: Add focus-visible polish, haptic cues, and optional reduced-motion toggles across new animations.

