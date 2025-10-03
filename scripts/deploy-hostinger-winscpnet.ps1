param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet('staging', 'production')]
    [string]$env,

    [string]$LocalPath = 'dist',

    [switch]$DryRun
)

# Load environment file if present (do not fail if missing; prefer CI env vars / secrets)
$envFile = Join-Path (Get-Location) ".env.$env"
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
else {
    Write-Host "Environment file $envFile not found — continuing and preferring environment variables / secrets."
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

# Locate WinSCP .NET assembly
$possibleDlls = @(
    'C:\Program Files (x86)\WinSCP\WinSCPnet.dll',
    'C:\Program Files\WinSCP\WinSCPnet.dll'
)
$dll = $possibleDlls | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $dll) {
    Write-Error "Could not find WinSCPnet.dll. Please install WinSCP (https://winscp.net/) or place WinSCPnet.dll in a known location."
    exit 1
}

Add-Type -Path $dll

# Prepare session options for FTPS (explicit)
$sessionOptionsFTPS = New-Object WinSCP.SessionOptions
$sessionOptionsFTPS.Protocol = [WinSCP.Protocol]::Ftp
$sessionOptionsFTPS.HostName = $ftpHost
$sessionOptionsFTPS.UserName = $ftpUser
$sessionOptionsFTPS.Password = $ftpPass
$sessionOptionsFTPS.FtpSecure = [WinSCP.FtpSecure]::Explicit

if ($fingerprint) {
    $sessionOptionsFTPS.TlsHostCertificateFingerprint = $fingerprint
}

# Prepare session options for plain FTP (fallback)
$sessionOptionsFTP = New-Object WinSCP.SessionOptions
$sessionOptionsFTP.Protocol = [WinSCP.Protocol]::Ftp
$sessionOptionsFTP.HostName = $ftpHost
$sessionOptionsFTP.UserName = $ftpUser
$sessionOptionsFTP.Password = $ftpPass
$sessionOptionsFTP.FtpSecure = [WinSCP.FtpSecure]::None

function Invoke-Deploy([WinSCP.SessionOptions]$sessionOptions) {
    $session = New-Object WinSCP.Session
    try {
        Write-Host "Opening session to $($sessionOptions.HostName) ..."
        if ($DryRun) { Write-Host "DRY RUN: would open session with options: $sessionOptions" }
        else { $session.Open($sessionOptions) }

        # Ensure backup dir exists
        if ($DryRun) { Write-Host "DRY RUN: ensure remote dir $backupDir" }
        else { $session.CreateDirectory($backupDir) | Out-Null }

        # Resolve remoteDir
        $remoteDir = $ftpDir
        if (-not $remoteDir) {
            Write-Error "FTP_DIR not set in environment or .env file."
            return 1
        }
        if ($remoteDir -notlike '*/') { $remoteDir = $remoteDir.TrimEnd('/') + '/' }

        Write-Host "Listing files in $remoteDir ..."
        if ($DryRun) { Write-Host "DRY RUN: would enumerate remote files in $remoteDir" }
        else {
            $files = $session.EnumerateRemoteFiles($remoteDir, '*', [WinSCP.EnumerationOptions]::None)
            foreach ($f in $files) {
                if ($f.IsDirectory) { continue }
                $src = $f.FullName
                $dest = ($backupDir.TrimEnd('/') + '/' + $f.Name)
                Write-Host "Moving $src -> $dest"
                $session.MoveFile($src, $dest) | Out-Null
            }
        }

        # Remove remote backups older than 7 days
        if ($DryRun) { Write-Host "DRY RUN: would remove backup files older than 7 days in /backup" }
        else {
            $cutoff = (Get-Date).AddDays(-7)
            $backups = $session.EnumerateRemoteFiles('/backup/', '*', [WinSCP.EnumerationOptions]::None)
            foreach ($b in $backups) {
                if ($b.IsDirectory) { continue }
                if ($b.LastWriteTime -lt $cutoff) {
                    Write-Host "Removing old backup $($b.FullName)"
                    $session.RemoveFiles($b.FullName) | Out-Null
                }
            }
        }

        # Upload local files from $LocalPath
        $resolvedLocal = Resolve-Path -Path $LocalPath -ErrorAction SilentlyContinue
        if (-not $resolvedLocal) {
            $alt = Join-Path (Get-Location) $LocalPath
            $resolvedLocal = Resolve-Path -Path $alt -ErrorAction SilentlyContinue
        }
        if (-not $resolvedLocal) {
            Write-Error "Local path '$LocalPath' not found."
            return 1
        }
        $localPathStr = $resolvedLocal.Path
        $localPathWildcard = Join-Path $localPathStr '*'

        $remotePath = $remoteDir
        if ($remotePath -notlike '*/') { $remotePath = $remotePath.TrimEnd('/') + '/' }

        Write-Host "Uploading $localPathWildcard -> $remotePath"
        $transferOptions = New-Object WinSCP.TransferOptions
        $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary

        if ($DryRun) {
            Write-Host "DRY RUN: would call PutFiles('$localPathWildcard', '$remotePath')"
            "$((Get-Date).ToString()) DRY RUN: Would have uploaded from $localPathWildcard to $remotePath" | Out-File -FilePath $logFile -Append -Encoding ascii
        }
        else {
            $transferResult = $session.PutFiles($localPathWildcard, $remotePath, $false, $transferOptions)
            $transferResult.Check()
            Write-Host "Upload finished. Transferred files: $($transferResult.Transfers.Count)"
            "$((Get-Date).ToString()) Uploaded $($transferResult.Transfers.Count) files." | Out-File -FilePath $logFile -Append -Encoding ascii
        }

        return 0
    }
    catch {
        Write-Error "Error during deployment: $_"
        "$((Get-Date).ToString()) ERROR: $_" | Out-File -FilePath $logFile -Append -Encoding ascii
        return 1
    }
    finally {
        if ($null -ne $session) { $session.Dispose() }
    }
}

# Try FTPS first, then FTP
$code = Invoke-Deploy $sessionOptionsFTPS
if ($code -ne 0) {
    Write-Warning "FTPS attempt failed, retrying with plain FTP"
    $code = Invoke-Deploy $sessionOptionsFTP
}

if ($code -eq 0) { Write-Host "Deployment completed successfully (DryRun=$DryRun). Log: $logFile" }
else { Write-Error "Deployment failed. See $logFile for details." }

exit $code
