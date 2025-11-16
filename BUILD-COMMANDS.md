# Build Commands Reference

## For Local Development

```bash
npm run build
```
Runs the standard build process (image generation + Astro build).

## For Manual Deployment with Git Automation

```bash
npm run deploy
```
Runs the full build AND automatically commits/pushes changes to git.

**⚠️ Warning:** Only use this locally, not in CI/CD environments.

## Individual Commands

### Generate Image Manifests
```bash
npm run gen:images
```

### Build Astro Site
```bash
npm run build:astro
```

### Run Git Automation (Commit + Push)
```bash
npm run postbuild:git
```

## Vercel Deployment

Vercel automatically runs `npm run build` which:
1. Generates image manifests
2. Builds the Astro site
3. ✅ Does NOT run git automation (prevents infinite loops)

The git automation is separated into the `deploy` command for local use only.

## Why This Setup?

**The Problem:**
Running git automation during Vercel builds caused:
- Infinite build loops (build → commit → new build)
- Permission errors (Vercel can't push to git)
- Build failures

**The Solution:**
- `build` = Clean build for CI/CD (Vercel, GitHub Actions)
- `deploy` = Build + git automation for local deployment workflows
