import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'

const CODE_HINTS = {
  ANTHROPIC_AUTH_ERROR: 'Check that your API key is correctly configured.',
  AI_UNAVAILABLE:       'The AI service is temporarily down. Please try again in a moment.',
  AI_PARSE_ERROR:       'The AI returned an unexpected response. Please try again.',
  PLACES_UNAVAILABLE:   'The location service is temporarily unavailable.',
  NO_RESULTS:           'No facilities were found nearby. Try a different specialty or move to a different area.',
  NO_QUALIFYING_RESULTS:'No highly-rated facilities were found nearby.',
  NETWORK_ERROR:        'Check your internet connection and try again.',
  PERMISSION_DENIED:    'Location permission was denied. Please allow it in your device settings and try again.',
}

export default function ErrorCard({ message, code, onRetry }) {
  const hint = CODE_HINTS[code]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 sm:p-8"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-100">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-bold text-xl text-navy-900">Something went wrong</h3>
          <p className="text-slate-600 text-sm leading-relaxed max-w-sm">{message}</p>
          {hint && hint !== message && (
            <p className="text-slate-400 text-xs">{hint}</p>
          )}
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="min-h-[48px] inline-flex items-center gap-2 bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white font-semibold text-sm rounded-xl px-6 py-3 shadow-lg shadow-medical-600/30 transition-all duration-200 active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  )
}
