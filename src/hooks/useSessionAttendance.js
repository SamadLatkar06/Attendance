import { useState, useCallback } from 'react'
import { supabase } from '../supabase/client'

export const useSessionAttendance = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attendanceList, setAttendanceList] = useState([])

  const fetchSessionAttendance = useCallback(async (sessionId) => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('attendance')
        .select('*')
        .eq('session_id', sessionId)
        .order('entry_time', { ascending: false })

      if (fetchError) throw fetchError
      setAttendanceList(data || [])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSessionStatus = useCallback(async (sessionId, status) => {
    setLoading(true)
    try {
      const { error: updateError } = await supabase
        .from('attendance_sessions')
        .update({ status })
        .eq('id', sessionId)

      if (updateError) throw updateError
      return true
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, attendanceList, fetchSessionAttendance, updateSessionStatus }
}
