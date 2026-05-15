# package-for-hostinger.ps1
# Builds a verified Next.js standalone package for Hostinger Node.js hosting or VPS.

$ErrorActionPreference = "Stop"

Write-Host "Starting production build for CvCRAFT..." -ForegroundColor Cyan

$previousStandalone = $env:NEXT_STANDALONE
$env:NEXT_STANDALONE = "true"
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed. Fix the build errors before packaging."
    }
}
finally {
    $env:NEXT_STANDALONE = $previousStandalone
}

$deployDir = "deploy_package"
$zipPath = "cvcraft-deploy.zip"

if (Test-Path $deployDir) {
    Remove-Item -LiteralPath $deployDir -Recurse -Force
}
if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

New-Item -ItemType Directory -Path $deployDir | Out-Null

Write-Host "Copying standalone server files..." -ForegroundColor Green
Copy-Item -Path ".next\standalone\*" -Destination $deployDir -Recurse -Force

Write-Host "Copying Next static assets..." -ForegroundColor Green
New-Item -ItemType Directory -Path "$deployDir\.next\static" -Force | Out-Null
Copy-Item -Path ".next\static\*" -Destination "$deployDir\.next\static" -Recurse -Force

Write-Host "Copying public assets..." -ForegroundColor Green
New-Item -ItemType Directory -Path "$deployDir\public" -Force | Out-Null
Copy-Item -Path "public\*" -Destination "$deployDir\public" -Recurse -Force

Write-Host "Writing production environment template..." -ForegroundColor Green
$envContent = @"
# Production Environment Variables
# Set real values in Hostinger's Node.js panel or in a server-side .env file.
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NIM_API_KEY=your_nim_api_key

# Optional. Leave blank until Stripe payments are enabled.
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
"@
$envContent | Out-File -FilePath "$deployDir\.env.production.example" -Encoding utf8

Write-Host "Writing Hostinger runtime package.json..." -ForegroundColor Green
$runtimePackageJson = @"
{
  "name": "cvcraft-uk-standalone",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node server.js",
    "build": "node -e \"console.log('Prebuilt Next.js standalone package; skipping build.')\""
  },
  "engines": {
    "node": ">=20"
  }
}
"@
$runtimePackageJson | Out-File -FilePath "$deployDir\package.json" -Encoding utf8

$requiredFiles = @(
    "$deployDir\server.js",
    "$deployDir\package.json",
    "$deployDir\.next\BUILD_ID",
    "$deployDir\.next\server",
    "$deployDir\.next\static"
)

foreach ($path in $requiredFiles) {
    if (-not (Test-Path $path)) {
        throw "Packaging failed: missing $path"
    }
}

Write-Host "Creating zip package..." -ForegroundColor Green
Push-Location $deployDir
try {
    tar.exe -a -cf "..\$zipPath" *
    if ($LASTEXITCODE -ne 0) {
        throw "tar.exe failed to create the zip package."
    }
}
finally {
    Pop-Location
}

$zipSize = (Get-Item $zipPath).Length
if ($zipSize -lt 1000000) {
    throw "Packaging failed: zip is unexpectedly small ($zipSize bytes)."
}

Write-Host "Done. $zipPath is ready for upload to Hostinger." -ForegroundColor Cyan
