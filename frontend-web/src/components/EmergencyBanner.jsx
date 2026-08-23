import { Phone, AlertOctagon } from 'lucide-react'

/**
 * Full-width red banner shown when urgency === 'emergency'.
 * Displayed at the top of DiagnosisCard and AnalysisDetailPage.
 */
export default function EmergencyBanner() {
  return (
    <div className="rounded-ios-lg bg-ios-red text-white px-4 py-3.5 flex items-start gap-3 shadow-ios-lifted">
      <AlertOctagon size={20} className="shrink-0 mt-0.5" strokeWidth={2.5} />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[15px] leading-snug">Seek Emergency Care Now</p>
        <p className="text-[12px] mt-0.5 text-red-100 leading-snug">
          Your symptoms may indicate a serious medical emergency. Do not wait — call emergency
          services immediately.
        </p>
        <div className="flex flex-wrap gap-2 mt-2.5">
          {[
            { label: '🇺🇸 911', href: 'tel:911' },
            { label: '🌍 112', href: 'tel:112' },
            { label: '🇮🇳 108', href: 'tel:108' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors rounded-full px-3 py-1 text-[12px] font-semibold"
            >
              <Phone size={12} strokeWidth={2.5} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
