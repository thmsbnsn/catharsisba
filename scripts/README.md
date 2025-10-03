Deploy scripts

Preferred: `deploy-hostinger-winscpnet.ps1`
 Uses WinSCP .NET (WinSCPnet.dll) for robust, programmatic transfers.
 Supports `-DryRun` to preview actions without touching remote files.
 Reads credentials from `.env.<env>` or environment variables (for CI).
 Optional TLS fingerprint pinning via `WIN_SCP_FINGERPRINT` env var.

Legacy:
 `deploy-hostinger.ps1` (PowerShell writes a winscp script file)
 `deploy-hostinger.cmd` (Windows batch) — kept for compatibility but not recommended.

Local usage (quick):
 Create a local `.env.staging` file (DO NOT commit this file). Example structure:

	FTP_HOST=ftp.catharsisba.com
	FTP_USER=u204461404.catharsisba.com
	FTP_PASS=your_password_here
	FTP_DIR=/public_html

	SMTP_USER=info@catharsisba.com
	SMTP_PASS=your_smtp_password

	# Optionally: WIN_SCP_FINGERPRINT="sha256:..." (pin TLS fingerprint)

 Then run a dry-run deploy locally:

	powershell -ExecutionPolicy Bypass -File ./scripts/deploy-hostinger-winscpnet.ps1 staging -DryRun

 If the dry-run output looks correct, run the real deploy:

	powershell -ExecutionPolicy Bypass -File ./scripts/deploy-hostinger-winscpnet.ps1 staging

CI / GitHub Actions:
 Add the following repository secrets: `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `WIN_SCP_FINGERPRINT` (optional), `SMTP_USER`, `SMTP_PASS`.
 The workflow will use those secrets; do not commit plaintext credentials anywhere.

Security notes:
 NEVER commit `.env.*` files. The repo's `.gitignore` already excludes them.
 Rotate credentials immediately if they were committed in the past. See SECURITY-FIXUP.md for steps.
