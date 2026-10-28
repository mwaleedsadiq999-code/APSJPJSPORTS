#Requires -Version 5.1
<#
    share.ps1 - put a shareable copy of the site on a public HTTPS link.

    Serves the PRODUCTION build (dist/) rather than the dev server:
      * one JS file + one CSS file instead of dozens of module requests
      * works on old iPad Safari (downleveled to safari11 in the build)
      * far faster over a phone connection

    What it does
    ------------
      1. Runs `npm run build`.
      2. Starts `vite preview` on port 4173 as a detached process.
      3. Opens a localhost.run SSH tunnel to it, also detached.
      4. Waits for the public URL, checks it responds, prints it.

    The link stays alive while this computer is awake and the tunnel
    process is running. Closing the terminal does NOT kill it.

    Usage
    -----
      .\share.ps1                 build + serve + publish
      .\share.ps1 -KeepAwake      also stop Windows from sleeping on AC power
      .\share.ps1 -Stop           stop the preview server and the tunnel

    Notes
    -----
      * Free localhost.run gives a random subdomain each run.
      * cloudflared is not used: this ISP blocks trycloudflare.com.
#>
[CmdletBinding()]
param(
    [int]$Port = 4173,
    [switch]$KeepAwake,
    [switch]$Stop
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$stateDir = Join-Path $root '.share'
$outLog = Join-Path $stateDir 'tunnel.out'
$errLog = Join-Path $stateDir 'tunnel.err'
$pidFile = Join-Path $stateDir 'tunnel.pid'
$vitePidFile = Join-Path $stateDir 'vite.pid'
$viteLog = Join-Path $stateDir 'vite.out'
$viteErrLog = Join-Path $stateDir 'vite.err'

New-Item -ItemType Directory -Force -Path $stateDir | Out-Null

function Test-Port {
    param([int]$P)
    return [bool](Get-NetTCPConnection -LocalPort $P -State Listen -ErrorAction SilentlyContinue)
}

function Stop-Preview {
    if (Test-Path $vitePidFile) {
        $vp = Get-Content $vitePidFile -ErrorAction SilentlyContinue
        if ($vp) { Stop-Process -Id $vp -Force -ErrorAction SilentlyContinue }
        Remove-Item $vitePidFile -ErrorAction SilentlyContinue
    }
}

# ----------------------------------------------------------------- stop mode
if ($Stop) {
    Get-CimInstance Win32_Process -Filter "Name='ssh.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like '*localhost.run*' } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

    Stop-Preview
    Remove-Item $pidFile -ErrorAction SilentlyContinue
    Write-Host 'Preview server and tunnel stopped.' -ForegroundColor Yellow
    return
}

# ------------------------------------------------------------------ 1. build
Write-Host 'Building ...' -ForegroundColor Cyan
Push-Location $root
try { & npm run build 2>&1 | Out-Null } finally { Pop-Location }
if (-not (Test-Path (Join-Path $root 'dist\index.html'))) { throw 'Build failed - dist/index.html missing.' }
Write-Host 'Build ready.' -ForegroundColor Green

# --------------------------------------------------------- 2. preview server
Stop-Preview
if (Test-Port $Port) {
    # Something else owns the port; leave it alone but report it.
    Write-Host "Port $Port already in use - reusing the existing server." -ForegroundColor Yellow
} else {
    Write-Host "Starting preview server on port $Port ..." -ForegroundColor Cyan
    $viteBin = Join-Path $root 'node_modules\vite\bin\vite.js'
    $preview = Start-Process -FilePath 'node' `
        -ArgumentList @($viteBin, 'preview', '--host', '--port', "$Port", '--strictPort') `
        -WorkingDirectory $root -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput $viteLog -RedirectStandardError $viteErrLog
    $preview.Id | Set-Content $vitePidFile

    for ($i = 0; $i -lt 60; $i++) {
        if (Test-Port $Port) { break }
        Start-Sleep -Milliseconds 400
    }
    if (-not (Test-Port $Port)) { throw "Preview server did not start on port $Port." }
    Write-Host 'Preview server ready.' -ForegroundColor Green
}

# --------------------------------------------------------------- 3. tunnel
Get-CimInstance Win32_Process -Filter "Name='ssh.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -like '*localhost.run*' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Remove-Item $outLog, $errLog -ErrorAction SilentlyContinue
Write-Host 'Opening tunnel ...' -ForegroundColor Cyan

$sshArgs = @(
    '-T'
    '-o', 'StrictHostKeyChecking=accept-new'
    '-o', 'ServerAliveInterval=30'
    '-o', 'ServerAliveCountMax=3'
    '-o', 'TCPKeepAlive=yes'
    '-o', 'ExitOnForwardFailure=yes'
    '-R', "80:localhost:$Port"
    'nokey@localhost.run'
)

$tunnel = Start-Process -FilePath 'ssh' -ArgumentList $sshArgs `
    -RedirectStandardOutput $outLog -RedirectStandardError $errLog `
    -WindowStyle Hidden -PassThru
$tunnel.Id | Set-Content $pidFile

# ---------------------------------------------------------------- 4. URL
$url = $null
for ($i = 0; $i -lt 120; $i++) {
    foreach ($log in @($outLog, $errLog)) {
        if (Test-Path $log) {
            $hit = Select-String -Path $log -Pattern 'https://[a-z0-9]+\.lhr\.life' -ErrorAction SilentlyContinue |
                Select-Object -First 1
            if ($hit) {
                if ($hit.Line -match '(https://[a-z0-9]+\.lhr\.life)') { $url = $Matches[1] }
                break
            }
        }
    }
    if ($url) { break }
    Start-Sleep -Milliseconds 500
}

if (-not $url) {
    Write-Host 'Could not get a URL. Last tunnel output:' -ForegroundColor Red
    Get-Content $errLog -Tail 15 -ErrorAction SilentlyContinue
    throw 'Tunnel failed to start.'
}

$status = 'unverified'
for ($i = 0; $i -lt 6; $i++) {
    Start-Sleep -Seconds 3
    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
        if ($r.StatusCode -eq 200) { $status = 'OK'; break }
    } catch { $status = 'retrying' }
}

# ------------------------------------------------------------- 5. keep awake
if ($KeepAwake) {
    powercfg /change standby-timeout-ac 0 | Out-Null
    powercfg /change hibernate-timeout-ac 0 | Out-Null
    Write-Host 'Sleep disabled while on AC power.' -ForegroundColor Green
}

# ------------------------------------------------------------------ report
$lanIp = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.InterfaceAlias -eq 'Wi-Fi' } |
    Select-Object -First 1).IPAddress

Write-Host ''
Write-Host '==========================================================' -ForegroundColor DarkGray
Write-Host '  SHARE THIS LINK (works on mobile data, anywhere)' -ForegroundColor White
Write-Host ''
Write-Host "  $url" -ForegroundColor Green
Write-Host ''
Write-Host "  status: HTTP $status  (production build, port $Port)" -ForegroundColor $(if ($status -eq 'OK') { 'Green' } else { 'Yellow' })
if ($lanIp) {
    Write-Host "  same Wi-Fi instead (faster): http://$lanIp`:$Port" -ForegroundColor DarkGray
}
Write-Host ''
Write-Host '  Stays up until this computer sleeps or shuts down.' -ForegroundColor DarkGray
Write-Host '  Closing this window does not break it.' -ForegroundColor DarkGray
Write-Host '  Stop it with:  .\share.ps1 -Stop' -ForegroundColor DarkGray
Write-Host '==========================================================' -ForegroundColor DarkGray
