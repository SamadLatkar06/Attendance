import { useCallback } from 'react'
import { supabase } from '../supabase/client'

export const useReports = () => {
  const generateAttendanceReport = useCallback(async (subjectId, startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, student_id(*)')
        .eq('subject_id', subjectId)
        .gte('attendance_date', startDate)
        .lte('attendance_date', endDate)
        .order('attendance_date')

      if (error) throw error

      // Process data for report
      const report = {
        subjectId,
        startDate,
        endDate,
        totalRecords: data.length,
        markedCount: data.filter((a) => a.is_marked).length,
        records: data,
      }

      return report
    } catch (error) {
      throw error
    }
  }, [])

  const generateStudentReport = useCallback(async (studentId, startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .gte('attendance_date', startDate)
        .lte('attendance_date', endDate)
        .order('attendance_date')

      if (error) throw error

      const report = {
        studentId,
        startDate,
        endDate,
        totalDays: data.length,
        presentDays: data.filter((a) => a.is_marked).length,
        percentage: data.length > 0 ? Math.round((data.filter((a) => a.is_marked).length / data.length) * 100) : 0,
        records: data,
      }

      return report
    } catch (error) {
      throw error
    }
  }, [])

  const exportReportAsCSV = useCallback((reportData, filename = 'attendance_report.csv') => {
    const headers = ['Date', 'Student ID', 'Subject ID', 'Entry Time', 'Exit Time', 'Duration', 'Marked']
    const rows = reportData.records.map((record) => [
      record.attendance_date,
      record.student_id,
      record.subject_id,
      record.entry_time,
      record.exit_time || '',
      record.duration_minutes || 0,
      record.is_marked ? 'Yes' : 'No',
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }, [])

  return { generateAttendanceReport, generateStudentReport, exportReportAsCSV }
}
