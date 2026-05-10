import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'
import LoadingSkeleton from './LoadingSkeleton'

const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()

  if (authLoading || profileLoading) {
    return <LoadingSkeleton />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RoleProtectedRoute
