# 📱 Gigabase Android APK Build Guide

## ✅ What's Been Set Up

1. ✅ Capacitor installed and configured
2. ✅ Android platform added
3. ✅ Web app built and synced to Android
4. ✅ Project structure ready

## 🔧 Prerequisites to Build APK

You need **Android SDK** installed. Here are your options:

### Option 1: Using Android Studio (Recommended)

1. **Download Android Studio**
   - Go to: https://developer.android.com/studio
   - Download and install Android Studio

2. **Install Android SDK**
   - Open Android Studio
   - Go to: Tools → SDK Manager
   - Install:
     - Android SDK Platform 33 (or latest)
     - Android SDK Build-Tools
     - Android SDK Command-line Tools

3. **Set Environment Variable**
   ```powershell
   # Add to your system environment variables:
   ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
   
   # Or run this in PowerShell (Admin):
   [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\thota\AppData\Local\Android\Sdk', 'User')
   ```

4. **Build APK via Android Studio**
   ```bash
   npx cap open android
   ```
   - Then in Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)

### Option 2: Command Line (After SDK is installed)

1. **Create local.properties file**
   ```bash
   # In android/ folder, create local.properties with:
   sdk.dir=C:\\Users\\thota\\AppData\\Local\\Android\\Sdk
   ```

2. **Build APK**
   ```bash
   cd android
   .\gradlew.bat assembleDebug
   ```

3. **Find your APK**
   ```
   Location: android\app\build\outputs\apk\debug\app-debug.apk
   ```

### Option 3: Use Online Build Service (Easiest)

1. **Use Expo Application Services (EAS)**
   - Sign up at: https://expo.dev
   - Follow their build guide

2. **Or use Ionic Appflow**
   - Sign up at: https://ionic.io/appflow
   - Cloud build without local SDK

## 🚀 Quick Build Commands (Once SDK is Ready)

```bash
# 1. Build web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. Or build APK via command line
cd android
.\gradlew.bat assembleDebug

# 5. Or build release APK (signed)
.\gradlew.bat assembleRelease
```

## 📦 APK Locations

- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## 🔐 For Release APK (Google Play)

You'll need to create a keystore:

```bash
# Create keystore
keytool -genkey -v -keystore gigabase-release.keystore -alias gigabase -keyalg RSA -keysize 2048 -validity 10000

# Then configure in android/app/build.gradle
```

## 📱 Current App Configuration

- **App Name**: Gigabase
- **Package ID**: com.gigabase.app
- **Version**: 1.0.0
- **Min SDK**: 22 (Android 5.1)
- **Target SDK**: 33 (Android 13)

## 🎯 Next Steps

1. Install Android Studio from: https://developer.android.com/studio
2. Set up Android SDK
3. Run: `npx cap open android`
4. Build APK from Android Studio

## ⚡ Alternative: Use Android Studio

The easiest way:
1. Run: `npx cap open android`
2. Wait for Android Studio to load the project
3. Click: Build → Build Bundle(s) / APK(s) → Build APK(s)
4. Find APK in: `android/app/build/outputs/apk/debug/`

## 🐛 Troubleshooting

**Error: SDK location not found**
- Install Android Studio
- Set ANDROID_HOME environment variable
- Create android/local.properties file

**Error: Gradle build failed**
- Check Java JDK is installed (JDK 11 or 17)
- Clear Gradle cache: `cd android && .\gradlew.bat clean`

**App crashes on open**
- Check capacitor.config.ts
- Run: `npx cap sync android`
- Rebuild the app

## 📞 Need Help?

1. Check Capacitor docs: https://capacitorjs.com/docs/android
2. Android Studio guide: https://developer.android.com/studio/run
3. Stack Overflow: Search for specific errors

---

**Status**: ✅ Project is ready! Just need Android SDK to build the APK.
