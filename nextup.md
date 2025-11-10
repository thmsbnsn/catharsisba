# Launch Roadmap & Handoff Prep

## Current status
- Vercel production build (`catharsisba-k8epi9jyt`) contains the latest hero, header, footer, and events updates.
- Blog hub is themed to match the landing hero, with seeded categories (Tattoo, Piercing, Community, Aftercare, Studio News) and Studio color pickers for non-dev editors.
- Sanity Studio is live again (`sld92wg1`) after fixing the project ID, correcting CORS, and adding the legacy theme; publish/save buttons are more visible.
- Navigation/CTA pass: header now includes “Call Us” CTA + animated menu button, menu cards scale better on mobile/light mode, and icons fill their frames.
- Footer polish is in place (centered columns, gold/black logo, restrained social chips, CTA button styling, lighter text).
- Events page uses “Booking” terminology, centered card layout, and improved hierarchy.
- Local `npm run build` (Astro) succeeds; lint warnings are limited to vendor ordering (backdrop-filter) that we’ll clear in a final sweep.

## Remaining launch tasks
1. **Supabase contact pipeline**
   - Create `contact_submissions` table and secure keys.
   - Replace PHPMailer endpoint with Supabase function + throttling.
   - Wire notifications (Resend/SMTP) and basic alerting.
2. **Sanity-driven content**
   - Finish GROQ utilities and move remaining Astro pages (`artists`, `events`, `aftercare`, etc.) to live Sanity data.
   - Migrate hero/background art into `pageSettings` instead of local assets.
   - Add simple vision previews for event cards and footer CTAs.
3. **Polish & QA**
   - Resolve CSS warnings (ordering of `-webkit-backdrop-filter`, `mask-composite`).
   - Run Lighthouse + axe, and tighten responsive breakpoints (especially mobile nav + footer).
   - Smoke-test blog filters, menu interactions, booking links, and gallery lightbox.
4. **Ops / DX**
   - Document Supabase + Sanity backup routines; seed production with starter content.
   - Enable analytics (Vercel Analytics or GA4) and update privacy banner copy.
   - Verify DNS/domain settings and run a final regression before launch sign-off.

## Client handoff checklist
- Produce `docs/client-guide.md` outlining Sanity workflows, deploys, and aftercare procedures.
- Capture a Loom walkthrough of Sanity Studio, Vercel dashboard, and Supabase admin.
- Provide credentials/roles for Vercel, Sanity, Supabase, and GitHub.
- Schedule training session and agree on post-launch support SLA.

## Improvement ideas & discussions
- **Hero experience**: consider a cinematic, edge-to-edge hero variant once Sanity-driven assets land.
- **Insights loop**: expand analytics to track bookings, blog reads, and event clicks for data-backed planning.
- **ISR/Streaming**: revisit incremental static regeneration after Sanity wiring to reduce rebuild times.
- **Accessibility & motion**: audit focus-visible states post-animated menu/footer updates; offer reduced-motion toggles.

