param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet('staging', 'production')]
    [string]$env
)

# Load environment file
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

$ftpHost = $vars['FTP_HOST']
$ftpUser = $vars['FTP_USER']
$ftpPass = $vars['FTP_PASS']
$ftpDir = $vars['FTP_DIR']

Write-Host "Checking FTP directory structure..." -ForegroundColor Green
Write-Host "FTP Host: $ftpHost" -ForegroundColor Cyan
Write-Host "FTP User: $ftpUser" -ForegroundColor Cyan
Write-Host "Target Directory: $ftpDir" -ForegroundColor Cyan

try {
    # Test connection to root
    $rootRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost/")
    $rootRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $rootRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory

    $rootResponse = $rootRequest.GetResponse()
    $rootStream = $rootResponse.GetResponseStream()
    $rootReader = New-Object System.IO.StreamReader($rootStream)
    $rootContents = $rootReader.ReadToEnd()
    $rootReader.Close()
    $rootStream.Close()
    $rootResponse.Close()

    Write-Host "Root directory contents:" -ForegroundColor Yellow
    Write-Host $rootContents -ForegroundColor White

    # Test connection to public_html
    $publicRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost/public_html/")
    $publicRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $publicRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory

    $publicResponse = $publicRequest.GetResponse()
    $publicStream = $publicResponse.GetResponseStream()
    $publicReader = New-Object System.IO.StreamReader($publicStream)
    $publicContents = $publicReader.ReadToEnd()
    $publicReader.Close()
    $publicStream.Close()
    $publicResponse.Close()

    Write-Host "Public_html directory contents:" -ForegroundColor Yellow
    Write-Host $publicContents -ForegroundColor White

    # Try to create the target directory
    Write-Host "Attempting to create target directory: $ftpDir" -ForegroundColor Yellow
    $dirRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost$ftpDir/")
    $dirRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $dirRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory

    try {
        $dirResponse = $dirRequest.GetResponse()
        $dirResponse.Close()
        Write-Host "Successfully created directory: $ftpDir" -ForegroundColor Green
    } catch {
        Write-Host "Directory creation failed (might already exist): $($_.Exception.Message)" -ForegroundColor Yellow
    }

    # Test write permissions by trying to upload a small test file
    Write-Host "Testing write permissions..." -ForegroundColor Yellow
    $testContent = "test"
    $testBytes = [System.Text.Encoding]::ASCII.GetBytes($testContent)

    $testRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost$ftpDir/test.txt")
    $testRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $testRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $testRequest.UseBinary = $true

    $testStream = $testRequest.GetRequestStream()
    $testStream.Write($testBytes, 0, $testBytes.Length)
    $testStream.Close()

    $testResponse = $testRequest.GetResponse()
    $testResponse.Close()

    Write-Host "Write test successful! Directory is writable." -ForegroundColor Green

    # Clean up test file
    $deleteRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost$ftpDir/test.txt")
    $deleteRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $deleteRequest.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
    $deleteResponse = $deleteRequest.GetResponse()
    $deleteResponse.Close()

    Write-Host "Test file cleaned up." -ForegroundColor Green

} catch {
    Write-Error "FTP check failed: $($_.Exception.Message)"
    Write-Host "This might indicate:" -ForegroundColor Yellow
    Write-Host "1. Incorrect FTP credentials" -ForegroundColor Yellow
    Write-Host "2. FTP user doesn't have access to the directory" -ForegroundColor Yellow
    Write-Host "3. Directory doesn't exist and can't be created" -ForegroundColor Yellow
    exit 1
}

Write-Host "FTP directory check completed successfully!" -ForegroundColor Green
