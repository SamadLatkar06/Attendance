import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import toast from 'react-hot-toast'

export const useSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSubjects = async (teacherId) => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('subjects')
        .select('*')
        .eq('teacher_id', teacherId)

      if (fetchError) throw fetchError
      setSubjects(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createSubject = async (subjectData) => {
    try {
      const { data, error: createError } = await supabase
        .from('subjects')
        .insert([subjectData])
        .select()
        .single()

      if (createError) throw createError
      setSubjects([...subjects, data])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { subjects, loading, error, fetchSubjects, createSubject }
}
