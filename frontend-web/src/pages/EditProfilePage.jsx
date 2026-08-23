import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { ArrowLeft, User, Mail, CheckCircle2 } from 'lucide-react'

import TopBar       from '../components/ui/TopBar.jsx'
import Input        from '../components/ui/Input.jsx'
import Button       from '../components/ui/Button.jsx'
import useAuthStore from '../store/authStore.js'

export default function EditProfilePage() {
  const navigate      = useNavigate()
  const user          = useAuthStore((s) => s.user)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const isLoading     = useAuthStore((s) => s.isLoading)

  const [name,  setName]  = useState(user?.name  ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const nameChanged  = name.trim()  !== (user?.name  ?? '')
  const emailChanged = email.trim() !== (user?.email ?? '')
  const hasChanges   = nameChanged || emailChanged
  const canSave      = hasChanges && name.trim().length >= 2 && email.trim().includes('@')

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSaved(false)

    try {
      await updateProfile(name.trim(), email.trim())
      setSaved(true)
      toast.success('Profile updated!')
      setTimeout(() => navigate('/profile'), 800)
    } catch (err) {
      setError(err.message ?? 'Failed to update profile. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-ios-bg">

      {/* Top bar */}
      <TopBar
        title="Edit Profile"
        leftAction={
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1 text-ios-blue font-medium text-[15px]"
          >
            <ArrowLeft size={18} />
            <span>Profile</span>
          </button>
        }
      />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >

          {/* Avatar preview */}
          <div className="flex flex-col items-center gap-3 pt-4 pb-6">
            <div className="w-20 h-20 rounded-full bg-medical-600 flex items-center justify-center shadow-ios-lifted">
              <span className="font-display font-bold text-2xl text-white">
                {(name.trim() || '?')
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-ios-gray">Your initials update as you type</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="flex flex-col gap-5">

            {/* Name */}
            <div>
              <p className="ios-section-header">Full Name</p>
              <div className="ios-card p-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSaved(false) }}
                  icon={<User size={16} className="text-ios-gray" />}
                  placeholder="Your full name"
                  autoComplete="name"
                  maxLength={60}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <p className="ios-section-header">Email Address</p>
              <div className="ios-card p-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSaved(false) }}
                  icon={<Mail size={16} className="text-ios-gray" />}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <p className="text-xs text-ios-gray px-1 mt-1.5">
                Changing your email will require you to use the new address for future logins.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-ios bg-ios-red/10 border border-ios-red/20 px-4 py-3">
                <p className="text-sm text-ios-red font-medium">{error}</p>
              </div>
            )}

            {/* Success */}
            {saved && (
              <div className="rounded-ios bg-ios-green/10 border border-ios-green/20 px-4 py-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-ios-green shrink-0" />
                <p className="text-sm text-ios-green font-medium">Profile updated successfully!</p>
              </div>
            )}

            {/* Save button */}
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={!canSave || isLoading}
              className="w-full"
            >
              Save Changes
            </Button>

            {/* Cancel */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/profile')}
              className="w-full"
            >
              Cancel
            </Button>

          </form>

          {/* Note */}
          <p className="text-center text-xs text-ios-gray2 mt-6 px-4 leading-relaxed">
            To change your password, use the <strong>Change Password</strong> option on the Profile page.
          </p>

        </motion.div>
      </main>
    </div>
  )
}
