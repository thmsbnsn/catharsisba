param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet('staging', 'production')]
    [string]$Environment,
    
    [switch]$SkipBuild,
    [switch]$DryRun
)

Write-Host "Starting deployment to $Environment..." -ForegroundColor Green

# Step 1: Build the project (unless skipped)
if (-not $SkipBuild) {
    Write-Host "Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed! Deployment aborted."
        exit 1
    }
    Write-Host "Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Skipping build (using existing dist folder)" -ForegroundColor Yellow
}

# Step 2: Deploy using existing script
Write-Host "Deploying to Hostinger..." -ForegroundColor Yellow

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$deployScript = Join-Path $scriptDir "deploy-hostinger-winscpnet.ps1"
$localPath = Join-Path (Get-Location) "dist"

# Check if deploy script exists
if (-not (Test-Path $deployScript)) {
    Write-Error "Deploy script not found at: $deployScript"
    exit 1
}

Write-Host "Using deploy script: $deployScript" -ForegroundColor Cyan
Write-Host "Local path: $localPath" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "Running in DRY RUN mode..." -ForegroundColor Cyan
    & $deployScript $Environment -LocalPath $localPath -DryRun
} else {
    & $deployScript $Environment -LocalPath $localPath
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment to $Environment completed successfully!" -ForegroundColor Green
    Write-Host "Your website should be live at your Hostinger domain" -ForegroundColor Cyan
} else {
    Write-Error "Deployment failed! Check the logs for details."
    exit 1
}