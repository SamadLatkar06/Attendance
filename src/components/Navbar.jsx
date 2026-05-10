import { useNavigate } from 'react-router-dom'
import { LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const Navbar = ({ title, showMenu = true }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-dark-800 border-b border-dark-700 px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-500">GeoAttend</h1>
        {title && <h2 className="hidden sm:block text-lg font-semibold">{title}</h2>}
        {showMenu && (
          <div className="hidden sm:flex gap-4 items-center">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <User size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-900/30 text-red-500 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
