import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { formatDate, formatTime } from '../utils/dateTime'

const SessionList = ({ teacherId, onSessionSelect = null }) => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('active')

  useEffect(() => {
    const fetchSessions = async () => {
      let query = supabase
        .from('attendance_sessions')
        .select('*')
        .eq('teacher_id', teacherId)

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data } = await query.order('session_date', { ascending: false })
      setSessions(data || [])
      setLoading(false)
    }

    fetchSessions()
  }, [teacherId, filter])

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading sessions...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['active', 'completed', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSessionSelect?.(session)}
              className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold mb-1">{formatDate(session.session_date)}</h4>
                  <p className="text-sm text-gray-400">
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  session.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : session.status === 'completed'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {session.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">No sessions found</div>
      )}
    </div>
  )
}

export default SessionList
