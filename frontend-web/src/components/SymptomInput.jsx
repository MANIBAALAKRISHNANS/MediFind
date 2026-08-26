import { useState, useRef, useEffect } from 'react'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import MedicalDisclaimerBanner from './MedicalDisclaimerBanner.jsx'
import { TOKEN_KEY } from '../constants.js'

const CHIPS_DEFAULT = [
  'Fever', 'Headache', 'Cough', 'Chest pain',
  'Fatigue', 'Nausea', 'Stomach pain', 'Dizziness',
]

const CHIPS_EXTRA = [
  // General
  'Vomiting',
  // Head / neuro
  'Blurred vision', 'Numbness',
  // Respiratory
  'Shortness of breath', 'Wheezing',
  // GI
  'Diarrhea', 'Constipation', 'Heartburn',
  // Musculoskeletal
  'Joint pain', 'Back pain', 'Muscle pain', 'Swelling',
  // Skin
  'Rash', 'Itching', 'Skin redness',
  // Urinary
  'Burning urination', 'Frequent urination',
  // Endocrine / metabolic
  'Excessive thirst', 'Weight loss', 'Weight gain',
  // Mental health
  'Anxiety', 'Low mood', 'Insomnia',
  // ENT
  'Sore throat', 'Ear pain', 'Runny nose',
  // Eye
  'Red eye', 'Eye pain',
]

const MAX = 1000
// Mirrors the backend's own floor (backend/routes/analyze.js). It was 10,
// which blocked "headache", "back pain", "fever" and "rash" — the shortest and
// commonest way someone names what is wrong with them. The engine now answers
// a sparse complaint with a lower-confidence match and its own "describe more
// symptoms" note rather than refusing it, so the input box has no reason to
// refuse it either. Keep the two numbers in step: a client minimum above the
// server's only makes a valid request unsendable.
const MIN = 3

export default function SymptomInput({ onSubmit, loading = false, error = null }) {
  const [text, setText] = useState('')
  const [showMore, setShowMore] = useState(false)
  const ref = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])

  // Auto-focus on mount
  useEffect(() => { ref.current?.focus() }, [])

  function appendChip(chip) {
    setText((prev) => {
      const lower = prev.toLowerCase()
      if (lower.includes(chip.toLowerCase())) return prev
      const trimmed = prev.trimEnd()
      return trimmed ? `${trimmed} ${chip}` : chip
    })
    ref.current?.focus()
  }

  // FIX B — type="button" onClick handler (replaces type="submit" inside <form>)
  // Forms can swallow click events when browser-native validation interferes.
  function handleSubmit() {
    const trimmed = text.trim()

    console.log('[Analyze] Submit triggered', {
      chars:    trimmed.length,
      loading,
      hasToken: !!localStorage.getItem(TOKEN_KEY),
    })

    if (trimmed.length < MIN) {
      toast.error(`Please describe your symptoms in more detail (at least ${MIN} characters)`)
      return
    }

    if (loading) return
    onSubmit(trimmed)
  }

  // Also handle Enter key in textarea (keep form for accessibility, but button is type="button")
  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const count   = text.length
  const trimLen = text.trim().length
  const isValid = trimLen >= MIN && count <= MAX
  const nearMax = count > MAX * 0.85

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4"
    >
      {/* Disclaimer */}
      <MedicalDisclaimerBanner />

      {/* Card */}
      <div className="ios-card p-5 sm:p-6">
        {/* Heading */}
        <div className="mb-5">
          <h2 className="font-display font-bold text-[26px] leading-tight text-ios-label">
            How are you feeling?
          </h2>
          <p className="text-ios-gray text-sm mt-1.5">
            Describe your symptoms in detail for the most accurate analysis.
          </p>
        </div>

        {/* Quick chips */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {CHIPS_DEFAULT.map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={loading}
                onClick={() => appendChip(chip)}
                className="px-3 py-1.5 rounded-full bg-ios-bg text-sm font-medium text-ios-secondLabel
                           active:bg-medical-50 active:text-medical-700 transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {chip}
              </button>
            ))}

            <AnimatePresence initial={false}>
              {showMore && (
                <motion.div
                  key="extra-chips"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap gap-2 w-full overflow-hidden"
                >
                  {CHIPS_EXTRA.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      disabled={loading}
                      onClick={() => appendChip(chip)}
                      className="px-3 py-1.5 rounded-full bg-ios-bg text-sm font-medium text-ios-secondLabel
                                 active:bg-medical-50 active:text-medical-700 transition-colors
                                 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {chip}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => setShowMore((v) => !v)}
            className="mt-2 flex items-center gap-1 text-xs text-medical-600 font-medium
                       hover:text-medical-700 transition-colors disabled:opacity-40"
          >
            {showMore ? (
              <><ChevronUp size={13} /> Show fewer symptoms</>
            ) : (
              <><ChevronDown size={13} /> +{CHIPS_EXTRA.length} more symptoms</>
            )}
          </button>
        </div>

        {/* Textarea — NOT inside a <form> to avoid form-submission interference */}
        <div className="relative mb-4">
          <textarea
            ref={ref}
            value={text}
            disabled={loading}
            rows={5}
            placeholder="e.g. I have had a fever of 38.5 °C for 2 days, with a dry cough and mild shortness of breath…"
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            onKeyDown={handleKeyDown}
            className="ios-input resize-none min-h-[140px] leading-relaxed"
            aria-label="Symptom description"
          />
          <span
            className={`absolute bottom-3 right-3 text-xs tabular-nums ${
              nearMax ? 'text-ios-orange' : 'text-ios-gray2'
            }`}
          >
            {count} / {MAX}
          </span>
        </div>

        {/* Minimum-chars nudge */}
        {trimLen > 0 && trimLen < MIN && (
          <p className="text-xs text-ios-orange mb-3 px-1">
            {MIN - trimLen} more character{MIN - trimLen !== 1 ? 's' : ''} needed
          </p>
        )}

        {/* FIX B — Inline error banner (shown when parent reports an API error) */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm leading-snug">
            ⚠️ {error}
          </div>
        )}

        {/* FIX B — type="button" so no form swallows the click */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className="w-full py-4 flex items-center justify-center gap-2
                     bg-medical-600 disabled:bg-slate-300
                     text-white font-semibold rounded-2xl shadow-lg
                     active:scale-[0.98] transition
                     disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {loading ? (
            '🔄 Analysing…'
          ) : (
            <>
              <Sparkles size={17} />
              Analyze Symptoms
            </>
          )}
        </button>

        <p className="text-xs text-ios-gray2 text-center mt-3">
          Ctrl + Enter to submit · Results appear in seconds
        </p>
      </div>
    </motion.div>
  )
}
