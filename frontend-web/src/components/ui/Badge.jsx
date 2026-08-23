const VARIANT_CLASS = {
  mild:     'badge-mild',
  moderate: 'badge-moderate',
  severe:   'badge-severe',
  default:  'badge-default',
  success:  'bg-ios-green/15  text-ios-green',
  warning:  'bg-ios-orange/15 text-ios-orange',
  error:    'bg-ios-red/15    text-ios-red',
  info:     'bg-ios-blue/15   text-ios-blue',
  purple:   'bg-ios-purple/15 text-ios-purple',
}

/**
 * Small pill-shaped label / status chip.
 *
 * @param {'mild'|'moderate'|'severe'|'default'|'success'|'warning'|'error'|'info'|'purple'} variant
 */
export default function Badge({ variant = 'default', children, className = '' }) {
  const cls = VARIANT_CLASS[variant] ?? VARIANT_CLASS.default

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${cls} ${className}`}
    >
      {children}
    </span>
  )
}
