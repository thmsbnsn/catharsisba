param(
  [Parameter(Mandatory = $true, Position = 0)]
  [ValidateSet('staging', 'production')]
  [string]$env,

  [string]$LocalPath = 'dist',

  [switch]$DryRun
)

# Load environment file if present
$envFile = ".env.$env"
$vars = @{}
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq '' -or $line -match '^\s*#') { return }
    $i = $line.IndexOf('=')
    if ($i -lt 0) { return }
    $key = $line.Substring(0, $i).Trim()
    $value = $line.Substring($i + 1)
    $vars[$key] = $value
  }
}

# Helper: prefer actual environment variables (CI) then .env file values
function Get-EnvOrVar($name) {
  $envItem = (Get-Item -Path "Env:$name" -ErrorAction SilentlyContinue)
  if ($envItem -and ($null -ne $envItem.Value) -and ($envItem.Value.ToString().Trim() -ne '')) {
    return $envItem.Value.ToString().Trim()
  }
  if ($vars.ContainsKey($name) -and ($null -ne $vars[$name]) -and ($vars[$name].ToString().Trim() -ne '')) {
    return $vars[$name].ToString().Trim()
  }
  return $null
}

$ftpHost = Get-EnvOrVar 'FTP_HOST'
$ftpUser = Get-EnvOrVar 'FTP_USER'
$ftpPass = Get-EnvOrVar 'FTP_PASS'
$ftpDir = Get-EnvOrVar 'FTP_DIR'
$fingerprint = Get-EnvOrVar 'WIN_SCP_FINGERPRINT'

if (-not $ftpHost) {
  Write-Error "Missing FTP_HOST in environment variables or .env.$env"
  exit 1
}

# Timestamp and logs
$timestamp = (Get-Date).ToString('yyyy-MM-dd_HHmm')
$backupDir = "/backup/$timestamp"
$logDir = Join-Path (Get-Location) 'logs'
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$logFile = Join-Path $logDir "deploy-$env-$timestamp.log"

Write-Host "Deploying to $env..." -ForegroundColor Green
Write-Host "FTP Host: $ftpHost" -ForegroundColor Cyan
Write-Host "FTP User: $ftpUser" -ForegroundColor Cyan
Write-Host "FTP Dir: $ftpDir" -ForegroundColor Cyan
Write-Host "Local Path: $LocalPath" -ForegroundColor Cyan

if ($DryRun) {
  Write-Host "DRY RUN: Would upload files from $LocalPath to $ftpHost$ftpDir" -ForegroundColor Yellow
  Write-Host "DRY RUN: Would backup existing files first" -ForegroundColor Yellow
  Write-Host "DRY RUN: Would clean up old backups" -ForegroundColor Yellow
  Write-Host "DRY RUN completed successfully!" -ForegroundColor Green
  exit 0
}

# For now, just show what would happen
Write-Host "This is a simplified deployment script." -ForegroundColor Yellow
Write-Host "For full FTP deployment, you can:" -ForegroundColor Yellow
Write-Host "1. Wait for Hostinger services to be restored" -ForegroundColor Yellow
Write-Host "2. Use GitHub Actions for automated deployment" -ForegroundColor Yellow
Write-Host "3. Try again later when services are back online" -ForegroundColor Yellow

Write-Host "Deployment preparation completed!" -ForegroundColor Green
exit 0
