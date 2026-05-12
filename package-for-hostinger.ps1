# package-for-hostinger.ps1
# This script bundles the CvCRAFT application for deployment on Hostinger's VPS or Node.js hosting.

Write-Host "🚀 Starting build process for CvCRAFT..." -ForegroundColor Cyan

# 1. Run build
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix errors before packaging." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 2. Create deployment directory
$deployDir = "deploy_package"
if (Test-Path $deployDir) {
    Remove-Item -Path $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir

# 3. Copy standalone build
Write-Host "📦 Copying standalone files..." -ForegroundColor Green
Copy-Item -Path ".next/standalone/*" -Destination $deployDir -Recurse

# 4. Copy static assets (Crucial for Next.js standalone)
Write-Host "🖼️ Copying static assets..." -ForegroundColor Green
New-Item -ItemType Directory -Path "$deployDir/.next/static"
Copy-Item -Path ".next/static/*" -Destination "$deployDir/.next/static" -Recurse

New-Item -ItemType Directory -Path "$deployDir/public"
Copy-Item -Path "public/*" -Destination "$deployDir/public" -Recurse

# 5. Create a production .env file (template)
Write-Host "📝 Creating environment template..." -ForegroundColor Green
$envContent = @"
# Production Environment Variables
# Update these on your Hostinger Panel or in a real .env file on the server
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NIM_API_KEY=your_nim_api_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
"@
$envContent | Out-File -FilePath "$deployDir/.env.production.example"

# 6. Zip everything
Write-Host "🤐 Zipping package..." -ForegroundColor Green
Compress-Archive -Path "$deployDir/*" -DestinationPath "cvcraft-deploy.zip" -Force

Write-Host "✅ Done! 'cvcraft-deploy.zip' is ready for upload to Hostinger." -ForegroundColor Cyan
Write-Host "Follow the instructions in DEPLOYMENT.md to complete the setup." -ForegroundColor Yellow
