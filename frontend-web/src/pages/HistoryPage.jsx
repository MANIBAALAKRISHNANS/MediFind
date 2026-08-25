import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { ArrowLeft, ChevronRight, MoreHorizontal, Stethoscope, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

import TopBar        from '../components/ui/TopBar.jsx'
import Badge         from '../components/ui/Badge.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import client from '../api/client.js'
import useAuthStore from '../store/authStore.js'
import { getHistory, deleteAnalysis, clearHistory } from '../services/historyService.js'

const SEV_VARIANT = { mild: 'mild', moderate: 'moderate', severe: 'severe' }

// ── Action menu ───────────────────────────────────────────────────────────────
function ActionMenu({ onView, onDelete, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="absolute right-4 top-10 z-50 bg-white rounded-ios shadow-ios-modal border border-black/[0.06] overflow-hidden min-w-[160px]">
      <button
        type="button"
        onClick={onView}
        className="w-full text-left px-4 py-3 text-sm font-medium text-ios-label hover:bg-ios-bg transition-colors"
      >
        View Details
      </button>
      <div className="border-t border-ios-separator/40" />
      <button
        type="button"
        onClick={onDelete}
        className="w-full text-left px-4 py-3 text-sm font-medium text-ios-red hover:bg-ios-red/5 transition-colors"
      >
        Delete
      </button>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const navigate = useNavigate()

  const token = useAuthStore(s => s.token)
  const [analyses,      setAnalyses]      = useState(() => getHistory())
  const [menuOpenId,    setMenuOpenId]    = useState(null)
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  const [deleting,      setDeleting]      = useState(false)
  const [confirmClear,  setConfirmClear]  = useState(false)
  const [clearing,      setClearing]      = useState(false)

  const refresh = useCallback(async () => {
    if (token) {
      try {
        const res = await client.get('/api/history?limit=50')
        setAnalyses(res.data.analyses ?? [])
        return
      } catch {}
    }
    setAnalyses(getHistory())
  }, [token])

  useEffect(() => {
    refresh()
  }, [refresh])

  // ── Delete one entry ────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      if (token) {
        await client.delete(`/api/history/${deleteTarget}`)
      }
      await deleteAnalysis(deleteTarget)
      await refresh()
      toast.success('Analysis deleted.')
    } catch {
      toast.error('Could not delete. Try again.')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  // ── Clear all entries ───────────────────────────────────────────────────────
  async function handleClearAll() {
    setClearing(true)
    try {
      // Delete all from backend DB if logged in
      if (token) {
        const ids = analyses.map((a) => a.id).filter(Boolean)
        await Promise.allSettled(ids.map((id) => client.delete(`/api/history/${id}`)))
      }
      clearHistory()
      setAnalyses([])
      toast.success('All analyses cleared.')
    } catch {
      toast.error('Could not clear history.')
    } finally {
      setClearing(false)
      setConfirmClear(false)
    }
  }

  const total = analyses.length

  return (
    <div className="min-h-screen bg-ios-bg">
      <TopBar
        title="Analysis History"
        leftAction={
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-ios-blue font-medium text-[15px]"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
        }
        rightAction={
          total > 0 ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 text-ios-red text-sm font-medium px-1"
            >
              <Trash2 size={15} />
              Clear All
            </button>
          ) : null
        }
      />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-page">
        <AnimatePresence mode="wait">

          {/* ── Empty state ─────────────────────────────────────────────────── */}
          {total === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 px-6"
            >
              <div className="w-20 h-20 rounded-full bg-medical-50 flex items-center justify-center mb-5">
                <Stethoscope className="w-10 h-10 text-medical-600" />
              </div>
              <h2 className="text-xl font-semibold text-ios-label mb-2">No analyses yet</h2>
              <p className="text-ios-gray text-center mb-6 max-w-xs">
                Start your first AI symptom check to see your health analysis history here.
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="ios-button-primary px-6 py-3"
              >
                🩺 Analyze Symptoms Now
              </button>
              <p className="text-xs text-ios-gray2 mt-6 text-center max-w-xs">
                💡 MediFind provides AI-assisted information only. Always consult a healthcare professional.
              </p>
            </motion.div>
          )}

          {/* ── List ────────────────────────────────────────────────────────── */}
          {total > 0 && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="ios-section-header mb-3">
                {total} {total === 1 ? 'record' : 'records'}
              </p>

              <div className="ios-card overflow-hidden">
                {analyses.map((a) => (
                  <div
                    key={a.id}
                    className="relative ios-list-item flex items-center gap-3 cursor-pointer"
                    onClick={() => { if (!menuOpenId) navigate(`/history/${a.id}`) }}
                  >
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-ios bg-medical-50 flex items-center justify-center shrink-0">
                      <Stethoscope size={16} className="text-medical-600" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] text-ios-label truncate">
                        {a.disease ?? 'Unknown condition'}
                      </p>
                      <p className="text-xs text-ios-gray mt-0.5">
                        {format(new Date(a.createdAt), "MMM d, yyyy • h:mm a")}
                      </p>
                      {/* Facility name if doctor was found */}
                      {a.matchName && (
                        <p className="text-xs text-teal-600 mt-0.5 truncate">
                          📍 {a.matchName}
                        </p>
                      )}
                    </div>

                    {/* Badge */}
                    <Badge variant={SEV_VARIANT[a.severity] ?? 'default'} className="shrink-0">
                      {a.severity ?? '—'}
                    </Badge>

                    {/* Context menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMenuOpenId((id) => id === a.id ? null : a.id)
                        }}
                        className="p-1.5 text-ios-gray hover:text-ios-secondLabel rounded-full"
                        aria-label="More options"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {menuOpenId === a.id && (
                        <ActionMenu
                          onView={() => { setMenuOpenId(null); navigate(`/history/${a.id}`) }}
                          onDelete={() => { setMenuOpenId(null); setDeleteTarget(a.id) }}
                          onClose={() => setMenuOpenId(null)}
                        />
                      )}
                    </div>

                    {menuOpenId !== a.id && (
                      <ChevronRight size={16} className="text-ios-gray2 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <p className="text-center text-xs text-ios-gray2 mt-4">
                Last {Math.min(total, 50)} analyses · stored on this device
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Backdrop for menu */}
      {menuOpenId && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />
      )}

      {/* Delete one */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Analysis"
        message="This analysis record will be permanently deleted from your device. This action cannot be undone."
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Clear all */}
      <ConfirmDialog
        open={confirmClear}
        title="Clear All History"
        message={`This will permanently delete all ${total} analyses from your device. This action cannot be undone.`}
        confirmLabel={clearing ? 'Clearing…' : 'Clear All'}
        cancelLabel="Cancel"
        danger
        onConfirm={handleClearAll}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  )
}
