import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { supabase } from './supabase/client'
import { useAuth } from './hooks/useAuth'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'))
const AttendanceHistory = lazy(() => import('./pages/AttendanceHistory'))
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'))

// Components
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSkeleton from './components/LoadingSkeleton'

function App() {
  const { user, loading } = useAuth()
  const [userRole, setUserRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(false)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole(null)
        return
      }

      setRoleLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      setUserRole(!error && data?.role ? data.role : null)
      setRoleLoading(false)
    }

    fetchUserRole()
  }, [user])

  const getDashboardElement = () => {
    if (roleLoading) {
      return <LoadingSkeleton />
    }

    if (userRole === 'student') {
      return <StudentDashboard />
    }

    if (userRole === 'teacher') {
      return <TeacherDashboard />
    }

    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md text-center text-gray-300">
          <h2 className="text-xl font-semibold mb-2 text-white">Profile setup pending</h2>
          <p>We could not determine your account role yet. Please sign out and sign in again.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {getDashboardElement()}
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance-history"
            element={
              <ProtectedRoute>
                <AttendanceHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
