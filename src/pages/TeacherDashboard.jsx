import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase/client'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { Plus, Users, FileText, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [sessions, setSessions] = useState([])
  const [showNewSession, setShowNewSession] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionForm, setSessionForm] = useState({
    subject_id: '',
    session_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      // Fetch user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      setUserData(userData)

      // Fetch subjects
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .eq('teacher_id', user.id)

      setSubjects(subjectsData || [])

      // Fetch sessions
      const { data: sessionsData } = await supabase
        .from('attendance_sessions')
        .select('*')
        .eq('teacher_id', user.id)
        .order('session_date', { ascending: false })

      setSessions(sessionsData || [])
    }

    fetchData()
  }, [user])

  const handleCreateSession = async (e) => {
    e.preventDefault()
    if (!sessionForm.subject_id) {
      toast.error('Please select a subject')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('attendance_sessions').insert([{
        ...sessionForm,
        teacher_id: user.id,
        college_latitude: parseFloat(import.meta.env.VITE_COLLEGE_LATITUDE),
        college_longitude: parseFloat(import.meta.env.VITE_COLLEGE_LONGITUDE),
        radius_meters: parseInt(import.meta.env.VITE_ATTENDANCE_RADIUS_METERS || 100),
        minimum_duration_minutes: parseInt(import.meta.env.VITE_MINIMUM_ATTENDANCE_MINUTES || 45),
      }])

      if (error) throw error
      toast.success('Attendance session created')
      setShowNewSession(false)
      setSessionForm({
        subject_id: '',
        session_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '10:00',
      })
      // Refresh sessions
      const { data: sessionsData } = await supabase
        .from('attendance_sessions')
        .select('*')
        .eq('teacher_id', user.id)
        .order('session_date', { ascending: false })
      setSessions(sessionsData || [])
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 pb-24 sm:pb-8">
      <Navbar title="Teacher Dashboard" />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <Card>
          <h2 className="text-2xl font-bold mb-2">Welcome, {userData?.name || 'Teacher'}!</h2>
          <p className="text-gray-400">{userData?.department || 'Your department'}</p>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-gray-400 text-sm mb-2">Subjects</p>
            <p className="text-2xl font-bold text-primary-500">{subjects.length}</p>
          </Card>
          <Card>
            <p className="text-gray-400 text-sm mb-2">Sessions</p>
            <p className="text-2xl font-bold text-primary-500">{sessions.length}</p>
          </Card>
          <Card>
            <p className="text-gray-400 text-sm mb-2">Active</p>
            <p className="text-2xl font-bold text-green-500">
              {sessions.filter((s) => s.status === 'active').length}
            </p>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="primary" fullWidth onClick={() => setShowNewSession(!showNewSession)}>
            <Plus size={18} />
            New Session
          </Button>
          <Button variant="secondary" fullWidth>
            <FileText size={18} />
            Reports
          </Button>
        </div>

        {/* New Session Form */}
        {showNewSession && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Create New Session</h3>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
                <select
                  value={sessionForm.subject_id}
                  onChange={(e) => setSessionForm({ ...sessionForm, subject_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>
              <Input
                type="date"
                label="Date"
                value={sessionForm.session_date}
                onChange={(e) => setSessionForm({ ...sessionForm, session_date: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  label="Start Time"
                  value={sessionForm.start_time}
                  onChange={(e) => setSessionForm({ ...sessionForm, start_time: e.target.value })}
                />
                <Input
                  type="time"
                  label="End Time"
                  value={sessionForm.end_time}
                  onChange={(e) => setSessionForm({ ...sessionForm, end_time: e.target.value })}
                />
              </div>
              <Button type="submit" fullWidth loading={loading}>
                Create Session
              </Button>
            </form>
          </Card>
        )}

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <Card key={session.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">{session.session_date}</h4>
                      <p className="text-sm text-gray-400">
                        {session.start_time} - {session.end_time}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                      session.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {session.status}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default TeacherDashboard
