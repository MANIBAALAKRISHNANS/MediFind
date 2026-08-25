import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft, ChevronRight, LogOut,
  Shield, FileText, AlertCircle, Info, Mail, Bug,
} from 'lucide-react'
import { format } from 'date-fns'

import TopBar      from '../components/ui/TopBar.jsx'
import Button      from '../components/ui/Button.jsx'
import BottomSheet from '../components/ui/BottomSheet.jsx'
import useAuthStore from '../store/authStore.js'
import * as authService from '../services/authService.js'
import {
  LEGAL_LAST_UPDATED,
  PRIVACY_POLICY_SECTIONS,
  TERMS_OF_SERVICE_SECTIONS,
} from '../constants/legalContent.js'

function Avatar({ name }) {
  const initials = (name ?? '?')
    .trim()
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="w-20 h-20 rounded-full bg-medical-600 flex items-center justify-center shadow-ios-lifted">
      <span className="font-display font-bold text-2xl text-white">{initials}</span>
    </div>
  )
}

function ListRow({ icon: Icon, label, value, danger, onPress, disabled }) {
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className={`ios-list-item w-full flex items-center gap-3 text-left disabled:opacity-40 ${danger ? 'active:bg-ios-red/5' : ''}`}
    >
      {Icon && (
        <span className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${danger ? 'bg-ios-red/10' : 'bg-medical-50'}`}>
          <Icon size={16} className={danger ? 'text-ios-red' : 'text-medical-600'} strokeWidth={2} />
        </span>
      )}
      <span className={`flex-1 text-[15px] font-medium ${danger ? 'text-ios-red' : 'text-ios-label'}`}>
        {label}
      </span>
      {value && <span className="text-xs text-ios-gray">{value}</span>}
      {!value && !danger && <ChevronRight size={16} className="text-ios-gray2 shrink-0" />}
    </button>
  )
}

function DisclaimerExpanded() {
  return (
    <div className="px-4 pt-1 pb-4 text-xs text-ios-gray leading-relaxed">
      MediFind is an AI-assisted application designed for informational purposes only. It does not
      provide medical diagnoses, treatment plans, or prescriptions. Results should not replace
      consultation with a qualified healthcare professional. Always seek professional advice for any
      medical concerns. In case of emergency, contact emergency services immediately (108 / 112 / 911).
      MediFind accepts no liability for actions taken based on the information provided.
    </div>
  )
}

function LegalDocument({ sections }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[11px] text-ios-gray2 italic">
        Placeholder content for testing — not reviewed legal copy. Last updated {LEGAL_LAST_UPDATED}.
      </p>
      {sections.map((s) => (
        <div key={s.heading}>
          <p className="text-[13px] font-semibold text-ios-label mb-1">{s.heading}</p>
          <p className="text-[13px] text-ios-gray leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>
  )
}

export default function ProfilePage() {
  const navigate  = useNavigate()
  const user      = useAuthStore((s) => s.user)
  const logout    = useAuthStore((s) => s.logout)
  const [disclaimerOpen,   setDisclaimerOpen]   = useState(false)
  const [sendingReset,     setSendingReset]      = useState(false)
  const [legalDoc,         setLegalDoc]          = useState(null) // 'privacy' | 'terms' | null

  async function handleChangePassword() {
    if (!user?.email) return
    setSendingReset(true)
    try {
      await authService.forgotPassword(user.email)
      toast.success('Password reset link sent to your email!')
    } catch {
      toast.error('Could not send reset email. Try again.')
    } finally {
      setSendingReset(false)
    }
  }

  function handleLogout() {
    logout()
    toast.success('Signed out.')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-ios-bg">
      <TopBar
        title="Profile"
        leftAction={
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-ios-blue font-medium text-[15px]"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        }
      />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-page">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* Avatar + info */}
          <div className="flex flex-col items-center gap-3 pt-4 pb-2">
            <Avatar name={user?.name} />
            <div className="text-center">
              <p className="font-display font-bold text-xl text-ios-label">{user?.name}</p>
              <p className="text-ios-gray text-sm mt-0.5">{user?.email}</p>
              {user?.createdAt && (
                <p className="text-xs text-ios-gray2 mt-1.5">
                  Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
                </p>
              )}
            </div>
          </div>

          {/* Account section */}
          <div>
            <p className="ios-section-header">Account</p>
            <div className="ios-card overflow-hidden">
              <ListRow
                icon={Info}
                label="Edit Profile"
                onPress={() => navigate('/profile/edit')}
              />
              <ListRow
                icon={Shield}
                label={sendingReset ? 'Sending reset link…' : 'Change Password'}
                disabled={sendingReset}
                onPress={handleChangePassword}
              />
            </div>
          </div>

          {/* About section */}
          <div>
            <p className="ios-section-header">About</p>
            <div className="ios-card overflow-hidden">
              <ListRow icon={Shield}   label="Privacy Policy"   onPress={() => setLegalDoc('privacy')} />
              <ListRow icon={FileText} label="Terms of Service" onPress={() => setLegalDoc('terms')} />
              <div>
                <ListRow
                  icon={AlertCircle}
                  label="Medical Disclaimer"
                  onPress={() => setDisclaimerOpen((v) => !v)}
                />
                <AnimatePresence>
                  {disclaimerOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <DisclaimerExpanded />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <ListRow icon={Info} label="App Version" value="1.0.0" />
            </div>
          </div>

          {/* Support section */}
          <div>
            <p className="ios-section-header">Support</p>
            <div className="ios-card overflow-hidden">
              <ListRow
                icon={Mail}
                label="Contact Support"
                onPress={() => window.open('mailto:medifindofficial@gmail.com', '_blank')}
              />
              <ListRow
                icon={Bug}
                label="Report a Problem"
                onPress={() =>
                  window.open(
                    'mailto:medifindofficial@gmail.com?subject=Bug%20Report%20-%20MediFind%20App',
                    '_blank',
                  )
                }
              />
            </div>
          </div>

          {/* Sign out */}
          <Button
            variant="danger"
            icon={<LogOut size={16} />}
            onClick={handleLogout}
            className="w-full"
          >
            Sign Out
          </Button>
        </motion.div>
      </main>

      <BottomSheet
        open={legalDoc != null}
        onClose={() => setLegalDoc(null)}
        title={legalDoc === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
      >
        <LegalDocument sections={legalDoc === 'privacy' ? PRIVACY_POLICY_SECTIONS : TERMS_OF_SERVICE_SECTIONS} />
      </BottomSheet>
    </div>
  )
}
