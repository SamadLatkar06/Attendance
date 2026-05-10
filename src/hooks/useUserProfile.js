import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { useAuth } from './useAuth'

export const useUserProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError) throw fetchError
        setProfile(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const updateProfile = async (updates) => {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (updateError) throw updateError
      setProfile({ ...profile, ...updates })
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { profile, loading, error, updateProfile }
}
