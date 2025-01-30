'use client'
import { useState } from 'react'
import Loading from './loading'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export function Form() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [successMessage, setSuccess] = useState('')

  const router = useRouter()

  const firstWordCapitalize = (text: string) => {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
  }

  const clearInputs = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRememberMe(false)
    setErrorMessage('')
  }

  const focusInput = (id: string) => {
    const input = document.getElementById(id) as HTMLInputElement
    input.focus()
  }

  const toggleRegister = () => {
    setIsRegister(!isRegister)
    clearInputs()
    setTimeout(
      () => (isRegister ? focusInput('email') : focusInput('name')),
      100
    )
  }

  const toggleResetPassword = () => {
    setIsResetPassword(!isResetPassword)
    clearInputs()
    setTimeout(() => focusInput('email'), 100)
  }

  const setSuccessMessage = (message: string) => {
    setSuccess('')
    setTimeout(() => setSuccess(message), 1)
  }

  const handleResetPassword = async () => {
    if (email === '') {
      setErrorMessage('Please enter your email')
      return setIsLoading(false)
    }

    const data = {
      email: email.toLocaleLowerCase(),
    }

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN as string}/auth/forgot-password`
      const response = await api.fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (!response.ok) return setErrorMessage(responseData.error)

      setSuccessMessage(
        'Check your email for instructions on how to reset your password.'
      )
      setTimeout(() => setSuccessMessage(''), 4000)
      toggleResetPassword()
    } catch (error) {
      console.error(error)
      setErrorMessage('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    console.log('init login')
    if (email === '' || password === '') {
      setErrorMessage('Please enter your email and password.')
      return setIsLoading(false)
    }

    const data = {
      email: email.toLocaleLowerCase(),
      password,
      rememberMe,
    }

    try {
      console.log('init api request')
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN as string}/auth/login`
      const response = await api.fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        console.error('Login error:', response.status)
        setErrorMessage('Invalid email or password.')
        setIsLoading(false)
      }

      console.log('api request ok')
      console.log(response)
      // router.push('/')
      console.log('redirect completed')
    } catch (error) {
      console.error(error)
      setErrorMessage('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!name) {
      setTimeout(() => {
        setErrorMessage('Name is required.')
      }, 10)
      setIsLoading(false)
      return focusInput('name')
    }

    if (!email) {
      setTimeout(() => {
        setErrorMessage('Email is required.')
      }, 10)
      setIsLoading(false)
      return focusInput('email')
    }

    if (!password) {
      setTimeout(() => {
        setErrorMessage('Password is required.')
      }, 10)
      setIsLoading(false)
      return focusInput('password')
    }

    const data = {
      name: firstWordCapitalize(name),
      email: email.toLocaleLowerCase(),
      password,
    }

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_DOMAIN as string}/auth/register`
      const response = await api.fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log(errorData)
        setErrorMessage(errorData.error)
        return setIsLoading(false)
      }

      handleLogin()
      // setIsRegister(false);
      // clearInputs();
    } catch (error) {
      console.error(error)
      setErrorMessage('An error occurred. Please try again.')
      return setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    if (isRegister) {
      handleRegister()
    } else if (isResetPassword) {
      handleResetPassword()
    } else {
      handleLogin()
    }
  }

  return (
    <form className="flex flex-col gap-3">
      {isRegister && !isResetPassword && (
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="off"
            placeholder="Name"
            className="font-inter w-full h-full py-2 pl-9 pr-7 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isLoading}
          />

          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center flex-row gap-2 opacity-55">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <title>Name</title>
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="relative">
        <input
          // type="text"
          type="email"
          id="email"
          name="email"
          autoComplete="off"
          placeholder="Email"
          className="font-inter w-full h-full py-2 pl-9 pr-7 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center flex-row gap-2 opacity-55">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <title>Email</title>
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
        </div>
      </div>

      {!isResetPassword && (
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Password"
            className="font-inter w-full h-full py-2 pl-9 pr-7 outline-none rounded-lg text-sm bg-white/20 focus:outline-none focus:ring-2 focus:ring-main focus:border-main disabled:opacity-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
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
            disabled={isLoading}
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
      )}

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

      {!isResetPassword && (
        <div className="flex justify-between items-center pt-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="appearance-none w-4 h-4 rounded bg-white bg-opacity-20 cursor-pointer checked:bg-main transition-all"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />

            <label htmlFor="remember" className="text-xs cursor-pointer">
              Remember me (30d)
            </label>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="mt-4 py-1 rounded-lg bg-main text-zinc-800 hover:bg-white hover:text-zinc-800 transition-all font-semibold text-sm disabled:bg-white"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <Loading height="h-5" />
        ) : isRegister ? (
          'Sign up'
        ) : isResetPassword ? (
          'Reset'
        ) : (
          'Sign in'
        )}
      </button>

      {!isResetPassword && (
        <div className="text-xs">
          <button
            type="button"
            className="hover:underline"
            onClick={toggleRegister}
          >
            {isRegister
              ? 'Return to sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      )}

      {!isRegister && (
        <div className="text-xs">
          <button
            type="button"
            className="hover:underline"
            onClick={toggleResetPassword}
          >
            {isResetPassword ? 'Return to sign in' : 'Forgot your password?'}
          </button>
        </div>
      )}
    </form>
  )
}
