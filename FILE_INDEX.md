# GeoAttend - File Index & Descriptions

## Quick Navigation

### 📄 Documentation
- [README.md](README.md) - Main project documentation
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation & setup instructions
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Web deployment guide
- [CAPACITOR_SETUP.md](CAPACITOR_SETUP.md) - Android app setup
- [API_INTEGRATION.md](API_INTEGRATION.md) - Supabase API guide
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues & solutions
- [.env.guide](.env.guide) - Environment variables guide

---

## 📦 Configuration Files

### Core Configuration
| File | Purpose | Key Settings |
|------|---------|---------------|
| `package.json` | Dependencies & scripts | npm packages, dev commands |
| `vite.config.js` | Vite build config | Build output, dev server |
| `tailwind.config.js` | Tailwind CSS | Theme, colors, extensions |
| `postcss.config.js` | PostCSS plugins | Tailwind, autoprefixer |
| `capacitor.config.json` | Capacitor config | App ID, name, plugins |
| `index.html` | HTML entry | Meta tags, root div |
| `.env.example` | Template | Variable names only |
| `.gitignore` | Git rules | Excluded files/folders |

---

## 🎨 Components (`src/components/`)

### Layout & Navigation
| Component | Purpose | Props |
|-----------|---------|-------|
| `Navbar.jsx` | Top navigation bar | title, showMenu |
| `BottomNav.jsx` | Mobile bottom nav | (auto from routing) |
| `Footer.jsx` | App footer | none |
| `Card.jsx` | Card container | children, className |

### Forms & Input
| Component | Purpose | Props |
|-----------|---------|-------|
| `Input.jsx` | Text input field | type, label, error, icon |
| `Button.jsx` | Reusable button | variant, size, loading |
| `PasswordVerificationModal.jsx` | Password modal | onVerify, onCancel, loading |

### Attendance Related
| Component | Purpose | Props |
|-----------|---------|-------|
| `AttendanceCard.jsx` | Single attendance record | attendance, showDetails |
| `AttendanceStats.jsx` | Stats dashboard | attendance |
| `ManualAttendanceModal.jsx` | Mark manual attendance | subjectId, teacherId, onClose |
| `SessionList.jsx` | Teacher sessions list | teacherId, onSessionSelect |

### Alerts & Feedback
| Component | Purpose | Props |
|-----------|---------|-------|
| `Alert.jsx` | Info/Warning/Error alert | type, title, message |
| `ErrorAlert.jsx` | Error-specific alert | title, message, onDismiss |
| `LoadingSkeleton.jsx` | Loading state | none |

### Status & Styling
| Component | Purpose | Props |
|-----------|---------|-------|
| `Badge.jsx` | Status badge | children, variant |

### Route Protection
| Component | Purpose | Props |
|-----------|---------|-------|
| `ProtectedRoute.jsx` | Auth guard | children |
| `RoleProtectedRoute.jsx` | Role guard | children, requiredRole |

---

## 📄 Pages (`src/pages/`)

### Authentication
| Page | Route | Purpose | Users |
|------|-------|---------|-------|
| `LoginPage.jsx` | `/login` | User login | All |
| `SignupPage.jsx` | `/signup` | User registration | All |

### Student Pages
| Page | Route | Purpose | Users |
|------|-------|---------|-------|
| `StudentDashboard.jsx` | `/dashboard` | Main student view | Students |
| `AttendanceHistory.jsx` | `/attendance-history` | Historical records | Students |
| `ProfileSettings.jsx` | `/profile` | Profile management | All |

### Teacher Pages
| Page | Route | Purpose | Users |
|------|-------|---------|-------|
| `TeacherDashboard.jsx` | `/dashboard` | Main teacher view | Teachers |
| `SessionManagementPage.jsx` | `/sessions` | Session management | Teachers |
| `ReportsPage.jsx` | `/reports` | Generate reports | Teachers |

