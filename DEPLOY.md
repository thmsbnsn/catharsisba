# Catharsis Body Art – Deployment Guide

This document explains how to deploy the site to **Hostinger**, for both **staging** and **production**.

---

## 🔧 1. Build the site

### Staging build
Use the staging environment so all URLs, SEO tags, and sitemap point at **remix.catharsisba.com**:

```bash
astro build --mode staging

Production build

Use the production environment so all URLs, SEO tags, and sitemap point at catharsisba.com:
npm run build

📦 2. Files to upload

After building, upload these to Hostinger:

/dist/** → Upload everything inside dist/ into public_html/ (or staging root).

This includes index.html, CSS/JS assets, and static images.

/api/** → Upload the api/ folder (e.g. lead.php and PHPMailer libs).

Place this in the same public_html/ directory.

.htaccess → Upload to public_html/.

Required for clean URLs (/artists/slug) and HTTPS redirects.

⚠️ Do not upload /src/, /node_modules/, or any .env files.

📂 3. Hostinger directory layout

For production (catharsisba.com):

/home/username/public_html/
  ├── index.html
  ├── assets/
  ├── api/
  ├── .htaccess


For staging (remix.catharsisba.com):

/home/username/public_html/remix/
  ├── index.html
  ├── assets/
  ├── api/
  ├── .htaccess


(Directory may vary depending on Hostinger’s staging setup)

⚖️ 4. .htaccess

Here’s the baseline config you should keep in public_html/.htaccess:
# Enable rewriting
RewriteEngine On
RewriteBase /

# Redirect all requests to index.html (Astro SPA routing)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]

# Force HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]


📬 5. Contact Form (PHPMailer)

api/lead.php handles form submissions.

Ensure PHPMailer is uploaded into api/libs/ (or similar).

Verify SMTP credentials are set correctly in lead.php.

Test both general contact and artist-specific routing.

✅ 6. Deployment checklist

 Run the correct build (--mode staging or production).

 Upload /dist/* → public_html/.

 Upload /api/* → public_html/api/.

 Upload .htaccess.

 Test site loads properly on staging/live domain.

 Test navigation links resolve correctly.

 Test contact form submission delivers to inbox.

 Verify SEO metadata and sitemap (/sitemap.xml) show correct URLs.

🚀 Tips

Rollback: If something breaks, restore the previous /dist/ backup.

Images: Optimize before uploading (WebP + AVIF).

Staging → Production: Deploy to staging first, confirm everything works, then deploy the production build.
