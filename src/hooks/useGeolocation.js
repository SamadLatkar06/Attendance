import { useState, useEffect, useRef } from 'react'
import { Geolocation } from '@capacitor/geolocation'

export const useGeolocation = () => {
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const watchIdRef = useRef(null)

  useEffect(() => {
    const getCurrentPosition = async () => {
      try {
        const coordinates = await Geolocation.getCurrentPosition()
        setPosition(coordinates.coords)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    getCurrentPosition()

    // Watch position changes
    const watchPosition = async () => {
      watchIdRef.current = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position) => {
          setPosition(position.coords)
        },
        (error) => {
          setError(error.message)
        }
      )
    }

    watchPosition()

    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch({ id: watchIdRef.current })
      }
    }
  }, [])

  return { position, loading, error }
}
