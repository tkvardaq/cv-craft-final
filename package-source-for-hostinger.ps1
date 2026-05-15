# package-source-for-hostinger.ps1
# Creates a source zip for Hostinger's framework-detecting app uploader.

$ErrorActionPreference = "Stop"

$zipPath = "cvcraft-source.zip"
$stageDir = "hostinger_source_package"

Write-Host "Creating Hostinger source package..." -ForegroundColor Cyan

if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
if (Test-Path $stageDir) {
    Remove-Item -LiteralPath $stageDir -Recurse -Force
}

New-Item -ItemType Directory -Path $stageDir | Out-Null

$itemsToCopy = @(
    "src",
    "public",
    "supabase",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "eslint.config.mjs",
    "postcss.config.mjs",
    "components.json",
    "DEPLOYMENT.md",
    ".env.example"
)

foreach ($item in $itemsToCopy) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination $stageDir -Recurse -Force
    }
}

$requiredFiles = @(
    "$stageDir\package.json",
    "$stageDir\package-lock.json",
    "$stageDir\src\app",
    "$stageDir\next.config.ts"
)

foreach ($path in $requiredFiles) {
    if (-not (Test-Path $path)) {
        throw "Source packaging failed: missing $path"
    }
}

Push-Location $stageDir
try {
    tar.exe -a -cf "..\$zipPath" *
    if ($LASTEXITCODE -ne 0) {
        throw "tar.exe failed to create the source zip package."
    }
}
finally {
    Pop-Location
}

$zipSize = (Get-Item $zipPath).Length
if ($zipSize -lt 100000) {
    throw "Source packaging failed: zip is unexpectedly small ($zipSize bytes)."
}

Remove-Item -LiteralPath $stageDir -Recurse -Force

Write-Host "Done. $zipPath is ready for Hostinger's app-file uploader." -ForegroundColor Cyan
