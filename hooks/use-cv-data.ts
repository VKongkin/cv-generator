"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth/auth-provider'
import { CVData, defaultCVData } from '@/types/cv-types'

export function useCVData() {
  const { user } = useAuth()
  const [cvData, setCvData] = useState<CVData>(defaultCVData)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load CV data from database
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadCVData()
  }, [user])

  const loadCVData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('cv_data')
        .select('cv_data')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      if (data?.cv_data) {
        setCvData(data.cv_data as CVData)
      } else {
        // Initialize with default data for new users
        setCvData(defaultCVData)
      }
    } catch (err: any) {
      console.error('Error loading CV data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveCVData = async (newCvData: CVData) => {
    if (!user) return

    try {
      setSaving(true)
      setError(null)

      const { error } = await supabase
        .from('cv_data')
        .upsert({
          user_id: user.id,
          cv_data: newCvData,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setCvData(newCvData)
    } catch (err: any) {
      console.error('Error saving CV data:', err)
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const updateCVData = async (newCvData: CVData) => {
    setCvData(newCvData) // Update local state immediately
    
    // Debounce the save operation
    if (user) {
      try {
        await saveCVData(newCvData)
      } catch (err) {
        // Revert local state on error
        await loadCVData()
      }
    }
  }

  return {
    cvData,
    loading,
    saving,
    error,
    updateCVData,
    saveCVData,
    loadCVData,
  }
}