---

## 🎣 Custom Hooks (`src/hooks/`)

### Authentication
```javascript
import { useAuth } from '../hooks/useAuth'
// Returns: { user, loading, signUp, login, logout }
```

### Location Tracking
```javascript
import { useGeolocation } from '../hooks/useGeolocation'
// Returns: { position, loading, error }
```

### Attendance Management
```javascript
import { useAttendance } from '../hooks/useAttendance'
// Returns: { attendanceData, loading, error, checkAttendance, fetchAttendanceHistory }

import { useManualAttendance } from '../hooks/useManualAttendance'
// Returns: { loading, error, markManualAttendance }

import { useSessionAttendance } from '../hooks/useSessionAttendance'
// Returns: { loading, error, attendanceList, fetchSessionAttendance, updateSessionStatus }
```

### Data Management
```javascript
import { useSubjects } from '../hooks/useSubjects'
// Returns: { subjects, loading, error, fetchSubjects, createSubject }

import { useUserProfile } from '../hooks/useUserProfile'
// Returns: { profile, loading, error, updateProfile }

import { useReports } from '../hooks/useReports'
// Returns: { generateAttendanceReport, generateStudentReport, exportReportAsCSV }
```

---

## 🛠️ Utility Functions (`src/utils/`)

### GPS Utilities (`gps.js`)
```javascript
calculateDistance(lat1, lon1, lat2, lon2)  // Haversine formula
formatDistance(meters)                      // Format for display
isInsideCollege(...)                       // Check radius
```

### Date/Time Utilities (`dateTime.js`)
```javascript
formatDateTime(date)                        // "May 10, 2024 14:30"
formatDate(date)                           // "May 10, 2024"
formatTime(date)                           // "14:30"
formatRelativeTime(date)                   // "2 hours ago"
getDurationMinutes(start, end)             // Integer minutes
getDateRange(days)                         // Date range object
```

### Validation Utilities (`validation.js`)
```javascript
validateEmail(email)                       // Boolean
validatePassword(password)                 // Boolean (min 6 chars)
validateEnrollmentNumber(number)           // Boolean
validateName(name)                         // Boolean
```

---

## 🗄️ Supabase Integration (`src/supabase/`)

### Files
| File | Purpose |
|------|----------|
| `client.js` | Supabase client initialization |
| `schema.sql` | Complete database schema |

### Database Tables

#### users
```sql
id (UUID) | email | name | role | enrollment_number | department | phone | profile_image_url
```

#### subjects
```sql
id | name | code | teacher_id | department | semester | credits
```

#### student_subjects
```sql
id | student_id | subject_id | enrolled_at
```

#### attendance_sessions
```sql
id | subject_id | teacher_id | session_date | start_time | end_time | status | college_latitude | college_longitude | radius_meters | minimum_duration_minutes
```

#### attendance
```sql
id | student_id | subject_id | session_id | attendance_date | entry_time | exit_time | duration_minutes | entry_latitude | entry_longitude | is_marked | attendance_type
```

#### manual_attendance_logs
```sql
id | student_id | subject_id | teacher_id | marked_date | reason
```

#### location_tracking
```sql
id | user_id | latitude | longitude | accuracy | tracked_at
```

---

## 🎯 Entry Points

### Application Entry
1. `index.html` - HTML entry point
2. `src/main.jsx` - React DOM mount
3. `src/App.jsx` - Root React component

### Routing
```
/              → Dashboard (role-based redirect)
/login         → LoginPage
/signup        → SignupPage
/dashboard     → StudentDashboard or TeacherDashboard
/attendance-history → AttendanceHistory (students)
/sessions      → SessionManagementPage (teachers)
/reports       → ReportsPage (teachers)
/profile       → ProfileSettings (all)
```

---

## 📊 Data Flow

