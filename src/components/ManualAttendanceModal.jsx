import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { supabase } from '../supabase/client'
import Input from './Input'
import Button from './Button'
import { useManualAttendance } from '../hooks/useManualAttendance'
import toast from 'react-hot-toast'

const ManualAttendanceModal = ({ subjectId, teacherId, onClose, onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [reason, setReason] = useState('')
  const [searching, setSearching] = useState(false)
  const { markManualAttendance, loading } = useManualAttendance()

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (!query.trim()) {
      setStudents([])
      return
    }

    setSearching(true)
    try {
      const { data } = await supabase
        .from('student_subjects')
        .select('student_id(*)')
        .eq('subject_id', subjectId)

      const enrolledStudents = data?.map((s) => s.student_id) || []
      const filtered = enrolledStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.enrollment_number?.toLowerCase().includes(query.toLowerCase())
      )

      setStudents(filtered)
    } finally {
      setSearching(false)
    }
  }

  const handleMarkAttendance = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student')
      return
    }

    try {
      await markManualAttendance(selectedStudent.id, subjectId, teacherId, reason)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error marking attendance:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-xl max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Mark Manual Attendance</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              type="text"
              label="Search Student"
              placeholder="Name or Enrollment Number"
              value={searchQuery}
              onChange={handleSearch}
              icon={Search}
            />
          </div>

          {students.length > 0 && (
            <div className="bg-dark-700 rounded-lg max-h-48 overflow-y-auto">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => {
                    setSelectedStudent(student)
                    setSearchQuery('')
                    setStudents([])
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-dark-600 transition-colors border-b border-dark-600 last:border-0"
                >
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-400">{student.enrollment_number}</div>
                </button>
              ))}
            </div>
          )}

          {selectedStudent && (
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
              <div className="font-medium">{selectedStudent.name}</div>
              <div className="text-sm text-gray-400">{selectedStudent.enrollment_number}</div>
            </div>
          )}

          <Input
            type="text"
            label="Reason (Optional)"
            placeholder="Medical leave, Late arrival, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary" fullWidth>
              Cancel
            </Button>
            <Button
              onClick={handleMarkAttendance}
              fullWidth
              loading={loading}
              disabled={!selectedStudent}
            >
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManualAttendanceModal
