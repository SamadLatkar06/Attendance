import { PieChart, BarChart, LineChart } from 'lucide-react'
import Card from './Card'

const AttendanceStats = ({ attendance = [] }) => {
  const total = attendance.length
  const marked = attendance.filter((a) => a.is_marked).length
  const percentage = total > 0 ? Math.round((marked / total) * 100) : 0
  const avgDuration = total > 0
    ? Math.round(attendance.reduce((sum, a) => sum + (a.duration_minutes || 0), 0) / total)
    : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card>
        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
          <PieChart size={16} />
          Total
        </p>
        <p className="text-2xl font-bold text-primary-500">{total}</p>
      </Card>
      <Card>
        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
          <BarChart size={16} />
          Marked
        </p>
        <p className="text-2xl font-bold text-green-500">{marked}</p>
      </Card>
      <Card>
        <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
          <LineChart size={16} />
          Percentage
        </p>
        <p className="text-2xl font-bold text-primary-500">{percentage}%</p>
      </Card>
      <Card>
        <p className="text-gray-400 text-sm mb-2">Avg Duration</p>
        <p className="text-2xl font-bold text-primary-500">{avgDuration}m</p>
      </Card>
    </div>
  )
}

export default AttendanceStats
