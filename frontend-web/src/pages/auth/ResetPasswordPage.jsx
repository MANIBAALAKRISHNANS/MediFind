import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

import AuthLayout   from '../../components/AuthLayout.jsx'
import PasswordInput from '../../components/ui/PasswordInput.jsx'
import Button        from '../../components/ui/Button.jsx'
import useAuthStore  from '../../store/authStore.js'

const PAGE = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}

// ── Password strength (reuse same logic) ─────────────────────────────────────
function calcStrength(pw) {
  let score = 0
  if (pw.length >= 8)             score++
  if (/[a-zA-Z]/.test(pw))       score++
  if (/[0-9]/.test(pw))          score++
  if (/[^a-zA-Z0-9]/.test(pw))   score++
  return score
}

// ── Match indicator ───────────────────────────────────────────────────────────
function MatchIndicator({ password, confirm }) {
  if (!confirm) return null
  const match = password === confirm
  return (
    <div className={`flex items-center gap-1.5 text-xs mt-1.5 px-1 ${match ? 'text-ios-green' : 'text-ios-red'}`}>
      {match
        ? <><CheckCircle2 size={13} strokeWidth={2.5} /> Passwords match</>
        : <><XCircle      size={13} strokeWidth={2.5} /> Passwords don't match</>
      }
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const resetPassword  = useAuthStore((s) => s.resetPassword)

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading,         setLoading]         = useState(false)
  const [errors,          setErrors]          = useState({})

  const passwordRef = useRef(null)
  useEffect(() => { passwordRef.current?.focus() }, [])

  // ── Guard: missing params ───────────────────────────────────────────────────
  if (!email || !token) {
    return (
      <AuthLayout subtitle="Invalid link">
        <motion.div {...PAGE} className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-ios-red/10 flex items-center justify-center mb-5">
            <AlertTriangle size={34} className="text-ios-red" strokeWidth={1.75} />
          </div>
          <p className="text-ios-gray text-sm leading-relaxed mb-6">
            This reset link is invalid or missing required parameters. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="ios-button-primary text-sm px-5 py-3 rounded-ios"
          >
            Request New Link
          </Link>
          <Link to="/login" className="mt-4 text-sm text-ios-blue hover:underline">
            Back to Sign In
          </Link>
        </motion.div>
      </AuthLayout>
    )
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const e = {}
    if (calcStrength(newPassword) < 2) {
      e.newPassword = 'Password must be at least 8 chars with a letter and number.'
    }
    if (newPassword !== confirmPassword) {
      e.confirmPassword = 'Passwords do not match.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await resetPassword(email, token, newPassword)
      toast.success('Password reset! Please sign in with your new password.')
      navigate('/login', { replace: true })
    } catch (err) {
      const isExpired =
        err.status === 400 ||
        err.message?.toLowerCase().includes('expired') ||
        err.message?.toLowerCase().includes('invalid')

      if (isExpired) {
        toast.error('Reset link expired. Please request a new one.')
        navigate('/forgot-password', { replace: true })
      } else {
        toast.error(err.message ?? 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const canSubmit =
    calcStrength(newPassword) >= 2 &&
    newPassword === confirmPassword &&
    confirmPassword.length > 0

  return (
    <AuthLayout subtitle="Set new password">
      <motion.div {...PAGE}>
        <p className="text-sm text-ios-gray mb-5 leading-relaxed">
          Resetting password for{' '}
          <span className="font-semibold text-ios-secondLabel">{decodeURIComponent(email)}</span>
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* New password */}
          <PasswordInput
            ref={passwordRef}
            label="New Password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            aria-label="New password"
          />

          {/* Confirm password + match indicator */}
          <div>
            <PasswordInput
              label="Confirm Password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              aria-label="Confirm password"
            />
            <MatchIndicator password={newPassword} confirm={confirmPassword} />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!canSubmit}
            className="w-full mt-1"
          >
            Reset Password
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Link to="/login" className="text-sm text-ios-blue font-medium hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  )
}
