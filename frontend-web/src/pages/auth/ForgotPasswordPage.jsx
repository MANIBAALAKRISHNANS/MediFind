import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2 } from 'lucide-react'

import AuthLayout   from '../../components/AuthLayout.jsx'
import Input        from '../../components/ui/Input.jsx'
import Button       from '../../components/ui/Button.jsx'
import useAuthStore from '../../store/authStore.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FADE = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: 'easeOut' },
}

export default function ForgotPasswordPage() {
  const forgotPassword = useAuthStore((s) => s.forgotPassword)

  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [sent,      setSent]      = useState(false)

  const emailRef = useRef(null)
  useEffect(() => { emailRef.current?.focus() }, [])

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    try {
      // Backend always returns the same generic message whether or not the
      // account exists — never reveals that to the client either.
      await forgotPassword(email.trim().toLowerCase())
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout subtitle="Reset your password">
      <AnimatePresence mode="wait">
        {sent ? (
          // ── Confirmation state — the reset link (with its token) only
          // exists inside the email; there's nothing more to do here. ──────
          <motion.div key="sent" {...FADE} className="flex flex-col items-center text-center py-2">
            <div className="w-16 h-16 rounded-full bg-ios-green/10 flex items-center justify-center mb-5">
              <CheckCircle2 size={34} className="text-ios-green" strokeWidth={1.75} />
            </div>
            <p className="text-sm text-ios-gray leading-relaxed mb-2">
              If an account exists for
            </p>
            <p className="font-semibold text-ios-secondLabel mb-4">{email.trim()}</p>
            <p className="text-sm text-ios-gray leading-relaxed mb-6">
              we've sent a password reset link to that inbox. Open it on this device to set a new password —
              the link expires in 1 hour.
            </p>
            <Link to="/login" className="text-sm text-ios-blue font-medium hover:underline">
              ← Back to Sign In
            </Link>
          </motion.div>
        ) : (
          /* ── Form state ──────────────────────────────────────────────── */
          <motion.div key="form" {...FADE}>
            <p className="text-sm text-ios-gray mb-5 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <Input
                ref={emailRef}
                label="Email Address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                icon={<Mail size={16} strokeWidth={2} />}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                error={error}
                aria-label="Email address"
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full"
              >
                Send Reset Link
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!sent && (
        <div className="mt-6 pt-5 border-t border-ios-separator/30 flex flex-col items-center gap-2">
          <Link to="/login" className="text-sm text-ios-blue font-medium hover:underline">
            ← Back to Sign In
          </Link>
          <p className="text-xs text-ios-gray">
            Need help?{' '}
            <a
              href="mailto:medifindofficial@gmail.com"
              className="text-ios-blue hover:underline"
            >
              medifindofficial@gmail.com
            </a>
          </p>
        </div>
      )}
    </AuthLayout>
  )
}
