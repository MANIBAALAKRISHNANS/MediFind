import { useReducer, useEffect, useState, useRef } from 'react'
import { useNavigate }                             from 'react-router-dom'
import { AnimatePresence, motion }                 from 'framer-motion'
import { History, Stethoscope, ChevronRight, Activity, Clock, MapPin } from 'lucide-react'
import { format }                                  from 'date-fns'

import TopBar          from '../components/ui/TopBar.jsx'
import Badge           from '../components/ui/Badge.jsx'
import SideDrawer      from '../components/SideDrawer.jsx'
import SymptomInput    from '../components/SymptomInput.jsx'
import AnalyzingLoader from '../components/AnalyzingLoader.jsx'
import DiagnosisCard   from '../components/DiagnosisCard.jsx'
import LocationLoader  from '../components/LocationLoader.jsx'
import BestMatchCard   from '../components/BestMatchCard.jsx'

import { analyzeSymptoms, findBestDoctor, geocodeCity } from '../services/apiService.js'
import { getCurrentLocation }                            from '../services/locationService.js'
import { getHistory, saveAnalysis, updateAnalysis }      from '../services/historyService.js'
import useAuthStore                                      from '../store/authStore.js'
import client                                            from '../api/client.js'

// ── State machine ─────────────────────────────────────────────────────────────
const INIT = {
  stage:          'dashboard',
  symptoms:       null,
  diagnosis:      null,
  analysisId:     null,   // DB id (may be null if backend DB is unavailable)
  bestMatch:      null,
  note:           null,   // set when no exact specialty match was found nearby
  locationCoords: null,
  source:         null,
  error:          null,
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'GO_TO_INPUT':
      return { ...INIT, stage: 'input' }
    case 'SUBMIT':
      return { ...INIT, stage: 'analyzing', symptoms: payload }
    case 'ANALYSIS_SUCCESS':
      return { ...state, stage: 'diagnosis', diagnosis: payload.diagnosis, analysisId: payload.analysisId, source: payload.source ?? null }
    case 'FIND_DOCTOR':
      return { ...state, stage: 'locating', error: null }
    case 'LOCATION_SUCCESS':
      return { ...state, stage: 'searching', locationCoords: payload }
    case 'SEARCH_SUCCESS':
      return { ...state, stage: 'result', bestMatch: payload.bestMatch, note: payload.note ?? null }
    case 'LOCATION_ERROR':
      return { ...state, stage: 'location-error', error: payload }
    case 'ERROR':
      return { ...state, stage: 'error', error: payload }
    case 'RESET':
      return INIT
    default:
      return state
  }
}

const slide = {
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -12 },
  transition: { duration: 0.28, ease: 'easeOut' },
}

// ── Generic error card ────────────────────────────────────────────────────────
function ErrorView({ message, onRetry }) {
  return (
    <motion.div {...slide} className="ios-card p-6 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-ios-red/10 flex items-center justify-center text-2xl">⚠️</div>
      <div>
        <p className="font-semibold text-ios-label mb-1">Something went wrong</p>
        <p className="text-sm text-ios-gray">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2 rounded-full bg-medical-600 text-white text-sm font-semibold"
      >
        Try Again
      </button>
    </motion.div>
  )
}

// ── Location error card ───────────────────────────────────────────────────────
function LocationErrorView({ message, onRetry, onUseCoords }) {
  const [cityMode,    setCityMode]    = useState(false)
  const [cityName,    setCityName]    = useState('')
  const [cityLoading, setCityLoading] = useState(false)
  const [cityError,   setCityError]   = useState('')

  async function handleCitySearch(e) {
    e.preventDefault()
    if (!cityName.trim()) return
    setCityLoading(true)
    setCityError('')
    try {
      const coords = await geocodeCity(cityName.trim())
      onUseCoords(coords)
    } catch (err) {
      setCityError(err.message)
    } finally {
      setCityLoading(false)
    }
  }

  if (cityMode) {
    return (
      <motion.div {...slide} className="ios-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setCityMode(false); setCityError('') }}
            className="text-ios-blue text-sm font-semibold"
          >
            ← Back
          </button>
          <p className="font-semibold text-ios-label">Enter Your City</p>
        </div>
        <p className="text-sm text-ios-gray -mt-1">
          Type your city and we'll find doctors near you.
        </p>
        <form onSubmit={handleCitySearch} className="flex flex-col gap-3">
          <input
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="e.g. Mumbai, Chennai, Bangalore…"
            className="ios-input w-full"
            autoFocus
          />
          {cityError && <p className="text-xs text-ios-red font-medium">{cityError}</p>}
          <button
            type="submit"
            disabled={cityLoading || !cityName.trim()}
            className="ios-button-primary w-full disabled:opacity-50"
          >
            {cityLoading ? 'Searching…' : '🔍 Find Doctors in This City'}
          </button>
        </form>
      </motion.div>
    )
  }

  return (
    <motion.div {...slide} className="ios-card p-6 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
        <MapPin size={26} className="text-amber-500" />
      </div>
      <div>
        <p className="font-semibold text-ios-label mb-1">Location Access Needed</p>
        <p className="text-sm text-ios-gray leading-relaxed">{message}</p>
      </div>
      <div className="w-full rounded-ios bg-ios-bg border border-black/[0.06] px-4 py-3 text-left">
        <p className="text-xs font-semibold text-ios-label mb-1.5">How to enable in Chrome:</p>
        <p className="text-xs text-ios-gray leading-relaxed">
          Click the <strong>🔒 lock icon</strong> in the address bar →{' '}
          <strong>Site settings</strong> → set <strong>Location</strong> to{' '}
          <strong>Allow</strong> → then tap <em>Try Again</em>.
        </p>
      </div>
      <div className="flex flex-col w-full gap-2.5">
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 rounded-full bg-medical-600 text-white text-sm font-semibold"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={() => setCityMode(true)}
          className="px-5 py-2.5 rounded-full border border-medical-200 bg-medical-50 text-medical-700 text-sm font-semibold"
        >
          📍 Use My City Instead
        </button>
      </div>
    </motion.div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user, onAnalyze }) {
  const navigate = useNavigate()
  const token = useAuthStore(s => s.token)

  const [stats, setStats] = useState(() => {
    const h = getHistory()
    return { total: h.length, recent: h.slice(0, 3) }
  })

  useEffect(() => {
    if (!token) return
    client.get('/api/history?limit=3')
      .then(res => setStats({
        total:  res.data.total ?? 0,
        recent: res.data.analyses?.slice(0, 3) ?? [],
      }))
      .catch(() => {})
  }, [token])

  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="flex flex-col gap-5">

      {/* ── Greeting ──────────────────────────────────────────────────────── */}
      <div className="pt-2">
        <p className="text-ios-gray text-sm">{greeting} 👋</p>
        <h1 className="font-display font-bold text-[28px] text-ios-label mt-0.5 leading-tight">
          Hi, {firstName}
        </h1>
        <p className="text-ios-gray text-sm mt-1">How are you feeling today?</p>
      </div>

      {/* ── Main CTA ──────────────────────────────────────────────────────── */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onAnalyze}
        className="w-full bg-gradient-to-br from-medical-500 to-medical-700 rounded-ios-xl p-6 text-left shadow-ios-lifted"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest mb-2">
              AI Symptom Checker
            </p>
            <p className="text-white font-display font-bold text-[22px] leading-tight">
              Analyze Symptoms
            </p>
            <p className="text-white/60 text-xs mt-2.5">
              Powered by Gemini AI · Takes ~10 seconds
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Stethoscope size={30} className="text-white" strokeWidth={1.8} />
          </div>
        </div>
      </motion.button>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="ios-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-medical-50 flex items-center justify-center shrink-0">
              <Activity size={14} className="text-medical-600" />
            </div>
            <p className="text-ios-gray text-xs font-medium">Total Analyses</p>
          </div>
          <p className="font-display font-bold text-3xl text-ios-label">{stats.total}</p>
        </div>

        <div className="ios-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-medical-50 flex items-center justify-center shrink-0">
              <Clock size={14} className="text-medical-600" />
            </div>
            <p className="text-ios-gray text-xs font-medium">Last Check</p>
          </div>
          <p className="font-display font-bold text-sm text-ios-label leading-snug">
            {stats.recent[0]
              ? format(new Date(stats.recent[0].createdAt), 'MMM d, yyyy')
              : 'Never'}
          </p>
          {stats.recent[0] && (
            <p className="text-[11px] text-ios-gray mt-0.5">
              {format(new Date(stats.recent[0].createdAt), 'h:mm a')}
            </p>
          )}
        </div>
      </div>

      {/* ── Recent Analyses ────────────────────────────────────────────────── */}
      {stats.recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-0.5">
            <p className="text-[11px] font-semibold text-ios-gray uppercase tracking-wider">
              Recent Analyses
            </p>
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="text-xs text-ios-blue font-semibold"
            >
              See All
            </button>
          </div>

          <div className="ios-card overflow-hidden divide-y divide-black/[0.04]">
            {stats.recent.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => navigate(`/history/${a.id}`)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-ios-bg transition-colors active:bg-ios-bg"
              >
                <div className="w-9 h-9 rounded-ios bg-medical-50 flex items-center justify-center shrink-0">
                  <Stethoscope size={16} className="text-medical-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-ios-label truncate">{a.disease}</p>
                  <p className="text-xs text-ios-gray mt-0.5">
                    {format(new Date(a.createdAt), 'MMM d, yyyy · h:mm a')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={a.severity ?? 'default'}>
                    {a.severity ? a.severity.charAt(0).toUpperCase() + a.severity.slice(1) : ''}
                  </Badge>
                  <ChevronRight size={14} className="text-ios-gray2" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── First-time empty state ─────────────────────────────────────────── */}
      {stats.recent.length === 0 && (
        <div className="ios-card p-6 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-medical-50 flex items-center justify-center">
            <Stethoscope size={24} className="text-medical-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-semibold text-ios-label text-[15px]">No analyses yet</p>
            <p className="text-xs text-ios-gray mt-1 leading-relaxed max-w-[220px] mx-auto">
              Tap <span className="font-semibold text-medical-600">"Analyze Symptoms"</span> above
              to check your symptoms with AI
            </p>
          </div>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <p className="text-center text-[11px] text-ios-gray2 px-4 pb-2 leading-relaxed">
        ⚕️ MediFind provides AI-assisted information only.{' '}
        Always consult a healthcare professional for medical advice.
      </p>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate()
  const user     = useAuthStore((s) => s.user)

  const [state, dispatch]       = useReducer(reducer, INIT)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [inputError, setInputError] = useState(null)
  // Dense metro searches can legitimately take 15-20s on the backend (see
  // routes/findDoctor.js's Overpass timeout/retry) — swap the loading copy
  // after 3s so a long wait reads as "still working", not "stuck".
  const [searchTakingLong, setSearchTakingLong] = useState(false)

  // Tracks the localStorage entry id so we can update it when the facility is found.
  // Using a ref (not state) because it doesn't affect rendering.
  const localHistoryIdRef = useRef(null)

  const { stage, symptoms, diagnosis, analysisId, bestMatch, note, locationCoords, error } = state

  // Centralise reset so we always clear the localStorage ref + inputError
  function doReset() {
    localHistoryIdRef.current = null
    setInputError(null)
    dispatch({ type: 'RESET' })
  }

  // ── analyzing → Gemini AI ─────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'analyzing') return
    let cancelled = false

    if (import.meta.env.DEV) console.log('[MediFind] Calling /api/analyze', { symptoms })

    analyzeSymptoms(symptoms)
      .then(({ analysisId: id, source: src, ...diag }) => {
        if (cancelled) return
        if (import.meta.env.DEV) console.log('[MediFind] Analysis success', { id, disease: diag.disease })

        // FIX A — Save to localStorage immediately so History always shows the result,
        // regardless of whether the backend DB saved it (analysisId may be null if DB is down).
        const entry = saveAnalysis({ symptoms, diagnosis: diag })
        localHistoryIdRef.current = entry.id

        dispatch({
          type:    'ANALYSIS_SUCCESS',
          payload: { diagnosis: diag, analysisId: id, source: src },
        })
      })
      .catch((err) => {
        if (cancelled) return
        const msg = err.data?.message ?? err.message ?? 'Analysis failed. Please try again.'
        if (import.meta.env.DEV) console.error('[MediFind] Analysis FAILED', { status: err.status, msg })
        setInputError(msg)
        dispatch({ type: 'GO_TO_INPUT' })
      })

    return () => { cancelled = true }
  }, [stage, symptoms])

  // ── locating → GPS ────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'locating') return
    let cancelled = false
    getCurrentLocation()
      .then((coords) => {
        if (cancelled) return
        if (coords.source === 'ip-fallback') {
          dispatch({
            type:    'LOCATION_ERROR',
            payload: `GPS is unavailable on this connection (HTTP requires HTTPS for location access). IP-based location is too inaccurate for hospital search${coords.city ? ` — detected city: ${coords.city}` : ''}. Please enter your city below for accurate results.`,
          })
        } else {
          dispatch({ type: 'LOCATION_SUCCESS', payload: coords })
        }
      })
      .catch((err) => { if (!cancelled) dispatch({ type: 'LOCATION_ERROR', payload: err.message }) })
    return () => { cancelled = true }
  }, [stage])

  // ── searching → Overpass ──────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'searching') {
      setSearchTakingLong(false)
      return
    }
    const timer = setTimeout(() => setSearchTakingLong(true), 3000)
    return () => clearTimeout(timer)
  }, [stage])

  useEffect(() => {
    if (stage !== 'searching') return
    let cancelled = false
    findBestDoctor(locationCoords.lat, locationCoords.lng, diagnosis.specialty, analysisId ?? null)
      .then(({ bestMatch: match, note }) => {
        if (cancelled) return
        if (import.meta.env.DEV) console.log('[MediFind] Doctor found', match?.name, note ? `(no exact specialty match)` : '')

        // FIX A — Update the localStorage entry with the facility so the History
        // detail page shows the matched doctor.
        if (localHistoryIdRef.current && match) {
          updateAnalysis(localHistoryIdRef.current, { facility: match })
        }

        dispatch({ type: 'SEARCH_SUCCESS', payload: { bestMatch: match, note } })
      })
      .catch((err) => {
        if (!cancelled) dispatch({ type: 'ERROR', payload: err.message ?? 'Could not find a doctor nearby.' })
      })
    return () => { cancelled = true }
  }, [stage, locationCoords, diagnosis, analysisId])

  function handleRetry() {
    if (diagnosis) dispatch({ type: 'ANALYSIS_SUCCESS', payload: { diagnosis, analysisId } })
    else doReset()
  }

  return (
    <div className="min-h-screen bg-ios-bg flex flex-col">

      <TopBar
        title="MediFind"
        leftAction={
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-1 rounded-ios text-ios-secondLabel hover:bg-ios-bg transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <rect width="20" height="2" rx="1" fill="currentColor"/>
              <rect y="6"  width="14" height="2" rx="1" fill="currentColor"/>
              <rect y="12" width="18" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        }
        rightAction={
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="p-2 -mr-1 rounded-ios text-ios-secondLabel hover:bg-ios-bg transition-colors"
            aria-label="View history"
          >
            <History size={20} />
          </button>
        }
      />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-page">
        <AnimatePresence mode="wait">
          <motion.div key={stage} {...slide}>

            {stage === 'dashboard' && (
              <Dashboard
                user={user}
                onAnalyze={() => {
                  setInputError(null)
                  dispatch({ type: 'GO_TO_INPUT' })
                }}
              />
            )}

            {stage === 'input' && (
              <SymptomInput
                error={inputError}
                onSubmit={(s) => {
                  // FIX B — debug log at the exact point the user commits symptoms
                  if (import.meta.env.DEV) console.log('[MediFind] Analyze clicked, symptoms:', s)
                  setInputError(null)
                  dispatch({ type: 'SUBMIT', payload: s })
                }}
              />
            )}

            {stage === 'analyzing' && <AnalyzingLoader />}

            {stage === 'diagnosis' && (
              <DiagnosisCard
                diagnosis={diagnosis}
                onFindDoctor={() => dispatch({ type: 'FIND_DOCTOR' })}
                onReset={doReset}
              />
            )}

            {stage === 'locating' && <LocationLoader />}

            {stage === 'location-error' && (
              <LocationErrorView
                message={error}
                onRetry={() => dispatch({ type: 'FIND_DOCTOR' })}
                onUseCoords={(coords) => dispatch({ type: 'LOCATION_SUCCESS', payload: coords })}
              />
            )}

            {stage === 'searching' && (
              <AnalyzingLoader
                message={
                  searchTakingLong
                    ? 'Still searching — busy areas can take up to 20 seconds…'
                    : 'Searching nearby hospitals…'
                }
              />
            )}

            {stage === 'result' && (
              <BestMatchCard
                bestMatch={bestMatch}
                note={note}
                analysisId={analysisId}
                diagnosis={diagnosis}
                symptoms={symptoms}
                onSearchAgain={doReset}
              />
            )}

            {stage === 'error' && (
              <ErrorView message={error} onRetry={handleRetry} />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
