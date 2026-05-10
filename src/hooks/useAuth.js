import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData) => {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // Insert user data
    const { error: dbError } = await supabase
      .from('users')
      .insert([{ id: data.user.id, email, ...userData }])

    if (dbError) throw dbError

    return data
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { user, loading, signUp, login, logout }
}
