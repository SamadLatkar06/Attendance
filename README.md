# GeoAttend - Modern Hybrid Attendance System

A comprehensive GPS-based attendance system built with React, Vite, Supabase, Tailwind CSS, and Capacitor for web and Android apps.

## Features

✅ **GPS-Based Automatic Attendance**
- Automatic attendance marking based on GPS location
- Haversine formula for accurate distance calculation
- Customizable college radius (default: 100m)
- Minimum duration requirement (default: 45 minutes)

✅ **Dual Authentication**
- Student login/signup
- Teacher login/signup
- Role-based access control
- Secure Supabase authentication

✅ **Student Features**
- Real-time location tracking
- Attendance status dashboard
- Attendance history with statistics
- Profile management

✅ **Teacher Features**
- Attendance session management
- Manual attendance marking
- Password verification for manual attendance
- Attendance reports generation
- Live attendance monitoring

✅ **Responsive Design**
- Mobile-first responsive UI
- Bottom navigation for mobile devices
- Dark mode by default
- Modern SaaS-style dashboard

✅ **Capacitor Integration**
- Web app runs inside Android Capacitor WebView
- Native geolocation access
- Automatic permission handling

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Geolocation**: Capacitor Geolocation
- **Deployment**: Vercel (web)
- **Mobile**: Capacitor (Android)

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── services/         # API services
├── utils/            # Utility functions
├── supabase/         # Supabase configuration
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- Vercel account (for deployment)
- Android Studio (for Capacitor)

### 1. Installation

```bash
cd GeoAttend
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Go to SQL Editor and run the schema from `src/supabase/schema.sql`
3. Copy your Supabase URL and Anon Key

### 3. Environment Variables

Create `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_COLLEGE_LATITUDE=your_college_latitude
VITE_COLLEGE_LONGITUDE=your_college_longitude
VITE_ATTENDANCE_RADIUS_METERS=100
VITE_MINIMUM_ATTENDANCE_MINUTES=45
```

### 4. Development

```bash
npm run dev
```

The app will run on `http://localhost:3000`

### 5. Building for Production

```bash
npm run build
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
vercel deploy
```

### Build Android App with Capacitor

```bash
# Add Android platform
npm run cap:add:android

# Sync web app to Android
npm run cap:sync

# Open Android Studio
npm run cap:open:android
```

## Database Schema

### Tables

- **users**: User profiles and authentication
- **subjects**: Course/subject information
- **student_subjects**: Student enrollments
- **attendance_sessions**: Teacher-created attendance sessions
- **attendance**: GPS-based automatic attendance records
- **manual_attendance_logs**: Manual attendance records by teachers
- **location_tracking**: Location history for analytics

## API Endpoints (Supabase)

All data operations are done through Supabase client SDK.

## Security

- Row-Level Security (RLS) policies enabled
- Password hashing by Supabase Auth
- HTTPS enforced
- Environment variables for sensitive data

## Attendance Algorithm

1. Get user's current GPS location
2. Calculate distance from college using Haversine formula
3. If distance ≤ radius:
   - Create/update attendance entry
   - Calculate duration spent
   - If duration ≥ minimum_required_minutes:
     - Mark attendance as TRUE
   - Else:
     - Keep as pending
4. If user leaves radius:
   - Record final duration
   - Finalize attendance status

## Performance Optimizations

- Location updates every 30 seconds
- Optimized database queries with indexes
- Lazy loading for components
- CSS minification via Tailwind
- Vite for fast builds

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Location not updating
- Check browser permission for geolocation
- Ensure HTTPS is used (required for geolocation)
- Check if location services are enabled on device

### Attendance not marking
- Verify college coordinates are correct
- Check radius value is appropriate
- Ensure minimum duration time has passed
- Check database permissions

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

MIT License

## Support

For issues and questions, please create a GitHub issue.
