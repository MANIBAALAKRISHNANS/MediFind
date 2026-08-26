import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, MapPin, Globe, Map, Navigation,
  ChevronDown, ChevronUp, Clock, Download, RotateCcw,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Badge from './ui/Badge.jsx'
import Button from './ui/Button.jsx'
import { generatePDF } from '../utils/generateReport.js'

const TYPE_VARIANT = {
  hospital: 'info',
  clinic:   'success',
  doctors:  'purple',
  facility: 'default',
}

function ScoreRow({ label, value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-ios-gray font-medium">{label}</span>
        <span className="text-ios-secondLabel tabular-nums font-semibold">{Math.round(value)} / {max}</span>
      </div>
      <div className="h-1.5 bg-ios-bg rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

export default function BestMatchCard({ bestMatch, note, analysisId, diagnosis, symptoms, onSearchAgain }) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [downloading,   setDownloading]   = useState(false)

  if (!bestMatch) return null

  const {
    name, address, website, type = 'facility',
    distanceKm, openingHours, osmMapUrl, directionsUrl,
    matchScore = 0, scoreBreakdown = {}, recommendedSpecialty, source,
  } = bestMatch

  const { distanceScore = 0, typeScore = 0, specialtyScore = 0, completenessScore = 0 } = scoreBreakdown
  const matchPct  = Math.min(100, Math.round(matchScore))
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1)

  async function handleDownload() {
    setDownloading(true)
    try {
      await generatePDF({ diagnosis: diagnosis ?? {}, symptoms, bestMatch })
      toast.success('Report opened — choose "Save as PDF" in the print dialog.')
    } catch (e) {
      console.error('Report generation failed:', e)
      toast.error('Could not generate report. Try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-medical-600" />
        <div>
          <h2 className="font-display font-bold text-[22px] text-ios-label leading-tight">
            Best Match Found
          </h2>
          <p className="text-xs text-ios-gray">
            {source ?? 'OpenStreetMap'} · {recommendedSpecialty && `Searching for ${recommendedSpecialty}`}
          </p>
        </div>
      </div>

      {/* No exact specialty match — this is the closest of all nearby facilities */}
      {note && (
        <div className="rounded-ios bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 font-medium">
          ℹ️ {note}
        </div>
      )}

      {/* Main card */}
      <div className="ios-card overflow-hidden">
        <div className="p-5 sm:p-6 space-y-4">
          {/* Name + type */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-[22px] text-ios-label leading-tight">
              {name}
            </h3>
            <Badge variant={TYPE_VARIANT[type] ?? 'default'} className="shrink-0 mt-1">
              {typeLabel}
            </Badge>
          </div>

          {/* Distance */}
          {distanceKm != null && (
            <div className="flex items-center gap-1.5 text-medical-700 font-semibold text-[15px]">
              <MapPin size={15} className="text-medical-600" />
              {distanceKm} km away
            </div>
          )}

          {/* Address */}
          {address && (
            <p className="text-ios-gray text-sm flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-ios-gray2" />
              {address}
            </p>
          )}

          {/* Opening hours */}
          {openingHours && (
            <p className="text-ios-gray text-sm flex items-center gap-2">
              <Clock size={14} className="shrink-0 text-ios-gray2" />
              {openingHours}
            </p>
          )}

          {/* Match score bar */}
          <div className="rounded-ios bg-ios-bg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-ios-label">Match Score</span>
              <span className="text-sm font-bold text-medical-600 tabular-nums">{matchScore} / 100</span>
            </div>
            <div className="h-2.5 bg-ios-gray3/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${matchPct}%` }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-medical-500 to-medical-600"
              />
            </div>

            <button
              onClick={() => setShowBreakdown((v) => !v)}
              className="flex items-center gap-1 text-xs text-medical-600 font-medium mt-1"
            >
              {showBreakdown ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              Why this match?
            </button>

            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden space-y-3 pt-1"
                >
                  <ScoreRow label="Specialty Match" value={specialtyScore}    max={35} color="bg-ios-purple" />
                  <ScoreRow label="Distance"       value={distanceScore}    max={40} color="bg-medical-500" />
                  <ScoreRow label="Facility Type"  value={typeScore}        max={15} color="bg-ios-blue" />
                  <ScoreRow label="Completeness"   value={completenessScore} max={10} color="bg-ios-green" />
                  {completenessScore === 0 && (
                    <p className="text-[11px] text-ios-gray2 mt-1">
                      ℹ️ Completeness is 0 because this facility has no phone, address, or hours listed in OpenStreetMap yet.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            {/* Map + Directions row */}
            <div className="grid grid-cols-2 gap-2.5">
              {osmMapUrl && (
                <a
                  href={osmMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ios-button-secondary text-sm py-3"
                >
                  🗺️ View on Map
                </a>
              )}
              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ios-button-secondary text-sm py-3"
                >
                  🧭 Directions
                </a>
              )}
            </div>

            {/* Website */}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="ios-button-ghost w-full justify-center text-sm"
              >
                <Globe size={14} />
                🌐 Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Download report — client-side PDF, no server needed */}
      <Button
        variant="primary"
        loading={downloading}
        icon={<Download size={16} />}
        onClick={handleDownload}
        className="w-full"
      >
        Download PDF Report
      </Button>

      {/* New analysis link */}
      {onSearchAgain && (
        <div className="text-center">
          <button
            onClick={onSearchAgain}
            className="text-sm text-ios-blue font-medium hover:underline flex items-center gap-1.5 mx-auto"
          >
            <RotateCcw size={13} />
            🔄 New Analysis
          </button>
        </div>
      )}

      <p className="text-center text-xs text-ios-gray2 pb-1">
        This result is for informational use only — not a substitute for medical advice.
      </p>
    </motion.div>
  )
}
