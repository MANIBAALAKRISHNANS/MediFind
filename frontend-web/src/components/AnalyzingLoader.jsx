import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Stethoscope } from 'lucide-react'

const MESSAGES = [
  'Analyzing your symptoms…',
  'Consulting medical AI…',
  'Identifying conditions…',
  'Finalizing diagnosis…',
]

export default function AnalyzingLoader({ message }) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (message) return
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 2000)
    return () => clearInterval(id)
  }, [message])

  const displayMsg = message ?? MESSAGES[msgIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="ios-card flex flex-col items-center justify-center py-16 px-6"
    >
      {/* Pulsing icon */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-[28px] bg-medical-50 flex items-center justify-center mb-7 shadow-ios-card"
      >
        <Stethoscope size={40} className="text-medical-600" strokeWidth={1.75} />
      </motion.div>

      {/* Rotating message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={displayMsg}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="font-display font-semibold text-lg text-ios-label text-center"
        >
          {displayMsg}
        </motion.p>
      </AnimatePresence>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5 mt-5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-medical-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  )
}
