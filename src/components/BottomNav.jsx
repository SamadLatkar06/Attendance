import { Link, useLocation } from 'react-router-dom'
import { Home, Clock, User, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const BottomNav = () => {
  const location = useLocation()
  const { logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 px-4 py-3 flex justify-around items-center max-w-full sm:hidden">
      <Link
        to="/dashboard"
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/dashboard') ? 'text-primary-500' : 'text-gray-400'
        }`}
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        to="/attendance-history"
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/attendance-history') ? 'text-primary-500' : 'text-gray-400'
        }`}
      >
        <Clock size={24} />
        <span className="text-xs">History</span>
      </Link>
      <Link
        to="/profile"
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive('/profile') ? 'text-primary-500' : 'text-gray-400'
        }`}
      >
        <User size={24} />
        <span className="text-xs">Profile</span>
      </Link>
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 transition-colors text-gray-400 hover:text-red-500"
      >
        <LogOut size={24} />
        <span className="text-xs">Logout</span>
      </button>
    </nav>
  )
}

export default BottomNav
