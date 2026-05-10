# Capacitor Android Setup Guide

## Prerequisites

1. Android Studio
2. Java Development Kit (JDK) 11+
3. Android SDK (API 24+)

## Setup Steps

### 1. Add Android Platform

```bash
npm run cap:add:android
```

### 2. Configure Android Project

Edit `android/app/src/main/AndroidManifest.xml` and add:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 3. Build Web Assets

```bash
npm run build
```

### 4. Sync Capacitor

```bash
npm run cap:sync
```

### 5. Open Android Studio

```bash
npm run cap:open:android
```

### 6. Build APK

In Android Studio:
1. Go to Build → Build Bundle(s)/APK(s) → Build APK(s)
2. Wait for build to complete
3. APK will be in `android/app/build/outputs/apk/`

### 7. Run on Device/Emulator

```bash
cd android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Permissions

The app requests:
- **ACCESS_FINE_LOCATION**: Precise GPS location
- **ACCESS_COARSE_LOCATION**: Approximate location
- **INTERNET**: Network access

These are handled automatically by Capacitor Geolocation plugin.

## Troubleshooting

### Location not working
1. Enable location services on device
2. Grant app location permissions
3. Use device with GPS (not emulator without GPS)

### Build fails
1. Update Android SDK
2. Check Java version: `java -version`
3. Run `gradle clean`

### APK installation fails
1. Uninstall previous version: `adb uninstall com.geoattend.app`
2. Clear cache: `adb shell pm clear com.geoattend.app`
3. Retry installation

## Release Build

```bash
cd android
./gradlew assembleRelease
```

Signed APK will be in `app/build/outputs/apk/release/`

## Google Play Store

1. Create signed APK (see Release Build above)
2. Create Google Play developer account
3. Create app in Play Console
4. Upload APK
5. Fill required information
6. Submit for review
