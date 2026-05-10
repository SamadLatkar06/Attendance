import { useState, useCallback } from 'react'
import { supabase } from '../supabase/client'
import toast from 'react-hot-toast'

export const useManualAttendance = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const markManualAttendance = useCallback(async (studentId, subjectId, teacherId, reason = '') => {
    setLoading(true)
    setError(null)

    try {
      const today = new Date().toISOString().split('T')[0]

      // Check if already marked today
      const { data: existingAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .eq('subject_id', subjectId)
        .eq('attendance_date', today)
        .single()

      if (existingAttendance?.is_marked) {
        throw new Error('Attendance already marked for today')
      }

      // Log manual attendance
      const { error: logError } = await supabase.from('manual_attendance_logs').insert([{
        student_id: studentId,
        subject_id: subjectId,
        teacher_id: teacherId,
        marked_date: today,
        reason,
      }])

      if (logError) throw logError

      // Create or update attendance
      if (existingAttendance) {
        const { error: updateError } = await supabase
          .from('attendance')
          .update({
            is_marked: true,
            attendance_type: 'manual',
            exit_time: new Date().toISOString(),
          })
          .eq('id', existingAttendance.id)

        if (updateError) throw updateError
      } else {
        const { error: createError } = await supabase.from('attendance').insert([{
          student_id: studentId,
          subject_id: subjectId,
          attendance_date: today,
          entry_time: new Date().toISOString(),
          exit_time: new Date().toISOString(),
          is_marked: true,
          attendance_type: 'manual',
          duration_minutes: 0,
        }])

        if (createError) throw createError
      }

      toast.success('Attendance marked successfully')
      return true
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, markManualAttendance }
}
