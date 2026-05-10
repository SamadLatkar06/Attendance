import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase/client'
import { useSessionAttendance } from '../hooks/useSessionAttendance'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Card from '../components/Card'
import Button from '../components/Button'
import SessionList from '../components/SessionList'
import ManualAttendanceModal from '../components/ManualAttendanceModal'
import AttendanceStats from '../components/AttendanceStats'
import Alert from '../components/Alert'
import { Users, Play, Pause, MoreVertical } from 'lucide-react'
import { formatDate, formatTime } from '../utils/dateTime'
import toast from 'react-hot-toast'

const SessionManagementPage = () => {
  const { user } = useAuth()
  const { fetchSessionAttendance, updateSessionStatus } = useSessionAttendance()
  const [activeSession, setActiveSession] = useState(null)
  const [sessionAttendance, setSessionAttendance] = useState([])
  const [showManualModal, setShowManualModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSessionSelect = async (session) => {
    setActiveSession(session)
    setLoading(true)
    try {
      const attendance = await fetchSessionAttendance(session.id)
      setSessionAttendance(attendance || [])
    } catch (error) {
      toast.error('Failed to load session attendance')
    } finally {
      setLoading(false)
    }
  }

  const handleStartSession = async () => {
    if (!activeSession) return
    setLoading(true)
    try {
      await updateSessionStatus(activeSession.id, 'active')
      setActiveSession({ ...activeSession, status: 'active' })
      toast.success('Session started')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEndSession = async () => {
    if (!activeSession) return
    setLoading(true)
    try {
      await updateSessionStatus(activeSession.id, 'completed')
      setActiveSession({ ...activeSession, status: 'completed' })
      toast.success('Session ended')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 pb-24 sm:pb-8">
      <Navbar title="Session Management" />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {!activeSession ? (
          <>
            <Card>
              <p className="text-gray-400 text-center py-4">
                Select a session to view and manage attendance
              </p>
            </Card>
            {user && <SessionList teacherId={user.id} onSessionSelect={handleSessionSelect} />}
          </>
        ) : (
          <>
            {/* Session Header */}
            <Card className="border-l-4 border-l-primary-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{formatDate(activeSession.session_date)}</h2>
                  <p className="text-gray-400">
                    {formatTime(activeSession.start_time)} - {formatTime(activeSession.end_time)}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-semibold ${
                  activeSession.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : activeSession.status === 'completed'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {activeSession.status.charAt(0).toUpperCase() + activeSession.status.slice(1)}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-dark-700">
                <Button
                  onClick={() => setActiveSession(null)}
                  variant="ghost"
                  size="sm"
                >
                  ← Back
                </Button>
                {activeSession.status === 'active' ? (
                  <Button
                    onClick={handleEndSession}
                    variant="danger"
                    size="sm"
                    loading={loading}
                    fullWidth
                  >
                    <Pause size={16} />
                    End Session
                  </Button>
                ) : activeSession.status !== 'completed' ? (
                  <Button
                    onClick={handleStartSession}
                    variant="primary"
                    size="sm"
                    loading={loading}
                    fullWidth
                  >
                    <Play size={16} />
                    Start Session
                  </Button>
                ) : null}
              </div>
            </Card>

            {/* Attendance Stats */}
            <AttendanceStats attendance={sessionAttendance} />

            {/* Manual Attendance */}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowManualModal(true)}
                variant="secondary"
                fullWidth
              >
                <Users size={18} />
                Mark Manual Attendance
              </Button>
            </div>

            {/* Attendance List */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users size={20} />
                Attendance ({sessionAttendance.length})
              </h3>
              {loading ? (
                <Card>
                  <p className="text-center text-gray-400 py-8">Loading attendance...</p>
                </Card>
              ) : sessionAttendance.length > 0 ? (
                <div className="space-y-2">
                  {sessionAttendance.map((record) => (
                    <Card key={record.id} className="text-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Student {record.student_id.substring(0, 8)}</p>
                          <p className="text-gray-400">
                            {record.duration_minutes || 0} minutes • {formatTime(record.entry_time)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${
                          record.is_marked
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {record.is_marked ? 'Marked' : 'Pending'}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert type="info" message="No attendance records yet" />
              )}
            </div>
          </>
        )}
      </div>

      {showManualModal && activeSession && (
        <ManualAttendanceModal
          subjectId={activeSession.subject_id}
          teacherId={user.id}
          onClose={() => setShowManualModal(false)}
          onSuccess={async () => {
            const attendance = await fetchSessionAttendance(activeSession.id)
            setSessionAttendance(attendance || [])
          }}
        />
      )}

      <BottomNav />
    </div>
  )
}

export default SessionManagementPage
