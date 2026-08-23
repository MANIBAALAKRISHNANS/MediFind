import { Loader2 } from 'lucide-react'

const SIZE = { sm: 16, md: 24, lg: 36 }

/**
 * Simple spinning loader using lucide's Loader2.
 *
 * @param {'sm'|'md'|'lg'} size
 * @param {string} color  – Tailwind text-color class, defaults to text-medical-600
 */
export default function Spinner({ size = 'md', color = 'text-medical-600', className = '' }) {
  return (
    <Loader2
      size={SIZE[size] ?? SIZE.md}
      className={`animate-spin ${color} ${className}`}
    />
  )
}
