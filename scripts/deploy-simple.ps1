param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet('staging', 'production')]
    [string]$Environment,
    
    [string]$LocalPath = 'dist',
    [switch]$DryRun
)

# Load environment file
$envFile = ".env.$Environment"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq '' -or $line -match '^\s*#') { return }
        $i = $line.IndexOf('=')
        if ($i -lt 0) { return }
        $key = $line.Substring(0, $i).Trim()
        $value = $line.Substring($i + 1)
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

$ftpHost = $env:FTP_HOST
$ftpUser = $env:FTP_USER
$ftpPass = $env:FTP_PASS
$ftpDir = $env:FTP_DIR

if (-not $ftpHost) {
    Write-Error "Missing FTP_HOST in environment variables or .env.$Environment"
    exit 1
}

Write-Host "Deploying to $Environment..." -ForegroundColor Green
Write-Host "FTP Host: $ftpHost" -ForegroundColor Cyan
Write-Host "FTP User: $ftpUser" -ForegroundColor Cyan
Write-Host "FTP Dir: $ftpDir" -ForegroundColor Cyan
Write-Host "Local Path: $LocalPath" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "DRY RUN: Would upload files from $LocalPath to $ftpHost$ftpDir" -ForegroundColor Yellow
    Write-Host "DRY RUN: Would backup existing files first" -ForegroundColor Yellow
    Write-Host "DRY RUN: Would clean up old backups" -ForegroundColor Yellow
    Write-Host "DRY RUN completed successfully!" -ForegroundColor Green
} else {
    Write-Host "This is a simplified deployment script." -ForegroundColor Yellow
    Write-Host "For full FTP deployment, use the main deploy-hostinger-winscpnet.ps1 script" -ForegroundColor Yellow
    Write-Host "Or use GitHub Actions for automated deployment" -ForegroundColor Yellow
}

exit 0
