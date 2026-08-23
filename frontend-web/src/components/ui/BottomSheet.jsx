import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const BACKDROP   = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
const SHEET_MOB  = { hidden: { y: '100%' }, visible: { y: 0 },      exit: { y: '100%' } }
const SHEET_DESK = { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 } }

const SPRING = { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }
const EASE   = { duration: 0.2, ease: 'easeOut' }

/**
 * Mobile-first bottom sheet / modal.
 *
 * • Mobile  → slides up from bottom edge
 * • Desktop → centered card with scale animation
 * • Closes on backdrop click and ESC key
 *
 * @param {boolean}   open
 * @param {function}  onClose
 * @param {string}    title
 * @param {ReactNode} children
 */
export default function BottomSheet({ open, onClose, title, children }) {
  // Close on ESC
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────────────── */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            variants={BACKDROP}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={EASE}
            onClick={onClose}
          />

          {/* ── Sheet — mobile (bottom) ───────────────────────────────────── */}
          <motion.div
            key="sheet-mobile"
            className="fixed inset-x-0 bottom-0 z-50 safe-bottom md:hidden"
            variants={SHEET_MOB}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={SPRING}
          >
            <div className="bg-white rounded-t-ios-2xl shadow-ios-modal overflow-hidden">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-ios-gray3" />
              </div>

              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-5 py-3 border-b border-ios-separator/40">
                  <span className="font-semibold text-[17px] text-ios-label">{title}</span>
                  <button
                    onClick={onClose}
                    className="p-1.5 -mr-1 rounded-full text-ios-gray hover:bg-ios-bg transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="px-5 py-4 max-h-[80vh] overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>

          {/* ── Sheet — desktop (centered modal) ─────────────────────────── */}
          <div className="fixed inset-0 z-50 hidden md:flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              key="sheet-desktop"
              className="w-full max-w-md bg-white rounded-ios-2xl shadow-ios-modal overflow-hidden pointer-events-auto"
              variants={SHEET_DESK}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={SPRING}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-ios-separator/40">
                  <span className="font-semibold text-[17px] text-ios-label">{title}</span>
                  <button
                    onClick={onClose}
                    className="p-1.5 -mr-1 rounded-full text-ios-gray hover:bg-ios-bg transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
