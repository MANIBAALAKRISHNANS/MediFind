import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Home, ClipboardList, User, LogOut, X } from 'lucide-react'
import useAuthStore from '../store/authStore.js'

const BACKDROP = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
}
const DRAWER = {
  hidden:  { x: '-100%' },
  visible: { x: 0 },
  exit:    { x: '-100%' },
}
const SPRING = { type: 'spring', stiffness: 380, damping: 36, mass: 0.9 }

const NAV_ITEMS = [
  { icon: Home,          label: 'Home',    path: '/' },
  { icon: ClipboardList, label: 'History', path: '/history' },
  { icon: User,          label: 'Profile', path: '/profile' },
]

function Avatar({ name }) {
  const initials = (name ?? '?')
    .trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="w-11 h-11 rounded-full bg-medical-600 flex items-center justify-center shrink-0">
      <span className="font-display font-bold text-base text-white">{initials}</span>
    </div>
  )
}

export default function SideDrawer({ open, onClose }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = useAuthStore((s) => s.user)
  const logout    = useAuthStore((s) => s.logout)

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleNav(path) {
    navigate(path)
    onClose()
  }

  function handleLogout() {
    logout()
    onClose()
    toast.success('Signed out.')
    navigate('/login', { replace: true })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            variants={BACKDROP}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-ios-modal flex flex-col safe-top safe-bottom"
            variants={DRAWER}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={SPRING}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-ios-separator/40">
              <span className="font-display font-bold text-xl text-ios-label">MediFind</span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-ios-gray hover:bg-ios-bg transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="flex items-center gap-3 px-5 py-4 border-b border-ios-separator/40">
                <Avatar name={user.name} />
                <div className="min-w-0">
                  <p className="font-semibold text-[15px] text-ios-label truncate">{user.name}</p>
                  <p className="text-xs text-ios-gray truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav items */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
                const active = location.pathname === path ||
                  (path !== '/' && location.pathname.startsWith(path))
                return (
                  <button
                    key={path}
                    onClick={() => handleNav(path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-ios mb-1 transition-colors ${
                      active
                        ? 'bg-medical-50 text-medical-700'
                        : 'text-ios-secondLabel hover:bg-ios-bg'
                    }`}
                  >
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                    <span className={`text-[15px] ${active ? 'font-semibold' : 'font-medium'}`}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4 border-t border-ios-separator/40 pt-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-ios text-ios-red hover:bg-ios-red/5 transition-colors"
              >
                <LogOut size={20} />
                <span className="text-[15px] font-medium">Sign Out</span>
              </button>

              <div className="mt-3 px-4">
                <p className="text-xs text-ios-gray2">MediFind v1.0.0</p>
                <a
                  href="mailto:medifindofficial@gmail.com"
                  className="text-xs text-ios-blue hover:underline"
                >
                  medifindofficial@gmail.com
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
