import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

import TopBar        from '../components/ui/TopBar.jsx'
import DiagnosisCard from '../components/DiagnosisCard.jsx'
import BestMatchCard from '../components/BestMatchCard.jsx'
import Button        from '../components/ui/Button.jsx'
import Spinner       from '../components/ui/Spinner.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import client, { getToken } from '../api/client.js'
import { getAnalysis, deleteAnalysis } from '../services/historyService.js'

// Reconstruct bestMatch shape from flat DB fields
function toBestMatch(a) {
  if (!a.matchName) return null
  return {
    name:          a.matchName,
    address:       a.matchAddress,
    phone:         a.matchPhone,
    website:       a.matchWebsite,
    type:          a.matchType ?? 'facility',
    distanceKm:    a.matchDistanceKm,
    lat:           a.matchLat,
    lng:           a.matchLng,
    osmMapUrl:     a.matchOsmMapUrl,
    directionsUrl: a.matchDirectionsUrl ?? null,
    matchScore:    a.matchScore ?? 0,
    scoreBreakdown: {
      specialtyScore:    a.matchSpecialtyScore    ?? 0,
      distanceScore:     a.matchDistanceScore     ?? 0,
      typeScore:         a.matchTypeScore         ?? 0,
      completenessScore: a.matchCompletenessScore ?? 0,
    },
    source: 'OpenStreetMap',
  }
}

export default function AnalysisDetailPage() {
  const { id }  = useParams()
  const navigate = useNavigate()

  const [analysis,     setAnalysis]     = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [confirmDelete,setConfirmDelete]= useState(false)
  const [deleting,     setDeleting]     = useState(false)

  useEffect(() => {
    async function load() {
      if (getToken()) {
        try {
          const res = await client.get(`/api/history/${id}`)
          setAnalysis(res.data)
          return
        } catch {}
      }
      try {
        const data = await getAnalysis(id)
        setAnalysis(data)
      } catch {
        toast.error('Could not load this analysis.')
      }
    }
    load().finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    try {
      if (getToken()) {
        await client.delete(`/api/history/${id}`)
      }
      await deleteAnalysis(id)
      toast.success('Analysis deleted.')
      navigate('/history', { replace: true })
    } catch {
      toast.error('Could not delete. Try again.')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const bestMatch = analysis ? toBestMatch(analysis) : null

  return (
    <div className="min-h-screen bg-ios-bg">
      <TopBar
        title="Analysis Details"
        leftAction={
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-1 text-ios-blue font-medium text-[15px]"
          >
            <ArrowLeft size={18} />
          </button>
        }
      />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-page">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : !analysis ? (
          <div className="ios-card p-8 text-center text-ios-gray">
            Analysis not found.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5"
          >
            {/* Date */}
            <p className="text-xs text-ios-gray font-medium px-1">
              {format(new Date(analysis.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>

            {/* Symptoms reported */}
            <div className="ios-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ios-gray mb-3">
                Symptoms Reported
              </p>
              <p className="text-[15px] text-ios-secondLabel leading-relaxed">
                {analysis.symptoms}
              </p>
            </div>

            {/* Diagnosis */}
            <DiagnosisCard
              diagnosis={{
                disease:         analysis.disease,
                specialty:       analysis.specialty,
                severity:        analysis.severity,
                urgency:         analysis.urgency,
                description:     analysis.description,
                recommendations: analysis.recommendations,
                redFlags:        analysis.redFlags,
              }}
              hideActions
            />

            {/* Best match (if saved) */}
            {bestMatch && (
              <BestMatchCard
                bestMatch={bestMatch}
                analysisId={id}
                diagnosis={analysis}
                symptoms={analysis.symptoms}
              />
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="danger"
                icon={<Trash2 size={16} />}
                onClick={() => setConfirmDelete(true)}
                className="w-full"
              >
                Delete This Analysis
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Analysis"
        message="This analysis record and its PDF will be permanently deleted. This action cannot be undone."
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
