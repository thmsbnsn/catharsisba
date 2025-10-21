# 🚀 Deployment Guide

This guide explains how to deploy your Catharsis Body Art website to Hostinger.

## 📋 Prerequisites

1. **Hostinger Account**: You need FTP credentials from your Hostinger control panel
2. **WinSCP**: Install WinSCP for FTP functionality (https://winscp.net/)
3. **PowerShell**: Windows PowerShell (usually pre-installed)

## 🔧 Setup

### 1. Configure Environment Variables

Copy the example environment files and fill in your Hostinger credentials:

```bash
# For production
copy env.production.example .env.production

# For staging (if you have a staging environment)
copy env.staging.example .env.staging
```

Edit the `.env.production` file with your actual Hostinger FTP credentials:

```env
FTP_HOST=your-domain.com
FTP_USER=your-ftp-username
FTP_PASS=your-ftp-password
FTP_DIR=/public_html
WIN_SCP_FINGERPRINT=your-server-fingerprint
```

### 2. Get Your FTP Credentials

1. Log into your Hostinger control panel
2. Go to **Hosting** → **Manage** → **Files**
3. Note down your FTP details:
   - **Host**: Usually your domain name
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Directory**: Usually `/public_html`

## 🚀 Deployment Options

### Option 1: Local Deployment (Recommended)

Deploy directly from your local machine:

```bash
# Deploy to production (builds + uploads)
npm run deploy:local:production

# Deploy to staging (builds + uploads)
npm run deploy:local:staging

# Dry run (test without uploading)
npm run deploy:local:production:dry

# Skip build (use existing dist folder)
npm run deploy:local:production:skip
```

### Option 2: GitHub Actions (Automatic)

#### Automatic Deployment
- **Production**: Push to `main` branch → automatically deploys
- **Staging**: Push to `staging` branch → automatically deploys

#### Manual Deployment
1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Build and Deploy** workflow
4. Click **Run workflow**
5. Choose environment (production/staging)
6. Click **Run workflow**

### Option 3: Direct PowerShell

```bash
# Build first
npm run build

# Then deploy
powershell -ExecutionPolicy Bypass -File ./scripts/deploy-hostinger-winscpnet.ps1 production
```

## 📁 What Gets Deployed

The deployment process:
1. **Builds** your Astro project (`npm run build`)
2. **Backs up** existing files on Hostinger
3. **Uploads** the `dist/` folder contents to your Hostinger directory
4. **Cleans up** old backups (keeps last 7 days)

## 🔍 Troubleshooting

### Common Issues

1. **"WinSCPnet.dll not found"**
   - Install WinSCP from https://winscp.net/
   - Or place WinSCPnet.dll in your project folder

2. **"FTP connection failed"**
   - Check your FTP credentials in `.env.production`
   - Verify your Hostinger FTP settings
   - Try both FTPS and plain FTP (script tries both)

3. **"Permission denied"**
   - Ensure your FTP user has write permissions
   - Check that the target directory exists

### Logs

Deployment logs are saved in:
- `logs/deploy-production-YYYY-MM-DD_HHMM.log`
- `logs/deploy-staging-YYYY-MM-DD_HHMM.log`

## 🎯 Quick Commands

| Command | Description |
|---------|-------------|
| `npm run deploy:local:production` | Build + Deploy to production |
| `npm run deploy:local:staging` | Build + Deploy to staging |
| `npm run deploy:local:production:dry` | Test deployment (no upload) |
| `npm run build` | Just build (no deploy) |

## 🔒 Security Notes

- Never commit `.env.production` or `.env.staging` files
- Use GitHub Secrets for CI/CD deployments
- Regularly rotate your FTP passwords
- Keep your WinSCP installation updated

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify your Hostinger FTP settings
3. Test with a dry run first
4. Contact Hostinger support if FTP issues persist
