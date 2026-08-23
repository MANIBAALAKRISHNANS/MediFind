/**
 * iOS-style card container.
 *
 * @param {string}    title     – optional card header title
 * @param {ReactNode} footer    – optional footer rendered below a divider
 * @param {string}    className – extra Tailwind classes
 * @param {'card'|'lifted'} variant
 */
export default function Card({
  title,
  footer,
  className   = '',
  variant     = 'card',
  children,
}) {
  const base = variant === 'lifted' ? 'ios-card-lifted' : 'ios-card'

  return (
    <div className={`${base} overflow-hidden ${className}`}>
      {title && (
        <div className="px-5 pt-5 pb-3 border-b border-ios-separator/30">
          <h3 className="font-display font-semibold text-base text-ios-label">
            {title}
          </h3>
        </div>
      )}

      <div className={title ? 'px-5 py-4' : 'p-5'}>
        {children}
      </div>

      {footer && (
        <div className="px-5 pb-4 pt-2 border-t border-ios-separator/30">
          {footer}
        </div>
      )}
    </div>
  )
}
