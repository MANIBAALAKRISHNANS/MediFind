import { Stethoscope } from 'lucide-react'
import { motion } from 'framer-motion'
import MedicalDisclaimerBanner from './MedicalDisclaimerBanner.jsx'

const PAGE = {
  initial:   { opacity: 0, y: 16 },
  animate:   { opacity: 1, y: 0 },
  transition:{ duration: 0.35, ease: [0.16, 1, 0.3, 1] },
}

/**
 * Shared wrapper for all auth pages.
 *
 * @param {string}    subtitle  – e.g. "Welcome back"
 * @param {ReactNode} children
 */
export default function AuthLayout({ subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-ios-bg flex flex-col items-center justify-start sm:justify-center px-4 py-10 overflow-y-auto">

      <motion.div
        className="w-full max-w-md"
        {...PAGE}
      >
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-medical-600 flex items-center justify-center shadow-ios-lifted">
              <Stethoscope size={24} className="text-white" strokeWidth={2} />
            </div>
            <span className="font-display font-bold text-[28px] tracking-tight text-ios-label">
              MediFind
            </span>
          </div>
          <span className="text-sm text-ios-gray font-medium tracking-wide">
            AI Symptom Analysis
          </span>
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-ios-xl shadow-ios-lifted overflow-hidden">
          {subtitle && (
            <div className="px-7 pt-7 pb-1">
              <h1 className="font-display font-bold text-2xl text-ios-label">
                {subtitle}
              </h1>
            </div>
          )}

          <div className="px-7 py-6">
            {children}
          </div>
        </div>

        {/* ── Disclaimer ───────────────────────────────────────────────── */}
        <div className="mt-5">
          <MedicalDisclaimerBanner />
        </div>
      </motion.div>
    </div>
  )
}
