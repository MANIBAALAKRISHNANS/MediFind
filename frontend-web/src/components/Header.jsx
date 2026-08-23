import { motion } from 'framer-motion'
import { Stethoscope } from 'lucide-react'

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm"
    >
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-medical-600 shadow-lg shadow-medical-600/30 shrink-0">
          <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-navy-900 leading-none">MediFind</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">AI-powered symptom checker</p>
        </div>
      </div>
    </motion.header>
  )
}
