'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

interface Props {
  token: string
}

export function FormResetPassword({ token }: Props) {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setError] = useState('')
  // data
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const router = useRouter()

  const setErrorMessage = (message: string) => {
    setLoading(false)
    setError('')
    setTimeout(() => setError(message), 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== passwordConfirm) {
      return setErrorMessage('Passwords do not match')
    }

    if (!password) {
      return setErrorMessage('Please enter your new password')
    }

    if (!passwordConfirm) {
      return setErrorMessage('Please confirm your new password')
    }

    setLoading(true)

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN as string}/auth/reset-password`
      const response = await api.fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({ password }),
      })

      const responseData = await response.json()
      if (!response.ok) {
        console.error('Login error:', responseData.error)
        return setErrorMessage(responseData.error)
      }

      router.push('/')
    } catch (error) {
      throw new Error(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-3">
      <div className="">
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="off"
          placeholder="New password"
          className="font-inter w-full h-full py-2 pl-9 pr-7 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="">
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="off"
          placeholder="Confirm new password"
          className="font-inter w-full h-full py-2 pl-9 pr-7 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          disabled={loading}
        />
      </div>

      <button type="submit" onClick={handleSubmit}>
        Reset password
      </button>
    </form>
  )
}
