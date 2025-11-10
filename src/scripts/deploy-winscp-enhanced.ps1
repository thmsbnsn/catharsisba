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

Write-Host "Deploying to $env using WinSCP..." -ForegroundColor Green
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

# Try to find WinSCP DLL
$possibleDlls = @(
  'C:\Program Files (x86)\WinSCP\WinSCPnet.dll',
  'C:\Program Files\WinSCP\WinSCPnet.dll',
  '.\WinSCPnet.dll'
)
$dll = $possibleDlls | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $dll) {
  Write-Error "WinSCP .NET assembly not found. Please install WinSCP or download WinSCPnet.dll"
  Write-Host "Download from: https://winscp.net/eng/docs/library" -ForegroundColor Yellow
  Write-Host "Or install WinSCP from: https://winscp.net/eng/download.php" -ForegroundColor Yellow
  exit 1
}

Write-Host "Using WinSCP DLL: $dll" -ForegroundColor Green

try {
  # Load WinSCP .NET assembly
  Add-Type -Path $dll

  # Prepare session options for regular FTP (no SSL)
  $sessionOptions = New-Object WinSCP.SessionOptions
  $sessionOptions.Protocol = [WinSCP.Protocol]::Ftp
  $sessionOptions.HostName = $ftpHost
  $sessionOptions.UserName = $ftpUser
  $sessionOptions.Password = $ftpPass
  $sessionOptions.FtpSecure = [WinSCP.FtpSecure]::None

  $session = New-Object WinSCP.Session

  Write-Host "Connecting to FTP server..." -ForegroundColor Yellow
  $session.Open($sessionOptions)
  Write-Host "Connected successfully!" -ForegroundColor Green

  # Create target directory if it doesn't exist
  try {
    $session.CreateDirectory($ftpDir) | Out-Null
    Write-Host "Created target directory: $ftpDir" -ForegroundColor Green
  }
  catch {
    Write-Host "Target directory creation failed (might already exist): $($_.Exception.Message)" -ForegroundColor Yellow
  }

  # Create backup directory
  $timestamp = (Get-Date).ToString('yyyy-MM-dd_HHmm')
  $backupDir = "/backup/$timestamp"

  try {
    $session.CreateDirectory($backupDir) | Out-Null
    Write-Host "Created backup directory: $backupDir" -ForegroundColor Green
  }
  catch {
    Write-Host "Backup directory creation failed (might already exist): $($_.Exception.Message)" -ForegroundColor Yellow
  }

  # Backup existing files
  Write-Host "Backing up existing files..." -ForegroundColor Yellow
  try {
    $files = $session.EnumerateRemoteFiles($ftpDir, '*', [WinSCP.EnumerationOptions]::None)
    $backupCount = 0
    foreach ($f in $files) {
      if ($f.IsDirectory) { continue }
      $src = $f.FullName
      $dest = ($backupDir.TrimEnd('/') + '/' + $f.Name)
      try {
        $session.MoveFile($src, $dest) | Out-Null
        $backupCount++
        Write-Host "  Backed up: $($f.Name)" -ForegroundColor Cyan
      }
      catch {
        Write-Host "  Backup failed for: $($f.Name) - $($_.Exception.Message)" -ForegroundColor Yellow
      }
    }
    Write-Host "Backed up $backupCount files" -ForegroundColor Green
  }
  catch {
    Write-Host "Backup process failed (directory might be empty): $($_.Exception.Message)" -ForegroundColor Yellow
  }

  # Upload new files
  Write-Host "Uploading new files..." -ForegroundColor Yellow
  $transferOptions = New-Object WinSCP.TransferOptions
  $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary
  $transferOptions.OverwriteMode = [WinSCP.OverwriteMode]::Overwrite

  # Upload files one by one to avoid directory issues
  $files = Get-ChildItem -Path $LocalPath -Recurse -File
  $totalFiles = $files.Count
  $currentFile = 0
  $successCount = 0
  $failCount = 0

  foreach ($file in $files) {
    $currentFile++
    $relativePath = $file.FullName.Substring((Resolve-Path $LocalPath).Path.Length + 1)
    $remotePath = "$ftpDir/$relativePath".Replace('\', '/')

    Write-Host "[$currentFile/$totalFiles] Uploading: $relativePath" -ForegroundColor Cyan

    try {
      $transferResult = $session.PutFiles($file.FullName, $remotePath, $false, $transferOptions)
      $transferResult.Check()
      $successCount++
      Write-Host "  ✓ Uploaded successfully" -ForegroundColor Green
    }
    catch {
      $failCount++
      Write-Host "  ✗ Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    }
  }

  Write-Host "Upload completed! Transferred $successCount files successfully." -ForegroundColor Green

  # Show transfer summary
  Write-Host "Transfer Summary:" -ForegroundColor Cyan
  Write-Host "  Successful: $successCount" -ForegroundColor Green
  if ($failCount -gt 0) {
    Write-Host "  Failed: $failCount" -ForegroundColor Red
  }

  # Clean up old backups (keep last 7 days)
  Write-Host "Cleaning up old backups..." -ForegroundColor Yellow
  try {
    $cutoff = (Get-Date).AddDays(-7)
    $backups = $session.EnumerateRemoteFiles('/backup/', '*', [WinSCP.EnumerationOptions]::None)
    $cleanedCount = 0
    foreach ($b in $backups) {
      if ($b.IsDirectory) { continue }
      if ($b.LastWriteTime -lt $cutoff) {
        try {
          $session.RemoveFiles($b.FullName) | Out-Null
          $cleanedCount++
          Write-Host "  Removed old backup: $($b.Name)" -ForegroundColor Cyan
        }
        catch {
          Write-Host "  Failed to remove: $($b.Name) - $($_.Exception.Message)" -ForegroundColor Yellow
        }
      }
    }
    Write-Host "Cleaned up $cleanedCount old backup files" -ForegroundColor Green
  }
  catch {
    Write-Host "Backup cleanup failed: $($_.Exception.Message)" -ForegroundColor Yellow
  }

  $session.Dispose()
  Write-Host "Deployment to $env completed successfully!" -ForegroundColor Green
  Write-Host "Your website should be live at your Hostinger domain" -ForegroundColor Cyan

}
catch {
  Write-Error "WinSCP deployment failed: $($_.Exception.Message)"
  Write-Host "Please check your FTP credentials and server access." -ForegroundColor Yellow
  if ($session) {
    $session.Dispose()
  }
  exit 1
}

exit 0
