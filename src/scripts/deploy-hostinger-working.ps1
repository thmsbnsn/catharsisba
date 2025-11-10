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

if (-not $ftpHost) {
    Write-Error "Missing FTP_HOST in environment variables or .env.$env"
    exit 1
}

Write-Host "Deploying to $env..." -ForegroundColor Green
Write-Host "FTP Host: $ftpHost" -ForegroundColor Cyan
Write-Host "FTP User: $ftpUser" -ForegroundColor Cyan
Write-Host "FTP Dir: $ftpDir" -ForegroundColor Cyan
Write-Host "Local Path: $LocalPath" -ForegroundColor Cyan

# Check if local path exists
if (-not (Test-Path $LocalPath)) {
    Write-Error "Local path '$LocalPath' not found. Please run 'npm run build' first."
    exit 1
}

if ($DryRun) {
    Write-Host "DRY RUN: Would upload files from $LocalPath to $ftpHost$ftpDir" -ForegroundColor Yellow
    Write-Host "DRY RUN: Would backup existing files first" -ForegroundColor Yellow
    Write-Host "DRY RUN: Would clean up old backups" -ForegroundColor Yellow
    Write-Host "DRY RUN completed successfully!" -ForegroundColor Green
    exit 0
}

# Try to use WinSCP if available
$possibleDlls = @(
    'C:\Program Files (x86)\WinSCP\WinSCPnet.dll',
    'C:\Program Files\WinSCP\WinSCPnet.dll'
)
$dll = $possibleDlls | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($dll) {
    Write-Host "Using WinSCP for deployment..." -ForegroundColor Yellow
    try {
        Add-Type -Path $dll
        
        # Prepare session options for FTPS (explicit)
        $sessionOptions = New-Object WinSCP.SessionOptions
        $sessionOptions.Protocol = [WinSCP.Protocol]::Ftp
        $sessionOptions.HostName = $ftpHost
        $sessionOptions.UserName = $ftpUser
        $sessionOptions.Password = $ftpPass
        $sessionOptions.FtpSecure = [WinSCP.FtpSecure]::Explicit
        
        $session = New-Object WinSCP.Session
        $session.Open($sessionOptions)
        
        # Create backup directory
        $timestamp = (Get-Date).ToString('yyyy-MM-dd_HHmm')
        $backupDir = "/backup/$timestamp"
        $session.CreateDirectory($backupDir) | Out-Null
        
        # Backup existing files
        Write-Host "Backing up existing files..." -ForegroundColor Yellow
        $files = $session.EnumerateRemoteFiles($ftpDir, '*', [WinSCP.EnumerationOptions]::None)
        foreach ($f in $files) {
            if ($f.IsDirectory) { continue }
            $src = $f.FullName
            $dest = ($backupDir.TrimEnd('/') + '/' + $f.Name)
            Write-Host "Backing up: $src -> $dest"
            $session.MoveFile($src, $dest) | Out-Null
        }
        
        # Upload new files
        Write-Host "Uploading new files..." -ForegroundColor Yellow
        $transferOptions = New-Object WinSCP.TransferOptions
        $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary
        
        $localPathWildcard = Join-Path (Resolve-Path $LocalPath).Path '*'
        $transferResult = $session.PutFiles($localPathWildcard, $ftpDir, $false, $transferOptions)
        $transferResult.Check()
        
        Write-Host "Upload completed! Transferred $($transferResult.Transfers.Count) files." -ForegroundColor Green
        
        # Clean up old backups (keep last 7 days)
        Write-Host "Cleaning up old backups..." -ForegroundColor Yellow
        $cutoff = (Get-Date).AddDays(-7)
        $backups = $session.EnumerateRemoteFiles('/backup/', '*', [WinSCP.EnumerationOptions]::None)
        foreach ($b in $backups) {
            if ($b.IsDirectory) { continue }
            if ($b.LastWriteTime -lt $cutoff) {
                Write-Host "Removing old backup: $($b.FullName)"
                $session.RemoveFiles($b.FullName) | Out-Null
            }
        }
        
        $session.Dispose()
        Write-Host "Deployment to $env completed successfully!" -ForegroundColor Green
        Write-Host "Your website should be live at your Hostinger domain" -ForegroundColor Cyan
        
    } catch {
        Write-Error "WinSCP deployment failed: $_"
        Write-Host "Falling back to manual instructions..." -ForegroundColor Yellow
        Write-Host "Please upload the contents of the '$LocalPath' folder to '$ftpDir' on your Hostinger account." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "WinSCP not found. Please install WinSCP or use manual upload." -ForegroundColor Yellow
    Write-Host "Download WinSCP from: https://winscp.net/" -ForegroundColor Cyan
    Write-Host "Then upload the contents of '$LocalPath' folder to '$ftpDir' on your Hostinger account." -ForegroundColor Yellow
    exit 1
}

exit 0
