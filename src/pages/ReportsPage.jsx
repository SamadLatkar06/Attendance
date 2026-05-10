import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase/client'
import { useReports } from '../hooks/useReports'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import AttendanceStats from '../components/AttendanceStats'
import Alert from '../components/Alert'
import { BarChart3, Download, Calendar } from 'lucide-react'
import { formatDate } from '../utils/dateTime'
import toast from 'react-hot-toast'

const ReportsPage = () => {
  const { user } = useAuth()
  const { generateAttendanceReport, exportReportAsCSV } = useReports()
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [filters, setFilters] = useState({
    subjectId: '',
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user) return
      const { data } = await supabase
        .from('subjects')
        .select('*')
        .eq('teacher_id', user.id)
      setSubjects(data || [])
    }
    fetchSubjects()
  }, [user])

  const handleGenerateReport = async () => {
    if (!filters.subjectId) {
      toast.error('Please select a subject')
      return
    }

    setLoading(true)
    try {
      const report = await generateAttendanceReport(
        filters.subjectId,
        filters.startDate,
        filters.endDate
      )
      setReportData(report)
      toast.success('Report generated successfully')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!reportData) {
      toast.error('Generate a report first')
      return
    }
    exportReportAsCSV(reportData, `attendance-report-${new Date().toISOString().split('T')[0]}.csv`)
    toast.success('Report exported as CSV')
  }

  return (
    <div className="min-h-screen bg-dark-900 pb-24 sm:pb-8">
      <Navbar title="Attendance Reports" />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Filter Section */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Generate Report
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
              <select
                value={filters.subjectId}
                onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                icon={Calendar}
              />
              <Input
                type="date"
                label="End Date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                icon={Calendar}
              />
            </div>

            <Button onClick={handleGenerateReport} fullWidth loading={loading}>
              <BarChart3 size={18} />
              Generate Report
            </Button>
          </div>
        </Card>

        {/* Report Results */}
        {reportData && (
          <>
            <Alert
              type="success"
              title="Report Generated"
              message={`Report for ${reportData.startDate} to ${reportData.endDate} with ${reportData.totalRecords} records`}
            />

            <AttendanceStats attendance={reportData.records} />

            <Button onClick={handleExport} fullWidth variant="secondary">
              <Download size={18} />
              Export as CSV
            </Button>

            {/* Detailed Records */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Detailed Records</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {reportData.records.map((record, index) => (
                  <Card key={index} className="text-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{formatDate(record.attendance_date)}</p>
                        <p className="text-gray-400">
                          {record.duration_minutes || 0} minutes
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        record.is_marked
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {record.is_marked ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default ReportsPage
