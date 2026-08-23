import { AlertCircle } from 'lucide-react'

/**
 * Reusable medical-disclaimer notice.
 * Used at the bottom of auth pages and above the symptom input.
 */
export default function MedicalDisclaimerBanner({ className = '' }) {
  return (
    <div
      className={`flex items-start gap-2.5 bg-amber-50 border border-amber-200/70 rounded-ios px-4 py-3 ${className}`}
      role="note"
      aria-label="Medical disclaimer"
    >
      <AlertCircle
        size={15}
        className="text-amber-500 mt-0.5 shrink-0"
        strokeWidth={2.5}
      />
      <p className="text-xs text-amber-800 leading-relaxed">
        <span className="font-semibold">⚕ MediFind</span> provides AI-assisted information only
        — not a substitute for professional medical advice. In emergencies,{' '}
        <span className="font-semibold">call 911 / 112 / 108</span>.
      </p>
    </div>
  )
}
