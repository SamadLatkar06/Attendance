# GeoAttend Installation & Setup Guide

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git
- Supabase account
- Vercel account (optional, for deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/SamadLatkar06/Attendance.git
cd Attendance
git checkout geoattend-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

**Option A: Using Existing Project**

1. Log in to Supabase
2. Go to SQL Editor
3. Create new query
4. Copy content from `src/supabase/schema.sql`
5. Paste and run

**Option B: Creating New Project**

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in details
4. Wait for project to initialize
5. Follow Option A above

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_COLLEGE_LATITUDE=your_college_latitude
VITE_COLLEGE_LONGITUDE=your_college_longitude
VITE_ATTENDANCE_RADIUS_METERS=100
VITE_MINIMUM_ATTENDANCE_MINUTES=45
```

**Where to get values:**
- URL & Key: Supabase > Project Settings > API
- College coords: Google Maps (right-click > coordinates)

### 5. Run Development Server

```bash
npm run dev
```

App runs at `http://localhost:3000`

## Testing

### Create Test Users

**Student:**
- Email: student@example.com
- Password: password123
- Enrollment: BEE001

**Teacher:**
- Email: teacher@example.com
- Password: password123

### Test Attendance

1. Log in as student
2. Allow location access
3. Check if location shows correct distance
4. Wait for attendance to be marked

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Or via GitHub:**
1. Push to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables
5. Deploy

### Deploy Android App

```bash
# Add Android platform
npm run cap:add:android

# Build and sync
npm run build
npm run cap:sync

# Open Android Studio
npm run cap:open:android

# Build APK
# In Android Studio: Build > Build Bundle(s)/APK(s) > Build APK(s)
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
├── supabase/           # Supabase config
├── App.jsx             # Main app
└── main.jsx            # Entry point
```

## Common Issues

### Port 3000 already in use
```bash
npm run dev -- --port 3001
```

### Module not found errors
```bash
rm node_modules
npm install
```

### Supabase connection fails
- Check URL and key
- Verify internet connection
- Check Supabase status page

### Location not working
- Enable location in browser settings
- Use HTTPS (required)
- Check if location permission is granted
- Try incognito mode

### Build fails
```bash
npm cache clean --force
rm -rf node_modules
npm install
npm run build
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint

# Capacitor commands
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
```

## Database Operations

### Reset Database

1. Go to Supabase > Project Settings
2. Database > Reset
3. Rerun schema.sql

### Backup Data

Supabase automatically backs up daily. Access backups in:
Project > Backups

## Security Checklist

- [ ] Environment variables not committed to Git
- [ ] Supabase RLS policies enabled
- [ ] Using HTTPS in production
- [ ] Hiding admin passwords
- [ ] Regular security updates
- [ ] API rate limiting configured

## Performance Tips

- Use database indexes (included in schema)
- Lazy load heavy components
- Optimize images
- Use production build for testing
- Monitor with Vercel Analytics

## Support & Resources

- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Capacitor Docs](https://capacitorjs.com/docs)

## Next Steps

1. Customize college coordinates
2. Add more subjects to database
3. Create student and teacher accounts
4. Test GPS functionality
5. Deploy to Vercel
6. Build Android APK

## Additional Configuration

### Change College Location

Edit `.env.local`:
```env
VITE_COLLEGE_LATITUDE=your_latitude
VITE_COLLEGE_LONGITUDE=your_longitude
```

### Adjust Radius & Duration

```env
VITE_ATTENDANCE_RADIUS_METERS=200
VITE_MINIMUM_ATTENDANCE_MINUTES=30
```

### Add More Subjects

Use Supabase UI or insert via SQL:
```sql
INSERT INTO subjects (name, code, teacher_id, department)
VALUES ('Subject Name', 'CS101', 'teacher_id', 'Computer Science');
```

## Version Info

- React: 18.2.0
- Vite: 5.0.0
- Supabase: 2.38.0
- Tailwind: 3.3.0
- Capacitor: 6.0.0
