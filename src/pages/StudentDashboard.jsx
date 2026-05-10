import { useEffect, useState } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { useAttendance } from '../hooks/useAttendance'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase/client'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Card from '../components/Card'
import Button from '../components/Button'
import AttendanceCard from '../components/AttendanceCard'
import { MapPin, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { formatDistance, isInsideCollege } from '../utils/gps'
import { formatTime, formatDate } from '../utils/dateTime'
import toast from 'react-hot-toast'

const StudentDashboard = () => {
  const { user } = useAuth()
  const { position, loading: locationLoading, error: locationError } = useGeolocation()
  const { attendanceData, loading: attendanceLoading, checkAttendance } = useAttendance()
  const [userData, setUserData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [currentSubject, setCurrentSubject] = useState(null)

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
      }
    }

    fetchUserData()
  }, [user])

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      if (!user) return
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', user.id)
        .eq('attendance_date', today)
        .single()

      if (!error && data) {
        setTodayAttendance(data)
      }
    }

    fetchTodayAttendance()
  }, [user])

  useEffect(() => {
    const checkAttendanceStatus = async () => {
      if (!user || !position) return
      try {
        await checkAttendance(user.id, position)
      } catch (error) {
        console.error('Attendance check failed:', error)
      }
    }

    const interval = setInterval(checkAttendanceStatus, 30000) // Check every 30 seconds
    checkAttendanceStatus() // Check immediately

    return () => clearInterval(interval)
  }, [user, position, checkAttendance])

  const handleManualRefresh = async () => {
    setRefreshing(true)
    try {
      if (position && user) {
        await checkAttendance(user.id, position)
        toast.success('Attendance status updated')
      } else {
        toast.error('Could not get location')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setRefreshing(false)
    }
  }

  const collegeLatitude = parseFloat(import.meta.env.VITE_COLLEGE_LATITUDE)
  const collegeLongitude = parseFloat(import.meta.env.VITE_COLLEGE_LONGITUDE)
  const radiusMeters = parseInt(import.meta.env.VITE_ATTENDANCE_RADIUS_METERS || 100)
  const minimumMinutes = parseInt(import.meta.env.VITE_MINIMUM_ATTENDANCE_MINUTES || 45)

  const distance = position
    ? formatDistance(
        Math.sqrt(
          Math.pow(position.latitude - collegeLatitude, 2) +
            Math.pow(position.longitude - collegeLongitude, 2)
        ) * 111000
      )
    : 'Loading...'

  const isInside = position ? isInsideCollege(position.latitude, position.longitude, collegeLatitude, collegeLongitude, radiusMeters) : false

  return (
    <div className="min-h-screen bg-dark-900 pb-24 sm:pb-8">
      <Navbar title="Student Dashboard" />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <Card>
          <h2 className="text-2xl font-bold mb-2">Welcome, {userData?.name || 'Student'}!</h2>
          <p className="text-gray-400">{userData?.enrollment_number || 'Your enrollment number'}</p>
        </Card>

        {/* Location Status Card */}
        <Card className={`border-l-4 ${isInside ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Location Status</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className={isInside ? 'text-green-500' : 'text-yellow-500'} />
                  <span>{distance} away from college</span>
                </div>
                {locationError && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle size={18} />
                    <span>{locationError}</span>
                  </div>
                )}
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${isInside ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {isInside ? 'Inside Campus' : 'Outside Campus'}
            </div>
          </div>
          {locationLoading && <p className="text-xs text-gray-400">Getting your location...</p>}
        </Card>

        {/* Attendance Status Card */}
        <Card className={`border-l-4 ${todayAttendance?.is_marked ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Today's Attendance</h3>
              {todayAttendance ? (
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{formatTime(todayAttendance.entry_time)}</span>
                    {todayAttendance.exit_time && <span>- {formatTime(todayAttendance.exit_time)}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{todayAttendance.duration_minutes || 0} / {minimumMinutes} minutes</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No attendance recorded yet today</p>
              )}
            </div>
            {todayAttendance?.is_marked ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          <Button onClick={handleManualRefresh} loading={refreshing} size="sm" variant="secondary" fullWidth>
            <RefreshCw size={16} />
            Refresh Status
          </Button>
        </Card>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-gray-400 text-sm mb-2">College Radius</p>
            <p className="text-2xl font-bold text-primary-500">{radiusMeters}m</p>
          </Card>
          <Card>
            <p className="text-gray-400 text-sm mb-2">Required Duration</p>
            <p className="text-2xl font-bold text-primary-500">{minimumMinutes}min</p>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default StudentDashboard
