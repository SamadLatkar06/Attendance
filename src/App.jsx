import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { supabase } from './supabase/client'
import { useAuth } from './hooks/useAuth'

// Pages
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AttendanceHistory from './pages/AttendanceHistory'
import ProfileSettings from './pages/ProfileSettings'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSkeleton from './components/LoadingSkeleton'

function App() {
  const { user, loading } = useAuth()
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!error && data) {
          setUserRole(data.role)
        }
      }
    }

    fetchUserRole()
  }, [user])

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {userRole === 'student' ? <StudentDashboard /> : <TeacherDashboard />}
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
      </Routes>
    </Router>
  )
}

export default App
