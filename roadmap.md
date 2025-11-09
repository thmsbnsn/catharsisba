# Launch Roadmap & Handoff Prep

## Current status
- GitHub repository reset (`main`) with local updates queued for push.
- Community Care homepage section and blog drafts staged locally.
- Secrets centralized in `.env.development` / `.env.production`; examples cleaned up.

## Recently completed
- Retired unused Sanity Studio workspace and removed legacy artifacts from the repo.
- Added Vercel static adapter in `astro.config.mjs` and reconnected the webhook.
- Updated documentation files (README, CF Review, roadmap) to reflect the 2025 plan.

## Next steps
1. **GitHub & Vercel alignment**
   - Point local repo at the new GitHub remote (`main`) and push the refreshed history.
   - Confirm Vercel pulls environment variables from the dashboard before re-triggering a build.
2. **Homepage rollout**
   - QA the Community Care section across breakpoints and verify iframe permissions.
   - Gather photography/copy for additional community highlights if needed.
3. **Contact pipeline hardening**
   - Decide between keeping PHPMailer versus migrating to Supabase Edge Functions.
   - If Supabase wins, create `contact_submissions` table and add server-side rate limiting.
4. **Analytics & monitoring**
   - Enable Vercel Analytics (or GA4) and document privacy-banner implications.
   - Add uptime / form submission alerts (Vercel integrations or third-party).

## Client handoff checklist
- Produce a concise operations guide covering deploys, form handling, and asset updates.
- Capture a Loom walkthrough of Vercel dashboard and GitHub workflow (no CMS required yet).
- Share credential vault / password manager updates with the studio team.
- Schedule a post-launch check-in to review analytics and plan the next iteration.

## Improvement ideas & discussions
- **Hero polish**: Explore a cinematic, full-height hero with subtle scroll cues and motion that respects reduced-motion preferences.
- **Content pipeline**: Once resourced, revisit Sanity or another CMS to shift gallery/artist data out of the codebase.
- **Performance**: Expand AVIF/WebP coverage, add `loading="lazy"` everywhere possible, and run regular Lighthouse/axe sweeps.
- **Accessibility & micro-interactions**: Refine focus states, add keyboard affordances, and consider gentle haptic cues for mobile CTAs.

