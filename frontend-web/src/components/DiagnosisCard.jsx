import { motion } from 'framer-motion'
import {
  AlertTriangle, CheckCircle2, Clock, AlertCircle,
  RotateCcw,
} from 'lucide-react'
import Badge         from './ui/Badge.jsx'
import Button        from './ui/Button.jsx'
import EmergencyBanner from './EmergencyBanner.jsx'

const SEVERITY_VARIANT = { mild: 'mild', moderate: 'moderate', severe: 'severe' }

const URGENCY_CONFIG = {
  'self-care':       { label: 'Self-care — manageable at home',          bg: 'bg-ios-green/10',  text: 'text-ios-green',  icon: CheckCircle2, emergency: false },
  'see-doctor-soon': { label: 'See a Doctor — within the next few days', bg: 'bg-ios-orange/10', text: 'text-ios-orange', icon: Clock,        emergency: false },
  'see-doctor-today':{ label: 'See a Doctor Today — do not delay',       bg: 'bg-red-50',        text: 'text-red-600',    icon: AlertCircle,  emergency: false },
  'see-doctor':      { label: 'See a Doctor — schedule an appointment',  bg: 'bg-ios-orange/10', text: 'text-ios-orange', icon: Clock,        emergency: false },
  'emergency':       { label: 'MEDICAL EMERGENCY',                       bg: '',                  text: '',                icon: AlertTriangle, emergency: true },
}

export default function DiagnosisCard({ diagnosis, onFindDoctor, onReset, hideActions = false }) {
  const {
    disease, specialty, severity, urgency,
    description, recommendations = [], redFlags = [],
  } = diagnosis

  const urg = URGENCY_CONFIG[urgency] ?? URGENCY_CONFIG['see-doctor']
  const sevVariant = SEVERITY_VARIANT[severity] ?? 'default'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="ios-card overflow-hidden"
    >
      {/* Emergency banner (full component) or standard urgency pill */}
      {urg.emergency ? (
        <div className="p-4 pb-0">
          <EmergencyBanner />
        </div>
      ) : (
        <div className={`flex items-center gap-3 px-5 py-3.5 ${urg.bg}`}>
          <urg.icon size={18} className={`${urg.text} shrink-0`} />
          <span className={`font-semibold text-sm ${urg.text}`}>{urg.label}</span>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-5">
        {/* Disease + severity badge */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display font-bold text-[26px] leading-tight text-ios-label">
            {disease}
          </h2>
          <Badge variant={sevVariant} className="shrink-0 mt-1">
            {severity ? severity.charAt(0).toUpperCase() + severity.slice(1) : ''}
          </Badge>
        </div>

        {/* Specialty pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-medical-50 border border-medical-100">
          <span className="text-xs text-ios-gray font-medium">Recommended:</span>
          <span className="text-xs font-semibold text-medical-700 capitalize">{specialty}</span>
        </div>

        {/* Description */}
        <p className="text-ios-gray text-[15px] leading-relaxed">{description}</p>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-ios-label mb-2.5">What to do</h3>
            <ul className="space-y-2.5">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] text-ios-secondLabel">
                  <CheckCircle2 size={16} className="text-medical-600 mt-0.5 shrink-0" strokeWidth={2} />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Red flags */}
        {redFlags.length > 0 && (
          <div className="rounded-ios bg-ios-orange/10 border border-ios-orange/20 p-4">
            <h3 className="text-sm font-semibold text-ios-orange flex items-center gap-2 mb-2.5">
              <AlertTriangle size={15} strokeWidth={2.5} />
              Watch for — seek help immediately if:
            </h3>
            <ul className="space-y-1.5">
              {redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-ios-orange">
                  <span className="w-1.5 h-1.5 rounded-full bg-ios-orange mt-1.5 shrink-0" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        {!hideActions && (
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {onFindDoctor && (
              <Button
                variant="primary"
                onClick={onFindDoctor}
                className="flex-1"
              >
                🔍 Find Best Doctor Near Me
              </Button>
            )}
            {onReset && (
              <Button
                variant="ghost"
                onClick={onReset}
                icon={<RotateCcw size={15} />}
                className="flex-1"
              >
                Start New Analysis
              </Button>
            )}
          </div>
        )}

        {/* Footer disclaimer */}
        <p className="text-center text-xs text-ios-gray2 leading-relaxed pt-1">
          This analysis is AI-generated and for informational purposes only.
          Always consult a qualified healthcare provider.
        </p>
      </div>
    </motion.div>
  )
}
