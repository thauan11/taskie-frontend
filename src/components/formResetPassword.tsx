'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Confirm } from './icons'
import Loading from './loading'

interface Props {
  token: string
}

export function FormResetPassword({ token }: Props) {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setError] = useState('')
  const [successMessage, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // data
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const router = useRouter()

  const setErrorMessage = (message: string) => {
    setError('')
    setTimeout(() => setError(message), 1)
  }

  const setSuccessMessage = (message: string) => {
    setSuccess('')
    setTimeout(() => setSuccess(message), 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password === '') {
      return setErrorMessage('Insert new password');
    }

    if (passwordConfirm === '') {
      return setErrorMessage('Confirm new password');
    }

    if (password !== passwordConfirm) {
      return setErrorMessage('Passwords do not match');
    }

    setLoading(true);

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN as string}/auth/reset-password/${token}`
      const response = await api.fetch(endpoint, {
        method: 'PATCH',
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        if (error.startsWith('Token has expired')) {
          setErrorMessage('Password change time has expired. You will be redirected to login page in 4s');
          setTimeout(() => setError('Password change time has expired. You will be redirected to login page in 3s'), 1000);
          setTimeout(() => setError('Password change time has expired. You will be redirected to login page in 2s'), 2000);
          setTimeout(() => setError('Password change time has expired. You will be redirected to login page in 1s'), 3000);
          return setTimeout(() => router.push('/login'), 4000);
        }
      }

      setErrorMessage('');
      setSuccessMessage('Password updated successfully. You will be redirected to login page in 4s');
      setTimeout(() => setSuccess('Password updated successfully. You will be redirected to login page in 3s'), 1000);
      setTimeout(() => setSuccess('Password updated successfully. You will be redirected to login page in 2s'), 2000);
      setTimeout(() => setSuccess('Password updated successfully. You will be redirected to login page in 1s'), 3000);
      setTimeout(() => router.push('/'), 4000);
    } catch (error) {
      setLoading(false);
      throw new Error(error as string);
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN as string}/auth/reset-password-validation/${token}`
        const response = await api.fetch(endpoint);

        if (!response.ok) return router.push('/login')

        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw new Error(error as string);
      }
    }
    validateToken()
  }, [token, router.push])

  return (
    <form className="flex flex-col gap-3">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="New password"
          className="font-inter w-full h-full py-2 pl-9 pr-7 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          tabIndex={0}
        />

        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center flex-row gap-2 opacity-55">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <title>Password</title>
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center flex-row gap-2 opacity-55"
          onClick={() => setShowPassword(!showPassword)}
          disabled={loading}
          tabIndex={-999}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <title>Hide password</title>
              <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <title>View password</title>
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fillRule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm new password"
          className="font-inter w-full h-full py-2 pl-9 pr-7 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          disabled={loading}
          tabIndex={0}
        />

        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center flex-row gap-2 opacity-55">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <title>Password</title>
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center flex-row gap-2 opacity-55"
          onClick={() => setShowPassword(!showPassword)}
          disabled={loading}
          tabIndex={-999}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <title>Hide password</title>
              <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <title>View password</title>
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fillRule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="flex flex-row justify-center gap-1 text-red-500 fill-red-500 text-xs my-1 animate-shake">
          <div className="relative pl-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 absolute left-0 top-0"
            >
              <title>Warning</title>
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>

            <p className="pt-[0.15rem]">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex flex-row justify-center gap-1 text-green-500 fill-green-500 text-xs my-1 animate-shake">
          <div className="relative pl-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 absolute left-0 top-0"
            >
              <title>Warning</title>
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>

            <p className="pt-[0.15rem]">{successMessage}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="mt-4 py-1 rounded-lg bg-main text-zinc-800 hover:bg-white hover:text-zinc-800 transition-all font-semibold text-sm disabled:bg-white grid place-items-center"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? <Loading height="h-5" /> : <Confirm size='mini' />}
      </button>
    </form>
  )
}
