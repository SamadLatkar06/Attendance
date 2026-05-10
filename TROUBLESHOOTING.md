# GeoAttend - Troubleshooting Guide

## Common Issues & Solutions

### 1. Location Not Working

**Problem**: App not getting GPS location

**Solutions**:
- Check if location permission is granted
  - Chrome: URL bar > Permissions > Location
  - Firefox: Preferences > Privacy > Permissions > Location
- Ensure HTTPS is enabled (required for geolocation)
- Test with different browser
- Check if device has GPS enabled
- Try incognito mode

**Code Fix**:
```javascript
// Request permission
const permission = await Geolocation.requestPermissions()
if (permission.location === 'prompt') {
  // Permission requested
}
```

### 2. Attendance Not Marking

**Problem**: Attendance marked as false even after staying inside radius

**Solutions**:
- Verify college coordinates are accurate
  - Use Google Maps to find exact coordinates
  - Format: decimal (e.g., 19.1136)
- Check if duration is >= minimum required
  - Default: 45 minutes
  - Adjust in `.env.local`
- Verify database permissions
  - Check RLS policies in Supabase
- Check browser console for errors

**Debug**:
```javascript
// Log attendance data
console.log('Distance:', distance)
console.log('Duration:', duration)
console.log('Inside Radius:', isInsideRadius)
console.log('Marked:', isMarked)
```

### 3. Database Connection Fails

**Problem**: "Failed to connect to Supabase"

**Solutions**:
- Verify Supabase URL and key in `.env.local`
- Check if Supabase project is active
- Verify internet connection
- Check Supabase status page
- Clear browser cache

**Code Fix**:
```javascript
// Test connection
const { data, error } = await supabase.from('users').select('count')
if (error) console.error('Connection failed:', error.message)
```

### 4. Authentication Issues

**Problem**: Cannot login or signup

**Solutions**:
- Verify email format is correct
- Password must be >= 6 characters
- Check if user already exists
- Clear browser cookies
- Check Supabase Auth settings

**Code Fix**:
```javascript
// Reset password
const { error } = await supabase.auth.resetPasswordForEmail(email)
if (!error) toast.success('Reset link sent to email')
```

### 5. Port 3000 Already in Use

**Problem**: "Port 3000 is already in use"

**Solutions**:
- Use different port:
  ```bash
  npm run dev -- --port 3001
  ```
- Kill process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:3000 | xargs kill -9
  ```

### 6. Build Fails

**Problem**: Build fails during `npm run build`

**Solutions**:
- Clear cache:
  ```bash
  npm cache clean --force
  ```
- Reinstall dependencies:
  ```bash
  rm -rf node_modules
  npm install
  ```
- Check for syntax errors
- Verify all imports are correct
- Check environment variables

### 7. Module Not Found Errors

**Problem**: "Cannot find module 'X'"

**Solutions**:
- Install missing package:
  ```bash
  npm install package-name
  ```
- Check if file path is correct
- Verify import statement spelling
- Clear node_modules and reinstall

### 8. GPS Distance Calculation Wrong

**Problem**: Distance calculation seems incorrect

**Solutions**:
- Verify Haversine formula implementation
- Check if coordinates are in decimal format
- Test with known locations
- Verify college coordinates from Google Maps

**Test**:
```javascript
// Known distance test
const distance = calculateDistance(19.1136, 72.8697, 19.1137, 72.8698)
console.log('Distance:', distance) // Should be ~100-150 meters
```

### 9. Capacitor Issues

**Problem**: Capacitor build fails

**Solutions**:
- Update Capacitor:
  ```bash
  npm install -g @capacitor/cli
  npx cap update
  ```
- Sync web assets:
  ```bash
  npm run build
  npx cap sync
  ```
- Clear Android cache:
  ```bash
  cd android
  ./gradlew clean
  ```

### 10. Vercel Deployment Issues

**Problem**: Deployment fails on Vercel

**Solutions**:
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure all dependencies in package.json
- Check for Node.js version conflicts

**Debug**:
```bash
# Test build locally
npm run build

# Preview build
npm run preview
```

## Performance Issues

### App Running Slow

**Solutions**:
- Check network tab in DevTools
- Reduce location update frequency
- Optimize database queries
- Enable Vercel Analytics
- Check browser console for errors

### High Battery Drain

**Solutions**:
- Reduce geolocation update interval
- Disable continuous location tracking
- Use lower accuracy GPS when possible
- Stop tracking when app not in use

## Browser Compatibility

### Not Working in Browser X

**Solutions**:
- Check browser version
- Clear cache and cookies
- Disable browser extensions
- Try different browser
- Check DevTools console for errors

## Mobile/Android Issues

### Location Not Working on Android

**Solutions**:
- Enable location services on device
- Grant app location permission
- Use device with GPS (not emulator)
- Check Android version (5.0+)
- Restart device

### APK Won't Install

**Solutions**:
- Uninstall previous version:
  ```bash
  adb uninstall com.geoattend.app
  ```
- Clear app data:
  ```bash
  adb shell pm clear com.geoattend.app
  ```
- Check Android version compatibility
- Use debug APK for testing

## Getting Help

### Check Logs

1. Browser Console (F12)
2. DevTools Network tab
3. Vercel deployment logs
4. Android logcat:
   ```bash
   adb logcat | grep GeoAttend
   ```

### Common Error Messages

| Error | Solution |
|-------|----------|
| CORS Error | Check Supabase CORS settings |
| Auth Error | Verify Supabase credentials |
| 401 Unauthorized | Check API key permissions |
| Timeout | Check internet connection |
| RLS Violation | Check Row Level Security policies |

## Support Resources

- GitHub Issues: Report bugs
- Supabase Docs: Database/Auth help
- React Docs: Component help
- Vite Docs: Build issues
- Capacitor Docs: Mobile issues

## Reporting Bugs

When reporting issues, include:
1. Error message and stack trace
2. Steps to reproduce
3. Browser/Device info
4. Environment variables (without secrets)
5. Screenshots/videos
