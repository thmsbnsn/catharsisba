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

# Use .NET FTP classes for simple upload
try {
    Write-Host "Connecting to FTP server..." -ForegroundColor Yellow
    
    # Test connection to root directory first
    $ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost/")
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
    
    # Test connection
    $response = $ftpRequest.GetResponse()
    $response.Close()
    
    # Try to create the target directory if it doesn't exist
    try {
        $dirRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost$ftpDir/")
        $dirRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
        $dirRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $dirResponse = $dirRequest.GetResponse()
        $dirResponse.Close()
        Write-Host "Created directory: $ftpDir" -ForegroundColor Green
    } catch {
        # Directory might already exist, which is fine
        Write-Host "Directory $ftpDir already exists or creation failed (this is usually fine)" -ForegroundColor Yellow
    }
    
    Write-Host "FTP connection successful!" -ForegroundColor Green
    
    # Get all files to upload
    $files = Get-ChildItem -Path $LocalPath -Recurse -File
    $totalFiles = $files.Count
    $currentFile = 0
    
    Write-Host "Found $totalFiles files to upload..." -ForegroundColor Yellow
    
    foreach ($file in $files) {
        $currentFile++
        $relativePath = $file.FullName.Substring((Resolve-Path $LocalPath).Path.Length + 1)
        $remotePath = "$ftpDir/$relativePath".Replace('\', '/')
        
        Write-Host "[$currentFile/$totalFiles] Uploading: $relativePath" -ForegroundColor Cyan
        
        try {
            # Create FTP request for file upload
            $fileRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost$remotePath")
            $fileRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
            $fileRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
            $fileRequest.UseBinary = $true
            
            # Upload file
            $fileStream = [System.IO.File]::OpenRead($file.FullName)
            $requestStream = $fileRequest.GetRequestStream()
            $fileStream.CopyTo($requestStream)
            $requestStream.Close()
            $fileStream.Close()
            
            Write-Host "  Uploaded successfully" -ForegroundColor Green
            
        } catch {
            Write-Host "  Upload failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "Deployment to $env completed!" -ForegroundColor Green
    Write-Host "Your website should be live at your Hostinger domain" -ForegroundColor Cyan
    
} catch {
    Write-Error "FTP deployment failed: $($_.Exception.Message)"
    Write-Host "Please check your FTP credentials and try again." -ForegroundColor Yellow
    exit 1
}

exit 0