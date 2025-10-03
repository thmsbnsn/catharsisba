Security follow-ups (recommended immediate actions):

1) Rotate FTP / SMTP credentials
   - The file `.env.staging` contained credentials and was previously in the working tree. Rotate those credentials at your provider immediately (Hostinger or your FTP host).

2) Add secrets to CI
   - Store new credentials as repository secrets (GitHub Settings → Secrets) using names used in the workflow: `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `WIN_SCP_FINGERPRINT`, `SMTP_USER`, `SMTP_PASS`.

3) Purge secrets from git history (optional, advanced)
   - If you need to remove `.env.staging` and its contents from the git history, use one of these tools on a fresh clone:
     - BFG Repo-Cleaner (recommended): https://rtyley.github.io/bfg-repo-cleaner/
     - git filter-repo: https://github.com/newren/git-filter-repo
   - Example (BFG):
     1. bfg --delete-files .env.staging
     2. git reflog expire --expire=now --all && git gc --prune=now --aggressive
     3. git push --force
   - Note: Purging history requires force-pushing and coordinated client updates for all contributors.

4) Test deploy with dry-run
   - Use the npm script for dry-run:
     powershell -ExecutionPolicy Bypass -File ./scripts/deploy-hostinger-winscpnet.ps1 staging -DryRun
   - Confirm logs and behavior. Then run the real deploy.

5) Consider stronger authentication
   - If your host supports SFTP with key authentication, prefer that over FTP/FTPS password-based auth.

If you want, I can prepare the exact BFG or git-filter-repo command sequence tailored to this repository and coordinate the push steps.
