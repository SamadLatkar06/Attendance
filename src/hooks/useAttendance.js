import { useState, useCallback } from 'react'
import { supabase } from '../supabase/client'
import { calculateDistance } from '../utils/gps'

export const useAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkAttendance = useCallback(async (studentId, userPosition) => {
    setLoading(true)
    setError(null)

    try {
      const collegeLatitude = parseFloat(import.meta.env.VITE_COLLEGE_LATITUDE)
      const collegeLongitude = parseFloat(import.meta.env.VITE_COLLEGE_LONGITUDE)
      const radiusMeters = parseInt(import.meta.env.VITE_ATTENDANCE_RADIUS_METERS || 100)
      const minimumMinutes = parseInt(import.meta.env.VITE_MINIMUM_ATTENDANCE_MINUTES || 45)

      // Calculate distance
      const distance = calculateDistance(
        userPosition.latitude,
        userPosition.longitude,
        collegeLatitude,
        collegeLongitude
      )

      const isInsideRadius = distance <= radiusMeters

      // Get today's attendance
      const today = new Date().toISOString().split('T')[0]
      const { data: existingAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .eq('attendance_date', today)
        .single()

      let attendanceRecord = existingAttendance

      if (!existingAttendance && isInsideRadius) {
        // Create new attendance entry
        const { data, error: insertError } = await supabase
          .from('attendance')
          .insert([{
            student_id: studentId,
            subject_id: userPosition.subject_id || null,
            attendance_date: today,
            entry_time: new Date().toISOString(),
            entry_latitude: userPosition.latitude,
            entry_longitude: userPosition.longitude,
            attendance_type: 'gps',
          }])
          .select()
          .single()

        if (insertError) throw insertError
        attendanceRecord = data
      } else if (existingAttendance) {
        if (isInsideRadius) {
          // Still inside, update exit_time
          const entryTime = new Date(existingAttendance.entry_time)
          const currentTime = new Date()
          const durationMinutes = Math.floor((currentTime - entryTime) / 60000)
          const isMarked = durationMinutes >= minimumMinutes

          const { data, error: updateError } = await supabase
            .from('attendance')
            .update({
              exit_time: currentTime.toISOString(),
              duration_minutes: durationMinutes,
              is_marked: isMarked,
            })
            .eq('id', existingAttendance.id)
            .select()
            .single()

          if (updateError) throw updateError
          attendanceRecord = data
        } else {
          // User left the radius
          const entryTime = new Date(existingAttendance.entry_time)
          const currentTime = new Date()
          const durationMinutes = Math.floor((currentTime - entryTime) / 60000)
          const isMarked = durationMinutes >= minimumMinutes

          const { data, error: updateError } = await supabase
            .from('attendance')
            .update({
              exit_time: currentTime.toISOString(),
              duration_minutes: durationMinutes,
              is_marked: isMarked,
            })
            .eq('id', existingAttendance.id)
            .select()
            .single()

          if (updateError) throw updateError
          attendanceRecord = data
        }
      }

      setAttendanceData({
        ...attendanceRecord,
        distance,
        isInsideRadius,
        radiusMeters,
        minimumMinutes,
      })

      return attendanceRecord
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAttendanceHistory = useCallback(async (studentId, limit = 30) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('attendance_date', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    attendanceData,
    loading,
    error,
    checkAttendance,
    fetchAttendanceHistory,
  }
}
