import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAttendance } from '../hooks/useAttendance'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Card from '../components/Card'
import AttendanceCard from '../components/AttendanceCard'
import { Calendar, TrendingUp } from 'lucide-react'
import { formatDate } from '../utils/dateTime'

const AttendanceHistory = () => {
  const { user } = useAuth()
  const { fetchAttendanceHistory } = useAttendance()
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    marked: 0,
    percentage: 0,
  })

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return
      try {
        const data = await fetchAttendanceHistory(user.id, 90)
        setAttendance(data)

        // Calculate stats
        const total = data.length
        const marked = data.filter((a) => a.is_marked).length
        const percentage = total > 0 ? Math.round((marked / total) * 100) : 0

        setStats({ total, marked, percentage })
      } catch (error) {
        console.error('Failed to load attendance history:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [user, fetchAttendanceHistory])

  return (
    <div className="min-h-screen bg-dark-900 pb-24 sm:pb-8">
      <Navbar title="Attendance History" />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <p className="text-gray-400 text-sm mb-2">Total</p>
            <p className="text-2xl font-bold text-primary-500">{stats.total}</p>
          </Card>
          <Card>
            <p className="text-gray-400 text-sm mb-2">Marked</p>
            <p className="text-2xl font-bold text-green-500">{stats.marked}</p>
          </Card>
          <Card>
            <p className="text-gray-400 text-sm mb-2">Percentage</p>
            <p className="text-2xl font-bold text-primary-500">{stats.percentage}%</p>
          </Card>
        </div>

        {/* Attendance List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading attendance history...</p>
          </div>
        ) : attendance.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar size={20} />
              Last 90 Days
            </h3>
            {attendance.map((record) => (
              <AttendanceCard key={record.id} attendance={record} showDetails />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No attendance records found</p>
            </div>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default AttendanceHistory
