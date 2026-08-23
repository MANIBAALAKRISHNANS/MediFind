import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'

import AuthLayout      from '../../components/AuthLayout.jsx'
import Input           from '../../components/ui/Input.jsx'
import PasswordInput   from '../../components/ui/PasswordInput.jsx'
import Button          from '../../components/ui/Button.jsx'
import useAuthStore    from '../../store/authStore.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate   = useNavigate()
  const login      = useAuthStore((s) => s.login)
  const isLoading  = useAuthStore((s) => s.isLoading)

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [errors,   setErrors]   = useState({})

  const emailRef = useRef(null)
  useEffect(() => { emailRef.current?.focus() }, [])

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address.'
    if (!password)                    e.password = 'Password is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return

    try {
      await login(email.trim().toLowerCase(), password)
      toast.success('Welcome back!')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.message ?? 'Sign in failed. Please try again.')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit(e)
  }

  return (
    <AuthLayout subtitle="Welcome back">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Email */}
        <Input
          ref={emailRef}
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail size={16} strokeWidth={2} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          error={errors.email}
          aria-label="Email address"
        />

        {/* Password */}
        <div className="flex flex-col gap-1">
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            error={errors.password}
            aria-label="Password"
          />
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-ios-blue font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          className="w-full mt-1"
        >
          Sign In
        </Button>
      </form>

      {/* Footer link */}
      <p className="mt-5 text-center text-sm text-ios-gray">
        New to MediFind?{' '}
        <Link to="/signup" className="text-ios-blue font-semibold hover:underline">
          Create account
        </Link>
      </p>
    </AuthLayout>
  )
}
