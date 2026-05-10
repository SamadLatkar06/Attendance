import { Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import Card from './Card'
import { formatDate, formatTime, getDurationMinutes } from '../utils/dateTime'

const AttendanceCard = ({ attendance, showDetails = false }) => {
  const isMarked = attendance.is_marked
  const durationMinutes = attendance.duration_minutes || 0

  return (
    <Card className="border-l-4" style={{ borderLeftColor: isMarked ? '#10b981' : '#ef4444' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg mb-1">
            {attendance.subject_id || 'Subject Name'}
          </h3>
          <p className="text-sm text-gray-400">{formatDate(attendance.attendance_date)}</p>
        </div>
        {isMarked ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-500" />
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{formatTime(attendance.entry_time)}</span>
          {attendance.exit_time && <span>- {formatTime(attendance.exit_time)}</span>}
        </div>
        {showDetails && (
          <>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{durationMinutes} minutes</span>
            </div>
            <div className="pt-2 mt-2 border-t border-dark-700">
              <p className="text-xs text-gray-400">
                {isMarked ? '✓ Attendance Marked' : '✗ Attendance Not Marked'}
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

export default AttendanceCard
