# Quick APK Build Script for Windows PowerShell
# This script automates the Android APK build process

Write-Host "🚀 Gigabase Android APK Builder" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "📦 Checking prerequisites..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js installed: $(node --version)" -ForegroundColor Green

# Step 1: Install Capacitor
Write-Host ""
Write-Host "📦 Step 1: Installing Capacitor..." -ForegroundColor Yellow
npm install @capacitor/core @capacitor/cli

# Step 2: Initialize Capacitor
Write-Host ""
Write-Host "⚙️  Step 2: Initializing Capacitor..." -ForegroundColor Yellow
Write-Host "When prompted, enter:" -ForegroundColor Cyan
Write-Host "  App name: Gigabase" -ForegroundColor Cyan
Write-Host "  App ID: com.gigabase.app" -ForegroundColor Cyan
Write-Host "  Web asset directory: dist" -ForegroundColor Cyan
npx cap init

# Step 3: Install Android platform
Write-Host ""
Write-Host "📱 Step 3: Installing Android platform..." -ForegroundColor Yellow
npm install @capacitor/android
npx cap add android

# Step 4: Install useful plugins
Write-Host ""
Write-Host "🔌 Step 4: Installing Capacitor plugins..." -ForegroundColor Yellow
npm install @capacitor/status-bar @capacitor/splash-screen @capacitor/app @capacitor/network @capacitor/share @capacitor/browser @capacitor/haptics

# Step 5: Build the web app
Write-Host ""
Write-Host "🏗️  Step 5: Building web application..." -ForegroundColor Yellow
npm run build

# Step 6: Sync with Android
Write-Host ""
Write-Host "🔄 Step 6: Syncing with Android project..." -ForegroundColor Yellow
npx cap sync android

# Step 7: Add scripts to package.json
Write-Host ""
Write-Host "📝 Step 7: Adding helpful scripts to package.json..." -ForegroundColor Yellow
$packageJson = Get-Content package.json | ConvertFrom-Json
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "android:build" -Value "npm run build && npx cap sync android" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "android:open" -Value "npx cap open android" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "android:sync" -Value "npx cap sync android" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "android:run" -Value "npm run android:build && npm run android:open" -Force
$packageJson | ConvertTo-Json -Depth 10 | Set-Content package.json

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Install Android Studio from: https://developer.android.com/studio" -ForegroundColor White
Write-Host "  2. Run: npm run android:open" -ForegroundColor White
Write-Host "  3. In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)" -ForegroundColor White
Write-Host "  4. APK location: android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full documentation: APK_CONVERSION_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Happy building!" -ForegroundColor Green
