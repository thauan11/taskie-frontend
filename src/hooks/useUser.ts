'use client'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  roleName: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN as string}/auth/auth-token`
        const response = await api.fetch(endpoint)

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const responseData = await response.json()
        setUser(responseData.user)
      } catch (error) {
        setError(error as Error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return { user, loading, error }
}
