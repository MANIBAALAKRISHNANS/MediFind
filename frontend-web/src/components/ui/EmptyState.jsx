import Button from './Button.jsx'

/**
 * Centred empty-state placeholder.
 *
 * @param {ReactNode} icon        – large icon (pass a lucide component)
 * @param {string}    title       – primary message
 * @param {string}    description – secondary text
 * @param {{ label, onClick, variant }} action – optional CTA button
 */
export default function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}>
      {icon && (
        <div className="mb-5 p-5 rounded-full bg-ios-bg text-ios-gray2">
          {icon}
        </div>
      )}

      {title && (
        <h3 className="font-display font-semibold text-xl text-ios-label mb-2">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-ios-gray text-[15px] leading-relaxed max-w-xs">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          <Button
            variant={action.variant ?? 'primary'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}
