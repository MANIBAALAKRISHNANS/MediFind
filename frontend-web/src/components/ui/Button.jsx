import { Loader2 } from 'lucide-react'

const VARIANT_CLASS = {
  primary:   'ios-button-primary',
  secondary: 'ios-button-secondary',
  danger:    'ios-button-danger',
  ghost:     'ios-button-ghost',
}

const SIZE_CLASS = {
  sm: 'text-sm  px-4  py-2.5',
  md: '',               // default — handled by .ios-button-* classes
  lg: 'text-base px-8  py-4',
}

/**
 * iOS-style button.
 *
 * @param {'primary'|'secondary'|'danger'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading  – shows spinner, disables interaction
 * @param {ReactNode} icon   – icon node placed before children
 */
export default function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  icon     = null,
  children,
  className = '',
  disabled,
  ...rest
}) {
  const base     = VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary
  const sizeExtra = SIZE_CLASS[size] ?? ''
  const isDisabled = disabled || loading

  return (
    <button
      className={`${base} ${sizeExtra} ${className}`}
      disabled={isDisabled}
      {...rest}
    >
      {loading
        ? <Loader2 size={18} className="animate-spin shrink-0" />
        : icon && <span className="shrink-0">{icon}</span>
      }
      {children && <span>{children}</span>}
    </button>
  )
}
