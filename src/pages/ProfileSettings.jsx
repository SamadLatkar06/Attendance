import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase/client'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { User, Mail, BookOpen, Briefcase, Save, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const ProfileSettings = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        setUserData(data)
        setFormData(data)
      }
      setLoading(false)
    }

    fetchUserData()
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          phone: formData.phone,
          department: formData.department,
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Profile updated successfully')
      setUserData(formData)
      setIsEditing(false)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Navbar title="Profile" />
        <div className="text-center py-8">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 pb-24 sm:pb-8">
      <Navbar title="Profile Settings" />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userData?.name}</h2>
              <p className="text-gray-400">{userData?.role === 'student' ? 'Student' : 'Teacher'}</p>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <p className="px-4 py-2.5 bg-dark-700 rounded-lg text-gray-300">{userData?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
            </div>

            {isEditing ? (
              <>
                <Input
                  type="text"
                  label="Full Name"
                  name="name"
                  icon={User}
                  value={formData.name}
                  onChange={handleChange}
                />
                <Input
                  type="tel"
                  label="Phone Number"
                  name="phone"
                  icon={User}
                  placeholder="+91 ..."
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  label="Department"
                  name="department"
                  icon={Briefcase}
                  value={formData.department || ''}
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                    <User size={16} />
                    Full Name
                  </label>
                  <p className="px-4 py-2.5 bg-dark-700 rounded-lg text-gray-300">{userData?.name}</p>
                </div>
                {userData?.phone && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Phone Number</label>
                    <p className="px-4 py-2.5 bg-dark-700 rounded-lg text-gray-300">{userData.phone}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                    <Briefcase size={16} />
                    Department
                  </label>
                  <p className="px-4 py-2.5 bg-dark-700 rounded-lg text-gray-300">
                    {userData?.department || 'Not specified'}
                  </p>
                </div>
              </>
            )}

            {userData?.enrollment_number && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
                  <BookOpen size={16} />
                  Enrollment Number
                </label>
                <p className="px-4 py-2.5 bg-dark-700 rounded-lg text-gray-300">{userData.enrollment_number}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Account Information */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Account</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Member since: {new Date(userData?.created_at).toLocaleDateString()}</p>
            <p>Account type: {userData?.role === 'student' ? 'Student' : 'Teacher'}</p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isEditing ? (
            <>
              <Button onClick={handleSave} fullWidth loading={saving} variant="primary">
                <Save size={18} />
                Save Changes
              </Button>
              <Button onClick={() => setIsEditing(false)} fullWidth variant="secondary" disabled={saving}>
                <ArrowLeft size={18} />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} fullWidth variant="primary">
              <User size={18} />
              Edit Profile
            </Button>
          )}
          <Button onClick={handleLogout} fullWidth variant="danger">
            <ArrowLeft size={18} />
            Logout
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default ProfileSettings