### Student Attendance Flow
```
StudentDashboard
  ├─ useGeolocation() → Get GPS
  ├─ useAttendance() → Check eligibility
  ├─ Supabase → Save/Update
  └─ Display Status
```

### Teacher Session Flow
```
TeacherDashboard
  ├─ useSubjects() → Load subjects
  ├─ Create Session → Supabase
  ├─ SessionManagementPage
  ├─ useSessionAttendance() → Load records
  ├─ Manual marking → Supabase
  └─ ReportsPage → Generate reports
```

---

## 🔄 Environment Variables

### Required
```env
VITE_SUPABASE_URL          # Supabase project URL
VITE_SUPABASE_ANON_KEY     # Supabase anonymous key
VITE_COLLEGE_LATITUDE      # College GPS latitude
VITE_COLLEGE_LONGITUDE     # College GPS longitude
VITE_ATTENDANCE_RADIUS_METERS     # GPS radius in meters
VITE_MINIMUM_ATTENDANCE_MINUTES   # Minimum duration in minutes
```

---

## 📦 Dependencies

### Core
- react@18.2.0
- react-dom@18.2.0
- react-router-dom@6.20.0

### Backend
- @supabase/supabase-js@2.38.0

### Mobile
- @capacitor/core@6.0.0
- @capacitor/geolocation@6.0.0
- @capacitor/app@6.0.0

### UI & Styling
- tailwindcss@3.3.0
- lucide-react@0.294.0
- react-hot-toast@2.4.0

### Utilities
- axios@1.6.0
- date-fns@2.30.0

---

## 🚀 Build & Deploy

### Local Development
```bash
npm install      # Install dependencies
npm run dev      # Start dev server
```

### Production Build
```bash
npm run build    # Build for production
npm run preview  # Preview build
```

### Vercel Deployment
```bash
vercel deploy    # Deploy to Vercel
```

### Android Build
```bash
npm run cap:add:android    # Add Android platform
npm run cap:sync           # Sync web assets
npm run cap:open:android   # Open in Android Studio
```

---

## 🔒 Security Features

### RLS Policies
- Users can view own profile
- Users can update own profile
- Students can view own attendance
- Teachers can view subject attendance

### Authentication
- Supabase Auth
- Password hashing
- Session tokens
- Environment variables

---

## 📈 Performance

### Optimizations
- Vite for fast builds
- Lazy component loading
- Database indexes
- CSS minification
- Image optimization
- GPS polling every 30 seconds

---

## 🐛 Debugging

### Browser Console
- `console.log(import.meta.env.VITE_*)`
- Check for API errors
- Review network requests

### Supabase
- Check auth status
- Review RLS policies
- Monitor database logs

### Mobile
- Android logcat
- Xcode console
- React DevTools

---

## 📝 Code Examples

### Using Custom Hook
```javascript
const StudentDashboard = () => {
  const { user } = useAuth()
  const { position } = useGeolocation()
  const { checkAttendance } = useAttendance()
  
  useEffect(() => {
    if (position) {
      checkAttendance(user.id, position)
    }
  }, [position])
}
```

### Creating Protected Route
```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
```

### Using Supabase
```javascript
const { data, error } = await supabase
  .from('attendance')
  .select('*')
  .eq('student_id', userId)
  .single()
```

---

## 🎓 Learning Path

1. **Start Here**: README.md
2. **Setup**: SETUP_GUIDE.md
3. **Understand**: PROJECT_SUMMARY.md
4. **Deploy**: VERCEL_DEPLOYMENT.md
5. **Advanced**: API_INTEGRATION.md
6. **Troubleshoot**: TROUBLESHOOTING.md
7. **Android**: CAPACITOR_SETUP.md

---

## 🤝 Contributing

See README.md for contribution guidelines

---

## 📞 Support

For issues:
1. Check TROUBLESHOOTING.md
2. Review GitHub Issues
3. Contact: samadlatkar86@gmail.com

---

**Last Updated**: May 10, 2026
