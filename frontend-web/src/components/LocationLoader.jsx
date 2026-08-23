import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

export default function LocationLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="ios-card flex flex-col items-center justify-center py-16 px-6"
    >
      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center mb-7">
        <motion.div
          className="absolute w-20 h-20 rounded-full border-2 border-medical-300"
          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute w-20 h-20 rounded-full border-2 border-medical-400"
          animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
        />
        <div className="w-16 h-16 rounded-[22px] bg-medical-50 flex items-center justify-center shadow-ios-card z-10">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MapPin size={32} className="text-medical-600" strokeWidth={1.75} />
          </motion.div>
        </div>
      </div>

      <p className="font-display font-semibold text-lg text-ios-label text-center">
        Getting your location…
      </p>
      <p className="text-ios-gray text-sm mt-2 text-center">
        We'll use this to find nearby hospitals
      </p>
    </motion.div>
  )
}
