import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { User, Mail } from 'lucide-react'

import AuthLayout    from '../../components/AuthLayout.jsx'
import Input         from '../../components/ui/Input.jsx'
import PasswordInput from '../../components/ui/PasswordInput.jsx'
import Button        from '../../components/ui/Button.jsx'
import useAuthStore  from '../../store/authStore.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Password strength ─────────────────────────────────────────────────────────
function calcStrength(pw) {
  let score = 0
  if (pw.length >= 8)         score++
  if (/[a-zA-Z]/.test(pw))   score++
  if (/[0-9]/.test(pw))      score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  return score // 0-4
}

const STRENGTH_LABEL = { 0: '', 1: 'Weak', 2: 'Medium', 3: 'Strong', 4: 'Strong' }
const STRENGTH_COLOR = {
  0: 'bg-ios-gray3',
  1: 'bg-ios-red',
  2: 'bg-ios-orange',
  3: 'bg-ios-green',
  4: 'bg-ios-green',
}
const LABEL_COLOR = {
  1: 'text-ios-red',
  2: 'text-ios-orange',
  3: 'text-ios-green',
  4: 'text-ios-green',
}

function StrengthMeter({ password }) {
  if (!password) return null
  const score = calcStrength(password)

  return (
    <div className="flex flex-col gap-1.5 mt-1.5">
      {/* 3 bars */}
      <div className="flex gap-1.5">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              score >= bar ? STRENGTH_COLOR[score] : 'bg-ios-gray3'
            }`}
          />
        ))}
      </div>

      {/* Label + hint */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-ios-gray">
          At least 8 chars, 1 letter, 1 number
        </p>
        {score > 0 && (
          <span className={`text-xs font-semibold ${LABEL_COLOR[score]}`}>
            {STRENGTH_LABEL[score]}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const navigate  = useNavigate()
  const signup    = useAuthStore((s) => s.signup)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [agreed,   setAgreed]   = useState(false)
  const [errors,   setErrors]   = useState({})

  const nameRef = useRef(null)
  useEffect(() => { nameRef.current?.focus() }, [])

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (name.trim().length < 2)           e.name     = 'Name must be at least 2 characters.'
    if (!EMAIL_RE.test(email.trim()))     e.email    = 'Enter a valid email address.'
    const strength = calcStrength(password)
    if (strength < 2)                     e.password = 'Password must be at least 8 chars with a letter and number.'
    if (!agreed)                          e.agreed   = 'You must agree to continue.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const canSubmit =
    name.trim().length >= 2 &&
    EMAIL_RE.test(email.trim()) &&
    calcStrength(password) >= 2 &&
    agreed

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return

    try {
      await signup(name.trim(), email.trim().toLowerCase(), password)
      toast.success('Account created! Welcome to MediFind 🎉')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.message ?? 'Sign up failed. Please try again.')
    }
  }

  return (
    <AuthLayout subtitle="Create your account">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Full name */}
        <Input
          ref={nameRef}
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="Jane Smith"
          icon={<User size={16} strokeWidth={2} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          aria-label="Full name"
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail size={16} strokeWidth={2} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          aria-label="Email address"
        />

        {/* Password + strength */}
        <div className="flex flex-col gap-0.5">
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            aria-label="Password"
          />
          <StrengthMeter password={password} />
        </div>

        {/* Disclaimer checkbox */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              className="sr-only"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              aria-label="Agree to medical disclaimer and terms"
            />
            <div
              className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all ${
                agreed
                  ? 'bg-medical-600 border-medical-600'
                  : 'bg-white border-ios-gray3'
              }`}
            >
              {agreed && (
                <svg viewBox="0 0 12 9" className="w-3 h-3 fill-none stroke-white stroke-2">
                  <polyline points="1 4.5 4.5 8 11 1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-ios-secondLabel leading-snug">
            I agree to the{' '}
            <span className="text-ios-blue font-medium">Medical Disclaimer</span>
            {' '}and{' '}
            <span className="text-ios-blue font-medium">Terms of Use</span>
          </span>
        </label>
        {errors.agreed && (
          <p className="text-xs text-ios-red -mt-2 px-1">{errors.agreed}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          disabled={!canSubmit}
          className="w-full mt-1"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-ios-gray">
        Already have an account?{' '}
        <Link to="/login" className="text-ios-blue font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
